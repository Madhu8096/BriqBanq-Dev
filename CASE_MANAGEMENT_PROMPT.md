# Brickbanq — Case Management Module Implementation Prompt

## Project Context

You are building the **Case Management** module for the Brickbanq Virtual MIP Platform admin panel. This is a complex, multi-tab case details system with editing capabilities, document management, AI content generation, and activity tracking.

**Technology Stack:**
- Vite + React + Tailwind CSS + React Router v6
- Backend: FastAPI (Python) — API endpoints will be integrated later
- Current Phase: Frontend-only with mock data

**Existing Setup:**
- `DashboardLayout` and `Sidebar` components already exist
- Routing structure already configured
- Design system (colors, typography) already defined in previous prompts

---

## Design System Reference (Inherit from Project)

```
Backgrounds:        #F3F4F6 (gray-100), #FFFFFF (white cards)
Borders:            #E5E7EB (gray-200)
Primary/Indigo:     #4F46E5
Text primary:       #111827 (gray-900)
Text secondary:     #6B7280 (gray-500)
Text muted:         #9CA3AF (gray-400)
Success green:      #10B981
Warning amber:      #F59E0B
Danger red:         #EF4444
Badge purple:       #8B5CF6 (indigo-500)
Badge amber:        #F59E0B (amber-500)
```

---

## Module Structure Overview

```
Case Management Module Flow:
1. Case Management Page (/case-management) → Already exists, shows table
2. Click "View" icon → Navigate to Case Details page
3. Case Details page → Multi-tab interface with 8 tabs
4. Click "Manage Case" button → Open modal with 4 sub-tabs
```

---

## Section 1: Case Details Page (`/case-details/:caseId`)

Route: `/case-details/:caseId` (e.g., `/case-details/MIP-2026-001`)

### Page Header

**Back button:**
```jsx
<button onClick={() => navigate(-1)}>
  <ChevronLeft className="w-4 h-4" />
  Back to Case Management
</button>
```

**Case Header Card** (white card, full width):
```
┌─────────────────────────────────────────────────────────────────┐
│ MIP-2026-001  [In Auction] [Medium Risk]      [Export Report] [Manage Case] │
│ 45 Victoria Street, Potts Point, NSW 2011                      │
│                                                                 │
│ Borrower          Lender              Outstanding Debt   Property Valuation │
│ Sarah Mitchell    Commonwealth Bank   $980,000           $1,250,000         │
└─────────────────────────────────────────────────────────────────┘
```

**Structure:**
- Row 1: Case ID + badges (left) | buttons (right)
  - `MIP-2026-001` — text-2xl font-bold
  - Badge "In Auction" — indigo bg, white text, text-xs px-2 py-0.5 rounded
  - Badge "Medium Risk" — amber bg, white text, text-xs px-2 py-0.5 rounded
  - Button "Export Report" — outlined, border-gray-300
  - Button "Manage Case" — bg-indigo-600 text-white
- Row 2: Address — text-sm text-gray-600
- Row 3: 4-column info grid
  - Label: text-xs text-gray-500 uppercase
  - Value: text-sm font-medium text-gray-900

### Tab Navigation Bar

8 tabs in a horizontal row, below the header card:

```jsx
const tabs = [
  { label: 'Overview',               icon: Home,         path: 'overview' },
  { label: 'Property',               icon: Building2,    path: 'property' },
  { label: 'Documents',              icon: FileText,     path: 'documents' },
  { label: 'Investment Memorandum',  icon: FileCheck,    path: 'investment-memorandum' },
  { label: 'Settlement',             icon: Shield,       path: 'settlement' },
  { label: 'Bids',                   icon: DollarSign,   path: 'bids' },
  { label: 'Messages',               icon: MessageSquare,path: 'messages' },
  { label: 'Activity',               icon: Activity,     path: 'activity' },
]
```

**Tab styling:**
- Active tab: `border-b-2 border-indigo-600 text-indigo-600`
- Inactive tab: `text-gray-500 hover:text-gray-700`
- Icon + label, flex items-center gap-2, text-sm

**Routing:**
Use nested routes:
```jsx
<Route path="/case-details/:caseId" element={<CaseDetailsLayout />}>
  <Route path="overview" element={<Overview />} />
  <Route path="property" element={<Property />} />
  <Route path="documents" element={<Documents />} />
  <Route path="investment-memorandum" element={<InvestmentMemorandum />} />
  <Route path="settlement" element={<Settlement />} />
  <Route path="bids" element={<Bids />} />
  <Route path="messages" element={<Messages />} />
  <Route path="activity" element={<Activity />} />
</Route>
```

---

## Tab 1: Overview

**Layout:** Two-column grid (left: Case Summary | right: Financial Overview) + full-width Recent Activity Timeline below

### Left Card — Case Summary
```
Case Created
10 Jan 2026, 05:30

Last Updated
10 Feb 2026, 05:30

Total Bids
7 bids received

Current Highest Bid
$1,100,000  (green text)
```

### Right Card — Financial Overview
```
Property Valuation    $1,250,000
Outstanding Debt      $980,000 (red text)
Equity Available      $270,000 (green text)
Minimum Bid           $1,000,000
```

### Recent Activity Timeline (full width below)
**Title:** "Recent Activity Timeline"

Timeline items (vertical with purple dot indicators):
```jsx
<div className="space-y-4">
  {activities.map((activity) => (
    <div key={activity.id} className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-indigo-600" />
        <div className="w-px h-full bg-gray-200" />
      </div>
      <div className="flex-1 pb-4">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  ))}
</div>
```

**Mock activity data:**
```js
const MOCK_ACTIVITY = [
  { id: 1, title: 'New bid placed', description: 'Platinum Capital Partners bid $1,100,000', timestamp: '18 Feb 2026, 11:39 AEST' },
  { id: 2, title: 'Document uploaded', description: 'Property inspection report added', timestamp: '18 Feb 2026, 09:54 AEST' },
  { id: 3, title: 'Message received', description: 'Sarah Mitchell sent a message', timestamp: '18 Feb 2026, 07:54 AEST' },
]
```

---

## Tab 2: Property

**Layout:** Two sections side-by-side

### Left Section — Property Details

**Address:**
```
45 Victoria Street
Potts Point, NSW 2011
```

**Property Features** (2 columns):
```
Type: Apartment          Bedrooms: 2
Bathrooms: 2             Parking: 1
```

**Valuation:**
```
Valuation Amount:  $1,250,000
Valuation Date:    15 Jan 2026
Valuer:            Preston Rowe Paterson
```

### Right Section — Property Images

Display placeholder for property images (if no images yet):
```jsx
<div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
  <p className="text-sm text-gray-500">No property images uploaded</p>
  <p className="text-xs text-gray-400 mt-1">Use "Manage Case" to upload images</p>
</div>
```

If images exist, show a grid:
```jsx
<div className="grid grid-cols-2 gap-3">
  {images.map((img, i) => (
    <div key={i} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
    </div>
  ))}
</div>
```

---

## Tab 3: Documents

**Layout:** Full-width card

**Header row:**
- Left: "Case Documents" (text-lg font-semibold)
- Right: Upload button (will open file picker — mock for now)

**Upload Area** (drag and drop zone):
```jsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
  <p className="text-sm text-gray-700">Drag and drop files here, or <span className="text-indigo-600">browse</span></p>
  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
</div>
```

**Uploaded Documents Table:**
```
Document Name                     Type         Uploaded By            Date          Actions
Property Inspection Report.pdf    Inspection   Sarah Mitchell         18 Feb 2026   [View] [Download]
Valuation Report.pdf              Valuation    Preston Rowe Paterson  15 Jan 2026   [View] [Download]
```

Table structure:
- Columns: Document Name | Type | Uploaded By | Date | Actions
- Actions: `<Eye />` View button | `<Download />` Download button

---

## Tab 4: Investment Memorandum

**Layout:** Full-width view of the generated Investment Memorandum document

**Preview Card** (styled like a document preview):
```
┌────────────────────────────────────────────────┐
│  [INVESTMENT OPPORTUNITY]                      │
│                                                │
│  45 Victoria Street                            │
│  Potts Point, NSW 2011                         │
│                                                │
│  Property Value: $1250K                        │
│  Outstanding Debt: $980K                       │
│  Equity: $270K                                 │
│  LVR: 12.4%                                    │
│                                                │
│  Executive Summary                             │
│  [AI-generated content block]                  │
│                                                │
│  Investment Highlights                         │
│  - Strong Market                               │
│  - Prime Location                              │
│  - Equity Potential                            │
│  - Established Borrower                        │
│                                                │
│  Property Gallery                              │
│  [4 property images in 2x2 grid]               │
│                                                │
│  Loan Details                                  │
│  [Financial summary table]                     │
│                                                │
│  Property Details                              │
│  [Property info table]                         │
└────────────────────────────────────────────────┘
```

This is a **scrollable document view**. The actual content should be dynamically generated based on case data.

**Top-right buttons:**
- "Edit" button (opens AI Content tab in Manage Case modal)
- "Download" button (mock download)

---

## Tab 5: Settlement

**Layout:** Three sections

### Section 1 — Settlement Property Preview (top)
Small property card showing:
- Property image (left, 80x80px rounded)
- Address + settlement info (right)
- "Estimated Settlement: 65%" progress text
- "Mark Ready for Settlement" button (indigo, right side)

### Section 2 — Settlement Checklist (left column)
**Title:** "Settlement Checklist"

Table with 4 rows:
```
Item                      Responsible    Due Date       Status       Upload
Signed Loan Agreement     Borrower       11 Feb 2026    Open         [upload icon]
Discharge Authority       Lender         09 Mar 2026    Upcoming     [upload icon]
Title Transfer Documents  Lawyer         14 Feb 2026 (overdue, red) Open [upload icon]
Insurance Certificate     Borrower       24 Feb 2026    Approved     [upload icon]
```

Each row has:
- Item name (left)
- Responsible party
- Due date (with color coding: overdue = red, upcoming = default)
- Status dropdown (Open | Upcoming | Approved)
- Upload icon button (right)

### Section 3 — Outstanding Items (left column, below checklist)
Red alert box listing missing items:
```
⚠ Overdue (1)
  Title Transfer Documents  -  2 days overdue

📄 Due Soon (1)
  Signed Loan Agreement

✅ Pending Approval (1)
  Discharge Authority  -  2 weeks
```

### Section 4 — Settlement Thread (right column)
**Title:** "Settlement Thread"

Yellow info banner:
```
⚠ Awaiting confirmation for settlement on March 15th
```

Chat-style timeline:
```
👤 Sarah Mitchell  |  10:45 AM
   "Settlement confirmed for settlement on March 15th"

✅ [System]  |  Tue, Feb 18 - 12:00 PM
   Settlement confirmed for settlement on March 15th

📄 Lender  |  Tue, Feb 18 - 2:45 PM
   Discharge authority received and uploaded
```

**Message input at bottom:**
```jsx
<textarea placeholder="Type message..." />
<button className="bg-indigo-600 text-white px-4 py-2 rounded">
  <Send className="w-4 h-4" />
</button>
```

### Section 5 — Required Settlement Documents (bottom full-width)
**Title:** "Required Settlement Documents"

Card grid (4 cards, 2x2):
```
┌─────────────────────────┐  ┌─────────────────────────┐
│ 📄 Signed Loan Agreement│  │ 📄 Discharge Authority  │
│ Borrower Agreement      │  │ Lender Release          │
│ [Uploaded badge]        │  │ [Pending badge]         │
│ Verified 1              │  │                         │
│ [View] [Download]       │  │ [View] [Download]       │
└─────────────────────────┘  └─────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│ 📄 ID Verification      │  │ 📄 Insurance Certificate│
│ Government ID Approved  │  │ Valid                   │
│ [Approved badge: green] │  │ Verified 1 - 12 Jan 26  │
│ [View] [Download]       │  │ [View] [Download]       │
└─────────────────────────┘  └─────────────────────────┘
```

### Section 6 — Settlement Timeline (bottom)
Horizontal stepper with 5 steps:
```
✅ Documents   ✅ Approved   🔄 Processing   ⏳ Scheduled   ⏳ Complete
   Submitted      10 Feb 26     12 Feb 26       15 Mar 26      26 Mar 26
```

Each step is a circle icon with status color:
- Completed: green checkmark
- In progress: blue loading spinner
- Upcoming: gray clock

### Bottom Actions Bar
Full-width card with 4 action buttons:
```
[Approve All Documents]  [Link Settlement]  [✅ Release Funds]  [❌ Cancel Settlement Fund]
```
- "Release Funds" = green button
- "Cancel Settlement Fund" = red text button

---

## Tab 6: Bids

**Layout:** Full-width table

**Title:** "Bid History"

Table columns:
```
Bidder                     Bid Amount    Timestamp             Status
Platinum Capital Partners  $1,100,000    18 Feb 2026, 11:34    winning (blue badge)
Strategic Property Group   $1,050,000    18 Feb 2026, 11:04    outbid (gray badge)
Zenith Investments         $1,025,000    18 Feb 2026, 10:19    outbid (gray badge)
```

Each row:
- Bidder name (text-sm font-medium)
- Bid amount (text-sm font-bold)
- Timestamp (text-xs text-gray-500)
- Status badge (winning = blue bg, outbid = gray bg, white text)

---

## Tab 7: Messages

**Layout:** Chat interface

### Message Thread

Chat messages in a vertical list with alternating alignment:

**Borrower message (left-aligned):**
```jsx
<div className="flex gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
    SM
  </div>
  <div>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm font-medium">Sarah Mitchell</span>
      <span className="text-xs text-gray-500">Borrower</span>
    </div>
    <div className="bg-gray-100 rounded-lg rounded-tl-none px-4 py-2 max-w-lg">
      <p className="text-sm text-gray-900">I have uploaded the additional property documentation as requested.</p>
    </div>
    <span className="text-xs text-gray-400 mt-1 block">about 2 hours ago</span>
  </div>
</div>
```

**Admin/Investor message (right-aligned):**
```jsx
<div className="flex gap-3 justify-end">
  <div>
    <div className="flex items-center gap-2 mb-1 justify-end">
      <span className="text-xs text-gray-500">Investor</span>
      <span className="text-sm font-medium">David Williams</span>
    </div>
    <div className="bg-indigo-600 text-white rounded-lg rounded-tr-none px-4 py-2 max-w-lg">
      <p className="text-sm">Thank you. Could you also provide the strata report?</p>
    </div>
    <span className="text-xs text-gray-400 mt-1 block text-right">about 2 hours ago</span>
  </div>
  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium text-white">
    DW
  </div>
</div>
```

**System message (center-aligned, gray):**
```jsx
<div className="flex justify-center">
  <div className="bg-gray-100 rounded px-3 py-1 text-xs text-gray-600">
    Status changed to "In Auction" • 2 days ago
  </div>
</div>
```

### Message Input (bottom, sticky)

```jsx
<div className="border-t border-gray-200 p-4 bg-white">
  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Type your message..."
      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center justify-center">
      <Send className="w-4 h-4" />
    </button>
  </div>
</div>
```

---

## Tab 8: Activity

**Layout:** Vertical timeline (same style as Overview's Recent Activity but full list)

**Title:** "Activity Log"

Timeline items (5+ entries):
```
● New bid placed
  Platinum Capital Partners bid $1,100,000
  18 Feb 2026, 11:43 AEST

● Document uploaded
  Property inspection report added
  18 Feb 2026, 09:58 AEST

● Message received
  Sarah Mitchell sent a message
  18 Feb 2026, 07:58 AEST

● Case status updated
  Status changed to "In Auction"
  17 Feb 2026, 11:58 AEST

● Valuation completed
  Property valued at $1,250,000
  16 Feb 2026, 11:58 AEST
```

Each entry has:
- Purple dot indicator (left)
- Title (bold)
- Description (gray text)
- Timestamp (smaller gray text)
- Vertical line connecting dots

---

## Section 2: Manage Case Modal

**Trigger:** Click "Manage Case" button in Case Details header

**Modal Structure:**
- Full-screen overlay (backdrop with `bg-black/50`)
- Modal card: `max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-xl`
- Modal header with title + close button (X icon, top-right)

### Modal Header
```
Manage Case: MIP-2026-001
Update details, upload images, and generate AI content

[X close button, top-right]
```

### Modal Tabs (4 tabs)

```jsx
const manageTabs = [
  { label: 'Case Details',     icon: FileText,   id: 'case-details' },
  { label: 'Property Images',  icon: Image,      id: 'property-images' },
  { label: 'AI Content',       icon: Sparkles,   id: 'ai-content' },
  { label: 'Documents',        icon: Download,   id: 'documents' },
]
```

Tab bar below header, same style as main case tabs (blue active indicator).

---

### Modal Tab 1: Case Details

**Form layout:** Full-width form with sections

**Section 1: Basic Information**
```
Case Number        Borrower Name          Lender Name
[MIP-2026-001]     [Sarah Mitchell]       [Commonwealth Bank]
(disabled input)   (text input)           (text input)
```

**Section 2: Loan Details**
```
Outstanding Debt   Interest Rate (%)   Default Rate (%)   Days in Default
[980000]           [5.75]              [8.25]             [0]
```

**Section 3: Property Details**
```
Address
[45 Victoria Street]

Suburb                   Postcode
[Potts Point]            [2011]

Bedrooms                 Bathrooms
[2]                      [2]
```

**Section 4: Valuation**
```
Valuation Amount         Valuation Date       Valuer Name
[1250000]                [15/01/2026]         [Preston Rowe Paterson]
```

**Footer:**
```
[Cancel]  [Save Changes (indigo button)]
```

All inputs are `<input>` or `<select>` elements with proper styling:
```jsx
<input
  type="text"
  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
```

---

### Modal Tab 2: Property Images

**Layout:** Image upload area

**Header row:**
- Left: "Property Images" title
- Right: Two buttons
  - "AI Suggest Images" (outlined, with Sparkles icon)
  - "Upload Images" (indigo, with Upload icon)

**Image Grid Area:**

If no images uploaded yet:
```jsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center">
  <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
  <p className="text-gray-500 mb-1">No images uploaded yet</p>
  <p className="text-sm text-gray-400">Upload property images or use AI to suggest relevant images</p>
</div>
```

If images exist:
```jsx
<div className="grid grid-cols-3 gap-4">
  {images.map((img, i) => (
    <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group">
      <img src={img.url} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button className="bg-white text-gray-700 rounded px-2 py-1 text-xs">
          <Eye className="w-3 h-3" />
        </button>
        <button className="bg-red-500 text-white rounded px-2 py-1 text-xs">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  ))}
</div>
```

**Footer:**
```
[Cancel]  [Save Changes]
```

---

### Modal Tab 3: AI Content

**Layout:** AI content generator interface

**Header banner (light indigo bg):**
```
✨ AI Content Generator
Generate professional marketing content and investment highlights
```

**Three content sections with AI Generate buttons:**

**Section 1: Marketing Description**
```
Marketing Description                                       [✨ AI Generate]

[Large textarea with placeholder: "Professional marketing description..."]
```

**Section 2: Investment Highlights**
```
Investment Highlights                                       [✨ AI Generate]

[Large textarea with placeholder: "Key selling points..."]
```

**Section 3: Location & Market Notes**
```
Location & Market Notes                                     [✨ AI Generate]

[Large textarea with placeholder: "Suburb information..."]
```

Each textarea:
- `h-32` (128px height)
- `border border-gray-300 rounded-lg`
- `px-3 py-2`
- `resize-none`

Each "AI Generate" button:
- `flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50`
- Sparkles icon + "AI Generate" text

**Footer:**
```
[Cancel]  [Save Changes]
```

---

### Modal Tab 4: Documents

**Layout:** Document generator interface

**Header banner (light blue bg):**
```
📄 Document Generator
Generate professional documents using case data
```

**Two document cards in a row:**

**Card 1: Investment Memorandum**
```jsx
<div className="border border-gray-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
      <FileText className="w-5 h-5 text-indigo-600" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-gray-900">Investment Memorandum</h4>
      <p className="text-xs text-gray-500 mt-0.5">Full professional IM</p>
    </div>
  </div>
  <button className="w-full mt-3 bg-indigo-600 text-white text-sm py-2 rounded flex items-center justify-center gap-2">
    <Download className="w-4 h-4" />
    Generate IM
  </button>
</div>
```

**Card 2: Marketing Flyer**
```jsx
<div className="border border-gray-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
      <FileText className="w-5 h-5 text-blue-600" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-gray-900">Marketing Flyer</h4>
      <p className="text-xs text-gray-500 mt-0.5">Single-page summary</p>
    </div>
  </div>
  <button className="w-full mt-3 border border-gray-300 text-gray-700 text-sm py-2 rounded flex items-center justify-center gap-2">
    <Download className="w-4 h-4" />
    Generate Flyer
  </button>
</div>
```

**Footer:**
```
[Cancel]  [Save Changes]
```

---

## Mock Data Structure

```js
// src/data/mockCaseData.js

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
    { id: 1, sender: 'Sarah Mitchell', role: 'Borrower', message: 'I have uploaded the additional property documentation as requested.', timestamp: '2 hours ago', avatar: 'SM' },
    { id: 2, sender: 'David Williams', role: 'Investor', message: 'Thank you. Could you also provide the strata report?', timestamp: '2 hours ago', avatar: 'DW', isAdmin: true },
    { id: 3, sender: 'Sarah Mitchell', role: 'Borrower', message: 'Yes, I will upload it within the next hour.', timestamp: '1 hour ago', avatar: 'SM' },
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
}
```

---

## API Service Structure (`src/services/caseApi.js`)

```js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Cases
export const getCaseDetails = (caseId) => api.get(`/api/cases/${caseId}`)
export const updateCaseDetails = (caseId, data) => api.put(`/api/cases/${caseId}`, data)

// Documents
export const uploadDocument = (caseId, formData) => api.post(`/api/cases/${caseId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteDocument = (caseId, docId) => api.delete(`/api/cases/${caseId}/documents/${docId}`)

// Images
export const uploadImages = (caseId, formData) => api.post(`/api/cases/${caseId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteImage = (caseId, imageId) => api.delete(`/api/cases/${caseId}/images/${imageId}`)

// AI Content
export const generateAIContent = (caseId, contentType) => api.post(`/api/cases/${caseId}/ai-generate`, { contentType })

// Documents Generation
export const generateIM = (caseId) => api.post(`/api/cases/${caseId}/generate-im`, {}, { responseType: 'blob' })
export const generateFlyer = (caseId) => api.post(`/api/cases/${caseId}/generate-flyer`, {}, { responseType: 'blob' })

// Messages
export const getCaseMessages = (caseId) => api.get(`/api/cases/${caseId}/messages`)
export const sendMessage = (caseId, message) => api.post(`/api/cases/${caseId}/messages`, { message })

// Bids
export const getCaseBids = (caseId) => api.get(`/api/cases/${caseId}/bids`)

// Activity
export const getCaseActivity = (caseId) => api.get(`/api/cases/${caseId}/activity`)

// Settlement
export const updateSettlementItem = (caseId, itemId, data) => api.patch(`/api/cases/${caseId}/settlement/${itemId}`, data)
export const markReadyForSettlement = (caseId) => api.post(`/api/cases/${caseId}/settlement/ready`)

export default api
```

---

## Component File Structure

```
src/
├── pages/
│   └── admin/
│       ├── CaseManagement.jsx (existing, table view)
│       └── case-details/
│           ├── CaseDetailsLayout.jsx (main layout with header + tabs)
│           ├── Overview.jsx
│           ├── Property.jsx
│           ├── Documents.jsx
│           ├── InvestmentMemorandum.jsx
│           ├── Settlement.jsx
│           ├── Bids.jsx
│           ├── Messages.jsx
│           └── Activity.jsx
├── components/
│   └── admin/
│       └── case/
│           ├── ManageCaseModal.jsx (modal with 4 tabs)
│           ├── CaseDetailsTab.jsx
│           ├── PropertyImagesTab.jsx
│           ├── AIContentTab.jsx
│           └── DocumentsTab.jsx
├── data/
│   └── mockCaseData.js
└── services/
    └── caseApi.js
```

---

## Routing Setup

Add to existing router (`App.jsx` or `router.jsx`):

```jsx
import CaseDetailsLayout from './pages/admin/case-details/CaseDetailsLayout'
import Overview from './pages/admin/case-details/Overview'
import Property from './pages/admin/case-details/Property'
import Documents from './pages/admin/case-details/Documents'
import InvestmentMemorandum from './pages/admin/case-details/InvestmentMemorandum'
import Settlement from './pages/admin/case-details/Settlement'
import Bids from './pages/admin/case-details/Bids'
import Messages from './pages/admin/case-details/Messages'
import Activity from './pages/admin/case-details/Activity'

// Inside Routes:
<Route path="/case-details/:caseId" element={<CaseDetailsLayout />}>
  <Route index element={<Navigate to="overview" replace />} />
  <Route path="overview" element={<Overview />} />
  <Route path="property" element={<Property />} />
  <Route path="documents" element={<Documents />} />
  <Route path="investment-memorandum" element={<InvestmentMemorandum />} />
  <Route path="settlement" element={<Settlement />} />
  <Route path="bids" element={<Bids />} />
  <Route path="messages" element={<Messages />} />
  <Route path="activity" element={<Activity />} />
</Route>
```

---

## Icon Reference (Lucide React)

```jsx
import {
  ChevronLeft, Home, Building2, FileText, FileCheck, Shield,
  DollarSign, MessageSquare, Activity, Image, Upload, Download,
  Eye, Trash2, Send, Sparkles, X, Clock, CheckCircle, AlertTriangle,
} from 'lucide-react'
```

All icons: `w-4 h-4` or `w-5 h-5` depending on context.

---

## State Management

Use React Context for case data:

```jsx
// src/context/CaseContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MOCK_CASE_DETAILS } from '../data/mockCaseData'

const CaseContext = createContext()

export function CaseProvider({ children }) {
  const { caseId } = useParams()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with API call
    // getCaseDetails(caseId).then(res => setCaseData(res.data))
    
    // Mock data for now
    setCaseData(MOCK_CASE_DETAILS)
    setLoading(false)
  }, [caseId])

  const updateCase = (updates) => {
    setCaseData(prev => ({ ...prev, ...updates }))
    // TODO: Call API to persist changes
  }

  return (
    <CaseContext.Provider value={{ caseData, loading, updateCase }}>
      {children}
    </CaseContext.Provider>
  )
}

export const useCaseContext = () => useContext(CaseContext)
```

Wrap `CaseDetailsLayout` with `<CaseProvider>`:

```jsx
<Route path="/case-details/:caseId" element={
  <CaseProvider>
    <CaseDetailsLayout />
  </CaseProvider>
} />
```

---

## Critical Implementation Rules

1. **Pixel-perfect match** — Layout, spacing, fonts, colors must match screenshots exactly
2. **All tabs functional** — Every tab must render with mock data and work correctly
3. **Modal tabs functional** — All 4 Manage Case tabs must work properly
4. **Responsive layout** — Desktop-first, but use Tailwind responsive classes where needed
5. **No external UI libraries** — Tailwind CSS only, no MUI/Ant Design/Chakra
6. **Mock data only** — All API calls are commented out, use mock data from `mockCaseData.js`
7. **API-ready structure** — Service layer abstracted, ready to uncomment and wire to FastAPI
8. **Proper routing** — All navigation must use React Router (`useNavigate`, `<Link>`, `<NavLink>`)
9. **Icon consistency** — Use Lucide React icons exclusively, sizes `w-4 h-4` or `w-5 h-5`
10. **Clean code** — Modular components, proper naming, no inline styles except where necessary (e.g., dynamic heights)

---

## Deliverables

1. Complete `CaseDetailsLayout` component with all 8 tab pages
2. Complete `ManageCaseModal` component with all 4 sub-tabs
3. Mock data file with complete case structure
4. API service file with all endpoints defined (commented out)
5. Context provider for case state management
6. All components using Tailwind CSS only
7. All routing properly configured
8. All interactive elements functional (buttons, tabs, form inputs)
9. All navigation working (back button, tab switching, modal open/close)
10. Production-ready code structure, ready for FastAPI integration

---

## Notes

- The Investment Memorandum tab shows a **preview** of the generated document. The full document generation happens in the Manage Case > Documents tab.
- The Settlement tab is complex with multiple sub-sections. Pay close attention to the layout in screenshots.
- Messages tab uses a chat-style interface with alternating message alignment (left for borrower, right for admin/investor).
- All "AI Generate" buttons should show a loading state when clicked (mock delay of 2 seconds, then populate textarea with placeholder text).
- All file uploads should open browser file picker but not actually upload (just simulate by updating local state with file name).
- Export/Download buttons should trigger a mock download (e.g., `console.log('Downloading...')` and show a brief success toast).
