// src/components/admin/case/CaseDetailsTab.jsx
import { useCaseContext } from '../../../context/CaseContext'

export default function CaseDetailsTab() {
    const { caseData } = useCaseContext()

    if (!caseData) return null

    return (
        <div className="space-y-12">
            {/* Section 1: Basic Information */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Case Number</label>
                        <input
                            type="text"
                            value={caseData.id}
                            disabled
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Borrower Name</label>
                        <input
                            type="text"
                            defaultValue={caseData.borrower.name}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Lender Name</label>
                        <input
                            type="text"
                            defaultValue={caseData.lender.name}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Loan Details */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Loan Details</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Outstanding Debt</label>
                        <input
                            type="number"
                            defaultValue={caseData.loan.outstandingDebt}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Interest Rate (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            defaultValue={caseData.loan.interestRate}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Default Rate (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            defaultValue={caseData.loan.defaultRate}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Days in Default</label>
                        <input
                            type="number"
                            defaultValue={caseData.loan.daysInDefault}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Section 3: Property Details */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Property Details</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Address</label>
                        <input
                            type="text"
                            defaultValue={caseData.property.address}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Suburb</label>
                            <input
                                type="text"
                                defaultValue={caseData.property.suburb}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Postcode</label>
                            <input
                                type="text"
                                defaultValue={caseData.property.postcode}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Bedrooms</label>
                            <input
                                type="number"
                                defaultValue={caseData.property.bedrooms}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Bathrooms</label>
                            <input
                                type="number"
                                defaultValue={caseData.property.bathrooms}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Valuation */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Valuation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Valuation Amount</label>
                        <input
                            type="number"
                            defaultValue={caseData.valuation.amount}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Valuation Date</label>
                        <input
                            type="text"
                            defaultValue="15/01/2026"
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Valuer Name</label>
                        <input
                            type="text"
                            defaultValue={caseData.valuation.valuer}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
