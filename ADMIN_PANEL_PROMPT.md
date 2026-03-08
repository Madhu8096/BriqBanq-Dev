# Brickbanq Virtual MIP Platform — Admin Panel Implementation Prompt

## Project Context

You are implementing the Admin Panel UI for **Brickbanq**, a Virtual MIP (Mortgage in Possession) Platform. This is an Australian real estate investment/auction platform. The codebase uses **Vite + React + Tailwind CSS + React Router**.

All pages live under `src/pages/admin/`. A shared `DashboardLayout` wraps every page with a persistent sidebar.

---

## Design System (Exact Values)

### Colors
```
Sidebar background:    #111827  (gray-900)
Sidebar active item:   #4F46E5  (indigo-600)
Sidebar hover:         #1F2937  (gray-800)
Sidebar text:          #FFFFFF
Sidebar muted text:    #9CA3AF  (gray-400)
Sidebar border:        #1F2937
Page background:       #F3F4F6  (gray-100)
Card background:       #FFFFFF
Card border:           #E5E7EB  (gray-200)
Top navbar bg:         #FFFFFF
Primary button:        #4F46E5  (indigo-600)
Primary button hover:  #4338CA  (indigo-700)
Danger/Delete:         #EF4444  (red-500)
Success green:         #10B981  (emerald-500)
Warning amber:         #F59E0B  (amber-500)
Badge "New" bg:        #4F46E5 (indigo-600), text white
Badge "Urgent":        #EF4444 bg, white text
Badge "High":          #F59E0B bg, white text
Badge "Medium":        #6B7280 bg, white text
Badge "Low":           #9CA3AF bg, white text
Badge "Done":          #10B981 bg, white text
Status "In Auction":   gray border pill
Status "Active":       gray border pill
Status "Completed":    #10B981 text with green bg pill
Status "Pending":      gray text/border pill
Status "Under Contract": indigo/blue text with light blue bg
Risk "Low Risk":       #10B981 bg light, green text
Risk "Medium Risk":    #F59E0B bg light, amber text
Risk "High Risk":      #EF4444 bg light, red text
Live badge:            #EF4444 bg, white text
Upcoming badge:        #4F46E5 bg, white text
Coming Soon badge:     #4F46E5 bg, white text
Active badge:          #10B981 bg, white text
Sold badge:            #6B7280 bg, white text
```

### Typography
- Font family: system-ui / sans (Tailwind default)
- Page title: `text-2xl font-bold text-gray-900`
- Page subtitle: `text-sm text-gray-500`
- Section header: `text-lg font-semibold text-gray-900`
- Table header: `text-sm font-medium text-gray-500`
- Table cell: `text-sm text-gray-900`
- Stat number (large): `text-3xl font-bold text-gray-900`
- Stat label: `text-sm text-gray-500`
- Card label: `text-sm font-medium text-gray-700`
- Sidebar item: `text-sm font-medium`
- Breadcrumb: `text-sm text-gray-500`

### Spacing & Layout
- Sidebar width: `w-[150px]` fixed left
- Main content: `ml-[150px]` with `p-8`
- Top navbar height: `h-14` or `h-16`
- Card padding: `p-6`
- Table row padding: `py-3 px-4`
- Gap between stat cards: `gap-4` or `gap-6`
- Section margin top: `mt-6` or `mt-8`

---

## Folder Structure

```
src/
├── pages/
│   └── admin/
│       ├── Dashboard.jsx
│       ├── CaseManagement.jsx
│       ├── AllDeals.jsx
│       ├── AuctionControl.jsx
│       ├── KYCReviewQueue.jsx
│       ├── Contracts.jsx
│       ├── EscrowManagement.jsx
│       ├── DocumentLibrary.jsx
│       ├── ReportsAnalytics.jsx
│       ├── AdminConsole.jsx
│       ├── Notifications.jsx
│       └── Settings.jsx
├── components/
│   └── admin/
│       ├── DashboardLayout.jsx
│       └── Sidebar.jsx
├── services/
│   └── api.js
└── App.jsx  (or router file)
```

---

## Routing (React Router v6)

```jsx
// App.jsx or router setup
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/admin/DashboardLayout'
import Dashboard from './pages/admin/Dashboard'
import CaseManagement from './pages/admin/CaseManagement'
import AllDeals from './pages/admin/AllDeals'
import AuctionControl from './pages/admin/AuctionControl'
import KYCReviewQueue from './pages/admin/KYCReviewQueue'
import Contracts from './pages/admin/Contracts'
import EscrowManagement from './pages/admin/EscrowManagement'
import DocumentLibrary from './pages/admin/DocumentLibrary'
import ReportsAnalytics from './pages/admin/ReportsAnalytics'
import AdminConsole from './pages/admin/AdminConsole'
import Notifications from './pages/admin/Notifications'
import Settings from './pages/admin/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="case-management" element={<CaseManagement />} />
          <Route path="all-deals" element={<AllDeals />} />
          <Route path="auction-control" element={<AuctionControl />} />
          <Route path="kyc-review" element={<KYCReviewQueue />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="escrow-management" element={<EscrowManagement />} />
          <Route path="document-library" element={<DocumentLibrary />} />
          <Route path="reports-analytics" element={<ReportsAnalytics />} />
          <Route path="admin-console" element={<AdminConsole />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## API Service (`src/services/api.js`)

```js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// WebSocket factory
export const createWebSocket = (path) => {
  const WS_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'
  return new WebSocket(`${WS_URL}${path}`)
}

// Cases
export const getCases = () => api.get('/api/cases')
export const getCase = (id) => api.get(`/api/cases/${id}`)

// Deals
export const getDeals = () => api.get('/api/deals')

// Auctions
export const getAuctions = () => api.get('/api/auctions')
export const placeBid = (auctionId, amount) => api.post(`/api/auctions/${auctionId}/bid`, { amount })

// KYC
export const getKYCSubmissions = () => api.get('/api/kyc')
export const approveKYC = (userId) => api.post(`/api/kyc/${userId}/approve`)
export const rejectKYC = (userId) => api.post(`/api/kyc/${userId}/reject`)

// Contracts
export const getContracts = () => api.get('/api/contracts')
export const createContract = (data) => api.post('/api/contracts', data)

// Escrow
export const getEscrow = () => api.get('/api/escrow')
export const releaseEscrow = (transactionId) => api.post(`/api/escrow/${transactionId}/release`)
export const releaseAllEscrow = () => api.post('/api/escrow/release-all')

// Documents
export const getDocuments = () => api.get('/api/documents')
export const uploadDocument = (formData) => api.post('/api/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteDocument = (id) => api.delete(`/api/documents/${id}`)

// Reports
export const getReports = (period) => api.get(`/api/reports?period=${period}`)
export const exportReport = (type, format) => api.get(`/api/reports/${type}/export?format=${format}`, { responseType: 'blob' })

// Notifications
export const getNotifications = () => api.get('/api/notifications')
export const markNotificationRead = (id) => api.patch(`/api/notifications/${id}/read`)
export const markAllRead = () => api.patch('/api/notifications/read-all')
export const deleteNotification = (id) => api.delete(`/api/notifications/${id}`)

// Admin
export const getAdminTasks = () => api.get('/api/admin/tasks')
export const completeTask = (id) => api.post(`/api/admin/tasks/${id}/complete`)

export default api
```

---

## Component: `DashboardLayout.jsx`

```jsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[150px]">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-[150px] right-0 z-10">
          <div />
          <div className="flex items-center gap-3">
            {/* Role dropdown */}
            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 cursor-pointer">
              <span className="w-4 h-4 text-indigo-600">⚙</span>
              <span>Admin</span>
              <span className="text-gray-400">▾</span>
            </div>
            {/* Org dropdown */}
            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 cursor-pointer">
              <span>Brickbanq</span>
              <span className="text-gray-400">▾</span>
            </div>
            {/* Bell */}
            <div className="relative cursor-pointer">
              <span className="text-gray-500 text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            {/* User */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">David Williams</p>
                <p className="text-xs text-gray-500">Investor</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">DW</div>
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 mt-14 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

---

## Component: `Sidebar.jsx`

```jsx
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
  { label: 'Case Management', path: '/case-management', icon: '📋' },
  { label: 'All Deals', path: '/all-deals', icon: '🏷' },
  { label: 'Auction Control', path: '/auction-control', icon: '⚡' },
  { label: 'KYC Review Queue', path: '/kyc-review', icon: '👥' },
  { label: 'Contracts', path: '/contracts', icon: '📄' },
  { label: 'Escrow Management', path: '/escrow-management', icon: '⊙' },
  { label: 'Document Library', path: '/document-library', icon: '📁' },
  { label: 'Reports & Analytics', path: '/reports-analytics', icon: '📊' },
  { label: 'Admin Console', path: '/admin-console', icon: '🛡' },
  { label: 'Notifications', path: '/notifications', icon: '🔔' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-[150px] bg-gray-900 flex flex-col z-20">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-600 rounded-sm" />
          <div>
            <p className="text-white text-sm font-bold leading-tight">Brickbanq</p>
            <p className="text-gray-400 text-[10px] leading-tight">Virtual MIP Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 mx-2 my-0.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="leading-tight text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-gray-800 p-3">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full px-3 py-2 rounded hover:bg-gray-800 transition-colors">
          <span>↪</span>
          <span className="text-xs">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
```

---

## Page: `Dashboard.jsx`

Matches the main dashboard screenshot. It shows:
- Page title "Dashboard", subtitle "Platform administration and compliance management"
- 4 stat cards in a row: Pending KYC (7), Active Disputes (2), Platform Users (146 ↑23%), Monthly Volume ($12.5M ↑15%)
- Tabs row: Tasks | KYC Review | Disputes | Fee Configuration | Audit Logs
- Three-column kanban board: Urgent (3 tasks) | In Progress (5 tasks) | Completed (5 tasks)

### Stat Cards (4 across)
Each card: white bg, rounded-lg, p-6, border border-gray-200, flex justify-between items-start
- Left: label text-sm text-gray-500, big number text-3xl font-bold text-gray-900, optional growth badge
- Right: icon in colored circle

Stat data:
```
{ label: 'Pending KYC', value: '7', icon: '👥', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }
{ label: 'Active Disputes', value: '2', icon: '⚠', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
{ label: 'Platform Users', value: '146', growth: '+23%', icon: '📈', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }
{ label: 'Monthly Volume', value: '$12.5M', growth: '+15%', icon: '$', iconBg: 'bg-green-100', iconColor: 'text-green-600' }
```

### Tabs
Simple horizontal tab bar below stats. Active tab: text-gray-900 font-medium with border-b-2 border-indigo-600. Inactive: text-gray-500.
Tabs: Tasks, KYC Review, Disputes, Fee Configuration, Audit Logs

### Kanban Board (3 columns)
Each column is a rounded-lg bg-white or light-tinted card container with a header.

**Urgent column** (red-tinted header bg-red-50):
- Header: red circle ⊘ icon + "Urgent" text + "3 tasks" badge (red bg, white text)
- Task cards (white bg, rounded, border, p-3 mb-2):
  1. "Review KYC: Jennifer Brown" [Urgent badge: red], "Pending for 2 hours", "Due: Today" — buttons: [Review] [Complete (indigo)]
  2. "Resolve Dispute: MIP-2026-001" [Urgent badge: red], "Valuation challenge escalated", "Due: Today" — buttons: [Review] [Complete]
  3. "Approve Settlement Release" [Urgent badge: red], "MIP-2026-003 - $1.2M escrow", "Due: Today 5:00 PM" — buttons: [Review] [Complete]

**In Progress column** (amber-tinted bg-amber-50):
- Header: clock icon + "In Progress" + "5 tasks" badge (amber)
- Tasks:
  1. "Case Documentation Review" [High: amber], "MIP-2026-005 - Final compliance check", "Due: Tomorrow" — [Review] [Complete]
  2. "Platform Fee Audit" [High: amber], "Q1 2026 reconciliation", "Due: Feb 16" — [Review] [Complete]
  3. "Update Fee Structure" [Medium: gray], "Lender commission adjustments", "Due: Feb 17" — [Review] [Complete]
  4. "Review Investor Compliance" [Medium: gray], "Quarterly AML/CTF checks", "Due: Feb 18" — [Review] [Complete]
  5. "System Performance Review" [Low: light gray], "Database optimization needed", "Due: Feb 20" — [Review] [Complete]

**Completed column** (green-tinted bg-green-50):
- Header: checkmark icon + "Completed" + "5 tasks" badge (green)
- Tasks (no action buttons, just info + Done badge):
  1. "KYC Approved: Robert Taylor" [Done: green], "Completed 30 mins ago", "Due: Completed"
  2. "Case Created: MIP-2026-006" [Done], "Documentation verified", "Due: Completed"
  3. "Dispute Resolved: MIP-2026-002" [Done], "Bid verification confirmed", "Due: Completed"
  4. "Escrow Released: MIP-2026-004" [Done], "Settlement successful", "Due: Completed"
  5. "User Access Granted" [Done], "3 new investor accounts activated", "Due: Completed"

Each task card has a drag handle (⋮⋮) on the left side (text-gray-300).

---

## Page: `CaseManagement.jsx`

- Breadcrumb: Dashboard > Admin > Case Management
- Title: "Case Management", subtitle: "Platform administration and compliance management"
- 4 stat cards: Total Cases (5), Active Cases (2), In Auction (1), Completed (1)
- Table: "All Cases (5)" with search input, "All Status" dropdown, Refresh button, Export button

Table columns: Case Number | Borrower | Property | Debt | Valuation | Status | Risk | Created | Actions

Table data (5 rows):
```
MIP-2026-001 | Sarah Mitchell   | 45 Victoria Street, Potts Point, NSW    | A$980k  | A$1250k | In Auction (dropdown) | Medium Risk | 10 Jan 2026 | 👁 🗑
MIP-2026-002 | James Chen       | 128 Brighton Boulevard, North Bondi, NSW | A$2100k | A$3200k | Active (dropdown)     | Low Risk    | 18 Jan 2026 | 👁 🗑
MIP-2026-003 | Emma Rodriguez   | 7 Park Lane, South Yarra, VIC           | A$1600k | A$1850k | Active (dropdown)     | Low Risk    | 25 Jan 2026 | 👁 🗑
MIP-2026-004 | Michael Thompson | 92 George Street, Brisbane CBD, QLD     | A$480k  | A$520k  | Pending (dropdown)   | High Risk   | 02 Feb 2026 | 👁 🗑
MIP-2026-005 | Lisa Anderson    | 156 Stirling Highway, Nedlands, WA      | A$1950k | A$2800k | Completed (dropdown)  | Low Risk    | 15 Jan 2026 | 👁 🗑
```

Status column is a `<select>` dropdown styled as a pill.
Risk column: colored badge pill.
Actions: eye icon (view) and red trash icon (delete).

---

## Page: `AllDeals.jsx`

- Title: "All Deals", subtitle: "Platform administration and compliance management"
- Search bar, "All States" dropdown, "All Status" dropdown, "Newest" dropdown, filter icon
- "5 Properties" heading + "Investment opportunities across Australia" + Map View / List View buttons

Property cards in a 3-column grid (wrap to next row for 4th and 5th):

**Card 1 — 45 Victoria Street** (Live Auction status):
- Badge: red "● LIVE AUCTION" top-left of image
- Image with bedroom/bath/car icons: 2🛏 2🚿 1🚗
- Address: "45 Victoria Street", "Potts Point, NSW 2011"
- Loan Amount: $980k | Current Bid: $1100k (green) | Buy Now Price: $1075k (green)
- LVR: 78.4% | Return: 12.4% | Type: Apartment
- Red countdown bar: "Ends in  2h 45m"
- ID: MIP-2026-001 | 7 bids
- Button: [Place Bid] (indigo full width) + eye icon

**Card 2 — 128 Brighton Boulevard** (Coming Soon):
- Badge: indigo "COMING SOON"
- 4🛏 3🚿 2🚗
- Loan Amount: $2100k | Buy Now Price: $2485k (green)
- LVR: 65.6% | Return: 12.4% | Type: House
- Calendar row: "Auction  18 Feb 2026" (indigo calendar icon)
- ID: MIP-2026-002
- Buttons: [View] [Buy Now (indigo)]

**Card 3 — 7 Park Lane** (Active):
- Badge: green "ACTIVE"
- 3🛏 2🚿 2🚗
- Loan Amount: $1600k | Buy Now Price: $1688k (green)
- LVR: 86.5% | Return: 12.4% | Type: Townhouse
- ID: MIP-2026-003 | 12 bids
- Button: [View Details]

(Cards 4 and 5 partially visible — one with green ACTIVE badge, one with gray SOLD badge)

---

## Page: `AuctionControl.jsx`

- Title: "Auctions", subtitle: "Platform administration and compliance management"
- 4 stat cards: Live Now (1, red pulse icon), Upcoming (1, blue calendar), Total Value ($8.2M, green $), Active Bidders (24, purple 👥)
- Search + "All Auctions" dropdown + "Ending Soon" dropdown + Advanced Filters
- "2 Auctions" heading

Property auction cards (2 across):

**Card 1 — 45 Victoria Street, Potts Point, NSW** (LIVE NOW):
- Top of card image has red "● LIVE NOW" badge top-left
- Red countdown bar "⏱ Ends in   2h 45m"
- 2🛏 2🚿 1🚗 icons on image
- Below image:
  - Default: 89d | Arrears: 127d | Rate: 8.25%
  - Outstanding Debt: $980k | Current Bid: $1100k (green)
  - Property Value: $1250k | LVR: 78.4%
  - "🔥 7 bidders ⚠ High Activity" row

**Card 2 — 128 Brighton Boulevard, North Bondi, NSW** (UPCOMING):
- Indigo "📅 UPCOMING" badge
- 4🛏 3🚿 2🚗
- Default: 45d | Arrears: 92d | Rate: 7.5%
- Outstanding Debt: $2100k | Property Value: $3200k | LVR: 65.6%
- Green info box: Expected Return 12.4% | Equity $1100k

---

## Page: `KYCReviewQueue.jsx`

- Title: "KYC Review", subtitle: "Platform administration and compliance management"
- 3 stat cards: Pending Reviews (2, amber eye icon), Approved Today (7, green ✓), Rejected Today (2, red ✗)
- Section: "KYC Submissions"

Table columns: User | Role | Email | Submitted | Documents | Status | Actions

Table data:
```
Sarah Mitchell | Borrower | sarah.mitchell@email.com | 10 Feb 2026 | 3 files | Pending pill | [Review] [✓ Approve (green)] [✗ Reject (red)]
James Chen     | Investor | james.chen@email.com     | 11 Feb 2026 | 4 files | Pending pill | [Review] [✓ Approve] [✗ Reject]
Emma Watson    | Investor | emma.watson@email.com    | 09 Feb 2026 | 3 files | approved (blue-indigo filled pill) | [👁 View]
```

---

## Page: `Contracts.jsx`

- Title: "Contracts", subtitle: "Platform administration and compliance management"
- Button top right: "+ Create New Contract" (indigo)
- Section: "Contracts"

Table columns: Property (with thumbnail image) | Contract ID | Parties | Contract Value | Created Date | Status | Actions

Table data:
```
[img] 7 Park Lane, South Yarra, VIC      | MIP-2026-003 | Emma Rodriguez / ANZ          | $1,750,000 | 25 Jan 2026 | Under Contract (indigo text, light indigo bg) | [👁 View] [⬇]
[img] 156 Stirling Highway, Nedlands, WA | MIP-2026-005 | Lisa Anderson / Macquarie Bank | $2,650,000 | 15 Jan 2026 | Completed (green text, light green bg)         | [👁 View] [⬇]
```

Property column shows a small square thumbnail image (40x40px rounded) + address text.

---

## Page: `EscrowManagement.jsx`

- Breadcrumb: Dashboard > Escrow > Release Funds
- Title: "Escrow Release", subtitle: "Platform administration and compliance management"
- 3 stat cards: Total Held (A$125,000, blue clipboard icon), Total Released (A$225,000, green trend-up icon), Remaining Balance (A$-100,000 in red/negative, purple $ icon)

- Yellow alert banner: "⚠ Pending Releases — 2 transactions awaiting release (A$15,000)" with [Release All] button (indigo, right side)

- Section: "Transaction History" with "4 total transactions" count

Table columns: Date | Type | Recipient | Amount | Status | Action

```
10 Feb 2026 | Initial Deposit     | Escrow Account            | A$125,000 | Completed (green) | ✓ Released (green text)
12 Feb 2026 | Release to Seller   | Sarah Mitchell            | A$100,000 | Completed (green) | ✓ Released (green text)
13 Feb 2026 | Agent Commission    | Melbourne Property Group  | A$12,500  | Pending (gray)    | [Release] button
13 Feb 2026 | Legal Fees          | Smith & Partners Legal    | A$2,500   | Pending (gray)    | [Release] button
```

- Bottom: 2 side-by-side cards:
  
  **Left: Escrow Details**
  - Escrow Agent: "Australian Settlement Services"
  - License: ESA-2024-5678
  - Settlement Date: "28 February 2026" + "15 days remaining"
  - Account Number: ESC-2024-1234

  **Right: Security & Compliance** (blue-tinted or white)
  - ✓ Secure Escrow — "Funds held in trust account" (indigo checkmark)
  - ✓ Two-Factor Authentication — "All releases require 2FA"
  - ✓ Audit Trail — "All transactions logged"
  - ✓ Insured — "Professional indemnity insurance"

---

## Page: `DocumentLibrary.jsx`

- Breadcrumb: Dashboard > Document Library
- Title: "Documents", subtitle: "Platform administration and compliance management"
- 4 stat cards: Total Documents (5, blue doc icon), Storage Used (23.2 MB, green folder), Starred (2, amber star), This Week (3, indigo upload arrow)

- Filter bar: Search input | "All Categories" dropdown | "All Types" dropdown | [⭐ Starred] | [Clear] | [⬇ Export] | [⬆ Upload (indigo)]

- "All Documents (5)" section

Document list (rows):
```
[red pdf icon] Investment_Memorandum_MIP-2024-001.pdf | Contract (indigo) | MIP-2024-001 (gray) | [⭐filled] 2.3MB · Uploaded by Michael Chen · 14 Feb 2026, 14:53 | [👁][⬇][share][🗑red]
[red pdf icon] Property_Valuation_Report.pdf          | Valuation (blue)  | MIP-2024-001        | [☆empty] 1.8MB · Uploaded by Preston Rowe Paterson · 13 Feb 2026, 16:53 | [👁][⬇][share][🗑]
[white file icon] Property_Inspection_Photos.zip      | Inspection (green)| MIP-2024-001        | [☆empty] 14.9MB · Uploaded by Sarah Mitchell · 12 Feb 2026, 16:53 | [👁][⬇][share][🗑]
[red pdf icon] KYC_Documents_Michael_Chen.pdf         | Kyc (orange/amber)| —                   | [☆empty] 3.1MB · Uploaded by Michael Chen · 07 Feb 2026, 16:53 | [👁][⬇][share][🗑]
[red pdf icon] Contract_Signed_MIP-2024-003.pdf       | Contract (indigo) | MIP-2024-003        | [⭐filled] 1.2MB · Uploaded by David Wilson · 31 Jan 2026, 16:53 | [👁][⬇][share][🗑]
```

- Bottom info box (blue-tinted bg-indigo-50, indigo folder icon):
  **Document Management**
  "All documents are encrypted and stored securely. Documents are retained per Australian compliance requirements."
  • Maximum file size: 50MB per document
  • Supported formats: PDF, DOCX, XLSX, images (JPG, PNG)
  • Version control and audit trail maintained

---

## Page: `ReportsAnalytics.jsx`

- Breadcrumb: Dashboard > Reports & Analytics
- Title: "Reports", subtitle; section title "Reports & Analytics", section subtitle "Comprehensive platform insights and performance metrics"
- Top right: "Last 30 Days" dropdown + [🔄 Refresh] button

- 6 stat cards in a row: Total Cases (47, +12% vs last period) | Active Cases (23, "23 in progress") | Total Revenue (A$12.4M, +18%) | Avg Case Value (A$1050K, "Per case") | Total Bids (156, "3.3 per case") | Success Rate (68%, +5%)

- 4 report export cards in 2x2 grid:

  **Financial Summary** — "Revenue, payments, and transaction analysis" — [⬇ Export PDF] [⬇ Export Excel]
  **Case Performance** — "Case volume, status breakdown, and trends" — [⬇ Export PDF] [⬇ Export Excel]
  **User Activity** — "User engagement, registrations, and KYC" — [⬇ Export PDF] [⬇ Export Excel]
  **Auction Analytics** — "Bidding activity, win rates, and pricing" — [⬇ Export PDF] [⬇ Export Excel]

  Each card has an icon ($ green circle for Financial, doc blue for Case, person purple for User, chart red for Auction)
  Export PDF button: indigo full-width with download icon
  Export Excel button: outlined, lighter, full-width

- 2 chart placeholders side by side:
  **Case Volume Trend** — [View Details] top right — placeholder box with bar chart icon, "Interactive chart would display here", "Showing case volume over time"
  **Revenue Distribution** — [View Details] top right — placeholder with pie chart icon, "Showing revenue by category"

- "Recent Platform Activity" section with [↗ View All] — first item visible: "New case created — MIP-2024-012 by Sarah Mitchell — 5 minutes ago"

---

## Page: `AdminConsole.jsx`

Same layout as Dashboard Kanban but with breadcrumb from Admin Console navigation.
- Title: "Admin Console", subtitle: "Platform administration and compliance management"
- Same 4 stat cards: Pending KYC (7), Active Disputes (2), Platform Users (146 +23%), Monthly Volume ($12.5M +15%)
- Tabs: Tasks | KYC Review | Disputes | Fee Configuration | Audit Logs
- Same 3-column kanban as Dashboard (identical data)

(This page is essentially the same as the Dashboard view — share the kanban board component)

---

## Page: `Notifications.jsx`

- Title: "Notifications", subtitle: "Platform administration and compliance management"
- 3 stat cards: Unread (3, red bell icon, "Requires attention"), Total Notifications (7, blue envelope, "All time"), This Week (7, green chat bubble, "Last 7 days")

- Filter bar: Search input "Search notifications..." | "All Types" dropdown | "All Status" dropdown | [Clear Filters] | [✓ Mark All Read]

- "Notifications (7)" section header + [🗑 Delete All] top right

Notification rows (each with left icon, content, timestamp, action buttons):

```
1. 🔔 NEW — "New Bid Placed" [New badge: indigo]
   "A new bid of A$1,100,000 has been placed on MIP-2024-001"  ·  23 minutes ago
   [👁 View] [✓ Mark as read] [🗑 Delete (red)]
   (highlighted row with light blue/indigo bg)

2. 💬 NEW — "New Message" [New badge]
   "Sarah Mitchell sent you a message about MIP-2024-003"  ·  about 2 hours ago
   [👁 View] [✓ Mark as read] [🗑 Delete]
   (highlighted row)

3. ✉ — "Auction Ending Soon"
   "MIP-2024-002 auction ends in 30 minutes"  ·  about 4 hours ago
   [👁 View] [🗑 Delete]

4. 🔔 — "Bid Outbid"
   "Your bid on MIP-2024-001 has been outbid"  ·  1 day ago
   [👁 View] [🗑 Delete]

5. ✓ — "KYC Approved"
   "Your KYC verification has been approved"  ·  2 days ago
   [🗑 Delete]

6. ✉ NEW — "Contract Ready for Signature" [New badge]
   "Contract for MIP-2024-005 is ready for your digital signature"  ·  3 days ago
   [👁 View] [✓ Mark as read] [🗑 Delete]

7. ✉ — "Payment Received" (partially visible at bottom)
   (4 days ago)
```

Unread/new rows have a subtle left indigo border and slightly highlighted background (bg-indigo-50/30).

---

## Page: `Settings.jsx`

- Title: "Settings", subtitle: "Platform administration and compliance management"
- 2x2 grid of setting cards:

  **Profile Settings** (👤 icon, indigo):
  "Update your personal information and contact details"
  [Edit Profile] button (outlined, gray border)

  **Organization** (🏢 icon, indigo):
  "Manage organization details and team members"
  [Manage Organization] button (outlined, gray border)

  **Security** (🔒 icon, indigo):
  "Password, 2FA, and security preferences"
  [Security Settings] button (outlined)

  **Notifications** (🔔 icon, indigo):
  "Configure email and platform notifications"
  [Notification Settings] button (outlined)

Each card: white bg, rounded-lg, border border-gray-200, p-6
Icon is indigo colored, label text-lg font-semibold text-gray-900, description text-sm text-gray-500 mt-1 mb-4, button outlined (border border-gray-300, bg-white, text-sm px-3 py-1.5 rounded)

---

## Mock Data (Separate file: `src/data/mockData.js`)

```js
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
```

---

## Reusable Utility Components

These small components should be built and reused across pages:

### `StatCard`
```jsx
// props: label, value, growth, icon, iconBg, iconColor
```

### `Badge`
```jsx
// props: label, variant ('urgent'|'high'|'medium'|'low'|'done'|'new'|'pending'|'approved'|'completed'|'active'|'live'|'upcoming')
// Map variants to bg/text colors as per design system above
```

### `StatusPill`
```jsx
// props: status — renders colored pill
```

### `RiskBadge`
```jsx
// props: risk — 'Low Risk' | 'Medium Risk' | 'High Risk'
```

### `Breadcrumb`
```jsx
// props: items = [{label, path}]
```

---

## Tailwind Class Reference (Key Patterns)

```
Page wrapper:         <div className="space-y-6">
Page header:          <div className="mb-6">
Title:                <h1 className="text-2xl font-bold text-gray-900">
Subtitle:             <p className="text-sm text-gray-500 mt-1">
Stat grid:            <div className="grid grid-cols-4 gap-4">
Stat card:            <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-between items-start">
Stat value:           <p className="text-3xl font-bold text-gray-900 mt-1">
Table container:      <div className="bg-white rounded-lg border border-gray-200">
Table header row:     <tr className="border-b border-gray-200">
Table th:             <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">
Table td:             <td className="px-4 py-3 text-sm text-gray-900">
Table row hover:      hover:bg-gray-50
Primary button:       <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded">
Outlined button:      <button className="border border-gray-300 bg-white text-gray-700 text-sm px-3 py-1.5 rounded hover:bg-gray-50">
Green action:         text-green-600 hover:text-green-700
Red action:           text-red-500 hover:text-red-600
Card:                 <div className="bg-white rounded-lg border border-gray-200 p-6">
Section header:       <div className="flex justify-between items-center mb-4">
```

---

## Important Notes

1. **No hardcoded images** — Use placeholder image URLs like `https://images.unsplash.com/photo-...` for property photos, or a gray placeholder div.
2. **All interactive elements** (dropdowns, buttons, search) should have `useState` hooks and be ready for API wiring.
3. **WebSocket placeholder** in AuctionControl: add a `useEffect` that calls `createWebSocket('/ws/auctions')` with a comment `// TODO: connect to live auction feed`.
4. **Modular**: Each page is its own file, imports reusable components from `src/components/admin/`.
5. **No TypeScript** — plain JavaScript JSX.
6. **No external UI libraries** — Tailwind only.
7. **Sidebar active state** is handled by React Router's `NavLink` `isActive` prop.
8. The negative Remaining Balance (A$-100,000) on Escrow page should render in red text.
9. The "New" badge on notifications is `bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded font-medium`.
10. All currency values are Australian dollars (A$) on Escrow/Case pages, plain $ on Deals/Auction pages.
