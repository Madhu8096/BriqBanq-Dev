import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/lawyer/dashboard' },
  { name: 'Reports', path: '/lawyer/reports' },
  { name: 'Assigned Cases', path: '/lawyer/assigned-cases' },
  { name: 'eSignatures', path: '/lawyer/e-signatures' },
  { name: 'Contract Review', path: '/lawyer/contract-review' },
  { name: 'Task Center', path: '/lawyer/task-center' },
  { name: 'Notifications', path: '/lawyer/notifications' },
  { name: 'Settings', path: '/lawyer/settings' },
]

export default function Header({ user = { name: 'David Williams', role: 'Investor', initials: 'DW' } }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [platformOpen, setPlatformOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-md text-[#2A3037] hover:bg-[#F5F6FA]"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-shrink-0">
            <p className="text-lg font-bold text-[#3474E1] leading-tight">Brickbanq</p>
            <p className="text-xs text-gray-500 leading-tight">MIP PLATFORM</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => { setRoleOpen(false); setPlatformOpen((o) => !o); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-gray-100 text-[#2A3037] text-sm font-medium hover:bg-gray-200"
              >
                <span>Brickbanq Platform</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${platformOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {platformOpen && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={() => setPlatformOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 py-1 w-56 bg-white rounded-lg border border-gray-200 shadow-lg z-20">
                    <button type="button" onClick={() => setPlatformOpen(false)} className="w-full text-left px-4 py-2 text-sm text-[#2A3037] hover:bg-[#F5F6FA]">Brickbanq MIP</button>
                    <button type="button" onClick={() => setPlatformOpen(false)} className="w-full text-left px-4 py-2 text-sm text-[#2A3037] hover:bg-[#F5F6FA]">Brickbanq Auctions</button>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setPlatformOpen(false); setRoleOpen((o) => !o); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#3474E1] bg-[#E6F0FF] text-[#3474E1] text-sm font-medium hover:bg-[#D6E8FF]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                <span>Lawyer</span>
                <svg className={`w-4 h-4 transition-transform ${roleOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {roleOpen && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={() => setRoleOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 py-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-20">
                    <button type="button" onClick={() => setRoleOpen(false)} className="w-full text-left px-4 py-2 text-sm text-[#2A3037] hover:bg-[#F5F6FA] flex items-center gap-2"><span>Lawyer</span></button>
                    <button type="button" onClick={() => setRoleOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-[#F5F6FA]">Borrower</button>
                    <button type="button" onClick={() => setRoleOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-[#F5F6FA]">Investor</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => navigate('/lawyer/notifications')}
            className="p-2 rounded-md text-[#2A3037] hover:bg-[#F5F6FA]"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#2A3037]">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#3474E1] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {user.initials}
            </div>
          </div>
        </div>
      </header>

      {/* Hamburger overlay menu - no sidebar */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />
          <div className="fixed top-0 left-0 w-72 max-w-[85vw] h-full bg-white shadow-xl z-40 flex flex-col py-4">
            <div className="px-4 pb-4 border-b border-gray-200 flex items-center justify-between">
              <p className="text-lg font-bold text-[#3474E1]">Brickbanq</p>
              <button type="button" onClick={() => setMenuOpen(false)} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-[#E6F0FF] text-[#3474E1]' : 'text-[#2A3037] hover:bg-[#F5F6FA]'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
