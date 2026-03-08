import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/borrower/dashboard' },
  { label: 'My Case', path: '/borrower/my-case' },
  { label: 'E-Signatures', path: '/borrower/e-signatures' },
  { label: 'Contracts', path: '/borrower/contracts' },
  { label: 'Identity Verification', path: '/borrower/identity-verification' },
  { label: 'Task Center', path: '/borrower/task-center' },
  { label: 'Notifications', path: '/borrower/notifications' },
]

export default function TopNavBar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleNotifications = () => {
    navigate('/borrower/notifications')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-normal text-blue-600">Brickbanq</span>
            <span className="text-lg font-bold text-black">Brickbanq</span>
            <span className="text-[10px] font-normal text-gray-500 uppercase tracking-wide">MIP Platform</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Right: Bell | User */}
        <div className="flex items-center gap-0 shrink-0">
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={handleNotifications}
            className="relative p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 ml-2 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">David Williams</p>
              <p className="text-xs font-normal text-gray-500 leading-tight">Investor</p>
            </div>
            <NavLink
              to="/borrower/settings"
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              DW
            </NavLink>
          </div>
        </div>
      </header>

      {/* Hamburger overlay */}
      {menuOpen && (
        <button
          type="button"
          onClick={closeMenu}
          className="fixed inset-0 bg-black/50 z-[60]"
          aria-label="Close menu"
        />
      )}

      {/* Hamburger slide-out menu */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white border-r border-gray-200 shadow-xl z-[70] transform transition-transform duration-200 ease-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col h-full pt-14 pb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-900">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              className="p-2 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/borrower/settings"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-1 ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Settings <span className="text-[10px] opacity-70">▾</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  )
}