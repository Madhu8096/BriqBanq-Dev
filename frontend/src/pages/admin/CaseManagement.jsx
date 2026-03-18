import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2, RefreshCw, Download, FileText, CheckSquare } from 'lucide-react'
import AdminBreadcrumb from '../../components/admin/AdminBreadcrumb'
import AdminStatCard from '../../components/admin/AdminStatCard'
import AdminRiskBadge from '../../components/admin/AdminRiskBadge'
import { MOCK_CASES } from '../../data/mockData'

import { caseService } from '../../api/dataService'

export default function CaseManagement() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Status')
    const [cases, setCases] = useState([])
    const [allCases, setAllCases] = useState([]) // Store all cases for filtering
    const [isLoading, setIsLoading] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    // ============================================================================
    // REFRESH FUNCTIONALITY - Fetch all cases from backend
    // ============================================================================
    const handleRefresh = async () => {
        setIsLoading(true)
        try {
            const res = await caseService.getAllCases(statusFilter === 'All Status' ? null : statusFilter)
            
            if (res.success) {
                // The backend returns { items: [], total: 0, ... }
                const fetchedItems = res.data.items || []
                
                // Map backend format to component format if needed
                const mappedCases = fetchedItems.map(c => ({
                    id: c.id,
                    borrower: c.borrower_name || (c.borrower_id ? c.borrower_id.split('-')[0] + '...' : 'Unknown'),
                    property: c.property_address || 'N/A',
                    suburb: c.property_type || '',
                    debt: c.outstanding_debt || 0,
                    valuation: c.estimated_value || 0,
                    status: c.status,
                    risk: c.risk_level || 'Medium',
                    created: new Date(c.created_at).toLocaleDateString()
                }))

                setAllCases(mappedCases)
                setCases(mappedCases)
            } else {
                alert(res.error || "Failed to load cases")
            }
        } catch (error) {
            console.error('Error refreshing cases:', error)
            alert('An unexpected error occurred.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        handleRefresh()
    }, [])

    // ============================================================================
    // EXPORT FUNCTIONALITY - Generate PDF of all cases
    // ============================================================================
    const handleExport = async () => {
        setIsExporting(true)
        try {
            // Dynamic import of jsPDF to reduce initial bundle size
            const { jsPDF } = await import('jspdf')
            await import('jspdf-autotable')

            const doc = new jsPDF()

            // Add title
            doc.setFontSize(18)
            doc.text('Case Management Report', 14, 20)

            // Add metadata
            doc.setFontSize(10)
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)
            doc.text(`Total Cases: ${allCases.length}`, 14, 34)
            doc.text(`Filtered Cases: ${cases.length}`, 14, 40)

            // Prepare table data
            const tableData = allCases.map(caseItem => [
                caseItem.id,
                caseItem.borrower,
                `${caseItem.property}, ${caseItem.suburb}`,
                formatCurrency(caseItem.debt),
                formatCurrency(caseItem.valuation),
                caseItem.status,
                caseItem.risk,
                caseItem.created
            ])

            // Add table
            doc.autoTable({
                head: [['Case Number', 'Borrower', 'Property', 'Debt', 'Valuation', 'Status', 'Risk', 'Created']],
                body: tableData,
                startY: 46,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [79, 70, 229] }, // Indigo color
                alternateRowStyles: { fillColor: [249, 250, 251] },
                margin: { top: 46 }
            })

            // Save the PDF
            doc.save(`case-management-${new Date().toISOString().split('T')[0]}.pdf`)

            console.log('PDF exported successfully')
        } catch (error) {
            console.error('Error exporting PDF:', error)
            alert('Failed to export PDF. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    // ============================================================================
    // STATUS FILTER FUNCTIONALITY - Filter cases by status
    // ============================================================================
    const applyFilters = (casesToFilter, status, search) => {
        let filtered = [...casesToFilter]

        // Apply status filter
        if (status !== 'All Status') {
            filtered = filtered.filter(c => c.status === status)
        }

        // Apply search filter
        if (search.trim()) {
            const searchLower = search.toLowerCase()
            filtered = filtered.filter(c =>
                c.id.toLowerCase().includes(searchLower) ||
                c.borrower.toLowerCase().includes(searchLower) ||
                c.property.toLowerCase().includes(searchLower) ||
                c.suburb.toLowerCase().includes(searchLower)
            )
        }

        setCases(filtered)
    }

    // Handle status filter change
    const handleStatusFilterChange = async (newStatusUI) => {
        setStatusFilter(newStatusUI)
        
        let backendStatus = null
        if (newStatusUI === 'Active') backendStatus = 'LISTED'
        else if (newStatusUI === 'In Auction') backendStatus = 'AUCTION'
        else if (newStatusUI === 'Pending') backendStatus = 'SUBMITTED'
        else if (newStatusUI === 'Completed') backendStatus = 'CLOSED'
        else if (newStatusUI === 'Rejected') backendStatus = 'REJECTED'

        setIsLoading(true)
        try {
            const res = await caseService.getAllCases(backendStatus)
            if (res.success) {
                const fetchedItems = res.data.items || []
                const mappedCases = fetchedItems.map(c => ({
                    id: c.id,
                    borrower: c.borrower_name || (c.borrower_id ? c.borrower_id.split('-')[0] + '...' : 'Unknown'),
                    property: c.property_address || 'N/A',
                    suburb: c.property_type || '',
                    debt: c.outstanding_debt || 0,
                    valuation: c.estimated_value || 0,
                    status: c.status,
                    risk: c.risk_level || 'Medium',
                    created: new Date(c.created_at).toLocaleDateString()
                }))
                setAllCases(mappedCases)
                applyFilters(mappedCases, newStatusUI, searchTerm)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle search term change
    const handleSearchChange = (newSearch) => {
        setSearchTerm(newSearch)
        applyFilters(allCases, statusFilter, newSearch)
    }

    // TODO: API function for fetching cases by status (for future backend integration)
    // const fetchCasesByStatus = async (status) => {
    //     setIsLoading(true)
    //     try {
    //         const endpoint = status === 'All Status' 
    //             ? '/api/admin/cases' 
    //             : `/api/admin/cases?status=${encodeURIComponent(status)}`
    //         const response = await fetch(endpoint)
    //         const data = await response.json()
    //         setAllCases(data)
    //         applyFilters(data, status, searchTerm)
    //     } catch (error) {
    //         console.error('Error fetching cases:', error)
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    const handleStatusChange = async (caseId, newStatusUI) => {
        let backendStatus = newStatusUI
        if (newStatusUI === 'Active') backendStatus = 'LISTED'
        else if (newStatusUI === 'In Auction') backendStatus = 'AUCTION'
        else if (newStatusUI === 'Pending') backendStatus = 'SUBMITTED'
        else if (newStatusUI === 'Completed') backendStatus = 'CLOSED'

        try {
            const res = await caseService.updateCaseStatus(caseId, backendStatus)
            if (res.success) {
                // Update local state
                const updatedCases = allCases.map(c => c.id === caseId ? { ...c, status: backendStatus } : c)
                setAllCases(updatedCases)
                applyFilters(updatedCases, statusFilter, searchTerm)
            } else {
                alert(res.error || "Failed to update status")
            }
        } catch (err) {
            alert("An error occurred during status update")
        }
    }

    const handleDeleteCase = async (caseId) => {
        if (!window.confirm("Are you sure you want to delete this case? This action cannot be undone.")) return

        try {
            const res = await caseService.deleteCase(caseId)
            if (res.success) {
                const updatedCases = allCases.filter(c => c.id !== caseId)
                setAllCases(updatedCases)
                setCases(prev => prev.filter(c => c.id !== caseId))
            } else {
                alert(res.error || "Failed to delete case")
            }
        } catch (err) {
            alert("An error occurred during deletion")
        }
    }

    const formatCurrency = (amount) => {
        return `A$${(amount / 1000).toFixed(0)}k`
    }

    // Calculate stats based on all cases
    const stats = {
        total: allCases.length,
        active: allCases.filter(c => c.status === 'Active').length,
        inAuction: allCases.filter(c => c.status === 'In Auction').length,
        completed: allCases.filter(c => c.status === 'Completed').length,
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb items={[
                { label: 'Dashboard', path: '/admin/dashboard' },
                { label: 'Admin' },
                { label: 'Case Management' }
            ]} />

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AdminStatCard
                    label="Total Cases"
                    value={stats.total.toString()}
                    icon={FileText}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="Active Cases"
                    value={stats.active.toString()}
                    icon={Eye}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="In Auction"
                    value={stats.inAuction.toString()}
                    icon={RefreshCw}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                />
                <AdminStatCard
                    label="Completed"
                    value={stats.completed.toString()}
                    icon={CheckSquare}
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">All Cases ({cases.length})</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className={`flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <RefreshCw className={`w-4 h-4 flex-shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? 'Refreshing...' : 'Refresh'}
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className={`flex items-center gap-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded transition-colors ${isExporting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <Download className="w-4 h-4 flex-shrink-0" />
                                {isExporting ? 'Exporting...' : 'Export'}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search cases..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>In Auction</option>
                            <option>Pending</option>
                            <option>Completed</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Case Number</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Borrower</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Property</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Debt</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Valuation</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Risk</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Created</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((caseItem) => (
                                <tr key={caseItem.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{caseItem.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{caseItem.borrower}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {caseItem.property}, {caseItem.suburb}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(caseItem.debt)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(caseItem.valuation)}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={
                                                caseItem.status === 'LISTED' ? 'Active' :
                                                caseItem.status === 'AUCTION' ? 'In Auction' :
                                                caseItem.status === 'SUBMITTED' ? 'Pending' :
                                                caseItem.status === 'UNDER_REVIEW' ? 'Pending' :
                                                caseItem.status === 'CLOSED' ? 'Completed' :
                                                caseItem.status === 'REJECTED' ? 'Rejected' :
                                                caseItem.status
                                            }
                                            onChange={(e) => handleStatusChange(caseItem.id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                        >
                                            <option>Active</option>
                                            <option>In Auction</option>
                                            <option>Pending</option>
                                            <option>Completed</option>
                                            <option>Rejected</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <AdminRiskBadge risk={caseItem.risk} />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{caseItem.created}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/case-details/${caseItem.id}`)}
                                                className="text-gray-600 hover:text-gray-800"
                                            >
                                                <Eye className="w-4 h-4 flex-shrink-0" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCase(caseItem.id)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 flex-shrink-0" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
