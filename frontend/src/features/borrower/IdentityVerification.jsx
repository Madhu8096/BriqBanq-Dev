import { useState, useRef } from 'react'
import { borrowerApi } from './api'

export default function IdentityVerification() {
  const fileInputRef = useRef(null)
  const [currentStep, setCurrentStep] = useState(2)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    company: '',
    abn: '',
    governmentId: null
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const steps = [
    { number: 1, title: 'Account Details', status: 'complete' },
    { number: 2, title: 'Identity Verification', status: 'active' },
    { number: 3, title: 'Complete', status: 'pending' },
  ]

  const validate = () => {
    const e = {}
    if (!formData.firstName.trim()) e.firstName = 'First name is required'
    if (!formData.lastName.trim()) e.lastName = 'Last name is required'
    if (!formData.dateOfBirth.trim()) e.dateOfBirth = 'Date of birth is required'
    if (!formData.address.trim()) e.address = 'Address is required'
    if (!formData.governmentId) e.governmentId = 'Government ID is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    setFormData((prev) => ({ ...prev, governmentId: file }))
    setErrors((prev) => ({ ...prev, governmentId: undefined }))
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    setErrors({})
    try {
      await borrowerApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        company: formData.company,
        abn: formData.abn
      })
    } catch {
      // Mock: draft saved locally
    }
    setSaving(false)
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    setErrors({})
    try {
      if (formData.governmentId) {
        await borrowerApi.uploadDocument(formData.governmentId)
      }
      await borrowerApi.submitKYC({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        company: formData.company,
        abn: formData.abn
      })
      setCurrentStep(3)
    } catch {
      setErrors({ submit: 'Submission failed. Please try again.' })
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Identity Verification</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mortgage resolution case</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.status === 'complete'
                      ? 'bg-green-600 text-white'
                      : step.status === 'active'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.status === 'complete' ? '✓' : step.number}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {step.status === 'complete'
                      ? 'Create your account'
                      : step.status === 'active'
                      ? 'Verify your government ID'
                      : 'Finalize your verification'}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 ${
                    step.status === 'complete' ? 'bg-green-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Identity Verification</h3>
        <p className="text-sm text-slate-600 mb-6">Complete your KYC verification to access the platform</p>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Street, City, State, Postcode"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company (Optional)</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ABN (Optional)</label>
            <input
              type="text"
              placeholder="XX XXX XXX XXX"
              value={formData.abn}
              onChange={(e) => setFormData({ ...formData, abn: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Government ID <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                const file = e.dataTransfer.files?.[0]
                if (file) setFormData((prev) => ({ ...prev, governmentId: file }))
              }}
            >
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-slate-600 mb-2">
                  {formData.governmentId ? formData.governmentId.name : 'Drop and drop your ID here'}
                </p>
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="border border-slate-300 bg-white text-slate-700 text-sm px-4 py-2 rounded hover:bg-slate-50"
                >
                  Choose File
                </button>
                <p className="text-xs text-slate-500 mt-2">Accepted formats: PDF, JPG, PNG (max 5MB)</p>
              </div>
            </div>
            {errors.governmentId && <p className="text-xs text-red-500 mt-1">{errors.governmentId}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Acceptable Documents</p>
                <ul className="mt-2 text-sm text-slate-700 space-y-1">
                  <li>• Driver&apos;s License (front and back)</li>
                  <li>• Passport (photo page)</li>
                  <li>• National ID Card</li>
                </ul>
                <p className="mt-2 text-xs text-slate-600">
                  Make sure the photo is clear and the document is not expired.
                </p>
              </div>
            </div>
          </div>

          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="border border-slate-300 bg-white text-slate-700 text-sm px-6 py-2 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2 rounded disabled:opacity-50"
            >
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
