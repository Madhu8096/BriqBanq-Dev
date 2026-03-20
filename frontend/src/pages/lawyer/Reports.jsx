import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MOCK_CASES } from './data/mockData'

const MOCK_STATS = {
  totalCases: { value: 47, growth: '+12%', up: true },
  activeCases: { value: 23, sub: '23 in progress', growth: null },
  totalRevenue: { value: 'A$12.4M', growth: '+18%', up: true },
  avgCaseValue: { value: 'A$1050K', sub: 'Per case', growth: null },
  totalBids: { value: 156, sub: '3.3 per case', growth: null },
  successRate: { value: '68%', growth: '+5%', up: true },
}

const VOLUME_BARS = [
  { month: 'Oct', cases: 32 },
  { month: 'Nov', cases: 45 },
  { month: 'Dec', cases: 38 },
  { month: 'Jan', cases: 52 },
  { month: 'Feb', cases: 41 },
  { month: 'Mar', cases: 47 },
]

const REVENUE_BARS = [
  { label: 'Residential', value: 48, color: 'bg-[#3474E1]' },
  { label: 'Commercial', value: 28, color: 'bg-emerald-500' },
  { label: 'Industrial', value: 14, color: 'bg-amber-500' },
  { label: 'Other', value: 10, color: 'bg-purple-500' },
]

const PERIOD_DATA = {
  'Last 30 Days':  { cases: 12, revenue: 'A$1.8M',  bids: 34,  rate: '71%' },
  'Last 90 Days':  { cases: 28, revenue: 'A$4.2M',  bids: 89,  rate: '68%' },
  'Last 6 Months': { cases: 47, revenue: 'A$12.4M', bids: 156, rate: '68%' },
  'Last Year':     { cases: 89, revenue: 'A$24.7M', bids: 312, rate: '72%' },
}

const STATUS_COLOR = {
  'In Auction': 'bg-blue-100 text-blue-700',
  'Active':     'bg-emerald-100 text-emerald-700',
  'Pending':    'bg-amber-100 text-amber-700',
  'Completed':  'bg-gray-100 text-gray-600',
}

const RISK_COLOR = {
  'Low Risk':    'text-emerald-600',
  'Medium Risk': 'text-amber-600',
  'High Risk':   'text-red-600',
}

export default function Reports() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('Last 6 Months')
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')

  const periodData = PERIOD_DATA[period] || PERIOD_DATA['Last 6 Months']

  const filteredCases = MOCK_CASES.filter(
    (c) => statusFilter === 'All' || c.status === statusFilter
  )

  const maxVolume = Math.max(...VOLUME_BARS.map((b) => b.cases))

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleExport = (format, section) => {
    const filename = `${section.replace(/\s+/g, '-')}-${format.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.${format === 'PDF' ? 'pdf' : 'xlsx'}`
    const blob = new Blob(
      [`${section} report (${format}) — ${period}\n\nThis is a placeholder export.`],
      { type: format === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/lawyer/dashboard" className="text-[#3474E1] hover:underline">Dashboard</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-700 font-medium">Reports &amp; Analytics</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A3037]">Reports &amp; Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive platform insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3474E1]"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Last Year">Last Year</option>
          </select>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-70 flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Cases',    value: periodData.cases,   growth: MOCK_STATS.totalCases.growth,   up: true  },
          { label: 'Active Cases',   value: MOCK_STATS.activeCases.value, growth: null,   up: null  },
          { label: 'Total Revenue',  value: periodData.revenue, growth: MOCK_STATS.totalRevenue.growth, up: true  },
          { label: 'Avg Case Value', value: MOCK_STATS.avgCaseValue.value, growth: null, up: null  },
          { label: 'Total Bids',     value: periodData.bids,    growth: null,   up: null  },
          { label: 'Success Rate',   value: periodData.rate,    growth: MOCK_STATS.successRate.growth,  up: true  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
            {s.growth && (
              <span className="text-xs font-medium text-emerald-600">{s.growth} vs prior</span>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Case Volume Trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Case Volume Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly case count — {period}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/lawyer/assigned-cases')}
              className="text-sm text-[#3474E1] hover:text-[#2a5fc4] font-medium"
            >
              View Cases →
            </button>
          </div>
          <div className="flex items-end gap-2 h-36">
            {VOLUME_BARS.map((b) => (
              <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{b.cases}</span>
                <div
                  className="w-full bg-[#3474E1] rounded-t-md transition-all duration-500"
                  style={{ height: `${(b.cases / maxVolume) * 112}px` }}
                />
                <span className="text-xs text-gray-400">{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Revenue Distribution</h3>
              <p className="text-xs text-gray-500 mt-0.5">By property category — {period}</p>
            </div>
            <button
              type="button"
              onClick={() => handleExport('PDF', 'Revenue Distribution')}
              className="text-sm text-[#3474E1] hover:text-[#2a5fc4] font-medium"
            >
              Export →
            </button>
          </div>
          <div className="space-y-3">
            {REVENUE_BARS.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{r.label}</span>
                  <span className="font-medium">{r.value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Case Details Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Case Details</h3>
            <p className="text-xs text-gray-500 mt-0.5">All cases for the selected period — click a row to view full details</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3474E1]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Auction">In Auction</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              type="button"
              onClick={() => navigate('/lawyer/assigned-cases')}
              className="px-3 py-1.5 bg-[#3474E1] hover:bg-[#2a5fc4] text-white text-sm font-medium rounded-lg"
            >
              View All Cases
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Case ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Borrower</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Property</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Debt</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Valuation</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-400">
                    No cases match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#EEF4FF]/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/lawyer/assigned-cases/${c.id}`)}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.caseNumber}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{c.borrower}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{c.propertyAddress}</p>
                      <p className="text-xs text-gray-400">{c.propertySuburb}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{c.debt}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{c.valuation}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${RISK_COLOR[c.risk] || 'text-gray-500'}`}>
                        {c.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{c.created}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/lawyer/assigned-cases/${c.id}`) }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#3474E1] hover:text-[#2a5fc4] hover:bg-[#EEF4FF] rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredCases.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">Showing {filteredCases.length} of {MOCK_CASES.length} cases</p>
            <button
              type="button"
              onClick={() => navigate('/lawyer/assigned-cases')}
              className="text-xs text-[#3474E1] hover:underline font-medium"
            >
              View all in Cases →
            </button>
          </div>
        )}
      </div>

      {/* Export sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: 'Financial Summary',  desc: 'Revenue, payments, and transaction analysis.',  color: 'bg-emerald-100', textColor: 'text-emerald-600', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          { title: 'Case Performance',   desc: 'Case volume, status breakdown, and trends.',    color: 'bg-blue-100',    textColor: 'text-blue-600',    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
          { title: 'User Activity',      desc: 'User engagement, registrations, and KYC.',     color: 'bg-purple-100',  textColor: 'text-purple-600',  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
          { title: 'Auction Analytics',  desc: 'Bidding activity, win rates, and pricing.',    color: 'bg-amber-100',   textColor: 'text-amber-600',   icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
        ].map((s) => (
          <div key={s.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center flex-shrink-0`}>
                <svg className={`w-5 h-5 ${s.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleExport('PDF', s.title)}
                className="flex-1 bg-[#3474E1] hover:bg-[#2a5fc4] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Export PDF
              </button>
              <button
                type="button"
                onClick={() => handleExport('Excel', s.title)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Export Excel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
