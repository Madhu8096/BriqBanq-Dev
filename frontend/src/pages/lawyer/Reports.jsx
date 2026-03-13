import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOCK_ACTIVITY = [
  { id: 1, type: 'case', text: 'New case created (MIP-2024-012 by Sarah Mitchell)', time: '5 minutes ago' },
  { id: 2, type: 'bid', text: 'Bid placed (A$1.2M bid on MIP-2024-008)', time: '15 minutes ago' },
  { id: 3, type: 'contract', text: 'Contract signed (MIP-2024-005 settlement proceeding)', time: '1 hour ago' },
  { id: 4, type: 'kyc', text: 'KYC approved (David Wilson verified)', time: '2 hours ago' },
  { id: 5, type: 'payment', text: 'Payment received (A$850K payment processed)', time: '3 hours ago' },
]

const MOCK_STATS = {
  totalCases: { value: 47, growth: '+12%' },
  activeCases: { value: 23, sub: '23 in progress' },
  totalRevenue: { value: 'A$12.4M', growth: '+18%' },
  avgCaseValue: { value: 'A$1050K', sub: 'Per case' },
  totalBids: { value: 156, sub: '3.3 per case' },
  successRate: { value: '68%', growth: '+5%' },
}

export default function Reports() {
  const [period, setPeriod] = useState('Last 30 Days')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleExport = (format, section) => {
    const filename = `${section.replace(/\s+/g, '-')}-${format.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.${format === 'PDF' ? 'pdf' : 'xlsx'}`
    const blob = new Blob([`${section} report (${format}) - ${period}. This is a placeholder.`], { type: format === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
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
        <span className="text-gray-700 font-medium">Reports & Analytics</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A3037]">Reports</h1>
          <h2 className="text-lg font-semibold text-[#2A3037] mt-0.5">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Comprehensive platform insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
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
            {refreshing ? (
              <svg className="w-4 h-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Key metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Cases</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.totalCases.value}</p>
            <span className="text-xs text-green-600 font-medium">+12% vs last period</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Active Cases</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.activeCases.value}</p>
            <p className="text-xs text-gray-500">{MOCK_STATS.activeCases.sub}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.totalRevenue.value}</p>
            <span className="text-xs text-green-600 font-medium">+18% vs last period</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Avg Case Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.avgCaseValue.value}</p>
            <p className="text-xs text-gray-500">{MOCK_STATS.avgCaseValue.sub}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Bids</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.totalBids.value}</p>
            <p className="text-xs text-gray-500">{MOCK_STATS.totalBids.sub}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.successRate.value}</p>
            <span className="text-xs text-green-600 font-medium">+5% vs last period</span>
          </div>
        </div>
      </div>

      {/* Exportable summary sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-green-600">$</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Financial Summary</h3>
              <p className="text-sm text-gray-500">Revenue, payments, and transaction analysis.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => handleExport('PDF', 'Financial Summary')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">Export PDF</button>
            <button type="button" onClick={() => handleExport('Excel', 'Financial Summary')} className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">Export Excel</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-blue-600">📄</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Case Performance</h3>
              <p className="text-sm text-gray-500">Case volume, status breakdown, and trends.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => handleExport('PDF', 'Case Performance')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">Export PDF</button>
            <button type="button" onClick={() => handleExport('Excel', 'Case Performance')} className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">Export Excel</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-purple-600">👥</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">User Activity</h3>
              <p className="text-sm text-gray-500">User engagement, registrations, and KYC.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => handleExport('PDF', 'User Activity')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">Export PDF</button>
            <button type="button" onClick={() => handleExport('Excel', 'User Activity')} className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">Export Excel</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-amber-600">📊</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Auction Analytics</h3>
              <p className="text-sm text-gray-500">Bidding activity, win rates, and pricing.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => handleExport('PDF', 'Auction Analytics')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">Export PDF</button>
            <button type="button" onClick={() => handleExport('Excel', 'Auction Analytics')} className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">Export Excel</button>
          </div>
        </div>
      </div>

      {/* Chart placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Case Volume Trend</h3>
            <button type="button" className="text-sm text-[#3474E1] hover:underline">View Details</button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <span className="text-4xl mb-2">📊</span>
            <p className="text-sm">Interactive chart would display here</p>
            <p className="text-xs">Showing case volume over time</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Revenue Distribution</h3>
            <button type="button" className="text-sm text-[#3474E1] hover:underline">View Details</button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <span className="text-4xl mb-2">🥧</span>
            <p className="text-sm">Interactive chart would display here</p>
            <p className="text-xs">Showing revenue by category</p>
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Recent Platform Activity</h3>
          <button type="button" className="text-sm text-[#3474E1] hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {MOCK_ACTIVITY.map((a) => (
            <div key={a.id} className="px-6 py-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">📋</span>
              </div>
              <div>
                <p className="text-sm text-gray-900">{a.text}</p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
