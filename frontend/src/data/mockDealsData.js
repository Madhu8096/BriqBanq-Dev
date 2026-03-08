// src/data/mockDealsData.js

export const MOCK_DEALS = [
    {
        id: 'MIP-2026-001',
        type: 'auction',
        address: '45 Victoria Street',
        suburb: 'Potts Point',
        state: 'NSW',
        postcode: '2011',
        description: 'Luxury apartment with harbor views.',
        bedrooms: 2,
        bathrooms: 2,
        parking: 1,
        propertyType: 'Apartment',
        landSize: '0 m²',
        valuer: 'Preston Rowe Paterson',
        metrics: {
            daysInDefault: 89,
            daysInArrears: 127,
            interestRate: 5.75,
            defaultRate: 8.25,
            lvr: 72.8,
            totalArrears: 25000,
            defaultStatus: 'Critical status',
            arrearsSub: '4 missed payments',
            interestSub: 'Original rate',
            defaultRateSub: 'Current penalty rate',
            lvrSub: 'Loan to value',
            arrearsStatus: 'Outstanding'
        },
        financials: {
            originalLoanAmount: 1200000,
            outstandingDebt: 980000,
            lastPaymentDate: '15 Oct 2025',
            lastPaymentAmount: 4500,
            propertyValuation: 1250000,
            equityAvailable: 270000,
            reservePrice: 1000000,
            reserveMet: true,
            currentHighestBid: 1100000,
            bidCount: 5,
            bidderCount: 4,
            expectedROI: 12.4,
            recoveryRate: 97.5,
            timeToSettlement: '45-60 days',
            riskLevel: 'Medium'
        },
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3f?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1000'
        ],
        bidHistory: [
            { id: 1, bidder: 'You', amount: 1100000, timestamp: '12:15', isWinning: true, increment: 50000, isYou: true },
            { id: 2, bidder: 'Investor B', amount: 1050000, timestamp: '11:35', increment: 50000 },
            { id: 3, bidder: 'You', amount: 1000000, timestamp: '10:50', increment: 25000, isYou: true },
            { id: 4, bidder: 'Investor C', amount: 975000, timestamp: '10:20', increment: 25000 }
        ],
        documents: [
            { id: 1, name: 'Loan Agreement', description: 'Contract • 2.4 MB' },
            { id: 2, name: 'Property Valuation', description: 'Valuation • 1.8 MB' },
            { id: 3, name: 'Title Search', description: 'Legal • 856 KB' },
            { id: 4, name: 'Building Inspection', description: 'Inspection • 3.2 MB' }
        ]
    },
    {
        id: 'MIP-2026-002',
        type: 'buy_now',
        address: '128 Brighton Boulevard',
        suburb: 'North Bondi',
        state: 'NSW',
        postcode: '2026',
        description: 'Stunning beachfront house.',
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
        propertyType: 'House',
        landSize: '450 m²',
        valuer: 'Herron Todd White',
        metrics: {
            daysInDefault: 67,
            daysInArrears: 98,
            interestRate: 5.25,
            defaultRate: 7.85,
            lvr: 68.5,
            totalArrears: 19000,
            defaultStatus: 'Moderate status',
            arrearsSub: '3 missed payments',
            interestSub: 'Original rate',
            defaultRateSub: 'Current penalty rate',
            lvrSub: 'Loan to value',
            arrearsStatus: 'Outstanding'
        },
        financials: {
            originalLoanAmount: 980000,
            outstandingDebt: 2100000, // Wait, debt higher than loan? Maybe it's a refinance/multiple loans.
            lastPaymentDate: '22 Nov 2025',
            lastPaymentAmount: 3800,
            propertyValuation: 3200000,
            equityAvailable: 1100000,
            fixedPurchasePrice: 1050000,
            outstandingDebtSummary: 21000, // Based on screenshot
            equityGain: 21500, // Based on screenshot
            settlementPeriod: '45 days',
            expectedROI: 14.8,
            equityPosition: 21500, // Based on screenshot
            timeToSettlement: '45 days',
            riskLevel: 'Low-Medium'
        },
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000'
        ],
        documents: [
            { id: 1, name: 'Loan Agreement', description: 'Contract • 2.4 MB' },
            { id: 2, name: 'Property Valuation', description: 'Valuation • 1.8 MB' },
            { id: 3, name: 'Title Search', description: 'Legal • 856 KB' },
            { id: 4, name: 'Building Inspection', description: 'Inspection • 3.2 MB' },
            { id: 5, name: 'Purchase Agreement', description: 'Contract • 1.2 MB' }
        ]
    }
]
