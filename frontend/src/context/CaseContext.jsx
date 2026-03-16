// src/context/CaseContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { caseService } from '../api/dataService'

const CaseContext = createContext()

export function CaseProvider({ children }) {
    const { id: caseId } = useParams()
    const [caseData, setCaseData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCaseData = async () => {
            if (!caseId) return;
            
            setLoading(true);
            try {
                const result = await caseService.getCaseDetails(caseId);
                const response = result?.success ? result.data : result;

                if (response) {
                    // Map backend flat structure to the nested structure the UI expects
                    const mappedData = {
                        ...response,
                        id: response.id || caseId,
                        // Ensure nested objects exist for UI compatibility
                        borrower: {
                            name: response.borrower_name || response.borrower?.name || 'Generic Borrower',
                            contact: ''
                        },
                        lender: {
                            name: response.lender_name || 'Not Assigned',
                            contact: ''
                        },
                        loan: {
                            outstandingDebt: response.outstanding_debt || 0,
                            interestRate: 0,
                            defaultRate: 0,
                            ltv: response.estimated_value > 0 ? ((response.outstanding_debt / response.estimated_value) * 100).toFixed(1) : 'UNDEFINED'
                        },
                        property: {
                            address: response.property_address || '',
                            suburb: '', // Backend doesn't split these currently
                            state: '',
                            postcode: '',
                            type: response.property_type || 'Unknown'
                        },
                        valuation: {
                            amount: response.estimated_value || 0,
                            date: response.updated_at,
                            valuer: 'Verified Valuer'
                        },
                        financial: {
                            propertyValuation: response.estimated_value || 0,
                            outstandingDebt: response.outstanding_debt || 0,
                            equityAvailable: (response.estimated_value || 0) - (response.outstanding_debt || 0),
                            minimumBid: (response.estimated_value || 0) * 0.8, // Example logic
                            currentHighestBid: response.estimated_value || 0
                        },
                        timeline: {
                            caseCreated: response.created_at,
                            lastUpdated: response.updated_at
                        },
                        risk_level: response.risk_level || 'Medium',
                        status: response.status || 'DRAFT',
                        bids: response.bids || [], 
                        documents: response.documents || [],
                        images: response.images || [],
                        activity: response.activity || [
                            { id: 1, title: 'Case Created', description: response.description || 'Borrower submitted the case', timestamp: response.created_at }
                        ],
                        settlement: response.settlement || {
                            estimatedProgress: 45,
                            checklist: [
                                { id: 1, item: 'Title Deed Verification', responsible: 'Lead Lawyer', status: 'Approved' },
                                { id: 2, item: 'Discharge Authority', responsible: 'Lender Rep', status: 'Pending' }
                            ],
                            timeline: [
                                { step: 'Creation', date: 'Jan 2026', status: 'completed' },
                                { step: 'Review', date: 'Feb 2026', status: 'completed' },
                                { step: 'Settlement', date: 'Mar 2026', status: 'in-progress' }
                            ]
                        },
                        investmentMemo: response.investmentMemo || {
                            executiveSummary: response.description || 'Tactical reallocation of capital focused on high-yield real estate collateral.',
                            riskAnalysis: 'Market volatility mitigated by high LTV cushion and prime location.',
                            status: 'DRAFT'
                        },
                        messages: response.messages || []
                    };
                    setCaseData(mappedData);
                }
            } catch (error) {
                console.error("Error fetching case details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCaseData();
    }, [caseId])

    const updateCase = (updates) => {
        setCaseData(prev => ({ ...prev, ...updates }))
        // TODO: Call API to persist changes
    }

    return (
        <CaseContext.Provider value={{ caseData, loading, setLoading, updateCase }}>
            {children}
        </CaseContext.Provider>
    )
}

export const useCaseContext = () => {
    const context = useContext(CaseContext)
    if (!context) {
        throw new Error('useCaseContext must be used within a CaseProvider')
    }
    return context
}
