import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { getContracts, createContract } from './api'
import { LoadingState, ErrorState } from './components/PageState'

const formatNum = (n) => {
  if (typeof n === 'number' && !Number.isNaN(n)) return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
  return n ?? '—'
}

const INITIAL_FORM = {
  propertyAddress: '',
  propertySuburb: '',
  parties: '',
  partiesSub: '',
  value: '',
  date: '',
  status: 'Draft',
}

export default function ContractReview() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contracts, setContracts] = useState([])
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState(INITIAL_FORM)
  const [photoFiles, setPhotoFiles] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [viewingContract, setViewingContract] = useState(null)

  useEffect(() => {
    let cancelled = false
    getContracts()
      .then((res) => {
        if (!cancelled && res.error) setError(res.error)
        if (!cancelled && res.data) setContracts(res.data ?? [])
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load contracts') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const openCreateModal = () => {
    setCreateForm(INITIAL_FORM)
    setPhotoFiles([])
    setPhotoPreviews([])
    setCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    photoPreviews.forEach((p) => { if (p?.url) URL.revokeObjectURL(p.url) })
    setPhotoPreviews([])
    setCreateModalOpen(false)
    setCreateForm(INITIAL_FORM)
    setPhotoFiles([])
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || [])
    setPhotoFiles((prev) => [...prev, ...files])
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
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const updateForm = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateNew = () => {
    openCreateModal()
  }

  const handleSubmitContract = async (e) => {
    e.preventDefault()
    setCreateSubmitting(true)
    try {
      const res = await createContract({
        propertyAddress: createForm.propertyAddress,
        propertySuburb: createForm.propertySuburb,
        parties: createForm.parties,
        partiesSub: createForm.partiesSub,
        value: createForm.value,
        date: createForm.date,
        status: createForm.status,
      })
      if (res.error) return
      if (res.data) setContracts((prev) => [res.data, ...prev])
      closeCreateModal()
    } finally {
      setCreateSubmitting(false)
    }
  }

  const handleView = (id) => {
    const contract = contracts.find((c) => c.id === id)
    if (contract) setViewingContract(contract)
  }

  const closeViewModal = () => setViewingContract(null)

  const handleDownload = (c) => {
    if (!c) return
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Contract Details', 14, 20)
    doc.setFontSize(11)
    let y = 36
    const lineHeight = 8
    doc.text(`Contract ID: ${c.contractId || c.id}`, 14, y); y += lineHeight
    doc.text(`Property: ${c.propertyAddress || c.property || '-'}`, 14, y); y += lineHeight
    doc.text(`Location: ${c.propertySuburb || c.suburb || '-'}`, 14, y); y += lineHeight
    doc.text(`Party: ${c.parties || c.party || '-'}`, 14, y); y += lineHeight
    doc.text(`Lender: ${c.partiesSub || c.lender || '-'}`, 14, y); y += lineHeight
    const val = typeof c.value === 'number' ? formatNum(c.value) : (c.value || '—')
    doc.text(`Contract Value: ${val}`, 14, y); y += lineHeight
    doc.text(`Created Date: ${c.createdDate || c.created || '-'}`, 14, y); y += lineHeight
    doc.text(`Status: ${c.status || '-'}`, 14, y)
    doc.save(`Contract-${(c.contractId || c.id).replace(/\s+/g, '-')}.pdf`)
  }

  if (loading) return <LoadingState message="Loading contracts..." />
  if (error) return <ErrorState message={error} onRetry={() => { setError(null); setLoading(true); getContracts().then((r) => { setContracts(r.data ?? []); setError(r.error); }).finally(() => setLoading(false)) }} />

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#2A3037]">Contracts</h1>
        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 bg-[#3474E1] text-white text-sm font-medium rounded-md hover:bg-[#2a5fc4] flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+</span> Create New Contract
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 font-medium text-[#2A3037]">Property</th>
                <th className="px-6 py-3 font-medium text-[#2A3037]">Contract ID</th>
                <th className="px-6 py-3 font-medium text-[#2A3037]">Parties</th>
                <th className="px-6 py-3 font-medium text-[#2A3037] text-right">Contract Value</th>
                <th className="px-6 py-3 font-medium text-[#2A3037]">Created Date</th>
                <th className="px-6 py-3 font-medium text-[#2A3037]">Status</th>
                <th className="px-6 py-3 font-medium text-[#2A3037]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No contracts yet.</td></tr>
              ) : (
                contracts.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-[#2A3037]">{row.propertyAddress}</p>
                          <p className="text-slate-500 text-xs">{row.propertySuburb}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{row.contractId}</td>
                    <td className="px-6 py-4">
                      <p className="text-[#2A3037]">{row.parties}</p>
                      <p className="text-slate-500 text-xs">{row.partiesSub}</p>
                    </td>
                    <td className="px-6 py-4 text-[#2A3037] font-medium text-right">{row.value}</td>
                    <td className="px-6 py-4 text-slate-600">{row.createdDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        (row.status === 'Under Contract' || row.statusVariant === 'purple') ? 'bg-purple-100 text-purple-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleView(row.id)}
                        className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(row)}
                        className="p-1.5 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50"
                        title="Download"
                        aria-label="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Contract modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCreateModal} aria-hidden />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200" role="dialog" aria-modal="true" aria-labelledby="create-contract-title">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <h2 id="create-contract-title" className="text-xl font-bold text-[#2A3037]">Create New Contract</h2>
              <button type="button" onClick={closeCreateModal} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmitContract} className="px-8 py-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Property Address *</label>
                  <input
                    type="text"
                    value={createForm.propertyAddress}
                    onChange={(e) => updateForm('propertyAddress', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-[#2A3037] bg-white placeholder:text-slate-400 focus:border-[#3474E1] focus:ring-2 focus:ring-[#3474E1]/20 transition-colors"
                    placeholder="e.g. 45 Victoria Street"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Suburb / Location</label>
                  <input
                    type="text"
                    value={createForm.propertySuburb}
                    onChange={(e) => updateForm('propertySuburb', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-[#2A3037] bg-white placeholder:text-slate-400 focus:border-[#3474E1] focus:ring-2 focus:ring-[#3474E1]/20 transition-colors"
                    placeholder="e.g. Potts Point, NSW"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => updateForm('status', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-[#2A3037] bg-white focus:border-[#3474E1] focus:ring-2 focus:ring-[#3474E1]/20 transition-colors"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Under Contract">Under Contract</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Photos of Property</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="w-full text-sm text-slate-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#E6F0FF] file:text-[#3474E1] file:cursor-pointer hover:file:bg-[#D6E8FF] cursor-pointer"
                  />
                  {photoPreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {photoPreviews.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                          <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          <button type="button" onClick={removePhoto(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded text-xs flex items-center justify-center" aria-label="Remove">×</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">Click to upload or drag and drop. JPG, PNG (max 10MB each)</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Parties *</label>
                  <input
                    type="text"
                    value={createForm.parties}
                    onChange={(e) => updateForm('parties', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-[#2A3037] bg-white placeholder:text-slate-400 focus:border-[#3474E1] focus:ring-2 focus:ring-[#3474E1]/20 transition-colors"
                    placeholder="e.g. Borrower name, Lender name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Parties detail (optional)</label>
                  <input
                    type="text"
                    value={createForm.partiesSub}
                    onChange={(e) => updateForm('partiesSub', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-[#2A3037] bg-white placeholder:text-slate-400 focus:border-[#3474E1] focus:ring-2 focus:ring-[#3474E1]/20 transition-colors"
                    placeholder="e.g. ANZ, CBA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Contract Value *</label>
                  <input
                    type="text"
                    value={createForm.value}
                    onChange={(e) => updateForm('value', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-[#2A3037] bg-white placeholder:text-slate-400 focus:border-[#3474E1] focus:ring-2 focus:ring-[#3474E1]/20 transition-colors"
                    placeholder="e.g. $1,750,000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Date *</label>
                  <input
                    type="text"
                    value={createForm.date}
                    onChange={(e) => updateForm('date', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-[#2A3037] bg-white placeholder:text-slate-400 focus:border-[#3474E1] focus:ring-2 focus:ring-[#3474E1]/20 transition-colors"
                    placeholder="e.g. 25 Jan 2026 or mm/dd/yyyy"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-200 flex-shrink-0">
                <button type="button" onClick={closeCreateModal} className="px-5 py-2.5 border-2 border-slate-200 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createSubmitting} className="px-6 py-2.5 bg-[#3474E1] text-white text-base font-semibold rounded-xl hover:bg-[#2a5fc4] flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#3474E1]/25 transition-all">
                  <span>+</span>
                  {createSubmitting ? 'Creating...' : 'Create Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Contract detail modal */}
      {viewingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeViewModal} aria-hidden />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-slate-200" role="dialog" aria-modal="true" aria-labelledby="view-contract-title">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <h2 id="view-contract-title" className="text-xl font-bold text-[#2A3037]">Contract Details</h2>
              <button
                type="button"
                onClick={closeViewModal}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-8 py-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Property</p>
                <p className="text-base font-medium text-[#2A3037]">{viewingContract.propertyAddress}</p>
                {viewingContract.propertySuburb && <p className="text-sm text-slate-600">{viewingContract.propertySuburb}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Contract ID</p>
                <p className="text-base text-[#2A3037]">{viewingContract.contractId || viewingContract.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Parties</p>
                <p className="text-base text-[#2A3037]">{viewingContract.parties}</p>
                {viewingContract.partiesSub && <p className="text-sm text-slate-600">{viewingContract.partiesSub}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Contract Value</p>
                <p className="text-base font-semibold text-[#2A3037]">{viewingContract.value}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Created Date</p>
                <p className="text-base text-[#2A3037]">{viewingContract.createdDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Status</p>
                <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${viewingContract.statusVariant === 'green' ? 'bg-green-50 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  {viewingContract.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { handleDownload(viewingContract); closeViewModal() }}
                  className="px-5 py-2.5 bg-[#3474E1] text-white text-base font-semibold rounded-xl hover:bg-[#2a5fc4] flex items-center gap-2 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </button>
                <button type="button" onClick={closeViewModal} className="px-5 py-2.5 border-2 border-slate-200 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
