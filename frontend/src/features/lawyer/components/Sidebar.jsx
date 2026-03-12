import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const NAV_ITEMS = [
  { name: 'Dashboard', path: 'dashboard', icon: '🏠' },
  { name: 'Assigned Cases', path: 'assigned-cases', icon: '📋' },
  { name: 'eSignatures', path: 'e-signatures', icon: '✍️' },
  { name: 'Task Center', path: 'task-center', icon: '✅' },
  { name: 'Notifications', path: 'notifications', icon: '🔔' },
  { name: 'Settings', path: 'settings', icon: '⚙️' },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose?.()}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}
      <aside className={`fixed left-0 top-0 z-30 h-full w-64 flex flex-col bg-[#111827] transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-700">
        <h1 className="text-white text-xl font-bold">Brickbanq</h1>
          <p className="text-[#9CA3AF] text-xs mt-1">Virtual MIP Platform</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={`/lawyer/${item.path}`}
            end={item.path === 'dashboard'}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#6366F1] text-white'
                  : 'text-white hover:bg-[#1F2937]'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#1F2937] transition-colors w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
