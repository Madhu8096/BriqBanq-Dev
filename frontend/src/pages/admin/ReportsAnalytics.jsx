import { useState } from 'react'
import AdminBreadcrumb from '../../components/admin/AdminBreadcrumb'
import AdminStatCard from '../../components/admin/AdminStatCard'

export default function ReportsAnalytics() {
    const [period, setPeriod] = useState('Last 30 Days')

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb items={[
                { label: 'Dashboard', path: '/admin/dashboard' },
                { label: 'Reports & Analytics' }
            ]} />

            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Comprehensive platform insights and performance metrics</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                    </select>
                    <button className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-6 gap-4">
                <AdminStatCard
                    label="Total Cases"
                    value="47"
                    growth="+12%"
                    icon="📋"
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="Active Cases"
                    value="23"
                    icon="⚡"
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="Total Revenue"
                    value="A$12.4M"
                    growth="+18%"
                    icon="$"
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                />
                <AdminStatCard
                    label="Avg Case Value"
                    value="A$1050K"
                    icon="💰"
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                />
                <AdminStatCard
                    label="Total Bids"
                    value="156"
                    icon="🔨"
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                />
                <AdminStatCard
                    label="Success Rate"
                    value="68%"
                    growth="+5%"
                    icon="✓"
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
            </div>

            {/* Report Export Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Financial Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl text-green-600">$</span>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Financial Summary</h3>
                            <p className="text-sm text-gray-500">Revenue, payments, and transaction analysis</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export PDF</span>
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* Case Performance */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl text-blue-600">📄</span>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Case Performance</h3>
                            <p className="text-sm text-gray-500">Case volume, status breakdown, and trends</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export PDF</span>
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* User Activity */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl text-purple-600">👥</span>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">User Activity</h3>
                            <p className="text-sm text-gray-500">User engagement, registrations, and KYC</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export PDF</span>
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* Auction Analytics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl text-red-600">📊</span>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Auction Analytics</h3>
                            <p className="text-sm text-gray-500">Bidding activity, win rates, and pricing</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export PDF</span>
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                            <span>⬇</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Placeholders */}
            <div className="grid grid-cols-2 gap-4">
                {/* Case Volume Trend */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Case Volume Trend</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700">View Details ↗</button>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl mb-2">📊</span>
                        <p className="text-sm">Interactive chart would display here</p>
                        <p className="text-xs">Showing case volume over time</p>
                    </div>
                </div>

                {/* Revenue Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Revenue Distribution</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700">View Details ↗</button>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl mb-2">🥧</span>
                        <p className="text-sm">Interactive chart would display here</p>
                        <p className="text-xs">Showing revenue by category</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Recent Platform Activity</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700">View All ↗</button>
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">📋</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">New case created</span> — MIP-2024-012 by Sarah Mitchell
                            </p>
                            <p className="text-xs text-gray-500">5 minutes ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
