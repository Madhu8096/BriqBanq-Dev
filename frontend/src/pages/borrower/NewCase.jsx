import { useState } from 'react'

const STEPS = [
  { id: 1, label: 'Property' },
  { id: 2, label: 'Entity' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Lender' },
  { id: 5, label: 'Loan' },
  { id: 6, label: 'Features' },
  { id: 7, label: 'Parties' },
  { id: 8, label: 'NCCP' },
  { id: 9, label: 'Disclosure' },
  { id: 10, label: 'Review' },
  { id: 11, label: 'Submit' },
]

const initialFormData = {
  streetAddress: '45 Victoria Street',
  suburb: 'Potts Point',
  state: 'NSW',
  postcode: '2011',
  propertyType: 'House',
  intendedLoanAmount: '650000',
  typeOfSecurity: 'Registered Mortgage',
  mortgageOnTitle: true,
  mortgagePriority: 'First Mortgage',
  securityAgreementDate: '',
  descriptionSecuredProperty: '',
  confirmPPSA: false,
  lenderName: 'Commonwealth Bank of Australia',
  lenderContact: 'John Doe - Loan Manager',
  lenderEmail: 'lender@bank.com.au',
  lenderPhone: '1300 000 000',
  loanAccountNumber: '123456789',
  outstandingDebt: '450000',
  originalLoanAmount: '500000',
  loanStartDate: '',
  repaymentType: 'Principal & Interest',
  interestRate: '5.5',
  missedPayments: '3',
  totalArrears: '150',
  defaultNoticeDate: '',
  currentValuation: '650000',
  valuationProvider: 'Preston Roose Paterson',
  valuationDate: '',
  yearBuilt: '1995',
  floorArea: '190',
  numberOfStoreys: '2',
  constructionType: '',
  roofType: '',
  propertyCondition: 'Good',
  recentRenovations: 'Kitchen renovation 2022, new roof 2021, etc.',
  specialFeatures: 'Swimming pool, tennis court, granny flat, solar panels, etc.',
  councilRates: '2500',
  waterRates: '800',
  strataFees: '1200',
  landTax: '0',
  insuranceProvider: 'NRMA, RACV, etc.',
  sumInsured: '800000',
  insuranceExpiry: '',
  lastSalePrice: '850000',
  lastSaleDate: '',
  priorSalePrice: '650000',
  priorSaleDate: '',
  borrowerLawyerName: 'John Smith',
  borrowerLawyerEmail: 'john@smithlaw.com.au',
  borrowerLawyerLicense: 'NSW 12345',
  borrowerLawFirm: 'Smith & Associates',
  borrowerLawyerPhone: '(02) 9000 0000',
  reasonForDefault: '',
  hardshipCircumstances: '',
  borrowerCooperation: 'Yes - Fully Cooperative',
  possessionStatus: 'Owner Occupied',
  additionalNotes: '',
  caseUrgency: 'Medium - Priority processing (14-30 days)',
  cardholderName: 'John Smith',
  cardNumber: '1234 5678 9012 3456',
  expiryDate: '12/26',
  cvv: '123',
  billingAddress: 'Same as residential address',
  billingPostcode: '2000',
  // Step 2 Entity
  entityType: 'Personal',
  companyName: '',
  abn: '',
  acn: '',
  registrationDate: '',
  companyType: 'Proprietary (Pty Ltd)',
  trustName: 'Smith Family Trust',
  trustType: 'Family Trust',
  trustABN: '12 345 678 900',
  trustEstablishmentDate: '',
  firstName: 'John',
  lastName: 'Smith',
  dateOfBirth: '',
  phoneNumber: '0400 000 000',
  emailAddress: 'john.smith@example.com',
  residentialAddress: '455 Residential Street, Sydney NSW 2000',
  postalAddress: 'PO Box 123, Sydney NSW 2000',
  occupation: 'Software Engineer',
  employer: 'ABC Company',
  employmentStatus: '',
  annualIncome: '75000',
  directorsCount: 0,
  shareholdersCount: 0,
  trusteesCount: 0,
  guarantorsCount: 0,
  creditCheckConsent: false,
  paymentAuthorized: false,
  paymentMethod: 'Credit Card',
}

const LENDER_DOCS = [
  { title: 'Original Loan Agreement*', desc: 'Original executed loan contract, terms and conditions, signed agreements.' },
  { title: 'Loan Variations & Amendments*', desc: 'Any variations, amendments, modifications to original loan terms.' },
  { title: 'Bank Statements (Last 6 Months)*', desc: 'Recent bank statements showing loan account activity, payments, arrears.' },
  { title: 'Payout Letter*', desc: "Lender's payout figure, discharge costs, settlement instructions." },
  { title: 'Formal Credit Approvals*', desc: 'Original credit approval, assessment documents, lending criteria.' },
  { title: 'Registered Mortgage Documents*', desc: 'Registered mortgage, vesting notices, priority notices.' },
  { title: 'Security Documents*', desc: 'General security agreements, guarantees, additional security.' },
  { title: 'Insurance Certificate', desc: "Lender's mortgage insurance (LMI), building insurance certificates." },
  { title: 'Loan Account History*', desc: 'Repayment history, payment and schedule, interest calculations.' },
  { title: 'Arrears Summary*', desc: 'Detailed arrears breakdown, missed payments, default notices issued.' },
  { title: 'Legal Advice Signed*', desc: 'Signed legal advice documents, solicitor letters, legal representation confirmation.' },
  { title: 'Privacy Consent Signed*', desc: 'Signed privacy consent forms, authorization to share information, disclosure agreements.' },
]

export default function NewCase({ onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [propertyValidating, setPropertyValidating] = useState(false)
  const [propertyValidated, setPropertyValidated] = useState(false)
  const [directors, setDirectors] = useState([])
  const [shareholders, setShareholders] = useState([])
  const [trustees, setTrustees] = useState([])
  const [guarantors, setGuarantors] = useState([])
  const [runningChecks, setRunningChecks] = useState(false)
  const [checksComplete, setChecksComplete] = useState(false)
  const [uploadedLenderDocs, setUploadedLenderDocs] = useState(() => new Set())
  const [valuationUploaded, setValuationUploaded] = useState(false)
  const [insuranceUploaded, setInsuranceUploaded] = useState(false)
  const [supportingDocs, setSupportingDocs] = useState({ title: false, certificate: false, report: false })
  const [runAnalysisLoading, setRunAnalysisLoading] = useState(false)
  const [runAnalysisResult, setRunAnalysisResult] = useState(null)
  const [pendingTrustee, setPendingTrustee] = useState(null)
  const [pendingGuarantor, setPendingGuarantor] = useState(null)

  const update = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }))

  const handlePrev = () => setStep((s) => Math.max(1, s - 1))
  const handleNext = () => {
    if (step === 11) {
      setSubmitting(true)
      setTimeout(() => {
        setSubmitting(false)
        onSuccess?.()
      }, 800)
      return
    }
    setStep((s) => Math.min(11, s + 1))
  }

  const handleValidateProperty = () => {
    setPropertyValidating(true)
    setTimeout(() => {
      setPropertyValidating(false)
      setPropertyValidated(true)
    }, 1500)
  }

  const addDirector = () => {
    const n = directors.length + 1
    setDirectors((prev) => [...prev, { id: Date.now(), name: `Director ${n}` }])
    update('directorsCount', n)
  }
  const addShareholder = () => {
    const n = shareholders.length + 1
    setShareholders((prev) => [...prev, { id: Date.now(), name: `Shareholder ${n}` }])
    update('shareholdersCount', n)
  }
  const addTrustee = () => {
    setPendingTrustee({ trusteeType: 'Individual Trustee', name: '' })
  }
  const saveTrustee = () => {
    if (!pendingTrustee) return
    const { trusteeType, name } = pendingTrustee
    setTrustees((prev) => [...prev, { id: Date.now(), trusteeType: trusteeType || 'Individual Trustee', name: name || 'Unnamed Trustee' }])
    update('trusteesCount', trustees.length + 1)
    setPendingTrustee(null)
  }
  const cancelTrustee = () => setPendingTrustee(null)
  const removeTrustee = (id) => {
    setTrustees((prev) => {
      const next = prev.filter((x) => x.id !== id)
      update('trusteesCount', next.length)
      return next
    })
  }

  const addGuarantor = () => {
    setPendingGuarantor({ guarantorType: 'Individual', name: '', dateOfBirth: '', phone: '', email: '' })
  }
  const saveGuarantor = () => {
    if (!pendingGuarantor) return
    const { guarantorType, name, dateOfBirth, phone, email } = pendingGuarantor
    setGuarantors((prev) => [
      ...prev,
      { id: Date.now(), guarantorType: guarantorType || 'Individual', name: name || 'Unnamed Guarantor', dateOfBirth: dateOfBirth || '', phone: phone || '', email: email || '' },
    ])
    update('guarantorsCount', guarantors.length + 1)
    setPendingGuarantor(null)
  }
  const cancelGuarantor = () => setPendingGuarantor(null)
  const removeGuarantor = (id) => {
    setGuarantors((prev) => {
      const next = prev.filter((x) => x.id !== id)
      update('guarantorsCount', next.length)
      return next
    })
  }

  const handleRunAllChecks = () => {
    setRunningChecks(true)
    setTimeout(() => {
      setRunningChecks(false)
      setChecksComplete(true)
    }, 2000)
  }

  const handleUploadLenderDoc = (title) => {
    setUploadedLenderDocs((prev) => new Set(prev).add(title))
  }

  const handleUploadValuation = () => setValuationUploaded(true)
  const handleUploadInsurance = () => setInsuranceUploaded(true)
  const handleUploadSupporting = (key) => setSupportingDocs((prev) => ({ ...prev, [key]: true }))

  const handleRunAnalysis = () => {
    setRunAnalysisLoading(true)
    setRunAnalysisResult(null)
    setTimeout(() => {
      setRunAnalysisLoading(false)
      setRunAnalysisResult('Compliance check complete. No issues detected. All required disclosures and consent flags are in order. Data verification passed.')
    }, 1800)
  }

  const lenderDocsCompleted = uploadedLenderDocs.size

  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full min-w-0 pb-4">
      {/* Demo banner - light blue, dark blue text */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-4 py-3 text-sm text-[#1E40AF] flex gap-2">
        <span className="shrink-0 text-[#2563EB]" aria-hidden>ℹ</span>
        <span><strong>Development/Demo Mode Active.</strong> Property detections are pre-accepted in this demo environment to allow testing and exploration. In production, users must complete the full Professional declarations page before creating cases.</span>
      </div>

      {/* Header: title, subtitle, Back to Cases (link style) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 id="submit-case-title" className="text-xl sm:text-2xl font-bold text-slate-900">
            Submit New Case
          </h1>
          <p className="text-sm text-slate-500 mt-1">Complete property & identity verification for your mortgage resolution case</p>
        </div>
        <button type="button" onClick={onClose} className="text-[#4F46E5] text-sm font-medium hover:underline shrink-0 self-start sm:self-center flex items-center gap-1">
          <span>←</span> Back to Dashboard
        </button>
      </div>

      {/* Stepper - Step 1 blue, others grey; connectors */}
      <div className="overflow-x-auto">
        <div className="flex items-start gap-0 min-w-max pb-1">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <button type="button" onClick={() => setStep(s.id)} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${step === s.id ? 'bg-[#4F46E5] border-[#4F46E5] text-white' : step > s.id ? 'bg-indigo-100 border-indigo-200 text-indigo-700 hover:bg-indigo-200' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'}`} aria-label={`Go to step ${s.id}: ${s.label}`}>
                  {step > s.id ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : s.id}
                </button>
                <span className={`text-xs mt-1.5 whitespace-nowrap max-w-[4.5rem] text-center font-medium ${step === s.id ? 'text-[#4F46E5]' : step > s.id ? 'text-indigo-600' : 'text-slate-500'}`}>{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-4 sm:w-6 h-0.5 mx-0.5 mt-4 shrink-0 ${step > s.id ? 'bg-indigo-200' : 'bg-slate-200'}`} aria-hidden />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">*Step skipped (NCCP does not apply to this loan)</p>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {step === 1 && (
          <div className="p-5 sm:p-6 space-y-6">
            {/* Property Details - light blue card, subtle border */}
            <section>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-lg">🏠</span>
                Property Details
              </h2>
              <p className="text-sm text-slate-500 mt-1">Enter property address for RP Data validation</p>
              <div className="mt-4 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address * <span className="text-slate-500 font-normal">(Auto-complete enabled)</span></label>
                    <input type="text" value={formData.streetAddress} onChange={(e) => update('streetAddress', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]" placeholder="Street address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Suburb *</label>
                    <input type="text" value={formData.suburb} onChange={(e) => update('suburb', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white" placeholder="Suburb" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                    <select value={formData.state} onChange={(e) => update('state', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                      <option>NSW</option>
                      <option>VIC</option>
                      <option>QLD</option>
                      <option>WA</option>
                      <option>SA</option>
                      <option>TAS</option>
                      <option>ACT</option>
                      <option>NT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Postcode *</label>
                    <input type="text" value={formData.postcode} onChange={(e) => update('postcode', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white" placeholder="Postcode" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Property Type *</label>
                    <select value={formData.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                      <option>House</option>
                      <option>Apartment</option>
                      <option>Townhouse</option>
                      <option>Land</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Intended Loan Amount (A$) *</label>
                    <input type="text" value={formData.intendedLoanAmount} onChange={(e) => update('intendedLoanAmount', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white" placeholder="Amount" />
                  </div>
                </div>
                <button type="button" onClick={handleValidateProperty} disabled={propertyValidating} className="mt-5 w-full sm:w-auto px-5 py-2.5 bg-[#4F46E5] text-white text-sm font-medium rounded-md hover:bg-[#4338CA] disabled:opacity-70 flex items-center justify-center gap-2">
                  {propertyValidating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Validating…
                    </>
                  ) : propertyValidated ? (
                    <>
                      <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      Property validated
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Validate & Pull Property Data
                    </>
                  )}
                </button>
                {propertyValidated && <p className="mt-2 text-sm text-green-600">Address verified. Property data loaded for {formData.streetAddress}, {formData.suburb}.</p>}
              </div>
            </section>

            {/* Security Requirements (PPSA) - purple accent header */}
            <section>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full border-2 border-[#7C3AED] flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" /></span>
                Security Requirements (PPSA Compliance)
              </h2>
              <p className="text-sm text-slate-500 mt-1">Personal Property Securities Act 2009 - Ensure security interests are properly registered</p>
              {/* PPSA warning - light yellow, yellow icon */}
              <div className="mt-4 p-4 bg-[#FEF3C7] border border-[#FCD34D] rounded-lg flex gap-3">
                <span className="text-[#D97706] shrink-0 text-lg" aria-hidden>⚠</span>
                <div>
                  <p className="text-sm font-semibold text-[#92400E]">PPSA Compliance Required</p>
                  <p className="text-sm text-[#92400E] mt-0.5">Under the Personal Property Securities Act 2009, all security interests in personal property must be registered on the PPSR to be enforceable against third parties. For real property mortgages, registration on title is required.</p>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type of Security *</label>
                  <select value={formData.typeOfSecurity} onChange={(e) => update('typeOfSecurity', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]">
                    <option value="Registered Mortgage">Registered Mortgage</option>
                    <option value="General Security Agreement">General Security Agreement</option>
                    <option value="Security over Specific Goods">Security over Specific Goods</option>
                    <option value="Purchase Money Security Interests">Purchase Money Security Interests</option>
                    <option value="Unsecured">Unsecured</option>
                  </select>
                </div>
                {/* Registered Mortgage Requirements = checkbox + description */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.mortgageOnTitle} onChange={(e) => update('mortgageOnTitle', e.target.checked)} className="rounded border-slate-300 text-[#7C3AED] mt-0.5 shrink-0 focus:ring-[#7C3AED]" />
                  <div>
                    <span className="text-sm font-medium text-slate-700">Mortgage Registered on Title *</span>
                    <p className="text-xs text-slate-500 mt-0.5">Confirm that the mortgage is registered on the Certificate of Title at the relevant Land Titles Office (Real Property Act).</p>
                  </div>
                </label>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mortgage Priority *</label>
                  <select value={formData.mortgagePriority} onChange={(e) => update('mortgagePriority', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]">
                    <option value="First Mortgage">First Mortgage</option>
                    <option value="Second">Second</option>
                    <option value="Third">Third</option>
                    <option value="Subordinated">Subordinated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Security Agreement Date</label>
                  <input type="text" value={formData.securityAgreementDate} onChange={(e) => update('securityAgreementDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]" placeholder="mm/dd/yyyy" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description of Secured Property</label>
                  <textarea value={formData.descriptionSecuredProperty} onChange={(e) => update('descriptionSecuredProperty', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]" rows={3} placeholder="Describe the property or assets that are subject to the security interest..." />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.confirmPPSA} onChange={(e) => update('confirmPPSA', e.target.checked)} className="rounded border-slate-300 text-[#7C3AED] mt-0.5 shrink-0 focus:ring-[#7C3AED]" />
                  <div>
                    <span className="text-sm font-medium text-[#6D28D9]">I confirm PPSA compliance for this security interest *</span>
                    <p className="text-xs text-slate-500 mt-0.5">I confirm that all security interests have been properly perfected according to PPSA requirements, including registration where required, and all necessary searches have been conducted.</p>
                  </div>
                </label>
              </div>
            </section>
          </div>
        )}

        {step === 2 && (
          <div className="p-5 sm:p-6 space-y-6">
            {/* Main heading */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </span>
                Borrower Details & Entity Structure
              </h2>
              <p className="text-sm text-slate-500 mt-1">Define the borrowing entity and all related parties</p>
            </div>

            {/* Borrowing Entity Type */}
            <section>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                Borrowing Entity Type
              </h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Select the type of entity borrowing the funds</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button type="button" onClick={() => update('entityType', 'Personal')} className={`rounded-lg border-2 p-4 text-left transition-colors ${formData.entityType === 'Personal' ? 'border-[#3B82F6] bg-[#EFF6FF]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <span className={`block w-9 h-9 rounded-full flex items-center justify-center mb-3 ${formData.entityType === 'Personal' ? 'bg-[#3B82F6] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </span>
                  <span className={`block font-semibold ${formData.entityType === 'Personal' ? 'text-[#1D4ED8]' : 'text-slate-900'}`}>Personal</span>
                  <span className={`block text-sm mt-0.5 ${formData.entityType === 'Personal' ? 'text-[#2563EB]' : 'text-slate-500'}`}>Individual borrower</span>
                </button>
                <button type="button" onClick={() => update('entityType', 'Company')} className={`rounded-lg border-2 p-4 text-left transition-colors ${formData.entityType === 'Company' ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <span className={`block w-9 h-9 rounded-full flex items-center justify-center mb-3 ${formData.entityType === 'Company' ? 'bg-[#7C3AED] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </span>
                  <span className={`block font-semibold ${formData.entityType === 'Company' ? 'text-[#6D28D9]' : 'text-slate-900'}`}>Company</span>
                  <span className={`block text-sm mt-0.5 ${formData.entityType === 'Company' ? 'text-[#7C3AED]' : 'text-slate-500'}`}>Corporate entity</span>
                </button>
                <button type="button" onClick={() => update('entityType', 'Trust')} className={`rounded-lg border-2 p-4 text-left transition-colors ${formData.entityType === 'Trust' ? 'border-[#EA580C] bg-[#FFF7ED]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <span className={`block w-9 h-9 rounded-full flex items-center justify-center mb-3 ${formData.entityType === 'Trust' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </span>
                  <span className={`block font-semibold ${formData.entityType === 'Trust' ? 'text-[#C2410C]' : 'text-slate-900'}`}>Trust</span>
                  <span className={`block text-sm mt-0.5 ${formData.entityType === 'Trust' ? 'text-[#EA580C]' : 'text-slate-500'}`}>Trust structure</span>
                </button>
              </div>
            </section>

            {/* Company Details - when Company selected */}
            {formData.entityType === 'Company' && (
              <section className="rounded-lg border border-[#E9E5FF] bg-[#FAFAFF] p-4 sm:p-5">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </span>
                  Company Details
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
                    <input type="text" value={formData.companyName} onChange={(e) => update('companyName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="ABC Pty Ltd" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ABN</label>
                    <input type="text" value={formData.abn} onChange={(e) => update('abn', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="12 345 678 901" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ACN *</label>
                    <input type="text" value={formData.acn} onChange={(e) => update('acn', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="123 456 789" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration Date</label>
                    <input type="text" value={formData.registrationDate} onChange={(e) => update('registrationDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="mm/dd/yyyy" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Type</label>
                    <select value={formData.companyType} onChange={(e) => update('companyType', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white">
                      <option value="Proprietary (Pty Ltd)">Proprietary (Pty Ltd)</option>
                      <option value="Public">Public</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* Directors - when Company */}
            {formData.entityType === 'Company' && (
              <section className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </span>
                      Directors ({formData.directorsCount})
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">All directors must be verified</p>
                  </div>
                  <button type="button" onClick={addDirector} className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-md hover:bg-[#1D4ED8] flex items-center gap-2 shrink-0">
                    <span>+</span> Add Director
                  </button>
                </div>
                {directors.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {directors.map((d) => (
                      <li key={d.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-slate-200 text-sm">
                        <span className="font-medium text-slate-700">{d.name}</span>
                        <button type="button" onClick={() => { setDirectors((p) => { const next = p.filter((x) => x.id !== d.id); update('directorsCount', next.length); return next; }); }} className="text-red-600 hover:underline text-xs">Remove</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 mt-4">No directors added yet. Click &apos;Add Director&apos; to begin.</p>
                )}
              </section>
            )}

            {/* Shareholders - when Company */}
            {formData.entityType === 'Company' && (
              <section className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#16A34A] flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </span>
                      Shareholders with 25%+ Ownership ({formData.shareholdersCount})
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">AML/CTF Act requires verification of beneficial owners with 25%+ shareholding</p>
                  </div>
                  <button type="button" onClick={addShareholder} className="px-4 py-2 bg-[#16A34A] text-white text-sm font-medium rounded-md hover:bg-[#15803D] flex items-center gap-2 shrink-0">
                    <span>+</span> Add Shareholder
                  </button>
                </div>
                {shareholders.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {shareholders.map((s) => (
                      <li key={s.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-slate-200 text-sm">
                        <span className="font-medium text-slate-700">{s.name}</span>
                        <button type="button" onClick={() => { setShareholders((p) => { const next = p.filter((x) => x.id !== s.id); update('shareholdersCount', next.length); return next; }); }} className="text-red-600 hover:underline text-xs">Remove</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 mt-4">No shareholders added yet. Click &apos;Add Shareholder&apos; to begin.</p>
                )}
              </section>
            )}

            {/* Trust Details - when Trust selected */}
            {formData.entityType === 'Trust' && (
              <section className="rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-4 sm:p-5">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#EA580C] flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </span>
                  Trust Details
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Trust Name *</label>
                    <input type="text" value={formData.trustName} onChange={(e) => update('trustName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="Smith Family Trust" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Trust Type</label>
                    <select value={formData.trustType} onChange={(e) => update('trustType', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white">
                      <option value="Family Trust">Family Trust</option>
                      <option value="Unit Trust">Unit Trust</option>
                      <option value="Discretionary Trust">Discretionary Trust</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ABN (if registered)</label>
                    <input type="text" value={formData.trustABN} onChange={(e) => update('trustABN', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="12 345 678 900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Establishment Date</label>
                    <input type="text" value={formData.trustEstablishmentDate} onChange={(e) => update('trustEstablishmentDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="mm/dd/yyyy" />
                  </div>
                </div>
              </section>
            )}

            {/* Trustees - when Trust */}
            {formData.entityType === 'Trust' && (
              <section className="rounded-lg border border-[#E9E5FF] bg-[#F5F3FF] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </span>
                      Trustees ({trustees.length})
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">All trustees must be verified (can be individuals or companies)</p>
                  </div>
                  {!pendingTrustee && (
                    <button type="button" onClick={addTrustee} className="px-4 py-2 bg-[#7C3AED] text-white text-sm font-medium rounded-md hover:bg-[#6D28D9] flex items-center gap-2 shrink-0">
                      <span>+</span> Add Trustee
                    </button>
                  )}
                </div>
                {pendingTrustee && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#7C3AED]/30 space-y-3">
                    <h4 className="text-sm font-medium text-slate-700">New trustee – fill type and name, then save</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Trustee Type *</label>
                        <select
                          value={pendingTrustee.trusteeType}
                          onChange={(e) => setPendingTrustee((p) => ({ ...p, trusteeType: e.target.value }))}
                          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                        >
                          <option value="Individual Trustee">Individual Trustee</option>
                          <option value="Company Trustee">Company Trustee</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
                        <input
                          type="text"
                          value={pendingTrustee.name}
                          onChange={(e) => setPendingTrustee((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Full name or company name"
                          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={saveTrustee} className="px-3 py-1.5 bg-[#7C3AED] text-white text-sm font-medium rounded-md hover:bg-[#6D28D9]">
                        Save Trustee
                      </button>
                      <button type="button" onClick={cancelTrustee} className="px-3 py-1.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {trustees.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {trustees.map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-3 py-2 px-3 bg-white rounded border border-slate-200 text-sm">
                        <span className="font-medium text-slate-700">{t.trusteeType || 'Trustee'}: {t.name}</span>
                        <button type="button" onClick={() => removeTrustee(t.id)} className="text-red-600 hover:underline text-xs shrink-0">Remove</button>
                      </li>
                    ))}
                  </ul>
                ) : !pendingTrustee && (
                  <p className="text-sm text-slate-500 mt-4">No trustees added yet. Click &apos;Add Trustee&apos; to begin.</p>
                )}
              </section>
            )}

            {/* Personal Details - when Personal selected */}
            {formData.entityType === 'Personal' && (
              <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </span>
                  Personal Details
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name *</label>
                    <input type="text" value={formData.firstName} onChange={(e) => update('firstName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name *</label>
                    <input type="text" value={formData.lastName} onChange={(e) => update('lastName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth *</label>
                    <input type="text" value={formData.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" placeholder="mm/dd/yyyy" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                    <input type="text" value={formData.phoneNumber} onChange={(e) => update('phoneNumber', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                    <input type="email" value={formData.emailAddress} onChange={(e) => update('emailAddress', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Residential Address *</label>
                    <input type="text" value={formData.residentialAddress} onChange={(e) => update('residentialAddress', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Postal Address (if different)</label>
                    <input type="text" value={formData.postalAddress} onChange={(e) => update('postalAddress', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Occupation *</label>
                    <input type="text" value={formData.occupation} onChange={(e) => update('occupation', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Employer</label>
                    <input type="text" value={formData.employer} onChange={(e) => update('employer', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment Status</label>
                    <select value={formData.employmentStatus} onChange={(e) => update('employmentStatus', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white">
                      <option value="">Select status</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Casual">Casual</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Annual Income (A$)</label>
                    <input type="text" value={formData.annualIncome} onChange={(e) => update('annualIncome', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm text-slate-900 bg-white" />
                  </div>
                </div>
              </section>
            )}

            {/* Guarantors - always shown */}
            <section className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#16A34A] flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    Guarantors ({guarantors.length})
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Add any guarantors (optional - can be individuals or companies)</p>
                </div>
                {!pendingGuarantor && (
                  <button type="button" onClick={addGuarantor} className="px-4 py-2 bg-[#16A34A] text-white text-sm font-medium rounded-md hover:bg-[#15803D] flex items-center gap-2 shrink-0">
                    <span>+</span> Add Guarantor
                  </button>
                )}
              </div>
              {pendingGuarantor && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-[#16A34A]/30 space-y-3">
                  <h4 className="text-sm font-medium text-slate-700">New guarantor – fill type, name and details, then save</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Guarantor Type *</label>
                      <select
                        value={pendingGuarantor.guarantorType}
                        onChange={(e) => setPendingGuarantor((p) => ({ ...p, guarantorType: e.target.value }))}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
                      <input
                        type="text"
                        value={pendingGuarantor.name}
                        onChange={(e) => setPendingGuarantor((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Full name or company name"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth</label>
                      <input
                        type="text"
                        value={pendingGuarantor.dateOfBirth}
                        onChange={(e) => setPendingGuarantor((p) => ({ ...p, dateOfBirth: e.target.value }))}
                        placeholder="mm/dd/yyyy"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                      <input
                        type="text"
                        value={pendingGuarantor.phone}
                        onChange={(e) => setPendingGuarantor((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="0400 000 000"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={pendingGuarantor.email}
                        onChange={(e) => setPendingGuarantor((p) => ({ ...p, email: e.target.value }))}
                        placeholder="email@example.com"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={saveGuarantor} className="px-3 py-1.5 bg-[#16A34A] text-white text-sm font-medium rounded-md hover:bg-[#15803D]">
                      Save Guarantor
                    </button>
                    <button type="button" onClick={cancelGuarantor} className="px-3 py-1.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {guarantors.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {guarantors.map((g) => (
                    <li key={g.id} className="flex items-center justify-between gap-3 py-2 px-3 bg-white rounded border border-slate-200 text-sm">
                      <span className="font-medium text-slate-700">{g.guarantorType || 'Guarantor'}: {g.name}</span>
                      <button type="button" onClick={() => removeGuarantor(g.id)} className="text-red-600 hover:underline text-xs shrink-0">Remove</button>
                    </li>
                  ))}
                </ul>
              ) : !pendingGuarantor && (
                <p className="text-sm text-slate-500 mt-4">No guarantors added. Click &apos;Add Guarantor&apos; if required.</p>
              )}
            </section>

            {/* Credit Check Requirements (NCCP & Privacy Act) */}
            <section className="rounded-lg border border-red-200 bg-white p-4 sm:p-5">
              <h3 className="text-base font-semibold text-red-600 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <span className="text-lg leading-none" aria-hidden>!</span>
                </span>
                Credit Check Requirements (NCCP & Privacy Act)
              </h3>
              <p className="text-sm text-red-500 mt-1">National Consumer Credit Protection Act 2009 & Privacy Act 1988 - Obtain explicit consent before accessing credit information</p>

              <div className="mt-4 p-4 rounded-lg border border-red-300 bg-red-50">
                <div className="flex gap-3">
                  <span className="text-red-500 shrink-0 text-lg font-bold" aria-hidden>!</span>
                  <div>
                    <p className="text-sm font-bold text-red-800">MANDATORY PRIVACY ACT COMPLIANCE</p>
                    <p className="text-sm text-red-700 mt-1">Under the Privacy Act 1988 (Australian Privacy Principles) and Credit Reporting Code, you MUST obtain explicit written consent from the borrower before accessing their credit report from any credit reporting body (CRB). Failure to obtain consent is a breach of the Privacy Act and may result in penalties.</p>
                    <p className="text-sm font-medium text-red-800 mt-2">Credit checks cannot be run until all consents below are confirmed.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg border border-red-300 bg-white">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.creditCheckConsent} onChange={(e) => update('creditCheckConsent', e.target.checked)} className="rounded border-red-300 text-red-600 mt-0.5 shrink-0 focus:ring-red-500" />
                  <div>
                    <span className="text-sm font-medium text-red-700">Credit Check Consent Obtained from Borrower *</span>
                    <p className="text-sm text-slate-700 mt-2">I confirm that I have obtained explicit, informed, written consent from the borrower to:</p>
                    <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                      <li>Access their credit report from a credit reporting body (CRB)</li>
                      <li>Use credit information for the purpose of assessing this credit application</li>
                      <li>Disclose credit information to credit providers and other permitted parties</li>
                      <li>Understand that the credit check will be recorded on their credit file</li>
                    </ul>
                    <p className="text-xs text-red-600 mt-2">Privacy Act 1988 & Australian Privacy Principles (APP) 2 & 6.1</p>
                  </div>
                </label>
              </div>

              <div className="mt-4 p-4 rounded-lg border border-amber-300 bg-amber-50">
                <div className="flex gap-3">
                  <span className="text-amber-600 shrink-0 text-lg" aria-hidden>⚠</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Credit Check Consent Required</p>
                    <p className="text-sm text-slate-700 mt-1">You must tick the consent checkbox above and complete all required fields before credit checks can be initiated in Step 11.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">$ Payment & Automated Verification</h2>
            <p className="text-sm text-slate-500">Complete payment - all searches will run automatically</p>

            {/* Automated Verification Package - blue card with Total Cost right */}
            <div className="bg-indigo-600 text-white rounded-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">Automated Verification Package</h3>
                  <p className="text-sm text-indigo-100 mt-1">Complete property valuation, InfoTrack checks & KYC screening</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-indigo-200">Total Cost</p>
                  <p className="text-3xl font-bold text-white">$186.00</p>
                  <p className="text-xs text-indigo-200">incl. GST</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-500">
                <p className="text-sm font-medium text-white mb-2">Package Includes:</p>
                <ul className="space-y-2 text-sm text-indigo-100">
                  {[
                    { label: 'RP Data AVM Valuation', price: '$45.00' },
                    { label: 'InfoTrack Title Search', price: '$28.50' },
                    { label: 'InfoTrack Ownership Verification', price: '$22.00' },
                    { label: 'InfoTrack Encumbrance Check', price: '$25.00' },
                    { label: 'InfoTrack Zoning Certificate', price: '$35.00' },
                    { label: 'GreenID Identity Verification', price: '$12.50' },
                    { label: 'AUSTRAC Sanctions Screening', price: '$8.00' },
                    { label: 'PEP & RCA Screening', price: '$10.00' },
                  ].map(({ label, price }) => (
                    <li key={label} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs">✓</span>{label}</span>
                      <span className="font-medium text-white">{price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instant Automated Processing - purple */}
            <div className="bg-purple-600 text-white rounded-lg p-5">
              <h3 className="font-semibold text-white">Instant Automated Processing:</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-purple-100">
                {['Complete property AVM valuation from RP Data', 'Full title search and ownership verification', 'Encumbrances, caveats & zoning checks', 'GreenID + DVS identity verification', 'AUSTRAC sanctions & PEP screening', 'All reports automatically sent to you', 'Automatically attached to Credit Risk'].map((item) => (
                  <li key={item} className="flex items-center gap-2">• {item}</li>
                ))}
              </ul>
              <button type="button" onClick={handleRunAllChecks} disabled={runningChecks} className="mt-4 px-4 py-2 bg-white text-purple-700 text-sm font-medium rounded-md hover:bg-purple-50 disabled:opacity-70 flex items-center gap-2">
                {runningChecks ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Running checks…
                  </>
                ) : checksComplete ? (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Checks complete
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    Run All Checks Now - $186.00
                  </>
                )}
              </button>
              <p className="text-xs text-purple-200 mt-3">By proceeding, you authorise Drove to charge $186.00 (inc. GST) to your account for automated verification services.</p>
            </div>

            {/* Transparent Pricing */}
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg flex gap-2">
              <span className="text-slate-500 shrink-0">◆</span>
              <div>
                <p className="font-medium text-slate-800">Transparent Pricing</p>
                <p className="text-sm text-slate-600 mt-0.5">All costs are listed at actual provider rates with no markup. RP Data AVM $45, InfoTrack searches $100, and KYC checks $50.</p>
              </div>
            </div>

            {/* Onboarding & Verification Costs */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">Onboarding & Verification Costs</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {[
                  { label: 'InfoTrack Property Search', sub: 'Title, ownership, encumbrances, zoning', price: 'A$85.00' },
                  { label: 'InfoTrack KYC/GreenID Verification', sub: 'Identity, Sanctions & PEP screening', price: 'A$45.00' },
                  { label: 'Platform Onboarding Fee', sub: 'Case setup and processing', price: 'A$120.00' },
                ].map(({ label, sub, price }) => (
                  <li key={label} className="flex justify-between items-start gap-4">
                    <span><span className="font-medium">{label}</span>{sub && <span className="text-slate-500 block text-xs">{sub}</span>}</span>
                    <span className="font-medium text-slate-900 shrink-0">{price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-indigo-600">Total Due Today</span>
                <span className="text-xl font-bold text-indigo-600">A$250.00</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">Payment Method</h3>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Payment Method *</label>
                <select value={formData.paymentMethod ?? 'Credit Card'} onChange={(e) => update('paymentMethod', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name *</label>
                  <input type="text" value={formData.cardholderName} onChange={(e) => update('cardholderName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number *</label>
                  <input type="text" value={formData.cardNumber} onChange={(e) => update('cardNumber', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (MM/YY) *</label>
                  <input type="text" value={formData.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVV *</label>
                  <input type="text" value={formData.cvv} onChange={(e) => update('cvv', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Billing Address</label>
                  <input type="text" value={formData.billingAddress} onChange={(e) => update('billingAddress', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Billing Postcode *</label>
                  <input type="text" value={formData.billingPostcode} onChange={(e) => update('billingPostcode', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
              </div>
              <label className="mt-4 flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.paymentAuthorized || false} onChange={(e) => update('paymentAuthorized', e.target.checked)} className="rounded border-slate-300 text-indigo-600 mt-1 shrink-0" />
                <span className="text-sm text-slate-700">I authorize the charges outlined above * — I understand that these fees cover InfoTrack Verification services and platform onboarding. The charges are non-refundable once the checks have been initiated.</span>
              </label>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <span className="text-green-600 shrink-0">🔒</span>
                <p className="text-sm text-green-800 font-medium">Secure Payment. All payment information is encrypted and processed securely. We never store your full card details.</p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Lender Details & Documents</h2>
            <p className="text-sm text-slate-500">Current lender and loan account information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lender Name</label>
                <input type="text" value={formData.lenderName} onChange={(e) => update('lenderName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Contact Person</label>
                <input type="text" value={formData.lenderContact} onChange={(e) => update('lenderContact', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lender Email</label>
                <input type="email" value={formData.lenderEmail} onChange={(e) => update('lenderEmail', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lender Phone</label>
                <input type="text" value={formData.lenderPhone} onChange={(e) => update('lenderPhone', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Account Number</label>
                <input type="text" value={formData.loanAccountNumber} onChange={(e) => update('loanAccountNumber', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex gap-2">
              <span className="text-blue-600 shrink-0" aria-hidden>ℹ</span>
              <span>We'll contact the lender to verify the outstanding loan amount and coordinate the settlement process once a buyer is found.</span>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Lender Documents for Mortgage Reassignment</h3>
              <p className="text-sm text-slate-500 mt-0.5">Upload all documents the lender should be holding to facilitate mortgage reassignment and settlement. {lenderDocsCompleted} of 12 categories completed.</p>
              {LENDER_DOCS.map(({ title, desc }) => {
                const isUploaded = uploadedLenderDocs.has(title)
                return (
                  <div key={title} className="mt-3 flex flex-wrap items-center justify-between gap-4 p-3 border border-slate-200 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-slate-700 block">{title}</span>
                      <span className="text-xs text-slate-500">{desc}</span>
                    </div>
                    <button type="button" onClick={() => handleUploadLenderDoc(title)} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-1.5 shrink-0 ${isUploaded ? 'bg-green-100 text-green-800' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                      {isUploaded ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          Uploaded
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <span className="text-red-600 shrink-0" aria-hidden>!</span>
              <div className="text-sm text-red-800">
                <p className="font-medium">Critical for Mortgage Reassignment</p>
                <p className="mt-1">These documents are essential for a successful mortgage reassignment. Missing documents may delay or prevent the transaction. The lender must provide:</p>
                <ul className="mt-2 list-disc list-inside space-y-0.5">
                  <li>Original executed loan documentation</li>
                  <li>Current payout figures with settlement instructions</li>
                  <li>Registered mortgage documents with dealing numbers</li>
                  <li>Documented privacy consent / client authority</li>
                  <li>Full loan account history and arrears breakdown</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">$ Loan Details</h2>
            <p className="text-sm text-slate-500">Complete loan and financial information</p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              This loan is subject to NCCP (National Consumer Credit Protection Act 2009). Ensure all checks and requirements for consumer credit are completed. For commercial loans, confirm NCCP does not apply.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Outstanding Debt (A$) *</label>
                <input type="text" value={formData.outstandingDebt} onChange={(e) => update('outstandingDebt', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Original Loan Amount (A$) *</label>
                <input type="text" value={formData.originalLoanAmount} onChange={(e) => update('originalLoanAmount', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Start Date</label>
                <input type="text" value={formData.loanStartDate} onChange={(e) => update('loanStartDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="mm/dd/yyyy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Repayment Type</label>
                <select value={formData.repaymentType} onChange={(e) => update('repaymentType', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Principal & Interest</option>
                  <option>Interest Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
                <input type="text" value={formData.interestRate} onChange={(e) => update('interestRate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Missed Payments *</label>
                <input type="text" value={formData.missedPayments} onChange={(e) => update('missedPayments', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Arrears (A$)</label>
                <input type="text" value={formData.totalArrears} onChange={(e) => update('totalArrears', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Notice Date</label>
                <input type="text" value={formData.defaultNoticeDate} onChange={(e) => update('defaultNoticeDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="mm/dd/yyyy" />
              </div>
            </div>
            <section>
              <h3 className="font-medium text-slate-900">Property Valuation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Valuation (A$) *</label>
                  <input type="text" value={formData.currentValuation} onChange={(e) => update('currentValuation', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valuation Provider</label>
                  <input type="text" value={formData.valuationProvider} readOnly className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valuation Date</label>
                  <input type="text" value={formData.valuationDate} onChange={(e) => update('valuationDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="mm/dd/yyyy" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Upload Valuation Report *</label>
                  <button type="button" onClick={handleUploadValuation} className={`w-full mt-1 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${valuationUploaded ? 'bg-green-100 text-green-800 border border-green-200' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                    {valuationUploaded ? (
                      <> <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Uploaded </>
                    ) : (
                      <> <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> Upload Report </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Note: A valuation report will be automatically generated upon payment in Step 3.</p>
            </section>
          </div>
        )}

        {step === 6 && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Property Features & Condition</h2>
            <p className="text-sm text-slate-500">Detailed property information for lender assessment</p>
            <h3 className="font-medium text-slate-900">Building Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year Built</label>
                <input type="text" value={formData.yearBuilt} onChange={(e) => update('yearBuilt', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Floor Area (sqm)</label>
                <input type="text" value={formData.floorArea} onChange={(e) => update('floorArea', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Number of Storeys</label>
                <input type="text" value={formData.numberOfStoreys} onChange={(e) => update('numberOfStoreys', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Construction Type</label>
                <select value={formData.constructionType} onChange={(e) => update('constructionType', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option value="">Select type</option>
                  <option>Brick</option>
                  <option>Timber</option>
                  <option>Double brick</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Roof Type</label>
                <select value={formData.roofType} onChange={(e) => update('roofType', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option value="">Select type</option>
                  <option>Tile</option>
                  <option>Metal</option>
                  <option>Flat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Condition</label>
                <select value={formData.propertyCondition} onChange={(e) => update('propertyCondition', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Recent Renovations/Improvements</label>
                <textarea value={formData.recentRenovations} onChange={(e) => update('recentRenovations', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" rows={2} placeholder="Kitchen renovation 2022, new roof 2021, etc." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Special Features</label>
                <textarea value={formData.specialFeatures} onChange={(e) => update('specialFeatures', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" rows={2} placeholder="Swimming pool, tennis court, granny flat, solar panels, etc." />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mt-6">Rates & Ongoing Charges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Council Rates (Annual A$)</label>
                  <input type="text" value={formData.councilRates} onChange={(e) => update('councilRates', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Water Rates (Annual A$)</label>
                  <input type="text" value={formData.waterRates} onChange={(e) => update('waterRates', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Strata Fees (Quarterly A$)</label>
                  <input type="text" value={formData.strataFees} onChange={(e) => update('strataFees', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  <p className="text-xs text-slate-500 mt-0.5">If applicable (apartments/townhouses)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Land Tax (Annual A$)</label>
                  <input type="text" value={formData.landTax} onChange={(e) => update('landTax', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  <p className="text-xs text-slate-500 mt-0.5">If applicable (investment property)</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Insurance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                  <input type="text" value={formData.insuranceProvider} onChange={(e) => update('insuranceProvider', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="NRMA, RACV, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sum Insured (A$)</label>
                  <input type="text" value={formData.sumInsured} onChange={(e) => update('sumInsured', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Expiry Date</label>
                  <input type="text" value={formData.insuranceExpiry} onChange={(e) => update('insuranceExpiry', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="mm/dd/yyyy" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Upload Insurance Policy</label>
                  <button type="button" onClick={handleUploadInsurance} className={`mt-1 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${insuranceUploaded ? 'bg-green-100 text-green-800 border border-green-200' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                    {insuranceUploaded ? (<> <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Uploaded </>) : (<> <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> Upload Policy </>)}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Sales History</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Sale Price (A$)</label>
                  <input type="text" value={formData.lastSalePrice} onChange={(e) => update('lastSalePrice', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Sale Date</label>
                  <input type="text" value={formData.lastSaleDate} onChange={(e) => update('lastSaleDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="mm/dd/yyyy" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prior Sale Price (A$)</label>
                  <input type="text" value={formData.priorSalePrice} onChange={(e) => update('priorSalePrice', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prior Sale Date</label>
                  <input type="text" value={formData.priorSaleDate} onChange={(e) => update('priorSaleDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="mm/dd/yyyy" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Supporting Documents</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  { key: 'title', label: 'Upload Title' },
                  { key: 'certificate', label: 'Upload Certificate' },
                  { key: 'report', label: 'Upload Report' },
                ].map(({ key, label }) => (
                  <button key={key} type="button" onClick={() => handleUploadSupporting(key)} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${supportingDocs[key] ? 'bg-green-100 text-green-800 border border-green-200' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                    {supportingDocs[key] ? (
                      <> <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> {label.replace('Upload ', '')} uploaded </>
                    ) : (
                      <> <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> {label} </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">All Parties Involved</h2>
            <p className="text-sm text-slate-500">Capture contact details for all professionals involved in the MIP transaction</p>
            <section>
              <h3 className="font-medium text-slate-900">Borrower's Lawyer / Solicitor (Required)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lawyer Name</label>
                  <input type="text" value={formData.borrowerLawyerName} onChange={(e) => update('borrowerLawyerName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Law Firm</label>
                  <input type="text" value={formData.borrowerLawFirm} onChange={(e) => update('borrowerLawFirm', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={formData.borrowerLawyerEmail} onChange={(e) => update('borrowerLawyerEmail', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="text" value={formData.borrowerLawyerPhone} onChange={(e) => update('borrowerLawyerPhone', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License/Registration Number</label>
                  <input type="text" value={formData.borrowerLawyerLicense} onChange={(e) => update('borrowerLawyerLicense', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                </div>
              </div>
            </section>
            <section>
              <h3 className="font-medium text-slate-900 mt-6">Lender's Lawyer / Solicitor (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Lawyer Name</label><input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Jane Doe" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Firm</label><input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Doe Legal Partners" /></div>
              </div>
            </section>
          </div>
        )}

        {step === 8 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Disclosure Requirements & Lender Licence</h2>
            <p className="text-sm text-slate-500 mt-1">NCCP disclosure obligations and Australian Credit Licence verification</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lender Licence Type *</label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Select...</option>
                  <option>Australian Credit Licence</option>
                </select>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                All required disclosures must be provided before the borrower signs the credit contract. Incomplete disclosures may void the contract.
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600" />
                <span className="text-sm text-slate-700">Credit Guide (NCCP s120) *</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600" />
                <span className="text-sm text-slate-700">Credit Contract with Full Terms (NCCP s17) *</span>
              </div>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Disclosure</h2>
            <p className="text-sm text-slate-500 mt-1">Confirm all disclosure documents have been provided</p>
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              Disclosure step — ensure Key Facts Sheet and all fees are disclosed as per NCCP requirements.
            </div>
          </div>
        )}

        {step === 10 && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Review & Submit</h2>
            <p className="text-sm text-slate-500">Final details and case review</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Default *</label>
                <textarea value={formData.reasonForDefault} onChange={(e) => update('reasonForDefault', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" rows={3} placeholder="Provide details about why the borrower has defaulted..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Hardship Circumstances</label>
                <textarea value={formData.hardshipCircumstances} onChange={(e) => update('hardshipCircumstances', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" rows={2} placeholder="Job loss, illness, divorce, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Borrower Cooperation</label>
                <select value={formData.borrowerCooperation} onChange={(e) => update('borrowerCooperation', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Yes - Fully Cooperative</option>
                  <option>Partial</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Possession Status</label>
                <select value={formData.possessionStatus} onChange={(e) => update('possessionStatus', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Owner Occupied</option>
                  <option>Tenanted</option>
                  <option>Vacant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Case Urgency</label>
                <select value={formData.caseUrgency} onChange={(e) => update('caseUrgency', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option>Medium - Priority processing (14-30 days)</option>
                  <option>High - Urgent</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">AI Compliance Agent</h3>
              <p className="text-sm text-slate-600 mt-1">Automated compliance checking & data verification assistant</p>
              <button type="button" onClick={handleRunAnalysis} disabled={runAnalysisLoading} className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:opacity-70 flex items-center gap-2">
                {runAnalysisLoading ? (
                  <> <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Running analysis… </>
                ) : (
                  'Run Analysis'
                )}
              </button>
              {runAnalysisResult && (
                <div className="mt-3 p-3 bg-white border border-purple-200 rounded-md text-sm text-slate-700">
                  {runAnalysisResult}
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              Complete Credit Pack Assembly — All InfoTrack documents and third-party documents assembled with data reduction as per Privacy Act 1988 and OAIC guidelines.
            </div>
          </div>
        )}

        {step === 11 && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Ready to Finalize Case</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-800">All Pre-Checks Passed</p>
              <ul className="mt-2 text-sm text-green-700 space-y-1">
                <li>✓ Property valuation and title search completed</li>
                <li>✓ AML/CTF screening complete for all entities</li>
                <li>✓ All verification checks complete & compliant</li>
              </ul>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Final Confirmation Required — Please confirm all details are accurate before submitting. This action will create the case and make it available to the platform.
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-4 flex flex-wrap items-center justify-between gap-4 mt-6">
        <button type="button" onClick={handlePrev} disabled={step === 1} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          ← Previous
        </button>
        <span className="text-sm text-slate-600">Step {step} of 11</span>
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 11 ? (submitting ? 'Submitting...' : 'Submit & Create Case') : 'Next →'}
        </button>
      </div>
    </div>
  )
}
