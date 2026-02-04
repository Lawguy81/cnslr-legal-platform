const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle
} = require('docx');

const documentTemplates = {
  'parking-ticket': generateParkingTicketAppealDOCX,
  'small-claims': generateSmallClaimsFilingDOCX,
  'demand-letter': generateDemandLetterDOCX,
  'name-change': generateNameChangePetitionDOCX,
  'landlord-dispute': generateLandlordDisputeLetterDOCX
};

async function generateDOCX(taskId, formData) {
  const generator = documentTemplates[taskId];
  let doc;

  if (generator) {
    doc = generator(formData);
  } else {
    doc = generateGenericDocumentDOCX(taskId, formData);
  }

  return await Packer.toBuffer(doc);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    alignment: options.align || AlignmentType.LEFT,
    spacing: { after: options.spacing || 200 },
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        size: options.size || 22,
        font: 'Calibri'
      })
    ]
  });
}

function createTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 36,
        font: 'Calibri'
      })
    ]
  });
}

function createSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [
      new TextRun({
        text,
        size: 24,
        font: 'Calibri'
      })
    ]
  });
}

function createSectionHeader(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        font: 'Calibri',
        underline: {}
      })
    ]
  });
}

function generateParkingTicketAppealDOCX(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const defenseReasons = {
    'signage': 'The signage at this location was missing, obscured, or unclear',
    'meter-malfunction': 'The parking meter was malfunctioning and would not accept payment',
    'medical-emergency': 'There was a medical emergency that required immediate attention',
    'factual-error': 'The citation contains factual errors',
    'permit-valid': 'I had a valid parking permit that was not properly recognized',
    'vehicle-breakdown': 'My vehicle experienced a mechanical breakdown',
    'other': 'Other circumstances as described below'
  };

  return new Document({
    sections: [{
      properties: {},
      children: [
        createTitle('PARKING TICKET APPEAL'),
        createSubtitle('Request for Administrative Review'),
        createParagraph(`Date: ${today}`),
        createParagraph(`Citation Number: ${data.ticketNumber || 'N/A'}`),
        createParagraph(''),
        createParagraph('To Whom It May Concern:'),
        createParagraph(''),
        createParagraph(
          `I am writing to formally contest Parking Citation #${data.ticketNumber}, issued on ${formatDate(data.ticketDate)} at approximately ${data.ticketTime || 'N/A'} for the alleged violation of ${data.violationType?.replace(/-/g, ' ') || 'parking regulations'}.`
        ),
        createSectionHeader('VEHICLE INFORMATION:'),
        createParagraph(`License Plate: ${data.vehiclePlate || 'N/A'}`),
        createParagraph(`Vehicle: ${data.vehicleMake || 'N/A'}`),
        createParagraph(`Location: ${data.location || 'N/A'}`),
        createParagraph(`Fine Amount: $${data.fineAmount || 'N/A'}`),
        createSectionHeader('REASON FOR APPEAL:'),
        createParagraph(defenseReasons[data.defenseType] || 'I believe this citation was issued in error.'),
        createSectionHeader('DETAILED EXPLANATION:'),
        createParagraph(data.circumstances || 'Please see attached documentation.'),
        data.defenseDetails ? createParagraph(data.defenseDetails) : createParagraph(''),
        createSectionHeader('SUPPORTING EVIDENCE:'),
        createParagraph(`Photographs: ${data.hasPhotos === 'yes' ? 'Yes (attached)' : 'Not available'}`),
        createParagraph(`Documents/Receipts: ${data.hasReceipts === 'yes' ? 'Yes (attached)' : 'Not available'}`),
        data.witnessInfo ? createParagraph(`Witness Information: ${data.witnessInfo}`) : createParagraph(''),
        createSectionHeader('REQUEST:'),
        createParagraph(
          'Based on the facts and circumstances described above, I respectfully request that this citation be dismissed, or in the alternative, that the fine be reduced.'
        ),
        createParagraph(''),
        createParagraph('Thank you for your consideration of this appeal.'),
        createParagraph(''),
        createParagraph('Respectfully submitted,'),
        createParagraph(''),
        createParagraph('_________________________________'),
        createParagraph('Signature'),
        createParagraph(''),
        createParagraph('_________________________________'),
        createParagraph('Printed Name'),
        createParagraph(''),
        createParagraph(`Date: ${today}`),
        createParagraph(''),
        createParagraph('Generated by CNSLR Legal Platform | This document should be reviewed for accuracy before submission', { size: 16, align: AlignmentType.CENTER })
      ]
    }]
  });
}

function generateSmallClaimsFilingDOCX(data) {
  return new Document({
    sections: [{
      properties: {},
      children: [
        createTitle('SMALL CLAIMS COURT'),
        createSubtitle("Plaintiff's Claim and ORDER to Go to Small Claims Court"),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: 'CASE NUMBER: _____________________', font: 'Calibri' })]
        }),
        createParagraph(''),
        createParagraph('PLAINTIFF (Person filing claim):', { bold: true }),
        createParagraph(`Name: ${data.plaintiffName || '___________________________'}`),
        createParagraph(`Address: ${data.plaintiffAddress || '___________________________'}`),
        createParagraph(`City, State, ZIP: ${data.plaintiffCity || ''}, ${data.plaintiffState || ''} ${data.plaintiffZip || ''}`),
        createParagraph(`Phone: ${data.plaintiffPhone || '___________________________'}`),
        createParagraph(`Email: ${data.plaintiffEmail || '___________________________'}`),
        createParagraph(''),
        createParagraph('DEFENDANT (Person being sued):', { bold: true }),
        createParagraph(`Name: ${data.defendantName || '___________________________'}`),
        createParagraph(`Address: ${data.defendantAddress || '___________________________'}`),
        createParagraph(`City, State, ZIP: ${data.defendantCity || ''}, ${data.defendantState || ''} ${data.defendantZip || ''}`),
        createParagraph(''),
        createSectionHeader('CLAIM DETAILS:'),
        createParagraph(`Date of Incident: ${formatDate(data.incidentDate)}`),
        createParagraph(''),
        createSectionHeader('AMOUNT CLAIMED:'),
        createParagraph(`Principal Amount: $${data.amountOwed || '0.00'}`),
        createParagraph(`Additional Costs: $${data.additionalCosts || '0.00'}`),
        createParagraph(`Interest Claimed: ${data.interestClaimed === 'yes' ? 'Yes' : 'No'}`),
        createParagraph(`TOTAL CLAIM: $${(parseFloat(data.amountOwed || 0) + parseFloat(data.additionalCosts || 0)).toFixed(2)}`, { bold: true }),
        createParagraph(''),
        createSectionHeader('DESCRIPTION OF CLAIM:'),
        createParagraph(data.claimDescription || 'See attached documentation.'),
        createParagraph(''),
        createSectionHeader('BASIS FOR DAMAGES:'),
        createParagraph(data.damagesExplanation || 'See above.'),
        createParagraph(''),
        createParagraph('DECLARATION', { bold: true }),
        createParagraph('I declare under penalty of perjury under the laws of this state that the foregoing is true and correct.'),
        createParagraph(''),
        createParagraph('_________________________________     _________________'),
        createParagraph("Plaintiff's Signature                              Date"),
        createParagraph(''),
        createParagraph('Generated by CNSLR Legal Platform | Review local court requirements before filing', { size: 16, align: AlignmentType.CENTER })
      ]
    }]
  });
}

function generateDemandLetterDOCX(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + parseInt(data.deadlineDays || 14));

  const subjects = {
    'payment': 'FORMAL DEMAND FOR PAYMENT',
    'action': 'FORMAL DEMAND FOR ACTION',
    'cease-desist': 'CEASE AND DESIST DEMAND',
    'refund': 'FORMAL DEMAND FOR REFUND'
  };

  return new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: data.senderName || '[Your Name]', font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: data.senderAddress || '[Your Address]', font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `${data.senderCity || ''}, ${data.senderState || ''} ${data.senderZip || ''}`, font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: today, font: 'Calibri' })]
        }),
        createParagraph(''),
        createParagraph(data.recipientName || '[Recipient Name]'),
        data.recipientCompany ? createParagraph(data.recipientCompany) : createParagraph(''),
        createParagraph(data.recipientAddress || '[Recipient Address]'),
        createParagraph(`${data.recipientCity || ''}, ${data.recipientState || ''} ${data.recipientZip || ''}`),
        createParagraph(''),
        createParagraph(`Re: ${subjects[data.demandType] || 'FORMAL DEMAND'}`, { bold: true }),
        createParagraph(''),
        createParagraph(`Dear ${data.recipientName || 'Sir/Madam'},`),
        createParagraph(''),
        createParagraph('This letter serves as a formal demand pursuant to applicable law. Please treat this matter with the utmost seriousness.'),
        createSectionHeader('BACKGROUND:'),
        createParagraph(data.backgroundFacts || '[Background facts to be provided]'),
        createSectionHeader('DEMAND:'),
        createParagraph(data.specificDemand || '[Specific demand to be provided]'),
        data.amountDemanded ? createParagraph(`Amount Demanded: $${data.amountDemanded}`, { bold: true }) : createParagraph(''),
        createSectionHeader('DEADLINE:'),
        createParagraph(
          `You must comply with this demand within ${data.deadlineDays || 14} days of receipt of this letter, no later than ${deadlineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.`
        ),
        createSectionHeader('CONSEQUENCES OF NON-COMPLIANCE:'),
        createParagraph(data.consequenceWarning || 'Failure to comply with this demand will result in further legal action.'),
        createParagraph(''),
        createParagraph('Please govern yourself accordingly. I expect your prompt attention to this matter.'),
        createParagraph(''),
        createParagraph('Sincerely,'),
        createParagraph(''),
        createParagraph('_________________________________'),
        createParagraph(data.senderName || '[Your Name]'),
        createParagraph(''),
        createParagraph('SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED', { align: AlignmentType.CENTER, size: 18, bold: true }),
        createParagraph('Generated by CNSLR Legal Platform', { size: 16, align: AlignmentType.CENTER })
      ]
    }]
  });
}

function generateNameChangePetitionDOCX(data) {
  const reasons = {
    'marriage': 'marriage',
    'divorce': 'divorce and desire to return to former name',
    'personal': 'personal preference',
    'gender': 'gender identity',
    'religious': 'religious or cultural reasons',
    'other': 'the following reason'
  };

  const currentName = `${data.currentFirstName || ''} ${data.currentMiddleName || ''} ${data.currentLastName || ''}`.trim();
  const newName = `${data.newFirstName || ''} ${data.newMiddleName || ''} ${data.newLastName || ''}`.trim();

  return new Document({
    sections: [{
      properties: {},
      children: [
        createTitle('PETITION FOR CHANGE OF NAME'),
        createSubtitle('In the Matter of the Application of'),
        createParagraph(currentName, { bold: true, align: AlignmentType.CENTER }),
        createParagraph('Petitioner', { align: AlignmentType.CENTER }),
        createParagraph(''),
        createParagraph('TO THE HONORABLE COURT:'),
        createParagraph(''),
        createParagraph('Petitioner respectfully represents to the Court as follows:'),
        createParagraph(''),
        createParagraph(`1. Petitioner's current legal name is ${currentName}.`),
        createParagraph(`2. Petitioner was born on ${formatDate(data.dateOfBirth)} in ${data.birthPlace || '[City, State]'}.`),
        createParagraph(`3. Petitioner currently resides at ${data.currentAddress || ''}, ${data.currentCity || ''}, ${data.currentState || ''} ${data.currentZip || ''}, and has resided there for ${data.yearsAtAddress || '___'} year(s).`),
        createParagraph(`4. Petitioner desires to change their legal name to: ${newName}.`),
        createParagraph(`5. The reason for this name change is ${reasons[data.reasonCategory] || 'as follows'}:`),
        createParagraph(`     ${data.reasonExplanation || '[Explanation to be provided]'}`),
        createParagraph('6. This name change is not sought for any fraudulent purpose, to escape debts, or for any illegal purpose.'),
        createParagraph(`7. Petitioner ${data.hasFelony === 'yes' ? 'has' : 'has not'} been convicted of a felony.`),
        createParagraph(`8. Petitioner ${data.hasBankruptcy === 'yes' ? 'has' : 'has not'} filed for bankruptcy in the past 7 years.`),
        createParagraph(`9. Petitioner ${data.hasChildSupport === 'yes' ? 'has' : 'does not have'} outstanding child support obligations.`),
        createParagraph(''),
        createParagraph('WHEREFORE, Petitioner prays that this Court:', { bold: true }),
        createParagraph('1. Grant this Petition for Change of Name;'),
        createParagraph(`2. Order that Petitioner's name be changed from ${currentName} to ${newName};`),
        createParagraph('3. Grant such other and further relief as the Court deems just and proper.'),
        createParagraph(''),
        createParagraph('VERIFICATION', { bold: true }),
        createParagraph('I declare under penalty of perjury that the foregoing is true and correct.'),
        createParagraph(''),
        createParagraph('_________________________________     _________________'),
        createParagraph("Petitioner's Signature                              Date"),
        createParagraph(''),
        createParagraph(`Printed Name: ${currentName}`),
        createParagraph(''),
        createParagraph('Generated by CNSLR Legal Platform | Check local court requirements for filing procedures', { size: 16, align: AlignmentType.CENTER })
      ]
    }]
  });
}

function generateLandlordDisputeLetterDOCX(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const subjects = {
    'repairs': 'FORMAL NOTICE: REQUEST FOR REPAIRS',
    'deposit': 'FORMAL NOTICE: SECURITY DEPOSIT DEMAND',
    'habitability': 'FORMAL NOTICE: HABITABILITY ISSUES',
    'privacy': 'FORMAL NOTICE: PRIVACY VIOLATION',
    'lease-violation': 'FORMAL NOTICE: LEASE VIOLATION',
    'illegal-fees': 'FORMAL NOTICE: ILLEGAL FEES',
    'other': 'FORMAL NOTICE: LANDLORD-TENANT DISPUTE'
  };

  return new Document({
    sections: [{
      properties: {},
      children: [
        createParagraph(today),
        createParagraph(''),
        createParagraph('SENT VIA CERTIFIED MAIL', { bold: true }),
        createParagraph('RETURN RECEIPT REQUESTED', { bold: true }),
        createParagraph(''),
        createParagraph(data.landlordName || '[Landlord Name]'),
        createParagraph(data.landlordAddress || '[Landlord Address]'),
        createParagraph(''),
        createParagraph(`Re: ${subjects[data.disputeCategory] || 'FORMAL NOTICE'}`, { bold: true }),
        createParagraph(`Property: ${data.rentalAddress || ''}, ${data.unitNumber ? `Unit ${data.unitNumber}, ` : ''}${data.rentalCity || ''}, ${data.rentalState || ''} ${data.rentalZip || ''}`, { bold: true }),
        createParagraph(''),
        createParagraph(`Dear ${data.landlordName || 'Landlord'},`),
        createParagraph(''),
        createParagraph(
          `I am the tenant at the above-referenced property. My lease commenced on ${formatDate(data.leaseStartDate)}, and my current monthly rent is $${data.monthlyRent || 'N/A'}.`
        ),
        createParagraph(
          `This letter serves as formal notice regarding the following issue that first arose on ${formatDate(data.issueStartDate)}:`
        ),
        createSectionHeader('DESCRIPTION OF ISSUE:'),
        createParagraph(data.issueDescription || '[Issue description to be provided]'),
        data.previousNotice !== 'no' ? createParagraph(
          `Please be advised that I previously notified you of this issue ${data.previousNotice === 'yes-written' ? 'in writing' : 'verbally'} on ${formatDate(data.noticeDate) || 'a prior date'}.`
        ) : createParagraph(''),
        createSectionHeader('REQUESTED RESOLUTION:'),
        createParagraph(data.desiredResolution || '[Resolution to be specified]'),
        createParagraph(''),
        createParagraph(
          'Please respond to this notice within 14 days. Failure to address this matter may result in further action, including but not limited to: filing a complaint with the local housing authority, withholding rent as permitted by law, or pursuing legal remedies in court.'
        ),
        createParagraph(''),
        createParagraph('I am prepared to resolve this matter amicably and look forward to your prompt response.'),
        createParagraph(''),
        createParagraph('Sincerely,'),
        createParagraph(''),
        createParagraph('_________________________________'),
        createParagraph(data.tenantName || '[Tenant Name]'),
        createParagraph(`${data.rentalAddress || ''}, ${data.unitNumber ? `Unit ${data.unitNumber}` : ''}`),
        createParagraph(`${data.rentalCity || ''}, ${data.rentalState || ''} ${data.rentalZip || ''}`),
        createParagraph(''),
        createParagraph('CC: File Copy'),
        createParagraph('Generated by CNSLR Legal Platform | Keep a copy of this letter and the certified mail receipt', { size: 16, align: AlignmentType.CENTER })
      ]
    }]
  });
}

function generateGenericDocumentDOCX(taskId, data) {
  const children = [
    createTitle('LEGAL DOCUMENT'),
    createSubtitle(`Document Type: ${taskId}`),
    createParagraph(`Generated: ${new Date().toLocaleString()}`),
    createParagraph(`Reference: CNSLR-${taskId.toUpperCase()}-${Date.now()}`),
    createParagraph(''),
    createSectionHeader('SUBMITTED INFORMATION:')
  ];

  Object.entries(data).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    children.push(createParagraph(`${label}: ${value}`));
  });

  children.push(createParagraph(''));
  children.push(createParagraph('Generated by CNSLR Legal Platform', { size: 16, align: AlignmentType.CENTER }));

  return new Document({
    sections: [{ properties: {}, children }]
  });
}

module.exports = { generateDOCX };
