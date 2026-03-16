// src/pages/admin/case-details/Overview.jsx
import { useCaseContext } from '../../../context/CaseContext'
import { Calendar, TrendingUp, DollarSign, Clock, ArrowUpRight, BarChart4 } from 'lucide-react'

export default function Overview() {
    const { caseData } = useCaseContext()

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString, showTime = true) => {
        if (!dateString) return '-'
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }
        if (showTime) {
            options.hour = '2-digit'
            options.minute = '2-digit'
            options.hour12 = false
        }
        return new Date(dateString).toLocaleString('en-AU', options).replace(',', '')
    }

    return (
        <div className="space-y-8">
            {/* High-Impact Stat Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Visual Momentum Card */}
                <div className="lg:col-span-8 bg-[#12141D] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl min-h-[320px]">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-12">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Current Market Position</p>
                                <h3 className="text-2xl font-black tracking-tight">Financial Momentum</h3>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                <TrendingUp className="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Yield Optimization</p>
                                </div>
                                <p className="text-4xl font-black tracking-tighter text-emerald-400">
                                    {caseData.financial.currentHighestBid > 0 
                                        ? `${((caseData.valuation.amount / caseData.financial.currentHighestBid) * 100).toFixed(1)}%`
                                        : '0.0%'}
                                </p>
                                <p className="text-xs text-gray-500 font-medium">Verified current valuation / highest bid</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Projected Equity</p>
                                </div>
                                <p className="text-4xl font-black tracking-tighter">
                                    {formatCurrency(caseData.financial.equityAvailable || 0)}
                                </p>
                                <p className="text-xs text-gray-500 font-medium tracking-tight">Est. residual value (Valuation - Debt)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Critical Timeline Card */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl" />
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Workflow Temporal Status</p>
                            <h3 className="text-xl font-black tracking-tight text-gray-900 leading-none">Global Progress</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Calendar, label: 'Origination', value: formatDate(caseData.timeline.caseCreated, false) },
                                { icon: Clock, label: 'Final Delta', value: formatDate(caseData.timeline.lastUpdated) },
                                { icon: BarChart4, label: 'Total Bids', value: `${caseData.bids.length} Operations` }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300 border border-gray-100">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-xs font-bold text-gray-900">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Component Architecture */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12 px-2">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight text-gray-900">Capital Stack Structure</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-lg">Comprehensive audit of current financial obligations, property valuations, and liquidity targets.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-xl border border-gray-100 hover:text-gray-900 transition-all">Audit Logs</button>
                        <button className="px-6 py-3 bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-all">Generate Summary</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Asset Valuation', value: formatCurrency(caseData.valuation.amount), color: 'text-gray-900', bg: 'bg-gray-50' },
                        { label: 'Aggregate Debt', value: formatCurrency(caseData.loan.outstandingDebt), color: 'text-red-500', bg: 'bg-red-50/30' },
                        { label: 'Locked Equity', value: formatCurrency(caseData.financial.equityAvailable), color: 'text-emerald-500', bg: 'bg-emerald-50/30' },
                        { label: 'Minimum Threshold', value: formatCurrency(caseData.financial.minimumBid), color: 'text-indigo-600', bg: 'bg-indigo-50/30' }
                    ].map((item, i) => (
                        <div key={i} className={`${item.bg} rounded-2xl p-6 border border-white/50 backdrop-blur-sm group transition-all duration-500`}>
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">{item.label}</p>
                            <p className={`text-xl font-black ${item.color} tracking-tight`}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Propagation Log */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-xl font-black tracking-tight text-gray-900">Intelligence Stream</h3>
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Live Feed</div>
                </div>

                <div className="space-y-12 relative pl-10 border-l-2 border-gray-50 ml-4">
                    {caseData.activity.slice(0, 3).map((activity, index) => (
                        <div key={activity.id} className="relative group">
                            {/* Oracle Point */}
                            <div className="absolute -left-[3.05rem] top-0 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-md">
                                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <p className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{activity.title}</p>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-lg">{activity.timestamp}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-400 max-w-2xl leading-relaxed tracking-tight">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
