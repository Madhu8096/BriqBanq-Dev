import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardData } from './api'
import { LoadingState, ErrorState } from './components/PageState'

const StatIcons = {
  folder: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  dollar: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  gavel: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
}

const PlatformStatusIcons = {
  lightning: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  rocket: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  exclamation: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

const QuickActionIcons = {
  eye: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  gear: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

export default function LawyerDashboard() {
  const navigate = useNavigate()
  const [chartRange, setChartRange] = useState('Last 7 Months')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    getDashboardData()
      .then((res) => {
        if (!cancelled && res.error) setError(res.error)
        if (!cancelled && res.data) setData(res.data)
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load dashboard') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingState message="Loading dashboard..." />
  if (error) return <ErrorState message={error} onRetry={() => { setError(null); setLoading(true); getDashboardData().then((res) => { setData(res.data); setError(res.error); }).finally(() => setLoading(false)) }} />

  const stats = data?.stats ?? []
  const platformStatus = data?.platformStatus ?? []
  const recentCases = data?.recentCases ?? []
  const recentSales = data?.recentSales ?? []
  const quickActions = data?.quickActions ?? []
  const { months = [], casesCreated = [], salesVolume = [], salesVolumeLabel = '' } = data?.monthlyOverview ?? {}
  const maxCases = casesCreated.length ? Math.max(...casesCreated) : 1
  const maxSales = salesVolume.length ? Math.max(...salesVolume) : 1

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#2A3037]">Dashboard</h1>
      </div>

      {/* Row 1: Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-[#2A3037] mt-1">{stat.value}</p>
                <p className={`text-sm font-medium mt-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? '+' : ''}{stat.trend}%
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.description}</p>
              </div>
              <div className={`flex-shrink-0 ${
                  stat.icon === 'folder' || stat.icon === 'briefcase' ? 'text-[#3474E1]' :
                  stat.icon === 'dollar' ? 'text-[#00C853]' :
                  stat.icon === 'users' ? 'text-[#6A0DAD]' :
                  stat.icon === 'gavel' ? 'text-amber-500' : 'text-slate-500'
                }`}>
                {StatIcons[stat.icon] ?? StatIcons.briefcase}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Monthly Overview + Platform Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-[#2A3037]">Monthly Overview</h3>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white text-slate-700 focus:ring-2 focus:ring-[#3474E1] focus:border-[#3474E1]"
            >
              <option>Last 7 Months</option>
              <option>Last 12 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-end gap-2">
              {months.map((month, i) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '120px' }}>
                    <div
                      className="flex-1 min-w-0 rounded-t bg-[#3474E1] max-h-full"
                      style={{ height: `${(casesCreated[i] / maxCases) * 100}%`, minHeight: '4px' }}
                      title={`Cases: ${casesCreated[i]}`}
                    />
                    <div
                      className="flex-1 min-w-0 rounded-t bg-green-500 max-h-full"
                      style={{ height: `${(salesVolume[i] / maxSales) * 100}%`, minHeight: '4px' }}
                      title={`Sales: A$${salesVolume[i]}M`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                <span className="w-3 h-3 rounded bg-blue-500" /> Cases Created
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                <span className="w-3 h-3 rounded bg-green-500" /> Sales Volume
              </span>
              <span className="text-sm font-medium text-slate-700 ml-auto">{salesVolumeLabel}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-[#2A3037]">Platform Status</h3>
          </div>
          <div className="p-4 space-y-3">
            {platformStatus.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'live') navigate('/lawyer/assigned-cases')
                  if (item.id === 'pending') navigate('/admin/kyc-review')
                  if (item.id === 'completed') navigate('/lawyer/assigned-cases')
                  if (item.id === 'attention') navigate('/lawyer/notifications')
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  item.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                  item.color === 'orange' ? 'bg-amber-50 hover:bg-amber-100' :
                  item.color === 'green' ? 'bg-green-50 hover:bg-green-100' :
                  'bg-red-50 hover:bg-red-100'
                }`}
              >
                <span className={item.color === 'blue' ? 'text-[#3474E1]' : item.color === 'orange' ? 'text-amber-600' : item.color === 'green' ? 'text-green-600' : 'text-red-600'}>
                  {PlatformStatusIcons[item.icon] ?? PlatformStatusIcons.rocket}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2A3037]">{item.label}:</p>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
                <span className={`flex-shrink-0 font-bold text-lg ${
                  item.color === 'blue' ? 'text-[#3474E1]' : item.color === 'orange' ? 'text-amber-600' : item.color === 'green' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Cases + Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2A3037]">Recent Cases</h3>
            <button
              type="button"
              onClick={() => navigate('/lawyer/assigned-cases')}
              className="text-[#3474E1] text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentCases.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate('/lawyer/assigned-cases')}
                className="w-full px-6 py-4 text-left hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[#2A3037]">{c.id}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    c.status === 'SOLD' ? 'bg-green-100 text-green-800' :
                    c.status === 'FOR SALE' || c.status === 'BUY NOW' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-1">{c.property}</p>
                <p className="text-xs text-slate-500">{c.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-[#2A3037]">{c.price}</span>
                  <span className="text-xs text-slate-500">{c.bids}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2A3037]">Recent Sales</h3>
            <button
              type="button"
              onClick={() => navigate('/admin/reports-analytics')}
              className="text-[#3474E1] text-sm font-medium hover:underline"
            >
              View Reports
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentSales.map((s) => (
              <button
                key={`${s.id}-${s.timeAgo}`}
                type="button"
                onClick={() => navigate('/admin/reports-analytics')}
                className="w-full px-6 py-4 text-left hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[#2A3037]">{s.id}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">{s.status}</span>
                </div>
                <p className="text-sm text-slate-700 mt-1">{s.property}</p>
                <p className="text-xs text-slate-500">{s.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-[#2A3037]">{s.price}</span>
                  <span className="text-xs text-slate-500">{s.timeAgo}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => navigate(action.path.startsWith('/') ? action.path : `/lawyer/${action.path}`)}
            className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#3474E1]/30 transition-all text-left flex items-center gap-4"
          >
            <div className="flex-shrink-0 text-[#3474E1]">
              {QuickActionIcons[action.icon]}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#2A3037]">{action.label}</p>
              <p className="text-sm text-slate-500 mt-0.5">{action.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
