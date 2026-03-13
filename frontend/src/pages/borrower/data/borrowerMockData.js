// Use ONLY for development. Replace with API calls in production.

export const MOCK_BORROWER_CASE = {
  id: 'MIP-2026-001',
  status: 'In Auction',
  property: {
    address: '45 Victoria Street',
    suburb: 'Potts Point',
    state: 'NSW',
    postcode: '2011',
    valuation: 1250000,
    location: 'Potts Point, NSW 2011',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    titleReference: 'Vol 9876 Fol 234',
    lotPlan: '12 / SP87654',
    lga: 'City of Sydney',
    yearBuilt: '2018',
    floorArea: '95 m²',
    condition: 'Excellent',
    zoning: 'R4',
    construction: 'Concrete And Steel',
    valuationDate: '15 Jan 2026',
    valuer: 'Preston Rowe Paterson',
  },
  borrower: {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+61 412 345 678',
    dateOfBirth: '1985-06-15',
    kycStatus: 'Completed',
    idType: 'Drivers Licence',
    sourceOfFunds: 'Salary income and investment returns',
    employmentStatus: 'Full-time',
    employer: 'Macquarie Group',
    occupation: 'Financial Analyst',
  },
  lender: { name: 'Commonwealth Bank', outstandingDebt: 980000 },
  caseCreated: '10 Jan 2026, 05:30',
  lastUpdated: '10 Feb 2026, 05:30',
  urgencyLevel: 'High',
  totalBids: 7,
  currentHighestBid: 1100000,
  minimumBid: 1000000,
  equityAvailable: 270000,
  lvr: 78.4,
  ratesAndCharges: { councilRates: 2850, waterRates: 680, strataFees: 3200, landTax: 1200 },
  environmentalRisk: { flood: 'Low', bushfire: 'Low' },
  avm: { mid: 1250000, low: 1180000, high: 1320000, lastSaleDate: '2023-03-15', lastSalePrice: 1100000, confidence: 'High (85%)' },
  loanDetails: {
    originalLoanAmount: 950000,
    interestRate: '5.85%',
    missedPayments: 4,
    repaymentType: 'Principal And Interest',
    defaultDate: '2025-09-15',
    loanStartDate: '2019-03-01',
    defaultReason: 'Loss of employment followed by extended job search period',
    hardshipCircumstances: 'Borrower experienced redundancy in July 2025. Has since secured new employment but accumulated arrears during unemployment period.',
  },
  lenderDetails: {
    name: 'Commonwealth Bank',
    contactPerson: 'Michael Stevens',
    phone: '+61 2 9378 2000',
    accountNumber: 'CBA-ML-2019-5678',
    aclHolder: 'Commonwealth Bank of Australia',
    licenceType: 'Australian Credit Licence',
    email: 'michael.stevens@cba.com.au',
    aclNumber: '123456',
  },
  parties: [
    { role: "Borrower's Lawyer", name: 'Jennifer Wong' },
    { role: "Lender's Lawyer", name: 'David Richardson' },
    { role: 'Real Estate Agent', name: 'Rebecca Taylor' },
    { role: 'Accountant', name: 'Thomas Chen' },
    { role: 'Valuer', name: 'Andrew Morrison' },
    { role: 'Conveyancer', name: 'Patricia Davies' },
    { role: 'Auctioneer', name: 'James Morrison' },
    { role: 'Property Manager', name: 'Lisa Anderson' },
  ],
  nccpCompliance: { subjectToNCCP: true, loanPurpose: 'Owner-occupied residential property purchase' },
  documentVerification: [
    { name: 'Title Search', status: 'Completed' },
    { name: 'Identity Verification (GreenID)', status: 'Completed' },
    { name: 'Encumbrance Check', status: 'Completed' },
    { name: 'Zoning Check', status: 'Completed' },
    { name: 'Original Loan Agreement', status: 'Completed' },
    { name: 'Bank Statements', status: 'Completed' },
  ],
  caseNotes: 'High priority case due to upcoming auction deadline. Borrower has secured new employment and is cooperative. LVR is favorable at 78.4%. Strong equity position provides good security for investors.',
  financials: {
    originalLoanAmount: 950000,
    outstandingPrincipal: 980000,
    arrearsAndInterest: 18500,
    legalCosts: 25000,
    sellingCostsEst: 48000,
    totalAmountOwed: 3018000,
    currentHighestBid: 1100000,
    expectedShortfall: 495000,
  },
  auction: {
    endDate: '2026-03-05',
    activeBidders: 5,
    daysRemaining: 5,
  },
  riskScore: 50,
  riskLevel: 'Medium',
  missedPayments: 4,
  loanToValueRatio: 78.4,
  activeArrears: 18500,
  defaultDate: '2023-09-15',
  defaultReason: 'Loss of employment followed by extended job search period',
  daysActive: 51,
  statusUpdatedAgo: '20d ago',
  caseStartDate: '1/10/2026',
  documents: {
    collected: 13,
    total: 13,
    items: ['Title Search', 'Identity Verified', 'Loan Agreement'],
  },
  verification: {
    completed: 5,
    total: 5,
    items: ['InfoTrack Checks', 'KYC Verified', 'Payment Verified'],
  },
  recentActivity: [
    { type: 'bid', label: 'New bid placed', detail: 'Platinum Capital Partners bid $1,100,000', time: '02 Mar 2026, 15:11 AEST' },
    { type: 'document', label: 'Document uploaded', detail: 'Property inspection report added', time: '02 Mar 2026, 13:26 AEST' },
    { type: 'message', label: 'Message received', detail: 'Sarah Mitchell sent a message', time: '02 Mar 2026, 11:26 AEST' },
  ],
}

/** Auction room data for borrower live auction page. Derives from case + extended fields. */
export const MOCK_AUCTION_ROOM = {
  ...MOCK_BORROWER_CASE,
  financials: {
    ...MOCK_BORROWER_CASE.financials,
    currentHighestBid: 1100000,
  },
  property: {
    ...MOCK_BORROWER_CASE.property,
    propertyType: 'Apartment',
    sqFt: 1800,
    bedrooms: 2,
    bathrooms: 2,
    carParks: 1,
    propertyDetails: 'Brickbanq_dev',
  },
  auction: {
    ...MOCK_BORROWER_CASE.auction,
    totalBidders: 89,
    totalPropertiesInAuction: 127,
    yieldRate: 5.85,
    loanToValue: 8.25,
    recoveryRate: 78.4,
    reservePrice: 25000,
    minimumBid: 1250000,
    currentBiddersCount: 250,
    minimumBidIncrement: 10000,
    maximumBidIncrement: 150000,
  },
  currentLenders: {
    currentLoanValue: 550000,
    outstandingLoanValue: 580000,
    lvrPrice1: 250000,
    lvrPrice2: 270000,
  },
  mortgage: {
    lastPaymentDate: '15 Oct 2025',
    nextPaymentDate: '20 Nov 2025',
    interestRate: 6.25,
    outstandingDebt: 250000,
    defaultInterestRate: 8.25,
    loanTerm: '10 years',
    loanType: 'Principal_and_Interest',
    totalRepayments: 250000,
    purpose: 'Purchase',
    tenureType: 'First Mortgage',
    ownerName: 'John Smith',
  },
  verificationDueDiligence: [
    { label: 'Borrower Verification: TPA Check', status: 'Completed' },
    { label: 'Mortgage & Financial: Monthly Pay Back', status: 'Verified' },
    { label: 'Outstanding Debt: Current Outstanding', status: 'Completed' },
    { label: 'Saving Scheme', status: 'Done Online' },
    { label: 'Borrower Check', status: 'Done Online' },
    { label: 'Lender Check', status: 'Done Online' },
  ],
  dueDiligenceGrid: [
    { label: 'Valuation', status: 'Completed' },
    { label: 'Due Diligence', status: 'Pending' },
    { label: 'KYC Check', status: 'Completed' },
    { label: 'Compliance Check', status: 'Completed' },
    { label: 'Present Status', status: 'Completed' },
    { label: 'Valuer', status: 'Completed' },
    { label: 'Legal Status', status: 'Completed' },
    { label: 'Final Status', status: 'Completed' },
  ],
  dueDiligenceProgress: 100,
  bidHistory: [
    { id: '1', amount: 1100000, user: 'Platinum Capital Partners', time: '02 Mar 2026, 11:15 AEST', status: 'winning' },
    { id: '2', amount: 1050000, user: 'Strategic Property Group', time: '02 Mar 2026, 10:45 AEST', status: 'outbid' },
    { id: '3', amount: 1025000, user: 'Zenith Investments', time: '02 Mar 2026, 10:00 AEST', status: 'outbid' },
  ],
  availableDocuments: [
    { title: 'Loan Agreement', description: 'Contract - 2 MB', type: 'PDF' },
    { title: 'Property Valuation', description: 'Report - 2 MB', type: 'PDF' },
    { title: 'Title Search', description: 'Search - 1 MB', type: 'PDF' },
    { title: 'Building Insurance', description: 'Policy - 800 KB', type: 'PDF' },
  ],
  propertyImages: [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
  ],
  investmentSummary: {
    propertyValue: 1500000,
    lvr: 80,
    totalRepayments: 1200000,
  },
  bcbpNotice: 'This is to inform you that the Borrower Current Outstanding Loan 2022 Loan Term has Overdue.',
}

export const MOCK_BORROWER_CONTRACTS = [
  { id: 'MIP-2026-003', property: '7 Park Lane', suburb: 'South Yarra, VIC', party: 'Emma Rodriguez', lender: 'ANZ', value: 1750000, created: '25 Jan 2026', status: 'Under Contract' },
  { id: 'MIP-2026-005', property: '156 Stirling Highway', suburb: 'Nedlands, WA', party: 'Lisa Anderson', lender: 'Macquarie Bank', value: 2650000, created: '15 Jan 2026', status: 'Completed' },
]

export const MOCK_ENVELOPES = [
  { id: 'Env-2024-2025', title: 'Defence Procurement Contract - Project Nighthawk', category: 'Procurement', signed: '2/2', sla: '23h 37m', tags: ['HSM-Backed', 'Witness Required'], hash: 'sha1:a579b4...', priority: 'URGENT' },
  { id: 'Env-2024-1000', title: 'Deed of Guarantee with Witness Attestation', category: 'Deed', signed: '1/3', sla: '7h 15m', tags: ['HSM-Backed', 'Witness Required'], hash: 'sha1:1d8a6...', priority: 'PROTECTED' },
]

export const MOCK_SECURITY_ALERTS = [
  { level: 'red', title: 'Certificate Expiring', detail: "Robert Taylor's certificate expires in 25 days", action: 'Review Certificate' },
  { level: 'amber', title: 'HSM Key Rotation Scheduled', detail: 'Next rotation 2024-03-01 02:00 AEST', action: null },
]

export const MOCK_RECENT_ACTIVITY = [
  { type: 'created', label: 'ENVELOPE CREATED', user: 'Sarah Johnson', time: '2026-02-07 02:52:00 AEDT' },
  { type: 'hash', label: 'DOCUMENT HASH COMPUTED', user: 'Sarah Johnson', time: '2026-02-07 02:52:35 AEDT' },
  { type: 'added', label: 'RECIPIENTS ADDED', user: 'Sarah Johnson', time: '2026-02-07 02:53:10 AEDT' },
  { type: 'completed', label: 'RISK ASSESSMENT COMPLETED', user: 'Approval System', time: '2026-02-07 02:54:20 AEDT' },
  { type: 'approved', label: 'ENVELOPE APPROVED', user: 'John Smith (Approver)', time: '2026-02-07 02:55:13 AEDT' },
]

export const MOCK_BORROWER_TASKS = [
  { id: 1, title: 'Update accounting records — February entries', desc: 'Review and reconcile February accounting entries in Grow accounting.', status: 'Completed', priority: 'Done', dueLabel: 'Overdue (30 d)', tags: ['Accounting', 'Reconciliation'], caseId: null, module: 'Accounting', actions: [] },
  { id: 2, title: 'Follow up with client — Contract of Sale', desc: 'Contact Sarah Mitchell regarding outstanding contract of sale documents.', status: 'Overdue', priority: 'High', dueLabel: 'Overdue (Feb 27)', tags: ['Client Communication'], caseId: 'MIP-2026-001', module: 'Brickbanq', actions: ['viewCase'] },
  { id: 3, title: 'Verify enforcement steps for MIP-2026-002', desc: 'Check statutory notices and enforcement procedures are complete.', status: 'Pending', priority: 'Urgent', dueLabel: 'Due Today', tags: ['Compliance'], caseId: 'MIP-2026-002', module: 'Brickbanq', actions: ['viewCase', 'startTask'] },
  { id: 4, title: 'Upload Statement of Advice', desc: 'Prepare and upload compliance statement of advice for case MIP-2026-001.', status: 'InProgress', priority: 'High', dueLabel: 'Tomorrow', tags: ['Documentation'], caseId: 'MIP-2026-001', module: 'Brickbanq', actions: ['moveToPending', 'markComplete'] },
  { id: 5, title: 'Review loan documentation for MIP-2026-001', desc: 'Complete legal review of all case documents and verify NCCP compliance.', status: 'Pending', priority: 'High', dueLabel: 'Mar 2, 2026', tags: ['Legal Review'], caseId: 'MIP-2026-001', module: 'Brickbanq', actions: ['viewCase', 'startTask'] },
  { id: 6, title: 'AML/CTF client verification — New Trust Account', desc: 'Complete KYC verification and AML checks for new trust account setup.', status: 'Pending', priority: 'High', dueLabel: 'Mar 3, 2026', tags: ['Compliance', 'AML/CTF'], caseId: null, module: 'Compliance', actions: ['startTask'] },
  { id: 7, title: 'Review PEXA workspace documents', desc: 'Review and approve settlement documents in PEXA workspace #RS-12345.', status: 'Pending', priority: 'Medium', dueLabel: 'Mar 5, 2026', tags: ['Settlement'], caseId: 'MIP-2026-001', module: 'Brickbanq', actions: ['viewCase', 'startTask'] },
  { id: 8, title: 'Prepare monthly compliance report', desc: 'Prepare and review monthly AML/CTF compliance report for board.', status: 'InProgress', priority: 'Medium', dueLabel: 'Mar 7, 2026', tags: ['Compliance', 'Reporting'], caseId: null, module: 'Compliance', actions: ['moveToPending', 'markComplete'] },
]

export const MOCK_BORROWER_PROFILE = {
  firstName: 'David',
  lastName: 'Williams',
  email: 'david.williams@example.com',
  phone: '+61 412 345 678',
  jobTitle: 'Investment Manager',
  company: 'Platinum Capital Partners',
  bio: 'Experienced investment professional specialising in distressed asset management and mortgage investment opportunities.',
  memberSince: 'Jan 2024',
  accountType: 'Premium Investor',
  verified: true,
  address: {
    street: '123 Collins Street',
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    country: 'Australia',
  },
}

// Flat form profile for Settings (ProfileSettings / toFormProfile)
export const MOCK_PROFILE = {
  ...MOCK_BORROWER_PROFILE,
  streetAddress: MOCK_BORROWER_PROFILE.address?.street ?? '',
  city: MOCK_BORROWER_PROFILE.address?.city ?? '',
  state: MOCK_BORROWER_PROFILE.address?.state ?? 'VIC',
  postcode: MOCK_BORROWER_PROFILE.address?.postcode ?? '',
  country: MOCK_BORROWER_PROFILE.address?.country ?? 'Australia',
  photoUrl: null,
}

// Dashboard timeline (case milestones) — green = completed, grey = future
export const MOCK_TIMELINE_EVENTS = [
  { id: 1, title: 'Default Notice Issued', description: 'Formal default notice issued under Section 57(2)(b) of National Credit Code', date: '15 Jan 2024', icon: 'document', completed: true },
  { id: 2, title: 'Independent Valuation', description: 'Independent valuation conducted by certified valuer', date: null, icon: 'document', completed: true },
  { id: 3, title: 'Listed for Auction', description: 'Property listed on Brickbanq MIP platform for investor bidding', date: '01 Mar 2024', icon: 'check', completed: true },
  { id: 4, title: 'Auction Active', description: 'Current highest bid: A$2,450,000 (5 active bidders)', date: '15 Mar 2024', icon: 'chart', completed: true },
  { id: 5, title: 'Auction End', description: 'Final bids and selection of winning investor', date: '05 Mar 2026', icon: 'clock', completed: false },
  { id: 6, title: 'Settlement', description: 'Property settlement and debt reconciliation', date: '12 Mar 2026', icon: 'dollar', completed: false },
]

// Identity / KYC verification — steps and status for borrower
export const MOCK_KYC_STEPS = [
  { step: 1, label: 'Account Details', sublabel: 'Enter your account information' },
  { step: 2, label: 'Identity Verification', sublabel: 'Upload your government ID' },
  { step: 3, label: 'Complete', sublabel: 'Finalise your verification' },
]
export const MOCK_KYC_DRAFT_KEY = 'borrower_kyc_draft'
export const MOCK_KYC_STATUS_KEY = 'borrower_kyc_status' // 'draft' | 'pending' | 'verified'

// Dashboard documents tab — uploaded (green cards) and pending (yellow card)
export const MOCK_BORROWER_DOCUMENTS = [
  { id: 1, title: 'Loan Agreement', uploadedDate: '15 Dec 2023', status: 'uploaded' },
  { id: 2, title: 'Valuation Report', uploadedDate: '20 Feb 2024', status: 'uploaded' },
  { id: 3, title: 'Credit Report', uploadedDate: '10 Dec 2023', status: 'uploaded' },
  { id: 4, title: 'Property Title', uploadedDate: '05 Jan 2024', status: 'uploaded' },
  { id: 5, title: 'Default Notice', uploadedDate: '15 Jan 2024', status: 'uploaded' },
  { id: 6, title: 'Settlement Statement', requirement: 'Required for settlement', status: 'pending' },
]

// My Case page: case messages (borrower left/grey, other party right/blue)
export const MOCK_MY_CASE_MESSAGES = [
  { id: 1, sender: 'Sarah Mitchell', role: 'Borrower', initials: 'SM', message: 'I have uploaded the additional property documentation as requested.', timestamp: 'about 6 hours ago', isBorrower: true },
  { id: 2, sender: 'David Williams', role: 'Investor', initials: 'DW', message: 'Thank you. Could you also provide the strata report?', timestamp: 'about 5 hours ago', isBorrower: false },
  { id: 3, sender: 'Sarah Mitchell', role: 'Borrower', initials: 'SM', message: 'Yes, I will upload it within the next hour.', timestamp: 'about 5 hours ago', isBorrower: true },
]

// My Case Documents tab: uploaded documents table
export const MOCK_MY_CASE_UPLOADED_DOCS = [
  { id: 'd1', name: 'Property Inspection Report.pdf', type: 'Inspection', uploadedBy: 'Sarah Mitchell', date: '02 Mar 2026' },
  { id: 'd2', name: 'Valuation Report.pdf', type: 'Valuation', uploadedBy: 'Preston Rowe Paterson', date: '15 Jan 2026' },
]

// Lawyer Review tab: document list (View/Download)
export const MOCK_LAWYER_REVIEW_DOCS = [
  { id: 'lr1', title: 'Loan Agreement' },
  { id: 'lr2', title: 'Mortgage Documents' },
  { id: 'lr3', title: 'Default Notice (Section 57)' },
  { id: 'lr4', title: 'Notice of Exercise of Power of Sale' },
  { id: 'lr5', title: 'Financial Hardship Assessment' },
  { id: 'lr6', title: 'Title Search' },
  { id: 'lr7', title: 'Valuation Report' },
  { id: 'lr8', title: 'Borrower Correspondence' },
  { id: 'lr9', title: 'Lender Authority' },
  { id: 'lr10', title: 'Settlement Statement' },
]

export const MOCK_ENFORCEMENT_STEPS = [
  { id: 'e1', label: 'Default Notice Issued (Section 57)', required: true, checked: false },
  { id: 'e2', label: 'Minimum 30-day notice period observed', required: true, checked: false },
  { id: 'e3', label: 'Notice of Exercise of Power of Sale issued', required: false, checked: false },
  { id: 'e4', label: 'All statutory notice periods complied with', required: true, checked: false },
  { id: 'e5', label: 'Good faith attempts to contact borrower documented', required: true, checked: false },
  { id: 'e6', label: 'Financial hardship assessment conducted', required: false, checked: false },
  { id: 'e7', label: 'Mortgagee duties complied with', required: true, checked: false },
]

export const MOCK_LOAN_COMPLIANCE_ITEMS = [
  { id: 'c1', label: 'No outstanding disputes or litigation', critical: true, checked: false },
  { id: 'c2', label: 'All notices properly served and documented', critical: true, checked: false },
  { id: 'c3', label: 'No cooling-off period violations', critical: true, checked: false },
  { id: 'c4', label: 'Interest calculations are correct', critical: false, checked: false },
  { id: 'c5', label: 'Fees and charges comply with loan agreement', critical: true, checked: false },
  { id: 'c6', label: 'No unconscionable conduct issues identified', critical: true, checked: false },
  { id: 'c7', label: 'Title search confirms no adverse encumbrances', critical: true, checked: false },
  { id: 'c8', label: 'Property can be legally sold', critical: true, checked: false },
  { id: 'c9', label: 'No bankruptcy or insolvency proceedings', critical: true, checked: false },
  { id: 'c10', label: 'All required statutory declarations obtained', critical: false, checked: false },
]

// Settlement tab: task summary and accordion groups
export const MOCK_SETTLEMENT_TASK_SUMMARY = {
  completed: 6,
  total: 18,
  inProgress: 5,
  overdue: 0,
  blocked: 0,
  estimatedCompletion: '08 Mar 2026',
  daysRemaining: 5,
}

export const MOCK_SETTLEMENT_GROUPS = [
  {
    id: 'legal',
    title: 'Legal Requirements',
    completed: 3,
    total: 5,
    progressPct: 60,
    tasks: [
      { id: 't1', title: 'Vendor Section 32 Statement Review', completed: true, priority: 'Critical', assignee: 'David Richardson', due: '25 Feb 2026', overdue: -5 },
      { id: 't2', title: 'Contract of Sale Review', completed: true, priority: 'Critical', assignee: 'Jennifer Wong', due: '27 Feb 2026', overdue: -3 },
      { id: 't3', title: 'Title Search & Certificate', completed: true, priority: 'High', assignee: 'Patricia Davies', due: '28 Feb 2026', overdue: -2 },
      { id: 't4', title: 'Mortgage Discharge Authority', completed: false, priority: 'High', assignee: 'Michael Stevens', due: '04 Mar 2026', overdue: 1, status: 'In Progress' },
      { id: 't5', title: 'Transfer of Land Documentation', completed: false, priority: 'Critical', assignee: 'Patricia Davies', due: '07 Mar 2026', overdue: 0 },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Settlement',
    completed: 1,
    total: 4,
    progressPct: 25,
    tasks: [
      { id: 't6', title: 'Final Settlement Figure Calculation', completed: true, priority: 'Critical', assignee: 'Thomas Chen', due: '01 Mar 2026', overdue: -1 },
      { id: 't7', title: 'Rates & Outgoings Adjustment', completed: false, priority: 'High', assignee: 'Thomas Chen', due: '03 Mar 2026', overdue: 0, status: 'In Progress' },
      { id: 't8', title: 'Bank Transfer Authorization', completed: false, priority: 'Critical', assignee: 'Financial Settlement Agent', due: '06 Mar 2026', overdue: 3 },
      { id: 't9', title: 'Payout to Existing Lender', completed: false, priority: 'Critical', assignee: 'Michael Stevens', due: '07 Mar 2026', overdue: 0 },
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation',
    completed: 1,
    total: 3,
    progressPct: 33,
    tasks: [
      { id: 't10', title: 'Building & Pest Inspection Report', completed: true, priority: 'High', assignee: 'Building Inspector', due: '23 Feb 2026', overdue: -7 },
      { id: 't11', title: 'Strata Documents Package', completed: false, priority: 'High', assignee: 'Strata Manager', due: '04 Mar 2026', overdue: 1, status: 'In Progress' },
      { id: 't12', title: 'Insurance Certificate', completed: false, priority: 'Medium', assignee: 'Insurance Broker', due: '05 Mar 2026', overdue: 2 },
    ],
  },
  {
    id: 'property-inspection',
    title: 'Property Inspection',
    completed: 0,
    total: 2,
    progressPct: 0,
    tasks: [
      { id: 't13', title: 'Final Property Walkthrough', completed: false, priority: 'High', assignee: 'Real Estate Agent', due: '06 Mar 2026', overdue: 0 },
      { id: 't14', title: 'Keys & Access Handover', completed: false, priority: 'Critical', assignee: 'Property Manager', due: '08 Mar 2026', overdue: 0 },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance & Regulatory',
    completed: 0,
    total: 2,
    progressPct: 0,
    tasks: [
      { id: 't15', title: 'Settlement Compliance Check', completed: false, priority: 'Critical', assignee: 'David Richardson', due: '05 Mar 2026', overdue: 0 },
      { id: 't16', title: 'Stamp Duty & Land Tax Clearance', completed: false, priority: 'High', assignee: 'Thomas Chen', due: '07 Mar 2026', overdue: 0 },
    ],
  },
  {
    id: 'party-communication',
    title: 'Party Communication',
    completed: 1,
    total: 2,
    progressPct: 50,
    tasks: [
      { id: 't17', title: 'All Parties Notified of Settlement Date', completed: true, priority: 'High', assignee: 'Jennifer Wong', due: '28 Feb 2026', overdue: -4 },
      { id: 't18', title: 'Final Confirmation from Lender', completed: false, priority: 'Critical', assignee: 'Michael Stevens', due: '06 Mar 2026', overdue: 0 },
    ],
  },
]

// ——— Settings: Organization ———
export const MOCK_ORGANIZATION = {
  name: 'Platinum Capital Partners',
  abn: '12 345 678 901',
  website: 'https://platinumcapital.com.au',
  phone: '+61 3 9123 4567',
  street: '123 Collins Street',
  city: 'Melbourne',
  postcode: '3000',
  state: 'VIC',
  industry: 'Financial Services',
  companySize: '50-100 employees',
}

export const MOCK_TEAM_MEMBERS = [
  { id: 1, name: 'Michael Chen', email: 'michael.chen@platinumcapital.com.au', role: 'Administrator', initials: 'MC', color: 'bg-purple-500' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@platinumcapital.com.au', role: 'Member', initials: 'SJ', color: 'bg-blue-500' },
  { id: 3, name: 'David Wilson', email: 'david.wilson@platinumcapital.com.au', role: 'Member', initials: 'DW', color: 'bg-purple-600' },
]

export const MOCK_BILLING = {
  plan: 'Professional Plan',
  price: 'A$299/month',
  billingCycle: 'Billed annually',
  nextBillingDate: '1 March 2026',
  cardLast4: '4242',
  cardExpires: '12/2025',
}

// ——— Settings: API Integrations ———
export const MOCK_API_INTEGRATIONS = [
  { id: 'infotrack', name: 'InfoTrack', description: 'Identity verification, KYC checks, title searches, and property verification', status: 'connected', lastTested: '3/1/2026, 6:09 AM', lastTestSuccess: true, fields: [{ label: 'API Key', value: '**************', masked: true }, { label: 'Client ID', value: 'BRICK001', masked: false }, { label: 'Environment', value: 'production', masked: false }] },
  { id: 'corelogic', name: 'RP Data / CoreLogic', description: 'Property data and valuations', status: 'connected', lastTested: '2/28/2026, 8:09 AM', lastTestSuccess: true, fields: [{ label: 'API Key', value: '**************', masked: true }, { label: 'Subscriber ID', value: 'SUB12345', masked: false }, { label: 'API Endpoint', value: 'https://api.corelogic.aska', masked: false }] },
  { id: 'equifax', name: 'Equifax', description: 'Credit reporting', status: 'connected', lastTested: '2/28/2026, 8:09 PM', lastTestSuccess: true, fields: [{ label: 'Username', value: 'brickbanq_api', masked: false }, { label: 'Password', value: '**************', masked: true }, { label: 'Customer ID', value: 'CUST789455', masked: false }] },
  { id: 'austrac', name: 'AUSTRAC Reporting', description: 'AML/CTF reporting', status: 'connected', lastTested: '3/1/2026, 2:09:09 AM', lastTestSuccess: true, fields: [{ label: 'Reporting Entity ID', value: 'RE987654321', masked: false }, { label: 'API Key', value: '**************', masked: true }, { label: 'Environment', value: 'production', masked: false }] },
  { id: 'docusign', name: 'DocuSign', description: 'E-signatures', status: 'disconnected', lastTested: null, lastTestSuccess: null, fields: [{ label: 'Integration Key', value: '', placeholder: 'Enter DocuSign Integration Key', masked: false }, { label: 'Account ID', value: '', placeholder: 'Enter Account ID', masked: false }, { label: 'User ID', value: '', placeholder: 'Enter User ID', masked: false }] },
  { id: 'xero', name: 'Xero', description: 'Accounting', status: 'disconnected', lastTested: null, lastTestSuccess: null, fields: [{ label: 'Client ID', value: '', placeholder: 'Enter Client ID', masked: false }, { label: 'Client Secret', value: '', placeholder: 'Enter Client Secret', masked: false }, { label: 'Tenant ID', value: '', placeholder: 'Enter Tenant ID', masked: false }] },
  { id: 'pexa', name: 'PEXA', description: 'Settlement', status: 'disconnected', lastTested: null, lastTestSuccess: null, fields: [{ label: 'Subscriber ID', value: '', placeholder: 'Enter Subscriber ID', masked: false }, { label: 'API Key', value: '', placeholder: 'Enter API Key', masked: false }, { label: 'Environment', value: 'production', placeholder: 'production or test', masked: false }] },
  { id: 'stripe', name: 'Stripe', description: 'Payments', status: 'error', lastTested: '3/1/2026, 7:09:09 AM', lastTestSuccess: false, fields: [{ label: 'Publishable Key', value: '', placeholder: 'pk_...', masked: false }, { label: 'Webhook Secret', value: 'Whsec...', masked: true }] },
]

// ——— Settings: Form Customization ———
export const MOCK_FORMS_LIST = [
  { id: 'case-creation', name: 'Case Creation Form', description: 'Main form for creating mortgage in possession cases' },
  { id: 'borrower-details', name: 'Borrower Details Form', description: 'Form for collecting borrower information' },
  { id: 'property-details', name: 'Property Details Form', description: 'Form for property information' },
  { id: 'lender-details', name: 'Lender Details Form', description: 'Form for lender information' },
  { id: 'kyc', name: 'KYC Verification Form', description: 'Form for Know Your Customer verification' },
]

// Field types for dropdown: Text, Number, Date, Currency, Textarea, Select
// icon: document | hash | person | dollar | textarea | select
// showAssigneeUi: when true, show Platform/Borrower dropdowns + assignee (David Williams, Investor, DW avatar)
export const MOCK_CUSTOM_FIELDS_BY_FORM = {
  'case-creation': [
    { id: 101, label: 'Property Manager Name', type: 'Text', required: false, icon: 'person', showAssigneeUi: false },
    { id: 102, label: 'Insurance Policy Number', type: 'Text', required: true, icon: 'document', showAssigneeUi: false },
    { id: 103, label: 'Expected Settlement Amount', type: 'Currency', required: false, icon: 'dollar', showAssigneeUi: false },
  ],
  'borrower-details': [
    { id: 201, label: 'Employer Name', type: 'Text', required: false, icon: 'document', showAssigneeUi: false },
    { id: 202, label: 'Years at Current Address', type: 'Number', required: false, icon: 'hash', showAssigneeUi: false },
  ],
  'property-details': [
    { id: 301, label: 'Property Management Company', type: 'Text', required: false, icon: 'document', showAssigneeUi: false },
    { id: 302, label: 'Council Rates Account', type: 'Text', required: false, icon: 'document', showAssigneeUi: false },
    { id: 303, label: 'Body Corporate Name', type: 'Text', required: false, icon: 'document', showAssigneeUi: false },
  ],
  'lender-details': [
    { id: 401, label: 'Internal Reference Number', type: 'Number', required: false, icon: 'hash', showAssigneeUi: false },
    { id: 402, label: 'Relationship Manager', type: 'Text', required: false, icon: 'person', showAssigneeUi: false },
  ],
  'kyc': [
    { id: 501, label: 'Source of Funds', type: 'Currency', required: true, icon: 'dollar', showAssigneeUi: false },
    { id: 502, label: 'Purpose of Transaction', type: 'Textarea', required: false, icon: 'textarea', showAssigneeUi: false },
  ],
}

// Legacy export for backwards compatibility (default to case-creation fields)
export const MOCK_CUSTOM_FIELDS = MOCK_CUSTOM_FIELDS_BY_FORM['case-creation'] || []

// ——— Settings: Security ———
export const MOCK_ACTIVE_SESSIONS = [
  { id: 1, device: 'MacBook Pro', location: 'Melbourne, VIC', lastActive: 'Just now', current: true },
  { id: 2, device: 'iOS', location: 'Sydney, NSW', lastActive: '2 hours ago', current: false },
  { id: 3, device: 'Windows PC', location: 'Chrome • Brisbane, QLD', lastActive: '1 day ago', current: false },
]

// ——— Settings: Notifications ———
export const MOCK_NOTIFICATION_PREFS = {
  email: [
    { id: 'deal-updates', label: 'Deal Updates', description: 'Get notified about new deals and opportunities', on: true },
    { id: 'auction-alerts', label: 'Auction Alerts', description: 'Notifications about auction start times and bid activity', on: true },
    { id: 'contract-reminders', label: 'Contract Reminders', description: 'Reminders to sign contracts and complete documentation', on: true },
    { id: 'payment-notifications', label: 'Payment Notifications', description: 'Alerts about payments, invoices, and transactions', on: true },
    { id: 'system-updates', label: 'System Updates', description: 'Platform updates, maintenance, and new features', on: false },
    { id: 'marketing-emails', label: 'Marketing Emails', description: 'Tips, insights, and product announcements', on: false },
  ],
  push: [
    { id: 'push-deal', label: 'Deal Updates', description: 'Instant alerts for new investment opportunities', on: true },
    { id: 'push-auction', label: 'Auction Alerts', description: 'Real-time auction activity and bid notifications', on: true },
    { id: 'push-bid', label: 'Bid Activity', description: "When someone outbids you or bids on your cases", on: true },
  ],
  sms: [
    { id: 'sms-critical', label: 'Critical Alerts', description: 'Urgent notifications requiring immediate action', on: true },
    { id: 'sms-auction', label: 'Auction Reminders', description: 'SMS reminders before auctions start', on: false },
    { id: 'sms-payment', label: 'Payment Alerts', description: 'Payment confirmations and receipts via SMS', on: true },
  ],
}

// ——— E-Signatures / GovSign (full dashboard, envelopes, certificates, evidence, admin) ———
export const MOCK_GOVSIGN_STATS = {
  pendingForMe: 3,
  awaitingOthers: 12,
  drafts: 5,
  expiringCertificates: 2,
}

export const MOCK_GOVSIGN_TASKS = [
  { id: 'ENV-2024-0001', title: 'Defence Procurement Contract - Project Nighthawk', type: 'Procurement', signed: '2/3 signed', sla: '23h 37m', tags: ['HSM-Backed', 'Witness Required'], hash: 'sha256:a7f39c2...', classification: 'URGENT' },
  { id: 'ENV-2024-0004', title: 'Deed of Guarantee with Witness Attestation', type: 'Deed', signed: '1/3 signed', sla: '71h 45m', tags: ['HSM-Backed', 'Witness Required'], hash: 'sha256:f9a9cb1...', classification: 'PROTECTED' },
]

export const MOCK_GOVSIGN_ALERTS = [
  { id: '1', type: 'certificate', title: 'Certificate Expiring', description: "Robert Taylor's certificate expires in 20 days", action: 'Renew Certificate' },
  { id: '2', type: 'hsm', title: 'HSM Key Rotation Scheduled', description: 'Next rotation: 2024-03-01 02:00 AEDT', action: null },
]

export const MOCK_GOVSIGN_ACTIVITY = [
  { id: '1', action: 'ENVELOPE CREATED', user: 'Sarah Johnson', hash: 'share.eoc...', time: '2024-02-21 14:26:53.123 AEDT' },
  { id: '2', action: 'DOCUMENT HASH COMPUTED', user: 'Sarah Johnson', hash: 'share.fEnBcKeC...', time: '2024-02-21 14:26:12.456 AEDT' },
  { id: '3', action: 'RECIPIENTS ADDED', user: 'Sarah Johnson', hash: 'share.uYbGcNc...', time: '2024-02-21 14:25:03.789 AEDT' },
  { id: '4', action: 'RISK ASSESSMENT COMPLETED', user: 'Approval System', hash: '', time: '2024-02-21 14:24:02.987 AEDT' },
  { id: '5', action: 'ENVELOPE APPROVED', user: 'John Smith (Approver)', hash: 'share.fZaKbZk...', time: '2024-02-21 14:20:13.345 AEDT' },
]

export const MOCK_GOVSIGN_ENVELOPES = [
  { id: 'MBI-2021-0001', title: 'Defence Procurement Contract - Project Nighthawk', sender: 'Sarah Johnson', type: 'Procurement', risk: 'URGENT', status: 'In Signing', progress: '2/3', progressVal: 2 / 3, sla: '23h 37m' },
  { id: 'MBI-2021-0002', title: 'Banking Loan Agreement - Commonwealth Infrastructure', sender: 'Michael Brown', type: 'Contract', risk: 'PROTECTED', status: 'Pending Approval', progress: '1/4', progressVal: 0.25, sla: '47h 12m' },
  { id: 'MBI-2021-0003', title: 'Company Resolution - Board Appointment s127', sender: 'Melissa Wilson', type: 'Board Resolution', risk: 'OFFICIAL', status: 'Completed', progress: '2/2', progressVal: 1, sla: 'Complete' },
  { id: 'MBI-2021-0004', title: 'Deed of Guarantee with Witness Attestation', sender: 'David Lee', type: 'Deed', risk: 'PROTECTED', status: 'In Signing', progress: '1/3', progressVal: 1 / 3, sla: '7h 45m' },
]

export const MOCK_GOVSIGN_DOCUMENTS = [
  { id: 'doc-1', name: 'Defence_Procurement_Contract_Nighthawk.pdf', type: 'PDF', size: '2.4 MB', uploadedDate: '2026-02-21', uploadedBy: 'Sarah Johnson', status: 'Signed', envelopeId: 'MBI-2021-0001', hash: 'sha256:a7f39c2...' },
  { id: 'doc-2', name: 'Banking_Loan_Agreement_Commonwealth.pdf', type: 'PDF', size: '1.8 MB', uploadedDate: '2026-02-20', uploadedBy: 'Michael Brown', status: 'Pending', envelopeId: 'MBI-2021-0002', hash: 'sha256:b8e4a1d...' },
  { id: 'doc-3', name: 'Board_Resolution_s127_Appointment.docx', type: 'DOCX', size: '456 KB', uploadedDate: '2026-02-19', uploadedBy: 'Melissa Wilson', status: 'Signed', envelopeId: 'MBI-2021-0003', hash: 'sha256:c9f5b2e...' },
  { id: 'doc-4', name: 'Deed_of_Guarantee_Witness.pdf', type: 'PDF', size: '3.1 MB', uploadedDate: '2026-02-18', uploadedBy: 'David Lee', status: 'In Signing', envelopeId: 'MBI-2021-0004', hash: 'sha256:d0a6c3f...' },
]

export const MOCK_GOVSIGN_TEMPLATES = [
  { id: 'tpl-1', name: 'Procurement Contract Standard', type: 'Procurement', description: 'Standard defence procurement contract with witness attestation', lastUsed: '2026-02-21', createdDate: '15 Jan 2025', usageCount: 24 },
  { id: 'tpl-2', name: 'Loan Agreement - Banking', type: 'Contract', description: 'Banking loan agreement template with dual signer flow', lastUsed: '2026-02-20', createdDate: '1 Feb 2025', usageCount: 18 },
  { id: 'tpl-3', name: 'Board Resolution s127', type: 'Board Resolution', description: 'Company resolution template for director appointments', lastUsed: '2026-02-19', createdDate: '10 Mar 2025', usageCount: 12 },
  { id: 'tpl-4', name: 'Deed of Guarantee with Witness', type: 'Deed', description: 'Deed of guarantee requiring physical witness', lastUsed: '2026-02-18', createdDate: '20 Jan 2025', usageCount: 31 },
]

export const MOCK_GOVSIGN_HSM_CLUSTER = {
  primary: 'HSM-CLUSTER-01-SYD: Active',
  secondary: 'HSM-CLUSTER-02-SYD: Standby',
  region: 'Australia (Sydney)',
  certified: 'FIPS 140-2 Level 3 Certified',
}

export const MOCK_GOVSIGN_CERTIFICATES = [
  { id: 'cert-1', subject: 'CN=Sarah Johnson, O=Defence, OU=Procurement, C=AU', issuer: 'GovSign Root CA - Defence', serial: '3A:2E:82:3F:88:AC:20:96', algorithm: 'RSA-2048 + SHA-512', validFrom: '2023-08-15', validTo: '2025-08-01', status: 'Active', tags: ['HSM-Backed', 'SECRET'] },
  { id: 'cert-2', subject: 'CN=Michael Brown, O=Commonwealth Bank, OU=Legal, C=AU', issuer: 'GovSign Root CA - Banking', serial: '2a:3d:14:18:1b:2c:30:96', algorithm: 'ECDSA P-384 + SHA-384', validFrom: '2023-09-21', validTo: '2025-09-21', status: 'Active', tags: ['HSM-Backed', 'PROTECTED'] },
  { id: 'cert-3', subject: 'CN=Emma Wilson, O=Corporate Services, OU=Company Secretary, C=AU', issuer: 'GovSign Root CA - Corporate', serial: '2c:4f:16:1a:1d:2e:32:a0', algorithm: 'RSA-2048 + SHA-512', validFrom: '2024-01-10', validTo: '2026-01-10', status: 'Active', tags: ['HSM-Backed', 'OFFICIAL'] },
  { id: 'cert-4', subject: 'CN=Robert Taylor, O=Defence, OU=Intelligence, C=AU', issuer: 'GovSign Root CA - Defence', serial: '28:02:16:1B:1E:30:B0:0C', algorithm: 'RSA-2048 + SHA-512', validFrom: '2024-08-20', validTo: '2026-08-20', status: 'Expiring', expiringIn: '28 days', tags: ['HSM-Backed', 'TOP SECRET'] },
]

export const MOCK_GOVSIGN_EVIDENCE_CHAIN = {
  totalEvents: 24567,
  chainIntegrity: 'Verified',
  lastEvent: '2 minutes ago',
}

export const MOCK_GOVSIGN_EVIDENCE_EVENTS = [
  { id: 'EVT-0001', type: 'ENVELOPE_CREATED', actor: 'Sarah Johnson', originIp: '192.168.1.1', eventHash: 'sha256:d1c9ef0d...', previousHash: 'Genesis Event', timestamp: '2026-02-21 16:30:00.000 (UTC)', device: 'Windows 11 - Chrome 121', auth: 'FIDO2 + MFA', genesis: true },
  { id: 'EVT-0002', type: 'DOCUMENT_HASH_COMPUTED', actor: 'Sarah Johnson', originIp: '192.168.1.1', eventHash: 'sha256:a1b2c3d4...', previousHash: 'sha256:d1c9ef0d...', timestamp: '2026-02-21 16:29:45.000 (UTC)', device: 'Windows 11 - Chrome 121', auth: 'Session MFA' },
  { id: 'EVT-0003', type: 'RECIPIENTS_ADDED', actor: 'Sarah Johnson', originIp: '192.168.1.1', eventHash: 'sha256:e5f6a7b8...', previousHash: 'sha256:a1b2c3d4...', timestamp: '2026-02-21 16:29:30.000 (UTC)', device: 'Windows 11 - Chrome 121', auth: 'FIDO2 + MFA' },
  { id: 'EVT-0004', type: 'RISK_ASSESSMENT_COMPLETED', actor: 'Approval System', originIp: '10.0.0.1', eventHash: 'sha256:c9d0e1f2...', previousHash: 'sha256:e5f6a7b8...', timestamp: '2026-02-21 16:29:15.000 (UTC)', device: 'System', auth: null },
  { id: 'EVT-0009', type: 'HSM_SIGNATURE_APPLIED', actor: 'System', originIp: '10.0.0.1', eventHash: 'sha256:28:02:16:1B...', previousHash: 'sha256:c9d0e1f2...', timestamp: '2026-02-21 16:29:00.000 (UTC)', device: 'HSM Cluster', auth: 'HSM', certificateSerial: '28:02:16:1B...B0:0C', hsmCluster: 'HSM-CLUSTER-01-SYD', algorithm: 'ECDSAP256+SHA-256', tsa: 'E-SIGN-TSA-GOV-AU' },
]

export const MOCK_GOVSIGN_ADMIN_SOVEREIGNTY = [
  { id: 'primary', label: 'Primary Region', value: 'Australia (Sydney) - LOCKED', locked: true },
  { id: 'tenant', label: 'Tenant Isolation', description: 'Dedicated infrastructure per organisation', enabled: true },
  { id: 'cross', label: 'Cross-Border Data Transfer', description: 'Prevent data leaving Australian jurisdiction', enabled: true },
]

export const MOCK_GOVSIGN_ADMIN_POLICIES = [
  { id: '1', title: 'Deed Execution Requires Witness', description: 'If doc type = deed, require witness attestation', scope: 'All organisations', modified: '2024-01-19 by System Admin', status: 'Active' },
  { id: '2', title: 'High Risk Requires FIDO2', description: 'If risk >= PROTECTED, require FIDO authentication', scope: 'Defence, Banking', modified: '2024-03-01 by Security Admin', status: 'Active' },
  { id: '3', title: 'External Signer Approval Required', description: 'If external signer, require step-up auth + approval gate', scope: 'All organisations', modified: '2023-12-10 by Org Admin', status: 'Active' },
  { id: '4', title: 'SECRET Classification No Email', description: 'If classification >= SECRET, block email notifications', scope: 'Defence, Intelligence', modified: '2024-01-20 by Security Admin', status: 'Active' },
]

export const MOCK_GOVSIGN_ADMIN_SECURITY = [
  { id: 'dual', title: 'Dual Control for Certificate Issuance', description: 'Require two admins to approve certificate creation', enabled: true },
  { id: 'audit', title: 'Immutable Audit Logging', description: 'All actions logged to tamper-proof ledger', enabled: true },
  { id: 'rotation', title: 'HSM Key Rotation', description: 'Automatic key rotation every 90 days', enabled: true },
  { id: 'breakglass', title: 'Break Glass Emergency Access', description: 'Enable emergency access with dual approval', enabled: true },
]

// Reports: report types and generated reports list
export const MOCK_GOVSIGN_REPORT_TYPES = [
  { id: 'envelope-summary', name: 'Envelope Summary', description: 'Overview of all envelopes by status and type' },
  { id: 'signing-activity', name: 'Signing Activity', description: 'Signing events and completion rates' },
  { id: 'certificate-expiry', name: 'Certificate Expiry', description: 'Certificates expiring in the next 90 days' },
  { id: 'audit-trail', name: 'Audit Trail', description: 'Evidence ledger export for compliance' },
]

export const MOCK_GOVSIGN_REPORTS = [
  { id: 'rpt-1', name: 'Envelope Summary - Feb 2026', type: 'envelope-summary', generatedAt: '2026-02-21 10:00 AEDT', dateFrom: '2026-02-01', dateTo: '2026-02-21', status: 'Ready' },
  { id: 'rpt-2', name: 'Signing Activity - Jan 2026', type: 'signing-activity', generatedAt: '2026-02-01 09:15 AEDT', dateFrom: '2026-01-01', dateTo: '2026-01-31', status: 'Ready' },
  { id: 'rpt-3', name: 'Certificate Expiry - Q1 2026', type: 'certificate-expiry', generatedAt: '2026-02-15 14:30 AEDT', dateFrom: '2026-01-01', dateTo: '2026-03-31', status: 'Ready' },
]

// Help: FAQ and help sections (dynamic content)
export const MOCK_GOVSIGN_HELP_FAQ = [
  { id: 'faq-1', question: 'How do I create and send an envelope?', answer: 'Click Create Envelope from the Dashboard or Envelopes tab. Add your document, set recipients and signing order, then send. Recipients will receive an email with a link to sign.' },
  { id: 'faq-2', question: 'What is HSM-backed signing?', answer: 'GovSign uses Hardware Security Modules (HSMs) to store signing keys. This provides the highest assurance level for digital signatures and meets government and banking compliance requirements.' },
  { id: 'faq-3', question: 'How do I renew an expiring certificate?', answer: 'Go to Certificates & Keys, find the certificate with "Expiring" status, and click Renew. Your administrator may need to approve the renewal request.' },
  { id: 'faq-4', question: 'Where can I see the audit trail?', answer: 'The Evidence Ledger tab shows a tamper-proof chain of all signing and system events. You can export a proof bundle for compliance or legal purposes.' },
  { id: 'faq-5', question: 'What document types are supported?', answer: 'PDF is required for signing. You can upload PDFs when creating an envelope. Templates can be created from existing envelopes for reuse.' },
]

export const MOCK_GOVSIGN_HELP_LINKS = [
  { id: 'doc-getting-started', label: 'Getting Started Guide', url: '#', description: 'Step-by-step setup and first envelope' },
  { id: 'doc-api', label: 'API Documentation', url: '#', description: 'Integrate GovSign with your systems' },
  { id: 'doc-compliance', label: 'Compliance & Standards', url: '#', description: 'eIDAS, ESIGN, and local requirements' },
]
