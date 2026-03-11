import { Eye, CheckCircle, XCircle } from 'lucide-react'
import AdminStatCard from '../../components/admin/AdminStatCard'
import AdminBadge from '../../components/admin/AdminBadge'
const MOCK_KYC = []

export default function KYCReviewQueue() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">KYC Review</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
                <AdminStatCard
                    label="Pending Reviews"
                    value="2"
                    icon={Eye}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <AdminStatCard
                    label="Approved Today"
                    value="7"
                    icon={CheckCircle}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="Rejected Today"
                    value="2"
                    icon={XCircle}
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">KYC Submissions</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">User</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Role</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Email</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Submitted</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Documents</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_KYC.map((kyc) => (
                                <tr key={kyc.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{kyc.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{kyc.role}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{kyc.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{kyc.submitted}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{kyc.documents} files</td>
                                    <td className="px-4 py-3">
                                        {kyc.status === 'Pending' ? (
                                            <AdminBadge label="Pending" variant="pending" />
                                        ) : (
                                            <AdminBadge label="Approved" variant="approved" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {kyc.status === 'Pending' ? (
                                                <>
                                                    <button className="text-xs border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50">
                                                        Review
                                                    </button>
                                                    <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1">
                                                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Approve
                                                    </button>
                                                    <button className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1">
                                                        <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="text-xs border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5 flex-shrink-0" /> View
                                                </button>
                                            )}
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
