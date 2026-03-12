import { useState, useEffect } from 'react'
import { borrowerApi } from './api'
import { FALLBACK_CONTRACTS } from './data/fallbackData'
import { FormInput, FormSelect } from './settings/SettingsComponents'

function normalizeContract(c, i) {
  return {
    id: c.id ?? c.contract_id ?? i,
    propertyImage: c.propertyImage ?? c.property_image ?? c.property_image_url ?? '',
    propertyName: c.propertyName ?? c.property_name ?? c.property ?? '—',
    location: c.location ?? c.property_location ?? '',
    party: c.party ?? c.borrower_name ?? '—',
    lender: c.lender ?? c.lender_name ?? '—',
    contractValue: Number(c.contractValue ?? c.contract_value ?? c.value) ?? 0,
    createdDate: c.createdDate ?? c.created_date ?? c.created_at ?? '—',
    status: c.status ?? '—'
  }
}

function getContractList(res) {
  const d = res?.data?.data !== undefined ? res.data.data : res?.data
  if (Array.isArray(d)) return d
  if (d?.contracts) return d.contracts
  if (d?.items) return d.items
  return []
}

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Under Contract', label: 'Under Contract' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' }
]

export default function Contracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewingContract, setViewingContract] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)
  const [formData, setFormData] = useState({
    propertyAddress: '',
    party: '',
    lender: '',
    contractValue: '',
    status: 'Draft',
    date: new Date().toISOString().split('T')[0]
  })
  const [propertyPhotos, setPropertyPhotos] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setError(null)
    const load = async () => {
      try {
        const res = await borrowerApi.getContracts()
        if (cancelled) return
        const list = getContractList(res)
        const normalized = list.length > 0 ? list.map(normalizeContract) : FALLBACK_CONTRACTS.map((c, i) => normalizeContract(c, i))
        setContracts(normalized)
      } catch (e) {
        if (!cancelled) {
          setContracts(FALLBACK_CONTRACTS.map((c, i) => normalizeContract(c, i)))
          const isNetworkError = e?.code === 'ERR_NETWORK' || e?.message === 'Network Error'
          if (!isNetworkError) setError(e?.message || 'Failed to load contracts')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleView = (contract) => setViewingContract(contract)

  const handleDownload = async (contract) => {
    setDownloadingId(contract.id)
    try {
      const res = await borrowerApi.downloadContract(contract.id)
      if (res.data && res.data instanceof Blob && res.data.size > 0) {
        const url = window.URL.createObjectURL(res.data)
        const a = document.createElement('a')
        a.href = url
        a.download = `contract-${contract.id}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('No file')
      }
    } catch {
      const content = `Contract: ${contract.id}\nProperty: ${contract.propertyName}\nLocation: ${contract.location}\nParties: ${contract.party}, ${contract.lender}\nValue: $${contract.contractValue.toLocaleString()}\nStatus: ${contract.status}\nCreated: ${contract.createdDate}`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contract-${contract.id}.txt`
      a.click()
      window.URL.revokeObjectURL(url)
    }
    setDownloadingId(null)
  }

  const closeViewModal = () => setViewingContract(null)
  
  const closeCreateModal = () => {
    setShowCreateModal(false)
    setFormData({
      propertyAddress: '',
      party: '',
      lender: '',
      contractValue: '',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    })
    setPropertyPhotos([])
    setPhotoPreviews([])
    setFormErrors({})
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newPhotos = [...propertyPhotos, ...files]
    setPropertyPhotos(newPhotos)

    // Create previews
    const newPreviews = []
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target.result)
        if (newPreviews.length === files.length) {
          setPhotoPreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => {
    setPropertyPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.propertyAddress.trim()) errors.propertyAddress = 'Property address is required'
    if (!formData.party.trim()) errors.party = 'Party is required'
    if (!formData.lender.trim()) errors.lender = 'Lender is required'
    if (!formData.contractValue || Number(formData.contractValue) <= 0) {
      errors.contractValue = 'Contract value must be greater than 0'
    }
    if (!formData.date) errors.date = 'Date is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Create contract object
      const newContract = {
        id: `MIP-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`,
        propertyName: formData.propertyAddress.split(',')[0] || formData.propertyAddress,
        location: formData.propertyAddress.split(',').slice(1).join(',').trim() || '',
        propertyImage: photoPreviews[0] || '',
        party: formData.party,
        lender: formData.lender,
        contractValue: Number(formData.contractValue),
        createdDate: new Date(formData.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: formData.status
      }

      // Upload photos if any
      if (propertyPhotos.length > 0) {
        // In production, upload photos to backend
        // await borrowerApi.uploadContractPhotos(newContract.id, propertyPhotos)
      }

      // Add to contracts list
      setContracts(prev => [newContract, ...prev])
      
      // In production, save to backend
      // await borrowerApi.createContract(newContract)

      closeCreateModal()
    } catch (err) {
      setFormErrors({ submit: err?.message || 'Failed to create contract' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Contracts</h1>
        <div className="flex items-center justify-center py-20 text-slate-500">Loading contracts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contracts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your mortgage resolution case</p>
          {error && <p className="text-sm text-amber-600 mt-1">{error}</p>}
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded inline-flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Create New Contract</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Contracts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-sm font-medium text-slate-600 px-6 py-3">Property</th>
                <th className="text-left text-sm font-medium text-slate-600 px-6 py-3">Contract ID</th>
                <th className="text-left text-sm font-medium text-slate-600 px-6 py-3">Parties</th>
                <th className="text-left text-sm font-medium text-slate-600 px-6 py-3">Contract Value</th>
                <th className="text-left text-sm font-medium text-slate-600 px-6 py-3">Created Date</th>
                <th className="text-left text-sm font-medium text-slate-600 px-6 py-3">Status</th>
                <th className="text-left text-sm font-medium text-slate-600 px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                    No contracts yet. Contracts appear here when a bid is accepted on My Case.
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {contract.propertyImage ? (
                          <img src={contract.propertyImage} alt={contract.propertyName} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center text-slate-400 text-xs">—</div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900">{contract.propertyName}</p>
                          <p className="text-xs text-slate-500">{contract.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-900">{contract.id}</span></td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-slate-900">{contract.party}</p>
                        <p className="text-xs text-slate-500">{contract.lender}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">${contract.contractValue.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-600">{contract.createdDate}</span></td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded ${contract.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button type="button" onClick={() => handleView(contract)} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View</button>
                        <button type="button" onClick={() => handleDownload(contract)} disabled={downloadingId === contract.id} className="text-slate-600 hover:text-slate-700 disabled:opacity-50" title="Download">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeViewModal}>
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Contract Details</h3>
              <button type="button" onClick={closeViewModal} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Contract ID</span><span className="font-medium text-slate-900">{viewingContract.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Property</span><span className="font-medium text-slate-900">{viewingContract.propertyName}, {viewingContract.location}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Party</span><span className="font-medium text-slate-900">{viewingContract.party}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Lender</span><span className="font-medium text-slate-900">{viewingContract.lender}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Contract Value</span><span className="font-medium text-slate-900">${viewingContract.contractValue.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Created</span><span className="font-medium text-slate-900">{viewingContract.createdDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium text-slate-900">{viewingContract.status}</span></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => handleDownload(viewingContract)} className="border border-slate-300 bg-white text-slate-700 text-sm px-4 py-2 rounded hover:bg-slate-50">Download</button>
              <button type="button" onClick={closeViewModal} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto" onClick={closeCreateModal}>
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Create New Contract</h3>
              <button type="button" onClick={closeCreateModal} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormInput
                    label="Property Address"
                    required
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                    placeholder="e.g., 45 Victoria Street, Potts Point, NSW 2011"
                    error={formErrors.propertyAddress}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property Photos
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded inline-flex items-center space-x-2 mb-3"
                      >
                        <span>📷</span>
                        <span>Upload Photos</span>
                      </label>
                      <p className="text-xs text-slate-500">JPG, PNG up to 10MB each</p>
                    </div>
                    {photoPreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {photoPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Property ${index + 1}`}
                              className="w-full h-24 object-cover rounded border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <FormInput
                  label="Party"
                  required
                  value={formData.party}
                  onChange={(e) => handleInputChange('party', e.target.value)}
                  placeholder="e.g., Sarah Mitchell"
                  error={formErrors.party}
                />

                <FormInput
                  label="Lender"
                  required
                  value={formData.lender}
                  onChange={(e) => handleInputChange('lender', e.target.value)}
                  placeholder="e.g., Commonwealth Bank"
                  error={formErrors.lender}
                />

                <FormInput
                  label="Contract Value"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.contractValue}
                  onChange={(e) => handleInputChange('contractValue', e.target.value)}
                  placeholder="e.g., 1250000"
                  error={formErrors.contractValue}
                />

                <FormSelect
                  label="Status"
                  required
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  options={STATUS_OPTIONS}
                  error={formErrors.status}
                />

                <div className="md:col-span-2">
                  <FormInput
                    label="Date"
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    error={formErrors.date}
                  />
                </div>
              </div>

              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm text-red-600">{formErrors.submit}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="border border-slate-300 bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded hover:bg-slate-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded inline-flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>Create Contract</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
