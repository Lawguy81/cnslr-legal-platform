// Serverless API for e-filing status and information
// New York State Courts Electronic Filing (NYSCEF) Integration Info

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      systems: getEfilingSystemsInfo(),
      supportedCourts: getSupportedCourts(),
      requirements: getFilingRequirements()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { action, documentType } = body;

      if (action === 'check-eligibility') {
        return new Response(JSON.stringify({
          eligible: true,
          system: 'NYSCEF',
          message: 'This case type is eligible for electronic filing in New York courts.',
          nextSteps: [
            'Create an account on NYSCEF (https://iapps.courts.state.ny.us/nyscef)',
            'Complete attorney/self-represented registration',
            'Upload your documents in PDF format',
            'Pay filing fees electronically',
            'Receive confirmation and index number'
          ]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (action === 'get-filing-info') {
        const filingInfo = getFilingInfoByType(documentType);
        return new Response(JSON.stringify(filingInfo), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'Unknown action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getEfilingSystemsInfo() {
  return {
    nyscef: {
      name: 'New York State Courts Electronic Filing (NYSCEF)',
      url: 'https://iapps.courts.state.ny.us/nyscef',
      description: 'The official e-filing system for New York State courts',
      supportedCaseTypes: ['Civil Supreme Court', 'Commercial Division', 'Surrogates Court', 'Court of Claims'],
      features: ['File documents 24/7', 'Automatic service on parties', 'View case documents online', 'Pay fees electronically']
    },
    nyc_efile: {
      name: 'NYC Civil Court E-Filing',
      url: 'https://www.nycourts.gov/courts/nyc/civil/',
      description: 'E-filing for NYC Civil Court matters',
      supportedCaseTypes: ['Small Claims', 'Housing Court', 'Civil Court'],
      note: 'Small Claims may have limited e-filing'
    }
  };
}

function getSupportedCourts() {
  return {
    newYork: [
      { name: 'NYC Small Claims Court', eFiling: 'limited', filingFee: { individual: '$15-$20', business: '$25-$50' }, claimLimit: '$10,000', website: 'https://www.nycourts.gov/courts/nyc/smallclaims/' },
      { name: 'NYC Civil Court', eFiling: true, filingFee: 'Varies by claim amount', claimLimit: '$25,000', website: 'https://www.nycourts.gov/courts/nyc/civil/' },
      { name: 'Supreme Court (Civil)', eFiling: true, system: 'NYSCEF', filingFee: '$210 (RJI) + index number fee', note: 'Required for claims over $25,000' },
      { name: 'Housing Court', eFiling: 'limited', website: 'https://www.nycourts.gov/courts/nyc/housing/' }
    ]
  };
}

function getFilingRequirements() {
  return {
    general: ['Documents must be in PDF format', 'Maximum file size: 25MB per document', 'Documents must be text-searchable', 'Proper naming convention required'],
    selfRepresented: ['Create NYSCEF account as Self-Represented filer', 'Provide valid email for service', 'Complete required affidavit of service', 'Keep copies of all filed documents'],
    fees: { note: 'Filing fees vary by court and case type', paymentMethods: ['Credit Card', 'Debit Card', 'E-Check'], feeWaiver: 'Available for those who qualify (IFP application)' }
  };
}

function getFilingInfoByType(documentType) {
  const filingInfo = {
    'parking-ticket': {
      court: 'NYC Parking Violations Bureau',
      eFilingAvailable: true,
      website: 'https://www.nyc.gov/site/finance/vehicles/services-dispute-a-parking-ticket.page',
      process: ['Appeal online through NYC Finance website', 'Upload evidence/photos', 'Receive decision by mail/email'],
      deadline: '30 days from ticket date',
      fee: 'No fee to contest'
    },
    'small-claims': {
      court: 'NYC Small Claims Court',
      eFilingAvailable: 'limited',
      website: 'https://www.nycourts.gov/courts/nyc/smallclaims/',
      process: ['File in person at courthouse', 'Pay filing fee', 'Receive court date', 'Serve defendant', 'Appear at hearing'],
      fee: '$15-$20 (individual), $25-$50 (business)',
      limit: '$10,000'
    },
    'demand-letter': {
      court: 'N/A - Pre-litigation',
      eFilingAvailable: false,
      process: ['Send via certified mail with return receipt', 'Keep copy for records', 'Wait for response deadline', 'File lawsuit if no response'],
      tip: 'A properly drafted demand letter often resolves disputes without court'
    },
    'name-change': {
      court: 'Civil Court or Supreme Court',
      eFilingAvailable: true,
      system: 'NYSCEF',
      website: 'https://www.nycourts.gov/courthelp/namechange/basics.shtml',
      process: ['File petition and required documents', 'Pay filing fee ($65-$210)', 'Publish in newspaper (if required)', 'Attend court hearing', 'Receive court order'],
      documents: ['Petition for Name Change', 'Consent forms (if applicable)', 'Birth certificate copy', 'Photo ID']
    },
    'landlord-dispute': {
      court: 'NYC Housing Court',
      eFilingAvailable: 'limited',
      website: 'https://www.nycourts.gov/courts/nyc/housing/',
      alternativeResources: ['NYC 311 - File HPD complaint', 'NYC Tenant Helpline: 311', 'Legal Aid Society', 'Housing Court Help Center'],
      process: ['Document issues with photos', 'Send written notice to landlord', 'File HP Action in Housing Court', 'Attend court hearing']
    }
  };

  return filingInfo[documentType] || {
    message: 'Filing information not available for this document type',
    recommendation: 'Consult with a legal professional or court clerk'
  };
}
