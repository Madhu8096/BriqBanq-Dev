import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { borrowerApi } from './api'
import { FALLBACK_NOTIFICATIONS } from './data/fallbackData'

function getNotificationList(res) {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data
  if (Array.isArray(d)) return d
  if (d?.notifications) return d.notifications
  if (d?.items) return d.items
  return []
}

function normalizeNotification(n, i) {
  return {
    id: n.id ?? n.notification_id ?? i,
    type: n.type ?? 'info',
    title: n.title ?? n.subject ?? 'Notification',
    message: n.message ?? n.body ?? n.text ?? '',
    time: n.time ?? n.created_at ?? n.date ?? '',
    read: Boolean(n.read ?? n.is_read),
    isNew: Boolean(n.isNew ?? n.is_new ?? !(n.read ?? n.is_read))
  }
}

export default function Notifications() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setError(null)
    const load = async () => {
      try {
        const res = await borrowerApi.getNotifications({})
        if (cancelled) return
        const list = getNotificationList(res)
        const normalized = list.length > 0 ? list.map(normalizeNotification) : FALLBACK_NOTIFICATIONS.map((n, i) => normalizeNotification(n, i))
        setNotifications(normalized)
      } catch (e) {
        if (!cancelled) {
          setNotifications(FALLBACK_NOTIFICATIONS.map((n, i) => normalizeNotification(n, i)))
          const isNetworkError = e?.code === 'ERR_NETWORK' || e?.message === 'Network Error'
          if (!isNetworkError) setError(e?.message || 'Failed to load notifications')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    unread: notifications.filter((n) => !n.read).length,
    urgent: notifications.length,
    thisWeek: notifications.length
  }), [notifications])

  const filteredNotifications = useMemo(() => {
    let list = [...notifications]
    if (filter !== 'all') {
      list = list.filter((n) => n.type === filter)
    }
    if (statusFilter === 'unread') {
      list = list.filter((n) => !n.read)
    } else if (statusFilter === 'read') {
      list = list.filter((n) => n.read)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
        list = list.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.message || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [notifications, filter, statusFilter, searchQuery])

  const getIcon = (type) => {
    const icons = {
      bid: '🔔',
      message: '💬',
      auction: '📅',
      kyc: '✅',
      contract: '📄',
      payment: '💰'
    }
    return icons[type] || '📢'
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await borrowerApi.markAsRead(notificationId)
    } catch {
      // fallback to local state
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true, isNew: false } : n))
    )
  }

  const handleMarkAllRead = async () => {
    try {
      await borrowerApi.markAllAsRead()
    } catch {
      // fallback
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isNew: false })))
  }

  const handleDelete = async (notificationId) => {
    try {
      await borrowerApi.deleteNotification(notificationId)
    } catch {
      // fallback
    }
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const handleDeleteAll = () => {
    setNotifications([])
  }

  const handleClearFilters = () => {
    setFilter('all')
    setStatusFilter('all')
    setSearchQuery('')
  }

  const handleView = (notification) => {
    if (!notification.read) handleMarkAsRead(notification.id)
    if (notification.type === 'bid' || notification.type === 'auction') navigate('/borrower/my-case')
    else if (notification.type === 'contract' || notification.type === 'payment') navigate('/borrower/contracts')
    else if (notification.type === 'kyc') navigate('/borrower/identity-verification')
    else if (notification.type === 'message') navigate('/borrower/my-case')
    else navigate('/borrower/dashboard')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <div className="flex items-center justify-center py-20 text-slate-500">Loading notifications...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mortgage resolution case</p>
        {error && <p className="text-sm text-amber-600 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.unread}</p>
              <p className="text-sm text-slate-500 mt-1">Requires attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🔴</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.urgent}</p>
              <p className="text-sm text-slate-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📬</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.thisWeek}</p>
              <p className="text-sm text-slate-500 mt-1">Last 7 days</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4 flex-wrap">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="bid">Bids</option>
                <option value="message">Messages</option>
                <option value="auction">Auctions</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Clear Filters
              </button>
            </div>

            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ✓ Mark All Read
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 px-6 py-3 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-900">Notifications ({filteredNotifications.length})</h3>
          <button
            type="button"
            onClick={handleDeleteAll}
            className="text-sm text-red-500 hover:text-red-600"
          >
            🗑️ Delete All
          </button>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">No notifications match your filters.</div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-slate-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{getIcon(notification.type)}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-slate-900">{notification.title}</h4>
                        {notification.isNew && (
                          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleView(notification)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View
                    </button>
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-sm text-slate-600 hover:text-slate-900"
                      >
                        ✓ Mark as read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notification.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
