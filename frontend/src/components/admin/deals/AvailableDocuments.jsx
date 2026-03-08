import { FileText, Eye, Download } from 'lucide-react'

export default function AvailableDocuments({ documents }) {
    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Available Documents</h3>
            </div>

            <div className="space-y-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-6 bg-white border border-gray-50 rounded-2xl hover:border-indigo-100 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-base font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{doc.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-xl border border-gray-100 hover:bg-white hover:text-gray-900 hover:shadow-md transition-all">
                                <Eye className="w-4 h-4" />
                                View
                            </button>
                            <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl border border-gray-100 hover:bg-white hover:text-indigo-600 hover:shadow-md transition-all">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
