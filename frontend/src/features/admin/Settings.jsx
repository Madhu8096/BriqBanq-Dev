import { User, Building2, Shield, Bell, Users, Lock, Folder, BarChart2, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
    const navigate = useNavigate()
    const settingCards = [
        {
            icon: User,
            title: 'Profile Settings',
            description: 'Update your personal information and contact details',
            buttonText: 'Edit Profile',
            onClick: () => navigate('/admin/settings/profile')
        },
        {
            icon: Building2,
            title: 'Organization',
            description: 'Manage organization details and team members',
            buttonText: 'Manage Organization',
            onClick: () => navigate('/admin/settings/organization')
        },
        {
            icon: Shield,
            title: 'Security',
            description: 'Password, 2FA, and security preferences',
            buttonText: 'Security Settings',
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Configure email and platform notifications',
            buttonText: 'Notification Settings',
            onClick: () => navigate('/admin/settings/notifications')
        },
        {
            icon: Users,
            title: 'User Management',
            description: 'Manage users and their roles',
            buttonText: 'User Management',
            onClick: () => navigate('/admin/settings/users')
        },
        {
            icon: Lock,
            title: 'Access Control',
            description: 'Configure access permissions',
            buttonText: 'Access Control',
            onClick: () => navigate('/admin/settings/access-control')
        },
        {
            icon: Folder,
            title: 'Module Settings',
            description: 'Configure module-specific settings',
            buttonText: 'Module Settings',
            onClick: () => navigate('/admin/settings/modules')
        },
        {
            icon: BarChart2,
            title: 'Integration Architecture',
            description: 'View how platform modules integrate together',
            buttonText: 'View Architecture',
            onClick: () => navigate('/admin/integration-architecture')
        },
        {
            icon: Share2,
            title: 'Integrations Hub',
            description: 'Manage and configure integrations',
            buttonText: 'Manage Integrations',
            onClick: () => navigate('/admin/integrations')
        },
    ]

    return (
        <div className="space-y-8 max-w-7xl">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-base text-gray-500 mt-2">Platform administration and compliance management</p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingCards.map((card, index) => {
                    const Icon = card.icon
                    return (
                        <div key={index} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{card.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{card.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={card.onClick}
                                className="inline-flex items-center px-5 py-2.5 border border-gray-200 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                {card.buttonText}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
