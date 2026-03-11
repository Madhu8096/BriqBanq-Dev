import { useState } from 'react'
import { jsPDF } from 'jspdf'
import StatusPill from './components/StatusPill'
const MOCK_BORROWER_CONTRACTS = [];

const formatNum = (n) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

const STATUS_OPTIONS = ['Draft', 'Under Contract', 'Pending', 'Completed', 'Cancelled']

function generateContractId() {
  const n = Math.floor(Math.random() * 900) + 100
  return `MIP-2026-${String(n).padStart(3, '0')}`
}

export default function Contracts() {
  const [contracts, setContracts] = useState(MOCK_BORROWER_CONTRACTS)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [viewingContract, setViewingContract] = useState(null)
  const [formData, setFormData] = useState({
    propertyAddress: '',
    propertySuburb: '',
    party: '',
    lender: '',
    contractValue: '',
    status: 'Draft',
    date: new Date().toISOString().split('T')[0],
  })
  const [, setPhotos] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [errors, setErrors] = useState({})

  const handleCreateNew = () => {
    setFormData({
      propertyAddress: '',
      propertySuburb: '',
      party: '',
      lender: '',
      contractValue: '',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
    })
    setPhotos([])
    setPhotoPreviews([])
    setErrors({})
    setShowCreateForm(true)
  }

  const handleCloseForm = () => {
    photoPreviews.forEach((p) => { if (p?.url) URL.revokeObjectURL(p.url) })
    setPhotoPreviews([])
    setPhotos([])
    setShowCreateForm(false)
    setErrors({})
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || [])
    setPhotos((prev) => [...prev, ...files])
    const newPreviews = files.map((file) => ({ url: URL.createObjectURL(file), name: file.name }))
    setPhotoPreviews((prev) => [...prev, ...newPreviews])
    e.target.value = ''
  }

  const removePhoto = (index) => () => {
    setPhotoPreviews((prev) => {
      const next = prev.filter((_, i) => i !== index)
      const removed = prev[index]
      if (removed?.url) URL.revokeObjectURL(removed.url)
      return next
    })
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const next = {}
    if (!formData.propertyAddress?.trim()) next.propertyAddress = 'Property address is required'
    if (!formData.party?.trim()) next.party = 'Party is required'
    if (!formData.contractValue?.trim()) next.contractValue = 'Contract value is required'
    else if (Number(formData.contractValue) <= 0 || isNaN(Number(formData.contractValue))) next.contractValue = 'Enter a valid amount'
    if (!formData.date?.trim()) next.date = 'Date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const value = Math.round(Number(formData.contractValue))
    const newContract = {
      id: generateContractId(),
      property: formData.propertyAddress.trim(),
      suburb: (formData.propertySuburb || '').trim() || '—',
      party: formData.party.trim(),
      lender: (formData.lender || '').trim() || '—',
      value,
      created: new Date(formData.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: formData.status,
    }
    setContracts((prev) => [newContract, ...prev])
    handleCloseForm()
  }

  const handleView = (c) => () => setViewingContract(c)
  const handleCloseView = () => setViewingContract(null)

  const handleDownload = (c) => () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Contract Details', 14, 20)
    doc.setFontSize(11)
    let y = 36
    const lineHeight = 8
    doc.text(`Contract ID: ${c.id}`, 14, y); y += lineHeight
    doc.text(`Property: ${c.property}`, 14, y); y += lineHeight
    doc.text(`Location: ${c.suburb}`, 14, y); y += lineHeight
    doc.text(`Party: ${c.party}`, 14, y); y += lineHeight
    doc.text(`Lender: ${c.lender}`, 14, y); y += lineHeight
    doc.text(`Contract Value: ${formatNum(c.value)}`, 14, y); y += lineHeight
    doc.text(`Created Date: ${c.created}`, 14, y); y += lineHeight
    doc.text(`Status: ${c.status}`, 14, y)
    doc.save(`Contract-${c.id}.pdf`)
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your mortgage resolution case</p>
        </div>
        <button type="button" onClick={handleCreateNew} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
          + Create New Contract
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Property</th>
                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Contract ID</th>
                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Parties</th>
                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Contract Value</th>
                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Created Date</th>
                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-200 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.property}</p>
                        <p className="text-xs text-gray-500">{c.suburb}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{c.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{c.party}</p>
                    <p className="text-xs text-gray-500">{c.lender}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatNum(c.value)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{c.created}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={handleView(c)} className="text-sm text-indigo-600 hover:underline">
                        👁 View
                      </button>
                      <button type="button" onClick={handleDownload(c)} className="text-sm text-indigo-600 hover:underline">
                        ⬇
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Contract Modal */}
      {viewingContract && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4" onClick={handleCloseView}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Contract Details</h2>
              <button type="button" onClick={handleCloseView} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Contract ID</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewingContract.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Property</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewingContract.property}</p>
                <p className="text-sm text-gray-600">{viewingContract.suburb}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Parties</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewingContract.party}</p>
                <p className="text-sm text-gray-600">{viewingContract.lender}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Contract Value</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{formatNum(viewingContract.value)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Created Date</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewingContract.created}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <p className="mt-0.5"><StatusPill status={viewingContract.status} /></p>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button type="button" onClick={handleCloseView} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Close</button>
              <button type="button" onClick={() => { handleDownload(viewingContract)(); handleCloseView() }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium text-white">Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Create Contract Form */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Create New Contract</h2>
            <button
              type="button"
              onClick={handleCloseForm}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form id="create-contract-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Address *</label>
              <input
                type="text"
                value={formData.propertyAddress}
                onChange={(e) => setFormData((f) => ({ ...f, propertyAddress: e.target.value }))}
                placeholder="e.g. 45 Victoria Street"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.propertyAddress && <p className="text-xs text-red-500 mt-1">{errors.propertyAddress}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suburb / Location</label>
              <input
                type="text"
                value={formData.propertySuburb}
                onChange={(e) => setFormData((f) => ({ ...f, propertySuburb: e.target.value }))}
                placeholder="e.g. Potts Point, NSW"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Property Photos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="contract-photos"
                />
                <label htmlFor="contract-photos" className="cursor-pointer block">
                  <span className="text-gray-500 text-sm">Click to upload or drag and drop</span>
                  <span className="text-gray-400 text-xs block mt-1">JPG, PNG (max 10MB each)</span>
                </label>
              </div>
              {photoPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {photoPreviews.map((p, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      <button type="button" onClick={removePhoto(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded text-xs flex items-center justify-center" aria-label="Remove">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Party (Buyer / Name) *</label>
                <input
                  type="text"
                  value={formData.party}
                  onChange={(e) => setFormData((f) => ({ ...f, party: e.target.value }))}
                  placeholder="e.g. Emma Rodriguez"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {errors.party && <p className="text-xs text-red-500 mt-1">{errors.party}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lender</label>
                <input
                  type="text"
                  value={formData.lender}
                  onChange={(e) => setFormData((f) => ({ ...f, lender: e.target.value }))}
                  placeholder="e.g. ANZ"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (A$) *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.contractValue}
                onChange={(e) => setFormData((f) => ({ ...f, contractValue: e.target.value }))}
                placeholder="e.g. 1750000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.contractValue && <p className="text-xs text-red-500 mt-1">{errors.contractValue}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
            </div>
          </form>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0 bg-gray-50">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-contract-form"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium text-white"
            >
              Create Contract
            </button>
          </div>
        </div>
      )}
    </div>
  )
}