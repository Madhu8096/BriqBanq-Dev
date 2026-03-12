import { Link } from 'react-router-dom'

const SETTINGS_CARDS = [
  { icon: '👤', title: 'Profile Settings', description: 'Update your personal information and contact details', buttonText: 'Edit Profile', to: '/borrower/settings/profile' },
  { icon: '🏢', title: 'Organization', description: 'Manage organization details and team members', buttonText: 'Manage Organization', to: '/borrower/settings/organization' },
  { icon: '🔒', title: 'Security', description: 'Password, 2FA, and security preferences', buttonText: 'Security Settings', to: '/borrower/settings/security' },
  { icon: '🔔', title: 'Notifications', description: 'Configure email and platform notifications', buttonText: 'Notification Settings', to: '/borrower/settings/notifications' },
  { icon: '👥', title: 'User Management', description: 'Manage users and their roles', buttonText: 'User Management', to: '/borrower/settings/user-management' },
  { icon: '🛡️', title: 'Access Control', description: 'Configure access permissions', buttonText: 'Access Control', to: '/borrower/settings/access-control' },
  { icon: '📦', title: 'Module Settings', description: 'Configure module-specific settings', buttonText: 'Module Settings', to: '/borrower/settings/module-settings' },
  { icon: '🔗', title: 'Integrations Hub', description: 'Manage and configure integrations', buttonText: 'Manage Integrations', to: '/borrower/settings/integrations' },
  { icon: '🏗️', title: 'Integration Architecture', description: 'View API layer, services, and backend integration flow', buttonText: 'View Architecture', to: '/borrower/settings/integration-architecture' },
]

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mortgage resolution case</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SETTINGS_CARDS.map((card) => (
          <div key={card.to} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">{card.description}</p>
                <Link
                  to={card.to}
                  className="inline-block border border-slate-300 bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded hover:bg-slate-50"
                >
                  {card.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
