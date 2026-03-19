import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from './components/Breadcrumb'
import useCountdown from '../../hooks/useCountdown'
import { MOCK_AUCTION_ROOM } from './data/borrowerMockData'
import { jsPDF } from 'jspdf'

const formatAud = (n) =>
  n == null ? 'A$0' : new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
const formatShort = (n) => {
  if (n == null) return 'A$0'
  if (n >= 1000000) return `A$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `A$${(n / 1000).toFixed(0)}K`
  return formatAud(n)
}

const MEDIA_TABS = [
  { id: '3d', label: '3D Tour', icon: '📐' },
  { id: '2d', label: '2D Floorplan', icon: '📏' },
  { id: 'virtual', label: 'Virtual Tour', icon: '🎥' },
  { id: 'rendered', label: 'Rendered', icon: '🖼️' },
]

export default function AuctionRoom() {
  const navigate = useNavigate()
  const [data, setData] = useState(MOCK_AUCTION_ROOM)
  const [imageIndex, setImageIndex] = useState(0)
  const [mediaTab, setMediaTab] = useState('3d')
  const [bidAmount, setBidAmount] = useState('')
  const [bidHistory, setBidHistory] = useState(data.bidHistory || [])
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [viewingDocument, setViewingDocument] = useState(null)
  const [downloadingDocId, setDownloadingDocId] = useState(null)
  const [openBidMenuIndex, setOpenBidMenuIndex] = useState(null)
  const [bidMenuPos, setBidMenuPos] = useState({ top: 0, right: 0 })
  const bidMenuRef = useRef(null)

  const endDate = data.auction?.endDate ? new Date(data.auction.endDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  const countdown = useCountdown(endDate)
  const currentBid = data.financials?.currentHighestBid ?? 1100000
  const images = data.propertyImages?.length ? data.propertyImages : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200']
  const minBid = data.auction?.minimumBid ?? 1250000

  useEffect(() => {
    setBidHistory(data.bidHistory || [])
  }, [data.bidHistory])

  useEffect(() => {
    if (openBidMenuIndex === null) return
    const handleClickOutside = (e) => {
      if (bidMenuRef.current && !bidMenuRef.current.contains(e.target)) {
        setOpenBidMenuIndex(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openBidMenuIndex])

  useEffect(() => {
    if (!viewingDocument) return
    const onEscape = (e) => { if (e.key === 'Escape') handleCloseDocumentView() }
    document.addEventListener('keydown', onEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    }
  }, [viewingDocument])

  const handlePrevImage = () => setImageIndex((i) => (i - 1 + images.length) % images.length)
  const handleNextImage = () => setImageIndex((i) => (i + 1) % images.length)

  const handlePlaceBid = (e) => {
    e.preventDefault()
    const amount = Number(bidAmount?.replace(/,/g, ''))
    if (!amount || amount < minBid) {
      alert(`Minimum bid is ${formatAud(minBid)}. Any bid below this amount will not be accepted.`)
      return
    }
    if (amount <= currentBid) {
      alert(`Your bid must be higher than the current bid of ${formatShort(currentBid)}.`)
      return
    }
    setIsPlacingBid(true)
    setTimeout(() => {
      setBidHistory((prev) => [{ amount, user: 'You', time: 'Just now' }, ...prev])
      setData((d) => ({
        ...d,
        financials: { ...d.financials, currentHighestBid: amount },
        bidHistory: [{ amount, user: 'You', time: 'Just now' }, ...(d.bidHistory || [])],
      }))
      setBidAmount('')
      setIsPlacingBid(false)
    }, 500)
  }

  const handleCancelBid = () => setBidAmount('')

  const docBlobUrlsRef = useRef({})

  const generateDocumentPdf = (doc) => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const margin = 20

    // Header bar
    pdf.setFillColor(79, 70, 229)
    pdf.rect(0, 0, pageW, 22, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.text('BriqBanq — Mortgage Resolution Platform', margin, 14)

    // Document title
    pdf.setTextColor(30, 30, 30)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text(doc.title, margin, 38)

    // Divider
    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, 42, pageW - margin, 42)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generated: ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, 49)
    pdf.text('Case Reference: MIP-2026-001  |  Property: 45 Victoria Street, Potts Point NSW 2011', margin, 55)

    let y = 68

    const sectionTitle = (label) => {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(79, 70, 229)
      pdf.text(label, margin, y)
      y += 2
      pdf.setDrawColor(79, 70, 229)
      pdf.line(margin, y, pageW - margin, y)
      y += 6
      pdf.setTextColor(30, 30, 30)
    }

    const row = (label, value) => {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(80, 80, 80)
      pdf.text(label, margin, y)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(30, 30, 30)
      pdf.text(String(value), margin + 55, y)
      y += 7
    }

    const bodyText = (text) => {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(50, 50, 50)
      const lines = pdf.splitTextToSize(text, pageW - margin * 2)
      pdf.text(lines, margin, y)
      y += lines.length * 5.5 + 4
    }

    if (doc.title === 'Loan Agreement') {
      sectionTitle('Parties')
      row('Lender:', 'National Mortgage Bank Ltd (ABN 12 345 678 900)')
      row('Borrower:', 'Madhu Munigala')
      row('Borrower ABN:', '98 765 432 100')
      y += 3
      sectionTitle('Loan Details')
      row('Loan Amount:', 'A$980,000')
      row('Interest Rate:', '6.25% p.a. (variable)')
      row('Term:', '25 years')
      row('Repayment Type:', 'Principal & Interest')
      row('Start Date:', '15 January 2021')
      row('Security:', '45 Victoria Street, Potts Point NSW 2011')
      y += 3
      sectionTitle('Default & Enforcement')
      row('Default Date:', '10 October 2025')
      row('Arrears:', 'A$18,500')
      row('Notice Issued:', '01 November 2025')
      y += 3
      sectionTitle('Terms & Conditions')
      bodyText('This agreement is governed by the laws of New South Wales, Australia. The borrower acknowledges receipt of the loan and agrees to repay the principal and interest as scheduled. In the event of default, the lender reserves the right to enforce the mortgage security in accordance with applicable legislation, including the Real Property Act 1900 and National Consumer Credit Protection Act 2009.')
    } else if (doc.title === 'Property Valuation') {
      sectionTitle('Property Details')
      row('Address:', '45 Victoria Street, Potts Point NSW 2011')
      row('Property Type:', 'Residential — Apartment')
      row('Lot & DP:', 'Lot 8 DP 123456')
      row('Land Area:', '142 m²')
      row('Floor Area:', '190 m²')
      row('Year Built:', '1995')
      row('Condition:', 'Good')
      y += 3
      sectionTitle('Valuation Summary')
      row('Valuation Date:', '15 January 2026')
      row('Market Value:', 'A$1,250,000')
      row('Valuation Method:', 'Direct Comparison')
      row('Valuer:', 'Preston Rowe Paterson Pty Ltd')
      row('Licence No.:', 'V-12345 (NSW)')
      y += 3
      sectionTitle('Comparable Sales')
      row('43 Victoria St:', 'A$1,210,000 (Dec 2025)')
      row('51 Victoria St:', 'A$1,280,000 (Nov 2025)')
      row('12 Macleay St:', 'A$1,195,000 (Oct 2025)')
      y += 3
      sectionTitle('Valuer\'s Comments')
      bodyText('The property is a well-maintained residential apartment in a sought-after harbourside suburb. Recent renovations including a new kitchen and bathroom have positively influenced value. Market conditions remain stable with consistent buyer demand in the Potts Point precinct.')
    } else if (doc.title === 'Title Search') {
      sectionTitle('Title Information')
      row('Title Reference:', 'Folio 8/123456')
      row('Local Government:', 'City of Sydney Council')
      row('Estate:', 'Fee Simple')
      row('Registered Owner:', 'Madhu Munigala')
      row('Search Date:', '10 February 2026')
      y += 3
      sectionTitle('Encumbrances & Interests')
      row('Mortgage:', 'National Mortgage Bank Ltd — Reg. No. AM 987654')
      row('Covenant:', 'No adverse covenants noted')
      row('Easements:', 'Nil')
      row('Caveats:', 'Nil')
      row('PPSR Interests:', 'Nil registered against property')
      y += 3
      sectionTitle('Zoning')
      row('Zone:', 'R1 General Residential')
      row('Floor Space Ratio:', '0.5:1')
      row('Height Limit:', '8.5 m')
      y += 3
      sectionTitle('Search Notes')
      bodyText('This title search has been conducted as at the date noted above. All interests registered on the title have been accurately reported. Parties should conduct their own further searches as required prior to settlement.')
    } else {
      sectionTitle('Policy Details')
      row('Policy Number:', 'HBI-2026-004521')
      row('Insurer:', 'NRMA Insurance Ltd')
      row('Insured:', 'Madhu Munigala')
      row('Property:', '45 Victoria Street, Potts Point NSW 2011')
      row('Sum Insured:', 'A$1,500,000 (building replacement)')
      row('Commencement:', '1 January 2026')
      row('Expiry:', '31 December 2026')
      row('Premium:', 'A$2,400 p.a. (paid)')
      y += 3
      sectionTitle('Cover Summary')
      row('Building:', 'Full replacement value')
      row('Storm & Flood:', 'Included')
      row('Fire:', 'Included')
      row('Public Liability:', 'A$20,000,000')
      row('Excess:', 'A$500 per claim')
      y += 3
      sectionTitle('Special Conditions')
      bodyText('This policy is noted in favour of National Mortgage Bank Ltd as mortgagee in accordance with standard mortgage interest conditions. The insurer must notify the mortgagee of any cancellation or material change to this policy. Claims are subject to full policy terms and conditions.')
    }

    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(160, 160, 160)
    pdf.text('This is a sample document for demonstration purposes only. BriqBanq Mortgage Resolution Platform — Confidential.', margin, 285)

    return pdf.output('bloburl')
  }

  const handleViewDocument = (doc) => () => {
    if (!docBlobUrlsRef.current[doc.title]) {
      docBlobUrlsRef.current[doc.title] = generateDocumentPdf(doc)
    }
    setViewingDocument({ ...doc, viewUrl: docBlobUrlsRef.current[doc.title] })
  }
  const handleCloseDocumentView = () => setViewingDocument(null)

  const handleDownloadDocument = async (doc) => {
    const id = doc.id ?? doc.title
    setDownloadingDocId(id)
    const filename = `${(doc.title || 'document').replace(/\s+/g, '-')}`
    try {
      if (doc.downloadUrl) {
        const res = await fetch(doc.downloadUrl)
        if (!res.ok) throw new Error('Download failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.${(doc.type || 'pdf').toLowerCase()}`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 200)
      } else {
        const isPdf = (doc.type || 'PDF').toLowerCase() === 'pdf'
        let blob
        if (isPdf) {
          try {
            const pdfInstance = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
            const blobUrl = generateDocumentPdf(doc)
            const res = await fetch(blobUrl)
            if (res.ok) blob = await res.blob()
          } catch { /* ignore */ }
        }
        if (!blob) {
          const text = `\n${doc.title}\n${'='.repeat(Math.min(60, (doc.title || '').length))}\n\n${doc.description || ''}\n\nGenerated from Brickbanq Auction Room.\nDate: ${new Date().toLocaleString('en-AU')}\n`
          blob = new Blob([text], { type: 'text/plain' })
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.${blob.type?.includes('pdf') ? 'pdf' : 'txt'}`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 200)
      }
    } catch (err) {
      console.error('Download failed', err)
      const blob = new Blob([`${doc.title}\n\n${doc.description || ''}\n\n(Download failed; saving as text.)`], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.txt`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 200)
    } finally {
      setDownloadingDocId(null)
    }
  }

  const address = data.property ? `${data.property.address}, ${data.property.suburb}` : 'Victoria Street'
  const location = data.property ? `Sydney, ${data.property.state} ${data.property.postcode}` : 'Sydney, NSW 2011'

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-full max-w-[1600px] mx-auto">
      {/* Header + breadcrumb + LIVE badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: 'Dashboard', path: '/borrower/dashboard' },
              { label: 'Borrower', path: '/borrower/dashboard' },
              { label: 'Live Auction' },
            ]}
          />
          <h1 className="text-2xl font-bold text-gray-900">Auction Room</h1>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm uppercase tracking-wide"
        >
          Live Auction
        </button>
      </div>

      {/* Hero: property media + countdown */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-xl">
        <div className="flex flex-col lg:flex-row">
          <div className="relative flex-1 min-h-[280px] lg:min-h-[360px]">
            <img
              src={images[imageIndex]}
              alt="Property"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-800 shadow"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-800 shadow"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <p className="font-semibold">{address}</p>
              <p className="text-sm opacity-90">{location}</p>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-black/40 rounded-lg p-1">
              {MEDIA_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMediaTab(tab.id)}
                  className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 ${
                    mediaTab === tab.id ? 'bg-white text-gray-900' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-48 shrink-0 bg-red-600 flex flex-col items-center justify-center p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider">Auction Ends In</p>
            <div className="mt-2 font-mono text-2xl font-bold tabular-nums">
              {countdown.status === 'Ended' ? (
                'Ended'
              ) : (
                <>
                  <span>{String(countdown.hours ?? 0).padStart(2, '0')}</span>
                  <span className="opacity-70"> : </span>
                  <span>{String(countdown.minutes ?? 0).padStart(2, '0')}</span>
                  <span className="opacity-70"> : </span>
                  <span>{String(countdown.seconds ?? 0).padStart(2, '0')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Bidders', value: data.auction?.totalBidders ?? 89, sub: 'People have placed their bids', bg: 'bg-red-50', border: 'border-red-100' },
          { title: 'Total Properties', value: data.auction?.totalPropertiesInAuction ?? 127, sub: 'Properties listed in live auction', bg: 'bg-amber-50', border: 'border-amber-100' },
          { title: 'Yield Rate', value: `${data.auction?.yieldRate ?? 5.85}%`, sub: 'Original Yield Rate', bg: 'bg-blue-50', border: 'border-blue-100' },
          { title: 'Loan-To-Value', value: `${data.auction?.loanToValue ?? 8.25}%`, sub: 'Current Loan-To-Value', bg: 'bg-purple-50', border: 'border-purple-100' },
          { title: 'Recovery Rate', value: `${data.auction?.recoveryRate ?? 78.4}%`, sub: 'Current Recovery Rate', bg: 'bg-green-50', border: 'border-green-100' },
          { title: 'Reserve Price', value: formatShort(data.auction?.reservePrice ?? 25000), sub: 'Reserve price for the property', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        ].map((card) => (
          <div key={card.title} className={`rounded-xl border p-4 ${card.bg} ${card.border}`}>
            <p className="text-xs font-medium text-gray-600">{card.title}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Lenders */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Lenders</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Current Loan Value</p>
                <p className="text-lg font-bold text-gray-900">{formatAud(data.currentLenders?.currentLoanValue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Outstanding Loan Value</p>
                <p className="text-lg font-bold text-gray-900">{formatAud(data.currentLenders?.outstandingLoanValue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">LVR Price</p>
                <p className="text-lg font-bold text-gray-900">{formatAud(data.currentLenders?.lvrPrice1)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">LVR Price</p>
                <p className="text-lg font-bold text-gray-900">{formatAud(data.currentLenders?.lvrPrice2)}</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
              The minimum amount for bids is {formatAud(minBid)}. Any bid below this amount will not be accepted. You are the highest bidder.
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <span className="text-gray-500">Property Type:</span><span className="font-medium text-gray-900">{data.property?.propertyType ?? 'Apartment'}</span>
              <span className="text-gray-500">Sq. Ft.:</span><span className="font-medium text-gray-900">{data.property?.sqFt ?? 1800} sq.ft</span>
              <span className="text-gray-500">Bedrooms:</span><span className="font-medium text-gray-900">{data.property?.bedrooms ?? 2}</span>
              <span className="text-gray-500">Bathrooms:</span><span className="font-medium text-gray-900">{data.property?.bathrooms ?? 2}</span>
              <span className="text-gray-500">Car Parks:</span><span className="font-medium text-gray-900">{data.property?.carParks ?? 1}</span>
              <span className="text-gray-500">Property Details:</span><span className="font-medium text-gray-900">{data.property?.propertyDetails ?? 'Brickbanq_dev'}</span>
            </div>
          </div>

          {/* Mortgage & Financial */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mortgage & Financial Information</h2>
            <p className="text-sm text-gray-600 mb-4">
              The current outstanding loan amount is {formatAud(data.mortgage?.outstandingDebt)}. Please ensure you have sufficient funds available.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                ['Last Payment Date', data.mortgage?.lastPaymentDate],
                ['Next Payment Date', data.mortgage?.nextPaymentDate],
                ['Interest Rate', data.mortgage?.interestRate != null ? `${data.mortgage.interestRate}% p.a.` : ''],
                ['Outstanding Debt', formatAud(data.mortgage?.outstandingDebt)],
                ['Default Interest Rate', data.mortgage?.defaultInterestRate != null ? `${data.mortgage.defaultInterestRate}% p.a.` : ''],
                ['Loan Term', data.mortgage?.loanTerm],
                ['Loan Type', data.mortgage?.loanType],
                ['Total Repayments', formatAud(data.mortgage?.totalRepayments)],
                ['Purpose', data.mortgage?.purpose],
                ['Tenure Type', data.mortgage?.tenureType],
                ['Owner Name', data.mortgage?.ownerName],
              ].map(([label, val]) => (
                <React.Fragment key={label}>
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{val}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
              BCBP Convention: {data.bcbpNotice || 'This is to inform you that the Borrower Current Outstanding Loan 2022 Loan Term has Overdue.'}
            </div>
          </div>

          {/* Verification & Due Diligence */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification & Due Diligence</h2>
            <ul className="space-y-2 mb-6">
              {(data.verificationDueDiligence || []).map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </span>
                  <span>{item.label} ({item.status})</span>
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium text-gray-700 mb-3">Additional Due Diligence</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {(data.dueDiligenceGrid || []).map((item) => (
                <div key={item.label} className="border rounded-lg p-3 flex items-center gap-2">
                  {item.status === 'Completed' ? (
                    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </span>
                  )}
                  <div>
                    <p className="text-xs font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all"
                  style={{ width: `${data.dueDiligenceProgress ?? 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">Due Diligence Complete {data.dueDiligenceProgress ?? 100}%</span>
            </div>
            <a href="#" className="text-sm text-indigo-600 hover:underline mt-1 inline-block">Get your information here</a>
          </div>

          {/* Available Documents */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Documents</h2>
            <div className="space-y-3">
              {(data.availableDocuments || []).map((doc) => (
                <div key={doc.title} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleViewDocument(doc)} className="px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50">
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDocument(doc)}
                      disabled={downloadingDocId === (doc.id ?? doc.title)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Download ${doc.title}`}
                    >
                      {downloadingDocId === (doc.id ?? doc.title) ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Place Bid, Bid History, Investment Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Place New Bid</h2>
            <p className="text-2xl font-bold text-green-600 mb-4">Current Bid: {formatShort(data.financials?.currentHighestBid ?? currentBid)}</p>
            <form onSubmit={handlePlaceBid} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Your Bid</label>
              <input
                type="text"
                inputMode="numeric"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value.replace(/[^0-9,]/g, ''))}
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={isPlacingBid} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg">
                  {isPlacingBid ? 'Placing…' : 'Place Bid'}
                </button>
                <button type="button" onClick={handleCancelBid} className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                  Cancel
                </button>
              </div>
            </form>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>Current Bidders: {data.auction?.currentBiddersCount ?? 250}</p>
              <p>Minimum Bid: {formatShort(data.auction?.minimumBidIncrement ?? 10000)}</p>
              <p>Maximum Bid: {formatShort(data.auction?.maximumBidIncrement ?? 150000)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 p-5 pb-0">Previous Bid History</h2>
            <div className="max-h-[320px] overflow-y-auto p-2">
              {bidHistory.length === 0 ? (
                <p className="text-sm text-gray-500 p-4">No bids yet.</p>
              ) : (
                <ul className="space-y-1">
                  {bidHistory.map((bid, i) => (
                    <li key={`${bid.amount}-${i}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                      <span className="font-semibold text-gray-900">{formatShort(bid.amount)}</span>
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          aria-label="More options"
                          onClick={(e) => {
                            if (openBidMenuIndex === i) {
                              setOpenBidMenuIndex(null)
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect()
                              setBidMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
                              setOpenBidMenuIndex(i)
                            }
                          }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Summary</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              <span className="text-gray-500">Property Value:</span>
              <span className="font-medium text-gray-900">{formatShort(data.investmentSummary?.propertyValue ?? 1500000)}</span>
              <span className="text-gray-500">LVR:</span>
              <span className="font-medium text-gray-900">{data.investmentSummary?.lvr ?? 80}%</span>
              <span className="text-gray-500">Total Repayments:</span>
              <span className="font-medium text-gray-900">{formatShort(data.investmentSummary?.totalRepayments ?? 1200000)}</span>
            </div>
            <button type="button" onClick={() => navigate('/borrower/my-case')} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Bid history ellipsis dropdown — fixed position so it escapes overflow-y:auto clipping */}
      {openBidMenuIndex !== null && (
        <div
          ref={bidMenuRef}
          className="fixed w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1"
          style={{ top: bidMenuPos.top, right: bidMenuPos.right }}
        >
          {[
            {
              label: 'View',
              icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
              onClick: () => {
                const bid = bidHistory[openBidMenuIndex]
                alert(`Bid Details\nAmount: ${formatShort(bid?.amount)}\nRank: #${openBidMenuIndex + 1}\nStatus: Accepted`)
                setOpenBidMenuIndex(null)
              },
            },
            {
              label: 'Download',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
              onClick: () => {
                const bid = bidHistory[openBidMenuIndex]
                const blob = new Blob(
                  [`Bid Amount: ${formatShort(bid?.amount)}\nRank: #${openBidMenuIndex + 1}\nStatus: Accepted\nDate: ${bid?.time ?? new Date().toLocaleString()}\n`],
                  { type: 'text/plain' }
                )
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `bid-${openBidMenuIndex + 1}.txt`
                a.click()
                URL.revokeObjectURL(url)
                setOpenBidMenuIndex(null)
              },
            },
            {
              label: 'Details',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
              onClick: () => {
                const bid = bidHistory[openBidMenuIndex]
                alert(`Bid Details\nAmount: ${formatShort(bid?.amount)}\nBidder: ${bid?.user ?? 'You'}\nTime: ${bid?.time ?? '—'}\nStatus: ${bid?.status ?? 'Accepted'}`)
                setOpenBidMenuIndex(null)
              },
            },
          ].map(({ label, icon, onClick }) => (
            <button
              key={label}
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={onClick}
            >
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Document preview modal */}
      {viewingDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="document-preview-title"
          onClick={(e) => e.target === e.currentTarget && handleCloseDocumentView()}
          onKeyDown={(e) => e.key === 'Escape' && handleCloseDocumentView()}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 id="document-preview-title" className="text-lg font-semibold text-gray-900">
                {viewingDocument.title}
              </h2>
              <button
                type="button"
                onClick={handleCloseDocumentView}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 min-h-0 p-4">
              <iframe
                src={viewingDocument.viewUrl}
                title={viewingDocument.title}
                className="w-full h-[70vh] rounded-lg border border-gray-200"
              />
              {viewingDocument.description && (
                <p className="text-sm text-gray-500 mt-2">{viewingDocument.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
