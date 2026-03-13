// src/pages/admin/case-details/InvestmentMemorandum.jsx
import { useCaseContext } from '../../../context/CaseContext'
import {
    Download, Edit3, Printer, Bed, Bath, Car,
    CheckCircle2, ShieldCheck, Target, Zap, Clock, AlertTriangle,
    FileText, Share2, Eye, Building2, MapPin, TrendingUp,
    Briefcase, Shield
} from 'lucide-react'

export default function InvestmentMemorandum() {
    const { caseData } = useCaseContext()

    if (!caseData) return null

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-12 pb-24">
            {/* Professional Management Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Asset Dossier V2.0</p>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">Investment Memorandum</h2>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-50">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 hover:bg-white transition-all">
                        <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 hover:bg-white transition-all">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" /> PDF
                    </button>
                </div>
            </div>

            {/* Case Presentation Canvas */}
            <div className="bg-white border border-gray-50 rounded-3xl shadow-sm overflow-hidden w-full max-w-7xl relative cursor-default">

                {/* Visual Anchor Line */}
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gray-900 z-30" />

                {/* Cover Hero Perspective */}
                <div className="relative h-[600px] w-full group overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
                        alt="Property Hero"
                        className="w-full h-full object-cover grayscale-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/80 via-gray-900/40 to-transparent" />

                    {/* Glass Overlay Data */}
                    <div className="absolute top-10 right-10 px-6 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-1">Dossier ID</p>
                        <p className="text-xs font-black text-white uppercase tracking-widest">BBQ-2026-X01</p>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-16 text-white z-20">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-600/90 backdrop-blur-xl text-[9px] font-black uppercase tracking-[0.4em] rounded-lg mb-8 shadow-2xl">
                            <AlertTriangle className="w-3 h-3" />
                            Target Acquisition Opportunity
                        </div>
                        <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase leading-[0.85] max-w-4xl text-white drop-shadow-2xl">
                            {caseData.property.address}
                        </h1>
                        <div className="flex items-center gap-3 text-xl font-medium text-gray-300 mb-12 tracking-tight">
                            <MapPin className="w-5 h-5 text-indigo-400" />
                            <span className="opacity-80 font-black uppercase tracking-widest text-base">{caseData.property.suburb}, {caseData.property.state} {caseData.property.postcode}</span>
                        </div>

                        <div className="flex gap-4 mb-12">
                            {[
                                { icon: Bed, val: caseData.property.bedrooms, label: 'Beds' },
                                { icon: Bath, val: caseData.property.bathrooms, label: 'Baths' },
                                { icon: Car, val: caseData.property.parking, label: 'Parking' }
                            ].map((spec, i) => (
                                <div key={i} className="flex flex-col gap-1.5 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group/spec hover:bg-white transition-all duration-300">
                                    <spec.icon className="w-5 h-5 text-indigo-400 group-hover/spec:text-indigo-600" />
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-white group-hover/spec:text-gray-900">{spec.val}</span>
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover/spec:text-gray-400">{spec.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Financial Fast Track */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 bg-white p-1 rounded-3xl shadow-xl max-w-4xl">
                            <div className="bg-gray-50/50 p-8 rounded-l-2xl border-r border-gray-100 flex flex-col justify-center">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">Independent Valuation</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatCurrency(caseData.valuation.amount / 1000)}k</p>
                            </div>
                            <div className="bg-gray-50/50 p-8 border-r border-gray-100 flex flex-col justify-center">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">LVR Profile</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">72.8<span className="text-xl text-indigo-600">%</span></p>
                            </div>
                            <div className="bg-indigo-600 p-8 rounded-r-2xl flex flex-col justify-center relative overflow-hidden group/ret">
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.3em] mb-2">Yield Potential</p>
                                <p className="text-3xl font-black text-white tracking-tighter">12.4<span className="text-xl text-indigo-300">%</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-10 lg:p-12 space-y-16 lg:space-y-24">

                    {/* Executive Briefing */}
                    <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-16">
                        <div className="xl:col-span-8 space-y-10">
                            <div className="space-y-4">
                                <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.5em]">Global Briefing</p>
                                <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none uppercase">Executive Summary</h2>
                            </div>
                            <div className="text-xl font-medium text-gray-400 leading-[1.8] max-w-4xl space-y-8">
                                <p>
                                    This strategic acquisition opportunity represents a <span className="text-gray-900 font-black">high-alpha secured position</span> backed by a tier-one residential asset in {caseData.property.suburb}, Australia's most resilient real estate corridor.
                                </p>
                                <div className="p-10 bg-indigo-50/50 border border-indigo-100 rounded-[3rem] text-indigo-700 italic relative group">
                                    <div className="absolute -left-4 top-10 w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-xl shadow-xl">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    "The asset presents an asymmetrical risk-reward profile, leveraging a distressed mortgage cycle against foundational capital preservation metrics."
                                </div>
                                <p>
                                    As of Q1 2026, the underlying security is valued at <span className="text-gray-900 font-black">{formatCurrency(caseData.valuation.amount)}</span> via independent appraisal, maintaining a liquid equity buffer of {formatCurrency(270000)} for capital insulation.
                                </p>
                            </div>
                        </div>
                        <div className="xl:col-span-4 space-y-6">
                            {[
                                { title: 'Lien Seniority', desc: 'Absolute First Mortgage Position', icon: Shield, color: 'emerald' },
                                { title: 'Protocol Verify', desc: 'Independent Preston Rowe Audit', icon: ShieldCheck, color: 'indigo' },
                                { title: 'Title Liquidity', desc: 'Verified Index 0 Freehold', icon: Zap, color: 'purple' }
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-6 p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all duration-700
                                    ${item.color === 'emerald' ? 'bg-white border-emerald-50 text-emerald-900' :
                                        item.color === 'indigo' ? 'bg-white border-indigo-50 text-indigo-900' :
                                            'bg-white border-purple-50 text-purple-900'}
                                `}>
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl
                                        ${item.color === 'emerald' ? 'bg-emerald-500 text-white' :
                                            item.color === 'indigo' ? 'bg-indigo-600 text-white' :
                                                'bg-purple-600 text-white'}
                                    `}>
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Operational Highlights Matrix */}
                    <section className="space-y-16">
                        <div className="flex items-end justify-between border-b border-gray-100 pb-12">
                            <div className="space-y-3">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Strategic Indicators</p>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none uppercase">Investment Highlights</h2>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
                                    <Share2 className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: 'Optimized IRR', desc: 'Target internal rate of 12.4% with monthly distribution protocol at 8.25% default velocity.', value: '97.5% Asset Recovery Benchmark', icon: TrendingUp, color: 'bg-emerald-500' },
                                { title: 'Equity Insulation', desc: '72.8% LVR deployment provides foundational buffer against localized market volatility.', value: '$270,000 Protective Cushion', icon: ShieldCheck, color: 'bg-indigo-600' },
                                { title: 'Tier-1 Micro Market', desc: 'Potts Point corridor demonstrates consistent low-beta performance during macro cycles.', value: '42% Aggregate 5-Y Growth', icon: Building2, color: 'bg-purple-600' },
                                { title: 'Yield Acceleration', desc: 'Mandatory 250bp premium active due to chronological default propagation.', value: '89-Day Institutional Default Active', icon: Clock, color: 'bg-red-600' }
                            ].map((card, i) => (
                                <div key={i} className="bg-white border border-gray-100 p-8 sm:p-10 rounded-[2.5rem] space-y-8 hover:shadow-xl transition-all group overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className={`w-16 h-16 rounded-[1.5rem] ${card.color} flex items-center justify-center text-white shadow-2xl`}>
                                            <card.icon className="w-8 h-8" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">{`Indicator 0${i + 1}`}</span>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">{card.title}</h4>
                                        <p className="text-base font-medium text-gray-400 leading-relaxed">{card.desc}</p>
                                        <div className="pt-6 border-t border-gray-50 flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${card.color}`} />
                                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{card.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Asset Visual Intelligence */}
                    <section className="space-y-12">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Visual Overview</p>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">Physical Spec Gallery</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                            {[
                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
                                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000",
                                "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3f?auto=format&fit=crop&q=80&w=1000",
                                "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1000"
                            ].map((src, i) => (
                                <div key={i} className="aspect-[4/3] rounded-3xl overflow-hidden border border-gray-50 group">
                                    <img src={src} alt={`Gallery Visual ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Financial Infrastructure Matrix */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 pt-16 border-t border-gray-100">
                        <div className="space-y-12">
                            <div className="space-y-3">
                                <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em]">Ledger Detail</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">Loan Architecture</h3>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Total Principal Deployment', val: '$1,200,000' },
                                            { label: 'Current Outstanding Principal', val: '$980,000', bold: true },
                                            { label: 'Baseline Interest Rate', val: '5.75% p.a.' },
                                            { label: 'Active Default Penalty Velocity', val: '8.25% p.a.', highlight: true },
                                            { label: 'Calculated Equity Position', val: '72.8%', accent: true }
                                        ].map((row, i) => (
                                            <div key={i} className={`flex justify-between items-center px-10 py-6 rounded-[2rem] transition-all duration-500
                                                ${row.highlight ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' :
                                                    row.accent ? 'bg-emerald-50 text-emerald-900' :
                                                        'bg-gray-50/50 hover:bg-gray-50'}
                                            `}>
                                                <span className={`text-xs font-black uppercase tracking-widest ${row.highlight ? 'text-white/60' : 'text-gray-400'}`}>{row.label}</span>
                                                <span className={`text-xl font-black tracking-tight ${row.highlight ? 'text-white' : 'text-gray-900'}`}>{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-3">
                                <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em]">Risk Propagation</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">Default Status</h3>
                            </div>
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-10 bg-red-50 border border-red-100 rounded-[2.5rem] flex flex-col justify-center gap-1 shadow-sm">
                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Default Duration</p>
                                        <p className="text-4xl font-black text-red-700 tracking-tighter">89 <span className="text-lg">DAYS</span></p>
                                    </div>
                                    <div className="p-10 bg-amber-50 border border-amber-100 rounded-[2.5rem] flex flex-col justify-center gap-1 shadow-sm">
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Arrears Aging</p>
                                        <p className="text-4xl font-black text-amber-700 tracking-tighter">127 <span className="text-lg">DAYS</span></p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center px-10 py-6 border-b border-gray-50">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Liquidity Arrears</span>
                                        <span className="text-xl font-black text-gray-900">$24,500.00</span>
                                    </div>
                                    <div className="flex justify-between items-center px-10 py-6 border-b border-gray-50">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Missed Amortization Cycles</span>
                                        <span className="text-xl font-black text-gray-900 text-red-600">04 Cycles</span>
                                    </div>
                                </div>
                                <div className="p-10 bg-gray-900 rounded-[3rem] border border-white/10 flex gap-6 relative shadow-2xl">
                                    <ShieldCheck className="w-10 h-10 text-indigo-400 flex-shrink-0" />
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Advisory Signature</p>
                                        <p className="text-sm font-medium text-gray-400 leading-relaxed italic">
                                            "Formal default protocol has been initialized. Entity indicates high-cooperation status regarding orderly liquidation."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Asset Specs Detail */}
                    <section className="space-y-16">
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Physical Blueprint</p>
                            <h3 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">Property Specifications</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-4">
                            {[
                                { label: 'Asset Taxonomy', val: 'Premium Residential Loft' },
                                { label: 'Legal Title Reference', val: 'Lot 14 / DP 270215' },
                                { label: 'Structural Vintage', val: 'Circa 2018 (Certified)' },
                                { label: 'Aggregate Footprint', val: '112 SQM Net Internal' },
                                { label: 'Zoning Protocol', val: 'R4 - High Intensity Res' },
                                { label: 'Jurisdiction Council', val: 'City of Sydney / NSW' },
                                { label: 'Quarterly Infrastructure Levy', val: '$150.99 AUD' },
                                { label: 'Quarterly Strata Amortization', val: '$1,850.00 AUD' }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-8 border-b border-gray-100 group">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">{row.label}</span>
                                    <span className="text-base font-black text-gray-900 tracking-tight">{row.val}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Secure Authentication Footer */}
                <div className="bg-gray-50/50 p-24 border-t border-gray-100 text-center space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-1 bg-gray-900 rounded-full" />
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-[0.5em]">Brickbanq Global Dossier</h4>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold opacity-60">© 2026 Brickbanq Proprietary Intelligence. Level 44, Gateway Tower, Sydney NSW 2000.</p>
                        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">Confidentiality Clearance: Level 4 • Timestamp: {new Date().toLocaleString('en-AU', { timeZoneName: 'short' })}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
