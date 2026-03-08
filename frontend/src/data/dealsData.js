export const dealsData = [
  {
    id: "MIP-2026-001",
    title: "45 Victoria Street",
    suburb: "Potts Point",
    state: "NSW",
    postcode: "2011",
    status: "Live Auction",
    loanAmount: 980000,
    currentBid: 1100000,
    buyNowPrice: 1075000,
    lvr: 78.4,
    returnRate: 12.4,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ],
    auctionEnd: new Date(Date.now() + 10000000).toISOString(), // ~2h 45m from now
    bidHistory: [
      { user: "Investor #421", amount: 1100000, time: "2 mins ago" },
      { user: "Investor #118", amount: 1085000, time: "5 mins ago" },
      { user: "Investor #056", amount: 1050000, time: "12 mins ago" }
    ],
    totalBids: 7,
    propertyValue: 1250000,
    risk: "Low",
    expectedROI: "14.2%",
    recoveryRate: "98.5%",
    timeToSettlement: "45 Days",
    riskLevel: "Low",
    metrics: {
      daysInDefault: 124,
      daysInArrears: 98,
      interestRate: 8.5,
      defaultRate: 14.5,
      lvr: 78.4,
      totalArrears: 45600
    },
    financials: {
      originalLoanAmount: 1150000,
      outstandingDebt: 1245000,
      interestRate: "8.50%",
      defaultRate: "14.50%",
      lvr: "78.40%",
      defaultStatus: "Active Default",
      arrears: 45600,
      missedPayments: 4,
      notes: "Borrower is non-responsive to default notices."
    },
    propertyDetails: {
      bedrooms: 2,
      bathrooms: 2,
      landSize: "128 sqm",
      valuer: "Cushman & Wakefield",
      suburb: "Potts Point",
      state: "NSW",
      postcode: "2011",
      valuationDate: "Nov 2025",
      method: "Direct Comparison"
    },
    documents: [
      { name: "Lender Recovery IM", type: "IM", size: "2.4 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "Official Property Valuation", type: "Report", size: "1.8 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "Lender Identity Verification", type: "Security", size: "3.1 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "Deed of Trust (Certified)", type: "Legal", size: "1.2 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    memorandum: {
      executiveSummary: "Prime residential opportunity in Potts Point. This first mortgage remains in default despite multiple resolution attempts.",
      highlights: ["Strong value growth corridor", "Vacant possession possible", "High rental demand"],
      terms: "10% deposit, 30-day settlement",
      contact: "investment@brickbanq.com",
      disclaimer: "This document is for information purposes only."
    }
  },
  {
    id: "MIP-2026-002",
    title: "128 Brighton Boulevard",
    suburb: "North Bondi",
    state: "NSW",
    postcode: "2026",
    status: "Buy Now",
    buyNowPrice: 1050000,
    currentBid: null, // Buy Now doesn't usually have bids, or maybe it does? Screenshot shows Fixed Price.
    loanAmount: 980000, // Matching "Original Loan Amount" in screenshot
    lvr: 68.5,
    returnRate: 14.8,
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
    ],
    auctionEnd: null,
    bidHistory: [],
    totalBids: 0,
    propertyValue: 3200000,
    risk: "Low-Medium",
    expectedROI: "14.8%",
    recoveryRate: "99.2%",
    timeToSettlement: "45 days",
    riskLevel: "Low-Medium",
    metrics: {
      daysInDefault: 67,
      daysInArrears: 98,
      interestRate: 5.25,
      defaultRate: 7.85,
      lvr: 68.5,
      totalArrears: 19000
    },
    financials: {
      originalLoanAmount: 980000,
      outstandingDebt: 2100000,
      interestRate: "5.25%",
      defaultRate: "7.85%",
      lvr: "68.5%",
      defaultStatus: "Moderate status",
      arrears: 19000,
      missedPayments: 3,
      lastPaymentDate: "22 Nov 2025",
      lastPaymentAmount: 3800,
      equityAvailable: 1100000,
      notes: "Formal default notice issued."
    },
    propertyDetails: {
      bedrooms: 4,
      bathrooms: 3,
      landSize: "450 m²",
      valuer: "Herron Todd White",
      suburb: "North Bondi",
      state: "NSW",
      postcode: "2026",
      valuationDate: "Jan 2026",
      method: "Market Analysis",
      type: "House",
      parking: 2
    },
    documents: [
      { name: "Lender Verification Certificate", type: "Security", size: "2.4 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "Compliance Statement - Q1", type: "Legal", size: "1.8 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "First Mortgage Deed", type: "Deed", size: "3.1 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "Asset Disposition Report", type: "Report", size: "1.2 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    memorandum: {
      executiveSummary: "Luxury family home with ocean views in North Bondi.",
      highlights: ["Premium coastal location", "Excellent capital growth", "Spacious floorplan"],
      terms: "5% deposit allowed",
      contact: "sales@brickbanq.com",
      disclaimer: "Images for illustration purposes."
    }
  },
  {
    id: "MIP-2026-003",
    title: "7 Park Lane",
    suburb: "South Yarra",
    state: "VIC",
    postcode: "3141",
    status: "Active",
    loanAmount: 1600000,
    buyNowPrice: 1688000,
    lvr: 86.5,
    returnRate: 12.4,
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
    auctionEnd: "2026-02-25T15:00:00",
    bidHistory: [],
    totalBids: 12,
    expectedROI: "12.4%",
    recoveryRate: "97.8%",
    timeToSettlement: "30 Days",
    riskLevel: "High",
    metrics: {
      daysInDefault: 200,
      daysInArrears: 180,
      interestRate: 9.0,
      defaultRate: 15.0,
      lvr: 86.5,
      totalArrears: 85000
    },
    propertyDetails: {
      bedrooms: 3,
      bathrooms: 2,
      landSize: "210 sqm",
      valuer: "JLL",
      suburb: "South Yarra",
      state: "VIC",
      postcode: "3141",
      valuationDate: "Oct 2025",
      method: "Recent Sales"
    },
    documents: [
      { name: "Information Memorandum", type: "PDF", size: "2.4 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "MIP-2026-004",
    title: "92 George Street",
    suburb: "Brisbane CBD",
    state: "QLD",
    postcode: "4000",
    status: "Active",
    loanAmount: 480000,
    buyNowPrice: 494000,
    lvr: 92.3,
    returnRate: 12.4,
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"],
    auctionEnd: "2026-02-28T12:00:00",
    bidHistory: [],
    totalBids: 0,
    expectedROI: "12.4%",
    recoveryRate: "99.2%",
    timeToSettlement: "60 Days",
    riskLevel: "Medium",
    metrics: {
      daysInDefault: 60,
      daysInArrears: 45,
      interestRate: 7.8,
      defaultRate: 13.0,
      lvr: 92.3,
      totalArrears: 5600
    },
    propertyDetails: {
      bedrooms: 1,
      bathrooms: 1,
      landSize: "68 sqm",
      valuer: "Knight Frank",
      suburb: "Brisbane CBD",
      state: "QLD",
      postcode: "4000",
      valuationDate: "Jan 2026",
      method: "Summation"
    },
    documents: [
      { name: "Property Report", type: "PDF", size: "1.2 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "MIP-2026-005",
    title: "156 Stirling Highway",
    suburb: "Nedlands",
    state: "WA",
    postcode: "6009",
    status: "Sold",
    loanAmount: 1950000,
    buyNowPrice: 2248000,
    lvr: 69.6,
    returnRate: 12.4,
    type: "House",
    bedrooms: 5,
    bathrooms: 3,
    parking: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750"],
    auctionEnd: "2026-03-05T15:00:00",
    bidHistory: [],
    totalBids: 15,
    expectedROI: "12.4%",
    recoveryRate: "97.8%",
    timeToSettlement: "30 Days",
    riskLevel: "High",
    metrics: {
      daysInDefault: 310,
      daysInArrears: 280,
      interestRate: 8.8,
      defaultRate: 14.8,
      lvr: 69.6,
      totalArrears: 125000
    },
    propertyDetails: {
      bedrooms: 5,
      bathrooms: 3,
      landSize: "850 sqm",
      valuer: "Colliers",
      suburb: "Nedlands",
      state: "WA",
      postcode: "6009",
      valuationDate: "Aug 2025",
      method: "Development Potential"
    },
    documents: [
      { name: "Information Memorandum", type: "PDF", size: "2.4 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ]
  },
  {
    id: "MIP-2026-006",
    title: "24 Marine Parade",
    suburb: "Cottesloe",
    state: "WA",
    postcode: "6011",
    status: "Coming Soon",
    loanAmount: 2450000,
    lvr: 62.5,
    returnRate: 11.5,
    type: "Luxury Villa",
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ],
    auctionEnd: "2026-03-12T10:00:00",
    bidHistory: [],
    totalBids: 0,
    propertyValue: 3920000,
    risk: "Low",
    expectedROI: "13.8%",
    recoveryRate: "99.1%",
    timeToSettlement: "60 Days",
    riskLevel: "Low",
    metrics: {
      daysInDefault: 32,
      daysInArrears: 15,
      interestRate: 6.2,
      defaultRate: 10.5,
      lvr: 62.5,
      totalArrears: 8500
    },
    propertyDetails: {
      bedrooms: 4,
      bathrooms: 4,
      landSize: "520 sqm",
      valuer: "Savills Australia",
      suburb: "Cottesloe",
      state: "WA",
      postcode: "6011",
      valuationDate: "Jan 2026",
      method: "Market Assessment"
    },
    documents: [
      { name: "Preliminary Report", type: "PDF", size: "1.2 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "Title Deed", type: "PDF", size: "0.8 MB", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    memorandum: {
      executiveSummary: "Stunning coastal property in Cottesloe. High-equity position with strong collateral value.",
      highlights: ["Premier beachside location", "Substantial equity buffer", "High investor demand area"],
      terms: "10% deposit, auction date to be confirmed.",
      contact: "investment@brickbanq.com"
    }
  }
];

