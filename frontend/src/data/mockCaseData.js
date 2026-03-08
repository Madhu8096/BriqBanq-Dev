// src/data/mockCaseData.js
// Use ONLY for development. Replace with API calls in production.

export const MOCK_CASE_DETAILS = {
    id: 'MIP-2026-001',
    status: 'In Auction',
    risk: 'Medium Risk',
    address: '45 Victoria Street, Potts Point, NSW 2011',
    borrower: {
        name: 'Sarah Mitchell',
        contact: 'sarah.mitchell@email.com',
    },
    lender: {
        name: 'Commonwealth Bank',
        contact: 'lending@cba.com.au',
    },
    loan: {
        outstandingDebt: 980000,
        interestRate: 5.75,
        defaultRate: 8.25,
        daysInDefault: 0,
    },
    property: {
        address: '45 Victoria Street',
        suburb: 'Potts Point',
        postcode: '2011',
        state: 'NSW',
        type: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        parking: 1,
        landSize: null,
    },
    valuation: {
        amount: 1250000,
        date: '2026-01-15',
        valuer: 'Preston Rowe Paterson',
    },
    financial: {
        propertyValuation: 1250000,
        outstandingDebt: 980000,
        equityAvailable: 270000,
        minimumBid: 1000000,
        currentHighestBid: 1100000,
    },
    timeline: {
        caseCreated: '2026-01-10T05:30:00Z',
        lastUpdated: '2026-02-10T05:30:00Z',
    },
    bids: [
        { id: 1, bidder: 'Platinum Capital Partners', amount: 1100000, timestamp: '2026-02-18T11:34:00Z', status: 'winning' },
        { id: 2, bidder: 'Strategic Property Group', amount: 1050000, timestamp: '2026-02-18T11:04:00Z', status: 'outbid' },
        { id: 3, bidder: 'Zenith Investments', amount: 1025000, timestamp: '2026-02-18T10:19:00Z', status: 'outbid' },
    ],
    documents: [
        { id: 1, name: 'Property Inspection Report.pdf', type: 'Inspection', uploadedBy: 'Sarah Mitchell', date: '2026-02-18', size: '2.4 MB' },
        { id: 2, name: 'Valuation Report.pdf', type: 'Valuation', uploadedBy: 'Preston Rowe Paterson', date: '2026-01-15', size: '1.8 MB' },
    ],
    messages: [
        { id: 1, sender: 'Sarah Mitchell', role: 'Borrower', message: 'I have uploaded the additional property documentation as requested.', timestamp: '2 hours ago', avatar: 'SM', isAdmin: false },
        { id: 2, sender: 'David Williams', role: 'Investor', message: 'Thank you. Could you also provide the strata report?', timestamp: '2 hours ago', avatar: 'DW', isAdmin: true },
        { id: 3, sender: 'Sarah Mitchell', role: 'Borrower', message: 'Yes, I will upload it within the next hour.', timestamp: '1 hour ago', avatar: 'SM', isAdmin: false },
    ],
    activity: [
        { id: 1, title: 'New bid placed', description: 'Platinum Capital Partners bid $1,100,000', timestamp: '18 Feb 2026, 11:43 AEST' },
        { id: 2, title: 'Document uploaded', description: 'Property inspection report added', timestamp: '18 Feb 2026, 09:58 AEST' },
        { id: 3, title: 'Message received', description: 'Sarah Mitchell sent a message', timestamp: '18 Feb 2026, 07:58 AEST' },
        { id: 4, title: 'Case status updated', description: 'Status changed to "In Auction"', timestamp: '17 Feb 2026, 11:58 AEST' },
        { id: 5, title: 'Valuation completed', description: 'Property valued at $1,250,000', timestamp: '16 Feb 2026, 11:58 AEST' },
    ],
    settlement: {
        estimatedProgress: 65,
        checklist: [
            { id: 1, item: 'Signed Loan Agreement', responsible: 'Borrower', dueDate: '2026-02-11', status: 'Open', overdue: false },
            { id: 2, item: 'Discharge Authority', responsible: 'Lender', dueDate: '2026-03-09', status: 'Upcoming', overdue: false },
            { id: 3, item: 'Title Transfer Documents', responsible: 'Lawyer', dueDate: '2026-02-14', status: 'Open', overdue: true },
            { id: 4, item: 'Insurance Certificate', responsible: 'Borrower', dueDate: '2026-02-24', status: 'Approved', overdue: false },
        ],
        timeline: [
            { step: 'Documents Submitted', date: '10 Feb 26', status: 'completed' },
            { step: 'Approved', date: '10 Feb 26', status: 'completed' },
            { step: 'Processing', date: '12 Feb 26', status: 'in-progress' },
            { step: 'Scheduled', date: '15 Mar 26', status: 'upcoming' },
            { step: 'Complete', date: '26 Mar 26', status: 'upcoming' },
        ],
    },
    images: [],
    aiContent: {
        marketingDescription: '',
        investmentHighlights: '',
        locationMarketNotes: '',
    },
}
