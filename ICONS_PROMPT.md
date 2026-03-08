# Brickbanq — Exact Icon Implementation Prompt

## Overview

Replace all icons across the entire admin panel with the exact icons shown in the design screenshots. Use **Lucide React** (`lucide-react`) which is already available in the project. Every icon name below maps directly to a Lucide icon that matches the screenshot visually.

Install if not already present:
```bash
npm install lucide-react
```

Import pattern:
```jsx
import { IconName } from 'lucide-react'
```

---

## Sidebar Icons (Exact Matches)

Reference: All sidebar screenshots show these nav items with these exact icons:

```jsx
import {
  LayoutDashboard,   // Dashboard
  Briefcase,         // Case Management
  Tag,               // All Deals
  Zap,               // Auction Control
  Users,             // KYC Review Queue
  FileText,          // Contracts
  CircleDot,         // Escrow Management
  FolderOpen,        // Document Library
  BarChart2,         // Reports & Analytics
  Shield,            // Admin Console
  Bell,              // Notifications
  Settings,          // Settings
  LogOut,            // Sign Out
} from 'lucide-react'
```

### Sidebar Nav Item Map

| Nav Label | Lucide Icon | Size |
|---|---|---|
| Dashboard | `<LayoutDashboard />` | `w-4 h-4` |
| Case Management | `<Briefcase />` | `w-4 h-4` |
| All Deals | `<Tag />` | `w-4 h-4` |
| Auction Control | `<Zap />` | `w-4 h-4` |
| KYC Review Queue | `<Users />` | `w-4 h-4` |
| Contracts | `<FileText />` | `w-4 h-4` |
| Escrow Management | `<CircleDot />` | `w-4 h-4` |
| Document Library | `<FolderOpen />` | `w-4 h-4` |
| Reports & Analytics | `<BarChart2 />` | `w-4 h-4` |
| Admin Console | `<Shield />` | `w-4 h-4` |
| Notifications | `<Bell />` | `w-4 h-4` |
| Settings | `<Settings />` | `w-4 h-4` |
| Sign Out | `<LogOut />` | `w-4 h-4` |

### Updated `Sidebar.jsx`

```jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Tag, Zap, Users, FileText,
  CircleDot, FolderOpen, BarChart2, Shield, Bell, Settings, LogOut
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',          path: '/dashboard',        icon: LayoutDashboard },
  { label: 'Case Management',    path: '/case-management',  icon: Briefcase },
  { label: 'All Deals',          path: '/all-deals',        icon: Tag },
  { label: 'Auction Control',    path: '/auction-control',  icon: Zap },
  { label: 'KYC Review Queue',   path: '/kyc-review',       icon: Users },
  { label: 'Contracts',          path: '/contracts',        icon: FileText },
  { label: 'Escrow Management',  path: '/escrow-management',icon: CircleDot },
  { label: 'Document Library',   path: '/document-library', icon: FolderOpen },
  { label: 'Reports & Analytics',path: '/reports-analytics',icon: BarChart2 },
  { label: 'Admin Console',      path: '/admin-console',    icon: Shield },
  { label: 'Notifications',      path: '/notifications',    icon: Bell },
  { label: 'Settings',           path: '/settings',         icon: Settings },
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
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 mx-2 my-0.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="leading-tight">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-gray-800 p-3">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white text-xs w-full px-3 py-2 rounded hover:bg-gray-800 transition-colors">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
```

---

## Top Navbar Icons (`DashboardLayout.jsx`)

```jsx
import { Settings, Bell, ChevronDown } from 'lucide-react'
```

| Element | Icon | Notes |
|---|---|---|
| Role dropdown left icon | `<Settings className="w-4 h-4 text-indigo-500" />` | Shown before "Admin" label |
| Role/Org dropdown arrow | `<ChevronDown className="w-3 h-3 text-gray-400" />` | After label text |
| Notification bell | `<Bell className="w-5 h-5 text-gray-500" />` | With red dot overlay |
| User avatar | Initials div "DW" | Not an icon — keep as indigo circle with text |

```jsx
{/* Role dropdown */}
<div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 cursor-pointer">
  <Settings className="w-4 h-4 text-indigo-500" />
  <span>Admin</span>
  <ChevronDown className="w-3 h-3 text-gray-400" />
</div>

{/* Org dropdown */}
<div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 cursor-pointer">
  <span>Brickbanq</span>
  <ChevronDown className="w-3 h-3 text-gray-400" />
</div>

{/* Bell with red dot */}
<div className="relative cursor-pointer">
  <Bell className="w-5 h-5 text-gray-500" />
  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
</div>
```

---

## Page-by-Page Icon Reference

### Dashboard Page (`Dashboard.jsx`)

Reference: **Dashboard UI prompt screenshot** (the new data-rich dashboard).

```jsx
import {
  FileText,        // Total Cases stat card
  DollarSign,      // Total Sales stat card
  Users,           // Platform Users stat card
  Gavel,           // Active Auctions stat card
  TrendingUp,      // Growth arrows on stat cards
  Radio,           // Live Auctions status row (pulse dot alternative)
  Clock,           // Pending Approvals status row
  CheckCircle,     // Completed This Week status row
  AlertTriangle,   // Requires Attention status row
  Users as UsersIcon,    // Review KYC quick action
  BarChart2,       // Manage Cases quick action (bar chart)
  TrendingUp as TrendingUpIcon, // View Reports quick action
  Shield,          // Admin Console quick action
  ArrowUpRight,    // "View All" and "View Reports" link arrows
} from 'lucide-react'
```

#### Stat Card Icons (top-left of each card)

```jsx
// Card 1 — Total Cases
<div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
  <FileText className="w-5 h-5 text-indigo-600" />
</div>

// Card 2 — Total Sales
<div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
  <DollarSign className="w-5 h-5 text-green-600" />
</div>

// Card 3 — Platform Users
<div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
  <Users className="w-5 h-5 text-purple-600" />
</div>

// Card 4 — Active Auctions
<div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
  <Gavel className="w-5 h-5 text-amber-600" />
</div>
```

#### Growth Badge Icon (top-right of stat cards)

```jsx
// "+12%" badge
<span className="flex items-center gap-0.5 text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
  <TrendingUp className="w-3 h-3" />
  +12%
</span>
```

#### Platform Status Row Icons

```jsx
// Row 1 — Live Auctions: animated red pulse dot
<span className="relative flex h-3 w-3">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
</span>

// Row 2 — Pending Approvals
<Clock className="w-4 h-4 text-amber-500" />

// Row 3 — Completed This Week
<CheckCircle className="w-4 h-4 text-green-500" />

// Row 4 — Requires Attention
<AlertTriangle className="w-4 h-4 text-red-500" />
```

#### "View All" / "View Reports" Link Icons

```jsx
<ArrowUpRight className="w-4 h-4" />
```

#### Quick Action Icons (inside indigo circle)

```jsx
// Review KYC
<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
  <Users className="w-5 h-5 text-indigo-600" />
</div>

// Manage Cases
<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
  <BarChart2 className="w-5 h-5 text-indigo-600" />
</div>

// View Reports
<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
  <TrendingUp className="w-5 h-5 text-indigo-600" />
</div>

// Admin Console
<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
  <Shield className="w-5 h-5 text-indigo-600" />
</div>
```

---

### Case Management Page (`CaseManagement.jsx`)

```jsx
import { Eye, Trash2, RefreshCw, Download } from 'lucide-react'
```

| Element | Icon |
|---|---|
| View action button | `<Eye className="w-4 h-4 text-gray-500" />` |
| Delete action button | `<Trash2 className="w-4 h-4 text-red-500" />` |
| Refresh button | `<RefreshCw className="w-4 h-4" />` |
| Export button | `<Download className="w-4 h-4" />` |

Stat card icons:
```jsx
import { FileText, Eye as EyeIcon, RefreshCw, CheckSquare } from 'lucide-react'

// Total Cases
<FileText className="w-5 h-5 text-indigo-600" />  // bg-indigo-100

// Active Cases
<EyeIcon className="w-5 h-5 text-green-600" />     // bg-green-100

// In Auction
<RefreshCw className="w-5 h-5 text-orange-600" />  // bg-orange-100

// Completed
<CheckSquare className="w-5 h-5 text-purple-600" /> // bg-purple-100
```

---

### All Deals Page (`AllDeals.jsx`)

```jsx
import { Search, SlidersHorizontal, Map, List, ShoppingCart, Eye } from 'lucide-react'
```

| Element | Icon |
|---|---|
| Search bar left | `<Search className="w-4 h-4 text-gray-400" />` |
| Advanced Filters | `<SlidersHorizontal className="w-4 h-4" />` |
| Map View button | `<Map className="w-4 h-4" />` |
| List View button | `<List className="w-4 h-4" />` |
| "Place Bid" button | no icon (text only) |
| "Buy Now" button | `<ShoppingCart className="w-4 h-4" />` |
| Eye/watch icon on card | `<Eye className="w-4 h-4 text-gray-500" />` |

Property card bedroom/bath/car icons (use text labels or these):
```jsx
import { BedDouble, Bath, Car } from 'lucide-react'

<BedDouble className="w-3.5 h-3.5" />  // bedrooms
<Bath className="w-3.5 h-3.5" />       // bathrooms  
<Car className="w-3.5 h-3.5" />        // car spaces
```

---

### Auction Control Page (`AuctionControl.jsx`)

```jsx
import { Activity, Calendar, DollarSign, Users, Search, SlidersHorizontal } from 'lucide-react'
```

Stat card icons:
```jsx
// Live Now — red pulse (not a lucide icon, use the animated dot)
<span className="relative flex h-5 w-5">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500" />
</span>

// Upcoming
<Calendar className="w-5 h-5 text-blue-600" />   // bg-blue-100

// Total Value
<DollarSign className="w-5 h-5 text-green-600" /> // bg-green-100

// Active Bidders
<Users className="w-5 h-5 text-purple-600" />     // bg-purple-100
```

Search and filters:
```jsx
<Search className="w-4 h-4 text-gray-400" />
<SlidersHorizontal className="w-4 h-4" />
```

Countdown timer icon on property card:
```jsx
import { Timer } from 'lucide-react'
<Timer className="w-4 h-4 text-white" />
// Used in: "Ends in  2h 45m" red bar
```

Calendar icon in upcoming card:
```jsx
<Calendar className="w-4 h-4 text-indigo-500" />
// Used in: "Auction  18 Feb 2026" row
```

---

### KYC Review Queue Page (`KYCReviewQueue.jsx`)

```jsx
import { Eye, CheckCircle, XCircle } from 'lucide-react'
```

Stat card icons:
```jsx
// Pending Reviews — amber eye
<Eye className="w-5 h-5 text-amber-600" />       // bg-amber-100

// Approved Today — green check circle
<CheckCircle className="w-5 h-5 text-green-600" /> // bg-green-100

// Rejected Today — red x circle
<XCircle className="w-5 h-5 text-red-600" />      // bg-red-100
```

Table action buttons:
```jsx
// Review
<Eye className="w-4 h-4" />

// Approve (green)
<CheckCircle className="w-4 h-4 text-green-600" />

// Reject (red)
<XCircle className="w-4 h-4 text-red-500" />
```

Button labels with icons:
```jsx
<button className="flex items-center gap-1 ...">
  <Eye className="w-3.5 h-3.5" /> Review
</button>

<button className="flex items-center gap-1 text-green-600 ...">
  <CheckCircle className="w-3.5 h-3.5" /> Approve
</button>

<button className="flex items-center gap-1 text-red-500 ...">
  <XCircle className="w-3.5 h-3.5" /> Reject
</button>
```

---

### Contracts Page (`Contracts.jsx`)

```jsx
import { Plus, Eye, Download } from 'lucide-react'
```

| Element | Icon |
|---|---|
| "+ Create New Contract" button | `<Plus className="w-4 h-4" />` |
| View button | `<Eye className="w-4 h-4 text-gray-500" />` |
| Download button | `<Download className="w-4 h-4 text-gray-500" />` |

---

### Escrow Management Page (`EscrowManagement.jsx`)

```jsx
import {
  ClipboardList,   // Total Held stat card
  TrendingUp,      // Total Released stat card
  DollarSign,      // Remaining Balance stat card
  AlertTriangle,   // Pending releases warning banner
  CheckCircle,     // Released status + Security items
  Shield,          // Secure Escrow
  Lock,            // Two-Factor Authentication
  FileCheck,       // Audit Trail
  Umbrella,        // Insured
  ChevronRight,    // Breadcrumb separator
  Home,            // Breadcrumb home icon
} from 'lucide-react'
```

Stat card icons:
```jsx
// Total Held
<ClipboardList className="w-5 h-5 text-blue-600" />  // bg-blue-100

// Total Released
<TrendingUp className="w-5 h-5 text-green-600" />    // bg-green-100

// Remaining Balance
<DollarSign className="w-5 h-5 text-purple-600" />   // bg-purple-100
```

Warning banner icon:
```jsx
<AlertTriangle className="w-4 h-4 text-amber-600" />
```

Table "Released" status icon:
```jsx
<CheckCircle className="w-4 h-4 text-green-500" />
// Shown inline: ✓ Released
```

Security & Compliance section icons:
```jsx
<Shield className="w-4 h-4 text-indigo-500" />      // Secure Escrow
<Lock className="w-4 h-4 text-indigo-500" />         // Two-Factor Authentication
<FileCheck className="w-4 h-4 text-indigo-500" />    // Audit Trail
<Umbrella className="w-4 h-4 text-indigo-500" />     // Insured
```

Breadcrumb:
```jsx
<Home className="w-3.5 h-3.5 text-gray-400" />
<ChevronRight className="w-3.5 h-3.5 text-gray-400" />
```

---

### Document Library Page (`DocumentLibrary.jsx`)

```jsx
import {
  FileText,        // Total Documents stat + PDF file rows
  FolderOpen,      // Storage Used stat + document management section
  Star,            // Starred stat + star toggle button (unfilled)
  Upload,          // This Week stat + Upload button
  Search,          // Search input
  Download,        // Export + per-row download
  Share2,          // Per-row share button
  Trash2,          // Per-row delete button
  Eye,             // Per-row view button
  File,            // ZIP file type icon
  ChevronDown,     // Dropdown arrows
} from 'lucide-react'
```

Stat card icons:
```jsx
// Total Documents
<FileText className="w-5 h-5 text-blue-600" />    // bg-blue-100

// Storage Used
<FolderOpen className="w-5 h-5 text-green-600" /> // bg-green-100

// Starred
<Star className="w-5 h-5 text-amber-500" />       // bg-amber-100

// This Week
<Upload className="w-5 h-5 text-indigo-600" />    // bg-indigo-100
```

Filter bar icons:
```jsx
<Search className="w-4 h-4 text-gray-400" />      // search input left
<Star className="w-4 h-4" />                       // Starred filter button
<Download className="w-4 h-4" />                   // Export button
<Upload className="w-4 h-4" />                     // Upload button
<ChevronDown className="w-4 h-4 text-gray-400" /> // dropdown arrows
```

Per-document row action icons:
```jsx
// Star toggle — filled if starred, outline if not
<Star className={`w-4 h-4 ${doc.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />

// View
<Eye className="w-4 h-4 text-gray-500 hover:text-gray-700" />

// Download
<Download className="w-4 h-4 text-gray-500 hover:text-gray-700" />

// Share
<Share2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />

// Delete
<Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
```

File type icons (left of each document row):
```jsx
// PDF files — red icon
<div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
  <FileText className="w-4 h-4 text-red-600" />
</div>

// ZIP file — gray icon
<div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
  <File className="w-4 h-4 text-gray-500" />
</div>
```

Document Management info box icon:
```jsx
<FolderOpen className="w-5 h-5 text-indigo-600" />
```

---

### Reports & Analytics Page (`ReportsAnalytics.jsx`)

```jsx
import {
  FileText,        // Total Cases stat
  Activity,        // Active Cases stat
  DollarSign,      // Total Revenue stat
  Target,          // Avg Case Value stat
  Gavel,           // Total Bids stat
  TrendingUp,      // Success Rate stat
  Download,        // Export PDF and Export Excel buttons
  RefreshCw,       // Refresh button
  ChevronDown,     // Period dropdown
  BarChart2,       // Case Volume Trend placeholder + Case Performance card icon
  PieChart,        // Revenue Distribution placeholder
  DollarSign as DollarIcon, // Financial Summary card icon
  Users,           // User Activity card icon
  ArrowUpRight,    // View Details links
} from 'lucide-react'
```

Stat card icons:
```jsx
// Total Cases
<FileText className="w-4 h-4 text-indigo-600" />

// Active Cases
<Activity className="w-4 h-4 text-blue-600" />

// Total Revenue
<DollarSign className="w-4 h-4 text-green-600" />

// Avg Case Value
<Target className="w-4 h-4 text-purple-600" />

// Total Bids
<Gavel className="w-4 h-4 text-amber-600" />

// Success Rate
<TrendingUp className="w-4 h-4 text-emerald-600" />
```

Report export card icons:
```jsx
// Financial Summary — green
<div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
  <DollarSign className="w-5 h-5 text-green-600" />
</div>

// Case Performance — blue
<div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
  <FileText className="w-5 h-5 text-blue-600" />
</div>

// User Activity — purple
<div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
  <Users className="w-5 h-5 text-purple-600" />
</div>

// Auction Analytics — red
<div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
  <TrendingUp className="w-5 h-5 text-red-600" />
</div>
```

Button icons:
```jsx
<Download className="w-4 h-4" />   // Export PDF, Export Excel
<RefreshCw className="w-4 h-4" />  // Refresh button
<ChevronDown className="w-4 h-4" />// Period dropdown
<ArrowUpRight className="w-4 h-4" />// View Details links
```

Chart placeholder icons:
```jsx
<BarChart2 className="w-10 h-10 text-gray-300" />  // Case Volume Trend
<PieChart className="w-10 h-10 text-gray-300" />   // Revenue Distribution
```

---

### Admin Console Page (`AdminConsole.jsx`)

```jsx
import {
  Users,           // Pending KYC stat
  AlertTriangle,   // Active Disputes stat
  Activity,        // Platform Users stat
  DollarSign,      // Monthly Volume stat
  GripVertical,    // Drag handle on each task card
  AlertCircle,     // Urgent column header icon
  Clock,           // In Progress column header icon
  CheckCircle,     // Completed column header icon
} from 'lucide-react'
```

Stat card icons (same as Dashboard top row):
```jsx
<Users className="w-5 h-5 text-indigo-600" />        // Pending KYC — bg-indigo-100
<AlertTriangle className="w-5 h-5 text-orange-600" /> // Active Disputes — bg-orange-100
<Activity className="w-5 h-5 text-blue-600" />        // Platform Users — bg-blue-100
<DollarSign className="w-5 h-5 text-green-600" />     // Monthly Volume — bg-green-100
```

Kanban column header icons:
```jsx
// Urgent column — red
<AlertCircle className="w-4 h-4 text-red-500" />

// In Progress column — amber
<Clock className="w-4 h-4 text-amber-500" />

// Completed column — green
<CheckCircle className="w-4 h-4 text-green-500" />
```

Task card drag handle:
```jsx
<GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
```

---

### Notifications Page (`Notifications.jsx`)

```jsx
import {
  Bell,            // Unread stat + notification type icon
  Mail,            // Total Notifications stat + email notification rows
  MessageSquare,   // This Week stat + message notification rows
  Search,          // Search input
  ChevronDown,     // Dropdown arrows
  X,               // Clear Filters
  CheckCheck,      // Mark All Read
  Trash2,          // Delete / Delete All
  Eye,             // View action
  Check,           // Mark as read action
  Gavel,           // Bid notification rows
  FileCheck,       // Contract notification rows
  UserCheck,       // KYC notification rows
  AlertCircle,     // Auction ending notification rows
} from 'lucide-react'
```

Stat card icons:
```jsx
// Unread — red bell
<Bell className="w-5 h-5 text-red-600" />         // bg-red-100

// Total Notifications — blue mail
<Mail className="w-5 h-5 text-blue-600" />         // bg-blue-100

// This Week — green message
<MessageSquare className="w-5 h-5 text-green-600" />// bg-green-100
```

Notification type icons (left of each notification row):
```jsx
// New Bid Placed
<div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
  <Gavel className="w-4 h-4 text-indigo-600" />
</div>

// New Message
<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
  <MessageSquare className="w-4 h-4 text-blue-600" />
</div>

// Auction Ending Soon
<div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
  <AlertCircle className="w-4 h-4 text-amber-600" />
</div>

// Bid Outbid
<div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
  <Bell className="w-4 h-4 text-indigo-600" />
</div>

// KYC Approved
<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
  <UserCheck className="w-4 h-4 text-green-600" />
</div>

// Contract Ready for Signature
<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
  <FileCheck className="w-4 h-4 text-blue-600" />
</div>

// Payment Received
<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
  <Mail className="w-4 h-4 text-green-600" />
</div>
```

Filter bar / action icons:
```jsx
<Search className="w-4 h-4 text-gray-400" />     // Search input
<ChevronDown className="w-4 h-4 text-gray-400" />// Dropdowns
<Trash2 className="w-4 h-4" />                   // Delete All
```

Per-notification action icons:
```jsx
<Eye className="w-3.5 h-3.5" />    // View
<Check className="w-3.5 h-3.5" />  // Mark as read
<Trash2 className="w-3.5 h-3.5" /> // Delete (red)
```

---

### Settings Page (`Settings.jsx`)

```jsx
import { User, Building2, Lock, Bell } from 'lucide-react'
```

Setting card icons:
```jsx
// Profile Settings
<div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
  <User className="w-5 h-5 text-indigo-600" />
</div>

// Organization
<div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
  <Building2 className="w-5 h-5 text-indigo-600" />
</div>

// Security
<div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
  <Lock className="w-5 h-5 text-indigo-600" />
</div>

// Notifications
<div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
  <Bell className="w-5 h-5 text-indigo-600" />
</div>
```

---

## Breadcrumb Component (Used on Escrow, Document Library, Reports pages)

```jsx
import { Home, ChevronRight } from 'lucide-react'

function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      <Home className="w-3.5 h-3.5 text-gray-400" />
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className={i === items.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
            {item.label}
          </span>
        </span>
      ))}
    </div>
  )
}
```

---

## Master Import Block (Copy into each file as needed)

```jsx
import {
  // Layout & Navigation
  LayoutDashboard, LogOut, ChevronDown, ChevronRight, Home, ArrowUpRight,

  // Content & Data
  Briefcase, Tag, FileText, File, FileCheck, FolderOpen, ClipboardList,

  // People
  Users, User, UserCheck, Building2,

  // Actions
  Eye, Download, Upload, Share2, Plus, Search, SlidersHorizontal,
  RefreshCw, Trash2, Check, CheckCheck, X,

  // Status & Alerts
  Bell, AlertCircle, AlertTriangle, CheckCircle, XCircle, Clock, Activity,

  // Finance
  DollarSign, TrendingUp, Target, Gavel,

  // Charts
  BarChart2, PieChart,

  // Security
  Shield, Lock, Umbrella,

  // Other
  Zap, CircleDot, Map, List, Star, GripVertical, Settings,
  MessageSquare, Mail, Timer, Calendar, BedDouble, Bath, Car,
  Radio, Radio as LiveIcon,
} from 'lucide-react'
```

---

## Rules

1. Use **only** `lucide-react` — no other icon library
2. Icon size is `w-4 h-4` for inline/action icons, `w-5 h-5` for stat card icons, `w-10 h-10` is never used for icons (only for container divs)
3. Icons inside colored circles/squares always have matching text color: `text-indigo-600` inside `bg-indigo-100`, etc.
4. The animated live pulse dot is NOT a Lucide icon — it is always the `animate-ping` div pattern
5. Do not use emoji anywhere — replace all existing emoji icons with the Lucide equivalents above
6. `strokeWidth` is default (1.5) unless specified — do not change it
7. All icons must have `flex-shrink-0` when inside flex containers to prevent squishing
