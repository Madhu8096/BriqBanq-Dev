import { Plus, Eye, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const MOCK_CONTRACTS = []

export default function Contracts() {
    const navigate = useNavigate()
    const formatCurrency = (amount) => {
        return `$${amount.toLocaleString()}`
    }

    const getStatusStyles = (status) => {
        if (status === 'Under Contract') {
            return 'bg-indigo-50 text-indigo-700'
        }
        return 'bg-green-50 text-green-700'
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
                    <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-1">
                    <Plus className="w-4 h-4 flex-shrink-0" /> Create New Contract
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Contracts</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Property</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Contract ID</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Parties</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Contract Value</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Created Date</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                                <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CONTRACTS.map((contract) => (
                                <tr key={contract.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100"
                                                    alt={contract.property}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 font-medium">{contract.property}</p>
                                                <p className="text-xs text-gray-500">{contract.suburb}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{contract.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {contract.party} / {contract.lender}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                        {formatCurrency(contract.value)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{contract.created}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(contract.status)}`}>
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/contracts/${contract.id}`)}
                                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold text-sm transition-colors"
                                            >
                                                <Eye className="w-4 h-4 flex-shrink-0" /> View
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <Download className="w-4 h-4 flex-shrink-0" />
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
