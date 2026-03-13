import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from './components/Breadcrumb'
import { borrowerApi } from './api'
import { MOCK_KYC_STEPS, MOCK_KYC_DRAFT_KEY, MOCK_KYC_STATUS_KEY, MOCK_BORROWER_PROFILE } from './data/borrowerMockData'

const getInitialForm = () => {
  try {
    const raw = localStorage.getItem(MOCK_KYC_DRAFT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.firstName === 'string') return parsed
    }
  } catch { /* ignore */ }
  const p = MOCK_BORROWER_PROFILE
  const nameParts = (p?.firstName && p?.lastName) ? [p.firstName, p.lastName] : ['', '']
  return {
    firstName: nameParts[0] || '',
    lastName: nameParts[1] || '',
    dob: '',
    address: p?.address ? [p.address.street, p.address.city, p.address.state, p.address.postcode].filter(Boolean).join(', ') : '',
    company: p?.company ?? '',
    abn: '',
  }
}

const STATUS_PENDING = 'pending'
const STATUS_VERIFIED = 'verified'
const STATUS_DRAFT = 'draft'

function readStoredStatus() {
  try {
    const raw = localStorage.getItem(MOCK_KYC_STATUS_KEY)
    if (raw === STATUS_VERIFIED || raw === STATUS_PENDING || raw === 'submitted') return raw === STATUS_VERIFIED ? STATUS_VERIFIED : STATUS_PENDING
  } catch { /* ignore */ }
  return STATUS_DRAFT
}

export default function IdentityVerification() {
  const navigate = useNavigate()
  const [verificationStatus, setVerificationStatus] = useState(readStoredStatus)
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const raw = localStorage.getItem(MOCK_KYC_STATUS_KEY)
      if (raw === 'submitted' || raw === STATUS_PENDING || raw === STATUS_VERIFIED) return 3
      const draft = localStorage.getItem(MOCK_KYC_DRAFT_KEY)
      if (draft) {
        const parsed = JSON.parse(draft)
        if (parsed?.step === 1 || parsed?.step === 2) return Number(parsed.step) || 2
      }
    } catch { /* ignore */ }
    return 2
  })
  const [form, setForm] = useState(getInitialForm)
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [saveDraftFeedback, setSaveDraftFeedback] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(MOCK_KYC_DRAFT_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.fileName) setFileName(parsed.fileName)
      } catch { /* ignore */ }
    }
  }, [])

  // Clear validation error when user edits form or selects a file
  useEffect(() => {
    if (submitError) setSubmitError('')
  }, [form.firstName, form.lastName, form.dob, form.address, fileName]) // eslint-disable-line react-hooks/exhaustive-deps -- clear error on form/file change only

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setFileName(f.name)
    }
  }

  const handleClearFile = () => {
    setFile(null)
    setFileName('')
    if (typeof document !== 'undefined') {
      const input = document.querySelector('input[type="file"][accept*="pdf"]')
      if (input) input.value = ''
    }
  }

  const handleSaveDraft = () => {
    setSubmitError('')
    const draft = { ...form, step: currentStep, fileName: fileName || undefined }
    try {
      localStorage.setItem(MOCK_KYC_DRAFT_KEY, JSON.stringify(draft))
      setSaveDraftFeedback('Draft saved. You can return later to continue.')
      setTimeout(() => setSaveDraftFeedback(''), 4000)
    } catch {
      setSaveDraftFeedback('Could not save draft. Check storage or try again.')
      setTimeout(() => setSaveDraftFeedback(''), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const required = [form.firstName?.trim(), form.lastName?.trim(), form.dob?.trim(), form.address?.trim()]
    if (required.some((v) => !v)) {
      setSubmitError('Please fill in First Name, Last Name, Date of Birth, and Address.')
      return
    }
    if (!file && !fileName) {
      setSubmitError('Please upload a government ID (PDF, JPG or PNG).')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('firstName', form.firstName.trim())
      formData.append('lastName', form.lastName.trim())
      formData.append('dob', form.dob.trim())
      formData.append('address', form.address.trim())
      if (form.company?.trim()) formData.append('company', form.company.trim())
      if (form.abn?.trim()) formData.append('abn', form.abn.trim())
      if (file instanceof File) formData.append('idDocument', file)
      else if (fileName) formData.append('idDocumentFileName', fileName)

      try {
        await borrowerApi.submitKYC(formData)
      } catch (apiErr) {
        const isNetworkError = apiErr?.code === 'ERR_NETWORK' || apiErr?.message === 'Network Error'
        if (isNetworkError || apiErr?.response?.status >= 500) {
          throw apiErr
        }
        const msg = apiErr?.response?.data?.message || apiErr?.response?.data?.error || apiErr?.message
        throw new Error(msg || 'Verification submission was rejected. Please check your details and try again.')
      }

      localStorage.setItem(MOCK_KYC_STATUS_KEY, STATUS_PENDING)
      localStorage.removeItem(MOCK_KYC_DRAFT_KEY)
      setVerificationStatus(STATUS_PENDING)
      setCurrentStep(3)
      setFile(null)
      setFileName('')
      setForm(getInitialForm())
      setSubmitError('')
    } catch (err) {
      const isNetworkError = err?.code === 'ERR_NETWORK' || err?.message === 'Network Error'
      if (isNetworkError) {
        await new Promise((r) => setTimeout(r, 600))
        localStorage.setItem(MOCK_KYC_STATUS_KEY, STATUS_PENDING)
        localStorage.removeItem(MOCK_KYC_DRAFT_KEY)
        setVerificationStatus(STATUS_PENDING)
        setCurrentStep(3)
        setFile(null)
        setFileName('')
        setForm(getInitialForm())
      } else {
        setSubmitError(err?.message || 'Submission failed. Please try again or contact support.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@brickbanq.com?subject=Identity%20Verification%20Support'
  }

  const handleSubmitAgain = () => {
    try {
      localStorage.setItem(MOCK_KYC_STATUS_KEY, STATUS_DRAFT)
    } catch { /* ignore */ }
    setVerificationStatus(STATUS_DRAFT)
    setCurrentStep(2)
    setForm(getInitialForm())
    setSubmitError('')
    setSaveDraftFeedback('')
    setFileName('')
    setFile(null)
  }

  const handleMarkVerifiedForDemo = () => {
    try {
      localStorage.setItem(MOCK_KYC_STATUS_KEY, STATUS_VERIFIED)
    } catch { /* ignore */ }
    setVerificationStatus(STATUS_VERIFIED)
  }

  const handleBackToDashboard = () => {
    navigate('/borrower/dashboard')
  }

  const steps = MOCK_KYC_STEPS

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Complete your KYC to access the platform</p>
      </div>

      <Breadcrumb items={[
        { label: 'Dashboard', path: '/borrower/dashboard' },
        { label: 'Identity Verification' },
      ]} />

      {/* Dynamic step indicator */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
        {steps.map((s, i) => {
          const isActive = currentStep === s.step
          const isPast = currentStep > s.step
          const isLast = i === steps.length - 1
          return (
            <div key={s.step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isPast ? 'bg-emerald-500 text-white' : isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isPast ? '✓' : s.step}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.sublabel}</p>
                </div>
              </div>
              {!isLast && (
                <div className={`w-8 h-0.5 shrink-0 ${isPast ? 'bg-indigo-600' : 'bg-gray-200'}`} aria-hidden />
              )}
            </div>
          )
        })}
      </div>

      {currentStep !== 3 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900">Identity Verification</h2>
          <p className="text-sm text-gray-500 mt-1">Complete your KYC verification to access the platform</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={form.dob}
                  onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  placeholder="Street, City, State, Postcode"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ABN (Optional)</label>
                <input
                  type="text"
                  placeholder="65 XXX XXX XXX"
                  value={form.abn}
                  onChange={(e) => setForm((f) => ({ ...f, abn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Government ID *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <span className="text-3xl text-gray-400 block mb-2">☁️</span>
                <p className="text-sm text-gray-600">Drag and drop your ID here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <label className="mt-2 inline-block border border-gray-300 bg-white text-gray-700 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                  Choose File
                  <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                </label>
                {fileName && (
                  <p className="text-sm text-emerald-600 mt-2 font-medium flex items-center justify-center gap-2 flex-wrap">
                    <span>Selected: {fileName}</span>
                    <button type="button" onClick={handleClearFile} className="text-red-600 hover:text-red-700 text-xs font-medium underline">
                      Clear
                    </button>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">Accepted formats: PDF, JPG, PNG (max 50MB)</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="font-semibold text-blue-800 flex items-center gap-2">ℹ Acceptable Documents</p>
                <ul className="text-sm text-blue-800 mt-1 list-disc list-inside">
                  <li>Driver&apos;s License (front and back)</li>
                  <li>Passport (photo page)</li>
                  <li>National ID Card</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">Ensure all text is clearly visible and the document is uncropped.</p>
              </div>
            </div>
          </form>

          {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}
          {saveDraftFeedback && <p className="text-sm text-emerald-600 mt-2">{saveDraftFeedback}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-label="Submit identity verification for admin review"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                'Submit for Review'
              )}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-lg mx-auto text-center space-y-5">
          {verificationStatus === STATUS_PENDING && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden />
                Verification is pending
              </div>
              <p className="text-lg font-semibold text-gray-900">Verification is pending</p>
              <p className="text-sm text-gray-600">
                Your identity verification has been submitted. An admin will review your documents and approve your verification. This status will remain until approval is complete.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={handleBackToDashboard} className="border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">
                  Back to Dashboard
                </button>
                <button type="button" onClick={handleSubmitAgain} className="border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">
                  Submit again
                </button>
                <button type="button" onClick={handleContactSupport} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                  Contact Support
                </button>
              </div>
              <p className="text-xs text-gray-400 pt-2">
                Demo: Admin can approve from their dashboard. To simulate approval here,{' '}
                <button type="button" onClick={handleMarkVerifiedForDemo} className="text-indigo-600 hover:underline font-medium">
                  mark as verified
                </button>
                .
              </p>
            </>
          )}
          {verificationStatus === STATUS_VERIFIED && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
                <span className="text-emerald-600">✓</span> Verified
              </div>
              <p className="text-lg font-semibold text-gray-900">Identity verified</p>
              <p className="text-sm text-gray-600">Your identity has been approved. You have full access to the platform.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={handleBackToDashboard} className="border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">
                  Back to Dashboard
                </button>
                <button type="button" onClick={handleContactSupport} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                  Contact Support
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
