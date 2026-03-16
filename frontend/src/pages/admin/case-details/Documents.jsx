import { useCaseContext } from '../../../context/CaseContext'
import { Upload, FileText, Eye, Download, Search, FileCode, FileImage, MoreVertical } from 'lucide-react'

export default function Documents() {
    const { caseData } = useCaseContext()

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Document Repository</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">Centralized management for all case-related assets</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-sm">
                    <Upload className="w-4 h-4" />
                    Upload File
                </button>
            </div>

            {/* Modern Upload Zone */}
            <div className="group relative border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center bg-gray-50/20 hover:bg-white hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-gray-400 mx-auto mb-4 transition-all duration-300 border border-gray-100">
                        <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">Upload Documents</h4>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium">
                        Drag and drop your engineering docs, valuations, or legal assets here.
                        <span className="text-indigo-600 font-black ml-1 border-b-2 border-indigo-100 group-hover:border-indigo-500 transition-colors">Select Files</span>
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                            <FileCode className="w-3.5 h-3.5" />
                            Engineering
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                            <FileImage className="w-3.5 h-3.5" />
                            Valuations
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Document Table */}
            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter by name, type, or uploader..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{caseData.documents.length} Assets Managed</span>
                        <div className="w-px h-6 bg-gray-100" />
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-gray-50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Resource Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Uploaded By</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {caseData.documents && caseData.documents.length > 0 ? (
                                caseData.documents.map((doc, idx) => (
                                    <tr key={doc.id || idx} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-black text-gray-900 block group-hover:underline underline-offset-4 decoration-indigo-200">{doc.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{doc.size || '2.4 MB'} • {doc.extension || 'PDF'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-white border border-gray-100 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm">
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600 border border-white">
                                                    {(doc.uploadedBy || 'S M').split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-xs text-gray-600 font-black">{doc.uploadedBy || 'Sarah Mitchell'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                            {doc.date}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 rounded-lg transition-all" title="View Preview">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 rounded-lg transition-all" title="Download">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border border-gray-100">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No documents identified for this case</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
