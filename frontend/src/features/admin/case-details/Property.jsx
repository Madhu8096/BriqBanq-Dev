// src/pages/admin/case-details/Property.jsx
import { useCaseContext } from '../../../context/CaseContext'
import { Image as ImageIcon, MapPin, Bed, Bath, Car, Building2, Ruler, Calendar, Maximize2, Share2, Heart } from 'lucide-react'

export default function Property() {
    const { caseData } = useCaseContext()

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const features = [
        { label: 'Property Type', value: caseData.property.type, icon: Building2 },
        { label: 'Bedrooms', value: `${caseData.property.bedrooms} Bedrooms`, icon: Bed },
        { label: 'Bathrooms', value: `${caseData.property.bathrooms} Bathrooms`, icon: Bath },
        { label: 'Parking', value: `${caseData.property.parking} Spaces`, icon: Car },
        { label: 'Total Area', value: '112 sqm', icon: Ruler },
        { label: 'Year Built', value: '2018 Built', icon: Calendar },
    ]

    const valuationRows = [
        { label: 'Primary Valuation', value: formatCurrency(caseData.valuation.amount), highlight: true },
        { label: 'Appraisal Timestamp', value: '15 Jan 2026' },
        { label: 'Authorized Valuer', value: caseData.valuation.valuer },
        { label: 'Execution Strategy', value: 'Direct Comparison' },
    ]

    return (
        <div className="space-y-12">
            {/* Cinematic Hero Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 group relative rounded-3xl overflow-hidden shadow-lg h-[500px] border border-gray-100">
                    <img
                        src={caseData.images[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"}
                        alt="Featured Property"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Image Controls */}
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white hover:text-black transition-all">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-indigo-600 transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="absolute bottom-10 left-10 space-y-2">
                        <div className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-md w-fit shadow-lg shadow-indigo-600/20">Featured Asset</div>
                        <h3 className="text-3xl font-black text-white tracking-tight">{caseData.property.address}</h3>
                        <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {caseData.property.suburb}</span>
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            <span>Residential Class</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                    {caseData.images.slice(1, 3).map((img, i) => (
                        <div key={i} className="relative rounded-2xl overflow-hidden shadow-md h-[238px] group border border-gray-100">
                            <img src={img.url || "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1000"} alt="Property Detail" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Asset Configuration Workspace */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 sm:gap-16">
                <div className="xl:col-span-7 space-y-16">
                    {/* Architectural Features */}
                    <div className="space-y-8">
                        <div className="flex items-end justify-between px-2">
                            <div className="space-y-2">
                                <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Hardware & Layout</p>
                                <h4 className="text-3xl font-black text-gray-900 tracking-tight">Property Configurations</h4>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Type: {caseData.property.type}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {features.map((feature, i) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl transition-all duration-300 shadow-sm">
                                    <div className="w-12 h-12 bg-white text-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">{feature.label}</p>
                                    <p className="text-lg font-black text-gray-900 mt-1.5 tracking-tight">{feature.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Geographical Context */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight">Geographical Precision</h4>
                            </div>
                            <button className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-colors">Expand Intelligence</button>
                        </div>

                        <div className="relative h-64 bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-50/50 flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-white rounded-full shadow-2xl animate-bounce">
                                    <MapPin className="w-8 h-8 text-indigo-600" />
                                </div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Satellite Preview Pending</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Appraisal Hub */}
                <div className="xl:col-span-5 space-y-8">
                    <div className="bg-white rounded-3xl border border-gray-100 p-1 shadow-sm relative h-full">
                        <div className="bg-gray-900 rounded-[1.5rem] p-10 h-full text-white relative overflow-hidden">
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Valuation Summary</p>
                                    <h4 className="text-2xl font-black tracking-tight leading-none">Property Value</h4>
                                </div>

                                <div className="space-y-2">
                                    {valuationRows.map((row, i) => (
                                        <div key={i} className={`flex justify-between items-center px-6 py-4 rounded-xl ${row.highlight ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-white/5'}`}>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{row.label}</p>
                                                <p className={`text-lg font-black tracking-tight ${row.highlight ? 'text-indigo-400' : 'text-white'}`}>{row.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-4 bg-white rounded-xl text-[10px] font-black text-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all">
                                    Download Valuation Pack
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
