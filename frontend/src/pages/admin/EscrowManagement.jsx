import AdminBreadcrumb from '../../components/admin/AdminBreadcrumb'
import AdminStatCard from '../../components/admin/AdminStatCard'
import AdminBadge from '../../components/admin/AdminBadge'
import { MOCK_ESCROW_TRANSACTIONS } from '../../data/mockData'

export default function EscrowManagement() {
    const formatCurrency = (amount) => {
        return `A$${amount.toLocaleString()}`
    }

    const totalHeld = 125000
    const totalReleased = 225000
    const remainingBalance = totalHeld - totalReleased

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb items={[
                { label: 'Dashboard', path: '/admin/dashboard' },
                { label: 'Escrow Management' }
            ]} />

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Escrow Release</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
                <AdminStatCard
                    label="Total Held"
                    value={formatCurrency(totalHeld)}
                    icon="📋"
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="Total Released"
                    value={formatCurrency(totalReleased)}
                    icon="📈"
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="Remaining Balance"
                    value={formatCurrency(remainingBalance)}
                    icon="$"
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                />
            </div>

            {/* Alert Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-yellow-600">⚠</span>
                    <div>
                        <p className="text-sm font-medium text-yellow-800">Pending Releases</p>
                        <p className="text-sm text-yellow-700">2 transactions awaiting release (A$15,000)</p>
                    </div>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded">
                    Release All
                </button>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Transaction History <span className="text-gray-500 font-normal">— 4 total transactions</span>
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Date</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Type</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Recipient</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Amount</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ESCROW_TRANSACTIONS.map((transaction, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.type}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.recipient}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <AdminBadge
                                            label={transaction.status}
                                            variant={transaction.status === 'Completed' ? 'completed' : 'pending'}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        {transaction.released ? (
                                            <span className="text-sm text-green-600 font-medium">✓ Released</span>
                                        ) : (
                                            <button className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">
                                                Release
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Escrow Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Escrow Details</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Escrow Agent</p>
                            <p className="text-sm text-gray-900 font-medium">Australian Settlement Services</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">License</p>
                            <p className="text-sm text-gray-900 font-medium">ESA-2024-5678</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Settlement Date</p>
                            <p className="text-sm text-gray-900 font-medium">28 February 2026</p>
                            <p className="text-xs text-gray-500">15 days remaining</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Account Number</p>
                            <p className="text-sm text-gray-900 font-medium">ESC-2024-1234</p>
                        </div>
                    </div>
                </div>

                {/* Security & Compliance */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Compliance</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">✓</span>
                            <div>
                                <p className="text-sm text-gray-900 font-medium">Secure Escrow</p>
                                <p className="text-xs text-gray-500">Funds held in trust account</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">✓</span>
                            <div>
                                <p className="text-sm text-gray-900 font-medium">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-500">All releases require 2FA</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">✓</span>
                            <div>
                                <p className="text-sm text-gray-900 font-medium">Audit Trail</p>
                                <p className="text-xs text-gray-500">All transactions logged</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">✓</span>
                            <div>
                                <p className="text-sm text-gray-900 font-medium">Insured</p>
                                <p className="text-xs text-gray-500">Professional indemnity insurance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
