import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Shield, Lock, Users, Key, Plus, ChevronRight, Home,
    Search, Edit, Trash2, MoreVertical,
    CheckCircle2, AlertTriangle, Eye
} from 'lucide-react'

export default function AccessControl() {
    const navigate = useNavigate()
    const [selectedRole, setSelectedRole] = useState(null)

    const roles = [
        { id: 1, name: 'Super Administrator', users: 2, description: 'Full access to all modules and features', permissions: 27 },
        { id: 2, name: 'Brickbanq Administrator', users: 5, description: 'Full access to Brickbanq module', permissions: 12 },
        { id: 3, name: 'Investor', users: 847, description: 'Can view and bid on deals', permissions: 6 },
        { id: 4, name: 'Accountant', users: 12, description: 'Full access to Grow Accounting', permissions: 11 },
        { id: 5, name: 'Financial Advisor', users: 45, description: 'Access to PFA module', permissions: 4 }
    ]

    const stats = [
        { label: 'Total Roles', value: '5', sub: 'Active role configurations', icon: Shield, color: 'text-indigo-600' },
        { label: 'Total Permissions', value: '27', sub: 'Across all modules', icon: Lock, color: 'text-indigo-600' },
        { label: 'Users Assigned', value: '911', sub: 'With role assignments', icon: Users, color: 'text-emerald-500' }
    ]

    return (
        <div className="space-y-8 max-w-7xl pb-20">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Access Control</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">Platform administration and compliance management</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Shield className="w-4 h-4" />
                    Create Role
                </button>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                <Home className="w-3.5 h-3.5" />
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate('/admin/dashboard')} className="hover:text-gray-900 transition-colors">Dashboard</button>
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate('/admin/settings')} className="hover:text-gray-900 transition-colors">Settings</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-indigo-600">Access Control</span>
            </nav>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Roles List */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Roles</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={`w-full p-6 text-left hover:bg-gray-50/50 transition-all group relative
                                    ${selectedRole?.id === role.id ? 'bg-indigo-50/30' : ''}
                                `}
                            >
                                {selectedRole?.id === role.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-600 rounded-r-lg" />
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className={`text-sm font-black transition-colors ${selectedRole?.id === role.id ? 'text-indigo-600' : 'text-gray-900'}`}>
                                        {role.name}
                                    </h4>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-400 text-[9px] font-black rounded uppercase tracking-tighter">
                                        {role.users}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-1 mb-2">
                                    {role.description}
                                </p>
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                    {role.permissions} permissions
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions Management Area */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[600px] flex flex-col items-center justify-center text-center p-8">
                    {selectedRole ? (
                        <div className="w-full text-left self-start h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedRole.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">{selectedRole.description}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-xl transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                                {/* Placeholder for permissions list */}
                                <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 tracking-tight mb-2">Configure Role Permissions</h4>
                                    <p className="text-sm text-gray-500 font-medium mb-8 max-w-sm">
                                        Manage granular access controls for {selectedRole.name} across all platform modules.
                                    </p>
                                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                                        Open Permission Matrix
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-md">
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-8 mx-auto ring-8 ring-gray-100/50">
                                <Shield className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-200 tracking-tight mb-4">Select a role</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                Choose a role from the left sidebar to view and manage assigned permissions and user access.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
