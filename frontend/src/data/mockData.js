// Use ONLY for development. Replace with API calls in production.

export const MOCK_CASES = [
    { id: 'MIP-2026-001', borrower: 'Sarah Mitchell', property: '45 Victoria Street', suburb: 'Potts Point, NSW', debt: 980000, valuation: 1250000, status: 'In Auction', risk: 'Medium Risk', created: '10 Jan 2026' },
    { id: 'MIP-2026-002', borrower: 'James Chen', property: '128 Brighton Boulevard', suburb: 'North Bondi, NSW', debt: 2100000, valuation: 3200000, status: 'Active', risk: 'Low Risk', created: '18 Jan 2026' },
    { id: 'MIP-2026-003', borrower: 'Emma Rodriguez', property: '7 Park Lane', suburb: 'South Yarra, VIC', debt: 1600000, valuation: 1850000, status: 'Active', risk: 'Low Risk', created: '25 Jan 2026' },
    { id: 'MIP-2026-004', borrower: 'Michael Thompson', property: '92 George Street', suburb: 'Brisbane CBD, QLD', debt: 480000, valuation: 520000, status: 'Pending', risk: 'High Risk', created: '02 Feb 2026' },
    { id: 'MIP-2026-005', borrower: 'Lisa Anderson', property: '156 Stirling Highway', suburb: 'Nedlands, WA', debt: 1950000, valuation: 2800000, status: 'Completed', risk: 'Low Risk', created: '15 Jan 2026' },
]

export const MOCK_KYC = [
    { id: 1, name: 'Sarah Mitchell', role: 'Borrower', email: 'sarah.mitchell@email.com', submitted: '10 Feb 2026', documents: 3, status: 'Pending' },
    { id: 2, name: 'James Chen', role: 'Investor', email: 'james.chen@email.com', submitted: '11 Feb 2026', documents: 4, status: 'Pending' },
    { id: 3, name: 'Emma Watson', role: 'Investor', email: 'emma.watson@email.com', submitted: '09 Feb 2026', documents: 3, status: 'Approved' },
]

export const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'bid', title: 'New Bid Placed', message: 'A new bid of A$1,100,000 has been placed on MIP-2024-001', time: '23 minutes ago', read: false },
    { id: 2, type: 'message', title: 'New Message', message: 'Sarah Mitchell sent you a message about MIP-2024-003', time: 'about 2 hours ago', read: false },
    { id: 3, type: 'auction', title: 'Auction Ending Soon', message: 'MIP-2024-002 auction ends in 30 minutes', time: 'about 4 hours ago', read: true },
    { id: 4, type: 'bid', title: 'Bid Outbid', message: 'Your bid on MIP-2024-001 has been outbid', time: '1 day ago', read: true },
    { id: 5, type: 'kyc', title: 'KYC Approved', message: 'Your KYC verification has been approved', time: '2 days ago', read: true },
    { id: 6, type: 'contract', title: 'Contract Ready for Signature', message: 'Contract for MIP-2024-005 is ready for your digital signature', time: '3 days ago', read: false },
    { id: 7, type: 'payment', title: 'Payment Received', message: 'Payment received for MIP-2024-001', time: '4 days ago', read: true },
]

export const MOCK_ESCROW_TRANSACTIONS = [
    { date: '10 Feb 2026', type: 'Initial Deposit', recipient: 'Escrow Account', amount: 125000, status: 'Completed', released: true },
    { date: '12 Feb 2026', type: 'Release to Seller', recipient: 'Sarah Mitchell', amount: 100000, status: 'Completed', released: true },
    { date: '13 Feb 2026', type: 'Agent Commission', recipient: 'Melbourne Property Group', amount: 12500, status: 'Pending', released: false },
    { date: '13 Feb 2026', type: 'Legal Fees', recipient: 'Smith & Partners Legal', amount: 2500, status: 'Pending', released: false },
]

export const MOCK_DOCUMENTS = [
    { id: 1, name: 'Investment_Memorandum_MIP-2024-001.pdf', category: 'Contract', mipId: 'MIP-2024-001', size: '2.3 MB', uploader: 'Michael Chen', date: '14 Feb 2026, 14:53', starred: true, type: 'pdf' },
    { id: 2, name: 'Property_Valuation_Report.pdf', category: 'Valuation', mipId: 'MIP-2024-001', size: '1.8 MB', uploader: 'Preston Rowe Paterson', date: '13 Feb 2026, 16:53', starred: false, type: 'pdf' },
    { id: 3, name: 'Property_Inspection_Photos.zip', category: 'Inspection', mipId: 'MIP-2024-001', size: '14.9 MB', uploader: 'Sarah Mitchell', date: '12 Feb 2026, 16:53', starred: false, type: 'zip' },
    { id: 4, name: 'KYC_Documents_Michael_Chen.pdf', category: 'Kyc', mipId: null, size: '3.1 MB', uploader: 'Michael Chen', date: '07 Feb 2026, 16:53', starred: false, type: 'pdf' },
    { id: 5, name: 'Contract_Signed_MIP-2024-003.pdf', category: 'Contract', mipId: 'MIP-2024-003', size: '1.2 MB', uploader: 'David Wilson', date: '31 Jan 2026, 16:53', starred: true, type: 'pdf' },
]

export const MOCK_CONTRACTS = [
    { id: 'MIP-2026-003', property: '7 Park Lane', suburb: 'South Yarra, VIC', party: 'Emma Rodriguez', lender: 'ANZ', value: 1750000, created: '25 Jan 2026', status: 'Under Contract' },
    { id: 'MIP-2026-005', property: '156 Stirling Highway', suburb: 'Nedlands, WA', party: 'Lisa Anderson', lender: 'Macquarie Bank', value: 2650000, created: '15 Jan 2026', status: 'Completed' },
]

export const MOCK_TASKS = {
    urgent: [
        { id: 1, title: 'Review KYC: Jennifer Brown', badge: 'Urgent', desc: 'Pending for 2 hours', due: 'Today' },
        { id: 2, title: 'Resolve Dispute: MIP-2026-001', badge: 'Urgent', desc: 'Valuation challenge escalated', due: 'Today' },
        { id: 3, title: 'Approve Settlement Release', badge: 'Urgent', desc: 'MIP-2026-003 - $1.2M escrow', due: 'Today 5:00 PM' },
    ],
    inProgress: [
        { id: 4, title: 'Case Documentation Review', badge: 'High', desc: 'MIP-2026-005 - Final compliance check', due: 'Tomorrow' },
        { id: 5, title: 'Platform Fee Audit', badge: 'High', desc: 'Q1 2026 reconciliation', due: 'Feb 16' },
        { id: 6, title: 'Update Fee Structure', badge: 'Medium', desc: 'Lender commission adjustments', due: 'Feb 17' },
        { id: 7, title: 'Review Investor Compliance', badge: 'Medium', desc: 'Quarterly AML/CTF checks', due: 'Feb 18' },
        { id: 8, title: 'System Performance Review', badge: 'Low', desc: 'Database optimization needed', due: 'Feb 20' },
    ],
    completed: [
        { id: 9, title: 'KYC Approved: Robert Taylor', badge: 'Done', desc: 'Completed 30 mins ago', due: 'Completed' },
        { id: 10, title: 'Case Created: MIP-2026-006', badge: 'Done', desc: 'Documentation verified', due: 'Completed' },
        { id: 11, title: 'Dispute Resolved: MIP-2026-002', badge: 'Done', desc: 'Bid verification confirmed', due: 'Completed' },
        { id: 12, title: 'Escrow Released: MIP-2026-004', badge: 'Done', desc: 'Settlement successful', due: 'Completed' },
        { id: 13, title: 'User Access Granted', badge: 'Done', desc: '3 new investor accounts activated', due: 'Completed' },
    ],
}
