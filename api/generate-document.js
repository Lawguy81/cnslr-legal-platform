// Serverless API for document generation
// Vercel Edge Function

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { taskType, formData, format = 'pdf' } = body;

    if (!taskType || !formData) {
      return new Response(JSON.stringify({ error: 'Missing taskType or formData' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const documentContent = generateDocumentContent(taskType, formData);

    return new Response(JSON.stringify({
      success: true,
      taskType,
      format,
      content: documentContent.html,
      filename: documentContent.filename,
      metadata: {
        generatedAt: new Date().toISOString(),
        taskType,
        jurisdiction: formData.jurisdiction || 'NY'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function generateDocumentContent(taskType, formData) {
  const generators = {
    'parking-ticket': generateParkingTicketAppeal,
    'small-claims': generateSmallClaimsForm,
    'demand-letter': generateDemandLetter,
    'name-change': generateNameChangePetition,
    'landlord-dispute': generateLandlordLetter
  };

  const generator = generators[taskType];
  if (!generator) {
    throw new Error('Unknown task type: ' + taskType);
  }

  return generator(formData);
}

function generateParkingTicketAppeal(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const html = '<!DOCTYPE html><html><head><style>body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6; max-width: 8.5in; margin: 0 auto; padding: 1in; } .header { text-align: center; margin-bottom: 2em; } .title { font-size: 14pt; font-weight: bold; text-transform: uppercase; } .section { margin-bottom: 1.5em; } .label { font-weight: bold; } .signature-line { border-top: 1px solid black; width: 250px; margin-top: 3em; padding-top: 0.5em; }</style></head><body><div class="header"><div class="title">PARKING VIOLATION APPEAL</div><div>City of ' + (data.city || 'New York') + '</div></div><div class="section"><p><span class="label">Date:</span> ' + today + '</p><p><span class="label">Ticket Number:</span> ' + (data.ticketNumber || '[TICKET NUMBER]') + '</p><p><span class="label">Violation Date:</span> ' + (data.violationDate || '[VIOLATION DATE]') + '</p><p><span class="label">Vehicle License Plate:</span> ' + (data.licensePlate || '[LICENSE PLATE]') + '</p></div><div class="section"><p>To Whom It May Concern:</p><p>I am writing to formally contest Parking Ticket #' + (data.ticketNumber || '[TICKET NUMBER]') + ' issued on ' + (data.violationDate || '[VIOLATION DATE]') + ' for the following reason:</p><p><strong>' + (data.contestReason || 'The signage was unclear or not visible') + '</strong></p></div><div class="section"><p><span class="label">Details of Contest:</span></p><p>' + (data.explanation || 'I respectfully request that this ticket be dismissed.') + '</p></div><div class="section"><p>I respectfully request that this violation be dismissed. Thank you.</p></div><div class="signature-line"><p>' + (data.fullName || '[YOUR NAME]') + '</p><p>' + (data.address || '[YOUR ADDRESS]') + '</p><p>' + (data.phone || '[YOUR PHONE]') + '</p><p>' + (data.email || '[YOUR EMAIL]') + '</p></div></body></html>';
  return { html, filename: 'parking-appeal-' + (data.ticketNumber || 'draft') + '.pdf' };
}

function generateSmallClaimsForm(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const html = '<!DOCTYPE html><html><head><style>body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6; max-width: 8.5in; margin: 0 auto; padding: 1in; } .header { text-align: center; margin-bottom: 2em; border-bottom: 2px solid black; padding-bottom: 1em; } .court-name { font-size: 14pt; font-weight: bold; text-transform: uppercase; } .party-box { border: 1px solid black; padding: 1em; margin: 1em 0; } .section { margin-bottom: 1.5em; } .label { font-weight: bold; } .amount { font-size: 14pt; font-weight: bold; } .signature-line { border-top: 1px solid black; width: 250px; padding-top: 0.5em; margin-top: 2em; }</style></head><body><div class="header"><div class="court-name">CIVIL COURT OF THE CITY OF NEW YORK</div><div>SMALL CLAIMS PART</div><div>County of ' + (data.county || 'New York') + '</div></div><div class="party-box"><p><span class="label">CLAIMANT:</span></p><p>' + (data.fullName || '[YOUR NAME]') + '</p><p>' + (data.address || '[ADDRESS]') + '</p><p>Phone: ' + (data.phone || '[PHONE]') + ' | Email: ' + (data.email || '[EMAIL]') + '</p></div><div style="text-align: center; font-weight: bold; margin: 1em 0;">- against -</div><div class="party-box"><p><span class="label">DEFENDANT:</span></p><p>' + (data.defendantName || '[DEFENDANT NAME]') + '</p><p>' + (data.defendantAddress || '[DEFENDANT ADDRESS]') + '</p></div><div class="section"><p><span class="label">AMOUNT CLAIMED:</span> <span class="amount">$' + (data.claimAmount || '0.00') + '</span></p></div><div class="section"><p><span class="label">NATURE OF CLAIM:</span></p><p>' + (data.claimType || 'Money owed') + '</p></div><div class="section"><p><span class="label">STATEMENT OF CLAIM:</span></p><p>' + (data.claimDescription || '[Describe your claim]') + '</p></div><div class="section"><p><span class="label">DATE OF INCIDENT:</span> ' + (data.incidentDate || '[DATE]') + '</p></div><p>I verify these statements are true.</p><div class="signature-line"><p>Signature</p><p>Date: ' + today + '</p></div></body></html>';
  return { html, filename: 'small-claims-' + (data.fullName || 'form').replace(/\s+/g, '-').toLowerCase() + '.pdf' };
}

function generateDemandLetter(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + (parseInt(data.responseDeadline) || 14));
  const deadlineStr = deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const html = '<!DOCTYPE html><html><head><style>body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.8; max-width: 8.5in; margin: 0 auto; padding: 1in; } .header { margin-bottom: 2em; } .recipient { margin-bottom: 2em; } .subject { font-weight: bold; text-transform: uppercase; margin-bottom: 1.5em; } .signature-block { margin-top: 3em; } .warning { font-weight: bold; margin-top: 1.5em; }</style></head><body><div class="header"><p>' + (data.fullName || '[YOUR NAME]') + '</p><p>' + (data.address || '[YOUR ADDRESS]') + '</p><p>' + (data.phone || '[PHONE]') + '</p><p>' + (data.email || '[EMAIL]') + '</p><p>' + today + '</p></div><div class="recipient"><p><strong>SENT VIA ' + (data.deliveryMethod || 'CERTIFIED MAIL') + '</strong></p><p>' + (data.recipientName || '[RECIPIENT NAME]') + '</p><p>' + (data.recipientAddress || '[RECIPIENT ADDRESS]') + '</p></div><div class="subject">RE: DEMAND FOR PAYMENT - $' + (data.amountOwed || '0.00') + '</div><p>Dear ' + (data.recipientName || 'Sir/Madam') + ':</p><p>This letter serves as a formal demand for payment of <strong>$' + (data.amountOwed || '0.00') + '</strong> which you owe for:</p><p><strong>Nature of Debt:</strong> ' + (data.debtReason || '[REASON]') + '</p><p><strong>Date Incurred:</strong> ' + (data.dateIncurred || '[DATE]') + '</p><p>' + (data.additionalDetails || 'This debt remains outstanding.') + '</p><p class="warning">DEMAND IS HEREBY MADE that you pay $' + (data.amountOwed || '0.00') + ' within ' + (data.responseDeadline || '14') + ' days, no later than ' + deadlineStr + '.</p><p>If payment is not received, I will pursue legal remedies including Small Claims Court.</p><div class="signature-block"><p>Sincerely,</p><br><p>_________________________</p><p>' + (data.fullName || '[YOUR NAME]') + '</p></div></body></html>';
  return { html, filename: 'demand-letter-' + (data.recipientName || 'draft').replace(/\s+/g, '-').toLowerCase() + '.pdf' };
}

function generateNameChangePetition(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const html = '<!DOCTYPE html><html><head><style>body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6; max-width: 8.5in; margin: 0 auto; padding: 1in; } .header { text-align: center; margin-bottom: 2em; } .court-name { font-size: 14pt; font-weight: bold; text-transform: uppercase; } .title { font-size: 14pt; font-weight: bold; margin: 1.5em 0; text-transform: uppercase; } .numbered-item { margin-left: 2em; margin-bottom: 1em; } .signature-line { border-top: 1px solid black; width: 300px; padding-top: 0.5em; margin-top: 2em; } .verification { margin-top: 2em; border-top: 1px solid black; padding-top: 1em; }</style></head><body><div class="header"><div class="court-name">' + (data.courtType === 'supreme' ? 'SUPREME COURT OF THE STATE OF NEW YORK' : 'CIVIL COURT OF THE CITY OF NEW YORK') + '</div><div>COUNTY OF ' + (data.county || 'NEW YORK').toUpperCase() + '</div></div><div style="text-align: center;"><p>In the Matter of the Application of</p><p><strong>' + (data.currentName || '[CURRENT NAME]') + '</strong></p><p>For Leave to Assume the Name of</p><p><strong>' + (data.newName || '[NEW NAME]') + '</strong></p></div><div class="title" style="text-align: center;">PETITION FOR NAME CHANGE</div><p>The Petition of ' + (data.currentName || '[CURRENT NAME]') + ' respectfully shows:</p><div class="numbered-item"><p><strong>1.</strong> Current legal name is <strong>' + (data.currentName || '[CURRENT NAME]') + '</strong>.</p></div><div class="numbered-item"><p><strong>2.</strong> Resides at ' + (data.address || '[ADDRESS]') + ', County of ' + (data.county || '[COUNTY]') + ', New York.</p></div><div class="numbered-item"><p><strong>3.</strong> Born on ' + (data.dateOfBirth || '[DOB]') + ' in ' + (data.placeOfBirth || '[BIRTHPLACE]') + '.</p></div><div class="numbered-item"><p><strong>4.</strong> SSN ends in ' + (data.ssnLast4 || 'XXXX') + '.</p></div><div class="numbered-item"><p><strong>5.</strong> Wishes to assume the name <strong>' + (data.newName || '[NEW NAME]') + '</strong>.</p></div><div class="numbered-item"><p><strong>6.</strong> Reason: ' + (data.reason || '[REASON]') + '.</p></div><p><strong>WHEREFORE</strong>, Petitioner requests an Order permitting the name change.</p><div class="signature-line"><p>Petitioner Signature</p><p>Date: ' + today + '</p></div><div class="verification"><p><strong>VERIFICATION</strong></p><p>STATE OF NEW YORK, COUNTY OF ' + (data.county || 'NEW YORK').toUpperCase() + '</p><p>I verify these statements are true.</p><div class="signature-line"><p>Petitioner</p></div><p>Sworn before me this ___ day of _______, 20___</p><div class="signature-line"><p>Notary Public</p></div></div></body></html>';
  return { html, filename: 'name-change-petition-' + (data.currentName || 'draft').replace(/\s+/g, '-').toLowerCase() + '.pdf' };
}

function generateLandlordLetter(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const issueDescriptions = {
    'repairs': 'failure to make necessary repairs',
    'security-deposit': 'return of security deposit',
    'habitability': 'conditions affecting habitability',
    'lease-violation': 'lease agreement violation',
    'harassment': 'landlord harassment',
    'other': data.otherIssue || 'the matter described below'
  };
  const html = '<!DOCTYPE html><html><head><style>body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.8; max-width: 8.5in; margin: 0 auto; padding: 1in; } .header { margin-bottom: 2em; } .recipient { margin-bottom: 2em; } .subject { font-weight: bold; text-transform: uppercase; margin-bottom: 1.5em; } .signature-block { margin-top: 3em; } .warning { font-weight: bold; background: #fff3cd; padding: 1em; margin: 1.5em 0; border-left: 4px solid #ffc107; } .legal-notice { font-size: 10pt; margin-top: 2em; padding: 1em; background: #f8f9fa; }</style></head><body><div class="header"><p>' + (data.fullName || '[YOUR NAME]') + '</p><p>' + (data.address || '[ADDRESS]') + '</p><p>Unit: ' + (data.unitNumber || '[UNIT]') + '</p><p>' + (data.phone || '[PHONE]') + '</p><p>' + (data.email || '[EMAIL]') + '</p><p>' + today + '</p></div><div class="recipient"><p><strong>SENT VIA CERTIFIED MAIL</strong></p><p>' + (data.landlordName || '[LANDLORD NAME]') + '</p><p>' + (data.landlordAddress || '[LANDLORD ADDRESS]') + '</p></div><div class="subject">RE: ' + (issueDescriptions[data.issueType] || 'TENANT COMPLAINT') + ' - ' + (data.address || '[PROPERTY]') + '</div><p>Dear ' + (data.landlordName || 'Landlord') + ':</p><p>I am writing regarding ' + (issueDescriptions[data.issueType] || 'an issue') + ' at the above property where I am a tenant under a ' + (data.leaseType || 'month-to-month') + ' lease starting ' + (data.leaseStartDate || '[DATE]') + '.</p><p><strong>Issue:</strong> ' + (data.issueDescription || '[DESCRIPTION]') + '</p><p><strong>Timeline:</strong> First reported ' + (data.firstReportDate || '[DATE]') + '. ' + (data.previousAttempts || 'Issue remains unresolved.') + '</p><p><strong>Requested Action:</strong> ' + (data.requestedAction || 'Please address this immediately.') + '</p><p><strong>Deadline:</strong> ' + (data.deadline || '14') + ' days from receipt.</p><p>If unresolved, I may file complaints with HPD, withhold rent, or pursue Housing Court action.</p><div class="signature-block"><p>Sincerely,</p><br><p>_________________________</p><p>' + (data.fullName || '[YOUR NAME]') + '</p><p>Tenant</p></div><div class="legal-notice"><p><strong>IMPORTANT:</strong> Keep copies of this letter and all communications.</p></div></body></html>';
  return { html, filename: 'landlord-letter-' + today.replace(/,?\s+/g, '-') + '.pdf' };
}
