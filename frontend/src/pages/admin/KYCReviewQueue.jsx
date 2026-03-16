import { useState, useEffect } from 'react'
import { Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminStatCard from '../../components/admin/AdminStatCard'
import AdminBadge from '../../components/admin/AdminBadge'
import { kycService } from '../../api/dataService'

export default function KYCReviewQueue() {
    const navigate = useNavigate()
    const [kycList, setKycList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })

    const fetchKYC = async () => {
        setLoading(true)
        try {
            const res = await kycService.getPendingKYC()
            if (res.success) {
                setKycList(res.data)
                setStats(prev => ({ ...prev, pending: res.data.length }))
            } else {
                setError(res.error || "Failed to load KYC queue")
            }
        } catch (err) {
            console.error("KYC Queue: Error fetching data", err)
            setError("Unexpected error loading KYC queue")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchKYC()
    }, [])

    const handleApprove = async (id) => {
        try {
            const res = await kycService.approveKYC(id)
            if (res.success) {
                fetchKYC() // Refresh list
            } else {
                alert(res.error || "Failed to approve KYC")
            }
        } catch (err) {
            alert("Unexpected error during approval")
        }
    }

    if (loading && kycList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading KYC submissions...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900">KYC Review</h1>
                   <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
                </div>
                <button 
                  onClick={fetchKYC}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full"
                >
                  Refresh Queue
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
                <AdminStatCard
                    label="Pending Reviews"
                    value={stats.pending}
                    icon={Eye}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <AdminStatCard
                    label="Approved Today"
                    value={stats.approved}
                    icon={CheckCircle}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="Rejected Today"
                    value={stats.rejected}
                    icon={XCircle}
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">KYC Submissions</h2>
                    <span className="text-xs text-gray-500 font-medium">{kycList.length} total pending</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/30">
                                <th className="text-left text-xs font-bold text-gray-500 px-6 py-4 uppercase tracking-wider">User</th>
                                <th className="text-left text-xs font-bold text-gray-500 px-6 py-4 uppercase tracking-wider">Type</th>
                                <th className="text-left text-xs font-bold text-gray-500 px-6 py-4 uppercase tracking-wider">Doc Number</th>
                                <th className="text-left text-xs font-bold text-gray-500 px-6 py-4 uppercase tracking-wider">Submitted</th>
                                <th className="text-left text-xs font-bold text-gray-500 px-6 py-4 uppercase tracking-wider">Status</th>
                                <th className="text-right text-xs font-bold text-gray-500 px-6 py-4 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {kycList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No pending KYC submissions found.
                                    </td>
                                </tr>
                            ) : kycList.map((kyc) => (
                                <tr key={kyc.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <div className="font-semibold text-gray-900">User ID: {String(kyc.user_id).split('-')[0]}...</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">{kyc.document_type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono whitespace-nowrap">{kyc.document_number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                       {new Date(kyc.submitted_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <AdminBadge label={kyc.status} variant={kyc.status.toLowerCase() === 'submitted' ? 'pending' : 'approved'} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => navigate(`/admin/kyc-review/${kyc.id}`)}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                Review
                                            </button>
                                            <button 
                                                onClick={() => handleApprove(kyc.id)}
                                                className="text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Approve
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
