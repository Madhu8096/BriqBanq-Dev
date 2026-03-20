import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from './components/StatCard'
import {
  MOCK_DASHBOARD_STATS,
  MOCK_PLATFORM_STATUS,
  MOCK_RECENT_CASES,
  MOCK_RECENT_SALES,
  MOCK_QUICK_ACTIONS,
} from './data/mockData'

const MONTH_RANGES = ['This Month', 'Last 3 Months', 'Last 6 Months', 'This Year']

const RANGE_DATA = {
  'This Month': {
    casesCreated: 12,
    salesVolume: 'A$1.8M',
    months: ['Mar'],
    bars: [72],
  },
  'Last 3 Months': {
    casesCreated: 28,
    salesVolume: 'A$3.4M',
    months: ['Jan', 'Feb', 'Mar'],
    bars: [55, 80, 72],
  },
  'Last 6 Months': {
    casesCreated: 38,
    salesVolume: 'A$5.9M',
    months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    bars: [40, 65, 70, 55, 80, 72],
  },
  'This Year': {
    casesCreated: 89,
    salesVolume: 'A$15.8M',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    bars: [30, 45, 55, 60, 70, 65, 80, 75, 85, 90, 88, 72],
  },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [monthRange, setMonthRange] = useState('Last 6 Months')
  const [showRangeMenu, setShowRangeMenu] = useState(false)
  const [openCaseMenu, setOpenCaseMenu] = useState(null)
  const rangeMenuRef = useRef(null)
  const caseMenuRef = useRef(null)

  const overviewData = RANGE_DATA[monthRange] || RANGE_DATA['Last 6 Months']

  useEffect(() => {
    const handleClick = (e) => {
      if (rangeMenuRef.current && !rangeMenuRef.current.contains(e.target)) setShowRangeMenu(false)
      if (caseMenuRef.current && !caseMenuRef.current.contains(e.target)) setOpenCaseMenu(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#2A3037]">Dashboard</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {MOCK_DASHBOARD_STATS.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            subtitle={s.subtitle}
            trend={s.trend}
            trendUp={s.trendUp}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Monthly Overview + Platform Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2A3037]">Monthly Overview</h2>
            <div className="relative" ref={rangeMenuRef}>
              <button
                type="button"
                onClick={() => setShowRangeMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[#2A3037] text-sm font-medium transition-colors"
              >
                {monthRange}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showRangeMenu ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showRangeMenu && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-30 overflow-hidden py-1">
                  {MONTH_RANGES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setMonthRange(r); setShowRangeMenu(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        monthRange === r
                          ? 'bg-[#EEF4FF] text-[#3474E1] font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {r}
                      {monthRange === r && (
                        <svg className="w-4 h-4 text-[#3474E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#EEF4FF] rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">Cases Created</p>
              <p className="text-2xl font-bold text-[#3474E1]">{overviewData.casesCreated}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">Sales Volume</p>
              <p className="text-2xl font-bold text-emerald-600">{overviewData.salesVolume}</p>
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="mt-2">
            <div className="flex items-end gap-1 h-14">
              {overviewData.bars.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="w-full bg-[#3474E1] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${(val / 100) * 56}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-1">
              {overviewData.months.map((m, i) => (
                <div key={i} className="flex-1 text-center text-[10px] text-gray-400 truncate min-w-0">{m}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#2A3037] mb-4">Platform Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_PLATFORM_STATUS.map((s) => (
              <div key={s.id} className="p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-semibold ${
                    s.color === 'blue' ? 'text-[#3474E1]' :
                    s.color === 'orange' ? 'text-[#FF8C00]' :
                    s.color === 'green' ? 'text-[#00C853]' : 'text-[#FF4500]'
                  }`}>{s.value}</span>
                  <span className="text-sm text-[#2A3037]">{s.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Cases + Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2A3037]">Recent Cases</h2>
            <button type="button" onClick={() => navigate('/lawyer/assigned-cases')} className="text-sm font-medium text-[#3474E1] flex items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          </div>
          <ul className="space-y-3" ref={caseMenuRef}>
            {MOCK_RECENT_CASES.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.tag && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        c.tagColor === 'blue' ? 'bg-[#E6F0FF] text-[#3474E1]' :
                        c.tagColor === 'green' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}>{c.tag}</span>
                    )}
                    <span className="text-sm font-medium text-[#2A3037]">{c.id}</span>
                  </div>
                  <p className="text-sm font-medium text-[#2A3037] mt-0.5">{c.title}</p>
                  {c.price && <p className="text-xs text-gray-500">{c.price}</p>}
                  <p className="text-xs text-gray-500">{c.bids} · {c.time}</p>
                </div>
                {c.hasMenu && (
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setOpenCaseMenu(openCaseMenu === c.id ? null : c.id)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      aria-label="Actions"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                    </button>
                    {openCaseMenu === c.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        <button type="button" onClick={() => { navigate(`/lawyer/assigned-cases/${c.id}`); setOpenCaseMenu(null) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          View Case
                        </button>
                        <button type="button" onClick={() => { navigate('/lawyer/task-center'); setOpenCaseMenu(null) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          View Tasks
                        </button>
                        <button type="button" onClick={() => { navigate('/lawyer/notifications'); setOpenCaseMenu(null) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                          Notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2A3037]">Recent Sales</h2>
            <button type="button" onClick={() => navigate('/lawyer/reports')} className="text-sm font-medium text-[#3474E1] hover:text-[#2a5fc4] flex items-center gap-1 transition-colors">
              View Reports
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          </div>
          <ul className="space-y-3">
            {MOCK_RECENT_SALES.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700">SOLD</span>
                    <span className="text-sm font-medium text-[#2A3037]">{s.id}</span>
                  </div>
                  <p className="text-sm font-medium text-[#2A3037]">{s.title}</p>
                  {s.company && <p className="text-xs text-gray-500">{s.company}</p>}
                  <p className="text-sm font-semibold text-[#2A3037]">{s.amount}</p>
                  {s.change && <span className="text-xs text-[#00C853]">↗ +{s.change.replace('+', '')}</span>}
                  {s.time && <span className="text-xs text-gray-500">{s.time}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#2A3037] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_QUICK_ACTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => a.path && navigate(a.path)}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-left hover:bg-gray-50 transition"
            >
              <p className="text-sm font-medium text-[#2A3037]">{a.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{a.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
