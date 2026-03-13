import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from './components/StatCard'
import {
  MOCK_DASHBOARD_STATS,
  MOCK_MONTHLY_OVERVIEW,
  MOCK_PLATFORM_STATUS,
  MOCK_RECENT_CASES,
  MOCK_RECENT_SALES,
  MOCK_QUICK_ACTIONS,
} from './data/mockData'

export default function Dashboard() {
  const navigate = useNavigate()
  const [monthRange, setMonthRange] = useState(MOCK_MONTHLY_OVERVIEW.range)

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
            <button
              type="button"
              onClick={() => {}}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 text-[#2A3037] text-sm"
            >
              {monthRange}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <p className="text-sm text-[#2A3037]">Cases Created <span className="font-semibold text-[#3474E1]">{MOCK_MONTHLY_OVERVIEW.casesCreated}</span></p>
          <p className="text-sm text-[#2A3037] mt-1">Sales Volume <span className="font-semibold text-[#00C853]">{MOCK_MONTHLY_OVERVIEW.salesVolume}</span></p>
          <div className="mt-4 flex gap-2 text-xs text-gray-500">
            {MOCK_MONTHLY_OVERVIEW.months.map((m) => (
              <span key={m}>{m}</span>
            ))}
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
          <ul className="space-y-3">
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
                  <button type="button" className="p-1 rounded hover:bg-gray-200" aria-label="Actions">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2A3037]">Recent Sales</h2>
            <button type="button" onClick={() => {}} className="text-sm font-medium text-[#3474E1] flex items-center gap-1">
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
