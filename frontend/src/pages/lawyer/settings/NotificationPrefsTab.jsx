import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_NOTIFICATION_PREFERENCES } from '../data/mockLawyer'

export default function NotificationPrefsTab() {
  const [prefs, setPrefs] = useState(MOCK_NOTIFICATION_PREFERENCES)
  const [saving, setSaving] = useState(false)

  const toggle = (category, key) => {
    setPrefs((prev) => ({
      ...prev,
      [category]: prev[category].map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)),
    }))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 800)
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">
        <Link to="/lawyer/dashboard" className="hover:text-slate-700">Dashboard</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/lawyer/settings" className="hover:text-slate-700">Settings</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-900">Notifications</span>
      </nav>

      <div className="space-y-8">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">📧 Email Notifications</h3>
          <p className="text-sm text-slate-500 mb-4">Manage which emails you receive from us.</p>
          <ul className="space-y-4">
            {prefs.email.map((p) => (
              <li key={p.key} className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-900">{p.label}</p>
                  <p className="text-sm text-slate-500">{p.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={p.enabled}
                  onClick={() => toggle('email', p.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    p.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      p.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">🔔 Push Notifications</h3>
          <p className="text-sm text-slate-500 mb-4">In-app and browser notifications.</p>
          <ul className="space-y-4">
            {prefs.push.map((p) => (
              <li key={p.key} className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-900">{p.label}</p>
                  <p className="text-sm text-slate-500">{p.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={p.enabled}
                  onClick={() => toggle('push', p.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    p.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      p.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">💬 SMS Notifications</h3>
          <p className="text-sm text-slate-500 mb-4">Text message alerts to your phone.</p>
          <ul className="space-y-4">
            {prefs.sms.map((p) => (
              <li key={p.key} className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-900">{p.label}</p>
                  <p className="text-sm text-slate-500">{p.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={p.enabled}
                  onClick={() => toggle('sms', p.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    p.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      p.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg flex items-start gap-2">
            <span className="text-amber-500">⚠</span>
            <p className="text-sm text-amber-800">Note: Standard SMS rates may apply. We recommend enabling SMS only for critical alerts.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => {}} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
          Cancel
        </button>
        <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}
