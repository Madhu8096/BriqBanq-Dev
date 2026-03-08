import { BedDouble, Bath, Car, CheckCircle2, ShieldCheck, TrendingUp, MapPin, AlertCircle, Edit, Printer, Download } from 'lucide-react'

export default function InvestmentMemorandumTab({ deal }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-6">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Investment Memorandum</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Professional marketing document for investors</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 shadow-sm transition-all">
                        <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 shadow-sm transition-all">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Document Canvas */}
            <div className="bg-white border border-gray-50 rounded-[4rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.08)] overflow-hidden max-w-7xl mx-auto relative cursor-default">

                {/* Hero Section */}
                <div className="relative h-[800px]">
                    <img
                        src={deal.images[0]}
                        className="w-full h-full object-cover"
                        alt="Property Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                    <div className="absolute inset-0 p-24 flex flex-col justify-between">
                        <div className="space-y-8">
                            <span className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-[0.2em]">Investment Opportunity</span>
                            <div className="space-y-2">
                                <h1 className="text-7xl font-black text-white tracking-tighter leading-none">{deal.address}</h1>
                                <p className="text-2xl font-medium text-white/80 flex items-center gap-2">
                                    <MapPin className="w-6 h-6" /> {deal.suburb}, {deal.state} {deal.postcode}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-black/40 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl flex items-center gap-4 text-white">
                                    <BedDouble className="w-6 h-6" /> <span className="text-xl font-bold">{deal.bedrooms}</span>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl flex items-center gap-4 text-white">
                                    <Bath className="w-6 h-6" /> <span className="text-xl font-bold">{deal.bathrooms}</span>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl flex items-center gap-4 text-white">
                                    <Car className="w-6 h-6" /> <span className="text-xl font-bold">{deal.parking}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Property Value</p>
                                <p className="text-4xl font-black text-gray-900 tracking-tighter">{formatCurrency(deal.financials.propertyValuation)}</p>
                            </div>
                            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Outstanding Debt</p>
                                <p className="text-4xl font-black text-gray-900 tracking-tighter">{formatCurrency(deal.financials.outstandingDebt)}</p>
                            </div>
                            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Expected Return</p>
                                <p className="text-4xl font-black text-emerald-500 tracking-tighter">{deal.financials.expectedROI}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="p-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        <div className="space-y-10">
                            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Executive Summary</h3>
                            <div className="space-y-6">
                                <p className="text-lg text-gray-600 leading-relaxed font-semibold">
                                    This Investment Memorandum presents a secured lending opportunity backed by a premium residential property in {deal.suburb}, {deal.state}. The property is currently in mortgage default, presenting an attractive acquisition opportunity for institutional and high net worth investors.
                                </p>
                                <p className="text-lg text-gray-500 leading-relaxed font-medium">
                                    The loan is secured by first mortgage over a well-maintained property valued at {formatCurrency(deal.financials.propertyValuation)}, providing a conservative LVR of {deal.metrics.lvr}% and significant equity buffer.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2rem] flex items-center gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-emerald-900 uppercase tracking-widest">First Mortgage Security</p>
                                    <p className="text-sm font-bold text-emerald-600">Primary lien position</p>
                                </div>
                            </div>
                            <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-[2rem] flex items-center gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">Independent Valuation</p>
                                    <p className="text-sm font-bold text-indigo-600">Current as of Jan 2026</p>
                                </div>
                            </div>
                            <div className="bg-purple-50/50 border border-purple-100 p-8 rounded-[2rem] flex items-center gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                                    <AlertCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-purple-900 uppercase tracking-widest">Clear Title</p>
                                    <p className="text-sm font-bold text-purple-600">No secondary encumbrances</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Investment Highlights */}
                    <div className="mt-32 space-y-16">
                        <h3 className="text-4xl font-black text-gray-900 tracking-tight">Investment Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-poppins">
                            <div className="bg-gray-50/50 border border-gray-100 p-12 rounded-[3rem] space-y-6 group hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-black text-gray-900">Strong Returns</h4>
                                    <p className="text-base text-gray-500 font-bold leading-relaxed">Target IRR of {deal.financials.expectedROI}% per annum with monthly interest payments at {deal.metrics.defaultRate}% default rate.</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Historical recovery rate: 97.5%</p>
                                </div>
                            </div>
                            <div className="bg-gray-50/50 border border-gray-100 p-12 rounded-[3rem] space-y-6 group hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
                                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-black text-gray-900">Conservative LVR</h4>
                                    <p className="text-base text-gray-500 font-bold leading-relaxed">Loan to Value Ratio of {deal.metrics.lvr}% provides substantial equity cushion and downside protection.</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Equity buffer: {formatCurrency(deal.financials.equityAvailable)}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50/50 border border-gray-100 p-12 rounded-[3rem] space-y-6 group hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
                                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-black text-gray-900">Prime Location</h4>
                                    <p className="text-base text-gray-500 font-bold leading-relaxed">Located in {deal.suburb}, a highly desirable suburb with strong capital growth history.</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">5-year growth: 42% • Median: $1.15M</p>
                                </div>
                            </div>
                            <div className="bg-gray-50/50 border border-gray-100 p-12 rounded-[3rem] space-y-6 group hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
                                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="w-7 h-7" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-black text-gray-900">Default Rate Premium</h4>
                                    <p className="text-base text-gray-500 font-bold leading-relaxed">Enhanced return at {deal.metrics.defaultRate}% p.a. compared to original rate of {deal.metrics.interestRate}%, providing 2.50% premium.</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{deal.metrics.daysInDefault} days in default • {deal.metrics.daysInArrears} days in arrears</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Gallery */}
                    <div className="mt-32 space-y-16">
                        <h3 className="text-4xl font-black text-gray-900 tracking-tight">Property Gallery</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="h-[400px] rounded-[3rem] overflow-hidden">
                                <img src={deal.images[0]} className="w-full h-full object-cover" />
                            </div>
                            <div className="h-[400px] rounded-[3rem] overflow-hidden">
                                <img src={deal.images[1]} className="w-full h-full object-cover" />
                            </div>
                            <div className="h-[400px] rounded-[3rem] overflow-hidden">
                                <img src={deal.images[2]} className="w-full h-full object-cover" />
                            </div>
                            <div className="h-[400px] rounded-[3rem] overflow-hidden">
                                <img src={deal.images[3] || deal.images[0]} className="w-full h-full object-cover grayscale transition-all hover:grayscale-0 duration-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Details & Property Details Section */}
                <div className="mt-32 grid grid-cols-2 gap-24">
                    <div className="space-y-12">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Loan Details</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Original Loan Principal', value: formatCurrency(deal.financials.originalLoanAmount) },
                                { label: 'Outstanding Debt', value: formatCurrency(deal.financials.outstandingDebt) },
                                { label: 'Interest Rate (Original)', value: `${deal.metrics.interestRate}% p.a.` },
                                { label: 'Default Interest Rate', value: `${deal.metrics.defaultRate}% p.a.` },
                                { label: 'Current Default Status', value: `${deal.metrics.daysInDefault} Days` }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{row.label}</span>
                                    <span className="text-base font-black text-gray-900">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-12">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Property Details</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Property Type', value: deal.propertyType },
                                { label: 'Title Reference', value: 'VOL 12840 FOL 293' },
                                { label: 'Bedrooms / Bath/ Car', value: `${deal.bedrooms} / ${deal.bathrooms} / ${deal.parking}` },
                                { label: 'Land Area', value: deal.landSize },
                                { label: 'Zoning', value: 'R3 Medium Density' }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{row.label}</span>
                                    <span className="text-base font-black text-gray-900">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk Assessment & Terms Section */}
                <div className="mt-32 grid grid-cols-2 gap-24">
                    <div className="space-y-10">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Risk Assessment</h3>
                        <div className="bg-amber-50/50 border border-amber-100 p-12 rounded-[3rem] space-y-6">
                            <p className="text-base text-gray-600 font-bold leading-relaxed">
                                Primary risks include market volatility and potential delays in the legal liquidation process. However, a {deal.metrics.lvr}% LVR provides a significant capital buffer of {formatCurrency(deal.financials.equityAvailable)}.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-xs font-bold text-amber-800">Verified first mortgage security</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-xs font-bold text-amber-800">Current independent valuation on file</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-10">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Investment Terms</h3>
                        <div className="bg-gray-50 border border-gray-100 p-12 rounded-[3rem] space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Min Investment</p>
                                    <p className="text-xl font-black text-gray-900">$50,000</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Term</p>
                                    <p className="text-xl font-black text-gray-900">6-12 Months</p>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-500 italic">
                                    "Distribution of capital and interest occurs immediately upon settlement of the underlying property or refinance of the loan."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Disclaimer */}
                <div className="mt-32 pt-16 border-t border-gray-100 space-y-8">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Important Disclaimer</h4>
                    <p className="text-[10px] text-gray-400 leading-loose font-bold text-justify uppercase">
                        THIS DOCUMENT IS FOR INFORMATION PURPOSES ONLY AND DOES NOT CONSTITUTE FINANCIAL ADVICE. INVESTING IN DISTRESSED REAL ESTATE ASSETS INVOLVES SIGNIFICANT RISK, INCLUDING LOSS OF CAPITAL. PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS. BRICKBANQ CAPITAL PTY LTD (ACN 182 938 472) OPERATES AS A TECHNOLOGY PLATFORM AND IS NOT RESPONSIBLE FOR THE PERFORMANCE OF ANY UNDERLYING ASSET.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 p-24 text-white">
                <div className="grid grid-cols-3 gap-24">
                    <div className="col-span-2 space-y-8">
                        <h4 className="text-2xl font-black tracking-tight">Brickbanq Platform</h4>
                        <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
                            Detailed investment disclosures and risk assessments are available upon request for verified institutional partners. Investment in distressed assets involves significant risk.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Document Reference</p>
                        <p className="text-xl font-black tracking-tight">{deal.id}</p>
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Generated On</p>
                            <p className="text-xs font-bold font-mono py-2">18 FEB 2026 • 13:19:47</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
