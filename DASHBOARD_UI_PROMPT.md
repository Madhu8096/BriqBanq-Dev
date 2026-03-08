# Brickbanq — Dashboard Page Rewrite Prompt (`src/pages/admin/Dashboard.jsx`)

## Overview

Rewrite `src/pages/admin/Dashboard.jsx` completely to match the new design screenshot. This replaces the existing Kanban-style dashboard with a data-rich overview dashboard. The existing `DashboardLayout`, `Sidebar`, and routing remain unchanged — only the `Dashboard.jsx` page content changes.

---

## Design System Reference (Inherit from Project)

```
Page background:        #F3F4F6  (gray-100)
Card background:        #FFFFFF
Card border:            #E5E7EB  (gray-200)
Primary/Indigo:         #4F46E5
Success/Green:          #10B981
Warning/Amber:          #F59E0B
Danger/Red:             #EF4444
Text primary:           #111827  (gray-900)
Text secondary:         #6B7280  (gray-500)
Text muted:             #9CA3AF  (gray-400)
Growth green text:      #10B981
Section link blue:      #4F46E5  (indigo-600)
```

---

## Page Structure (Top to Bottom)

```
1. Page Header
2. Stat Cards Row (4 cards)
3. Two-column section:
   Left  → Monthly Overview card
   Right → Platform Status card
4. Two-column section:
   Left  → Recent Cases card
   Right → Recent Sales card
5. Quick Actions card (full width)
```

---

## Section 1 — Page Header

```jsx
<div className="mb-6">
  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
  <p className="text-sm text-gray-500 mt-0.5">Platform administration and compliance management</p>
</div>
```

---

## Section 2 — Stat Cards (4 columns)

Layout: `grid grid-cols-4 gap-4 mb-6`

Each card: `bg-white rounded-lg border border-gray-200 p-5`

### Card 1 — Total Cases
- Top row: blue briefcase/document icon (left) + green growth badge "+12%" (right, `text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded`)
- Label: `text-sm text-gray-500 mt-3` → "Total Cases"
- Value: `text-3xl font-bold text-gray-900` → "247"
- Sub: `text-xs text-gray-400 mt-1` → "89 active • 34 listed"
- Icon: indigo/blue colored, e.g. `text-indigo-500`, briefcase or document icon (SVG or emoji 📋)

### Card 2 — Total Sales
- Top row: green dollar/$ icon (left) + green "+23%" badge (right)
- Label: "Total Sales"
- Value: `text-3xl font-bold text-gray-900` → "A$15.8M"
- Sub: "Avg. A$105.5K per deal"
- Icon: green `$` or money bag icon

### Card 3 — Platform Users
- Top row: purple people/users icon (left) + green "+18%" badge (right)
- Label: "Platform Users"
- Value: "1,284"
- Sub: "8 pending KYC"
- Icon: purple users/people icon

### Card 4 — Active Auctions
- Top row: amber/gold hammer/gavel icon (left) + green "94.2%" badge (right, note: no + sign, just the percentage)
- Label: "Active Auctions"
- Value: "12"
- Sub: "Success rate: 94.2%"
- Icon: amber gavel or hammer icon

**Growth badge exact style:**
```jsx
<span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
  <span className="text-green-500">↗</span> +12%
</span>
```
For Card 4 the badge shows "94.2%" with no arrow, same green styling.

---

## Section 3 — Two Column: Monthly Overview + Platform Status

Layout: `grid grid-cols-2 gap-4 mb-6`

---

### Left Card — Monthly Overview

Card: `bg-white rounded-lg border border-gray-200 p-5`

**Header row:**
- Left: `text-base font-semibold text-gray-900` → "Monthly Overview"
- Right: dropdown selector showing "Last 7 Months" with a chevron (gray border, rounded, `text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 flex items-center gap-1`)

**Sub-section 1: Cases Created**
- Row: left label `text-sm text-gray-600` "Cases Created" | right value `text-sm font-semibold text-indigo-600` "38"
- Below: a bar chart area — a simple placeholder with month labels
- Month labels (x-axis): Aug | Sep | Oct | Nov | Dec | Jan | Feb — `text-xs text-gray-400`
- Chart area height: ~60px, light gray bg (`bg-gray-50 rounded`) with a simple bar chart visual
- Bars are indigo/blue colored (`bg-indigo-500`), varying heights representing case volumes across months
- Use a simple inline bar chart built with divs (no chart library required, just flex + varying height divs)

**Bar chart data (approximate heights for visual match):**
```
Aug: 35%
Sep: 45%
Oct: 50%
Nov: 60%
Dec: 40%
Jan: 55%
Feb: 70%  (tallest, representing current month peak)
```

**Sub-section 2: Sales Volume**
- Row: left label "Sales Volume" | right value `text-sm font-semibold text-green-600` "A$5.9M"
- Same month labels below
- Bar chart area, same structure, bars are green (`bg-green-500`)

**Bar chart data for sales (approximate):**
```
Aug: 40%
Sep: 55%
Oct: 45%
Nov: 70%
Dec: 35%
Jan: 60%
Feb: 65%
```

Spacing between the two chart sub-sections: `mt-4`

---

### Right Card — Platform Status

Card: `bg-white rounded-lg border border-gray-200 p-5`

**Header:**
- `text-base font-semibold text-gray-900` → "Platform Status"

**4 status rows** below, each full-width, with light colored bg tint:

**Row 1 — Live Auctions (indigo/blue)**
```
bg: bg-indigo-50, border-l-4 border-indigo-400
Left: 🔴 dot (live pulse) + "Live Auctions" (text-sm font-medium text-gray-800)
Right: "12" (text-xl font-bold text-indigo-600)
Sub-row: "Total Bids: 87  •  Avg: 7.2 bids/auction" (text-xs text-gray-500)
```
Structure: `rounded-lg p-3 mb-3`

**Row 2 — Pending Approvals (amber)**
```
bg: bg-amber-50, border-l-4 border-amber-400
Left: ⏰ clock icon + "Pending Approvals" (text-sm font-medium text-gray-800)
Right: "8" (text-xl font-bold text-amber-600)
Sub-row: "KYC: 8  •  Cases: 3  •  Contracts: 2" (text-xs text-gray-500)
```

**Row 3 — Completed This Week (green)**
```
bg: bg-green-50, border-l-4 border-green-400
Left: ✅ checkmark icon + "Completed This Week" (text-sm font-medium text-gray-800)
Right: "24" (text-xl font-bold text-green-600)
Sub-row: "Sales: 5  •  Value: A$6.2M" (text-xs text-gray-500)
```

**Row 4 — Requires Attention (red)**
```
bg: bg-red-50, border-l-4 border-red-400
Left: ⚠ warning icon + "Requires Attention" (text-sm font-medium text-gray-800)
Right: "3" (text-xl font-bold text-red-600)
Sub-row: "Disputes: 2  •  Escalations: 1" (text-xs text-gray-500)
```

Each status row structure:
```jsx
<div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-lg p-3 mb-3">
  <div className="flex justify-between items-start">
    <div className="flex items-center gap-2">
      {/* icon */}
      <span className="text-sm font-medium text-gray-800">Live Auctions</span>
    </div>
    <span className="text-xl font-bold text-indigo-600">12</span>
  </div>
  <p className="text-xs text-gray-500 mt-1 ml-6">Total Bids: 87 • Avg: 7.2 bids/auction</p>
</div>
```

---

## Section 4 — Two Column: Recent Cases + Recent Sales

Layout: `grid grid-cols-2 gap-4 mb-6`

---

### Left Card — Recent Cases

Card: `bg-white rounded-lg border border-gray-200 p-5`

**Header row:**
- Left: `text-base font-semibold text-gray-900` → "Recent Cases"
- Right: `<Link to="/case-management">` → "View All ↗" (`text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1`)

**NAVIGATION:** Clicking "View All ↗" uses `useNavigate()` or `<Link to="/case-management">` to route to Case Management page.

**5 case rows** — each separated by a bottom border (`border-b border-gray-100 last:border-0`):

Padding per row: `py-3`

Row structure:
```jsx
<div className="py-3 border-b border-gray-100 last:border-0">
  {/* Top line */}
  <div className="flex justify-between items-start">
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">MIP-2024-047</span>
      {/* Status badge */}
      <span className="text-xs font-medium bg-red-500 text-white px-1.5 py-0.5 rounded">LIVE</span>
    </div>
    <div className="text-right">
      <span className="text-xs text-gray-500">8 bids</span>
      <span className="text-xs text-gray-400 block">2h 34m</span>
    </div>
  </div>
  {/* Middle: property name */}
  <p className="text-sm font-semibold text-gray-900 mt-1">Bondi Beach Apartment</p>
  {/* Bottom: value */}
  <p className="text-xs text-gray-500">A$1,250,000</p>
</div>
```

**Case data (5 rows):**
```
1. MIP-2024-047 | [LIVE - red badge]   | "Bondi Beach Apartment"   | A$1,250,000 | 8 bids   | 2h 34m
2. MIP-2024-046 | [BUY NOW - green]    | "Melbourne CBD Office"    | A$2,150,000 | 0 bids   | Buy Now
3. MIP-2024-045 | [SOLD - gray]        | "Sydney Warehouse"        | A$890,000   | 12 bids  | Sold
4. MIP-2024-044 | [LIVE - red badge]   | "Brisbane Townhouse"      | A$675,000   | 5 bids   | 5h 12m
5. MIP-2024-043 | [no badge / pending] | "Perth Retail Space"      | A$1,420,000 | 0 bids   | Pending
```

**Status badge styles:**
- LIVE: `bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium`
- BUY NOW: `bg-green-500 text-white text-xs px-1.5 py-0.5 rounded font-medium`
- SOLD: `bg-gray-400 text-white text-xs px-1.5 py-0.5 rounded font-medium`
- No badge (pending): no badge rendered

**Right column of each row** (bids + time/status):
- Bids count: `text-xs text-gray-500 text-right`
- Time/status: `text-xs text-gray-400 text-right block mt-0.5`

---

### Right Card — Recent Sales

Card: `bg-white rounded-lg border border-gray-200 p-5`

**Header row:**
- Left: "Recent Sales"
- Right: `<Link to="/reports-analytics">` → "View Reports ↗" (`text-sm text-indigo-600 font-medium`)

**NAVIGATION:** Clicking "View Reports ↗" routes to `/reports-analytics`.

**5 sale rows** — same border-bottom pattern:

Row structure:
```jsx
<div className="py-3 border-b border-gray-100 last:border-0">
  <div className="flex justify-between items-start">
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">MIP-2024-042</span>
        <span className="text-xs font-medium bg-gray-400 text-white px-1.5 py-0.5 rounded">SOLD</span>
      </div>
      <p className="text-sm font-semibold text-gray-900 mt-1">Gold Coast Villa</p>
      <p className="text-xs text-gray-500">Platinum Capital</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-gray-900">A$1850K</p>
      <p className="text-xs text-green-600 font-medium">↑ +A$125K</p>
      <p className="text-xs text-gray-400">2h ago</p>
    </div>
  </div>
</div>
```

**Sales data (5 rows):**
```
1. MIP-2024-042 | SOLD | "Gold Coast Villa"      | Platinum Capital   | A$1850K | +A$125K (green) | 2h ago
2. MIP-2024-041 | SOLD | "Adelaide Duplex"       | Urban Investors    | A$720K  | +A$52K  (green) | 4h ago
3. MIP-2024-040 | SOLD | "Canberra Apartment"    | Capital Group      | A$1100K | +A$95K  (green) | 1d ago
4. MIP-2024-039 | SOLD | "Darwin Commercial"     | Northern Assets    | A$980K  | +A$60K  (green) | 1d ago
5. MIP-2024-038 | SOLD | "Hobart Warehouse"      | Southern Property  | A$1350K | +A$110K (green) | 2d ago
```

**Right column of each row:**
- Sale price: `text-sm font-bold text-gray-900 text-right`
- Growth amount: `text-xs text-green-600 font-medium text-right` with "↑ " prefix
- Time: `text-xs text-gray-400 text-right`

All rows have SOLD badge: `bg-gray-400 text-white text-xs px-1.5 py-0.5 rounded font-medium`

---

## Section 5 — Quick Actions (Full Width)

Card: `bg-white rounded-lg border border-gray-200 p-5`

**Header:** `text-base font-semibold text-gray-900 mb-4` → "Quick Actions"

**4 action buttons in a row:** `grid grid-cols-4 gap-4`

Each action button: `flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors`

**NAVIGATION:** Each button uses `useNavigate()` via `onClick` to route to its page.

### Action 1 — Review KYC
```
Route:     /kyc-review
Icon:      👥 (indigo colored, text-2xl)
Label:     "Review KYC"       (text-sm font-medium text-gray-900 mt-2)
Sub:       "8 pending"        (text-xs text-gray-500 mt-0.5)
Icon bg:   bg-indigo-100 rounded-full p-2 text-indigo-600
```

### Action 2 — Manage Cases
```
Route:     /case-management
Icon:      📊 bar chart (indigo)
Label:     "Manage Cases"
Sub:       "89 active"
Icon bg:   bg-indigo-100 rounded-full p-2 text-indigo-600
```

### Action 3 — View Reports
```
Route:     /reports-analytics
Icon:      ↗ or chart trend icon (indigo)
Label:     "View Reports"
Sub:       "Generate"
Icon bg:   bg-indigo-100 rounded-full p-2 text-indigo-600
```

### Action 4 — Admin Console
```
Route:     /admin-console
Icon:      🛡 shield or settings (indigo)
Label:     "Admin Console"
Sub:       "Full access"
Icon bg:   bg-indigo-100 rounded-full p-2 text-indigo-600
```

**Each quick action button structure:**
```jsx
<div
  onClick={() => navigate('/kyc-review')}
  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-indigo-200 cursor-pointer transition-colors"
>
  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
    {/* SVG or icon */}
  </div>
  <p className="text-sm font-medium text-gray-900 mt-2">Review KYC</p>
  <p className="text-xs text-gray-500 mt-0.5">8 pending</p>
</div>
```

---

## Complete Component Code Skeleton

```jsx
import { useNavigate, Link } from 'react-router-dom'

// Mock data — replace with API calls
const STAT_CARDS = [
  { label: 'Total Cases', value: '247', sub: '89 active • 34 listed', growth: '+12%', icon: 'cases', color: 'indigo' },
  { label: 'Total Sales', value: 'A$15.8M', sub: 'Avg. A$105.5K per deal', growth: '+23%', icon: 'sales', color: 'green' },
  { label: 'Platform Users', value: '1,284', sub: '8 pending KYC', growth: '+18%', icon: 'users', color: 'purple' },
  { label: 'Active Auctions', value: '12', sub: 'Success rate: 94.2%', growth: '94.2%', icon: 'auctions', color: 'amber' },
]

const PLATFORM_STATUS = [
  { label: 'Live Auctions', value: 12, sub: 'Total Bids: 87  •  Avg: 7.2 bids/auction', color: 'indigo', icon: 'live' },
  { label: 'Pending Approvals', value: 8, sub: 'KYC: 8  •  Cases: 3  •  Contracts: 2', color: 'amber', icon: 'pending' },
  { label: 'Completed This Week', value: 24, sub: 'Sales: 5  •  Value: A$6.2M', color: 'green', icon: 'completed' },
  { label: 'Requires Attention', value: 3, sub: 'Disputes: 2  •  Escalations: 1', color: 'red', icon: 'attention' },
]

const RECENT_CASES = [
  { id: 'MIP-2024-047', status: 'LIVE', name: 'Bondi Beach Apartment', value: 'A$1,250,000', bids: 8, timeOrStatus: '2h 34m' },
  { id: 'MIP-2024-046', status: 'BUY NOW', name: 'Melbourne CBD Office', value: 'A$2,150,000', bids: 0, timeOrStatus: 'Buy Now' },
  { id: 'MIP-2024-045', status: 'SOLD', name: 'Sydney Warehouse', value: 'A$890,000', bids: 12, timeOrStatus: 'Sold' },
  { id: 'MIP-2024-044', status: 'LIVE', name: 'Brisbane Townhouse', value: 'A$675,000', bids: 5, timeOrStatus: '5h 12m' },
  { id: 'MIP-2024-043', status: null, name: 'Perth Retail Space', value: 'A$1,420,000', bids: 0, timeOrStatus: 'Pending' },
]

const RECENT_SALES = [
  { id: 'MIP-2024-042', name: 'Gold Coast Villa', buyer: 'Platinum Capital', price: 'A$1850K', growth: '+A$125K', time: '2h ago' },
  { id: 'MIP-2024-041', name: 'Adelaide Duplex', buyer: 'Urban Investors', price: 'A$720K', growth: '+A$52K', time: '4h ago' },
  { id: 'MIP-2024-040', name: 'Canberra Apartment', buyer: 'Capital Group', price: 'A$1100K', growth: '+A$95K', time: '1d ago' },
  { id: 'MIP-2024-039', name: 'Darwin Commercial', buyer: 'Northern Assets', price: 'A$980K', growth: '+A$60K', time: '1d ago' },
  { id: 'MIP-2024-038', name: 'Hobart Warehouse', buyer: 'Southern Property', price: 'A$1350K', growth: '+A$110K', time: '2d ago' },
]

const BAR_CHART_CASES = [
  { month: 'Aug', height: 35 }, { month: 'Sep', height: 45 }, { month: 'Oct', height: 50 },
  { month: 'Nov', height: 60 }, { month: 'Dec', height: 40 }, { month: 'Jan', height: 55 }, { month: 'Feb', height: 70 },
]

const BAR_CHART_SALES = [
  { month: 'Aug', height: 40 }, { month: 'Sep', height: 55 }, { month: 'Oct', height: 45 },
  { month: 'Nov', height: 70 }, { month: 'Dec', height: 35 }, { month: 'Jan', height: 60 }, { month: 'Feb', height: 65 },
]

const QUICK_ACTIONS = [
  { label: 'Review KYC', sub: '8 pending', route: '/kyc-review', icon: 'kyc' },
  { label: 'Manage Cases', sub: '89 active', route: '/case-management', icon: 'cases' },
  { label: 'View Reports', sub: 'Generate', route: '/reports-analytics', icon: 'reports' },
  { label: 'Admin Console', sub: 'Full access', route: '/admin-console', icon: 'admin' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  // ... render all sections
}
```

---

## Status Badge Color Map

```jsx
const statusBadgeClass = {
  'LIVE':    'bg-red-500 text-white',
  'BUY NOW': 'bg-green-500 text-white',
  'SOLD':    'bg-gray-400 text-white',
}
// null / pending = no badge rendered
```

## Platform Status Color Map

```jsx
const statusColorMap = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-600' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-400',  text: 'text-amber-600' },
  green:  { bg: 'bg-green-50',  border: 'border-green-400',  text: 'text-green-600' },
  red:    { bg: 'bg-red-50',    border: 'border-red-400',    text: 'text-red-600' },
}
```

---

## Bar Chart Implementation (No Library)

Build the bar chart using pure Tailwind flex divs. Do NOT use recharts, chart.js, or any chart library.

```jsx
function SimpleBarChart({ data, barColor }) {
  return (
    <div className="mt-2">
      <div className="flex items-end gap-1 h-14 bg-gray-50 rounded px-2 pb-1 pt-2">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center justify-end gap-0.5">
            <div
              className={`w-full rounded-sm ${barColor}`}
              style={{ height: `${d.height}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 px-2 mt-1">
        {data.map((d) => (
          <div key={d.month} className="flex-1 text-center text-[10px] text-gray-400">
            {d.month}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- `barColor` for Cases: `'bg-indigo-400'`
- `barColor` for Sales: `'bg-green-400'`

---

## Icon Implementation (SVG Inline, No Icon Library)

Use these inline SVG snippets for icons. Size: `w-5 h-5` or `w-6 h-6`.

**Cases / Document icon (indigo):**
```jsx
<svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>
```

**Dollar/Sales icon (green):**
```jsx
<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
```

**Users icon (purple):**
```jsx
<svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
```

**Gavel/Auction icon (amber):**
```jsx
<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
</svg>
```

**Live pulse icon (for Platform Status row 1):**
```jsx
<span className="relative flex h-3 w-3">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
</span>
```

**Clock icon (for Pending Approvals):**
```jsx
<svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
```

**Checkmark circle (Completed):**
```jsx
<svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
```

**Warning triangle (Requires Attention):**
```jsx
<svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
</svg>
```

---

## Navigation Requirements (Summary)

| Element | onClick / Link | Route |
|---|---|---|
| Recent Cases → "View All ↗" | `<Link to="/case-management">` | `/case-management` |
| Recent Sales → "View Reports ↗" | `<Link to="/reports-analytics">` | `/reports-analytics` |
| Quick Action: Review KYC | `navigate('/kyc-review')` | `/kyc-review` |
| Quick Action: Manage Cases | `navigate('/case-management')` | `/case-management` |
| Quick Action: View Reports | `navigate('/reports-analytics')` | `/reports-analytics` |
| Quick Action: Admin Console | `navigate('/admin-console')` | `/admin-console` |

---

## API Readiness

Structure the component to be wired to API on replace. Use a `useEffect` + `useState` pattern:

```jsx
const [stats, setStats] = useState(STAT_CARDS)
const [recentCases, setRecentCases] = useState(RECENT_CASES)
const [recentSales, setRecentSales] = useState(RECENT_SALES)
const [platformStatus, setPlatformStatus] = useState(PLATFORM_STATUS)

// TODO: Replace with API call
// useEffect(() => {
//   getDashboardStats().then(res => setStats(res.data))
//   getRecentCases().then(res => setRecentCases(res.data))
//   getRecentSales().then(res => setRecentSales(res.data))
//   getPlatformStatus().then(res => setPlatformStatus(res.data))
// }, [])
```

---

## File Location

**Overwrite:** `src/pages/admin/Dashboard.jsx`

**Do NOT modify:**
- `src/components/admin/DashboardLayout.jsx`
- `src/components/admin/Sidebar.jsx`
- Any other page files
- Routing in `App.jsx`

---

## Strict Rules

1. Use Tailwind CSS only — no inline styles, no CSS files
2. No external chart libraries — bar charts are pure div-based
3. No external icon libraries — use inline SVG only
4. All navigation via React Router (`useNavigate`, `<Link>`)
5. Functional component with React hooks only
6. Mock data clearly separated from component logic at top of file
7. Match the design exactly — same layout, same data, same colors
8. The `SimpleBarChart` should be a sub-component defined in the same file
9. Do not add any feature not shown in the screenshot
10. Do not remove any element shown in the screenshot
