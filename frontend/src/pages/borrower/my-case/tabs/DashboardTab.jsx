import StatCard from '../../components/StatCard'
import ProgressBar from '../../components/ProgressBar'
import { MOCK_BORROWER_CASE } from '../../data/borrowerMockData'

const formatNum = (n) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

const formatShort = (n) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}k`
  return formatNum(n)
}

// Icons as SVG components
const IconCaseStatus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const IconProperty = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
)
const IconBids = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
)
const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
)
const IconChart = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
)
const IconDollar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const IconDocument = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
)
const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const IconPeople = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
)
const IconWarning = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
)

export default function DashboardTab({ caseData, onBorrowerStatusClick }) {
  const c = caseData || MOCK_BORROWER_CASE
  const debt = c.lender?.outstandingDebt ?? 980000
  const equity = c.equityAvailable ?? 270000
  const lvr = c.loanToValueRatio ?? c.lvr ?? 78.4
  const debtPct = Math.round(lvr)
  const equityPct = Math.round(100 - lvr)

  return (
    <div className="space-y-6">
      {/* Top row: 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Case Status"
          value={c.status ?? 'In Auction'}
          sub={`Updated ${c.statusUpdatedAgo ?? '20d ago'}`}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          icon={<IconCaseStatus />}
        />
        <StatCard
          label="Property Value"
          value={formatShort(c.property?.valuation ?? 1250000)}
          sub={<span className="text-green-600">High confidence</span>}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          icon={<IconProperty />}
        />
        <StatCard
          label="Total Bids"
          value={String(c.totalBids ?? 7)}
          sub={`High: ${formatShort(c.currentHighestBid ?? 1100000)}`}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          icon={<IconBids />}
        />
        <StatCard
          label="Days Active"
          value={String(c.daysActive ?? 51)}
          sub={`Since ${c.caseStartDate ?? '1/10/2026'}`}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          icon={<IconCalendar />}
        />
      </div>

      {/* Second row: Risk, LTV, Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconShield className="text-amber-500" />
            Risk Assessment
          </h3>
          <div className="flex justify-center my-4">
            <div className="relative w-40 h-24">
              <svg viewBox="0 0 120 60" className="w-full h-full">
                <path d="M 10 50 A 50 50 0 0 1 110 50" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                <path d="M 10 50 A 50 50 0 0 1 110 50" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" strokeDasharray="78 80" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-amber-600 pt-2">MEDIUM</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">Risk Score {c.riskScore ?? 50}/100</p>
          <p className="text-sm text-gray-500 text-center">Missed Payments {c.missedPayments ?? 4}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconChart />
            Loan to Value Ratio
          </h3>
          <div className="flex justify-center my-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <path d="M18 2.084 a 15.916 15.916 0 0 1 0 31.832 a 15.916 15.916 0 0 1 0 -31.832" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <path d="M18 2.084 a 15.916 15.916 0 0 1 0 31.832 a 15.916 15.916 0 0 1 0 -31.832" fill="none" stroke="#F97316" strokeWidth="3" strokeDasharray={`${lvr} ${100 - lvr}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-orange-500">{lvr}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">Debt {formatShort(debt)} | Equity {formatShort(equity)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconDollar />
            Financial Breakdown
          </h3>
          <div className="flex justify-center my-4">
            <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="20" strokeDasharray={`${(debtPct / 100) * 251} 251`} transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray={`${(equityPct / 100) * 251} 251`} strokeDashoffset={-((debtPct / 100) * 251)} transform="rotate(-90 50 50)" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Debt {debtPct}% <span className="w-2 h-2 rounded-full bg-green-500 ml-2" /> Equity {equityPct}%
          </p>
        </div>
      </div>

      {/* Third row: Document Collection, Verification Status, Parties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconDocument />
            Document Collection
          </h3>
          <p className="text-xs text-gray-500 mb-1">Completion {c.documents?.collected ?? 13}/{c.documents?.total ?? 13}</p>
          <ProgressBar value={100} color="blue" />
          <ul className="mt-3 space-y-1">
            {(c.documents?.items || []).map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconCheck />
            Verification Status
          </h3>
          <p className="text-xs text-gray-500 mb-1">Completion {c.verification?.completed ?? 5}/{c.verification?.total ?? 5}</p>
          <ProgressBar value={100} color="blue" />
          <ul className="mt-3 space-y-1">
            {(c.verification?.items || []).map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconPeople />
            Parties & Representatives
          </h3>
          <p className="text-sm text-gray-500 mb-2">Total Parties: <strong className="text-gray-900">{c.parties?.length ?? 8}</strong></p>
          <ul className="space-y-1">
            {(c.parties || []).slice(0, 4).map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">✓</span> {typeof p === 'object' ? p.role : p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Arrears Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IconWarning className="text-amber-500" />
          Arrears Analysis
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Payment Status</p>
            <div className="flex items-end gap-2 h-32">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-amber-500 rounded-t max-h-24" style={{ height: `${Math.min(100, ((c.activeArrears ?? 18500) / 1000000) * 100)}%` }} />
                <span className="text-xs text-gray-500 mt-1">Outstanding</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Y-axis: 0 – 1,000,000</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-800">Active Arrears</p>
            <p className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-2">
              {formatNum(c.activeArrears ?? c.financials?.arrearsAndInterest ?? 18500)}
              <IconWarning className="w-6 h-6" />
            </p>
            <p className="text-sm text-amber-800">{c.missedPayments ?? 4} missed payments</p>
            <p className="text-sm text-amber-800 mt-1">Default Date: {c.defaultDate ?? c.loanDetails?.defaultDate ?? '2025-09-15'}</p>
            <p className="text-sm text-amber-800">Reason: {c.defaultReason ?? c.loanDetails?.defaultReason ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* NCCP Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="font-semibold text-amber-800 flex items-center gap-2">
          <IconWarning /> NCCP Regulated Credit
        </p>
        <p className="text-sm text-amber-800 mt-1">
          This case is subject to the National Consumer Credit Protection Act 2009. All responsible lending obligations and hardship provisions apply.
        </p>
        {onBorrowerStatusClick ? (
          <button type="button" onClick={onBorrowerStatusClick} className="text-sm font-medium text-blue-600 hover:underline mt-2">
            Borrower Status: <strong>Cooperative</strong>
          </button>
        ) : (
          <p className="text-sm font-medium text-amber-800 mt-2">Borrower Status: <strong>Cooperative</strong></p>
        )}
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity Timeline</h3>
        <ul className="space-y-3">
          {(c.recentActivity || []).map((a, i) => (
            <li key={i} className="flex gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === 'bid' ? 'bg-green-500' : a.type === 'document' ? 'bg-blue-500' : 'bg-purple-500'}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{a.label}</p>
                <p className="text-sm text-gray-600">{a.detail}</p>
                <p className="text-xs text-gray-400">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
