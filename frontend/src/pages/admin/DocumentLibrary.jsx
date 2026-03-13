import { useState } from 'react'
import { FileText, FolderOpen, Star, Upload, Download, Eye, Share2, Trash2, File } from 'lucide-react'
import AdminBreadcrumb from '../../components/admin/AdminBreadcrumb'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { MOCK_DOCUMENTS } from '../../data/mockData'

export default function DocumentLibrary() {
    const [documents, setDocuments] = useState(MOCK_DOCUMENTS)

    const toggleStar = (id) => {
        setDocuments(documents.map(doc =>
            doc.id === id ? { ...doc, starred: !doc.starred } : doc
        ))
    }

    const getCategoryColor = (category) => {
        const colors = {
            Contract: 'bg-indigo-100 text-indigo-700',
            Valuation: 'bg-blue-100 text-blue-700',
            Inspection: 'bg-green-100 text-green-700',
            Kyc: 'bg-amber-100 text-amber-700',
        }
        return colors[category] || 'bg-gray-100 text-gray-700'
    }

    const getFileIcon = (type) => {
        if (type === 'pdf') return FileText
        if (type === 'zip') return File
        return FileText
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb items={[
                { label: 'Dashboard', path: '/admin/dashboard' },
                { label: 'Document Library' }
            ]} />

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4">
                <AdminStatCard
                    label="Total Documents"
                    value="5"
                    icon={FileText}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="Storage Used"
                    value="23.2 MB"
                    icon={FolderOpen}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="Starred"
                    value="2"
                    icon={Star}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <AdminStatCard
                    label="This Week"
                    value="3"
                    icon={Upload}
                    iconBg="bg-indigo-100"
                    iconColor="text-indigo-600"
                />
            </div>

            {/* Filter Bar */}
            <div className="flex gap-3 flex-wrap">
                <input
                    type="text"
                    placeholder="Search documents..."
                    className="flex-1 min-w-[200px] border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>All Categories</option>
                    <option>Contract</option>
                    <option>Valuation</option>
                    <option>Inspection</option>
                    <option>KYC</option>
                </select>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>All Types</option>
                    <option>PDF</option>
                    <option>ZIP</option>
                    <option>Images</option>
                </select>
                <button className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-1">
                    <Star className="w-4 h-4 flex-shrink-0" /> Starred
                </button>
                <button className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50">
                    Clear
                </button>
                <button className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-1">
                    <Download className="w-4 h-4 flex-shrink-0" /> Export
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-1">
                    <Upload className="w-4 h-4 flex-shrink-0" /> Upload
                </button>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">All Documents ({documents.length})</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {documents.map((doc) => (
                        <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                                    {(() => {
                                        const Icon = getFileIcon(doc.type)
                                        return <Icon className="w-4 h-4 text-red-600 flex-shrink-0" />
                                    })()}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-3 mb-2">
                                        <h3 className="text-sm font-medium text-gray-900 flex-1">{doc.name}</h3>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(doc.category)}`}>
                                                {doc.category}
                                            </span>
                                            {doc.mipId && (
                                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                                    {doc.mipId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        <button
                                            onClick={() => toggleStar(doc.id)}
                                            className="mr-2"
                                        >
                                            <Star className={`w-4 h-4 inline-block ${doc.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                        </button>
                                        {doc.size} · Uploaded by {doc.uploader} · {doc.date}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                                        <Eye className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                                        <Download className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                                        <Share2 className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                    <button className="text-red-500 hover:text-red-600 text-sm">
                                        <Trash2 className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <FolderOpen className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Document Management</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            All documents are encrypted and stored securely. Documents are retained per Australian compliance requirements.
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Maximum file size: 50MB per document</li>
                            <li>• Supported formats: PDF, DOCX, XLSX, images (JPG, PNG)</li>
                            <li>• Version control and audit trail maintained</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
