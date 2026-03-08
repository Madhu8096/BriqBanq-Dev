// src/pages/admin/case-details/Settlement.jsx
import { useState } from 'react'
import { useCaseContext } from '../../../context/CaseContext'
import {
    CheckCircle2, Clock, AlertTriangle, Upload,
    Send, Eye, Download, FileText, ShieldCheck, Zap,
    Building2, LayoutDashboard, Search, MoreHorizontal,
    ArrowUpRight, Shell
} from 'lucide-react'

export default function Settlement() {
    const { caseData } = useCaseContext()
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Sarah Mitchell', role: 'Authorized Conveyancer', time: '10:45 AM', text: 'Settlement confirmed for execution on March 15th. All deeds verified.' },
        { id: 2, type: 'system', time: 'Tue, Feb 18 - 12:00 PM', text: 'PROTOCOL SYNC: Final liquidation authorization received.' },
        { id: 3, sender: 'Lender', role: 'CBA Senior Rep', time: 'Tue, Feb 18 - 2:45 PM', text: 'Discharge authority fully executed and uploaded to secure vault.' }
    ])
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = () => {
        if (!newMessage.trim()) return
        setMessages([...messages, {
            id: Date.now(),
            sender: 'David Williams',
            role: 'Lead Strategist',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: newMessage,
            isAdmin: true
        }])
        setNewMessage('')
    }

    return (
        <div className="space-y-8 sm:space-y-12 pb-24">
            {/* Expansive Operational Command */}
            <div className="bg-[#12141D] rounded-[2rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 w-full">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl border border-white/10 group group-hover:rotate-12 transition-transform">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Shell className="w-4 h-4 text-indigo-400" />
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Settlement Infrastructure</p>
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">{caseData.property.address}</h3>
                            <div className="flex items-center gap-6 mt-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Global Progress</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${caseData.settlement.estimatedProgress}%` }} />
                                        </div>
                                        <span className="text-lg font-black text-indigo-400">{caseData.settlement.estimatedProgress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                        <button className="flex-1 xl:flex-none px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500">
                            View Deeds
                        </button>
                        <button className="flex-1 xl:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                            <Zap className="w-4 h-4 fill-white" />
                            Finalize Settlement Protocol
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-12 w-full">
                {/* Communication Workspace */}
                <div className="xl:col-span-12 space-y-8">
                    <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-white flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Operational Readiness</h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Verified execution items and risk parameters</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-colors">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/30 border-b border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="px-12 py-6">Target Component</th>
                                        <th className="px-12 py-6">Responsible Body</th>
                                        <th className="px-12 py-6">Auth Status</th>
                                        <th className="px-12 py-6 text-right">Repository</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {caseData.settlement.checklist.map((item) => (
                                        <tr key={item.id} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-3 h-3 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.1)] ${item.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    <span className="text-base font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">{item.item}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">{item.responsible.split(' ').map(n => n[0]).join('')}</div>
                                                    <span className="text-xs text-gray-400 font-black uppercase tracking-widest">{item.responsible}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm
                                                    ${item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}
                                                `}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <button className="px-6 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 hover:shadow-xl transition-all">
                                                    Open Vault
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Integrated Status Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { label: 'Critical Variance', value: 'Title Transfer Docs', sub: 'Action Required', color: 'red', icon: AlertTriangle },
                            { label: 'Pending Signature', value: 'Signed Loan Deed', sub: 'ETA: 24 Hours', color: 'amber', icon: Clock },
                            { label: 'Verified Auth', value: 'Discharge Order', sub: 'Lead Verified', color: 'emerald', icon: ShieldCheck }
                        ].map((stat, i) => (
                            <div key={i} className={`p-6 sm:p-8 bg-white border border-gray-100 rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-700`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 border border-${stat.color}-100`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-[10px] font-black text-${stat.color}-500 uppercase tracking-[0.2em]`}>{stat.label}</p>
                                    <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none pt-1">{stat.value}</h4>
                                    <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest pt-3">{stat.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Secure Communication Hub */}
                <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[750px] sticky top-8">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Settlement Ops</h3>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Bridge
                                </p>
                            </div>
                        </div>
                        <button className="text-[10px] font-black text-gray-300 hover:text-indigo-600 uppercase tracking-widest transition-colors">Audit Detail</button>
                    </div>

                    <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-gray-50/20 scroll-smooth">
                        {messages.map((msg, index) => (
                            <div key={msg.id} className={`space-y-4 ${msg.isAdmin ? 'text-right' : ''}`}>
                                {msg.type === 'system' ? (
                                    <div className="flex justify-center flex-col items-center gap-4">
                                        <div className="w-[1px] h-8 bg-gray-100" />
                                        <span className="px-6 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.4em] shadow-lg">
                                            {msg.text}
                                        </span>
                                    </div>
                                ) : (
                                    <div className={`inline-block max-w-[90%] text-left`}>
                                        <div className={`flex items-center gap-3 mb-2 ${msg.isAdmin ? 'flex-row-reverse text-right' : ''}`}>
                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{msg.sender}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{msg.time}</span>
                                        </div>
                                        <div className={`px-8 py-6 rounded-[2.25rem] text-sm font-medium leading-relaxed shadow-xl
                                            ${msg.isAdmin ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-gray-50'}
                                        `}>
                                            {msg.text}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-10 bg-white/80 backdrop-blur-xl border-t border-gray-50">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Broadcast tactical update..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="w-full pl-8 pr-16 py-6 bg-gray-50/50 border border-gray-100 rounded-[2.25rem] text-[11px] font-black uppercase tracking-widest placeholder:text-gray-300 focus:bg-white focus:outline-none focus:ring-8 focus:ring-indigo-50/30 transition-all duration-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="absolute right-3 top-2.5 w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all duration-500 shadow-2xl"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Milestone Centerpiece */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-sm overflow-hidden relative">
                <div className="flex flex-col items-center gap-3 mb-16">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Global Case Tempo</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight text-center uppercase">Principal Milestones</h3>
                    <div className="w-16 h-1 bg-indigo-600 rounded-full mt-2" />
                </div>

                <div className="flex flex-col xl:flex-row items-center justify-between relative gap-16 xl:gap-0">
                    <div className="absolute left-1/2 -translate-x-1/2 xl:left-20 xl:right-20 xl:top-20 xl:translate-x-0 h-full w-[2px] xl:h-[2px] xl:w-auto bg-gray-50" />
                    <div className="absolute left-1/2 -translate-x-1/2 xl:left-20 xl:top-20 xl:translate-x-0 h-[40%] w-[2px] xl:h-[2px] xl:w-[40%] bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-[2000ms] ease-out" />

                    {caseData.settlement.timeline.map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-6 group">
                            <div className={`w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white transition-all duration-500 transform group-hover:scale-110
                                ${step.status === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                                    step.status === 'in-progress' ? 'bg-indigo-600 text-white ring-[10px] ring-indigo-50 shadow-indigo-200' :
                                        'bg-white text-gray-200 border-gray-50 shadow-gray-50'}
                            `}>
                                {step.status === 'completed' ? <CheckCircle2 className="w-8 h-8" /> : <Clock className={`w-8 h-8 ${step.status === 'in-progress' ? 'animate-pulse' : ''}`} />}
                            </div>
                            <div className="text-center space-y-2">
                                <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${step.status === 'upcoming' ? 'text-gray-300' : 'text-gray-900'}`}>{step.step}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* High-Impact Action Bar */}
            <div className="bg-gray-900 p-12 rounded-[3.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.4)] flex flex-wrap items-center justify-between gap-12 border border-white/10 sticky bottom-8 z-40 transform hover:scale-[1.01] transition-transform duration-500">
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/10">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] leading-none mb-2">Security Compliance Protocol</p>
                        <p className="text-2xl font-black text-white tracking-tight uppercase">High-Probability Liquidity Access</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none px-10 py-5 bg-white/5 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] rounded-3xl hover:bg-white hover:text-black transition-all">
                        Bulk Document Verification
                    </button>
                    <button className="flex-1 lg:flex-none px-12 py-5 bg-emerald-500 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-emerald-400 transition-all shadow-[0_12px_48px_-12px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 group">
                        <CheckCircle2 className="w-6 h-6 fill-white text-emerald-500 group-hover:scale-125 transition-transform" />
                        Execute Capital Release
                    </button>
                </div>
            </div>
        </div>
    )
}
