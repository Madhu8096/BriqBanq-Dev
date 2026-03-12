import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { BorrowerProfileContext } from './BorrowerProfileContext'
import { profileService } from './services'
import { MOCK_PROFILE } from './data/borrowerMockData'

function getInitials(profile) {
  const first = (profile?.firstName ?? profile?.first_name ?? '').trim()
  const last = (profile?.lastName ?? profile?.last_name ?? '').trim()
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
  if (first) return first.slice(0, 2).toUpperCase()
  if (profile?.email) return String(profile.email[0]).toUpperCase()
  return '—'
}

function getDisplayName(profile) {
  const first = (profile?.firstName ?? profile?.first_name ?? '').trim()
  const last = (profile?.lastName ?? profile?.last_name ?? '').trim()
  if (first && last) return `${first} ${last}`
  if (first || last) return first || last
  if (profile?.email) return profile.email
  return 'User'
}

export default function BorrowerLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfileState] = useState(null)

  const setProfile = useCallback((next) => {
    setProfileState((prev) => {
      const nextVal = typeof next === 'function' ? next(prev) : next
      // Service layer handles localStorage persistence
      return nextVal
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    profileService.getProfile()
      .then((profileData) => {
        if (!cancelled) setProfileState(profileData)
      })
      .catch(() => {
        if (!cancelled) {
          // Service handles fallback, use MOCK_PROFILE as last resort
          setProfileState(MOCK_PROFILE)
        }
      })
    return () => { cancelled = true }
  }, [])

  const initials = getInitials(profile)
  const displayName = getDisplayName(profile)
  const profileValue = { profile, setProfile }

  return (
    <BorrowerProfileContext.Provider value={profileValue}>
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 md:ml-64 flex-1 min-w-0 flex flex-col overflow-x-hidden">
        <div className="bg-white border-b border-slate-200 h-16 flex items-center justify-between gap-4 px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden p-2 hover:bg-slate-100 rounded"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/borrower/notifications')}
                className="p-2 hover:bg-slate-100 rounded"
                title="Notifications"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
                  {profile?.photoUrl ? (
                    <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">{displayName}</span>
              </div>
            </div>
          </div>
        </div>

        <main className="p-4 md:p-8 flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
    </BorrowerProfileContext.Provider>
  )
}
