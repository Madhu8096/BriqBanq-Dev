/**
 * Mock data for Investment Memorandum. Replace with API response when backend is available.
 * Structure is backend-friendly: same shape as expected from GET /api/borrower/case/:caseId/investment-memo
 */

export const MOCK_INVESTMENT_MEMO = {
  caseId: 'MIP-2026-001',
  status: 'In Auction',
  urgencyBadge: 'URGENT/HIGH OPPORTUNITY',

  property: {
    address: '45 Victoria Street',
    suburb: 'Potts Point',
    state: 'NSW',
    postcode: '2011',
    fullAddress: '45 Victoria Street, Potts Point, NSW 2011',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    landSize: 0,
    cbdDistance: '0.5 km',
  },

  images: {
    hero: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200',
    thumbnails: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
    ],
  },

  financials: {
    propertyValue: 1250000,
    outstandingDebt: 980000,
    expectedReturn: 12.4,
    originalLoanAmount: 1020000,
    originalInterestRate: 5.75,
    defaultRate: 8.25,
    ltvRatio: 78.8,
    equityBuffer: 270000,
  },

  defaultStatus: {
    daysInDefault: 90,
    daysInArrears: 127,
    arrearsAmount: 25550,
    missedPayments: 4,
    note:
      'Formal default notice issued. Borrower has expressed willingness with creditor resolution process.',
  },

  valuation: {
    currentValue: 1250000,
    valuationDate: '15/01/2026',
    valuer: 'Preston Rowe Paterson',
    method: 'Direct Comparison',
  },

  executiveSummary: {
    text: [
      'This Investment Memorandum presents a secured lending opportunity backed by a premium residential property in Potts Point, NSW. The property is currently in [in target default, presenting an attractive acquisition opportunity for discerning investors.',
      'The loan is secured by first mortgage and a well-maintained apartment valued at $1250k, providing a comfortable 22% equity buffer and strong downside protection.',
      "With an expected annual return of 12.4% and a clear exit strategy, this represents a compelling risk-adjusted investment in Sydney's prestige eastern suburbs market.",
    ],
    highlights: [
      { title: 'First Mortgage Security', description: 'Loan-to-Value Ratio of 78%' },
      { title: 'Independent Valuation', description: 'Completed 15 Jan 2026' },
      { title: 'Clear Title', description: 'No secondary encumbrances' },
    ],
  },

  investmentHighlights: [
    {
      icon: '📈',
      title: 'Strong Returns',
      description:
        'Target IRR of 12.4% p.a. with monthly interest payments at 8.25% (default rate) compared to market rate of 6.75%.',
      color: 'green',
    },
    {
      icon: 'ℹ️',
      title: 'Conservative LVR',
      description:
        'Loan to Value Ratio of 78% provides substantial equity cushion and downside protection. LVR is below 80%, allowing the borrower flexibility.',
      color: 'blue',
    },
    {
      icon: '📍',
      title: 'Prime Location',
      description:
        'Located in Potts Point, a highly desirable suburb with strong capital values and rental demand. Only 2 km from Sydney CBD, ensuring high liquidity for forced sale scenarios.',
      color: 'purple',
    },
    {
      icon: '⚠️',
      title: 'Default Rate Premium',
      description:
        'Emerging loan at 8.25% p.a. compared to original rate of 6.75%, providing a 150bp premium on loan or ~$1,500 increase (6.75% p.a. increase).',
      color: 'red',
    },
  ],

  riskAssessment: [
    {
      type: 'positive',
      title: 'Security Position',
      description:
        'First mortgage security with no subordinate encumbrances. Clear title confirmed by independent legal review.',
      color: 'green',
    },
    {
      type: 'positive',
      title: 'Equity Buffer',
      description: 'Conservative LVR of 78% provides $170k equity buffer against market volatility.',
      color: 'green',
    },
    {
      type: 'warning',
      title: 'Default Status',
      description:
        'Property is 90 days in default. Recovery timeline estimated at 6-8 months including legal process.',
      color: 'amber',
    },
    {
      type: 'info',
      title: 'Market Conditions',
      description:
        'Strong demand in Potts Point with median price growth of 8% over 12 years. High liquidity for forced sale scenarios.',
      color: 'blue',
    },
  ],

  investmentTerms: {
    keyTerms: {
      minimumInvestment: 'Full loan acquisition or syndicated participation',
      interestRate: '8.25% p.a. (default rate)',
      interestPayments: 'Monthly, in arrears',
      loanTerm: 'Until resolution Jan - 6-8 months',
      security: 'First registered mortgage',
      settlement: 'Within 60 days',
    },
    process: [
      {
        step: 1,
        title: 'Submit Expression of Interest',
        description: 'Complete online form and submit required documents',
      },
      {
        step: 2,
        title: 'Due Diligence Period',
        description: 'Access full data room for comprehensive legal/financial review',
      },
      {
        step: 3,
        title: 'Legal Documentation',
        description: 'Review investment agreements',
      },
      {
        step: 4,
        title: 'Settlement',
        description: 'Funds transfer and mortgage registration',
      },
    ],
  },

  contact: {
    organization: 'Brickbanq Virtual MIP Platform',
    email: 'investments@brickbanq.com.au',
    phone: '1300 BRCK (2626 274 182)',
    caseNumber: 'MIP-2026-001',
  },
}
