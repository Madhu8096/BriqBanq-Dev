import { useState } from 'react'
import { Bell, Mail, MessageSquare, CheckCircle, Eye, Trash2 } from 'lucide-react'
import AdminStatCard from '../../components/admin/AdminStatCard'
import AdminBadge from '../../components/admin/AdminBadge'
import { MOCK_NOTIFICATIONS } from '../../data/mockData'

export default function Notifications() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('All Types')
    const [statusFilter, setStatusFilter] = useState('All Status')

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const deleteAll = () => {
        if (confirm('Are you sure you want to delete all notifications?')) {
            setNotifications([])
        }
    }

    const getNotificationIcon = (type) => {
        const icons = {
            bid: Bell,
            message: MessageSquare,
            auction: Mail,
            kyc: CheckCircle,
            contract: Mail,
            payment: Mail,
        }
        return icons[type] || Bell
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
                <AdminStatCard
                    label="Unread"
                    value={unreadCount.toString()}
                    icon={Bell}
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
                <AdminStatCard
                    label="Total Notifications"
                    value={notifications.length.toString()}
                    icon={Mail}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="This Week"
                    value="7"
                    icon={MessageSquare}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
            </div>

            {/* Filter Bar */}
            <div className="flex gap-3 flex-wrap">
                <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-[200px] border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option>All Types</option>
                    <option>Bids</option>
                    <option>Messages</option>
                    <option>Auctions</option>
                    <option>KYC</option>
                    <option>Contracts</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option>All Status</option>
                    <option>Unread</option>
                    <option>Read</option>
                </select>
                <button className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50">
                    Clear Filters
                </button>
                <button
                    onClick={markAllAsRead}
                    className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50"
                >
                    <CheckCircle className="w-4 h-4 inline-block mr-1 flex-shrink-0" /> Mark All Read
                </button>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Notifications ({notifications.length})</h2>
                    <button
                        onClick={deleteAll}
                        className="text-sm text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4 inline-block mr-1 flex-shrink-0" /> Delete All
                    </button>
                </div>

                <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`px-6 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    {(() => {
                                        const Icon = getNotificationIcon(notification.type)
                                        return <Icon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                    })()}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2 mb-1">
                                        <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                        {!notification.read && (
                                            <AdminBadge label="New" variant="new" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                                    <p className="text-xs text-gray-500">· {notification.time}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button className="text-sm border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5 flex-shrink-0" /> View
                                    </button>
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-sm border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 inline-block mr-1 flex-shrink-0" /> Mark as read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-sm text-red-500 hover:text-red-600 px-2 py-1"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 inline-block mr-1 flex-shrink-0" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
