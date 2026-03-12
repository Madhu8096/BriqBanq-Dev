/**
 * Mock data for Lawyer Panel. All data from Figma. Backend-ready.
 */

export const MOCK_USER = {
  name: 'David Williams',
  role: 'Investor',
  initials: 'DW',
}

// Dashboard - Overview cards (Figma: 247, A$15.8M, 1,284, 12)
export const MOCK_DASHBOARD_STATS = [
  { id: 'totalCases', label: 'Total Cases', value: 247, subtitle: '89 active • 34 listed', trend: 12, trendUp: true, icon: 'folder' },
  { id: 'totalSales', label: 'Total Sales', value: 'A$15.8M', subtitle: 'Avg: A$1053K per deal', trend: 23, trendUp: true, icon: 'dollar' },
  { id: 'platformUsers', label: 'Platform Users', value: '1,284', subtitle: '8 pending KYC', trend: 18, trendUp: true, icon: 'users' },
  { id: 'activeAuctions', label: 'Active Auctions', value: 12, subtitle: 'Success rate: 94.2%', trend: 94.2, trendUp: true, icon: 'gavel' },
]

// Dashboard - Monthly Overview
export const MOCK_MONTHLY_OVERVIEW = {
  range: 'Last 7 Months',
  casesCreated: 38,
  salesVolume: 'A$5.9M',
  months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
}

// Dashboard - Platform Status
export const MOCK_PLATFORM_STATUS = [
  { id: 'live', label: 'Live Auctions', value: 12, detail: 'Total Bids: 87 • Avg: 7.2 bids/auction', color: 'blue', icon: 'gavel' },
  { id: 'pending', label: 'Pending Approvals', value: 8, detail: 'KYC: 8 • Cases: 3 • Contracts: 2', color: 'orange', icon: 'clock' },
  { id: 'completed', label: 'Completed This Week', value: 24, detail: 'Sales: 5 • Value: A$6.2M', color: 'green', icon: 'check' },
  { id: 'attention', label: 'Requires Attention', value: 3, detail: 'Disputes: 2 • Escalations: 1', color: 'red', icon: 'exclamation' },
]

// Dashboard - Recent Cases (Figma: MIP-2024-047 etc.)
export const MOCK_RECENT_CASES = [
  { id: 'MIP-2024-047', tag: 'LIVE', tagColor: 'blue', title: 'Bondi Beach Apartment', price: 'A$1,250,000', bids: '8 bids', time: '2h 34m' },
  { id: 'MIP-2024-046', tag: 'BUY NOW', tagColor: 'green', title: 'Melbourne CBD Office', price: 'A$2,150,000', bids: '0 bids', time: 'Buy Now' },
  { id: 'MIP-2024-045', tag: 'SOLD', tagColor: 'grey', title: 'Brickbanq MIP PLATFORM', price: null, bids: '12 bids', time: null, hasMenu: true },
  { id: 'MIP-2024-044', tag: 'LIVE', tagColor: 'blue', title: 'Brisbane Townhouse', price: 'A$675,000', bids: '5 bids', time: '5h 12m' },
  { id: 'MIP-2024-043', tag: null, title: 'Perth Retail Space', price: 'A$1,420,000', bids: '0 bids', time: 'Pending' },
]

// Dashboard - Recent Sales
export const MOCK_RECENT_SALES = [
  { id: 'MIP-2024-042', title: 'Gold Coast Villa', company: 'Platinum Capital', amount: 'A$1850K', change: '+A$125K', time: '2h ago' },
  { id: 'MIP-2024-041', title: 'Adelaide Duplex', company: 'Urban Investors', amount: 'A$720K', change: '+A$82K', time: '4h ago' },
  { id: 'MIP-2024-040', title: 'Brickbanq Platform', company: null, amount: 'A$1100K', change: null, time: null },
  { id: 'MIP-2024-039', title: 'Darwin Commercial', company: 'Northern Assets', amount: 'A$980K', change: '+A$68K', time: '1d ago' },
  { id: 'MIP-2024-038', title: 'Hobart Warehouse', company: 'Southern Property', amount: 'A$1350K', change: '+A$110K', time: '2d ago' },
]

// Dashboard - Quick Actions
export const MOCK_QUICK_ACTIONS = [
  { id: 'kyc', label: 'Review KYC', sub: '8 pending', icon: 'eye', path: '/lawyer/kyc-review' },
  { id: 'cases', label: 'Manage Cases', sub: '89 active', icon: 'folder', path: '/lawyer/assigned-cases' },
  { id: 'reports', label: 'View Reports', sub: 'Generate', icon: 'chart', path: '/lawyer/reports' },
  { id: 'admin', label: 'Admin Console', sub: 'Full access', icon: 'building', path: '/lawyer/admin-console' },
]

// Assigned Cases - table (Figma: full address lines, valuation)
export const MOCK_CASES = [
  { id: 'MIP-2026-001', caseNumber: 'MIP-2026-001', borrower: 'Sarah Mitchell', propertyAddress: '45 Victoria Street', propertySuburb: 'Potts Point, NSW', debt: 'A$980k', valuation: 'A$1250k', status: 'In Auction', risk: 'Medium Risk', created: '10 Jan 2026' },
  { id: 'MIP-2026-002', caseNumber: 'MIP-2026-002', borrower: 'James Chen', propertyAddress: '128 Brighton Boulevard', propertySuburb: 'North Bondi, NSW', debt: 'A$2100k', valuation: 'A$3200k', status: 'Active', risk: 'Low Risk', created: '18 Jan 2026' },
  { id: 'MIP-2026-003', caseNumber: 'MIP-2026-003', borrower: 'Emma Rodriguez', propertyAddress: '7 Park Lane', propertySuburb: 'South Yarra, VIC', debt: 'A$1600k', valuation: 'A$1850k', status: 'Active', risk: 'Low Risk', created: '25 Jan 2026' },
  { id: 'MIP-2026-004', caseNumber: 'MIP-2026-004', borrower: 'Michael Thompson', propertyAddress: '92 George Street', propertySuburb: 'Brisbane CBD, QLD', debt: 'A$480k', valuation: 'A$520k', status: 'Pending', risk: 'High Risk', created: '02 Feb 2026' },
]

export const MOCK_CASE_STATS = {
  total: 4,
  active: 2,
  inAuction: 1,
  completed: 0,
}

// Contracts (Figma: property thumbnail, Contract ID, Parties, Value, Date, Status)
export const MOCK_CONTRACTS = [
  { id: 'MIP-2026-003', propertyAddress: '7 Park Lane', propertySuburb: 'South Yarra, VIC', contractId: 'MIP-2026-003', parties: 'Emma Rodriguez', partiesSub: 'ANZ', value: '$1,750,000', createdDate: '25 Jan 2026', status: 'Under Contract', statusVariant: 'purple' },
  { id: 'MIP-2026-005', propertyAddress: '156 Stirling Highway', propertySuburb: 'Nedlands, WA', contractId: 'MIP-2026-005', parties: 'Lisa Anderson', partiesSub: 'Macquarie Bank', value: '$2,650,000', createdDate: '15 Jan 2026', status: 'Completed', statusVariant: 'green' },
]

// Task Center — same shape as borrower (desc, dueLabel, status: Pending|InProgress|Completed|Overdue)
function task(id, title, desc, status, priority, dueLabel, caseId, module, tags = []) {
  return { id, title, desc, status, priority, dueLabel, caseId, module, tags }
}
export const MOCK_TASKS = [
  task('t1', 'Update accounting records - February entries', 'Reconcile bank statements and update ledger', 'Completed', 'Low', 'Overdue (Mar 1)', null, 'Accounting', ['Accounting', 'Reconciliation']),
  task('t2', 'Follow up with client - Contract of Sale', 'Review and send contract', 'Overdue', 'High', 'Overdue (Mar 2)', 'MIP-2026-002', 'Brickbanq', ['Client Communication']),
  task('t3', 'Verify enforcement steps for MIP-2026-002', 'Check enforcement checklist', 'Pending', 'Urgent', 'Due Today', 'MIP-2026-002', 'Legal Review', ['Compliance']),
  task('t4', 'Upload Statement of Advice', 'Upload signed SOA', 'InProgress', 'High', 'Tomorrow', 'MIP-2026-001', 'Documentation', ['Documentation']),
  task('t5', 'Review loan documentation for MIP-2026-001', 'Full doc review', 'Pending', 'High', 'Mar 5, 2026', 'MIP-2026-001', 'Brickbanq', ['Legal Review']),
  task('t6', 'AML/CTF client verification - New Trust Account', 'Brickbanq MIP PLATFORM', 'Pending', 'Medium', 'Mar 6, 2026', null, 'AML/CTF', ['Compliance']),
  task('t7', 'Review PEXA workspace documents', 'Settlement docs', 'Pending', 'Medium', 'Mar 8, 2026', 'MIP-2026-003', 'Brickbanq', ['Settlement']),
  task('t8', 'Prepare monthly compliance report', 'Compliance summary', 'InProgress', 'Medium', 'Mar 10, 2026', null, 'Compliance', ['Compliance', 'Reporting']),
]

export const MOCK_TASK_STATS = {
  active: 7,
  overdue: 1,
  dueToday: 1,
  urgent: 1,
  inProgress: 2,
  completed: 1,
}

// Notifications (Figma: New Bid Placed, New Message, etc.)
export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New Bid Placed', description: 'A new bid of A$1,100,000 has been placed on MIP-2024-001', type: 'bid', unread: true, time: 'about 16 hours ago' },
  { id: 'n2', title: 'New Message', description: 'You have a new message from the lender.', type: 'message', unread: true, time: '1 day ago' },
  { id: 'n3', title: 'Auction Ending Soon', description: 'MIP-2024-047 ends in 2 hours.', type: 'system', unread: false, time: '2 days ago' },
  { id: 'n4', title: 'Brickbanq', description: 'Platform update available.', type: 'system', unread: false, time: '3 days ago' },
  { id: 'n5', title: 'KYC Approved', description: 'James Chen - identity verified.', type: 'kyc', unread: false, time: '3 days ago' },
  { id: 'n6', title: 'Contract Ready for Signature', description: 'Defence Procurement Contract ready for your signature.', type: 'contract', unread: true, time: '5 days ago' },
  { id: 'n7', title: 'Payment Received', description: 'A$2,500 trust account deposit.', type: 'payment', unread: false, time: '1 week ago' },
]

export const MOCK_NOTIFICATION_STATS = { unread: 3, total: 7, thisWeek: 7 }

// Settings - Profile (Figma) — same shape as borrower for Settings page
export const MOCK_PROFILE = {
  firstName: 'David',
  lastName: 'Williams',
  email: 'david.williams@example.com',
  phone: '+61 412 345 678',
  company: 'Platinum Capital Partners',
  jobTitle: 'Investment Manager',
  bio: 'Experienced investment professional specializing in distressed asset management and mortgage investment opportunities.',
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
  // legacy flat fields for existing lawyer components
  streetAddress: '123 Collins Street',
  city: 'Melbourne',
  state: 'VIC',
  postcode: '3000',
  country: 'Australia',
  aboutMe: 'Experienced investment professional specializing in distressed asset management and mortgage investment opportunities.',
  aboutMeLength: 118,
  aboutMeMax: 500,
  photoUrl: null,
}

// Settings - Organization (same as borrower)
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
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@platinumcapital.com.au', role: 'Member', initials: 'SJ', color: 'bg-[#3474E1]' },
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

// Same as borrower panel for Settings parity (API Integrations, Form Customization, Security)
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

export const MOCK_FORMS_LIST = [
  { id: 'case-creation', name: 'Case Creation Form', description: 'Main form for creating mortgage in possession cases' },
  { id: 'borrower-details', name: 'Borrower Details Form', description: 'Form for collecting borrower information' },
  { id: 'property-details', name: 'Property Details Form', description: 'Form for property information' },
  { id: 'lender-details', name: 'Lender Details Form', description: 'Form for lender information' },
  { id: 'kyc', name: 'KYC Verification Form', description: 'Form for Know Your Customer verification' },
]

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

export const MOCK_ACTIVE_SESSIONS = [
  { id: 1, device: 'MacBook Pro', location: 'Melbourne, VIC', lastActive: 'Just now', current: true },
  { id: 2, device: 'iOS', location: 'Sydney, NSW', lastActive: '2 hours ago', current: false },
  { id: 3, device: 'Windows PC', location: 'Chrome • Brisbane, QLD', lastActive: '1 day ago', current: false },
]

export const MOCK_NOTIFICATION_PREFS = {
  email: [
    { id: 'deal-updates', label: 'Deal Updates', description: 'Get notified about new deals', on: true },
    { id: 'auction-alerts', label: 'Auction Alerts', description: 'Notifications about auction activity', on: true },
    { id: 'contract-reminders', label: 'Contract Reminders', description: 'Reminders to sign contracts', on: true },
  ],
  push: [
    { id: 'push-deal', label: 'Deal Updates', description: 'Instant alerts', on: true },
    { id: 'push-auction', label: 'Auction Alerts', description: 'Real-time auction notifications', on: true },
  ],
  sms: [
    { id: 'sms-critical', label: 'Critical Alerts', description: 'Urgent notifications', on: true },
    { id: 'sms-payment', label: 'Payment Alerts', description: 'Payment confirmations via SMS', on: true },
  ],
}

// E-Signatures / GovSign (Figma)
export const MOCK_ESIGNATURE_STATS = {
  pendingForMe: 3,
  awaitingOthers: 12,
  drafts: 5,
  expiringCertificates: 2,
}

export const MOCK_ESIGNATURE_TASKS = [
  { id: 'e1', title: 'Defence Procurement Contract - Project Nighthawk', envId: 'ENV-2024-0001', category: 'Procurement', signed: '2/3 signed', sla: '23h 37m', slaColor: 'green', classification: 'SECRET', hash: 'sha256:a7f3b9c2...' },
  { id: 'e2', title: 'Deed of Guarantee with Witness Attestation', envId: 'ENV-2024-0004', category: 'Deed', signed: '1/3 signed', sla: '71h 45m', slaColor: 'orange', classification: 'PROTECTED', hash: 'sha256:f2a9c6b1...' },
]

export const MOCK_ESIGNATURE_ALERTS = [
  { id: 'a1', type: 'cert', title: 'Certificate Expiring', description: "Robert Taylor's certificate expires in 28 days", action: 'Renew Certificate' },
  { id: 'a2', type: 'hsm', title: 'HSM Key Rotation Scheduled', description: 'Next rotation: 2024-03-01 02:00 AEDT' },
]

export const MOCK_ESIGNATURE_ACTIVITY = [
  { id: 'ev1', action: 'ENVELOPE CREATED', user: 'Sarah Johnson', hash: 'sha256:e7d3a9f2b1c8...', time: '2024-02-21 14:23:45.123 AEDT' },
  { id: 'ev2', action: 'DOCUMENT HASH COMPUTED', user: 'Sarah Johnson', hash: 'sha256:f8e4b0c3d2a9...', time: '2024-02-21 14:25:03.789 AEDT' },
  { id: 'ev3', action: 'ENVELOPE APPROVED', user: 'John Smith (Approver)', hash: 'sha256:c3d4e5f6a7b8...', time: '2024-02-21 14:28:17.345 AEDT' },
]

// GovSign full UI (same shape as borrower for ESignatures page)
export const MOCK_GOVSIGN_STATS = { pendingForMe: 3, awaitingOthers: 12, drafts: 5, expiringCertificates: 2 }
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
export const MOCK_GOVSIGN_HSM_CLUSTER = { primary: 'HSM-CLUSTER-01-SYD: Active', secondary: 'HSM-CLUSTER-02-SYD: Standby', region: 'Australia (Sydney)', certified: 'FIPS 140-2 Level 3 Certified' }
export const MOCK_GOVSIGN_CERTIFICATES = [
  { id: 'cert-1', subject: 'CN=Sarah Johnson, O=Defence, OU=Procurement, C=AU', issuer: 'GovSign Root CA - Defence', serial: '3A:2E:82:3F:88:AC:20:96', algorithm: 'RSA-2048 + SHA-512', validFrom: '2023-08-15', validTo: '2025-08-01', status: 'Active', tags: ['HSM-Backed', 'SECRET'] },
  { id: 'cert-2', subject: 'CN=Michael Brown, O=Commonwealth Bank, OU=Legal, C=AU', issuer: 'GovSign Root CA - Banking', serial: '2a:3d:14:18:1b:2c:30:96', algorithm: 'ECDSA P-384 + SHA-384', validFrom: '2023-09-21', validTo: '2025-09-21', status: 'Active', tags: ['HSM-Backed', 'PROTECTED'] },
  { id: 'cert-3', subject: 'CN=Emma Wilson, O=Corporate Services, OU=Company Secretary, C=AU', issuer: 'GovSign Root CA - Corporate', serial: '2c:4f:16:1a:1d:2e:32:a0', algorithm: 'RSA-2048 + SHA-512', validFrom: '2024-01-10', validTo: '2026-01-10', status: 'Active', tags: ['HSM-Backed', 'OFFICIAL'] },
  { id: 'cert-4', subject: 'CN=Robert Taylor, O=Defence, OU=Intelligence, C=AU', issuer: 'GovSign Root CA - Defence', serial: '28:02:16:1B:1E:30:B0:0C', algorithm: 'RSA-2048 + SHA-512', validFrom: '2024-08-20', validTo: '2026-08-20', status: 'Expiring', expiringIn: '28 days', tags: ['HSM-Backed', 'TOP SECRET'] },
]
export const MOCK_GOVSIGN_EVIDENCE_CHAIN = { totalEvents: 24567, chainIntegrity: 'Verified', lastEvent: '2 minutes ago' }
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
