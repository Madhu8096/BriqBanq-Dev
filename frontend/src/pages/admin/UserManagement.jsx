import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users, UserPlus, Search, Filter, MoreVertical,
    Edit, Ban, Trash2, CheckCircle2, XCircle, Clock,
    ChevronUp, ChevronDown, Home, ChevronRight
} from 'lucide-react'

export default function UserManagement() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')

    const users = [
        { id: 1, name: 'Admin User', email: 'admin@grow.com', role: 'Super Admin', modules: ['brickbanq', 'grow accounting', 'pfa', 'grow hq'], status: 'Active', lastLogin: '2024-02-13 14:23', avatar: 'AU' },
        { id: 2, name: 'Emily Davis', email: 'emily.davis@corp.com', role: 'Viewer', modules: ['grow accounting'], status: 'Active', lastLogin: '2024-02-13 11:20', avatar: 'ED' },
        { id: 3, name: 'John Smith', email: 'john.smith@example.com', role: 'User', modules: ['brickbanq'], status: 'Active', lastLogin: '2024-02-13 12:15', avatar: 'JS' },
        { id: 4, name: 'Michael Brown', email: 'mbrown@business.com', role: 'User', modules: ['brickbanq', 'grow accounting'], status: 'Inactive', lastLogin: '2024-01-28 09:30', avatar: 'MB' },
        { id: 5, name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Admin', modules: ['grow accounting'], status: 'Active', lastLogin: '2024-02-12 16:45', avatar: 'SJ' }
    ]

    const stats = [
        { label: 'Total Users', value: '5', sub: 'Across all modules', icon: Users, color: 'text-gray-400', bg: 'bg-white' },
        { label: 'Active Users', value: '4', sub: '80% of total', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-white' },
        { label: 'Administrators', value: '2', sub: 'With elevated access', icon: Shield, color: 'text-indigo-600', bg: 'bg-white' },
        { label: 'Suspended', value: '0', sub: 'Requires review', icon: XCircle, color: 'text-red-500', bg: 'bg-white' }
    ]

    return (
        <div className="space-y-8 max-w-7xl pb-20">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">Platform administration and compliance management</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <UserPlus className="w-4 h-4" />
                    Add User
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
                <span className="text-indigo-600">User Management</span>
            </nav>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">
                            <span className={stat.color}>{stat.sub.split(' ')[0]}</span> {stat.sub.split(' ').slice(1).join(' ')}
                        </p>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-6 border-b border-gray-50 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort by:</span>
                                <select className="bg-transparent text-xs font-bold text-gray-900 focus:outline-none">
                                    <option>Name</option>
                                    <option>Role</option>
                                    <option>Status</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-gray-100 transition-all">
                                <ChevronUp className="w-3.5 h-3.5" />
                                Ascending
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50">
                            <Filter className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Filters</span>
                        </div>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Show Filters</button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Modules</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Login</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/30 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-black border border-indigo-100/50">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{user.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold tracking-tight lowercase">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm
                                            ${user.role === 'Super Admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                                user.role === 'Admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                    user.role === 'Viewer' ? 'bg-gray-50 text-gray-500 border border-gray-100' :
                                                        'bg-emerald-50 text-emerald-600 border border-emerald-100'}
                                        `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                            {user.modules.map((mod, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-black rounded uppercase tracking-tighter border border-gray-100">
                                                    {mod}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.status === 'Active' ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            ) : (
                                                <Clock className="w-3.5 h-3.5 text-gray-300" />
                                            )}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                                            <Clock className="w-3 h-3 text-gray-300" />
                                            {user.lastLogin}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Ban className="w-4 h-4" />
                                            </button>
                                            {user.role !== 'Super Admin' && (
                                                <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

import { Shield } from 'lucide-react'
