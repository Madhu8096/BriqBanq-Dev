import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, CheckCircle, XCircle, AlertCircle, FileText,
    Mail, Download, Activity, ChevronRight, CheckSquare
} from 'lucide-react';

export default function KYCReviewDetail() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending_review');

    return (
        <div className="space-y-6 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <button onClick={() => navigate('/admin/dashboard')} className="hover:text-gray-900">⌂</button>
                <ChevronRight className="w-4 h-4" />
                <button onClick={() => navigate('/admin/kyc-review')} className="hover:text-gray-900">Admin</button>
                <ChevronRight className="w-4 h-4" />
                <button onClick={() => navigate('/admin/kyc-review')} className="hover:text-gray-900">KYC Review</button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Jennifer Brown</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">KYC Review</h1>
                    <p className="text-sm text-gray-500 mt-1">Submitted 13/03/2026, 12:23:11 pm</p>
                </div>
                <div className="bg-indigo-600 text-white px-3 py-1.5 font-medium rounded-full text-sm self-start">
                    {status === 'pending_review' ? 'pending_review' : status}
                </div>
            </div>

            {/* Decision Bar */}
            <div className="bg-white border text-sm border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Ready for Decision</h3>
                        <p className="text-gray-500 text-sm">100% of required checks completed</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <AlertCircle className="w-4 h-4 text-gray-500" /> Request More Info
                    </button>
                    <button onClick={() => setStatus('rejected')} className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                        <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => setStatus('approved')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                        <CheckCircle className="w-4 h-4 text-white" /> Approve KYC
                    </button>
                </div>
            </div>

            {/* AI Assessment */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="bg-emerald-600 text-white rounded-lg w-12 h-12 flex items-center justify-center font-black text-2xl flex-shrink-0">92</div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">🤖 AI Assessment</h3>
                            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Approve</span>
                            <span className="text-emerald-700 text-sm font-medium">94% confidence</span>
                            <span className="text-emerald-600/60 text-xs">• Processed in 1.2s</span>
                        </div>
                        <p className="text-emerald-800 text-sm">High-quality application with strong verification signals. All automated checks passed. Low fraud risk. Recommend approval.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Document Authenticity', pct: '98%' },
                        { label: 'Facial Recognition Match', pct: '96%' },
                        { label: 'Address Validation', pct: '95%' },
                        { label: 'Fraud Pattern Detection', pct: '99%' },
                    ].map(({ label, pct }) => (
                        <div key={label} className="bg-white rounded-lg p-3 border border-emerald-100">
                            <div className="flex justify-between items-start mb-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-emerald-600 font-bold text-sm">{pct}</span>
                            </div>
                            <div className="text-emerald-900 font-medium text-xs">{label}</div>
                        </div>
                    ))}
                </div>
                <div className="bg-white/60 border border-emerald-200/50 rounded-lg p-4 mb-4">
                    <h4 className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">✨ Key Strengths Identified:</h4>
                    <ul className="list-disc list-inside text-sm text-emerald-800 space-y-1">
                        <li>All identity documents verified successfully</li>
                        <li>No adverse media findings</li>
                        <li>Clean credit history</li>
                    </ul>
                </div>
                <div className="flex items-center gap-4 text-sm text-emerald-800 font-medium bg-emerald-100/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2"><span className="bg-emerald-200 w-5 h-5 rounded flex items-center justify-center text-xs">2</span> Fraud Score (low)</div>
                    <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Trusted Device</div>
                    <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Clean IP Reputation</div>
                    <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 0 Behavioral Flags</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Overview
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                            <FileText className="w-4 h-4" /> Documents (6)
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                            <CheckSquare className="w-4 h-4" /> Verification Checklist
                        </button>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4"><span className="text-indigo-600">👤</span> Personal Information</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {[
                                { label: 'Full Name', value: 'Jennifer Brown' },
                                { label: 'Date of Birth', value: '15/03/1985' },
                                { label: 'Email', value: 'jennifer.brown@example.com' },
                                { label: 'Phone', value: '+61 412 345 678' },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-xs text-gray-500 font-medium block mb-1">{label}</span>
                                    <span className="text-sm text-gray-900 font-semibold">{value}</span>
                                </div>
                            ))}
                            <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium block mb-1">Address</span>
                                <span className="text-sm text-gray-900 font-semibold">123 Collins Street, Melbourne VIC 3000</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium block mb-1">Nationality</span>
                                <span className="text-sm text-gray-900 font-semibold">Australian</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium block mb-1">Role</span>
                                <span className="text-xs mt-1 inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-medium">Investor</span>
                            </div>
                        </div>
                    </div>

                    {/* Organization Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4"><span className="text-indigo-600">🏢</span> Organization Information</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium block mb-1">Company Name</span>
                                <span className="text-sm text-gray-900 font-semibold">Brown Capital Partners Pty Ltd</span>
                            </div>
                            {[
                                { label: 'ABN', value: '12 345 678 901' },
                                { label: 'ACN', value: '123 456 789' },
                                { label: 'Entity Type', value: 'Private Company' },
                                { label: 'Website', value: 'www.browncapital.com.au' },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-xs text-gray-500 font-medium block mb-1">{label}</span>
                                    <span className="text-sm text-gray-900 font-semibold">{value}</span>
                                </div>
                            ))}
                            <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium block mb-1">Business Address</span>
                                <span className="text-sm text-gray-900 font-semibold">123 Collins Street, Melbourne VIC 3000</span>
                            </div>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4"><span className="text-indigo-600">🛡</span> Risk Assessment</h3>
                        <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 mb-4">
                            <div className="text-sm text-emerald-800 font-medium mb-1">Overall Risk Level</div>
                            <div className="text-xl font-bold text-emerald-600">Low</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'PEP Status', value: 'No', isGreen: true },
                                { label: 'Sanctions Match', value: 'No', isGreen: true },
                                { label: 'Adverse Media', value: 'None', isGreen: true },
                                { label: 'Estimated Wealth', value: '$2M - $5M', isGreen: false },
                            ].map(({ label, value, isGreen }) => (
                                <div key={label} className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-xs text-gray-500 font-medium block mb-1">{label}</span>
                                    {isGreen ? (
                                        <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {value}</span>
                                    ) : (
                                        <span className="text-sm text-gray-900 font-semibold">{value}</span>
                                    )}
                                </div>
                            ))}
                            <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium block mb-1">Source of Funds</span>
                                <span className="text-sm text-gray-900 font-semibold">Employment Income & Investments</span>
                            </div>
                            <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium block mb-1">Transaction Profile</span>
                                <span className="text-sm text-gray-900 font-semibold">Medium frequency, consistent amounts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Completion Status */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center">
                        <h3 className="w-full text-base font-bold text-gray-900 mb-6">Completion Status</h3>
                        <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-gray-200 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                                <circle className="text-emerald-500 stroke-current" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset="0"></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-3xl font-bold text-gray-900">100%</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Required checks completed</p>
                        <div className="w-full space-y-3">
                            {[
                                { label: 'Documents:', value: '6/6', green: false },
                                { label: 'Identity:', value: 'Verified', green: true },
                                { label: 'Address:', value: 'Verified', green: true },
                                { label: 'Business:', value: 'Verified', green: true },
                                { label: 'AML/CTF:', value: 'Cleared', green: true },
                            ].map(({ label, value, green }) => (
                                <div key={label} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{label}</span>
                                    {green ? (
                                        <span className="font-semibold text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {value}</span>
                                    ) : (
                                        <span className="font-semibold text-gray-900">{value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 mb-6">Timeline</h3>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-300 before:to-gray-200">
                            {[
                                { title: 'Assigned for manual review', by: 'System', date: '13/03/2026, 12:23:11 pm', isFirst: true },
                                { title: 'Automated verification checks passed', by: 'System', date: '13/03/2026, 11:53:11 am', isFirst: false },
                                { title: 'All documents uploaded', by: 'Jennifer Brown', date: '13/03/2026, 11:23:11 am', isFirst: false },
                                { title: 'KYC Application Submitted', by: 'Jennifer Brown', date: '13/03/2026, 11:23:11 am', isFirst: false },
                            ].map(({ title, by, date, isFirst }) => (
                                <div key={title} className="relative flex items-start gap-4">
                                    <div className={`absolute left-1/2 md:left-auto md:-translate-x-0 w-5 h-5 ${isFirst ? 'bg-indigo-100' : 'bg-emerald-100'} rounded-full border-4 border-white flex items-center justify-center -ml-2.5 shadow-sm z-10`}>
                                        {isFirst ? <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> : <CheckCircle className="w-3 h-3 text-emerald-600" />}
                                    </div>
                                    <div className="pl-6 md:pl-8">
                                        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                                        <div className="text-xs text-gray-500 mt-1">{by}</div>
                                        <div className="text-xs text-gray-400">{date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition"><Mail className="w-4 h-4 text-gray-400" /> Email Applicant</button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition"><Download className="w-4 h-4 text-gray-400" /> Download All Documents</button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition"><Activity className="w-4 h-4 text-gray-400" /> View Activity Log</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
