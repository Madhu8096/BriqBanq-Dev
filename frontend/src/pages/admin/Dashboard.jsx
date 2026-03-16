import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    FileText,
    DollarSign,
    Users,
    Gavel,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    BarChart2,
    Shield,
    ArrowUpRight,
    ChevronDown,
} from 'lucide-react'

// ============================================================================
// MOCK DATA — Replace with API calls
// ============================================================================

const STAT_CARDS = [
    { label: 'Total Cases', value: '247', sub: '89 active • 34 listed', growth: '+12%', icon: 'cases', color: 'indigo' },
    { label: 'Total Sales', value: 'A$15.8M', sub: 'Avg. A$105.5K per deal', growth: '+23%', icon: 'sales', color: 'green' },
    { label: 'Platform Users', value: '1,284', sub: '8 pending KYC', growth: '+18%', icon: 'users', color: 'purple' },
    { label: 'Active Auctions', value: '12', sub: 'Success rate: 94.2%', growth: '94.2%', icon: 'auctions', color: 'amber' },
]

const PLATFORM_STATUS = [
    { label: 'Live Auctions', value: 12, sub: 'Total Bids: 87  •  Avg: 7.2 bids/auction', color: 'indigo', icon: 'live' },
    { label: 'Pending Approvals', value: 8, sub: 'KYC: 8  •  Cases: 3  •  Contracts: 2', color: 'amber', icon: 'pending' },
    { label: 'Completed This Week', value: 24, sub: 'Sales: 5  •  Value: A$6.2M', color: 'green', icon: 'completed' },
    { label: 'Requires Attention', value: 3, sub: 'Disputes: 2  •  Escalations: 1', color: 'red', icon: 'attention' },
]

const RECENT_CASES = [
    { id: 'MIP-2024-047', status: 'LIVE', name: 'Bondi Beach Apartment', value: 'A$1,250,000', bids: 8, timeOrStatus: '2h 34m' },
    { id: 'MIP-2024-046', status: 'BUY NOW', name: 'Melbourne CBD Office', value: 'A$2,150,000', bids: 0, timeOrStatus: 'Buy Now' },
    { id: 'MIP-2024-045', status: 'SOLD', name: 'Sydney Warehouse', value: 'A$890,000', bids: 12, timeOrStatus: 'Sold' },
    { id: 'MIP-2024-044', status: 'LIVE', name: 'Brisbane Townhouse', value: 'A$675,000', bids: 5, timeOrStatus: '5h 12m' },
    { id: 'MIP-2024-043', status: null, name: 'Perth Retail Space', value: 'A$1,420,000', bids: 0, timeOrStatus: 'Pending' },
]

const RECENT_SALES = [
    { id: 'MIP-2024-042', name: 'Gold Coast Villa', buyer: 'Platinum Capital', price: 'A$1850K', growth: '+A$125K', time: '2h ago' },
    { id: 'MIP-2024-041', name: 'Adelaide Duplex', buyer: 'Urban Investors', price: 'A$720K', growth: '+A$52K', time: '4h ago' },
    { id: 'MIP-2024-040', name: 'Canberra Apartment', buyer: 'Capital Group', price: 'A$1100K', growth: '+A$95K', time: '1d ago' },
    { id: 'MIP-2024-039', name: 'Darwin Commercial', buyer: 'Northern Assets', price: 'A$980K', growth: '+A$60K', time: '1d ago' },
    { id: 'MIP-2024-038', name: 'Hobart Warehouse', buyer: 'Southern Property', price: 'A$1350K', growth: '+A$110K', time: '2d ago' },
]

const BAR_CHART_CASES = [
    { month: 'Aug', height: 35 }, { month: 'Sep', height: 45 }, { month: 'Oct', height: 50 },
    { month: 'Nov', height: 60 }, { month: 'Dec', height: 40 }, { month: 'Jan', height: 55 }, { month: 'Feb', height: 70 },
]

const BAR_CHART_SALES = [
    { month: 'Aug', height: 40 }, { month: 'Sep', height: 55 }, { month: 'Oct', height: 45 },
    { month: 'Nov', height: 70 }, { month: 'Dec', height: 35 }, { month: 'Jan', height: 60 }, { month: 'Feb', height: 65 },
]

const QUICK_ACTIONS = [
    { label: 'Review KYC', sub: '8 pending', route: '/admin/kyc-review', icon: 'kyc' },
    { label: 'Manage Cases', sub: '89 active', route: '/admin/case-management', icon: 'cases' },
    { label: 'View Reports', sub: 'Generate', route: '/admin/reports-analytics', icon: 'reports' },
    { label: 'Admin Console', sub: 'Full access', route: '/admin/admin-console', icon: 'admin' },
]

// ============================================================================
// SIMPLE BAR CHART COMPONENT
// ============================================================================

function SimpleBarChart({ data, barColor }) {
    return (
        <div className="mt-2">
            <div className="flex items-end gap-1 h-14 bg-gray-50 rounded px-2 pb-1 pt-2">
                {data.map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                        <div
                            className={`w-full rounded-sm ${barColor}`}
                            style={{ height: `${d.height}%` }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex gap-1 px-2 mt-1">
                {data.map((d) => (
                    <div key={d.month} className="flex-1 text-center text-[10px] text-gray-400">
                        {d.month}
                    </div>
                ))}
            </div>
        </div>
    )
}

import { adminService } from '../../api/dataService'

// ===================================
// MAIN DASHBOARD COMPONENT
// ===================================

export default function Dashboard() {
    const navigate = useNavigate()

    // State for API data
    const [stats, setStats] = useState(STAT_CARDS)
    const [platformStatus, setPlatformStatus] = useState(PLATFORM_STATUS)
    const [recentCases] = useState(RECENT_CASES)
    const [recentSales] = useState(RECENT_SALES)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                const [summaryRes, statsRes] = await Promise.all([
                    adminService.getDashboardSummary(),
                    adminService.getPlatformStats()
                ])

                if (summaryRes.success && statsRes.success) {
                  const summary = summaryRes.data;
                  const platform = statsRes.data;

                  // Map backend summary to STAT_CARDS format
                  const updatedStats = [
                    { 
                        label: 'Total Cases', 
                        value: platform.total_cases?.toString() || '0', 
                        sub: 'Active & Listed', 
                        growth: '+0%', 
                        icon: 'cases', 
                        color: 'indigo' 
                    },
                    { 
                        label: 'Total Sales', 
                        value: `A$${((platform.platform_revenue || 0) / 1000000).toFixed(1)}M`, 
                        sub: `Platform Revenue`, 
                        growth: '+0%', 
                        icon: 'sales', 
                        color: 'green' 
                    },
                    { 
                        label: 'Platform Users', 
                        value: platform.total_users?.toString() || '0', 
                        sub: `${summary.pending_kyc_reviews || 0} pending KYC`, 
                        growth: '+0%', 
                        icon: 'users', 
                        color: 'purple' 
                    },
                    { 
                        label: 'Active Auctions', 
                        value: (platform.total_investments || 0).toString(), 
                        sub: 'Live activity', 
                        growth: '0%', 
                        icon: 'auctions', 
                        color: 'amber' 
                    },
                  ]
                  setStats(updatedStats)

                  // Map backend summary to PLATFORM_STATUS format
                  const updatedPlatformStatus = [
                    { label: 'Live Auctions', value: platform.total_investments || 0, sub: 'Current active deals', color: 'indigo', icon: 'live' },
                    { label: 'Pending Approvals', value: (summary.pending_role_requests || 0) + (summary.pending_kyc_reviews || 0), sub: `KYC: ${summary.pending_kyc_reviews || 0} • Roles: ${summary.pending_role_requests || 0}`, color: 'amber', icon: 'pending' },
                    { label: 'Completed', value: 0, sub: 'Recent activities', color: 'green', icon: 'completed' },
                    { label: 'Attention', value: summary.suspended_users || 0, sub: 'Suspended user accounts', color: 'red', icon: 'attention' },
                  ]
                  setPlatformStatus(updatedPlatformStatus)
                } else {
                  setError(summaryRes.error || statsRes.error || "Failed to load dashboard data")
                }
            } catch (err) {
                console.error("Dashboard: Error fetching data", err)
                setError("An unexpected error occurred while loading dashboard")
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    // Icon mapping
    const getStatIcon = (iconType) => {
        switch (iconType) {
            case 'cases': return <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            case 'sales': return <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
            case 'users': return <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
            case 'auctions': return <Gavel className="w-5 h-5 text-amber-600 flex-shrink-0" />
            default: return null
        }
    }

    const getStatusIcon = (iconType) => {
        switch (iconType) {
            case 'live':
                return (
                    <span className="relative flex h-3 w-3 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )
            case 'pending': return <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            case 'attention': return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            default: return null
        }
    }

    const getQuickActionIcon = (iconType) => {
        switch (iconType) {
            case 'kyc': return <Users className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            case 'cases': return <BarChart2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            case 'reports': return <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            case 'admin': return <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            default: return null
        }
    }

    // Status badge styles
    const statusBadgeClass = {
        'LIVE': 'bg-red-500 text-white',
        'BUY NOW': 'bg-green-500 text-white',
        'SOLD': 'bg-gray-400 text-white',
    }

    // Platform status color map
    const statusColorMap = {
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-600' },
        green: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-600' },
        red: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-600' },
    }

    return (
        <div className="space-y-6">
            {/* ========== SECTION 1: Page Header ========== */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Platform administration and compliance management</p>
            </div>

            {/* ========== SECTION 2: Stat Cards ========== */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {stats.map((card, idx) => {
                    // Map color names to actual Tailwind classes
                    const iconBgClass = {
                        'indigo': 'bg-indigo-100',
                        'green': 'bg-green-100',
                        'purple': 'bg-purple-100',
                        'amber': 'bg-amber-100',
                    }[card.color] || 'bg-gray-100'

                    return (
                        <div key={idx} className="bg-white rounded-lg border border-gray-200 p-5">
                            {/* Top row: icon + growth badge */}
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-9 h-9 rounded-lg ${iconBgClass} flex items-center justify-center`}>
                                    {getStatIcon(card.icon)}
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    {card.icon !== 'auctions' && <TrendingUp className="w-3 h-3 flex-shrink-0" />}
                                    {card.growth}
                                </span>
                            </div>
                            {/* Label */}
                            <p className="text-sm text-gray-500 mt-3">{card.label}</p>
                            {/* Value */}
                            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                            {/* Sub */}
                            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                        </div>
                    )
                })}
            </div>

            {/* ========== SECTION 3: Monthly Overview + Platform Status ========== */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Left: Monthly Overview */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">Monthly Overview</h2>
                        <div className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 flex items-center gap-1 cursor-pointer">
                            Last 7 Months
                            <ChevronDown className="w-3 h-3 flex-shrink-0" />
                        </div>
                    </div>

                    {/* Cases Created */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Cases Created</span>
                            <span className="text-sm font-semibold text-indigo-600">38</span>
                        </div>
                        <SimpleBarChart data={BAR_CHART_CASES} barColor="bg-indigo-400" />
                    </div>

                    {/* Sales Volume */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Sales Volume</span>
                            <span className="text-sm font-semibold text-green-600">A$5.9M</span>
                        </div>
                        <SimpleBarChart data={BAR_CHART_SALES} barColor="bg-green-400" />
                    </div>
                </div>

                {/* Right: Platform Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Platform Status</h2>

                    {platformStatus.map((status, idx) => {
                        const colors = statusColorMap[status.color]
                        return (
                            <div key={idx} className={`${colors.bg} border-l-4 ${colors.border} rounded-lg p-3 mb-3 last:mb-0`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(status.icon)}
                                        <span className="text-sm font-medium text-gray-800">{status.label}</span>
                                    </div>
                                    <span className={`text-xl font-bold ${colors.text}`}>{status.value}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-6">{status.sub}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ========== SECTION 4: Recent Cases + Recent Sales ========== */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Left: Recent Cases */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">Recent Cases</h2>
                        <Link to="/admin/case-management" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                            View All
                            <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                        </Link>
                    </div>

                    {/* Case rows */}
                    <div>
                        {recentCases.map((caseItem, idx) => (
                            <div key={idx} className="py-3 border-b border-gray-100 last:border-0">
                                {/* Top line */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{caseItem.id}</span>
                                        {caseItem.status && (
                                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${statusBadgeClass[caseItem.status]}`}>
                                                {caseItem.status}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500">{caseItem.bids} bids</span>
                                        <span className="text-xs text-gray-400 block">{caseItem.timeOrStatus}</span>
                                    </div>
                                </div>
                                {/* Middle: property name */}
                                <p className="text-sm font-semibold text-gray-900 mt-1">{caseItem.name}</p>
                                {/* Bottom: value */}
                                <p className="text-xs text-gray-500">{caseItem.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Recent Sales */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">Recent Sales</h2>
                        <Link to="/admin/reports-analytics" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                            View Reports
                            <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                        </Link>
                    </div>

                    {/* Sale rows */}
                    <div>
                        {recentSales.map((sale, idx) => (
                            <div key={idx} className="py-3 border-b border-gray-100 last:border-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">{sale.id}</span>
                                            <span className="text-xs font-medium bg-gray-400 text-white px-1.5 py-0.5 rounded">SOLD</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{sale.name}</p>
                                        <p className="text-xs text-gray-500">{sale.buyer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">{sale.price}</p>
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-0.5 justify-end">
                                            <TrendingUp className="w-3 h-3 flex-shrink-0" />
                                            {sale.growth}
                                        </p>
                                        <p className="text-xs text-gray-400">{sale.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== SECTION 5: Quick Actions ========== */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>

                <div className="grid grid-cols-4 gap-4">
                    {QUICK_ACTIONS.map((action, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(action.route)}
                            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-indigo-200 cursor-pointer transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                {getQuickActionIcon(action.icon)}
                            </div>
                            <p className="text-sm font-medium text-gray-900 mt-2">{action.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{action.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
