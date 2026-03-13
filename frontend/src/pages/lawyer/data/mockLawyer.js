/**
 * Mock data for Lawyer Panel. Replace with API/WebSocket data later.
 */

export const MOCK_USER = {
  name: 'David Williams',
  role: 'Investor',
  initials: 'DW',
}

export const MOCK_CASES = [
  {
    id: 'MIP-2026-001',
    caseNumber: 'MIP-2026-001',
    borrower: 'Sarah Mitchell',
    property: '45 Victoria Street, Punt Road, VIC',
    debt: 'A$980k',
    valuation: 'A$1250k',
    status: 'In Auction',
    risk: 'Medium Risk',
    created: '10 Jan 2026',
  },
  {
    id: 'MIP-2026-002',
    caseNumber: 'MIP-2026-002',
    borrower: 'James Chen',
    property: '128 Brighton Boulevard, North Bondi, NSW',
    debt: 'A$2100k',
    valuation: 'A$3200k',
    status: 'Active',
    risk: 'Low Risk',
    created: '18 Jan 2026',
  },
  {
    id: 'MIP-2026-003',
    caseNumber: 'MIP-2026-003',
    borrower: 'Emma Rodriguez',
    property: '7 Park Lane, South Yarra, VIC',
    debt: 'A$1600k',
    valuation: 'A$1850k',
    status: 'Active',
    risk: 'Low Risk',
    created: '25 Jan 2026',
  },
  {
    id: 'MIP-2026-004',
    caseNumber: 'MIP-2026-004',
    borrower: 'Michael Thompson',
    property: '92 George Street, Brisbane CBD, QLD',
    debt: 'A$480k',
    valuation: 'A$520k',
    status: 'Pending',
    risk: 'High Risk',
    created: '02 Feb 2026',
  },
]

export const MOCK_CASE_STATS = {
  total: 4,
  active: 2,
  inAuction: 1,
  completed: 0,
}

/** Dashboard overview (matches design: Total Cases, Total Sales, Platform Users, Active Auctions) */
export const MOCK_DASHBOARD_STATS = [
  { id: 'totalCases', label: 'Total Cases', value: 247, trend: -7, trendUp: false, description: '89 Active, 22 Sold/Completed', icon: 'briefcase' },
  { id: 'totalSales', label: 'Total Sales', value: 'A$15.8M', trend: 12, trendUp: true, description: 'Avg: A$352.0K per deal', icon: 'dollar' },
  { id: 'platformUsers', label: 'Platform Users', value: '1,284', trend: 23, trendUp: true, description: '6 pending KYC', icon: 'users' },
  { id: 'activeAuctions', label: 'Active Auctions', value: 12, trend: -4.2, trendUp: false, description: 'Success Rate: 84.2%', icon: 'gavel' },
]

/** Monthly overview chart: last 7 months */
export const MOCK_MONTHLY_OVERVIEW = {
  months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  casesCreated: [18, 22, 28, 24, 31, 35, 30],
  salesVolume: [2.1, 2.8, 3.2, 3.8, 4.2, 4.8, 5.2],
  salesVolumeLabel: 'A$5.2M',
}

/** Platform status rows for dashboard */
export const MOCK_PLATFORM_STATUS = [
  { id: 'live', label: 'Live Auctions', count: 12, color: 'blue', detail: 'Total Bids: 87 - Avg: 7.2 bids/auction', icon: 'rocket' },
  { id: 'pending', label: 'Pending Approvals', count: 8, color: 'orange', detail: 'KYC: 6 - Contracts: 2', icon: 'clock' },
  { id: 'completed', label: 'Completed This Week', count: 24, color: 'green', detail: 'Sales: 5 - Value: A$5.2M', icon: 'check' },
  { id: 'attention', label: 'Requires Attention', count: 3, color: 'red', detail: 'Disputes: 2 - Escalations: 1', icon: 'exclamation' },
]

/** Recent cases for dashboard (id, status, property, location, price, bids) */
export const MOCK_RECENT_CASES = [
  { id: 'KRP-2023-012', status: 'FOR SALE', property: 'Bondi Beach Apartment', location: 'Sydney, NSW', price: 'A$1,250,000', bids: '0 bids' },
  { id: 'KRP-2023-011', status: 'BUY NOW', property: 'Melbourne CBD Office', location: 'Melbourne, VIC', price: 'A$2,100,000', bids: '12 bids' },
  { id: 'KRP-2023-010', status: 'SOLD', property: 'Gold Coast Villa', location: 'Gold Coast, QLD', price: 'A$980,000', bids: '5 bids' },
  { id: 'KRP-2023-009', status: 'Pending', property: 'Adelaide Duplex', location: 'Adelaide, SA', price: 'A$720,000', bids: '2 bids' },
]

/** Recent sales for dashboard */
export const MOCK_RECENT_SALES = [
  { id: 'KRP-2023-012', status: 'SOLD', property: 'Gold Coast Villa', location: 'Gold Coast, QLD', price: 'A$1350K', timeAgo: '2m ago' },
  { id: 'KRP-2023-011', status: 'SOLD', property: 'Adelaide Duplex', location: 'Adelaide, SA', price: 'A$720K', timeAgo: '19m ago' },
  { id: 'KRP-2023-010', status: 'SOLD', property: 'Brisbane Townhouse', location: 'Brisbane, QLD', price: 'A$890K', timeAgo: '1d ago' },
]

/** Quick action cards for dashboard */
export const MOCK_QUICK_ACTIONS = [
  { id: 'reviewKyc', label: 'Review KYC', sub: '8 pending', icon: 'eye', path: '/admin/kyc-review' },
  { id: 'manageCases', label: 'Manage Cases', sub: '9 active', icon: 'briefcase', path: '/lawyer/assigned-cases' },
  { id: 'viewReports', label: 'View Reports', sub: 'Generate', icon: 'chart', path: '/admin/reports-analytics' },
  { id: 'adminConsole', label: 'Admin Console', sub: 'Full access', icon: 'gear', path: '/admin/admin-console' },
]

export const MOCK_CONTRACTS = [
  {
    id: 'MIP-2026-003',
    propertyAddress: '7 Park Lane',
    propertySuburb: 'South Yarra, VIC',
    contractId: 'MIP-2026-003',
    parties: 'Emma Rodriguez',
    partiesSub: 'ANZ',
    value: '$1,750,000',
    createdDate: '25 Jan 2026',
    status: 'Under Contract',
    statusVariant: 'blue',
  },
  {
    id: 'MIP-2026-005',
    propertyAddress: '156 Stirling Highway',
    propertySuburb: 'Nedlands, WA',
    contractId: 'MIP-2026-005',
    parties: 'Lisa Anderson',
    partiesSub: 'Macquarie Bank',
    value: '$2,650,000',
    createdDate: '15 Jan 2026',
    status: 'Completed',
    statusVariant: 'green',
  },
]

export const MOCK_TASKS = [
  {
    id: '1',
    title: 'Update accounting records - February entries',
    description: 'Reconcile bank statements and update ledger',
    priority: 'Low',
    status: 'Completed',
    dueDate: 'Overdue (Feb 22)',
    caseId: 'MIP-2026-001',
    module: 'Accounting',
    completed: true,
  },
  {
    id: '2',
    title: 'Follow up with client - Contract of Sale',
    description: 'Send final contract for signature',
    priority: 'High',
    status: 'In progress',
    dueDate: 'Today',
    caseId: 'MIP-2026-002',
    module: 'Client Communication',
    completed: false,
  },
  {
    id: '3',
    title: 'Verify enforcement steps for MIP-2026-001',
    description: 'Confirm court order and sheriff notification',
    priority: 'Urgent',
    status: 'Pending',
    dueDate: 'Tomorrow',
    caseId: 'MIP-2026-001',
    module: 'Legal Review',
    completed: false,
  },
  {
    id: '4',
    title: 'Review loan documentation - MIP-2026-003',
    description: 'Check mortgage documents for completeness',
    priority: 'Medium',
    status: 'Pending',
    dueDate: 'Feb 26, 2026',
    caseId: 'MIP-2026-003',
    module: 'Documentation',
    completed: false,
  },
  {
    id: '5',
    title: 'Upload Statement of Advice',
    description: 'Upload SOA for client file',
    priority: 'Low',
    status: 'Pending',
    dueDate: 'Feb 27, 2026',
    caseId: 'WS-12345',
    module: 'Compliance',
    completed: false,
  },
  {
    id: '6',
    title: 'Prepare monthly compliance report',
    description: 'AML/CTF and regulatory report',
    priority: 'Medium',
    status: 'Pending',
    dueDate: 'Mar 1, 2026',
    caseId: 'Brickbanq',
    module: 'AML/CTF',
    completed: false,
  },
]

export const MOCK_TASK_STATS = {
  active: 7,
  overdue: 1,
  dueToday: 1,
  urgent: 1,
  inProgress: 2,
  completed: 1,
}

export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'bid',
    title: 'New Bid Placed',
    description: 'A new bid of A$1,100,000 has been placed on MIP-2024-001',
    time: '29 minutes ago',
    unread: true,
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    description: 'Sarah Mitchell sent you a message about MIP-2024-003',
    time: 'about 2 hours ago',
    unread: true,
  },
  {
    id: '3',
    type: 'auction',
    title: 'Auction Ending Soon',
    description: 'MIP-2024-002 auction ends in 30 minutes',
    time: 'about 4 hours ago',
    unread: false,
  },
  {
    id: '4',
    type: 'bid',
    title: 'Bid Outbid',
    description: 'Your bid on MIP-2024-001 has been outbid',
    time: '1 day ago',
    unread: false,
  },
  {
    id: '5',
    type: 'kyc',
    title: 'KYC Approved',
    description: 'Your KYC verification has been approved',
    time: '2 days ago',
    unread: false,
  },
  {
    id: '6',
    type: 'contract',
    title: 'Contract Ready for Signature',
    description: 'Contract for MIP-2024-005 is ready for your digital signature',
    time: '3 days ago',
    unread: true,
  },
  {
    id: '7',
    type: 'payment',
    title: 'Payment Received',
    description: 'Your payment of A$1,050,000 has been received and confirmed',
    time: '4 days ago',
    unread: false,
  },
]

export const MOCK_NOTIFICATION_STATS = {
  unread: 3,
  total: 7,
  thisWeek: 7,
}

export const MOCK_ESIGNATURE_STATS = {
  pendingForMe: 3,
  awaitingOthers: 12,
  drafts: 5,
  expiringCertificates: 2,
}

export const MOCK_ESIGNATURE_TASKS = [
  {
    id: 'ENV-2024-0001',
    title: 'Defence Procurement Contract - Project Nighthawk',
    type: 'Procurement',
    signed: '2/3 signed',
    sla: '23h 37m',
    tags: ['HSM-Backed', 'Witness Required'],
    hash: 'sha256:a7f39c2...',
    classification: 'SECRET',
  },
  {
    id: 'ENV-2024-0004',
    title: 'Deed of Guarantee with Witness Attestation',
    type: 'Deed',
    signed: '1/3 signed',
    sla: '71h 45m',
    tags: ['HSM-Backed', 'Witness Required'],
    hash: 'sha256:f9a9cb1...',
    classification: 'PROTECTED',
  },
]

export const MOCK_SECURITY_ALERTS = [
  {
    id: '1',
    type: 'certificate',
    title: 'Certificate Expiring',
    description: "Robert Taylor's certificate expires in 28 days",
    action: 'Renew Certificate',
  },
  {
    id: '2',
    type: 'hsm',
    title: 'HSM Key Rotation Scheduled',
    description: 'Next rotation: 2024-03-01 02:00 AEDT',
  },
]

export const MOCK_RECENT_ACTIVITY = [
  { id: '1', action: 'ENVELOPE CREATED', user: 'Sarah Johnson', hash: 'sha256:e7a9e92b8...', time: '2026-02-21 10:23:02 AEDT' },
  { id: '2', action: 'DOCUMENT HASH COMPUTED', user: 'Sarah Johnson', hash: 'sha256:f8e0dcb32a9...', time: '2026-02-21 10:23:02 AEDT' },
  { id: '3', action: 'RECIPIENTS ADDED', user: 'Sarah Johnson', hash: 'sha256:a1b2c3...', time: '2026-02-21 10:23:02 AEDT' },
  { id: '4', action: 'RISK ASSESSMENT COMPLETED', user: 'Approval System', hash: '', time: '2026-02-21 10:23:02 AEDT' },
  { id: '5', action: 'ENVELOPE APPROVED', user: 'John Smith', hash: '', time: '2026-02-21 10:23:02 AEDT' },
]

export const MOCK_ESIGNATURE_ENVELOPES = [
  { id: 'HB-2021-001', title: 'Defence Procurement Contract - Project Nighthawk', sender: 'Sarah Johnson', type: 'Procurement', risk: 'HIGH', status: 'In Signing', progress: '1/4', progressVal: 0.25, sla: '23h 37m' },
  { id: 'HB-2021-002', title: 'Banking Loan Agreement - Commonwealth Infrastructure', sender: 'Michael Brooks', type: 'Contract', risk: 'PROTECTED', status: 'Pending Approval', progress: '0/4', progressVal: 0, sla: '47d 12m' },
  { id: 'HB-2021-003', title: 'Company Resolution - Board Appointment s127', sender: 'Kiana Walton', type: 'Board Resolution', risk: 'OFFICIAL', status: 'Completed', progress: '2/2', progressVal: 1, sla: 'Complete' },
  { id: 'HB-2021-004', title: 'Deed of Guarantee with Witness Attestation', sender: 'David Lam', type: 'Deed', risk: 'PROTECTED', status: 'In Signing', progress: '1/3', progressVal: 0.33, sla: '79h 45m' },
]

export const MOCK_ESIGNATURE_DOCUMENTS = [
  { id: 'doc-1', name: 'Defence_Procurement_Contract_Nighthawk.pdf', type: 'PDF', size: '2.4 MB', uploadedDate: '2026-02-21', uploadedBy: 'Sarah Johnson', status: 'Signed', envelopeId: 'HB-2021-001', hash: 'sha256:a7f39c2...' },
  { id: 'doc-2', name: 'Banking_Loan_Agreement_Commonwealth.pdf', type: 'PDF', size: '1.8 MB', uploadedDate: '2026-02-20', uploadedBy: 'Michael Brooks', status: 'Pending', envelopeId: 'HB-2021-002', hash: 'sha256:b8e4a1d...' },
  { id: 'doc-3', name: 'Board_Resolution_s127_Appointment.docx', type: 'DOCX', size: '456 KB', uploadedDate: '2026-02-19', uploadedBy: 'Kiana Walton', status: 'Signed', envelopeId: 'HB-2021-003', hash: 'sha256:c9f5b2e...' },
  { id: 'doc-4', name: 'Deed_of_Guarantee_Witness.pdf', type: 'PDF', size: '3.1 MB', uploadedDate: '2026-02-18', uploadedBy: 'David Lam', status: 'In Signing', envelopeId: 'HB-2021-004', hash: 'sha256:d0a6c3f...' },
  { id: 'doc-5', name: 'KYC_Verification_Checklist.pdf', type: 'PDF', size: '892 KB', uploadedDate: '2026-02-17', uploadedBy: 'Sarah Johnson', status: 'Signed', envelopeId: null, hash: 'sha256:e1b7d4a...' },
]

export const MOCK_ESIGNATURE_TEMPLATES = [
  { id: 'tpl-1', name: 'Procurement Contract Standard', type: 'Procurement', description: 'Standard defence procurement contract with witness attestation', lastUsed: '2026-02-21', createdDate: '2025-01-15', usageCount: 24 },
  { id: 'tpl-2', name: 'Loan Agreement - Banking', type: 'Contract', description: 'Banking loan agreement template with dual signer flow', lastUsed: '2026-02-20', createdDate: '2025-02-01', usageCount: 18 },
  { id: 'tpl-3', name: 'Board Resolution s127', type: 'Board Resolution', description: 'Company resolution template for director appointments', lastUsed: '2026-02-19', createdDate: '2025-03-10', usageCount: 12 },
  { id: 'tpl-4', name: 'Deed of Guarantee with Witness', type: 'Deed', description: 'Deed of guarantee requiring physical witness', lastUsed: '2026-02-18', createdDate: '2025-01-20', usageCount: 31 },
  { id: 'tpl-5', name: 'KYC Verification Pack', type: 'Compliance', description: 'KYC and identity verification document set', lastUsed: '2026-02-10', createdDate: '2025-04-05', usageCount: 8 },
]

export const MOCK_HSM_CLUSTER = {
  primary: 'HSM-CLUSTER-01-SYD: Active',
  secondary: 'HSM-CLUSTER-02-SYD: Standby',
  region: 'Australia (Sydney)',
  certified: 'FIPS 140-2 Level 3 Certified',
}

export const MOCK_CERTIFICATES = [
  { id: 'cert-1', subject: 'CN=Sarah Johnson, O=Defence, OU=Procurement, L=AU', issuer: 'GovSign Root CA - Defence', serial: '28:1c:12:16...', algorithm: 'RSA-2048 + SHA-384', validFrom: '2023-09-15', validTo: '2025-09-15', status: 'Active', tags: ['HSM-Backed', 'SECRET'] },
  { id: 'cert-2', subject: 'CN=Michael Brown, O=Commonwealth Bank, OU=Legal, L=AU', issuer: 'GovSign Root CA - Banking', serial: '2a:3d:14:18...', algorithm: 'ECDSA P-384 + SHA-384', validFrom: '2023-09-21', validTo: '2025-09-21', status: 'Active', tags: ['HSM-Backed', 'PROTECTED'] },
  { id: 'cert-3', subject: 'CN=Jessica Wilson, O=Corporate Services, OU=Company Secretary, L=AU', issuer: 'GovSign Root CA - Corporate', serial: '2c:4f:16:1a...', algorithm: 'RSA-2048 + SHA-384', validFrom: '2024-01-10', validTo: '2026-01-10', status: 'Active', tags: ['HSM-Backed', 'OFFICIAL'] },
  { id: 'cert-4', subject: 'CN=Robert Taylor, O=Defence, OU=Intelligence, L=AU', issuer: 'GovSign Root CA - Defence', serial: '28:1c:12:16...', algorithm: 'RSA-2048 + SHA-384', validFrom: '2024-08-20', validTo: '2026-08-20', status: 'Expiring', expiringIn: '28 days', tags: ['HSM-Backed', 'TOP SECRET'] },
]

export const MOCK_EVIDENCE_CHAIN = {
  totalEvents: 24567,
  chainIntegrity: 'Verified',
  lastEvent: '2 minutes ago',
}

export const MOCK_EVIDENCE_EVENTS = [
  { id: 'EVT-0001', type: 'ENVELOPE CREATED', actor: 'Sarah Johnson', originIp: '10.1.x.xx', currentHash: '0x932d2...', previousHash: '0x3f5c8...', timestamp: '2026-02-21 10:20:00 AEDT', device: 'Windows 11 - Chrome 121', auth: 'FIDO2 + MFA', genesis: true },
  { id: 'EVT-0002', type: 'ENVELOPE APPROVED', actor: 'John Smith (Approver)', originIp: '10.1.x.xx', currentHash: '0xa1b3c...', previousHash: '0x932d2...', timestamp: '2026-02-21 10:21:00 AEDT', device: 'Windows 11 - Chrome 121', auth: 'Smartcard + PIN' },
  { id: 'EVT-0003', type: 'DOCUMENT VIEWED', actor: 'Sarah Johnson', originIp: '10.1.x.xx', currentHash: '0xb2c4d...', previousHash: '0xa1b3c...', timestamp: '2026-02-21 10:22:00 AEDT', device: 'Windows 11 - Chrome 121', auth: 'Session MFA' },
  { id: 'EVT-0004', type: 'HSM SIGNATURE APPLIED', actor: 'System', originIp: '10.1.x.xx', currentHash: '0xc3d5e...', previousHash: '0xb2c4d...', timestamp: '2026-02-21 10:23:00 AEDT', device: 'HSM Cluster', auth: 'HSM', certificateSerial: '28:1c:12:16...', hsmCluster: 'HSM-CLUS194-01-SYG', algorithm: 'ECDSA-P256-SHA-256', hsmId: 'HV-CD9-15A-GOV-AU' },
]

export const MOCK_ADMIN_DATA_SOVEREIGNTY = [
  { id: 'primary', label: 'Primary Region', value: 'Australia (Sydney) - LOCKED', action: 'Settings' },
  { id: 'tenant', label: 'Tenant Isolation', value: 'Dedicated infrastructure per organisation' },
  { id: 'cross', label: 'Cross-Border Data Transfer', value: 'Prevent data leaving Australian jurisdiction' },
]

export const MOCK_ADMIN_POLICIES = [
  { id: '1', title: 'Deed Execution Requires Witness', description: 'If this = TRUE, requires physical witness attestation', status: 'Active', scope: 'All organisations', modified: '2024-03-01 by System Admin' },
  { id: '2', title: 'High Risk Requires FIDO2', description: 'If Risk = PROTECTED, require FIDO2 authentication', status: 'Active', scope: 'Defense_konning', modified: '2024-03-01 by Security Admin' },
  { id: '3', title: 'External Signer Approval Required', description: 'If external signer, require step-up auth + approval gate', status: 'Active', scope: 'All organisations', modified: '2024-03-01 by Org Admin' },
  { id: '4', title: 'SECRET Classification No Email', description: 'If classification > SECRET, block email notifications', status: 'Active', scope: 'Defense_intelligence', modified: '2024-03-01 by Security Admin' },
]

export const MOCK_ADMIN_SECURITY = [
  { id: 'dual', title: 'Dual Control for Certificate Issuance', description: 'Require two advisors to approve certificate creation', enabled: true },
  { id: 'audit', title: 'Immutable Audit Logging', description: 'All actions logged to tamper-proof ledger', enabled: true },
  { id: 'rotation', title: 'HSM Key Rotation', description: 'Automatic key rotation every 90 days', enabled: true },
  { id: 'breakglass', title: 'Break Glass Emergency Access', description: 'Enable emergency access with dual approval', enabled: true },
]

export const MOCK_PROFILE = {
  firstName: 'David',
  lastName: 'Williams',
  email: 'david.williams@example.com',
  phone: '+61 412 345 678',
  company: 'Platinum Capital Partners',
  jobTitle: 'Investment Manager',
  bio: 'Experienced investment professional specializing in distressed asset management and mortgage investment opportunities.',
  streetAddress: '123 Collins Street',
  city: 'Melbourne',
  state: 'VIC',
  postcode: '3000',
  country: 'Australia',
  memberSince: 'Jan 2024',
  accountType: 'Premium Investor',
  verification: 'Verified',
}

export const MOCK_ORGANIZATION = {
  name: 'Platinum Capital Partners',
  abn: '12 345 678 901',
  industry: 'Financial Services',
  companySize: '50-100 employees',
  website: 'https://platinumcapital.com.au',
  phone: '+61 3 9123 4567',
  streetAddress: '123 Collins Street',
  city: 'Melbourne',
  state: 'VIC',
  postcode: '3000',
}

export const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Michael Chen', email: 'michael.chen@platinumcapital.com.au', role: 'Administrator' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@platinumcapital.com.au', role: 'Member' },
  { id: '3', name: 'David Williams', email: 'david.williams@platinumcapital.com.au', role: 'Member' },
]

export const MOCK_BILLING = {
  plan: 'Professional Plan',
  price: 'A$299/month',
  billingNote: 'Billed annually',
  nextBilling: '1 March 2028',
  paymentMethod: 'Visa **** 4242',
  expires: '12/2025',
}

export const MOCK_INTEGRATIONS = [
  { id: 'xero', name: 'Xero', description: 'Accounting integration for invoicing, payments, and financial reporting', status: 'Disconnected', fields: ['Client ID', 'Client Secret', 'Tenant ID'] },
  { id: 'pexa', name: 'PEXA', description: 'Property Exchange Australia - electronic property settlements', status: 'Disconnected', fields: ['Subscriber ID', 'API Key', 'Environment'] },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing for deposits, fees, and investor transactions', status: 'Error', fields: ['Publishable Key', 'Secret Key', 'Webhook Secret'], lastTested: '2/24/2026, 12:15:14 PM' },
  { id: 'equifax', name: 'Equifax', description: 'Credit checks, credit reports, and borrower financial assessment', status: 'Connected', fields: ['Username', 'Password', 'Customer ID'], lastTested: '2/24/2026, 1:15:14 AM' },
  { id: 'austrac', name: 'AUSTRAC Reporting', description: 'AML/CTF compliance reporting and suspicious matter reporting', status: 'Connected', fields: ['Reporting Entity ID', 'API Key', 'Environment'], lastTested: '2/24/2026, 7:15:14 AM' },
  { id: 'docusign', name: 'DocuSign', description: 'Digital signatures and document execution for contracts and agreements', status: 'Disconnected', fields: ['Integration Key', 'Account ID', 'User ID'] },
  { id: 'infotrack', name: 'InfoTrack', description: 'Identity verification, KYC checks, title searches, and property verification', status: 'Connected', fields: ['API Key', 'Client ID', 'Environment'], lastTested: '2/24/2026, 11:15:14 AM' },
  { id: 'rpdata', name: 'RP Data / CoreLogic', description: 'Property valuations, sales history, market insights, and property reports', status: 'Connected', fields: ['API Key', 'Subscriber ID', 'API Endpoint'], lastTested: '2/23/2026, 1:15:14 PM' },
]

export const MOCK_FORM_CUSTOMIZATION = [
  { id: 'case', name: 'Case Creation Form', description: 'Main form for creating mortgage in possession cases', fieldCount: 3, fields: [
    { id: 'f1', label: 'Property Manager Name', type: 'Text', required: false },
    { id: 'f2', label: 'Insurance Policy Number', type: 'Text', required: true },
    { id: 'f3', label: 'Expected Settlement Amount', type: 'Currency', required: false },
  ]},
  { id: 'borrower', name: 'Borrower Details Form', fieldCount: 2, fields: [] },
  { id: 'property', name: 'Property Details Form', fieldCount: 3, fields: [] },
  { id: 'lender', name: 'Lender Details Form', fieldCount: 2, fields: [] },
  { id: 'kyc', name: 'KYC Verification Form', fieldCount: 2, fields: [] },
]

export const MOCK_ACTIVE_SESSIONS = [
  { id: '1', device: 'Current Session', detail: 'MacBook Pro • Melbourne, VIC', lastActive: 'Just now', current: true },
  { id: '2', device: 'iPhone 14 Pro', detail: 'iOS • Sydney, NSW', lastActive: '2 hours ago', current: false },
  { id: '3', device: 'Windows PC', detail: 'Chrome • Brisbane, QLD', lastActive: '1 day ago', current: false },
]

export const MOCK_NOTIFICATION_PREFERENCES = {
  email: [
    { key: 'dealUpdates', label: 'Deal Updates', description: 'Get notified about new deals and opportunities', enabled: true },
    { key: 'auctionAlerts', label: 'Auction Alerts', description: 'Notifications about auction start times and bid activity', enabled: true },
    { key: 'contractReminders', label: 'Contract Reminders', description: 'Reminders to sign contracts and complete documentation', enabled: true },
    { key: 'paymentNotifications', label: 'Payment Notifications', description: 'Alerts about payments, invoices, and transactions', enabled: true },
    { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates, maintenance, and new features', enabled: false },
    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Tips, insights, and product announcements', enabled: false },
  ],
  push: [
    { key: 'dealUpdates', label: 'Deal Updates', description: 'Instant alerts for new investment opportunities', enabled: true },
    { key: 'auctionAlerts', label: 'Auction Alerts', description: 'Real-time auction activity and bid notifications', enabled: true },
    { key: 'bidActivity', label: 'Bid Activity', description: "When someone outbids you or bids on your cases", enabled: true },
    { key: 'messages', label: 'Messages', description: 'New messages from other users', enabled: true },
    { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications and warnings', enabled: true },
  ],
  sms: [
    { key: 'criticalAlerts', label: 'Critical Alerts', description: 'Urgent notifications requiring immediate action', enabled: true },
    { key: 'auctionReminders', label: 'Auction Reminders', description: 'SMS reminders before auctions start', enabled: false },
    { key: 'paymentAlerts', label: 'Payment Alerts', description: 'Payment confirmations and receipts via SMS', enabled: true },
  ],
}
