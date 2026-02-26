import { json } from '@vercel/edge';

const CONFIG = {
  NYC_DOF_ENDPOINT: process.env.NYC_DOF_STATUS_ENDPOINT || 'https://parkingtickets.nyc.gov/api/disputes/status',
  API_KEY: process.env.NYC_DOF_API_KEY,
  RATE_LIMIT: 200,
  RATE_LIMIT_WINDOW: 60000,
  CACHE_TTL: 300000,
};

const rateLimitStore = new Map();
const statusCache = new Map();

const STATUS_STATES = {
  SUBMITTED: 'submitted',
  RECEIVED: 'received',
  UNDER_REVIEW: 'under_review',
  DECISION_PENDING: 'decision_pending',
  APPROVED: 'approved',
  DENIED: 'denied',
  DISMISSED: 'dismissed',
  WITHDRAWN: 'withdrawn',
};

const STATUS_DESCRIPTIONS = {
  [STATUS_STATES.SUBMITTED]: 'Your appeal has been submitted and is in our system',
  [STATUS_STATES.RECEIVED]: 'Your appeal has been received by NYC DOF',
  [STATUS_STATES.UNDER_REVIEW]: 'Your appeal is currently under review',
  [STATUS_STATES.DECISION_PENDING]: 'Decision is pending - review should be completed soon',
  [STATUS_STATES.APPROVED]: 'Your appeal has been approved. The ticket will be dismissed.',
  [STATUS_STATES.DENIED]: 'Your appeal has been denied. The ticket penalty remains valid.',
  [STATUS_STATES.DISMISSED]: 'Your appeal has been dismissed.',
  [STATUS_STATES.WITHDRAWN]: 'Your appeal has been withdrawn.',
};
function checkRateLimit(ip) {
  const now = Date.now();
  const key = `rate_limit_status_${ip}`;
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 0, resetTime: now + CONFIG.RATE_LIMIT_WINDOW });
  }
  const record = rateLimitStore.get(key);
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + CONFIG.RATE_LIMIT_WINDOW;
  }
  record.count++;
  return {
    isLimited: record.count > CONFIG.RATE_LIMIT,
    remaining: Math.max(0, CONFIG.RATE_LIMIT - record.count),
    resetTime: record.resetTime,
  };
}

function validateRequest(params) {
  const errors = [];
  if (!params.confirmationNumber && !params.ticketNumber) {
    errors.push('Either confirmationNumber or ticketNumber is required');
  }
  if (params.confirmationNumber && !/^APPEAL-[A-Z0-9]{8,}$/.test(params.confirmationNumber)) {
    errors.push('Invalid confirmation number format');
  }
  if (params.ticketNumber && !/^[A-Z0-9]{8,10}$/.test(params.ticketNumber.toUpperCase())) {
    errors.push('Invalid ticket number format');
  }
  return { isValid: errors.length === 0, errors };
}
async function getAppealStatus(confirmationNumber, ticketNumber) {
  const cacheKey = `status_${confirmationNumber || ticketNumber}`;
  const now = Date.now();
  if (statusCache.has(cacheKey)) {
    const cached = statusCache.get(cacheKey);
    if (now - cached.fetchTime < CONFIG.CACHE_TTL) {
      return { data: cached.data, fromCache: true };
    }
  }
  try {
    const queryParams = new URLSearchParams();
    if (confirmationNumber) queryParams.append('confirmation_number', confirmationNumber);
    if (ticketNumber) queryParams.append('ticket_number', ticketNumber.toUpperCase());
    const response = await fetch(`${CONFIG.NYC_DOF_ENDPOINT}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
        'User-Agent': 'VercelEdgeFunction/1.0',
        'X-Request-ID': crypto.randomUUID(),
      },
    });
    if (!response.ok) {
      if (response.status === 404) throw new Error('Appeal not found');
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`NYC DOF API error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    statusCache.set(cacheKey, { data, fetchTime: now });
    return { data, fromCache: false };
  } catch (error) {
    throw new Error(`Failed to fetch appeal status: ${error.message}`);
  }
}
function formatStatusResponse(data, isFromCache) {
  const status = data.status || STATUS_STATES.SUBMITTED;
  const isResolved = [STATUS_STATES.APPROVED, STATUS_STATES.DENIED, STATUS_STATES.DISMISSED, STATUS_STATES.WITHDRAWN].includes(status);
  const response = {
    success: true, status,
    description: STATUS_DESCRIPTIONS[status] || 'Status unknown',
    isResolved,
    ticketNumber: data.ticket_number || null,
    confirmationNumber: data.confirmation_number || null,
    submittedDate: data.submitted_date || null,
    lastUpdated: data.last_updated || null,
    sourceIsCache: isFromCache,
  };
  if (data.decision) {
    response.decision = { type: data.decision.type, reason: data.decision.reason || null, date: data.decision.date || null };
  }
  if (data.violation_info) {
    response.violationInfo = { violationCode: data.violation_info.code || null, description: data.violation_info.description || null, fineAmount: data.violation_info.fine_amount || null, location: data.violation_info.location || null };
  }
  response.nextSteps = getNextSteps(status);
  response.support = { email: 'disputes@nycgov.parks.com', phone: '1-888-NYC-TICK', website: 'https://parkingtickets.nyc.gov' };
  return response;
}

function getNextSteps(status) {
  const steps = {
    [STATUS_STATES.SUBMITTED]: ['Your appeal is being processed', 'You will receive email updates', 'Check back here for status updates'],
    [STATUS_STATES.RECEIVED]: ['Your submission was confirmed by NYC DOF', 'Your appeal will be reviewed within 2-3 weeks'],
    [STATUS_STATES.UNDER_REVIEW]: ['Your appeal is currently being evaluated', 'Decision should be made within 2-3 weeks'],
    [STATUS_STATES.DECISION_PENDING]: ['Your case is in final review stages', 'Check back within a few days'],
    [STATUS_STATES.APPROVED]: ['Congratulations! Your appeal was approved', 'The parking ticket will be dismissed'],
    [STATUS_STATES.DENIED]: ['Your appeal was denied', 'You can request a hearing within 10 days'],
    [STATUS_STATES.DISMISSED]: ['Your appeal has been dismissed', 'Contact NYC DOF if this was an error'],
    [STATUS_STATES.WITHDRAWN]: ['Your appeal has been withdrawn', 'You can submit a new appeal'],
  };
  return steps[status] || ['Contact NYC DOF for more information'];
}
export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' } });
  }
  if (request.method !== 'GET') {
    return json({ success: false, error: 'Method not allowed', message: 'This endpoint only accepts GET requests' }, { status: 405 });
  }
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitCheck = checkRateLimit(ip);
  if (rateLimitCheck.isLimited) {
    return json({ success: false, error: 'Rate limit exceeded', message: 'Too many requests.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)), 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*' } });
  }
  try {
    const url = new URL(request.url);
    const confirmationNumber = url.searchParams.get('confirmationNumber');
    const ticketNumber = url.searchParams.get('ticketNumber');
    const validation = validateRequest({ confirmationNumber, ticketNumber });
    if (!validation.isValid) {
      return json({ success: false, error: 'Validation failed', errors: validation.errors }, { status: 400 });
    }
    let statusResult;
    try {
      statusResult = await getAppealStatus(confirmationNumber, ticketNumber);
    } catch (error) {
      if (error.message.includes('not found')) {
        return json({ success: false, error: 'Appeal not found', message: 'No appeal found with the provided number' }, { status: 404 });
      }
      return json({ success: false, error: 'Status lookup failed', message: error.message }, { status: 502 });
    }
    const response = formatStatusResponse(statusResult.data, statusResult.fromCache);
    return json(response, {
      status: 200,
      headers: { 'X-RateLimit-Remaining': String(rateLimitCheck.remaining), 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Cache-Control': statusResult.fromCache ? `public, max-age=${CONFIG.CACHE_TTL / 1000}` : 'no-cache', 'X-Cache': statusResult.fromCache ? 'HIT' : 'MISS' },
    });
  } catch (error) {
    return json({ success: false, error: 'Internal server error', message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred' }, { status: 500, headers: { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*' } });
  }
}
