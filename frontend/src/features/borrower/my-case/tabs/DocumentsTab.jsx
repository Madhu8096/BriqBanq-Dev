import { useState } from 'react'
import { borrowerApi } from '../../api'

export default function DocumentsTab({ documents = [], caseId, onDocumentUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return
    
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await borrowerApi.uploadDocument(file)
      }
      if (onDocumentUploaded) onDocumentUploaded()
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const handleBrowse = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
    input.onchange = (e) => handleFileSelect(e.target.files)
    input.click()
  }

  const handleView = (docId) => {
    window.open(`/api/borrower/contracts/${docId}/view`, '_blank')
  }

  const handleDownload = async (docId) => {
    try {
      const response = await borrowerApi.downloadContract(docId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `document-${docId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm text-slate-900 mb-1">
            Drag and drop files here, or{' '}
            <button
              type="button"
              onClick={handleBrowse}
              className="text-indigo-600 hover:text-indigo-700"
              disabled={uploading}
            >
              browse
            </button>
          </p>
          <p className="text-xs text-slate-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
          {uploading && <p className="text-xs text-indigo-600 mt-2">Uploading...</p>}
        </div>
      </div>

      {documents.length > 0 && (
        <div className="mt-6">
          <h4 className="text-base font-semibold text-slate-900 mb-4">Uploaded Documents</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3 bg-indigo-600 text-white">
                    Document Name
                  </th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3 bg-white">Type</th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3 bg-white">Uploaded By</th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3 bg-white">Date</th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3 bg-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{doc.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{doc.type}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{doc.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleView(doc.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                        >
                          <span>👁️</span>
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(doc.id)}
                          className="text-sm text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                        >
                          <span>📥</span>
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
