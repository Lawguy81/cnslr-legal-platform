import { json } from '@vercel/edge';

// Configuration
const CONFIG = {
  NYC_DOF_ENDPOINT: process.env.NYC_DOF_DISPUTE_ENDPOINT || 'https://parkingtickets.nyc.gov/api/disputes',
  API_KEY: process.env.NYC_DOF_API_KEY,
  RATE_LIMIT: 100,
  RATE_LIMIT_WINDOW: 60000,
};

const rateLimitStore = new Map();

const DEFENSE_CODE_MAP = {
  'not_driver': 'NOT_DRIVER',
  'broken_meter': 'BROKEN_METER',
  'missing_sign': 'MISSING_SIGN',
  'wrong_plate': 'WRONG_PLATE',
  'stolen_vehicle': 'STOLEN_VEHICLE',
  'other': 'OTHER',
};

function checkRateLimit(ip) {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
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

function validateFields(body) {
  const required = ['ticketNumber','violationDate','licensePlate','contestReason','explanation','fullName','address','phone','email'];
  const errors = [];
  for (const field of required) {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (body.email && !emailRegex.test(body.email)) errors.push('Invalid email format');
  const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
  if (body.phone && !phoneRegex.test(body.phone)) errors.push('Invalid phone number format');
  if (body.ticketNumber && !/^[A-Z0-9]{8,10}$/.test(body.ticketNumber.toUpperCase())) errors.push('Invalid ticket number format');
  if (body.licensePlate && !/^[A-Z0-9]{2,8}$/.test(body.licensePlate.toUpperCase())) errors.push('Invalid license plate format');
  if (body.contestReason && !DEFENSE_CODE_MAP[body.contestReason.toLowerCase()]) {
    errors.push(`Invalid contest reason. Must be one of: ${Object.keys(DEFENSE_CODE_MAP).join(', ')}`);
  }
  if (body.violationDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.violationDate)) errors.push('Violation date must be in YYYY-MM-DD format');
  return { isValid: errors.length === 0, errors };
}

function formatPayload(body) {
  return {
    ticket_number: body.ticketNumber.toUpperCase(),
    plate_number: body.licensePlate.toUpperCase(),
    state: body.plateState || 'NY',
    violation_date: body.violationDate,
    defense_code: DEFENSE_CODE_MAP[body.contestReason.toLowerCase()],
    statement: body.explanation,
    contact_info: { name: body.fullName, address: body.address, phone: body.phone, email: body.email },
    evidence: body.hasEvidence ? { included: true, description: body.evidenceDescription || '' } : { included: false },
    document_html: body.documentHtml || null,
    submission_timestamp: new Date().toISOString(),
  };
}

async function submitToNYCDOF(payload) {
  try {
    const response = await fetch(CONFIG.NYC_DOF_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
        'User-Agent': 'VercelEdgeFunction/1.0',
        'X-Request-ID': crypto.randomUUID(),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`NYC DOF API error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to submit to NYC DOF: ${error.message}`);
  }
}

function generateConfirmationNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APPEAL-${timestamp}-${random}`;
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  if (request.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed', message: 'This endpoint only accepts POST requests' }, { status: 405 });
  }
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitCheck = checkRateLimit(ip);
  if (rateLimitCheck.isLimited) {
    return json({ success: false, error: 'Rate limit exceeded', message: 'Too many requests. Please try again later.', resetTime: new Date(rateLimitCheck.resetTime).toISOString() }, { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)), 'X-RateLimit-Remaining': String(rateLimitCheck.remaining), 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*' } });
  }
  try {
    let body;
    try { body = await request.json(); } catch {
      return json({ success: false, error: 'Invalid JSON', message: 'Request body must be valid JSON' }, { status: 400 });
    }
    const validation = validateFields(body);
    if (!validation.isValid) {
      return json({ success: false, error: 'Validation failed', errors: validation.errors }, { status: 400 });
    }
    const payload = formatPayload(body);
    let dofResponse;
    try { dofResponse = await submitToNYCDOF(payload); } catch (error) {
      return json({ success: false, error: 'Submission failed', message: error.message, timestamp: new Date().toISOString() }, { status: 502 });
    }
    const confirmationNumber = generateConfirmationNumber();
    const successResponse = {
      success: true,
      message: 'Your parking ticket appeal has been submitted successfully',
      confirmation: { confirmationNumber, timestamp: new Date().toISOString(), ticketNumber: body.ticketNumber, licensePlate: body.licensePlate, email: body.email },
      submission: { defenseCode: DEFENSE_CODE_MAP[body.contestReason.toLowerCase()], violationDate: body.violationDate, evidenceIncluded: body.hasEvidence || false },
      nextSteps: [
        'A confirmation email will be sent to ' + body.email,
        'Your appeal will be reviewed by NYC Department of Finance',
        'You can track your appeal status using confirmation number: ' + confirmationNumber,
        'Typical review time is 30-45 days',
      ],
      supportInfo: {
        trackingUrl: `https://parkingtickets.nyc.gov/status/${confirmationNumber}`,
        supportEmail: 'disputes@nycgov.parks.com',
        supportPhone: '1-888-NYC-TICK',
      },
    };
    return json(successResponse, {
      status: 200,
      headers: { 'X-RateLimit-Remaining': String(rateLimitCheck.remaining), 'X-Confirmation-Number': confirmationNumber, 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
    });
  } catch (error) {
    return json({ success: false, error: 'Internal server error', message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred', timestamp: new Date().toISOString() }, { status: 500, headers: { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*' } });
  }
}

