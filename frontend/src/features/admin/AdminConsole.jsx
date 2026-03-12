import { useState } from 'react'
import AdminStatCard from '../../components/admin/AdminStatCard'
import AdminBadge from '../../components/admin/AdminBadge'
import { MOCK_TASKS } from '../../data/mockData'

const tabs = ['Tasks', 'KYC Review', 'Disputes', 'Fee Configuration', 'Audit Logs']

export default function AdminConsole() {
    const [activeTab, setActiveTab] = useState('Tasks')

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4">
                <AdminStatCard
                    label="Pending KYC"
                    value="7"
                    icon="👥"
                    iconBg="bg-indigo-100"
                    iconColor="text-indigo-600"
                />
                <AdminStatCard
                    label="Active Disputes"
                    value="2"
                    icon="⚠"
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                />
                <AdminStatCard
                    label="Platform Users"
                    value="146"
                    growth="+23%"
                    icon="📈"
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="Monthly Volume"
                    value="$12.5M"
                    growth="+15%"
                    icon="$"
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === tab
                                    ? 'text-gray-900 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-3 gap-4">
                {/* Urgent Column */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-red-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-red-500">⊘</span>
                            <span className="text-sm font-semibold text-gray-900">Urgent</span>
                        </div>
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                            {MOCK_TASKS.urgent.length} tasks
                        </span>
                    </div>
                    <div className="p-3 space-y-2">
                        {MOCK_TASKS.urgent.map((task) => (
                            <div key={task.id} className="bg-white border border-gray-200 rounded p-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-300 text-sm">⋮⋮</span>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                                            <AdminBadge label={task.badge} variant="urgent" />
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">{task.desc}</p>
                                        <p className="text-xs text-gray-400">Due: {task.due}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button className="text-xs text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded">
                                                Review
                                            </button>
                                            <button className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded">
                                                Complete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-amber-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-amber-500">⏱</span>
                            <span className="text-sm font-semibold text-gray-900">In Progress</span>
                        </div>
                        <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                            {MOCK_TASKS.inProgress.length} tasks
                        </span>
                    </div>
                    <div className="p-3 space-y-2">
                        {MOCK_TASKS.inProgress.map((task) => (
                            <div key={task.id} className="bg-white border border-gray-200 rounded p-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-300 text-sm">⋮⋮</span>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                                            <AdminBadge
                                                label={task.badge}
                                                variant={task.badge.toLowerCase()}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">{task.desc}</p>
                                        <p className="text-xs text-gray-400">Due: {task.due}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button className="text-xs text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded">
                                                Review
                                            </button>
                                            <button className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded">
                                                Complete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Completed Column */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-green-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-sm font-semibold text-gray-900">Completed</span>
                        </div>
                        <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                            {MOCK_TASKS.completed.length} tasks
                        </span>
                    </div>
                    <div className="p-3 space-y-2">
                        {MOCK_TASKS.completed.map((task) => (
                            <div key={task.id} className="bg-white border border-gray-200 rounded p-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-300 text-sm">⋮⋮</span>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                                            <AdminBadge label={task.badge} variant="done" />
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">{task.desc}</p>
                                        <p className="text-xs text-gray-400">Due: {task.due}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
