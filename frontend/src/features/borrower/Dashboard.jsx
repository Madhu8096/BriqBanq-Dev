import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from './StatCard'
import ActionCard from './ActionCard'
import TimelineEvent from './TimelineEvent'
import { borrowerApi } from './api'
import {
  FALLBACK_STATS,
  FALLBACK_PROPERTY,
  FALLBACK_ACTIONS,
  FALLBACK_TIMELINE,
  FALLBACK_CASE_ID
} from './data/fallbackData'

const emptyStats = {
  propertyValue: 0,
  outstandingDebt: 0,
  documentsRemaining: 0,
  documentsTotal: 0,
  unreadMessages: 0
}

const emptyProperty = { address: '', location: '', bedrooms: 0, bathrooms: 0, landSize: 0 }

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(emptyStats)
  const [nextActions, setNextActions] = useState([])
  const [timeline, setTimeline] = useState([])
  const [caseId, setCaseId] = useState('')
  const [property, setProperty] = useState(emptyProperty)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setLoading(true)
    const load = async () => {
      try {
        const [statsRes, actionsRes, timelineRes] = await Promise.all([
          borrowerApi.getDashboardStats(),
          borrowerApi.getNextActions(),
          borrowerApi.getCaseTimeline()
        ])
        if (cancelled) return
        const d = (r) => r?.data?.data !== undefined ? r.data.data : r?.data
        const s = d(statsRes)
        const a = d(actionsRes)
        const t = d(timelineRes)
        if (s && typeof s === 'object') {
          setStats({
            propertyValue: Number(s.propertyValue ?? s.property_value) ?? 0,
            outstandingDebt: Number(s.outstandingDebt ?? s.outstanding_debt) ?? 0,
            documentsRemaining: Number(s.documentsRemaining ?? s.documents_remaining) ?? 0,
            documentsTotal: Number(s.documentsTotal ?? s.documents_total) ?? 0,
            unreadMessages: Number(s.unreadMessages ?? s.unread_messages) ?? 0
          })
          const id = s.caseId ?? s.case_id
          if (id) {
            setCaseId(id)
            try { localStorage.setItem('borrowerCaseId', String(id)) } catch (_) {}
          }
          if (s.property && typeof s.property === 'object') setProperty({
            address: s.property.address ?? '',
            location: s.property.location ?? '',
            bedrooms: Number(s.property.bedrooms) ?? 0,
            bathrooms: Number(s.property.bathrooms) ?? 0,
            landSize: Number(s.property.landSize ?? s.property.land_size) ?? 0
          })
        }
        if (Array.isArray(a)) setNextActions(a)
        else if (a?.actions) setNextActions(a.actions)
        else if (a?.items) setNextActions(a.items)
        if (Array.isArray(t)) setTimeline(t)
        else if (t?.timeline) setTimeline(t.timeline)
        else if (t?.events) setTimeline(t.events)
        const hasAnyData = (s && (Number(s.propertyValue ?? s.property_value) || s.caseId || s.case_id)) || (Array.isArray(a) && a.length > 0) || (Array.isArray(t) && t.length > 0) || (t?.timeline?.length > 0) || (t?.events?.length > 0)
        if (!hasAnyData) {
          setStats(FALLBACK_STATS)
          setCaseId(FALLBACK_CASE_ID)
          try { localStorage.setItem('borrowerCaseId', FALLBACK_CASE_ID) } catch (_) {}
          setProperty(FALLBACK_PROPERTY)
          setNextActions(FALLBACK_ACTIONS)
          setTimeline(FALLBACK_TIMELINE)
        }
      } catch (e) {
        if (!cancelled) {
          setStats(FALLBACK_STATS)
          setCaseId(FALLBACK_CASE_ID)
          try { localStorage.setItem('borrowerCaseId', FALLBACK_CASE_ID) } catch (_) {}
          setProperty(FALLBACK_PROPERTY)
          setNextActions(FALLBACK_ACTIONS)
          setTimeline(FALLBACK_TIMELINE)
          const isNetworkError = e?.code === 'ERR_NETWORK' || e?.message === 'Network Error'
          if (!isNetworkError) setError(e?.message || 'Failed to load dashboard')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex items-center justify-center py-20 text-slate-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mortgage resolution case</p>
        {error && <p className="text-sm text-amber-600 mt-1">{error}</p>}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Welcome back!</h2>
            <p className="text-sm text-slate-600 mt-1">
              Your case is currently under review. Here&apos;s what you need to do next.
            </p>
            <button
              type="button"
              onClick={() => navigate('/borrower/my-case')}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded inline-flex items-center space-x-2"
            >
              <span>📁</span>
              <span>View My Case</span>
            </button>
          </div>
          <div className="text-right">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded">
              In Review
            </span>
            <p className="text-sm text-slate-600 mt-2">{caseId || '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Property Value"
          value={`$${(stats.propertyValue / 1000).toFixed(0)}k`}
          icon="🏠"
          iconBg="bg-green-100"
          iconColor="text-green-600"
          subtext="Market Valuation"
        />
        <StatCard
          label="Outstanding Debt"
          value={`$${(stats.outstandingDebt / 1000).toFixed(0)}k`}
          icon="📈"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          subtext="Current Balance"
        />
        <StatCard
          label="Documents"
          value={`${stats.documentsRemaining}/${stats.documentsTotal}`}
          icon="📄"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          subtext="Pending Upload"
        />
        <StatCard
          label="Messages"
          value={stats.unreadMessages}
          icon="💬"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          subtext="Unread Messages"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center space-x-2">
                <span className="text-amber-500">⚠️</span>
                <h3 className="text-lg font-semibold text-slate-900">Next Actions Required</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {nextActions.length === 0 ? (
                <p className="text-sm text-slate-500">No actions required.</p>
              ) : (
                nextActions.map((action) => (
                  <ActionCard key={action.id ?? action.title} action={action} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <h3 className="text-lg font-semibold text-slate-900">Case Timeline</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {timeline.length === 0 ? (
                <p className="text-sm text-slate-500">No timeline events yet.</p>
              ) : (
                timeline.map((event) => (
                  <TimelineEvent key={event.id ?? event.date} event={event} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center space-x-2">
            <span>🏡</span>
            <h3 className="text-lg font-semibold text-slate-900">Your Property</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div>
              <p className="text-sm text-slate-500">Address</p>
              <p className="text-sm font-medium text-slate-900 mt-1">{property?.address || '—'}</p>
              <p className="text-xs text-slate-600 mt-0.5">{property?.location || ''}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Property Type</p>
              <p className="text-sm font-medium text-slate-900 mt-1">—</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Bedrooms / Bathrooms</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {property?.bedrooms ?? 0} bed / {property?.bathrooms ?? 0} bath
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Land Size</p>
              <p className="text-sm font-medium text-slate-900 mt-1">{property?.landSize ?? 0} m²</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">ℹ️</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">What happens next?</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Complete all required document uploads</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Our team will review your case and property valuation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Once approved, your case will be listed for auction</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You&apos;ll be able to review and accept bids from qualified lenders</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>After accepting a bid, proceed to contract signing and settlement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
