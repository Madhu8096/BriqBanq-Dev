// Fallback/sample data — used only when API fails or returns empty. App remains dynamic (API data used when available).

export const FALLBACK_STATS = {
  propertyValue: 1250000,
  outstandingDebt: 980000,
  documentsRemaining: 8,
  documentsTotal: 12,
  unreadMessages: 3
}

export const FALLBACK_PROPERTY = {
  address: '45 Victoria Street',
  location: 'Potts Point, NSW 2011',
  bedrooms: 2,
  bathrooms: 2,
  landSize: 0
}

export const FALLBACK_ACTIONS = [
  { id: 1, title: 'Upload property valuation', dueDate: 'Due: 16 Feb 2026', status: 'pending', action: 'Start' },
  { id: 2, title: 'Complete identity verification', dueDate: 'Due: 18 Feb 2026', status: 'complete', action: null },
  { id: 3, title: 'Review auction terms', dueDate: 'Due: 19 Feb 2026', status: 'pending', action: 'Start' }
]

export const FALLBACK_TIMELINE = [
  { id: 1, type: 'submitted', title: 'Case submitted for review', date: '12 Feb 2026, 22:43', status: 'complete' },
  { id: 2, type: 'uploaded', title: 'Documents uploaded: Title deed', date: '11 Feb 2026, 22:43', status: 'complete' },
  { id: 3, type: 'message', title: 'New message from Admin', date: '10 Feb 2026, 22:43', status: 'info' }
]

export const FALLBACK_CASE_ID = 'MIP-2026-001'

export const FALLBACK_CASE = {
  id: 'MIP-2026-001',
  address: '45 Victoria Street, Potts Point, NSW 2011',
  status: 'In Auction',
  statusBadge: 'Medium Run',
  borrower: 'Sarah Mitchell',
  lender: 'Commonwealth Bank',
  outstandingDebt: 980000,
  propertyValuation: 1250000,
  equityAvailable: 270000,
  minimumBid: 1000000,
  currentHighestBid: 1100000,
  created: '10 Jan 2026, 09:30',
  lastUpdated: '10 Feb 2026, 09:30',
  tasksReceived: 7
}

export const FALLBACK_ACTIVITY = [
  { id: 1, type: 'bid', title: 'New bid placed', description: 'Premium Capital Partners bid $1,100,000', time: '14 Feb 2026, 22:42 AEST' },
  { id: 2, type: 'document', title: 'Document uploaded', description: 'Property Valuation Report added', time: '14 Feb 2026, 20:23' },
  { id: 3, type: 'message', title: 'Message received', description: 'Sarah Mitchell sent a message', time: '14 Feb 2026, 10:14 AEST' }
]

export const FALLBACK_CONTRACTS = [
  { id: 'MIP-2026-003', propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200', propertyName: '7 Park Lane', location: 'South Yarra, VIC', party: 'Emma Rodriguez', lender: 'ANZ', contractValue: 1750000, createdDate: '25 Jan 2026', status: 'Under Contract' },
  { id: 'MIP-2026-005', propertyImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200', propertyName: '156 Stirling Highway', location: 'Nedlands, WA', party: 'Lisa Anderson', lender: 'Macquarie Bank', contractValue: 2650000, createdDate: '15 Jan 2026', status: 'Completed' }
]

export const FALLBACK_NOTIFICATIONS = [
  { id: 1, type: 'bid', title: 'New Bid Placed', message: 'A new bid of A$1,100,000 has been placed on MIP-2024-001', time: '38 minutes ago', isNew: true, read: false },
  { id: 2, type: 'message', title: 'New Message', message: 'Sarah Mitchell sent you a message about MIP-2024-003', time: 'about 2 hours ago', isNew: true, read: false },
  { id: 3, type: 'auction', title: 'Auction Ending Soon', message: 'MIP-2024-002 auction ends in 30 minutes', time: 'about 4 hours ago', isNew: false, read: true }
]

export const FALLBACK_PROFILE = {
  firstName: 'David',
  lastName: 'Williams',
  email: 'david.williams@email.com',
  phone: '+61 4XX XXX XXX'
}
