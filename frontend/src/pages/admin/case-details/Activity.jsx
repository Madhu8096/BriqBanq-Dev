// src/pages/admin/case-details/Activity.jsx
import { useCaseContext } from '../../../context/CaseContext'
import { Activity as ActivityIcon, CheckCircle2, FileText, MessageSquare, RefreshCw, DollarSign, Clock, ArrowUpRight, Zap, Shell } from 'lucide-react'

export default function Activity() {
    const { caseData } = useCaseContext()

    const getIcon = (title) => {
        const t = title.toLowerCase()
        if (t.includes('bid')) return <DollarSign className="w-5 h-5" />
        if (t.includes('document') || t.includes('valuation')) return <FileText className="w-5 h-5" />
        if (t.includes('message')) return <MessageSquare className="w-5 h-5" />
        if (t.includes('status')) return <RefreshCw className="w-5 h-5" />
        return <CheckCircle2 className="w-5 h-5" />
    }

    return (
        <div className="space-y-12">
            {/* High-Impact Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 px-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Chronological Pulse</p>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Intelligence Stream</h2>
                    <p className="text-sm text-gray-400 font-medium max-w-lg">Full-spectrum audit logs capturing every micro-interaction and strategic pivot within this case lifecycle.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 hover:bg-white transition-all shadow-sm">
                        Export Logs
                    </button>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 flex items-center gap-3">
                        <Clock className="w-4 h-4" />
                        Session Replay
                    </button>
                </div>
            </div>

            {/* Cinematic Timeline Construction */}
            <div className="relative pl-16 space-y-12">
                {/* Visual Backbone */}
                <div className="absolute left-[2.25rem] top-4 bottom-4 w-[2px] bg-gradient-to-b from-indigo-500 via-gray-100 to-transparent" />

                {caseData.activity.map((item, index) => {
                    const isFirst = index === 0
                    const delay = index * 100

                    return (
                        <div key={item.id} className="relative group" style={{ animationDelay: `${delay}ms` }}>
                            {/* Oracle Point Indicator */}
                            <div className={`absolute -left-[3.2rem] top-0 w-12 h-12 rounded-[1.25rem] border-4 border-white z-20 flex items-center justify-center transition-all duration-500 shadow-xl group-hover:scale-125 group-hover:rotate-[360deg]
                                ${isFirst ? 'bg-indigo-600 text-white' : 'bg-white text-gray-300 border-gray-50 group-hover:text-indigo-600 group-hover:border-indigo-100 ring-4 ring-transparent group-hover:ring-indigo-50/50'}
                            `}>
                                {getIcon(item.title)}
                            </div>

                            {/* Activity Card Implementation */}
                            <div className={`p-8 rounded-[1.5rem] border transition-all duration-300 relative overflow-hidden
                                ${isFirst
                                    ? 'bg-white border-indigo-100 shadow-xl'
                                    : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
                                }
                            `}>
                                {isFirst && (
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                )}

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                        <div className="flex items-center gap-4">
                                            <h4 className={`text-2xl font-black tracking-tight ${isFirst ? 'text-gray-900' : 'text-gray-800'}`}>
                                                {item.title}
                                            </h4>
                                            {isFirst && (
                                                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Real-time Delta</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-100">
                                                {item.timestamp}
                                            </span>
                                            <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className={`text-base font-medium leading-relaxed max-w-4xl tracking-tight transition-colors duration-500 ${isFirst ? 'text-gray-600 font-bold' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                        {item.description}
                                    </p>

                                    {isFirst && (
                                        <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="flex -space-x-3">
                                                    {['AM', 'JD', 'KL'].map((initials, i) => (
                                                        <div key={i} className="w-12 h-12 rounded-2xl bg-gray-900 border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-xl hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
                                                            {initials}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Stakeholder Access</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">3 verified members present</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button className="px-6 py-3 bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] rounded-xl hover:text-gray-900 transition-colors">Verify Block</button>
                                                <button className="px-6 py-3 bg-indigo-600 text-[10px] font-black text-white uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Deep Analysis</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Tactical Load Interface */}
            <div className="flex flex-col items-center gap-6 py-12">
                <div className="w-[1px] h-20 bg-gradient-to-b from-gray-100 to-transparent" />
                <button className="px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg transition-all duration-300 flex items-center gap-3 group">
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-1000" />
                    Expand Case Activity Log
                </button>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Audit Signature: 0X77A-92B-CAS-881</p>
            </div>
        </div>
    )
}
