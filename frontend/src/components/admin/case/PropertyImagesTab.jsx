// src/components/admin/case/PropertyImagesTab.jsx
import { useCaseContext } from '../../../context/CaseContext'
import { Image as ImageIcon, Sparkles, Upload, Eye, Trash2, Plus } from 'lucide-react'

export default function PropertyImagesTab() {
    const { caseData } = useCaseContext()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Property Gallery</h3>
                    <p className="text-sm text-gray-500 font-medium">Upload or auto-generate property photos</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                        <Sparkles className="w-4 h-4" />
                        AI Suggest
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upload Button Card */}
                <button className="aspect-video bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-indigo-500 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Add New Photo</span>
                </button>

                {caseData.images.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-[2rem] overflow-hidden bg-gray-100 group shadow-sm hover:shadow-xl transition-all">
                        <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                            <button className="w-10 h-10 bg-white text-gray-700 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-black/10">
                                <Eye className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-red-500/20">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {caseData.images.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mx-auto">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-base font-bold text-gray-600">No images uploaded yet</p>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto">Start building your property listing by uploading high-quality property photos.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
