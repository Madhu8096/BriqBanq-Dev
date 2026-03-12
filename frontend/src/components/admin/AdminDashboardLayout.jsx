import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AppLogo from '../common/AppLogo'
import { useAuth } from '../../context/AuthContext'
import {
    LayoutDashboard,
    Briefcase,
    Tag,
    Zap,
    Users,
    FileText,
    CircleDot,
    FolderOpen,
    BarChart2,
    Shield,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react'

const DEFAULT_SIDEBAR_WIDTH = 240

const mobileNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Case Management', path: '/admin/case-management', icon: Briefcase },
    { label: 'All Deals', path: '/admin/all-deals', icon: Tag },
    { label: 'Auction Control', path: '/admin/auction-control', icon: Zap },
    { label: 'KYC Review Queue', path: '/admin/kyc-review', icon: Users },
    { label: 'Contracts', path: '/admin/contracts', icon: FileText },
    { label: 'Escrow Management', path: '/admin/escrow-management', icon: CircleDot },
    { label: 'Document Library', path: '/admin/document-library', icon: FolderOpen },
    { label: 'Reports & Analytics', path: '/admin/reports-analytics', icon: BarChart2 },
    { label: 'Admin Console', path: '/admin/admin-console', icon: Shield },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminDashboardLayout() {
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024) // lg breakpoint
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <AdminSidebar
                    width={sidebarWidth}
                    onWidthChange={setSidebarWidth}
                    isMobile={false}
                />
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobile && isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 flex flex-col">
                        {/* Mobile Logo */}
                        <div className="px-4 py-4 border-b border-gray-800 flex items-center justify-between">
                            <AppLogo />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5 flex-shrink-0" />
                            </button>
                        </div>

                        {/* Mobile Nav */}
                        <nav className="flex-1 py-3 overflow-y-auto">
                            {mobileNavItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 px-3 py-2 mx-2 my-0.5 rounded text-sm font-medium transition-colors ${isActive
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="leading-tight text-xs">{item.label}</span>
                                    </NavLink>
                                )
                            })}
                        </nav>

                        {/* Sign Out */}
                        <div className="border-t border-gray-800 p-3">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4 flex-shrink-0" />
                                <span className="leading-tight text-xs">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Main Content */}
            <div
                className="flex flex-col transition-all duration-200 min-h-screen"
                style={{
                    marginLeft: isMobile ? '0' : `${sidebarWidth}px`
                }}
            >
                {/* Top Navbar */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 z-10 transition-all duration-200"
                    style={{
                        left: isMobile ? '0' : `${sidebarWidth}px`
                    }}
                >
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="text-gray-600 hover:text-gray-900 p-2"
                            >
                                <Menu className="w-6 h-6 flex-shrink-0" />
                            </button>
                        )}
                    </div>

                    {/* Right Section - User Info and Notifications */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 flex-shrink-0" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Info */}
                        <div className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-4 border-l border-gray-200">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">David Williams</p>
                                <p className="text-xs text-gray-500">Investor</p>
                            </div>
                            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">DW</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 mt-14 p-4 sm:p-6 lg:p-8 w-full overflow-x-auto">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
