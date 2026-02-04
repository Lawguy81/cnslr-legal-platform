export const legalTasks = [
  {
    id: 'parking-ticket',
    title: 'Contest a Parking Ticket',
    description: 'Fight unfair parking citations with a formal appeal letter and supporting evidence.',
    icon: '🅿️',
    color: '#fee2e2',
    estimatedTime: '10-15 minutes',
    eFileAvailable: true,
    steps: [
      {
        id: 'ticket-info',
        title: 'Ticket Information',
        description: 'Enter details from your parking ticket'
      },
      {
        id: 'violation-details',
        title: 'Violation Details',
        description: 'Tell us about the circumstances'
      },
      {
        id: 'defense-reason',
        title: 'Your Defense',
        description: 'Select your reason for contesting'
      },
      {
        id: 'evidence',
        title: 'Supporting Evidence',
        description: 'Add photos or documents (optional)'
      },
      {
        id: 'review',
        title: 'Review & Submit',
        description: 'Review your appeal before submitting'
      }
    ],
    fields: {
      'ticket-info': [
        { name: 'ticketNumber', label: 'Ticket/Citation Number', type: 'text', required: true, placeholder: 'e.g., PCT-2024-123456' },
        { name: 'ticketDate', label: 'Date of Ticket', type: 'date', required: true },
        { name: 'ticketTime', label: 'Time on Ticket', type: 'time', required: true },
        { name: 'fineAmount', label: 'Fine Amount ($)', type: 'number', required: true, placeholder: '65' },
        { name: 'vehiclePlate', label: 'License Plate Number', type: 'text', required: true },
        { name: 'vehicleMake', label: 'Vehicle Make/Model', type: 'text', required: false, placeholder: 'e.g., Toyota Camry' }
      ],
      'violation-details': [
        { name: 'location', label: 'Location of Violation', type: 'text', required: true, placeholder: 'Street address where ticket was issued' },
        { name: 'violationType', label: 'Type of Violation', type: 'select', required: true, options: [
          { value: '', label: 'Select violation type...' },
          { value: 'expired-meter', label: 'Expired Meter' },
          { value: 'no-parking-zone', label: 'No Parking Zone' },
          { value: 'street-cleaning', label: 'Street Cleaning' },
          { value: 'overtime-parking', label: 'Overtime Parking' },
          { value: 'handicap-violation', label: 'Handicap Zone Violation' },
          { value: 'fire-hydrant', label: 'Fire Hydrant' },
          { value: 'double-parking', label: 'Double Parking' },
          { value: 'other', label: 'Other' }
        ]},
        { name: 'circumstances', label: 'Describe what happened', type: 'textarea', required: true, placeholder: 'Explain the circumstances in your own words...' }
      ],
      'defense-reason': [
        { name: 'defenseType', label: 'Primary Reason for Contest', type: 'radio', required: true, options: [
          { value: 'signage', label: 'Missing or Unclear Signage', description: 'Signs were not visible, damaged, or confusing' },
          { value: 'meter-malfunction', label: 'Meter Malfunction', description: 'Parking meter was broken or not working properly' },
          { value: 'medical-emergency', label: 'Medical Emergency', description: 'You or someone had a medical emergency' },
          { value: 'factual-error', label: 'Factual Error on Ticket', description: 'Wrong date, time, location, or vehicle info' },
          { value: 'permit-valid', label: 'Valid Permit Not Recognized', description: 'You had a valid permit that was overlooked' },
          { value: 'vehicle-breakdown', label: 'Vehicle Breakdown', description: 'Your vehicle broke down and you couldn\'t move it' },
          { value: 'other', label: 'Other Reason', description: 'A different reason not listed above' }
        ]},
        { name: 'defenseDetails', label: 'Additional Details', type: 'textarea', required: false, placeholder: 'Provide any additional details about your defense...' }
      ],
      'evidence': [
        { name: 'hasPhotos', label: 'Do you have photos to support your case?', type: 'radio', required: true, options: [
          { value: 'yes', label: 'Yes, I have photos', description: 'Photos of signage, meter, location, etc.' },
          { value: 'no', label: 'No photos available', description: 'Continue without photo evidence' }
        ]},
        { name: 'hasReceipts', label: 'Do you have receipts or other documents?', type: 'radio', required: true, options: [
          { value: 'yes', label: 'Yes, I have documents', description: 'Meter receipts, permits, repair bills, etc.' },
          { value: 'no', label: 'No documents available', description: 'Continue without document evidence' }
        ]},
        { name: 'witnessInfo', label: 'Witness Information (if any)', type: 'textarea', required: false, placeholder: 'Name and contact info of any witnesses...' }
      ]
    }
  },
  {
    id: 'small-claims',
    title: 'File Small Claims',
    description: 'Recover money owed to you through small claims court — no lawyer needed.',
    icon: '⚖️',
    color: '#dbeafe',
    estimatedTime: '20-30 minutes',
    eFileAvailable: true,
    steps: [
      {
        id: 'claim-type',
        title: 'Type of Claim',
        description: 'What kind of claim are you filing?'
      },
      {
        id: 'parties',
        title: 'Parties Involved',
        description: 'Your information and the defendant\'s'
      },
      {
        id: 'claim-details',
        title: 'Claim Details',
        description: 'Describe what happened and what you\'re owed'
      },
      {
        id: 'damages',
        title: 'Damages',
        description: 'Calculate what you\'re claiming'
      },
      {
        id: 'review',
        title: 'Review & File',
        description: 'Review your claim before filing'
      }
    ],
    fields: {
      'claim-type': [
        { name: 'claimCategory', label: 'What is your claim about?', type: 'radio', required: true, options: [
          { value: 'unpaid-debt', label: 'Unpaid Debt / Money Owed', description: 'Someone owes you money and won\'t pay' },
          { value: 'property-damage', label: 'Property Damage', description: 'Someone damaged your property' },
          { value: 'security-deposit', label: 'Security Deposit', description: 'Landlord won\'t return your deposit' },
          { value: 'defective-product', label: 'Defective Product/Service', description: 'Product or service didn\'t work as promised' },
          { value: 'contract-breach', label: 'Breach of Contract', description: 'Someone didn\'t fulfill their agreement' },
          { value: 'other', label: 'Other', description: 'A different type of claim' }
        ]}
      ],
      'parties': [
        { name: 'plaintiffName', label: 'Your Full Legal Name', type: 'text', required: true },
        { name: 'plaintiffAddress', label: 'Your Address', type: 'text', required: true },
        { name: 'plaintiffCity', label: 'City', type: 'text', required: true },
        { name: 'plaintiffState', label: 'State', type: 'text', required: true },
        { name: 'plaintiffZip', label: 'ZIP Code', type: 'text', required: true },
        { name: 'plaintiffPhone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'plaintiffEmail', label: 'Email Address', type: 'email', required: true },
        { name: 'defendantName', label: 'Defendant\'s Name (person/business you\'re suing)', type: 'text', required: true },
        { name: 'defendantAddress', label: 'Defendant\'s Address', type: 'text', required: true },
        { name: 'defendantCity', label: 'City', type: 'text', required: true },
        { name: 'defendantState', label: 'State', type: 'text', required: true },
        { name: 'defendantZip', label: 'ZIP Code', type: 'text', required: true }
      ],
      'claim-details': [
        { name: 'incidentDate', label: 'When did this happen?', type: 'date', required: true },
        { name: 'claimDescription', label: 'Describe what happened', type: 'textarea', required: true, placeholder: 'Explain the facts clearly and in order. Include dates, what was agreed upon, and what went wrong...' },
        { name: 'demandMade', label: 'Did you ask for payment/resolution before filing?', type: 'radio', required: true, options: [
          { value: 'yes', label: 'Yes', description: 'I tried to resolve this directly' },
          { value: 'no', label: 'No', description: 'I haven\'t contacted them yet' }
        ]},
        { name: 'demandDetails', label: 'Describe your demand attempts', type: 'textarea', required: false, placeholder: 'When did you ask? How did they respond?' }
      ],
      'damages': [
        { name: 'amountOwed', label: 'Principal Amount Claimed ($)', type: 'number', required: true, placeholder: 'The main amount you\'re owed' },
        { name: 'additionalCosts', label: 'Additional Costs ($)', type: 'number', required: false, placeholder: 'Filing fees, service costs, etc.' },
        { name: 'interestClaimed', label: 'Are you claiming interest?', type: 'radio', required: true, options: [
          { value: 'yes', label: 'Yes', description: 'Include statutory interest' },
          { value: 'no', label: 'No', description: 'Just the principal amount' }
        ]},
        { name: 'damagesExplanation', label: 'How did you calculate these damages?', type: 'textarea', required: true, placeholder: 'Explain how you arrived at the amount claimed...' }
      ]
    }
  },
  {
    id: 'demand-letter',
    title: 'Send a Demand Letter',
    description: 'Create a formal demand letter to request payment or action before legal proceedings.',
    icon: '📧',
    color: '#fef3c7',
    estimatedTime: '10-15 minutes',
    eFileAvailable: false,
    steps: [
      {
        id: 'sender-info',
        title: 'Your Information',
        description: 'Enter your contact details'
      },
      {
        id: 'recipient-info',
        title: 'Recipient Information',
        description: 'Who is the letter going to?'
      },
      {
        id: 'demand-details',
        title: 'Demand Details',
        description: 'What are you demanding?'
      },
      {
        id: 'review',
        title: 'Review & Send',
        description: 'Review your letter'
      }
    ],
    fields: {
      'sender-info': [
        { name: 'senderName', label: 'Your Full Name', type: 'text', required: true },
        { name: 'senderAddress', label: 'Your Address', type: 'text', required: true },
        { name: 'senderCity', label: 'City', type: 'text', required: true },
        { name: 'senderState', label: 'State', type: 'text', required: true },
        { name: 'senderZip', label: 'ZIP Code', type: 'text', required: true },
        { name: 'senderPhone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'senderEmail', label: 'Email Address', type: 'email', required: true }
      ],
      'recipient-info': [
        { name: 'recipientName', label: 'Recipient\'s Name', type: 'text', required: true },
        { name: 'recipientCompany', label: 'Company Name (if applicable)', type: 'text', required: false },
        { name: 'recipientAddress', label: 'Recipient\'s Address', type: 'text', required: true },
        { name: 'recipientCity', label: 'City', type: 'text', required: true },
        { name: 'recipientState', label: 'State', type: 'text', required: true },
        { name: 'recipientZip', label: 'ZIP Code', type: 'text', required: true }
      ],
      'demand-details': [
        { name: 'demandType', label: 'Type of Demand', type: 'radio', required: true, options: [
          { value: 'payment', label: 'Payment Demand', description: 'Requesting payment of money owed' },
          { value: 'action', label: 'Action Required', description: 'Requesting specific action be taken' },
          { value: 'cease-desist', label: 'Cease and Desist', description: 'Demanding certain behavior stop' },
          { value: 'refund', label: 'Refund Request', description: 'Requesting a refund' }
        ]},
        { name: 'amountDemanded', label: 'Amount Demanded ($)', type: 'number', required: false, placeholder: 'If requesting payment' },
        { name: 'backgroundFacts', label: 'Background / What Happened', type: 'textarea', required: true, placeholder: 'Describe the situation and why you\'re making this demand...' },
        { name: 'specificDemand', label: 'Your Specific Demand', type: 'textarea', required: true, placeholder: 'Clearly state exactly what you want the recipient to do...' },
        { name: 'deadlineDays', label: 'Response Deadline (days)', type: 'number', required: true, placeholder: '14', hint: 'Typically 10-30 days' },
        { name: 'consequenceWarning', label: 'Consequence if ignored', type: 'textarea', required: true, placeholder: 'e.g., "I will pursue legal action in small claims court..."' }
      ]
    }
  },
  {
    id: 'name-change',
    title: 'Legal Name Change',
    description: 'File a petition to legally change your name with the court.',
    icon: '✏️',
    color: '#d1fae5',
    estimatedTime: '15-20 minutes',
    eFileAvailable: true,
    steps: [
      {
        id: 'current-info',
        title: 'Current Information',
        description: 'Your current legal name and details'
      },
      {
        id: 'new-name',
        title: 'New Name',
        description: 'The name you want to change to'
      },
      {
        id: 'reason',
        title: 'Reason for Change',
        description: 'Why you want to change your name'
      },
      {
        id: 'background',
        title: 'Background Check',
        description: 'Required legal declarations'
      },
      {
        id: 'review',
        title: 'Review & File',
        description: 'Review your petition'
      }
    ],
    fields: {
      'current-info': [
        { name: 'currentFirstName', label: 'Current First Name', type: 'text', required: true },
        { name: 'currentMiddleName', label: 'Current Middle Name', type: 'text', required: false },
        { name: 'currentLastName', label: 'Current Last Name', type: 'text', required: true },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
        { name: 'birthPlace', label: 'Place of Birth (City, State)', type: 'text', required: true },
        { name: 'currentAddress', label: 'Current Address', type: 'text', required: true },
        { name: 'currentCity', label: 'City', type: 'text', required: true },
        { name: 'currentState', label: 'State', type: 'text', required: true },
        { name: 'currentZip', label: 'ZIP Code', type: 'text', required: true },
        { name: 'yearsAtAddress', label: 'Years at Current Address', type: 'number', required: true }
      ],
      'new-name': [
        { name: 'newFirstName', label: 'Requested First Name', type: 'text', required: true },
        { name: 'newMiddleName', label: 'Requested Middle Name', type: 'text', required: false },
        { name: 'newLastName', label: 'Requested Last Name', type: 'text', required: true }
      ],
      'reason': [
        { name: 'reasonCategory', label: 'Primary Reason for Name Change', type: 'radio', required: true, options: [
          { value: 'marriage', label: 'Marriage', description: 'Changing name due to marriage' },
          { value: 'divorce', label: 'Divorce', description: 'Returning to previous name after divorce' },
          { value: 'personal', label: 'Personal Preference', description: 'Personal reasons for wanting a different name' },
          { value: 'gender', label: 'Gender Identity', description: 'Name change related to gender identity' },
          { value: 'religious', label: 'Religious/Cultural', description: 'Religious or cultural reasons' },
          { value: 'other', label: 'Other', description: 'Another reason' }
        ]},
        { name: 'reasonExplanation', label: 'Please explain your reason', type: 'textarea', required: true, placeholder: 'Provide details about why you want to change your name...' }
      ],
      'background': [
        { name: 'hasFelony', label: 'Have you ever been convicted of a felony?', type: 'radio', required: true, options: [
          { value: 'no', label: 'No', description: 'I have not been convicted of a felony' },
          { value: 'yes', label: 'Yes', description: 'I have a felony conviction' }
        ]},
        { name: 'felonyDetails', label: 'If yes, please provide details', type: 'textarea', required: false },
        { name: 'hasBankruptcy', label: 'Have you filed for bankruptcy in the past 7 years?', type: 'radio', required: true, options: [
          { value: 'no', label: 'No', description: 'I have not filed for bankruptcy' },
          { value: 'yes', label: 'Yes', description: 'I have filed for bankruptcy' }
        ]},
        { name: 'hasChildSupport', label: 'Do you owe child support?', type: 'radio', required: true, options: [
          { value: 'no', label: 'No', description: 'I do not owe child support' },
          { value: 'yes', label: 'Yes', description: 'I have child support obligations' }
        ]},
        { name: 'fraudIntent', label: 'Declaration of Intent', type: 'checkbox', required: true, checkboxLabel: 'I declare that this name change is not being sought to defraud creditors, escape debts, or for any illegal purpose.' }
      ]
    }
  },
  {
    id: 'landlord-dispute',
    title: 'Landlord/Tenant Dispute',
    description: 'Address issues with your landlord including repairs, deposits, or lease violations.',
    icon: '🏠',
    color: '#e0e7ff',
    estimatedTime: '15-20 minutes',
    eFileAvailable: false,
    steps: [
      {
        id: 'dispute-type',
        title: 'Type of Dispute',
        description: 'What\'s the issue?'
      },
      {
        id: 'rental-info',
        title: 'Rental Information',
        description: 'Details about your rental'
      },
      {
        id: 'issue-details',
        title: 'Issue Details',
        description: 'Describe the problem'
      },
      {
        id: 'review',
        title: 'Review & Send',
        description: 'Review your letter'
      }
    ],
    fields: {
      'dispute-type': [
        { name: 'disputeCategory', label: 'What type of issue are you having?', type: 'radio', required: true, options: [
          { value: 'repairs', label: 'Repairs Needed', description: 'Landlord won\'t make necessary repairs' },
          { value: 'deposit', label: 'Security Deposit', description: 'Issue with security deposit return' },
          { value: 'habitability', label: 'Habitability Issues', description: 'Heat, water, pests, mold, etc.' },
          { value: 'privacy', label: 'Privacy Violation', description: 'Landlord entering without notice' },
          { value: 'lease-violation', label: 'Lease Violation by Landlord', description: 'Landlord breaking lease terms' },
          { value: 'illegal-fees', label: 'Illegal Fees', description: 'Charged fees not in the lease' },
          { value: 'other', label: 'Other Issue', description: 'A different type of dispute' }
        ]}
      ],
      'rental-info': [
        { name: 'tenantName', label: 'Your Full Name', type: 'text', required: true },
        { name: 'rentalAddress', label: 'Rental Property Address', type: 'text', required: true },
        { name: 'rentalCity', label: 'City', type: 'text', required: true },
        { name: 'rentalState', label: 'State', type: 'text', required: true },
        { name: 'rentalZip', label: 'ZIP Code', type: 'text', required: true },
        { name: 'unitNumber', label: 'Unit/Apt Number', type: 'text', required: false },
        { name: 'landlordName', label: 'Landlord/Property Manager Name', type: 'text', required: true },
        { name: 'landlordAddress', label: 'Landlord\'s Mailing Address', type: 'text', required: true },
        { name: 'leaseStartDate', label: 'Lease Start Date', type: 'date', required: true },
        { name: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', required: true }
      ],
      'issue-details': [
        { name: 'issueStartDate', label: 'When did this issue start?', type: 'date', required: true },
        { name: 'issueDescription', label: 'Describe the issue in detail', type: 'textarea', required: true, placeholder: 'Explain what happened, when you noticed it, and how it affects you...' },
        { name: 'previousNotice', label: 'Have you already notified your landlord?', type: 'radio', required: true, options: [
          { value: 'yes-written', label: 'Yes, in writing', description: 'Email, text, or written notice' },
          { value: 'yes-verbal', label: 'Yes, verbally only', description: 'Phone call or in-person conversation' },
          { value: 'no', label: 'No', description: 'This is my first notice' }
        ]},
        { name: 'noticeDate', label: 'Date you notified landlord', type: 'date', required: false },
        { name: 'landlordResponse', label: 'How did landlord respond?', type: 'textarea', required: false, placeholder: 'What did they say or do?' },
        { name: 'desiredResolution', label: 'What resolution are you seeking?', type: 'textarea', required: true, placeholder: 'What do you want the landlord to do?' }
      ]
    }
  }
];

export const getTaskById = (id) => legalTasks.find(task => task.id === id);
