export const MOCK_PROFILE = {
  firstName: 'David',
  lastName: 'Williams',
  email: 'david.williams@example.com',
  phone: '+61 XXX XXX XXX',
  company: '',
  jobTitle: '',
  bio: '',
  streetAddress: '123 Example Street',
  city: '',
  state: 'VIC',
  postcode: '3000',
  country: 'Australia',
  memberSince: 'Jan 2024',
  accountType: 'Premium Investor',
  verified: true
}

export const MOCK_ORGANIZATION = {
  name: 'Example Organization',
  abn: '12 345 678 901',
  industry: 'Financial Services',
  companySize: '50-100 employees',
  website: 'https://example.com',
  phone: '+61 XXXX XXXX',
  streetAddress: '123 Example Street',
  city: '',
  state: 'VIC',
  postcode: '3000',
  teamMembers: [
    { id: 1, name: 'Michael Chen', email: 'michael.chen@example.com.au', role: 'Administrator', avatar: 'MC' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@example.com.au', role: 'Member', avatar: 'SJ' },
    { id: 3, name: 'David Wilson', email: 'david.wilson@example.com.au', role: 'Member', avatar: 'DW' },
  ]
}

export const MOCK_NOTIFICATION_PREFERENCES = {
  email: {
    dealUpdates: true,
    auctionActivity: true,
    contractReminders: true,
    paymentNotifications: true,
    systemUpdates: false,
    marketingEmails: false
  },
  push: {
    dealUpdates: true,
    auctionAlerts: true,
    bidActivity: true,
    messages: true,
    systemAlerts: true
  },
  sms: {
    criticalAlerts: true,
    auctionReminders: false,
    paymentAlerts: true
  }
}

export const MOCK_USERS = [
  { id: 1, avatar: 'AU', name: 'Admin User', email: 'admin@example.com', role: 'Super Admin', modules: ['brickbanq', 'grow accounting'], status: 'Active', lastLogin: '2024-02-13 14:23' },
  { id: 2, avatar: 'ED', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Viewer', modules: ['grow accounting'], status: 'Active', lastLogin: '2024-02-13 11:20' },
  { id: 3, avatar: 'JS', name: 'John Smith', email: 'john.smith@example.com', role: 'User', modules: ['brickbanq'], status: 'Active', lastLogin: '2024-02-13 12:15' },
  { id: 4, avatar: 'MB', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'User', modules: ['brickbanq', 'grow accounting'], status: 'Inactive', lastLogin: '2024-01-28 09:20' },
  { id: 5, avatar: 'SJ', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Admin', modules: ['grow accounting'], status: 'Active', lastLogin: '2024-02-12 16:45' },
]

export const MOCK_ACTIVE_SESSIONS = [
  { id: 1, device: 'Current Session', location: 'Melbourne, VIC • Melbourne', lastActive: 'Just now', isCurrent: true },
  { id: 2, device: 'iPhone 15 Pro', location: 'Sydney, NSW', lastActive: '5 hours ago', isCurrent: false },
  { id: 3, device: 'Windows PC', location: 'Chrome • Brisbane, QLD', lastActive: '7 days ago', isCurrent: false },
]

export const MOCK_ROLES = [
  { id: 1, name: 'Super Administrator', permissions: 27, description: 'Full access to all modules and features', count: 2 },
  { id: 2, name: 'Brickbanq Administrator', permissions: 12, description: 'Full access to Brickbanq module', count: 5 },
  { id: 3, name: 'Investor', permissions: 6, description: 'Can view and bid on deals', count: 847 },
  { id: 4, name: 'Accountant', permissions: 19, description: 'Full access to Grow Accounting', count: 23 },
  { id: 5, name: 'Financial Advisor', permissions: 4, description: 'Full access to PFA module', count: 45 },
]

export const MOCK_CASE_DATA = {
  id: 'MIP-2026-001',
  status: 'In Auction',
  riskLevel: 'Medium Risk',
  borrower: 'Sarah Mitchell',
  lender: 'Commonwealth Bank',
  outstandingDebt: 980000,
  propertyValuation: 1250000,
  equityAvailable: 270000,
  minimumBid: 1000000,
  currentHighestBid: 1100000,
  created: '10 Jan 2026, 09:30',
  lastUpdated: '10 Feb 2026, 09:30',
  tasksReceived: 7,
  property: {
    address: '45 Victoria Street',
    location: 'Potts Point, NSW 2011',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400'
  },
  valuation: {
    amount: 1250000,
    date: '15 Jan 2026',
    valuer: 'Preston Rowe Paterson'
  },
  documents: [
    {
      id: 1,
      name: 'Property Inspection Report.pdf',
      type: 'Inspection',
      uploadedBy: 'Sarah Mitchell',
      date: '16 Feb 2026',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Valuation Report.pdf',
      type: 'Valuation',
      uploadedBy: 'Preston Rowe Paterson',
      date: '15 Jan 2026',
      size: '1.8 MB'
    }
  ],
  settlement: {
    readiness: 65,
    warning: 'An update confirmed for settlement on March 7th',
    messages: [
      {
        id: 1,
        sender: 'Sarah Mitchell',
        avatar: 'SM',
        role: 'Settlement Lead',
        message: 'I have uploaded the updated property documentation as requested. Could you please review?',
        timestamp: '1 day ago',
        isUser: false
      },
      {
        id: 2,
        sender: 'David Wilson',
        avatar: 'DW',
        message: 'Yes, I will upload within the next hour. Thank you for the reminder.',
        timestamp: '2 hrs ago',
        isUser: true
      }
    ],
    checklist: [
      {
        id: 1,
        task: 'Signed Loan Agreement',
        responsible: 'Borrower',
        dueDate: '15 Feb 2026',
        status: 'Open',
        completed: false
      },
      {
        id: 2,
        task: 'Discharge Authority',
        responsible: 'Lender',
        dueDate: '21 Feb 2026',
        status: 'Open',
        completed: false
      },
      {
        id: 3,
        task: 'Title Transfer Documents',
        responsible: 'Lawyer',
        dueDate: '19 Feb 2026',
        status: 'Overdue',
        completed: false,
        overdue: true
      },
      {
        id: 4,
        task: 'Insurance Certificate',
        responsible: 'Borrower',
        dueDate: '27 Feb 2026',
        status: 'Approved',
        completed: true
      }
    ],
    outstandingItems: [
      {
        category: 'Timeline: 1',
        title: 'Title Transfer Documents',
        overdue: true
      },
      {
        category: 'Due Soon: 2',
        title: 'Signed Loan Agreement',
        dueSoon: '2 days left'
      },
      {
        category: 'Awaiting Approval: 2',
        title: 'Discharge Authority',
        awaitingApproval: true
      }
    ],
    timeline: [
      { id: 1, milestone: 'Contract Signed', date: '02 Jan 2026', status: 'complete' },
      { id: 2, milestone: 'Escrow Funded', date: '15 Jan 2026', status: 'complete' },
      { id: 3, milestone: 'All Docs Uploaded', date: '01 Mar 2026', status: 'pending' },
      { id: 4, milestone: 'Settlement Cleared', date: '07 Mar 2026', status: 'pending' },
      { id: 5, milestone: 'Funds Released', date: '10 Mar 2026', status: 'pending' }
    ],
    requiredDocuments: [
      {
        title: 'Signed Loan Agreement',
        responsible: 'Borrower',
        status: 'Complete'
      },
      {
        title: 'Discharge Authority',
        responsible: 'Lender',
        status: 'Pending'
      },
      {
        title: 'Title Transfer Documents',
        responsible: 'Lawyer',
        status: 'Pending'
      },
      {
        title: 'Insurance Certificate',
        responsible: 'Borrower',
        status: 'Complete'
      },
      {
        title: 'Settlement Statement',
        responsible: 'Settlement Agent',
        status: 'Pending'
      }
    ]
  },
  bids: [
    {
      id: 1,
      bidder: 'Premium Capital Partners',
      amount: 1100000,
      timestamp: '11 Feb 2026, 07:34 AEST',
      status: 'Active'
    },
    {
      id: 2,
      bidder: 'Investor Property Group',
      amount: 1055000,
      timestamp: '11 Feb 2026, 07:48 AEST',
      status: 'Pending'
    },
    {
      id: 3,
      bidder: 'Zenith Investments',
      amount: 1025000,
      timestamp: '11 Feb 2026, 10:18 AEST',
      status: 'Pending'
    }
  ],
  messages: [
    {
      id: 1,
      sender: 'Sarah Mitchell',
      avatar: 'SM',
      message: 'I have uploaded the updated property documentation as requested. Could you please review?',
      timestamp: '1 day ago',
      isUser: false
    },
    {
      id: 2,
      sender: 'David Wilson',
      avatar: 'DW',
      message: 'Yes, I will upload within the next hour. Thank you for the reminder.',
      timestamp: '2 hrs ago',
      isUser: true
    }
  ],
  activity: [
    {
      id: 1,
      type: 'bid',
      title: 'New bid placed',
      description: 'Premium Capital Partners bid $1,100,000',
      timestamp: '14 Mar 2026, 09:30 AEST',
      status: 'info'
    },
    {
      id: 2,
      type: 'document',
      title: 'Document uploaded',
      description: 'Property Valuation Report added',
      timestamp: '14 Mar 2026, 20:23',
      status: 'success'
    },
    {
      id: 3,
      type: 'message',
      title: 'Message received',
      description: 'Sarah Mitchell sent a message',
      timestamp: '14 Mar 2026, 10:14 AEST',
      status: 'info'
    },
    {
      id: 4,
      type: 'valuation',
      title: 'Valuation updated',
      description: 'Property valuation to $1,250,000',
      timestamp: '15 Jan 2026, 9:43 AEST',
      status: 'success'
    }
  ]
}

// GovSign High-Assurance E-Signature Mock Data
export const MOCK_GOVSIGN_STATS = {
  pendingForMe: 2,
  awaitingOthers: 5,
  drafts: 3,
  expiringCertificates: 1,
}

export const MOCK_GOVSIGN_TASKS = [
  {
    id: 'ENV-2026-042',
    title: 'Defence Procurement Contract - Project Nighthawk',
    type: 'Procurement',
    signed: '2/3',
    sla: '2h 37m',
    classification: 'URGENT',
    tags: ['HSM-Backed', 'AU-Sovereign'],
    hash: 'sha256:7f3b9c2...',
  },
  {
    id: 'ENV-2026-045',
    title: 'Board Resolution - Director Appointment s127',
    type: 'Governance',
    signed: '0/2',
    sla: '23h 12m',
    classification: 'OFFICIAL',
    tags: ['HSM-Backed'],
    hash: 'sha256:a9c1f6b...',
  },
]

export const MOCK_GOVSIGN_ALERTS = [
  {
    id: 'AL-001',
    type: 'certificate',
    title: 'Certificate Expiring',
    description: "Robert Taylor's signing certificate expires in 20 days.",
    action: 'Renew Now',
  },
  {
    id: 'AL-002',
    type: 'security',
    title: 'HSM Cluster Rotation',
    description: 'Scheduled key rotation for SYD-01 cluster in 48 hours.',
    action: 'View Schedule',
  },
]

export const MOCK_GOVSIGN_ACTIVITY = [
  { id: 1, action: 'Envelope Signed', user: 'Sarah Johnson', hash: 'sha256:f2a9...', time: '12 mins ago' },
  { id: 2, action: 'Certificate Issued', user: 'Admin (System)', hash: 'sha256:c7d3...', time: '1 hour ago' },
  { id: 3, action: 'HSM Heartbeat', user: 'SYD-01 Cluster', hash: '—', time: 'Just now' },
]

export const MOCK_GOVSIGN_ENVELOPES = [
  {
    id: 'MBI-2026-0001',
    title: 'Infrastructure Loan Agreement - Tier 1',
    sender: 'Sarah Johnson',
    type: 'Procurement',
    risk: 'PROTECTED',
    status: 'In Signing',
    progress: '2/3',
    progressVal: 0.66,
    sla: '23h 37m',
  },
  {
    id: 'MBI-2026-0002',
    title: 'Board Resolution - Project X Launch',
    sender: 'Michael Brown',
    type: 'Governance',
    risk: 'OFFICIAL',
    status: 'Completed',
    progress: '2/2',
    progressVal: 1,
    sla: 'Complete',
  },
  {
    id: 'MBI-2026-0003',
    title: 'Deed of Guarantee - Witness Attestation',
    sender: 'Emma Wilson',
    type: 'Deed',
    risk: 'PROTECTED',
    status: 'Pending',
    progress: '0/4',
    progressVal: 0,
    sla: '47h 12m',
  },
]

export const MOCK_GOVSIGN_DOCUMENTS = [
  {
    id: 'doc-001',
    name: 'Loan_Agreement_Draft_v2.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadedDate: '2026-02-15',
    uploadedBy: 'You',
    status: 'In Signing',
    envelopeId: 'MBI-2026-0001',
    hash: 'sha256:7f3b9c2...',
  },
  {
    id: 'doc-002',
    name: 'Property_Inspection_Report.docx',
    type: 'DOCX',
    size: '4.5 MB',
    uploadedDate: '2026-02-10',
    uploadedBy: 'Lender Admin',
    status: 'Signed',
    envelopeId: 'MBI-2026-0001',
    hash: 'sha256:a9c1f6b...',
  },
]

export const MOCK_GOVSIGN_TEMPLATES = [
  {
    id: 'tpl-001',
    name: 'Standard NDA',
    type: 'Legal',
    description: 'Non-disclosure agreement for external consultants.',
    lastUsed: '2026-02-20',
    createdDate: '15 Jan 2026',
    usageCount: 124,
  },
  {
    id: 'tpl-002',
    name: 'Loan Agreement - Infrastructure',
    type: 'Finance',
    description: 'Master loan agreement for tier 1 infrastructure projects.',
    lastUsed: '2026-02-18',
    createdDate: '20 Jan 2026',
    usageCount: 45,
  },
]

export const MOCK_GOVSIGN_HSM_CLUSTER = {
  primary: 'Cluster SYD-01 (Primary)',
  secondary: 'Cluster MEL-02 (Standby)',
  region: 'Australia (East/Southeast)',
  certified: 'FIPS 140-2 Level 3 Certified',
}

export const MOCK_GOVSIGN_CERTIFICATES = [
  {
    id: 'cert-001',
    subject: 'Sarah Johnson (Project lead)',
    issuer: 'GovSign Root CA',
    serial: 'SN-7742-A1',
    validFrom: '2025-01-01',
    validTo: '2027-01-01',
    algorithm: 'RSA 4096',
    status: 'Valid',
    tags: ['HSM-Backed', 'OFFICIAL'],
  },
  {
    id: 'cert-002',
    subject: 'Robert Taylor (Director)',
    issuer: 'GovSign Root CA',
    serial: 'SN-8891-B2',
    validFrom: '2025-03-01',
    validTo: '2026-03-21',
    algorithm: 'ECDSA P-384',
    status: 'Expiring',
    expiringIn: '20 days',
    tags: ['HSM-Backed', 'SECRET'],
  },
]

export const MOCK_GOVSIGN_EVIDENCE_CHAIN = {
  totalEvents: 14238,
  chainIntegrity: 'VERIFIED',
  lastEvent: '2026-03-01 14:23:44 AEST',
}

export const MOCK_GOVSIGN_EVIDENCE_EVENTS = [
  {
    id: 'EVT-998',
    type: 'SIGNATURE',
    timestamp: '2026-03-01 14:23:44',
    actor: 'Sarah Johnson',
    originIp: '10.22.4.15',
    eventHash: '0x7f3b...',
    previousHash: '0xa9c1...',
    device: 'Managed Device - macOS',
    auth: 'MFA Verified',
  },
  {
    id: 'EVT-997',
    type: 'ENVELOPE_CREATED',
    timestamp: '2026-03-01 10:12:05',
    actor: 'Michael Brown',
    originIp: '10.22.4.8',
    eventHash: '0xa9c1...',
    previousHash: '0x2d3e...',
    device: 'Web Client',
    auth: 'SSO Federated',
  },
]

export const MOCK_GOVSIGN_ADMIN_SOVEREIGNTY = [
  { id: 'sov-01', label: 'Data Residency', value: 'Australia (SYD/MEL)', locked: true, enabled: true },
  { id: 'sov-02', label: 'Key Sovereignty', description: 'Keys never leave AU HSM boundary', locked: true, enabled: true },
  { id: 'sov-03', label: 'Cross-Border Access', description: 'Restrict access to AU IP ranges', locked: false, enabled: false },
]

export const MOCK_GOVSIGN_ADMIN_POLICIES = [
  { id: 'pol-01', title: 'Two-Person Integrity', description: 'Require two admins for key rotation.', scope: 'HSM', modified: '2 days ago', status: 'Active' },
  { id: 'pol-02', title: 'Classification Override', description: 'Allow SECRET classification on loan agreements.', scope: 'System', modified: '1 week ago', status: 'Active' },
]

export const MOCK_GOVSIGN_ADMIN_SECURITY = [
  { id: 'sec-01', title: 'FIPS 140-2 Level 3 Enforcement', description: 'Strict enforcement of HSM security policies.', enabled: true },
  { id: 'sec-02', title: 'Biometric Signing', description: 'Require FaceID/TouchID for all signatures.', enabled: false },
]

export const MOCK_GOVSIGN_REPORT_TYPES = [
  { id: 'envelope-summary', name: 'Envelope Summary', description: 'Execution status of all envelopes.' },
  { id: 'audit-log', name: 'Audit Log (Evidence Ledger)', description: 'Complete cryptographic activity log.' },
  { id: 'certificate-inventory', name: 'Certificate Inventory', description: 'List of all issued and active keys.' },
]

export const MOCK_GOVSIGN_REPORTS = [
  { id: 'rpt-01', name: 'Monthly Signing Audit - Feb 2026', type: 'audit-log', generatedAt: '1 Mar 2026', dateFrom: '2026-02-01', dateTo: '2026-02-28', status: 'Ready' },
]

export const MOCK_GOVSIGN_HELP_FAQ = [
  { id: 'faq-01', question: 'What is AU Sovereignty?', answer: 'GovSign ensures all cryptographic keys and data remain within the Australian geographic and legal boundary.' },
  { id: 'faq-02', question: 'How do I renew a certificate?', answer: 'Navigate to Certificates & Keys, select the expiring certificate, and click Renew.' },
]

export const MOCK_GOVSIGN_HELP_LINKS = [
  { id: 'ln-01', label: 'Security Whitepaper', description: 'Technical architecture of the HSM cluster.', url: '#' },
  { id: 'ln-02', label: 'Compliance Audit 2025', description: 'Independent FIPS and SOC2 audit report.', url: '#' },
]

