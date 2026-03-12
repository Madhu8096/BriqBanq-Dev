// src/context/CaseContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MOCK_CASE_DETAILS } from '../data/mockCaseData'

const CaseContext = createContext()

export function CaseProvider({ children }) {
    const { caseId } = useParams()
    const [caseData, setCaseData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: Replace with API call
        // getCaseDetails(caseId).then(res => setCaseData(res.data))

        // Simulate loading for better UX and testing
        setLoading(true)
        const timer = setTimeout(() => {
            // Mock data for now. In a real app, we'd find the specific case.
            // For this demo, we'll just use the one mock case object but update the ID.
            setCaseData({ ...MOCK_CASE_DETAILS, id: caseId })
            setLoading(false)
        }, 500)

        return () => clearTimeout(timer)
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
