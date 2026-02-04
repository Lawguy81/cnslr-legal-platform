const PDFDocument = require('pdfkit');

const documentTemplates = {
  'parking-ticket': generateParkingTicketAppeal,
  'small-claims': generateSmallClaimsFiling,
  'demand-letter': generateDemandLetter,
  'name-change': generateNameChangePetition,
  'landlord-dispute': generateLandlordDisputeLetter
};

async function generatePDF(taskId, formData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 72 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      const generator = documentTemplates[taskId];
      if (generator) {
        generator(doc, formData);
      } else {
        generateGenericDocument(doc, taskId, formData);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function addHeader(doc, title, subtitle = null) {
  doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'center' });
  if (subtitle) {
    doc.fontSize(12).font('Helvetica').text(subtitle, { align: 'center' });
  }
  doc.moveDown(2);
}

function addSection(doc, title, content) {
  doc.fontSize(14).font('Helvetica-Bold').text(title);
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica').text(content);
  doc.moveDown(1.5);
}

function addField(doc, label, value) {
  doc.fontSize(10).font('Helvetica-Bold').text(`${label}: `, { continued: true });
  doc.font('Helvetica').text(value || '___________________');
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function generateParkingTicketAppeal(doc, data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  addHeader(doc, 'PARKING TICKET APPEAL', 'Request for Administrative Review');

  doc.fontSize(11).font('Helvetica');
  doc.text(`Date: ${today}`);
  doc.text(`Citation Number: ${data.ticketNumber || 'N/A'}`);
  doc.moveDown(2);

  doc.text('To Whom It May Concern:');
  doc.moveDown();

  doc.text(
    `I am writing to formally contest Parking Citation #${data.ticketNumber}, issued on ${formatDate(data.ticketDate)} at approximately ${data.ticketTime || 'N/A'} for the alleged violation of ${data.violationType?.replace(/-/g, ' ') || 'parking regulations'}.`,
    { align: 'justify' }
  );
  doc.moveDown();

  doc.text('VEHICLE INFORMATION:', { underline: true });
  doc.moveDown(0.5);
  doc.text(`License Plate: ${data.vehiclePlate || 'N/A'}`);
  doc.text(`Vehicle: ${data.vehicleMake || 'N/A'}`);
  doc.text(`Location: ${data.location || 'N/A'}`);
  doc.text(`Fine Amount: $${data.fineAmount || 'N/A'}`);
  doc.moveDown();

  doc.text('REASON FOR APPEAL:', { underline: true });
  doc.moveDown(0.5);

  const defenseReasons = {
    'signage': 'The signage at this location was missing, obscured, or unclear',
    'meter-malfunction': 'The parking meter was malfunctioning and would not accept payment',
    'medical-emergency': 'There was a medical emergency that required immediate attention',
    'factual-error': 'The citation contains factual errors',
    'permit-valid': 'I had a valid parking permit that was not properly recognized',
    'vehicle-breakdown': 'My vehicle experienced a mechanical breakdown',
    'other': 'Other circumstances as described below'
  };

  doc.text(defenseReasons[data.defenseType] || 'I believe this citation was issued in error.');
  doc.moveDown();

  doc.text('DETAILED EXPLANATION:', { underline: true });
  doc.moveDown(0.5);
  doc.text(data.circumstances || 'Please see attached documentation.', { align: 'justify' });
  doc.moveDown();

  if (data.defenseDetails) {
    doc.text(data.defenseDetails, { align: 'justify' });
    doc.moveDown();
  }

  doc.text('SUPPORTING EVIDENCE:', { underline: true });
  doc.moveDown(0.5);
  doc.text(`Photographs: ${data.hasPhotos === 'yes' ? 'Yes (attached)' : 'Not available'}`);
  doc.text(`Documents/Receipts: ${data.hasReceipts === 'yes' ? 'Yes (attached)' : 'Not available'}`);
  if (data.witnessInfo) {
    doc.text(`Witness Information: ${data.witnessInfo}`);
  }
  doc.moveDown();

  doc.text('REQUEST:', { underline: true });
  doc.moveDown(0.5);
  doc.text(
    'Based on the facts and circumstances described above, I respectfully request that this citation be dismissed, or in the alternative, that the fine be reduced.',
    { align: 'justify' }
  );
  doc.moveDown(2);

  doc.text('Thank you for your consideration of this appeal.');
  doc.moveDown(2);

  doc.text('Respectfully submitted,');
  doc.moveDown(2);
  doc.text('_________________________________');
  doc.text('Signature');
  doc.moveDown();
  doc.text('_________________________________');
  doc.text('Printed Name');
  doc.moveDown();
  doc.text(`Date: ${today}`);

  // Footer
  doc.moveDown(3);
  doc.fontSize(8).fillColor('#666666');
  doc.text('Generated by CNSLR Legal Platform | This document should be reviewed for accuracy before submission', { align: 'center' });
}

function generateSmallClaimsFiling(doc, data) {
  addHeader(doc, 'SMALL CLAIMS COURT', 'Plaintiff\'s Claim and ORDER to Go to Small Claims Court');

  doc.fontSize(10).font('Helvetica');

  // Case info box
  doc.text('CASE NUMBER: _____________________', { align: 'right' });
  doc.moveDown(2);

  doc.font('Helvetica-Bold').text('PLAINTIFF (Person filing claim):');
  doc.font('Helvetica');
  doc.text(`Name: ${data.plaintiffName || '___________________________'}`);
  doc.text(`Address: ${data.plaintiffAddress || '___________________________'}`);
  doc.text(`City, State, ZIP: ${data.plaintiffCity || ''}, ${data.plaintiffState || ''} ${data.plaintiffZip || ''}`);
  doc.text(`Phone: ${data.plaintiffPhone || '___________________________'}`);
  doc.text(`Email: ${data.plaintiffEmail || '___________________________'}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text('DEFENDANT (Person being sued):');
  doc.font('Helvetica');
  doc.text(`Name: ${data.defendantName || '___________________________'}`);
  doc.text(`Address: ${data.defendantAddress || '___________________________'}`);
  doc.text(`City, State, ZIP: ${data.defendantCity || ''}, ${data.defendantState || ''} ${data.defendantZip || ''}`);
  doc.moveDown(2);

  doc.font('Helvetica-Bold').text('CLAIM DETAILS:');
  doc.moveDown(0.5);
  doc.font('Helvetica');

  const claimTypes = {
    'unpaid-debt': 'Money owed (unpaid debt)',
    'property-damage': 'Property damage',
    'security-deposit': 'Security deposit',
    'defective-product': 'Defective product or service',
    'contract-breach': 'Breach of contract',
    'other': 'Other'
  };

  doc.text(`Type of Claim: ${claimTypes[data.claimCategory] || data.claimCategory}`);
  doc.text(`Date of Incident: ${formatDate(data.incidentDate)}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text('AMOUNT CLAIMED:');
  doc.font('Helvetica');
  doc.text(`Principal Amount: $${data.amountOwed || '0.00'}`);
  doc.text(`Additional Costs: $${data.additionalCosts || '0.00'}`);
  doc.text(`Interest Claimed: ${data.interestClaimed === 'yes' ? 'Yes' : 'No'}`);
  doc.font('Helvetica-Bold');
  doc.text(`TOTAL CLAIM: $${(parseFloat(data.amountOwed || 0) + parseFloat(data.additionalCosts || 0)).toFixed(2)}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text('DESCRIPTION OF CLAIM:');
  doc.moveDown(0.5);
  doc.font('Helvetica');
  doc.text(data.claimDescription || 'See attached documentation.', { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text('PRIOR DEMAND:');
  doc.font('Helvetica');
  doc.text(`Demand made before filing: ${data.demandMade === 'yes' ? 'Yes' : 'No'}`);
  if (data.demandDetails) {
    doc.text(data.demandDetails, { align: 'justify' });
  }
  doc.moveDown();

  doc.font('Helvetica-Bold').text('BASIS FOR DAMAGES:');
  doc.font('Helvetica');
  doc.text(data.damagesExplanation || 'See above.', { align: 'justify' });
  doc.moveDown(2);

  // Declaration
  doc.font('Helvetica-Bold').text('DECLARATION');
  doc.font('Helvetica');
  doc.text(
    'I declare under penalty of perjury under the laws of this state that the foregoing is true and correct.',
    { align: 'justify' }
  );
  doc.moveDown(2);

  doc.text('_________________________________     _________________');
  doc.text('Plaintiff\'s Signature                              Date');

  // Footer
  doc.moveDown(3);
  doc.fontSize(8).fillColor('#666666');
  doc.text('Generated by CNSLR Legal Platform | Review local court requirements before filing', { align: 'center' });
}

function generateDemandLetter(doc, data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Sender info (right aligned)
  doc.fontSize(11).font('Helvetica');
  doc.text(data.senderName || '[Your Name]', { align: 'right' });
  doc.text(data.senderAddress || '[Your Address]', { align: 'right' });
  doc.text(`${data.senderCity || ''}, ${data.senderState || ''} ${data.senderZip || ''}`, { align: 'right' });
  doc.text(data.senderPhone || '[Phone]', { align: 'right' });
  doc.text(data.senderEmail || '[Email]', { align: 'right' });
  doc.moveDown();
  doc.text(today, { align: 'right' });
  doc.moveDown(2);

  // Recipient info
  doc.text(data.recipientName || '[Recipient Name]');
  if (data.recipientCompany) {
    doc.text(data.recipientCompany);
  }
  doc.text(data.recipientAddress || '[Recipient Address]');
  doc.text(`${data.recipientCity || ''}, ${data.recipientState || ''} ${data.recipientZip || ''}`);
  doc.moveDown(2);

  // Subject line
  const subjects = {
    'payment': 'FORMAL DEMAND FOR PAYMENT',
    'action': 'FORMAL DEMAND FOR ACTION',
    'cease-desist': 'CEASE AND DESIST DEMAND',
    'refund': 'FORMAL DEMAND FOR REFUND'
  };

  doc.font('Helvetica-Bold').text(`Re: ${subjects[data.demandType] || 'FORMAL DEMAND'}`, { underline: true });
  doc.moveDown();

  doc.font('Helvetica').text(`Dear ${data.recipientName || 'Sir/Madam'},`);
  doc.moveDown();

  // Opening
  doc.text(
    'This letter serves as a formal demand pursuant to applicable law. Please treat this matter with the utmost seriousness.',
    { align: 'justify' }
  );
  doc.moveDown();

  // Background
  doc.font('Helvetica-Bold').text('BACKGROUND:');
  doc.font('Helvetica');
  doc.text(data.backgroundFacts || '[Background facts to be provided]', { align: 'justify' });
  doc.moveDown();

  // Demand
  doc.font('Helvetica-Bold').text('DEMAND:');
  doc.font('Helvetica');
  doc.text(data.specificDemand || '[Specific demand to be provided]', { align: 'justify' });
  doc.moveDown();

  if (data.amountDemanded) {
    doc.font('Helvetica-Bold').text(`Amount Demanded: $${data.amountDemanded}`);
    doc.moveDown();
  }

  // Deadline
  doc.font('Helvetica-Bold').text('DEADLINE:');
  doc.font('Helvetica');
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + parseInt(data.deadlineDays || 14));
  doc.text(
    `You must comply with this demand within ${data.deadlineDays || 14} days of receipt of this letter, no later than ${deadlineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.`,
    { align: 'justify' }
  );
  doc.moveDown();

  // Consequence
  doc.font('Helvetica-Bold').text('CONSEQUENCES OF NON-COMPLIANCE:');
  doc.font('Helvetica');
  doc.text(data.consequenceWarning || 'Failure to comply with this demand will result in further legal action.', { align: 'justify' });
  doc.moveDown();

  // Closing
  doc.text(
    'Please govern yourself accordingly. I expect your prompt attention to this matter.',
    { align: 'justify' }
  );
  doc.moveDown(2);

  doc.text('Sincerely,');
  doc.moveDown(2);
  doc.text('_________________________________');
  doc.text(data.senderName || '[Your Name]');

  // Footer
  doc.moveDown(3);
  doc.fontSize(8).fillColor('#666666');
  doc.text('SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED', { align: 'center' });
  doc.text('Generated by CNSLR Legal Platform', { align: 'center' });
}

function generateNameChangePetition(doc, data) {
  addHeader(doc, 'PETITION FOR CHANGE OF NAME', 'In the Matter of the Application of');

  doc.fontSize(12).font('Helvetica-Bold');
  doc.text(`${data.currentFirstName || ''} ${data.currentMiddleName || ''} ${data.currentLastName || ''}`, { align: 'center' });
  doc.font('Helvetica').fontSize(11);
  doc.text('Petitioner', { align: 'center' });
  doc.moveDown(2);

  doc.text('TO THE HONORABLE COURT:');
  doc.moveDown();

  doc.text(
    `Petitioner respectfully represents to the Court as follows:`,
    { align: 'justify' }
  );
  doc.moveDown();

  // Numbered paragraphs
  let paragraph = 1;

  doc.text(`${paragraph}. Petitioner's current legal name is ${data.currentFirstName || ''} ${data.currentMiddleName || ''} ${data.currentLastName || ''}.`);
  doc.moveDown(0.5);
  paragraph++;

  doc.text(`${paragraph}. Petitioner was born on ${formatDate(data.dateOfBirth)} in ${data.birthPlace || '[City, State]'}.`);
  doc.moveDown(0.5);
  paragraph++;

  doc.text(`${paragraph}. Petitioner currently resides at ${data.currentAddress || ''}, ${data.currentCity || ''}, ${data.currentState || ''} ${data.currentZip || ''}, and has resided there for ${data.yearsAtAddress || '___'} year(s).`);
  doc.moveDown(0.5);
  paragraph++;

  doc.text(`${paragraph}. Petitioner desires to change their legal name to: ${data.newFirstName || ''} ${data.newMiddleName || ''} ${data.newLastName || ''}.`);
  doc.moveDown(0.5);
  paragraph++;

  const reasons = {
    'marriage': 'marriage',
    'divorce': 'divorce and desire to return to former name',
    'personal': 'personal preference',
    'gender': 'gender identity',
    'religious': 'religious or cultural reasons',
    'other': 'the following reason'
  };

  doc.text(`${paragraph}. The reason for this name change is ${reasons[data.reasonCategory] || 'as follows'}:`);
  doc.moveDown(0.5);
  doc.text(data.reasonExplanation || '[Explanation to be provided]', { indent: 36, align: 'justify' });
  doc.moveDown(0.5);
  paragraph++;

  doc.text(`${paragraph}. This name change is not sought for any fraudulent purpose, to escape debts, or for any illegal purpose.`);
  doc.moveDown(0.5);
  paragraph++;

  doc.text(`${paragraph}. Petitioner ${data.hasFelony === 'yes' ? 'has' : 'has not'} been convicted of a felony.`);
  if (data.hasFelony === 'yes' && data.felonyDetails) {
    doc.text(data.felonyDetails, { indent: 36 });
  }
  doc.moveDown(0.5);
  paragraph++;

  doc.text(`${paragraph}. Petitioner ${data.hasBankruptcy === 'yes' ? 'has' : 'has not'} filed for bankruptcy in the past 7 years.`);
  doc.moveDown(0.5);
  paragraph++;

  doc.text(`${paragraph}. Petitioner ${data.hasChildSupport === 'yes' ? 'has' : 'does not have'} outstanding child support obligations.`);
  doc.moveDown();

  // Prayer
  doc.font('Helvetica-Bold').text('WHEREFORE, Petitioner prays that this Court:');
  doc.font('Helvetica');
  doc.text('1. Grant this Petition for Change of Name;');
  doc.text(`2. Order that Petitioner's name be changed from ${data.currentFirstName || ''} ${data.currentMiddleName || ''} ${data.currentLastName || ''} to ${data.newFirstName || ''} ${data.newMiddleName || ''} ${data.newLastName || ''};`);
  doc.text('3. Grant such other and further relief as the Court deems just and proper.');
  doc.moveDown(2);

  // Verification
  doc.font('Helvetica-Bold').text('VERIFICATION');
  doc.font('Helvetica');
  doc.text(
    'I declare under penalty of perjury that the foregoing is true and correct.',
    { align: 'justify' }
  );
  doc.moveDown(2);

  doc.text('_________________________________     _________________');
  doc.text('Petitioner\'s Signature                              Date');
  doc.moveDown();
  doc.text(`Printed Name: ${data.currentFirstName || ''} ${data.currentMiddleName || ''} ${data.currentLastName || ''}`);

  // Footer
  doc.moveDown(3);
  doc.fontSize(8).fillColor('#666666');
  doc.text('Generated by CNSLR Legal Platform | Check local court requirements for filing procedures', { align: 'center' });
}

function generateLandlordDisputeLetter(doc, data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  doc.fontSize(11).font('Helvetica');
  doc.text(today);
  doc.moveDown();

  doc.text('SENT VIA CERTIFIED MAIL');
  doc.text('RETURN RECEIPT REQUESTED');
  doc.moveDown();

  doc.text(data.landlordName || '[Landlord Name]');
  doc.text(data.landlordAddress || '[Landlord Address]');
  doc.moveDown();

  const subjects = {
    'repairs': 'FORMAL NOTICE: REQUEST FOR REPAIRS',
    'deposit': 'FORMAL NOTICE: SECURITY DEPOSIT DEMAND',
    'habitability': 'FORMAL NOTICE: HABITABILITY ISSUES',
    'privacy': 'FORMAL NOTICE: PRIVACY VIOLATION',
    'lease-violation': 'FORMAL NOTICE: LEASE VIOLATION',
    'illegal-fees': 'FORMAL NOTICE: ILLEGAL FEES',
    'other': 'FORMAL NOTICE: LANDLORD-TENANT DISPUTE'
  };

  doc.font('Helvetica-Bold').text(`Re: ${subjects[data.disputeCategory] || 'FORMAL NOTICE'}`);
  doc.text(`Property: ${data.rentalAddress || ''}, ${data.unitNumber ? `Unit ${data.unitNumber}, ` : ''}${data.rentalCity || ''}, ${data.rentalState || ''} ${data.rentalZip || ''}`);
  doc.moveDown();

  doc.font('Helvetica').text(`Dear ${data.landlordName || 'Landlord'},`);
  doc.moveDown();

  doc.text(
    `I am the tenant at the above-referenced property. My lease commenced on ${formatDate(data.leaseStartDate)}, and my current monthly rent is $${data.monthlyRent || 'N/A'}.`,
    { align: 'justify' }
  );
  doc.moveDown();

  doc.text(
    `This letter serves as formal notice regarding the following issue that first arose on ${formatDate(data.issueStartDate)}:`,
    { align: 'justify' }
  );
  doc.moveDown();

  doc.font('Helvetica-Bold').text('DESCRIPTION OF ISSUE:');
  doc.font('Helvetica');
  doc.text(data.issueDescription || '[Issue description to be provided]', { align: 'justify' });
  doc.moveDown();

  if (data.previousNotice !== 'no') {
    doc.text(
      `Please be advised that I previously notified you of this issue ${data.previousNotice === 'yes-written' ? 'in writing' : 'verbally'} on ${formatDate(data.noticeDate) || 'a prior date'}.`,
      { align: 'justify' }
    );
    if (data.landlordResponse) {
      doc.text(`Your response was: ${data.landlordResponse}`, { align: 'justify' });
    }
    doc.moveDown();
  }

  doc.font('Helvetica-Bold').text('REQUESTED RESOLUTION:');
  doc.font('Helvetica');
  doc.text(data.desiredResolution || '[Resolution to be specified]', { align: 'justify' });
  doc.moveDown();

  doc.text(
    'Please respond to this notice within 14 days. Failure to address this matter may result in further action, including but not limited to: filing a complaint with the local housing authority, withholding rent as permitted by law, or pursuing legal remedies in court.',
    { align: 'justify' }
  );
  doc.moveDown();

  doc.text(
    'I am prepared to resolve this matter amicably and look forward to your prompt response.',
    { align: 'justify' }
  );
  doc.moveDown(2);

  doc.text('Sincerely,');
  doc.moveDown(2);
  doc.text('_________________________________');
  doc.text(data.tenantName || '[Tenant Name]');
  doc.moveDown();
  doc.text(`${data.rentalAddress || ''}, ${data.unitNumber ? `Unit ${data.unitNumber}` : ''}`);
  doc.text(`${data.rentalCity || ''}, ${data.rentalState || ''} ${data.rentalZip || ''}`);

  // Footer
  doc.moveDown(3);
  doc.fontSize(8).fillColor('#666666');
  doc.text('CC: File Copy', { align: 'left' });
  doc.text('Generated by CNSLR Legal Platform | Keep a copy of this letter and the certified mail receipt', { align: 'center' });
}

function generateGenericDocument(doc, taskId, data) {
  addHeader(doc, 'LEGAL DOCUMENT', `Document Type: ${taskId}`);

  doc.fontSize(11).font('Helvetica');
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.text(`Reference: CNSLR-${taskId.toUpperCase()}-${Date.now()}`);
  doc.moveDown(2);

  doc.font('Helvetica-Bold').text('SUBMITTED INFORMATION:');
  doc.moveDown();
  doc.font('Helvetica');

  Object.entries(data).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    doc.text(`${label}: ${value}`);
  });

  doc.moveDown(3);
  doc.fontSize(8).fillColor('#666666');
  doc.text('Generated by CNSLR Legal Platform', { align: 'center' });
}

module.exports = { generatePDF };
