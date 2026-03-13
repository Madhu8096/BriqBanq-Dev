import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Activity, AlertCircle, AlertTriangle, ArrowRight, ArrowUpRight, Bath, BedDouble, Bell, Briefcase, Building, Calendar, Car, Check, CheckCircle, CheckCircle2, CheckSquare, ChevronDown, ChevronRight, ClipboardCheck, ClipboardList, Clock, Copy, DollarSign, Download, Edit3, ExternalLink, Eye, FileCheck, FileSearch, FileText, Filter, Flag, Gavel, Handshake, Hash, HelpCircle, History, Home, Image as ImageIcon, Info, Layers, LayoutDashboard, Link as LinkIcon, Lock, Mail, MapPin, Maximize2, MessageSquare, MoreHorizontal, Paperclip, Pause, PenTool, PieChart, Plus, PlusCircle, Printer, RefreshCw, Scale, Search, SearchIcon, Send, Settings, Share, Shield, ShieldCheck, Sparkles, Target, TrendingUp, Upload, User, Users, Wallet, X, XCircle, Zap
} from "lucide-react";
import BidsTab from "./case-details-tabs/BidsTab";
import MessagesTab from "./case-details-tabs/MessagesTab";
import { LoadingState, ErrorState } from "../../components/common/States";
import { dealsService, auctionService } from "../../api/dataService";

export default function InvestorCaseDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [manageModalTab, setManageModalTab] = useState("Case Details");
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingDoc, setIsGeneratingDoc] = useState({ type: null, active: false });
    const [propertyImages, setPropertyImages] = useState([]);
    const [generatedDocs, setGeneratedDocs] = useState([]);

    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [settlementSubTab, setSettlementSubTab] = useState("AI Checklist Manager");
    const [expandedCategory, setExpandedCategory] = useState("Legal Requirements");
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isBulkCommModalOpen, setIsBulkCommModalOpen] = useState(false);
    const [isAIAssistantModalOpen, setIsAIAssistantModalOpen] = useState(false);
    const [isAddChecklistItemModalOpen, setIsAddChecklistItemModalOpen] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [bulkMessage, setBulkMessage] = useState({ subject: "", body: "" });

    const [settlementMessage, setSettlementMessage] = useState("");
    const [settlementOverviewData, setSettlementOverviewData] = useState({
        property: {
            id: "MIP-2026-003",
            title: "7 Park Lane",
            location: "South Yarra, VIC",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
            settlementDate: "13 Mar 2026",
            readiness: 85,
            status: "Pending Docs"
        },
        timeline: [
            { id: 1, label: "Contract Signed", date: "27 Jan 2026", status: "completed" },
            { id: 2, label: "Escrow Funded", date: "11 Feb 2026", status: "completed" },
            { id: 3, label: "All Docs Received", date: "03 Mar 2026", status: "pending" },
            { id: 4, label: "Settlement Booked", date: "08 Mar 2026", status: "pending" },
            { id: 5, label: "Funds Released", date: "13 Mar 2026", status: "pending" }
        ],
        checklist: [
            { id: 1, item: "Signed Loan Agreement", responsible: "Borrower", dueDate: "01 Mar 2026", status: "Open", uploadStatus: "pending" },
            { id: 2, item: "Discharge Authority", responsible: "Lender", dueDate: "03 Mar 2026", status: "Submitted", uploadStatus: "uploaded" },
            { id: 3, item: "Title Transfer Documents", responsible: "Lawyer", dueDate: "24 Feb 2026", status: "Open", uploadStatus: "overdue" },
            { id: 4, item: "Insurance Certificate", responsible: "Borrower", dueDate: "05 Mar 2026", status: "Approved", uploadStatus: "uploaded" }
        ],
        outstanding: [
            { id: 1, title: "Title Transfer Documents", responsible: "Lawyer", status: "overdue", days: "2 days overdue" },
            { id: 2, title: "Signed Loan Agreement", responsible: "Borrower", status: "due_soon", days: "3 days left" },
            { id: 3, title: "Discharge Authority", responsible: "Lender", status: "awaiting_approval", days: "" }
        ],
        thread: [
            { id: 1, user: "Sarah Mitchell", role: "Admin", time: "10:01", message: "All parties confirmed for settlement on March 15th", initials: "S", color: "bg-blue-600" },
            { id: 2, user: "David Chen", role: "Lawyer", time: "11:01", message: "Title transfer documents uploaded", initials: "D", color: "bg-indigo-600" }
        ],
        documents: [
            { id: 1, title: "Signed Loan Agreement", responsible: "Borrower", version: "2", by: "John Smith", status: "Uploaded" },
            { id: 2, title: "Discharge Authority", responsible: "Lender", version: "1", by: "ANZ Bank", status: "Uploaded" },
            { id: 3, title: "Title Transfer", responsible: "Lawyer", version: "0", by: "", status: "Pending" },
            { id: 4, title: "Insurance Certificate", responsible: "Borrower", version: "1", by: "John Smith", status: "Uploaded" },
            { id: 5, title: "ID Verification", responsible: "Borrower", version: "1", by: "John Smith", status: "Approved" }
        ]
    });

    const [caseMessages, setCaseMessages] = useState([
        { id: 1, user: "Sarah Mitchell", role: "Borrower", time: "about 4 hours ago", message: "I have uploaded the additional property documentation as requested.", initials: "SM", avatarColor: "bg-gray-100 text-gray-400", isMe: false },
        { id: 2, user: "David Williams", role: "Investor", time: "about 4 hours ago", message: "Thank you. Could you also provide the strata report?", initials: "DW", avatarColor: "bg-blue-600 text-white", isMe: true },
        { id: 3, user: "Sarah Mitchell", role: "Borrower", time: "about 3 hours ago", message: "Yes, I will upload it within the next hour.", initials: "SM", avatarColor: "bg-gray-100 text-gray-400", isMe: false }
    ]);

    const [bidHistory, setBidHistory] = useState([
        { id: 1, bidder: "Platinum Capital Partners", amount: "$1,100,000", timestamp: "26 Feb 2026, 10:13 AEST", status: "Active" },
        { id: 2, bidder: "Elite Global Investments", amount: "$1,050,000", timestamp: "25 Feb 2026, 14:45 AEST", status: "Outbid" },
        { id: 3, bidder: "Secure Wealth Fund", amount: "$1,020,000", timestamp: "24 Feb 2026, 09:30 AEST", status: "Outbid" },
        { id: 4, bidder: "Apex Ventures", amount: "$1,000,000", timestamp: "23 Feb 2026, 11:15 AEST", status: "Outbid" }
    ]);

    const [newMessageText, setNewMessageText] = useState("");

    const [nccpStatus, setNccpStatus] = useState("null"); // 'yes', 'no', or 'null'

    const [nccpChecklist, setNccpChecklist] = useState([
        { id: 1, title: "Loan is for personal, domestic or household purposes", checked: true },
        { id: 2, title: "Credit provider holds Australian Credit License", checked: true },
        { id: 3, title: "Responsible lending obligations complied with", checked: false },
        { id: 4, title: "Key Facts Sheet provided to borrower", checked: false },
        { id: 5, title: "Assessment of unsuitability conducted", checked: false },
        { id: 6, title: "NCCP disclosure documents provided", checked: false }
    ]);

    const [documentReviews, setDocumentReviews] = useState([
        { id: 1, title: "Loan Agreement", reviewed: true, status: 'compliant', notes: '' },
        { id: 2, title: "Mortgage Documents", reviewed: false, status: null, notes: '' },
        { id: 3, title: "Default Notice (Section 57)", reviewed: false, status: null, notes: '' },
        { id: 4, title: "Notice of Exercise of Power of Sale", reviewed: false, status: null, notes: '' },
        { id: 5, title: "Borrower Correspondence", reviewed: false, status: null, notes: '' },
        { id: 6, title: "Title Documents", reviewed: false, status: null, notes: '' },
        { id: 7, title: "Valuation Report", reviewed: false, status: null, notes: '' },
        { id: 8, title: "Insurance Certificates", reviewed: false, status: null, notes: '' },
        { id: 9, title: "Credit Contract", reviewed: false, status: null, notes: '' },
        { id: 10, title: "Financial Hardship Correspondence", reviewed: false, status: null, notes: '' }
    ]);

    const [enforcementSteps, setEnforcementSteps] = useState([
        { id: 1, title: "Default Notice Issued (Section 57)", checked: true, required: true, date: "02/10/2026", status: "compliant", notes: "" },
        { id: 2, title: "Minimum 30-day notice period observed", checked: false, required: true, date: "", status: null, notes: "" },
        { id: 3, title: "Notice of Exercise of Power of Sale issued", checked: false, required: true, date: "", status: null, notes: "" },
        { id: 4, title: "All statutory notice periods complied with", checked: false, required: true, date: "", status: null, notes: "" },
        { id: 5, title: "Good faith attempts to contact borrower documented", checked: false, required: true, date: "", status: null, notes: "" },
        { id: 6, title: "Financial hardship assessment conducted", checked: false, required: false, date: "", status: null, notes: "" },
        { id: 7, title: "Mortgagee duties complied with", checked: false, required: true, date: "", status: null, notes: "" }
    ]);

    const [loanCompliance, setLoanCompliance] = useState([
        { id: 1, title: "No outstanding disputes or litigation", checked: true, critical: true },
        { id: 2, title: "All notices properly served and documented", checked: false, critical: true },
        { id: 3, title: "No cooling-off period violations", checked: false, critical: true },
        { id: 4, title: "Interest calculations are correct", checked: false, critical: false },
        { id: 5, title: "Fees and charges comply with loan agreement", checked: false, critical: true },
        { id: 6, title: "No unconscionable conduct issues identified", checked: false, critical: true },
        { id: 7, title: "Title search confirms no adverse encumbrances", checked: false, critical: true },
        { id: 8, title: "Property can be legally sold", checked: false, critical: true },
        { id: 9, title: "No bankruptcy or insolvency proceedings", checked: false, critical: true },
        { id: 10, title: "All required statutory declarations obtained", checked: false, critical: false }
    ]);

    const [soaFile, setSoaFile] = useState(null);
    const [lawyerReviewNotes, setLawyerReviewNotes] = useState("");

    const [newChecklistItem, setNewChecklistItem] = useState({
        item: "",
        responsible: "Borrower",
        dueDate: new Date().toISOString().split('T')[0]
    });

    const [newTask, setNewTask] = useState({
        title: "",
        category: "Legal Requirements",
        assignee: "Sarah Mitchell",
        date: new Date().toISOString().split('T')[0],
        priority: "Medium",
        desc: ""
    });

    // Mock data for the case - updated to match screenshots
    const [caseData, setCaseData] = useState({
        id: id || "MIP-2026-003",
        status: "Under Contract",
        riskLevel: "Low Risk",
        address: "7 Park Lane, South Yarra, VIC 3141",
        borrower: "Emma Rodriguez",
        lender: "ANZ",
        outstandingDebt: 1600000,
        propertyValuation: 1850000,
        interestRate: 5.75,
        defaultRate: 8.25,
        daysInDefault: 0,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        landSize: "180 m²",
        propertyType: "Townhouse",
        suburb: "South Yarra",
        postcode: "3141",
        valuationDate: "01 Feb 2026",
        valuerName: "Preston Rowe Paterson",
        bidsCount: 12,
        highestBid: 1750000,
        daysActive: 32,
        sinceDate: "25 Jan 2026, 05:30",
        lastUpdated: "11 Feb 2026, 05:30",
        updatedDaysAgo: 15,
        riskScore: 25,
        lvr: 86.49,
        equity: 250000,
        recentActivity: [
            { type: "bid", title: "New bid placed", desc: "Platinum Capital Partners bid $1,100,000", time: "26 Feb 2026, 10:13 AEST" },
            { type: "doc", title: "Document uploaded", desc: "Property inspection report added", time: "26 Feb 2026, 08:28 AEST" },
            { type: "msg", title: "Message received", desc: "Sarah Mitchell sent a message", time: "26 Feb 2026, 06:28 AEST" },
        ],
        documentCollection: { current: 0, total: 13 },
        verificationStatus: { current: 0, total: 5 },
        totalParties: 0,
        documents: [
            { name: "Property Inspection Report.pdf", type: "Inspection", uploadedBy: "Sarah Mitchell", date: "26 Feb 2026" },
            { name: "Valuation Report.pdf", type: "Valuation", uploadedBy: "Preston Rowe Paterson", date: "01 Feb 2026" }
        ]
    });

    const [caseSettlementData, setCaseSettlementData] = useState({
        summary: {
            completed: 6,
            total: 18,
            inProgress: 5,
            overdue: 0,
            blocked: 0,
            estCompletion: "04 Mar 2026",
            daysLeft: 5
        },
        categories: [
            {
                id: "legal",
                title: "Legal Requirements",
                icon: <FileText size={18} className="text-blue-600" />,
                bg: "bg-blue-50/50",
                completed: 3,
                total: 5,
                progress: 60,
                tasks: [
                    { id: "s32", title: "Vendor Section 32 Statement Review", desc: "Review and verify Vendor Statement (Section 32) for accuracy and completeness", status: "COMPLETED", priority: "CRITICAL", assignee: "Lender's Lawyer", email: "lawyer@example.com", date: "21 Feb 2026", days: "-5 days", completed: true, notes: ["Reviewed and approved by legal team"], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "cos", title: "Contract of Sale Review", desc: "Legal review of Contract of Sale and special conditions", status: "COMPLETED", priority: "CRITICAL", assignee: "Borrower's Lawyer", email: "borrower-lawyer@example.com", date: "23 Feb 2026", days: "-3 days", completed: true, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "title", title: "Title Search & Certificate", desc: "Conduct title search and obtain current title certificate", status: "COMPLETED", priority: "HIGH", assignee: "Conveyancer", email: "conveyancer@example.com", date: "24 Feb 2026", days: "-2 days", completed: true, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "mda", title: "Mortgage Discharge Authority", desc: "Obtain mortgage discharge authority from existing lender", status: "IN PROGRESS", priority: "HIGH", assignee: "Lender", email: "lender@example.com", date: "28 Feb 2026", days: "1 days", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "tld", title: "Transfer of Land Documentation", desc: "Prepare and lodge Transfer of Land documents with Land Registry", status: "NOT STARTED", priority: "CRITICAL", assignee: "Conveyancer", email: "conveyancer@example.com", date: "03 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" }
                ]
            },
            {
                id: "financial",
                title: "Financial Settlement",
                icon: <TrendingUp size={18} className="text-emerald-600" />,
                bg: "bg-emerald-50/50",
                completed: 1,
                total: 4,
                progress: 25,
                tasks: [
                    { id: "ffc", title: "Final Settlement Figure Calculation", desc: "Calculate final settlement amount including adjustments", status: "COMPLETED", priority: "CRITICAL", assignee: "Accountant", email: "accountant@example.com", date: "25 Feb 2026", days: "-1 days", completed: true, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "roa", title: "Rates & Outgoings Adjustment", desc: "Calculate pro-rata adjustments for council rates, water, strata fees", status: "IN PROGRESS", priority: "HIGH", assignee: "Accountant", email: "accountant@example.com", date: "27 Feb 2026", days: "0 days", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "bta", title: "Bank Transfer Authorization", desc: "Set up and authorize PEXA settlement funds transfer", status: "NOT STARTED", priority: "CRITICAL", assignee: "Financial Settlement Agent", email: "settlement@example.com", date: "02 Mar 2026", days: "3 days", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "pel", title: "Payout to Existing Lender", desc: "Process payout of existing mortgage to Commonwealth Bank", status: "NOT STARTED", priority: "CRITICAL", assignee: "Existing Lender", email: "cba@example.com", date: "03 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" }
                ]
            },
            {
                id: "docs",
                title: "Documentation",
                icon: <ClipboardCheck size={18} className="text-purple-600" />,
                bg: "bg-purple-50/50",
                completed: 1,
                total: 3,
                progress: 33,
                tasks: [
                    { id: "vsc", title: "Verification of Identity (VOI)", desc: "Complete VOI for all directors and individual borrowers", status: "COMPLETED", priority: "CRITICAL", assignee: "Conveyancer", email: "conveyancer@example.com", date: "20 Feb 2026", days: "-6 days", completed: true, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "sdd", title: "Signed Disclosure Documents", desc: "Obtain fully executed disclosure forms and compliance certificates", status: "IN PROGRESS", priority: "HIGH", assignee: "Lender", email: "lender@example.com", date: "28 Feb 2026", days: "1 days", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "lsa", title: "Loan Specific Annexures", desc: "Finalize and sign all specific loan annexures required for settlement", status: "NOT STARTED", priority: "MEDIUM", assignee: "Borrower's Lawyer", email: "borrower-lawyer@example.com", date: "02 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" }
                ]
            },
            {
                id: "inspec",
                title: "Property Inspection",
                icon: <AlertTriangle size={18} className="text-amber-600" />,
                bg: "bg-amber-50/50",
                completed: 0,
                total: 2,
                progress: 0,
                tasks: [
                    { id: "fvc", title: "Final Valuer Confirmation", desc: "Final site visit to confirm property state hasn't materially changed", status: "NOT STARTED", priority: "HIGH", assignee: "Valuer", email: "valuer@example.com", date: "01 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "pic", title: "Pre-Settlement Inspection", desc: "Investor representative inspection for final walkthrough", status: "NOT STARTED", priority: "MEDIUM", assignee: "Asset Manager", email: "asset@example.com", date: "03 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" }
                ]
            },
            {
                id: "compliance",
                title: "Compliance & Regulatory",
                icon: <Shield size={18} className="text-rose-600" />,
                bg: "bg-rose-50/50",
                completed: 0,
                total: 2,
                progress: 0,
                tasks: [
                    { id: "aml", title: "AML/CTF Final Clearance", desc: "Complete final anti-money laundering and counter-terrorism financing checks", status: "NOT STARTED", priority: "CRITICAL", assignee: "Compliance Officer", email: "compliance@example.com", date: "02 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "firc", title: "FIRB Approval Verification", desc: "Verify Foreign Investment Review Board approval (if applicable)", status: "NOT STARTED", priority: "HIGH", assignee: "Conveyancer", email: "conveyancer@example.com", date: "01 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" }
                ]
            },
            {
                id: "comm",
                title: "Party Communication",
                icon: <MessageSquare size={18} className="text-indigo-600" />,
                bg: "bg-indigo-50/50",
                completed: 1,
                total: 2,
                progress: 50,
                tasks: [
                    { id: "noc", title: "Notice of Completion Calculation", desc: "Notify all parties of finalized settlement figures", status: "COMPLETED", priority: "MEDIUM", assignee: "Financial Agent", email: "agent@example.com", date: "25 Feb 2026", days: "-1 days", completed: true, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" },
                    { id: "psm", title: "Post-Settlement Management Handover", desc: "Formal handover to property management team", status: "NOT STARTED", priority: "LOW", assignee: "Asset Manager", email: "asset@example.com", date: "05 Mar 2026", completed: false, notes: [], isExpanded: false, showNoteInput: false, currentNoteText: "" }
                ]
            }
        ]
    });



    const [formData, setFormData] = useState({ ...caseData });

    const tabs = [
        { label: "Dashboard", icon: Activity },
        { label: "Full Details", icon: FileText },
        { label: "Lawyer Review", icon: Scale },
        { label: "Property", icon: Home },
        { label: "Documents", icon: FileText },
        { label: "Investment Memorandum", icon: Briefcase },
        { label: "Settlement", icon: Handshake },
        { label: "Bids", icon: DollarSign },
        { label: "Messages", icon: MessageSquare },
    ];

    const fileInputRef = useRef(null);
    const [uploadingFiles, setUploadingFiles] = useState([]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            status: "added",
            id: Math.random().toString(36).substr(2, 9)
        }));
        setUploadingFiles([...uploadingFiles, ...newFiles]);

        // Auto-add to main list after a "delay" to simulate upload completion
        setTimeout(() => {
            setCaseData(prev => ({
                ...prev,
                documents: [
                    ...prev.documents,
                    ...newFiles.map(f => ({
                        name: f.name,
                        type: "Other",
                        uploadedBy: "Investor",
                        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    }))
                ]
            }));
            // Update status to complete
            setUploadingFiles(prev => prev.map(f =>
                newFiles.some(nf => nf.id === f.id) ? { ...f, status: "complete" } : f
            ));
        }, 1500);
    };

    const removeUploadingFile = (id) => {
        setUploadingFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const equity = formData.propertyValuation - formData.outstandingDebt;
            const lvr = (formData.outstandingDebt / formData.propertyValuation) * 100;

            const updatedPayload = {
                ...formData,
                equity,
                lvr: Number(lvr.toFixed(1))
            };

            const res = await dealsService.updateDeal(id, updatedPayload);

            if (res.success) {
                setCaseData(updatedPayload);
                setIsManageModalOpen(false);
                setToast({ show: true, message: "Case details updated successfully!", type: "success" });
            } else {
                setToast({ show: true, message: res.error || "Error updating case.", type: "error" });
            }
        } catch (err) {
            setToast({ show: true, message: "An unexpected error occurred", type: "error" });
        } finally {
            setIsSaving(false);
            setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
        }
    };

    const handleGenerateDoc = async (type) => {
        setIsGeneratingDoc({ type, active: true });

        // Mock generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate random failure (10% chance)
        if (Math.random() < 0.1) {
            setIsGeneratingDoc({ type: null, active: false });
            setToast({ show: true, message: `Failed to generate ${type}. Server busy.`, type: "error" });
            setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
            return;
        }

        const newDoc = {
            id: Date.now(),
            title: type === 'IM' ? 'Investment Memorandum.pdf' : 'Marketing Flyer.pdf',
            type: 'Generated',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: 'Ready'
        };

        setGeneratedDocs(prev => [newDoc, ...prev]);
        setIsGeneratingDoc({ type: null, active: false });
        setToast({ show: true, message: `${type} generated successfully!`, type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setPropertyImages(prev => [...prev, ...newImages]);
    };

    const removePropertyImage = (id) => {
        setPropertyImages(prev => prev.filter(img => img.id !== id));
    };


    const handleToggleTaskDetails = (taskId) => {
        setCaseSettlementData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => ({
                ...cat,
                tasks: cat.tasks.map(task =>
                    task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
                )
            }))
        }));
    };

    const handleAddNote = (taskId) => {
        setCaseSettlementData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => ({
                ...cat,
                tasks: cat.tasks.map(task =>
                    task.id === taskId ? { ...task, showNoteInput: true } : task
                )
            }))
        }));
    };

    const handleSaveNote = async (taskId) => {
        const task = caseSettlementData.categories.flatMap(c => c.tasks).find(t => t.id === taskId);
        if (!task || !task.currentNoteText.trim()) return;

        try {
            const res = await dealsService.addDealNote(id, { taskId, note: task.currentNoteText });

            if (res.success) {
                setCaseSettlementData(prev => ({
                    ...prev,
                    categories: prev.categories.map(cat => ({
                        ...cat,
                        tasks: cat.tasks.map(t => {
                            if (t.id === taskId) {
                                const now = new Date();
                                const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + " " +
                                    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                                return {
                                    ...t,
                                    notes: [...t.notes, `${timeStr}: ${t.currentNoteText}`],
                                    currentNoteText: "",
                                    showNoteInput: false
                                };
                            }
                            return t;
                        })
                    }))
                }));
            }
        } catch (err) {
            console.error("Failed to add note", err);
        }
    };

    const handleCancelNote = (taskId) => {
        setCaseSettlementData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => ({
                ...cat,
                tasks: cat.tasks.map(task =>
                    task.id === taskId ? { ...task, showNoteInput: false, currentNoteText: "" } : task
                )
            }))
        }));
    };

    const handleUpdateNoteText = (taskId, text) => {
        setCaseSettlementData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => ({
                ...cat,
                tasks: cat.tasks.map(task =>
                    task.id === taskId ? { ...task, currentNoteText: text } : task
                )
            }))
        }));
    };

    const handleSetReminder = (task) => {
        setToast({
            show: true,
            message: `Reminder sent - ${task.title}`,
            type: "success"
        });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleToggleTaskStatus = async (taskId) => {
        const task = caseSettlementData.categories.flatMap(c => c.tasks).find(t => t.id === taskId);
        if (!task) return;

        const newCompleted = !task.completed;
        const newStatus = newCompleted ? "COMPLETED" : "IN PROGRESS";

        try {
            await dealsService.updateTaskStatus(id, taskId, newStatus);

            setCaseSettlementData(prev => {
                const newCategories = prev.categories.map(cat => ({
                    ...cat,
                    tasks: cat.tasks.map(t => {
                        if (t.id === taskId) {
                            return { ...t, completed: newCompleted, status: newStatus };
                        }
                        return t;
                    })
                }));

                // Recalculate summary
                let completed = 0;
                let total = 0;
                let overdue = 0;
                let inProgress = 0;

                newCategories.forEach(cat => {
                    cat.tasks.forEach(t => {
                        total++;
                        if (t.completed) completed++;
                        if (t.status === "OVERDUE") overdue++;
                        if (t.status === "IN PROGRESS") inProgress++;
                    });

                    // Update category progress
                    const catCompleted = cat.tasks.filter(t => t.completed).length;
                    cat.completed = catCompleted;
                    cat.total = cat.tasks.length;
                    cat.progress = Math.round((catCompleted / cat.tasks.length) * 100);
                });

                return {
                    ...prev,
                    summary: {
                        ...prev.summary,
                        completed,
                        total,
                        overdue,
                        inProgress
                    },
                    categories: newCategories
                };
            });
        } catch (err) {
            console.error("Failed to update task status", err);
        }
    };

    const handleSendBulkComm = () => {
        setToast({
            show: true,
            message: `Messages sent! - ${selectedRecipients.length} recipients`,
            type: "success"
        });
        setIsBulkCommModalOpen(false);
        setSelectedRecipients([]);
        setBulkMessage({ subject: "", body: "" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleGenerateTasks = () => {
        setToast({
            show: true,
            message: "AI Generated Additional Tasks",
            type: "success"
        });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleAutoAssign = () => {
        setToast({
            show: true,
            message: "AI Auto-Assigned Tasks",
            type: "success"
        });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleOptimizeTimeline = () => {
        setToast({
            show: true,
            message: "AI Optimizing Timeline...",
            type: "info"
        });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleAddChecklistItem = () => {
        const newItem = {
            id: Date.now(),
            item: newChecklistItem.item,
            responsible: newChecklistItem.responsible,
            dueDate: new Date(newChecklistItem.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: "Open",
            uploadStatus: "pending"
        };
        setSettlementOverviewData(prev => ({
            ...prev,
            checklist: [...prev.checklist, newItem]
        }));
        setIsAddChecklistItemModalOpen(false);
        setNewChecklistItem({
            item: "",
            responsible: "Borrower",
            dueDate: new Date().toISOString().split('T')[0]
        });
        setToast({ show: true, message: "Item added to checklist!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleSaveNewTask = async () => {
        if (!newTask.title) return;

        try {
            // Re-using same logic but actually adding to state
            const newTaskObj = {
                id: Date.now(),
                title: newTask.title,
                category: newTask.category,
                assignee: newTask.assignee,
                date: new Date(newTask.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                priority: newTask.priority,
                status: newTask.status || "IN PROGRESS",
                completed: (newTask.status === "COMPLETED"),
                notes: newTask.notes ? [newTask.notes] : [],
                showNoteInput: false,
                currentNoteText: ""
            };

            setCaseSettlementData(prev => ({
                ...prev,
                summary: {
                    ...prev.summary,
                    total: (prev.summary.total || 0) + 1,
                    inProgress: (prev.summary.inProgress || 0) + 1
                },
                categories: prev.categories.map(cat => {
                    if (cat.title === newTask.category) {
                        return {
                            ...cat,
                            tasks: [...cat.tasks, newTaskObj],
                            total: cat.total + 1
                        };
                    }
                    return cat;
                })
            }));

            setIsAddTaskModalOpen(false);
            setNewTask({
                title: "",
                category: "Legal Requirements",
                assignee: "Sarah Mitchell",
                date: new Date().toISOString().split('T')[0],
                priority: "Medium",
                desc: "",
                status: "NOT STARTED",
                email: "",
                notes: "",
                isAI: false,
                duration: 1
            });
            setToast({ show: true, message: "New task created successfully!", type: "success" });
        } catch (err) {
            console.error("Failed to create task", err);
        } finally {
            setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
        }
    };

    const handleSendReminder = () => {
        setToast({ show: true, message: "Reminders sent successfully!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleSendMessage = () => {
        if (!settlementMessage.trim()) return;
        const newMessage = {
            id: Date.now(),
            user: "You",
            role: "admin",
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            message: settlementMessage,
            initials: "Y",
            color: "bg-blue-900"
        };
        setSettlementOverviewData(prev => ({
            ...prev,
            thread: [...prev.thread, newMessage]
        }));
        setSettlementMessage("");
    };

    const handleSendGeneralMessage = async () => {
        if (!newMessageText.trim()) return;

        try {
            // Mock sending message
            const newMessage = {
                id: Date.now(),
                user: "David Williams",
                role: "Investor",
                time: "Just now",
                message: newMessageText,
                initials: "DW",
                avatarColor: "bg-blue-600 text-white",
                isMe: true
            };

            setCaseMessages(prev => [...prev, newMessage]);
            setNewMessageText("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleApproveOutstanding = (itemId) => {
        const item = settlementOverviewData.outstanding.find(i => i.id === itemId);
        if (!item) return;
        setSettlementOverviewData(prev => ({
            ...prev,
            outstanding: prev.outstanding.filter(i => i.id !== itemId)
        }));
        setToast({ show: true, message: `Approved: ${item.title}`, type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleViewDocumentLocal = (doc) => {
        setToast({ show: true, message: `Opening ${doc.title || doc.item}...`, type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleDownloadDocumentLocal = (doc) => {
        setToast({ show: true, message: `Downloading ${doc.title || doc.item}...`, type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleUploadDocumentLocal = (doc) => {
        setToast({ show: true, message: `Opening upload dialog for ${doc.title || doc.item}...`, type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleMarkReady = () => {
        setSettlementOverviewData(prev => ({
            ...prev,
            property: { ...prev.property, readiness: 100, status: "READY" }
        }));
        setToast({ show: true, message: "Settlement marked as READY!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleApproveAllDocs = () => {
        setSettlementOverviewData(prev => ({
            ...prev,
            documents: prev.documents.map(d => ({ ...d, status: "Approved" }))
        }));
        setToast({ show: true, message: "All settlement documents approved!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleLockSettlementLocal = () => {
        setToast({ show: true, message: "Settlement locked successfully!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleReleaseFundsLocal = () => {
        setToast({ show: true, message: "Funds released to PEXA workspace!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleExportSettlementPackLocal = () => {
        setToast({ show: true, message: "Exporting settlement pack...", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    // Simulate backend fetch
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching Investor Case Details for ID:", id);

                // Add a small artificial delay for premium feel transition
                await new Promise(resolve => setTimeout(resolve, 800));

                const [dealRes, bidRes, docRes] = await Promise.all([
                    dealsService.getDealById(id).catch(err => ({ success: false, error: err.message })),
                    auctionService.getBidHistory(id).catch(err => ({ success: false, error: err.message })),
                    auctionService.getDocuments(id).catch(err => ({ success: false, error: err.message }))
                ]);

                if (dealRes.success && dealRes.data) {
                    setCaseData(prev => ({ ...prev, ...dealRes.data }));
                    setFormData({ ...dealRes.data });
                } else if (!dealRes.success) {
                    console.warn("Deal fetch failed:", dealRes.error);
                }

                if (bidRes.success && bidRes.data) {
                    setBidHistory(bidRes.data);
                }

                if (docRes.success && docRes.data) {
                    setCaseData(prev => ({
                        ...prev,
                        documents: Array.isArray(docRes.data) ? docRes.data : prev.documents
                    }));
                }

            } catch (err) {
                console.error("Critical error in fetchDetails:", err);
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!caseData) return <ErrorState message="Case data not found" />;

    return (
        <div id="case-details-container" className="space-y-4 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto text-[#0F172A] px-6 font-sans relative">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                        toast.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' :
                            'bg-rose-50 border-rose-100 text-rose-800'
                        }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-500' :
                            toast.type === 'info' ? 'bg-blue-500' :
                                'bg-rose-500'
                            } text-white`}>
                            {toast.type === 'success' ? <Check size={14} /> :
                                toast.type === 'info' ? <Info size={14} /> :
                                    <AlertTriangle size={14} />}
                        </div>
                        <p className="text-sm font-bold tracking-tight">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col gap-0.5 pt-2">
                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                    <Link to="/investor/dashboard" id="breadcrumb-home" className="hover:text-gray-700 flex items-center gap-1.5">
                        <Home size={14} className="text-gray-400" />
                    </Link>
                    <ChevronRight size={12} className="text-gray-400" />
                    <Link to="/investor/dashboard" id="breadcrumb-dashboard" className="hover:text-gray-700">Dashboard</Link>
                    <ChevronRight size={12} className="text-gray-400" />
                    <span className="text-gray-400">Cases</span>
                    <ChevronRight size={12} className="text-gray-400" />
                    <span id="breadcrumb-case-id" className="text-gray-900 font-semibold">{caseData.id}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Case Details</h1>
                <p className="text-sm text-gray-500">Browse available deals and manage your bids</p>
            </div>

            {/* Case Main Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-1 text-[#0F172A]">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">{caseData.id}</h2>
                            <div className="flex gap-2">
                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-semibold uppercase tracking-wide">
                                    {caseData.status}
                                </span>
                                <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-semibold uppercase tracking-wide">
                                    {caseData.riskLevel}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            {caseData.address}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button id="btn-export-report" className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                            Export Report
                        </button>
                        <button
                            id="btn-manage-case"
                            onClick={() => {
                                setFormData({ ...caseData });
                                setManageModalTab("Case Details");
                                setIsManageModalOpen(true);
                            }}
                            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-all font-sans"
                        >
                            Manage Case
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100">
                    <div className="p-5">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Borrower</p>
                        <p className="font-bold text-gray-900">{caseData.borrower}</p>
                    </div>
                    <div className="p-5 border-l border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Lender</p>
                        <p className="font-bold text-gray-900">{caseData.lender}</p>
                    </div>
                    <div className="p-5 border-t lg:border-t-0 border-l lg:border-l border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Outstanding Debt</p>
                        <p className="font-bold text-gray-900">${caseData.outstandingDebt.toLocaleString()}</p>
                    </div>
                    <div className="p-5 border-t lg:border-t-0 border-l border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Property Valuation</p>
                        <p className="font-bold text-gray-900">${caseData.propertyValuation.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Tabs List */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl overflow-x-auto scrollbar-hide border border-gray-200/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        id={`tab-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setActiveTab(tab.label)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold whitespace-nowrap transition-all ${activeTab === tab.label
                            ? "bg-white text-black shadow-sm border border-gray-100"
                            : "text-black hover:bg-white/40"
                            }`}
                    >
                        <tab.icon size={15} className="text-black" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Previous Dashboard Code... */}
                    {/* Left Column - Main Stats & Graphs */}
                    <div className="lg:col-span-12 space-y-6">
                        {/* Summary Section */}
                        <div className="bg-[#1E3A8A] rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div>
                                    <h3 className="text-2xl font-black mb-2 tracking-tight">Investor Intelligence Dashboard</h3>
                                    <p className="text-blue-100 font-bold text-sm max-w-xl leading-relaxed opacity-80">
                                        Active monitoring of deal maturity and asset valuation. Current LVR is within prime investment parameters for current market cycle.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleOptimizeTimeline()}
                                    className="h-12 px-10 bg-white text-[#1E3A8A] rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center gap-2"
                                >
                                    <Sparkles size={16} /> AI Optimization
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-20" />
                        </div>

                        {/* 4 Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Case Status */}
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                                        <Activity size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">Active</span>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
                                <h4 className="text-xl font-black text-slate-900 leading-tight">{caseData.status}</h4>
                                <p className="text-[11px] text-slate-400 mt-2 font-bold italic">Updated {caseData.updatedDaysAgo}d ago</p>
                            </div>

                            {/* Property Value */}
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                                        <Home size={20} />
                                    </div>
                                    <TrendingUp size={16} className="text-emerald-500" />
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Property Value</p>
                                <h4 className="text-xl font-black text-slate-900 leading-tight">${(caseData.propertyValuation / 1000000).toFixed(2)}M</h4>
                                <p className="text-[11px] text-emerald-600 mt-2 font-bold tracking-tight">High market confidence</p>
                            </div>

                            {/* Total Bids */}
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                                        <DollarSign size={20} />
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Bids</p>
                                <h4 className="text-xl font-black text-slate-900 leading-tight">{caseData.bidsCount}</h4>
                                <p className="text-[11px] text-slate-400 mt-2 font-bold tracking-tight">High: ${caseData.highestBid / 1000}k</p>
                            </div>

                            {/* Days Active */}
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                        <Clock size={20} />
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Days Active</p>
                                <h4 className="text-xl font-black text-slate-900 leading-tight">{caseData.daysActive}</h4>
                                <p className="text-[11px] text-gray-400 mt-2 font-bold italic">Since {caseData.sinceDate}</p>
                            </div>
                        </div>

                        {/* Gauges Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Risk Assessment */}
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center relative min-h-[280px] group hover:shadow-xl transition-all duration-500">
                                <div className="w-full flex items-center gap-2 mb-8">
                                    <ShieldCheck size={18} className="text-slate-900" />
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Risk Assessment</p>
                                </div>

                                <div className="relative w-48 h-24 mb-6">
                                    <svg viewBox="0 0 100 50" className="w-full">
                                        <path
                                            d="M 10 45 A 35 35 0 0 1 90 45"
                                            fill="none"
                                            stroke="#f1f5f9"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 10 45 A 35 35 0 0 1 90 45"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray="125.6"
                                            strokeDashoffset={125.6 - (caseData.riskScore / 100) * 125.6}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                                        <span className="text-2xl font-black text-slate-900 uppercase">LOW</span>
                                    </div>
                                </div>
                                <div className="mt-auto w-full flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Score</p>
                                        <p className="text-sm font-black text-slate-900">{caseData.riskScore}/100</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                                        <p className="text-sm font-black text-emerald-600">A+</p>
                                    </div>
                                </div>
                            </div>

                            {/* Loan to Value Ratio */}
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center relative min-h-[280px] group hover:shadow-xl transition-all duration-500">
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                                        <TrendingUp size={20} />
                                    </div>
                                </div>
                                <div className="w-full mb-10">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Risk Parameter</p>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">LVR Ratio</h4>
                                </div>

                                <div className="relative w-48 h-24 mb-6">
                                    <svg viewBox="0 0 100 50" className="w-full">
                                        <defs>
                                            <linearGradient id="lvrGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#10B981" />
                                                <stop offset="60%" stopColor="#F59E0B" />
                                                <stop offset="100%" stopColor="#EF4444" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M 10 45 A 35 35 0 0 1 90 45"
                                            fill="none"
                                            stroke="#f1f5f9"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 10 45 A 35 35 0 0 1 90 45"
                                            fill="none"
                                            stroke="url(#lvrGradient)"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray="125.6"
                                            strokeDashoffset={125.6 - (caseData.lvr / 100) * 125.6}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                                        <div className="text-center">
                                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{caseData.lvr}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto w-full flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equity</p>
                                        <p className="text-sm font-black text-emerald-600">${(caseData.equity / 1000).toLocaleString()}k</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Debt</p>
                                        <p className="text-sm font-black text-slate-900">${(caseData.outstandingDebt / 1000).toLocaleString()}k</p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center relative min-h-[280px] group hover:shadow-xl transition-all duration-500">
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                        <PieChart size={20} />
                                    </div>
                                </div>
                                <div className="w-full mb-8">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Portfolio Analysis</p>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Equity Split</h4>
                                </div>

                                <div className="relative w-28 h-28 mb-4">
                                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="16"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="4"
                                        />
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="16"
                                            fill="none"
                                            stroke="#1E3A8A"
                                            strokeWidth="4"
                                            strokeDasharray={`${caseData.lvr} ${100 - caseData.lvr}`}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[10px] font-black text-slate-900">72%</span>
                                    </div>
                                </div>

                                <div className="w-full mt-auto space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-[#1E3A8A]"></div>
                                            Debt
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{caseData.lvr}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            Equity
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{(100 - caseData.lvr).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Second Row of Cards - Collection & Parties */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Document Collection */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText size={18} className="text-gray-400" />
                                    <p className="text-sm font-bold text-gray-900">Document Collection</p>
                                </div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <p className="text-sm text-gray-500 font-medium">Completion</p>
                                    <p className="text-sm font-bold text-gray-900">{caseData.documentCollection.current}/{caseData.documentCollection.total}</p>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-100 transition-all duration-500"
                                        style={{ width: `${(caseData.documentCollection.current / caseData.documentCollection.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShieldCheck size={18} className="text-gray-400" />
                                    <p className="text-sm font-bold text-gray-900">Verification Status</p>
                                </div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <p className="text-sm text-gray-500 font-medium">Completion</p>
                                    <p className="text-sm font-bold text-gray-900">{caseData.verificationStatus.current}/{caseData.verificationStatus.total}</p>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-100 transition-all duration-500"
                                        style={{ width: `${(caseData.verificationStatus.current / caseData.verificationStatus.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Parties & Representatives */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users size={18} className="text-gray-400" />
                                    <p className="text-sm font-bold text-gray-900">Parties & Representatives</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 font-medium">Total Parties</p>
                                    <p className="text-sm font-bold text-gray-900">{caseData.totalParties}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Timeline */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-6 tracking-tight">Recent Activity Timeline</h3>
                            <div className="space-y-6">
                                {caseData.recentActivity.map((activity, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1 flex flex-col items-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900 leading-none">{activity.title}</h4>
                                            <p className="text-[#64748B] text-sm mt-0.5">{activity.desc}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5 uppercase font-medium">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Full Details" && (
                <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Case Summary */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-6">Case Summary</h3>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Case Created</p>
                                    <p className="text-sm font-bold text-gray-900">{caseData.sinceDate}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Updated</p>
                                    <p className="text-sm font-bold text-gray-900">{caseData.lastUpdated}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Bids</p>
                                    <p className="text-sm font-bold text-gray-900">{caseData.bidsCount} bids received</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Highest Bid</p>
                                    <p className="text-sm font-bold text-green-600">${caseData.highestBid.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Overview & Risk Assessment */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-6">Financial Overview & Risk Assessment</h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 font-medium">Property Valuation</p>
                                    <p className="text-sm font-bold text-gray-900">${caseData.propertyValuation.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 font-medium">Outstanding Debt</p>
                                    <p className="text-sm font-bold text-red-500">${caseData.outstandingDebt.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 font-medium">LVR (Loan to Value)</p>
                                    <p className="text-sm font-bold text-gray-900">{caseData.lvr}%</p>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <p className="text-sm text-gray-500 font-medium">Equity Available</p>
                                    <p className="text-sm font-bold text-green-600">${caseData.equity.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extended Property Details */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-6">Extended Property Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Property Condition</p>
                                <p className="text-sm font-bold text-gray-900">Excellent</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Zoning</p>
                                <p className="text-sm font-bold text-gray-900">Residential</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Year Built</p>
                                <p className="text-sm font-bold text-gray-900">2018</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Ownership</p>
                                <p className="text-sm font-bold text-gray-900">Freehold</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents & Verification Status */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-6">Documents & Verification Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Identity Verification</span>
                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded">Complete</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Financial Documents</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded">In Review</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Property Titles</span>
                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded">Verified</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                <ShieldCheck className="text-blue-500 mb-2" size={32} />
                                <p className="text-sm font-bold text-gray-900">Gold Tier Verification</p>
                                <p className="text-[11px] text-gray-500 text-center mt-1">This case has satisfied all core compliance requirements for investment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Lawyer Review" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                    {/* Header Section - Premium Indigo Card */}
                    <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                        <Scale size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight">Legal Readiness Assessment</h3>
                                        <p className="text-blue-100 font-bold text-[13px] opacity-70">Case Integrity & Risk Protocol: {caseData.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-y border-white/10 py-6">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-2">Primary Asset</p>
                                        <p className="font-black text-[15px]">{caseData.title || "7 Park Lane"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-2">Risk Strategy</p>
                                        <p className="font-black text-[15px]">{caseData.riskLevel}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-2">Capital Pool</p>
                                        <p className="font-black text-[15px] text-emerald-400">${caseData.propertyValuation.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-2">Audit Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                            <p className="font-black text-[11px] uppercase tracking-widest text-amber-400">In Review</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-blue-100">Audit Completion Index</span>
                                        <span className="text-2xl font-black">
                                            {Math.round(((documentReviews.filter(d => d.reviewed).length + enforcementSteps.filter(s => s.checked).length) / (documentReviews.length + enforcementSteps.length)) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                                            style={{ width: `${((documentReviews.filter(d => d.reviewed).length + enforcementSteps.filter(s => s.checked).length) / (documentReviews.length + enforcementSteps.length)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <button className="h-14 px-8 bg-white text-[#1E3A8A] rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                                    <Download size={18} /> Export Protocol
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full translate-x-1/3 -translate-y-1/3 blur-[120px] opacity-20" />
                    </div>

                    {/* Critical Alerts Block - Premium Rose Style */}
                    <div className="bg-rose-50/50 border border-rose-100 rounded-[32px] p-8 flex items-start gap-6 relative overflow-hidden group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-600 shrink-0 border border-rose-100 transition-transform duration-500 group-hover:scale-110">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-rose-900 tracking-tight mb-2">Critical Integrity Warnings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                                    <p className="text-[13px] font-black text-rose-700 uppercase tracking-tight">
                                        {enforcementSteps.filter(s => s.required && !s.checked).length} Incomplete Statutory Steps
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                                    <p className="text-[13px] font-black text-rose-700 uppercase tracking-tight">
                                        {loanCompliance.filter(c => c.critical && !c.checked).length} High-Risk Compliance Gaps
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield size={64} className="text-rose-900" />
                        </div>
                    </div>

                    {/* NCCP Loan Determination Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield size={20} className="text-purple-500" />
                            <h3 className="text-lg font-bold text-gray-900">NCCP Loan Determination</h3>
                        </div>

                        <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl mb-6">
                            <div className="flex gap-3">
                                <div className="mt-0.5"><Info size={16} className="text-gray-500" /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-1">National Consumer Credit Protection (NCCP)</p>
                                    <p className="text-[13px] text-gray-500">applies to loans for personal, domestic, or household purposes. Determine if this loan is subject to NCCP requirements.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border border-gray-100 rounded-xl flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Is this an NCCP loan?</h4>
                                <p className="text-sm text-gray-500">NCCP applies if the loan is for personal, domestic or household purposes (not business/investment)</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setNccpStatus('yes')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border ${nccpStatus === 'yes' ? 'bg-[#1C4ED8] text-white border-[#1C4ED8] shadow-md shadow-blue-500/20' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <CheckCircle2 size={16} className={nccpStatus === 'yes' ? 'text-white' : 'text-gray-400'} />
                                    Yes - NCCP
                                </button>
                                <button
                                    onClick={() => setNccpStatus('no')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border ${nccpStatus === 'no' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <XCircle size={16} className={nccpStatus === 'no' ? 'text-red-600' : 'text-gray-400'} />
                                    No - Not NCCP
                                </button>
                            </div>
                        </div>

                        {nccpStatus === 'yes' && (
                            <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                <h4 className="font-bold text-gray-900 mb-4">NCCP Compliance Checklist</h4>
                                <div className="space-y-3">
                                    {nccpChecklist.map((item, index) => (
                                        <div key={item.id} className="p-5 border border-gray-100 rounded-xl flex items-center justify-between hover:border-gray-200 transition-colors">
                                            <div className="flex items-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={item.checked}
                                                    onChange={() => {
                                                        const newList = [...nccpChecklist];
                                                        newList[index].checked = !newList[index].checked;
                                                        setNccpChecklist(newList);
                                                    }}
                                                    className="w-5 h-5 rounded border-gray-300 text-[#1C4ED8] mt-0.5 cursor-pointer focus:ring-[#1C4ED8]"
                                                />
                                                <div>
                                                    <p className="font-semibold text-[15px] text-gray-900 bg-transparent py-0 !m-0 mb-1 leading-snug">{item.title}</p>
                                                    <span className="inline-block px-2.5 py-0.5 bg-[#EF4444] text-white text-[11px] font-bold rounded-full">Required</span>
                                                </div>
                                            </div>
                                            {item.checked && (
                                                <div className="text-emerald-500">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Document Review Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <FileCheck size={20} />
                            <h3 className="text-lg font-bold text-gray-900">Document Review (0/10)</h3>
                        </div>

                        <div className="space-y-4">
                            {documentReviews.map((doc, index) => (
                                <div key={doc.id} className="p-5 border border-gray-100 rounded-xl flex flex-col gap-4 hover:border-gray-200 transition-colors">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-start gap-3">
                                            <FileText size={20} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900 mb-2">{doc.title}</p>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={doc.reviewed}
                                                        onChange={() => {
                                                            const newDocs = [...documentReviews];
                                                            newDocs[index].reviewed = !newDocs[index].reviewed;
                                                            setDocumentReviews(newDocs);
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#1C4ED8] focus:ring-[#1C4ED8] cursor-pointer"
                                                    />
                                                    <span className="text-[13px] text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Reviewed</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                                <Eye size={14} /> View
                                            </button>
                                            <button className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all shadow-sm">
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    {doc.reviewed && (
                                        <div className="w-full pl-10 border-t border-gray-50 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex gap-2 mb-3">
                                                <button
                                                    onClick={() => {
                                                        const newDocs = [...documentReviews];
                                                        newDocs[index].status = 'compliant';
                                                        setDocumentReviews(newDocs);
                                                    }}
                                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${doc.status === 'compliant' ? 'bg-[#1C4ED8] text-white border-[#1C4ED8] shadow-md shadow-blue-500/20' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                                >
                                                    <CheckCircle2 size={14} /> Compliant
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newDocs = [...documentReviews];
                                                        newDocs[index].status = 'non-compliant';
                                                        setDocumentReviews(newDocs);
                                                    }}
                                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${doc.status === 'non-compliant' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                                >
                                                    <XCircle size={14} /> Non-Compliant
                                                </button>
                                            </div>
                                            <textarea
                                                className="w-full text-[13px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4ED8]/20 focus:border-[#1C4ED8] transition-all resize-none"
                                                rows="2"
                                                placeholder="Add review notes..."
                                                value={doc.notes}
                                                onChange={(e) => {
                                                    const newDocs = [...documentReviews];
                                                    newDocs[index].notes = e.target.value;
                                                    setDocumentReviews(newDocs);
                                                }}
                                            ></textarea>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enforcement Steps Verification Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Gavel size={20} className="text-[#E05236]" />
                            <h3 className="text-lg font-bold text-gray-900">Enforcement Steps Verification</h3>
                        </div>

                        <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl mb-6 flex items-center gap-3">
                            <Info size={16} className="text-gray-500 shrink-0" />
                            <p className="text-[13px] text-gray-600">Verify that all required enforcement steps have been completed correctly and in accordance with legislation.</p>
                        </div>

                        <div className="space-y-3">
                            {enforcementSteps.map((step, index) => (
                                <div key={step.id} className="p-5 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                checked={step.checked}
                                                onChange={() => {
                                                    const newSteps = [...enforcementSteps];
                                                    newSteps[index].checked = !newSteps[index].checked;
                                                    setEnforcementSteps(newSteps);
                                                }}
                                                className="w-5 h-5 rounded border-gray-300 text-[#1C4ED8] mt-0.5 cursor-pointer focus:ring-[#1C4ED8]"
                                            />
                                            <div>
                                                <p className="font-semibold text-[15px] text-gray-900 bg-transparent py-0 !m-0 mb-1 leading-snug">{step.title}</p>
                                                {step.required && (
                                                    <span className="inline-block px-2.5 py-0.5 bg-[#EF4444] text-white text-[11px] font-bold rounded-full">Required</span>
                                                )}
                                            </div>
                                        </div>
                                        {step.checked && (
                                            <div className="text-emerald-500">
                                                <CheckCircle2 size={20} />
                                            </div>
                                        )}
                                    </div>
                                    {step.checked && (
                                        <div className="mt-4 pl-9 pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-900 mb-1.5">Date Completed</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="mm/dd/yyyy"
                                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C4ED8]/20 focus:border-[#1C4ED8] transition-all"
                                                            value={step.date}
                                                            onChange={(e) => {
                                                                const newSteps = [...enforcementSteps];
                                                                newSteps[index].date = e.target.value;
                                                                setEnforcementSteps(newSteps);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-900 mb-1.5">Compliance Status</label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const newSteps = [...enforcementSteps];
                                                                newSteps[index].status = 'compliant';
                                                                setEnforcementSteps(newSteps);
                                                            }}
                                                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${step.status === 'compliant' ? 'bg-white text-gray-900 border-gray-200 shadow-sm' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'}`}
                                                        >
                                                            <CheckCircle2 size={14} className={step.status === 'compliant' ? 'text-gray-900' : 'text-gray-400'} /> Compliant
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newSteps = [...enforcementSteps];
                                                                newSteps[index].status = 'issues';
                                                                setEnforcementSteps(newSteps);
                                                            }}
                                                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${step.status === 'issues' ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'}`}
                                                        >
                                                            <XCircle size={14} className={step.status === 'issues' ? 'text-orange-600' : 'text-gray-400'} /> Issues
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <textarea
                                                className="w-full text-[13px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4ED8]/20 focus:border-[#1C4ED8] transition-all resize-none"
                                                rows="2"
                                                placeholder="Add verification notes..."
                                                value={step.notes}
                                                onChange={(e) => {
                                                    const newSteps = [...enforcementSteps];
                                                    newSteps[index].notes = e.target.value;
                                                    setEnforcementSteps(newSteps);
                                                }}
                                            ></textarea>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loan Compliance Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle size={20} className="text-green-500" />
                            <h3 className="text-lg font-bold text-gray-900">Loan Compliance - Buyer Protection</h3>
                        </div>

                        <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl mb-6 flex items-center gap-3">
                            <Shield size={16} className="text-gray-500 shrink-0" />
                            <p className="text-[13px] text-gray-600">Ensure the loan is fully compliant and will present no legal issues for the buyer/investor.</p>
                        </div>

                        <div className="space-y-3">
                            {loanCompliance.map((item, index) => (
                                <div key={item.id} className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${item.critical && !item.checked ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => {
                                                const newList = [...loanCompliance];
                                                newList[index].checked = !newList[index].checked;
                                                setLoanCompliance(newList);
                                            }}
                                            className="w-5 h-5 rounded border-gray-300 text-[#1C4ED8] mt-0.5 cursor-pointer focus:ring-[#1C4ED8]"
                                        />
                                        <div>
                                            <p className="font-semibold text-[14px] text-gray-900 bg-transparent py-0 !m-0 mb-1 leading-snug">{item.title}</p>
                                            {item.critical && (
                                                <span className="inline-block px-2 py-0.5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full">Critical</span>
                                            )}
                                        </div>
                                    </div>
                                    {item.checked && (
                                        <div className="text-emerald-500">
                                            <CheckCircle2 size={18} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statement of Advice Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <FileText size={20} />
                            <h3 className="text-lg font-bold text-gray-900">Statement of Advice</h3>
                        </div>

                        <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl mb-6 flex items-start gap-3">
                            <AlertCircle size={16} className="text-gray-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Required:</h4>
                                <p className="text-[13px] text-gray-600">Upload your comprehensive statement of advice documenting all findings, compliance status, and recommendations.</p>
                            </div>
                        </div>

                        <div>
                            <input
                                type="file"
                                id="soa-upload"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setSoaFile(e.target.files[0]);
                                    }
                                }}
                            />
                            {soaFile ? (
                                <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircle2 className="text-emerald-500 shrink-0" size={32} strokeWidth={2.5} />
                                        <div>
                                            <p className="text-[14px] font-bold text-emerald-500 mb-0.5">{soaFile.name}</p>
                                            <p className="text-[13px] text-gray-500 font-medium">{(soaFile.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-[13px] font-bold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                                            <Eye size={14} className="text-gray-500" /> Preview
                                        </button>
                                        <button
                                            onClick={() => setSoaFile(null)}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[13px] font-bold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                                        >
                                            <XCircle size={14} className="text-gray-500" /> Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor="soa-upload"
                                    className="border-2 border-dashed border-gray-200 bg-white hover:border-blue-400 hover:bg-gray-50/30 rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer"
                                >
                                    <Upload className="text-gray-400 mb-3" size={32} />
                                    <p className="text-[13px] font-medium text-gray-900 mb-0.5"><span className="text-blue-600 font-bold">Click to upload Statement of Advice</span> PDF, DOC, or DOCX (Max 10MB)</p>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Review Notes Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Review Notes & Recommendations</h3>
                        <textarea
                            className="w-full text-[13px] p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4ED8]/20 focus:border-[#1C4ED8] transition-all resize-none"
                            rows="4"
                            placeholder="Provide detailed review notes, findings, and recommendations..."
                            value={lawyerReviewNotes}
                            onChange={(e) => setLawyerReviewNotes(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#E85C3A]">
                            <AlertTriangle size={18} />
                            <span className="text-sm font-bold">Critical issues must be resolved</span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setToast({ show: true, message: "Case rejection initiated...", type: "error" });
                                    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold text-[#EF4444] border border-[#EF4444] hover:bg-red-50 transition-all bg-white shadow-sm"
                            >
                                <XCircle size={16} /> Reject Case
                            </button>
                            <button
                                onClick={() => {
                                    setToast({ show: true, message: "Case approved successfully!", type: "success" });
                                    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#4ADE80] hover:bg-emerald-500 transition-all shadow-sm"
                            >
                                <CheckCircle2 size={16} /> Approve Case
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {activeTab === "Property" && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
                    <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Property Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        {/* Address */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2">Address</h4>
                            <p className="text-sm font-medium text-gray-900 leading-snug">{caseData.address.split(',')[0]}</p>
                            <p className="text-sm font-medium text-gray-500 leading-snug">{caseData.address.split(',').slice(1).join(',').trim()}</p>
                        </div>

                        {/* Features */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2">Property Features</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Type</p>
                                    <p className="text-[13px] font-medium text-gray-900">{caseData.propertyType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Bedrooms</p>
                                    <p className="text-[13px] font-medium text-gray-900">{caseData.bedrooms}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Bathrooms</p>
                                    <p className="text-[13px] font-medium text-gray-900">{caseData.bathrooms}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Parking</p>
                                    <p className="text-[13px] font-medium text-gray-900">{caseData.parking}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Land Size</p>
                                    <p className="text-[13px] font-medium text-gray-900">{caseData.landSize}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Valuation */}
                    <div className="pt-5 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-4">Valuation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Valuation Amount</p>
                                <p className="text-base font-bold text-gray-900">${caseData.propertyValuation.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Valuation Date</p>
                                <p className="text-[13px] font-medium text-gray-900">{caseData.valuationDate}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Valuer</p>
                                <p className="text-[13px] font-medium text-gray-900">{caseData.valuerName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Documents" && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
                    <h3 className="text-sm font-bold text-gray-900 mb-5">Case Documents</h3>

                    <div className="mb-6">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Upload case documents</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                        />
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/30 group hover:border-blue-400 transition-all cursor-pointer"
                        >
                            <Download className="text-gray-300 group-hover:text-blue-500 mb-3 transition-colors rotate-180" size={32} />
                            <p className="text-[13px] font-medium text-gray-900 mb-0.5">Drag and drop files here, or <span className="text-blue-600">browse</span></p>
                            <p className="text-[10px] text-gray-400">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                        </div>
                    </div>

                    {/* Pending/Added Files Status */}
                    {uploadingFiles.length > 0 && (
                        <div className="space-y-2 mb-6 animate-in slide-in-from-top-2 duration-300">
                            {uploadingFiles.map(file => (
                                <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-gray-900 line-clamp-1">{file.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{file.size}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {file.status === "complete" ? (
                                            <CheckCircle2 size={18} className="text-green-500" />
                                        ) : (
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        <button
                                            onClick={() => removeUploadingFile(file.id)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <h4 className="text-[13px] font-bold text-gray-900 mb-4">Uploaded Documents</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Document Name</th>
                                        <th className="text-left py-3 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="text-left py-3 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Uploaded By</th>
                                        <th className="text-left py-3 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="text-right py-3 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {caseData.documents.map((doc, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-2 text-sm font-bold text-gray-900">{doc.name}</td>
                                            <td className="py-3 px-2 text-sm text-gray-500 font-medium">{doc.type}</td>
                                            <td className="py-3 px-2 text-sm text-gray-500 font-medium">{doc.uploadedBy}</td>
                                            <td className="py-3 px-2 text-sm text-gray-500 font-medium">{doc.date}</td>
                                            <td className="py-3 px-2 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDocumentLocal(doc.name)}
                                                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-white transition-all shadow-sm"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadDocumentLocal(doc.name)}
                                                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-white transition-all shadow-sm"
                                                    >
                                                        <Download size={14} /> Download
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
            )}

            {activeTab === "Investment Memorandum" && (
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
                    {/* Header Controls */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">Investment Memorandum</h3>
                                <p className="text-[13px] text-gray-500 font-medium">Professional marketing document for investors</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setToast({ show: true, message: "Edit mode coming soon...", type: "info" });
                                        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    <Edit3 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setToast({ show: true, message: "Preparing for print...", type: "info" });
                                        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
                                        window.print();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    <Printer size={16} /> Print
                                </button>
                                <button
                                    onClick={() => handleGenerateDoc('IM')}
                                    disabled={isGeneratingDoc.active}
                                    className="flex items-center gap-2 px-5 py-2 bg-[#1C4ED8] text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-gray-400"
                                >
                                    {isGeneratingDoc.active && isGeneratingDoc.type === 'IM' ? (
                                        <RefreshCw size={16} className="animate-spin" />
                                    ) : <Download size={16} />}
                                    {isGeneratingDoc.active && isGeneratingDoc.type === 'IM' ? 'Generating...' : 'Download PDF'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* IM Document Start */}
                    <div className="max-w-5xl mx-auto bg-white border border-gray-100 shadow-2xl overflow-hidden rounded-[2.5rem]">
                        {/* Hero Section */}
                        <div className="relative h-[440px]">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1400"
                                alt="Property"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                            <div className="absolute top-10 left-10">
                                <span className="px-3.5 py-1.5 bg-[#EF4444] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg">Investment Opportunity</span>
                            </div>
                            <div className="absolute bottom-12 left-12 right-12">
                                <h2 className="text-5xl font-black text-white mb-2 tracking-tight">{caseData.address.split(',')[0]}</h2>
                                <div className="flex items-center gap-2 text-white/90 mb-8">
                                    <MapPin size={18} className="text-blue-400" />
                                    <span className="text-[17px] font-medium tracking-wide">{caseData.address.split(',').slice(1).join(',').trim()}</span>
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-black/30 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <BedDouble size={14} className="text-white/60" />
                                            <p className="text-xl font-black text-white">{caseData.bedrooms}</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/30 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Bath size={14} className="text-white/60" />
                                            <p className="text-xl font-black text-white">{caseData.bathrooms}</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/30 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Car size={14} className="text-white/60" />
                                            <p className="text-xl font-black text-white">{caseData.parking}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Stats Bar */}
                        <div className="px-12 -mt-10 relative z-10">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex divide-x divide-gray-100 p-2">
                                <div className="flex-1 px-8 py-5">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Property Value</p>
                                    <p className="text-2xl font-black text-gray-900">${(caseData.propertyValuation / 1000)}k</p>
                                </div>
                                <div className="flex-1 px-8 py-5">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Outstanding Debt</p>
                                    <p className="text-2xl font-black text-gray-900">${(caseData.outstandingDebt / 1000)}k</p>
                                </div>
                                <div className="flex-1 px-8 py-5">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Expected Return</p>
                                    <p className="text-2xl font-black text-emerald-500">12.4%</p>
                                </div>
                            </div>
                        </div>

                        {/* Executive Summary Section */}
                        <div className="px-10 py-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-5 tracking-tight">Executive Summary</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                <div className="lg:col-span-3 space-y-4">
                                    <p className="text-gray-600 font-medium leading-[1.8] text-[15px]">
                                        This Investment Memorandum presents a secured lending opportunity backed by a premium residential property in {caseData.address.split(',').slice(1, 2).join('').trim()}. The property is currently in mortgage default, presenting an attractive acquisition opportunity for institutional and high net worth investors.
                                    </p>
                                    <p className="text-gray-600 font-medium leading-[1.8] text-[15px]">
                                        The loan is secured by first mortgage over a well-maintained apartment valued at ${(caseData.propertyValuation / 1000)}k, providing a conservative LVR of {caseData.lvr}% and significant equity buffer.
                                    </p>
                                </div>
                                <div className="lg:col-span-2 space-y-4">
                                    {[
                                        { title: "First Mortgage Security", desc: "Primary lien position", color: "green" },
                                        { title: "Independent Valuation", desc: "Current as of Jan 2026", color: "blue" },
                                        { title: "Clear Title", desc: "No secondary encumbrances", color: "purple" }
                                    ].map((item, i) => (
                                        <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 ${item.color === 'green' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' :
                                            item.color === 'blue' ? 'bg-blue-50/50 border-blue-100 text-blue-600' :
                                                'bg-purple-50/50 border-purple-100 text-purple-600'
                                            }`}>
                                            <CheckCircle2 size={20} />
                                            <div>
                                                <p className="text-[13px] font-bold text-gray-900">{item.title}</p>
                                                <p className="text-[11px] font-medium text-gray-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Investment Highlights */}
                        <div className="px-10 py-8 bg-blue-50/20">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Investment Highlights</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-2">Strong Returns</h4>
                                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-3">Target IRR of 12.4% per annum with monthly interest payments at 8.25% default rate.</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Historical recovery rate: 87.5%</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-2">Conservative LVR</h4>
                                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-3">Loan to Value Ratio of {caseData.lvr}% provides substantial equity cushion and downside protection.</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Equity buffer: ${caseData.equity.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-2">Prime Location</h4>
                                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-3">Located in {caseData.address.split(',')[1].trim()}, a highly desirable suburb with strong capital growth history.</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">5-year growth: 42% • Median: $1.15M</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-2">Default Rate Premium</h4>
                                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-3">Enhanced return at 8.25% p.a. compared to original rate of 5.75%, providing 2.50% premium.</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">89 days in default • 127 days in arrears</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Gallery */}
                        <div className="px-10 py-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Property Gallery</h3>
                            <div className="grid grid-cols-2 gap-4 pb-2">
                                <img
                                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                                    alt="Property 1"
                                    className="w-full h-[280px] object-cover rounded-2xl shadow-md"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80&w=800"
                                    alt="Property 2"
                                    className="w-full h-[280px] object-cover rounded-2xl shadow-md"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800"
                                    alt="Property 3"
                                    className="w-full h-[280px] object-cover rounded-2xl shadow-md"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800"
                                    alt="Property 4"
                                    className="w-full h-[280px] object-cover rounded-2xl shadow-md"
                                />
                            </div>
                        </div>

                        {/* Loan Details Section */}
                        <div className="px-10 py-8 border-t border-gray-50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Loan Details</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Financial Summary</h4>
                                    <div className="space-y-1">
                                        {[
                                            { label: "Original Loan Amount", value: "$1,200,000", bold: true },
                                            { label: "Outstanding Principal", value: `$${caseData.outstandingDebt.toLocaleString()}`, bold: true },
                                            { label: "Original Interest Rate", value: "5.75% p.a." },
                                            { label: "Default Rate", value: "8.25% p.a.", highlight: true },
                                            { label: "Loan to Value Ratio", value: `${caseData.lvr}%`, green: true }
                                        ].map((row, i) => (
                                            <div key={i} className={`flex justify-between items-center px-4 py-3.5 rounded-xl ${row.highlight ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50/50'}`}>
                                                <p className="text-[12px] font-medium text-gray-500">{row.label}</p>
                                                <p className={`text-[13px] font-bold ${row.highlight ? 'text-amber-600' :
                                                    row.green ? 'text-emerald-500' :
                                                        'text-gray-900'
                                                    }`}>
                                                    {row.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Default Status</h4>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 bg-red-50/70 border border-red-100 rounded-xl">
                                                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Days in Default</p>
                                                <p className="text-lg font-bold text-red-600">89 days</p>
                                            </div>
                                            <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-xl">
                                                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Days in Arrears</p>
                                                <p className="text-lg font-bold text-amber-600">127 days</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
                                                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Arrears Amount</p>
                                                <p className="text-lg font-bold text-gray-900">$24,500</p>
                                            </div>
                                            <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
                                                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Missed Payments</p>
                                                <p className="text-lg font-bold text-gray-900">4</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Details Section (Detailed) */}
                        <div className="px-10 py-8 border-t border-gray-50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Property Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Property Features</h4>
                                    <div className="space-y-2">
                                        {[
                                            { label: "Type", value: "Apartment" },
                                            { label: "Bedrooms", value: "2" },
                                            { label: "Bathrooms", value: "2" },
                                            { label: "Parking", value: "1" },
                                            { label: "Land Size", value: "0 m²" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center px-1">
                                                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Valuation</h4>
                                    <div className="space-y-2">
                                        {[
                                            { label: "Current Value", value: "$1,250,000", bold: true },
                                            { label: "Valuation Date", value: "15/01/2026" },
                                            { label: "Valuer", value: "Preston Rowe Paterson" },
                                            { label: "Method", value: "Direct Comparison" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center px-1">
                                                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Location</h4>
                                    <div className="space-y-2">
                                        {[
                                            { label: "Suburb", value: "Potts Point" },
                                            { label: "State", value: "NSW" },
                                            { label: "Postcode", value: "2011" },
                                            { label: "CBD Distance", value: "8.5 km" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center px-1">
                                                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Assessment Section Full */}
                        <div className="px-10 py-8 bg-gray-50/20 border-t border-gray-50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Risk Assessment</h3>
                            <div className="space-y-3">
                                {[
                                    { title: "Security Position", desc: "First mortgage security with no secondary encumbrances. Clear title confirmed by independent legal review.", color: "border-emerald-500", icon: <CheckCircle2 className="text-emerald-500" /> },
                                    { title: "Equity Buffer", desc: "Conservative LVR of 72.8% provides $270k equity buffer against market volatility.", color: "border-emerald-500", icon: <CheckCircle2 className="text-emerald-500" /> },
                                    { title: "Default Status", desc: "Property is 89 days in default. Recovery timeline estimated at 4-6 months including legal process.", color: "border-amber-500", icon: <AlertTriangle className="text-amber-500" /> },
                                    { title: "Market Conditions", desc: "Strong demand in Potts Point with median price growth of 42% over 5 years. High liquidity for forced sale scenarios.", color: "border-blue-500", icon: <TrendingUp className="text-blue-500" /> }
                                ].map((risk, i) => (
                                    <div key={i} className={`p-5 bg-white rounded-xl border-l-[4px] border shadow-sm ${risk.color}`}>
                                        <div className="flex gap-4">
                                            <div className="mt-0.5">{risk.icon}</div>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900 mb-1">{risk.title}</h4>
                                                <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{risk.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Due Diligence & Verification Status Full */}
                        <div className="px-10 py-8 border-t border-gray-50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Due Diligence & Verification Status</h3>

                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield size={20} className="text-blue-600" />
                                    <h4 className="text-lg font-bold text-gray-900">InfoTrack Verification Checks</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { title: "Title Search", desc: "Clean title with no adverse findings" },
                                        { title: "Identity Verification", desc: "Borrower identity verified via InfoTrack" },
                                        { title: "Encumbrance Check", desc: "No secondary mortgages or liens detected" },
                                        { title: "Zoning Check", desc: "Zoning compliant for residential use" },
                                        { title: "Environmental Check", desc: "No environmental risks identified" }
                                    ].map((check, i) => (
                                        <div key={i} className="p-3.5 bg-emerald-50/20 border border-emerald-100 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                                <div>
                                                    <p className="text-[13px] font-bold text-gray-900">{check.title}</p>
                                                    <p className="text-[11px] text-gray-500 font-medium">{check.desc}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase rounded">Completed</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileSearch size={22} className="text-purple-600" />
                                    <h4 className="text-lg font-bold text-gray-900">Additional Verification Checks</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { title: "InfoTrack Suite", desc: "All InfoTrack checks passed successfully", status: "Completed" },
                                        { title: "Automated Checks", desc: "System validation checks completed", status: "Completed" },
                                        { title: "Credit Check", desc: "Credit assessment conducted and filed", status: "Completed" },
                                        { title: "Payment Verification", desc: "Payment history verified and documented", status: "Verified" },
                                        { title: "KYC Status", desc: "Borrower KYC fully verified and current", status: "Verified" }
                                    ].map((check, i) => (
                                        <div key={i} className="p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                                <div>
                                                    <p className="text-[13px] font-bold text-gray-900">{check.title}</p>
                                                    <p className="text-[11px] text-gray-500 font-medium">{check.desc}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase rounded">{check.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Briefcase size={22} className="text-amber-600" />
                                    <h4 className="text-lg font-bold text-gray-900">Document Collection Status</h4>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <div className="lg:col-span-2 space-y-3">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText size={16} className="text-gray-400" />
                                            <h5 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Lender Documents</h5>
                                        </div>
                                        {["Loan Agreement", "Loan Variations", "Bank Statements", "Payout Letter", "Formal Approval"].map((doc, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-600">{doc}</p>
                                                <Check size={16} className="text-emerald-500" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="lg:col-span-2 space-y-3">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users size={16} className="text-gray-400" />
                                            <h5 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Borrower Documents</h5>
                                        </div>
                                        {["Borrower ID", "Proof of Income", "Financial Statements"].map((doc, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-600">{doc}</p>
                                                <Check size={16} className="text-emerald-500" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="lg:col-span-1">
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                                            <p className="text-[11px] font-bold text-gray-500 mb-3 text-center">Completion Summary</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Overall Progress</p>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                                                <div className="h-full bg-blue-600" style={{ width: '100%' }}></div>
                                            </div>
                                            <p className="text-[18px] font-black text-blue-600">100%</p>
                                            <p className="text-[11px] text-gray-400 mt-2 text-center">13 of 13 documents collected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-blue-50/50 border border-blue-200 rounded-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck size={22} className="text-blue-600" />
                                    <h4 className="text-lg font-bold text-blue-900">NCCP Compliance Status</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-500 mb-1">Subject to NCCP</p>
                                        <p className="text-lg font-black text-gray-900">Yes</p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-500 mb-1">Loan Purpose</p>
                                        <p className="text-lg font-black text-gray-900">Owner-occupied residential property purchase</p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-500 mb-1">Purpose Classification</p>
                                        <p className="text-lg font-black text-gray-900">Consumer - personal use</p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-500 mb-1">Pre-Contractual Disclosure</p>
                                        <p className="text-lg font-black text-gray-900 flex items-center gap-2"><Check size={20} className="text-emerald-500" /> Provided</p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-500 mb-1">Borrower Cooperation</p>
                                        <p className="text-lg font-black text-gray-900">cooperative</p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-500 mb-1">Possession Status</p>
                                        <p className="text-lg font-black text-gray-900">owner_occupied</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Investment Terms Full */}
                        <div className="px-10 py-8 border-t border-gray-50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Investment Terms</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-5">Key Terms</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Minimum Investment", value: "Full loan acquisition" },
                                            { label: "Interest Rate", value: "8.25% p.a. (default rate)" },
                                            { label: "Payment Frequency", value: "Monthly in arrears" },
                                            { label: "Loan Term", value: "Until resolution (est. 4-6 months)" },
                                            { label: "Security", value: "First registered mortgage" },
                                            { label: "Settlement", value: "Within 60 days" }
                                        ].map((term, i) => (
                                            <div key={i}>
                                                <p className="text-sm font-black text-gray-900 leading-snug">{term.label}: <span className="text-blue-600 font-medium">{term.value}</span></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-6">Process</h4>
                                    <div className="space-y-6">
                                        {[
                                            { step: 1, title: "Submit Expression of Interest", desc: "Review full data room and submit bid" },
                                            { step: 2, title: "Due Diligence Period", desc: "14 days for legal and valuation review" },
                                            { step: 3, title: "Legal Documentation", desc: "Execute loan assignment agreements" },
                                            { step: 4, title: "Settlement", desc: "Funds transfer and mortgage registration" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0">{item.step}</div>
                                                <div>
                                                    <h5 className="text-sm font-black text-gray-900 mb-1">{item.title}</h5>
                                                    <p className="text-[12px] text-gray-500 font-medium">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section Full */}
                        <div className="bg-[#0F172A] px-12 py-16 text-white border-t border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Contact Information</h3>
                                    <p className="text-gray-400 text-[15px] mb-6 font-medium leading-relaxed">For further information or to arrange property inspection:</p>
                                    <h4 className="text-[17px] font-bold text-white mb-4">Brickbanq Virtual MIP Platform</h4>
                                    <div className="space-y-3">
                                        <p className="text-gray-400 text-[15px] font-medium">Email: <span className="text-white">investments@brickbanq.com.au</span></p>
                                        <p className="text-gray-400 text-[15px] font-medium">Phone: <span className="text-white">1300 BRICK (1300 274 252)</span></p>
                                        <p className="text-gray-400 text-[15px] font-medium">Case Number: <span className="text-white">MIP-2026-001</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Important Disclaimer</h3>
                                    <p className="text-gray-400 text-[14px] leading-[1.8] font-medium opacity-80">
                                        This Investment Memorandum is provided for information purposes only and does not constitute an offer, invitation, or recommendation to invest. All information is provided in good faith but no warranty is given as to its accuracy or completeness. Investors should conduct their own due diligence and seek independent legal, tax, and financial advice before making any investment decision. Past performance is not indicative of future results. Investment in distressed debt involves significant risk including potential loss of capital.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10 text-center">
                                <p className="text-gray-500 text-[13px] font-medium mb-2">
                                    © 2026 Brickbanq Pty Ltd. All rights reserved. Australian Credit Licence: XXXXXX
                                </p>
                                <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest">
                                    Document prepared: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(activeTab === "Settlement" || activeTab === "Bids" || activeTab === "Messages") && (
                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    <div className="max-w-[1600px] mx-auto px-8 pt-2 pb-8">
                        {activeTab === "Settlement" && (
                            <>
                                {/* Sub-navigation */}
                                <div className="flex items-center mb-4 bg-[#F1F5F9] p-1 rounded-xl w-full border border-gray-200/50">
                                    {[
                                        { id: "AI Checklist Manager", icon: <ClipboardCheck size={15} /> },
                                        { id: "Settlement Overview", icon: <FileText size={15} /> },
                                        { id: "PEXA Settlement", icon: <Building size={15} /> }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSettlementSubTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-2.5 py-2 rounded-lg text-[13px] font-bold transition-all ${settlementSubTab === tab.id
                                                ? "bg-white text-black shadow-sm"
                                                : "text-black hover:bg-white/40"
                                                }`}
                                        >
                                            <span className="text-black">{tab.icon}</span>
                                            {tab.id}
                                        </button>
                                    ))}
                                </div>

                                {settlementSubTab === "AI Checklist Manager" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {/* Professional Stats Grid */}
                                        <div className="grid grid-cols-5 gap-6">
                                            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm relative overflow-hidden group">
                                                <div className="relative z-10">
                                                    <div className="text-[28px] font-black text-gray-900 leading-none mb-1">{caseSettlementData.summary.completed}/{caseSettlementData.summary.total}</div>
                                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tasks Completed</div>
                                                    <div className="mt-4 w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${(caseSettlementData.summary.completed / caseSettlementData.summary.total) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                                                <div className="text-[28px] font-black text-blue-600 leading-none mb-1">{caseSettlementData.summary.inProgress}</div>
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">In Progress</div>
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Clock size={16} />
                                                </div>
                                            </div>
                                            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                                                <div className="text-[28px] font-black text-rose-600 leading-none mb-1">{caseSettlementData.summary.overdue}</div>
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Overdue</div>
                                                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                                                    <AlertTriangle size={16} />
                                                </div>
                                            </div>
                                            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                                                <div className="text-[28px] font-black text-orange-500 leading-none mb-1">{caseSettlementData.summary.blocked}</div>
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Blocked</div>
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                                    <Pause size={16} />
                                                </div>
                                            </div>
                                            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Est. Completion</p>
                                                <div className="text-[18px] font-black text-gray-900 leading-tight mb-0.5">{caseSettlementData.summary.estCompletion}</div>
                                                <div className="text-[12px] font-bold text-gray-400">{caseSettlementData.summary.daysLeft} days</div>
                                            </div>
                                        </div>

                                        {/* AI Settlement Assistant Bar */}
                                        <div className="bg-[#F5F3FF] border border-purple-100 rounded-[28px] p-4 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm border border-purple-50">
                                                    <Sparkles size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-gray-900 leading-tight">AI Settlement Assistant</h4>
                                                    <p className="text-[12px] text-gray-500 font-medium">Automate task creation, assignments, and communications</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <button onClick={() => setIsAddTaskModalOpen(true)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm">
                                                    <Plus size={14} /> Add Task
                                                </button>
                                                <button onClick={handleGenerateTasks} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm">
                                                    <Sparkles size={14} /> Generate Tasks
                                                </button>
                                                <button onClick={handleAutoAssign} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm">
                                                    <Users size={14} /> Auto-Assign
                                                </button>
                                                <button onClick={handleOptimizeTimeline} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm">
                                                    <TrendingUp size={14} /> Optimize Timeline
                                                </button>
                                                <button onClick={() => setIsAIAssistantModalOpen(true)} className="px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl text-[12px] font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                                                    <Briefcase size={14} /> AI Assistant
                                                </button>
                                            </div>
                                        </div>

                                        {/* Highlight Cards */}
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="bg-[#FFF1F2] border border-rose-100 rounded-[28px] p-6 shadow-sm">
                                                <div className="flex items-center gap-3 text-rose-600 mb-2">
                                                    <AlertTriangle size={18} />
                                                    <span className="text-[14px] font-black uppercase tracking-tight">Overdue Tasks</span>
                                                </div>
                                                <p className="text-[13px] text-rose-900/60 font-bold mb-4 italic leading-tight">
                                                    {caseSettlementData.summary.overdue} {caseSettlementData.summary.overdue === 1 ? 'task' : 'tasks'} require immediate attention
                                                </p>
                                                <button onClick={() => handleSendReminder({ title: 'Overdue items' })} className="px-5 py-2.5 bg-white text-rose-600 rounded-xl text-[12px] font-bold border border-rose-100 hover:bg-rose-50 transition-all shadow-sm">
                                                    Send Reminders
                                                </button>
                                            </div>
                                            <div className="bg-[#FFF7ED] border border-orange-100 rounded-[28px] p-6 shadow-sm">
                                                <div className="flex items-center gap-3 text-orange-600 mb-2">
                                                    <AlertCircle size={18} />
                                                    <span className="text-[14px] font-black uppercase tracking-tight">Critical Tasks</span>
                                                </div>
                                                <p className="text-[13px] text-orange-900/60 font-bold mb-4 italic leading-tight">
                                                    {caseSettlementData.summary.critical || 0} critical tasks pending
                                                </p>
                                            </div>
                                            <div className="bg-[#FEFCE8] border border-yellow-100 rounded-[28px] p-6 shadow-sm">
                                                <div className="flex items-center gap-3 text-yellow-600 mb-2">
                                                    <Clock size={18} />
                                                    <span className="text-[14px] font-black uppercase tracking-tight">Due Soon</span>
                                                </div>
                                                <p className="text-[13px] text-yellow-900/60 font-bold mb-4 italic leading-tight">
                                                    {caseSettlementData.summary.dueSoon || 0} tasks due in 3 days
                                                </p>
                                            </div>
                                        </div>

                                        {/* Categories & Tasks */}
                                        <div className="space-y-3 pt-2">
                                            {caseSettlementData.categories.map((category) => (
                                                <div key={category.id} className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm">
                                                    <button
                                                        onClick={() => setExpandedCategory(expandedCategory === category.title ? null : category.title)}
                                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-all border-b border-gray-50"
                                                    >
                                                        <div className="flex items-center gap-4 text-left">
                                                            <ChevronRight size={18} className={`text-gray-400 transition-transform duration-300 ${expandedCategory === category.title ? 'rotate-90' : ''}`} />
                                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                                                {category.icon}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[15px] font-bold text-gray-900 leading-tight">{category.title}</h4>
                                                                <p className="text-[12px] text-gray-500 font-semibold mt-0.5">{category.completed}/{category.total} completed</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-blue-700 rounded-full transition-all duration-700" style={{ width: `${category.progress}%` }}></div>
                                                                </div>
                                                                <span className="text-[12px] font-bold text-gray-500">{category.progress}%</span>
                                                            </div>
                                                        </div>
                                                    </button>

                                                    {expandedCategory === category.title && (
                                                        <div className="p-5 space-y-4 bg-white">
                                                            {category.tasks.map((task) => (
                                                                <div key={task.id} className="border border-gray-100 rounded-[20px] p-5 transition-all">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex gap-4">
                                                                            <div className="pt-1">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={task.completed}
                                                                                    onChange={() => handleToggleTaskStatus(task.id)}
                                                                                    className="w-5 h-5 rounded border-gray-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                                                                                />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <h5 className={`text-[15px] font-bold ${task.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>{task.title}</h5>
                                                                                <p className="text-[13px] text-gray-400 font-semibold">{task.desc}</p>
                                                                                <div className="flex items-center gap-4 mt-2">
                                                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${task.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{task.status}</span>
                                                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${task.priority === "CRITICAL" ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-600"}`}>{task.priority}</span>
                                                                                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-bold">
                                                                                        <Users size={14} className="text-gray-400" />
                                                                                        {task.assignee}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-bold">
                                                                                        <Calendar size={14} className="text-gray-400" />
                                                                                        {task.date} ({task.days})
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <button onClick={() => handleSetReminder(task)} className="p-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-400 transition-all">
                                                                                <Bell size={18} />
                                                                            </button>
                                                                            <button onClick={() => handleToggleTaskDetails(task.id)} className="px-4 py-1.5 border border-gray-200 rounded-xl text-[12px] font-bold text-gray-900 hover:bg-gray-50 transition-all min-w-[80px]">
                                                                                {task.isExpanded ? "Hide" : "Details"}
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {task.isExpanded && (
                                                                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-in fade-in duration-300">
                                                                            <div className="space-y-1.5">
                                                                                <p className="text-[12px] font-bold text-gray-900">Assigned To:</p>
                                                                                <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                                                                                    <Mail size={14} className="text-gray-400" />
                                                                                    {task.email}
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-2">
                                                                                <p className="text-[12px] font-bold text-gray-900">Notes:</p>
                                                                                <div className="space-y-2">
                                                                                    {task.notes && task.notes.map((note, idx) => (
                                                                                        <div key={idx} className="bg-gray-50/70 py-2.5 px-4 rounded-lg text-[13px] text-gray-600 font-medium">
                                                                                            {note}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>

                                                                            {task.showNoteInput ? (
                                                                                <div className="space-y-3 pt-1">
                                                                                    <textarea
                                                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-blue-500 transition-all min-h-[100px]"
                                                                                        placeholder="Add a note..."
                                                                                        value={task.currentNoteText}
                                                                                        onChange={(e) => handleUpdateNoteText(task.id, e.target.value)}
                                                                                    ></textarea>
                                                                                    <div className="flex gap-2">
                                                                                        <button
                                                                                            onClick={() => handleSaveNote(task.id)}
                                                                                            className="px-6 py-2 bg-blue-900 text-white rounded-xl text-[12px] font-bold hover:bg-blue-800 transition-all shadow-sm"
                                                                                        >
                                                                                            Save Note
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleCancelNote(task.id)}
                                                                                            className="px-6 py-2 border border-gray-200 text-gray-900 rounded-xl text-[12px] font-bold hover:bg-gray-50 transition-all"
                                                                                        >
                                                                                            Cancel
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="pt-2">
                                                                                    <button
                                                                                        onClick={() => handleAddNote(task.id)}
                                                                                        className="px-4 py-2 border border-gray-200 rounded-xl text-[12px] font-bold text-gray-900 hover:bg-gray-50 transition-all"
                                                                                    >
                                                                                        Add Note
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {settlementSubTab === "Settlement Overview" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        {/* Settlement Property Card - Premium Indigo Style */}
                                        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-40 h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 group">
                                                        <img
                                                            src={settlementOverviewData.property.image}
                                                            alt="Property"
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="px-2 py-0.5 bg-blue-500/30 text-[10px] font-black uppercase tracking-widest rounded text-blue-100 border border-blue-400/30">
                                                                DEAL {settlementOverviewData.property.id}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-2xl font-black mb-1 tracking-tight">{settlementOverviewData.property.title}</h3>
                                                        <p className="text-blue-100/70 font-bold text-sm flex items-center gap-1.5">
                                                            <MapPin size={14} /> {settlementOverviewData.property.location}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row items-center gap-12">
                                                    <div className="text-center md:text-left">
                                                        <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-3">Settlement Readiness</p>
                                                        <div className="flex items-center gap-5">
                                                            <div className="relative w-16 h-16">
                                                                <svg className="w-16 h-16 -rotate-90">
                                                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                                                                    <circle
                                                                        cx="32"
                                                                        cy="32"
                                                                        r="28"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                        fill="transparent"
                                                                        strokeDasharray={175.9}
                                                                        strokeDashoffset={175.9 - (settlementOverviewData.property.readiness / 100) * 175.9}
                                                                        className="text-white transition-all duration-1000 ease-out"
                                                                    />
                                                                </svg>
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <span className="text-[12px] font-black">{settlementOverviewData.property.readiness}%</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-black text-lg leading-tight">Ready for Funds</p>
                                                                <p className="text-blue-200 font-bold text-[11px] opacity-70">Target: {settlementOverviewData.property.settlementDate}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={handleMarkReady}
                                                        className="h-14 px-8 bg-white text-[#1E3A8A] rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                                                    >
                                                        <Sparkles size={18} /> Push to Settlement
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full translate-x-1/3 -translate-y-1/3 blur-[120px] opacity-20" />
                                        </div>

                                        {/* Settlement Checklist Table - Premium White Card */}
                                        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500">
                                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-slate-50/30">
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Requirement Pipeline</h4>
                                                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Mandatory Pre-Settlement Checks</p>
                                                </div>
                                                <button
                                                    onClick={() => setIsAddChecklistItemModalOpen(true)}
                                                    className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-90"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-slate-50/50">
                                                            <th className="pl-8 pr-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</th>
                                                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stakeholder</th>
                                                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                                                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolution Status</th>
                                                            <th className="pl-4 pr-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {settlementOverviewData.checklist.map((item) => (
                                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group/row">
                                                                <td className="pl-8 pr-4 py-5">
                                                                    <div>
                                                                        <p className="text-[14px] font-black text-slate-900">{item.item}</p>
                                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                                            <Shield size={10} className="text-indigo-400" />
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Validated</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-5">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100 uppercase">
                                                                            {item.responsible.charAt(0)}
                                                                        </div>
                                                                        <span className="text-[12px] font-black text-slate-900">{item.responsible}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-5">
                                                                    <div className={`text-[12px] font-black flex items-center gap-2 ${item.uploadStatus === "overdue" ? "text-rose-600" : "text-slate-600"}`}>
                                                                        <Clock size={14} className="opacity-40" />
                                                                        {item.dueDate}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-5">
                                                                    <select
                                                                        defaultValue={item.status}
                                                                        className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[12px] font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none"
                                                                    >
                                                                        <option>Open</option>
                                                                        <option>Submitted</option>
                                                                        <option>Approved</option>
                                                                    </select>
                                                                </td>
                                                                <td className="pl-4 pr-8 py-5 text-right">
                                                                    <button
                                                                        onClick={() => handleViewDocumentLocal(item)}
                                                                        className="px-6 py-2 bg-slate-50 text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 shadow-sm"
                                                                    >
                                                                        View File
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Dynamic Grid: Outstanding Items & Thread */}
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
                                            {/* Outstanding Items */}
                                            <div className="lg:col-span-12 bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Strategic Bottlenecks</h4>
                                                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Items requiring immediate investor attention</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                                                        <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Active Risks</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {/* Overdue */}
                                                    <div className="bg-rose-50/30 rounded-[28px] p-6 border border-rose-100/50">
                                                        <div className="flex items-center gap-3 text-rose-600 mb-6">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                                                <AlertTriangle size={18} />
                                                            </div>
                                                            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Critical / Overdue</span>
                                                        </div>
                                                        <div className="space-y-4">
                                                            {settlementOverviewData.outstanding.filter(i => i.status === 'overdue').map(item => (
                                                                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm group hover:shadow-md transition-all">
                                                                    <h5 className="text-[13px] font-black text-slate-900 mb-2">{item.title}</h5>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.responsible}</span>
                                                                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded uppercase tracking-tighter border border-rose-100">
                                                                            {item.days}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Due Soon */}
                                                    <div className="bg-orange-50/30 rounded-[28px] p-6 border border-orange-100/50">
                                                        <div className="flex items-center gap-3 text-orange-600 mb-6">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                                                <Clock size={18} />
                                                            </div>
                                                            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Upcoming</span>
                                                        </div>
                                                        <div className="space-y-4">
                                                            {settlementOverviewData.outstanding.filter(i => i.status === 'due_soon').map(item => (
                                                                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm group hover:shadow-md transition-all">
                                                                    <h5 className="text-[13px] font-black text-slate-900 mb-2">{item.title}</h5>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.responsible}</span>
                                                                        <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black rounded uppercase tracking-tighter border border-orange-100">
                                                                            {item.days}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Awaiting Approval */}
                                                    <div className="bg-indigo-50/30 rounded-[28px] p-6 border border-indigo-100/50">
                                                        <div className="flex items-center gap-3 text-indigo-600 mb-6">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                                                <FileCheck size={18} />
                                                            </div>
                                                            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Pending Review</span>
                                                        </div>
                                                        <div className="space-y-4">
                                                            {settlementOverviewData.outstanding.filter(i => i.status === 'awaiting_approval').map(item => (
                                                                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm group hover:shadow-md transition-all">
                                                                    <h5 className="text-[13px] font-black text-slate-900 mb-4">{item.title}</h5>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.responsible}</span>
                                                                        <button
                                                                            onClick={() => handleApproveOutstanding(item.id)}
                                                                            className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-sm active:scale-95"
                                                                        >
                                                                            Validate
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Settlement Thread */}
                                            <div className="lg:col-span-12 bg-white border border-gray-100 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
                                                <div className="px-8 py-6 border-b border-gray-50 bg-slate-50/30">
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Decision Pipeline Log</h4>
                                                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Real-time audit of communications and approvals</p>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[440px] custom-scrollbar">
                                                    {/* Pinned Message */}
                                                    <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4 relative overflow-hidden">
                                                        <div className="flex items-center gap-2 text-rose-500 mb-2">
                                                            <Target size={14} className="rotate-45" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Pinned</span>
                                                        </div>
                                                        <p className="text-[13px] font-bold text-gray-800">All parties confirmed for settlement on March 15th</p>
                                                    </div>

                                                    {settlementOverviewData.thread.map((msg) => (
                                                        <div key={msg.id} className="flex gap-4 group">
                                                            <div className={`w-9 h-9 rounded-full ${msg.color} text-white flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0 uppercase`}>
                                                                {msg.initials}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-[13px] font-bold text-gray-900 font-sans">{msg.user}</span>
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">{msg.role}</span>
                                                                    <span className="text-[10px] font-medium text-gray-400 ml-auto">{msg.time}</span>
                                                                </div>
                                                                <div className="text-[13px] text-gray-600 font-medium leading-relaxed font-sans">
                                                                    {msg.message}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-4 px-6 border-t border-gray-50">
                                                    <div className="relative flex items-center gap-2.5">
                                                        <input
                                                            type="text"
                                                            value={settlementMessage}
                                                            onChange={(e) => setSettlementMessage(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                            placeholder="Type message..."
                                                            className="flex-1 bg-white border border-gray-200 rounded-xl px-5 py-2 text-[13px] outline-none focus:border-blue-500 transition-all font-sans"
                                                        />
                                                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-all">
                                                            <Paperclip size={18} />
                                                        </button>
                                                        <button
                                                            onClick={handleSendMessage}
                                                            className="bg-blue-900 text-white p-2.5 rounded-xl hover:bg-black transition-all shadow-md shadow-blue-900/20"
                                                        >
                                                            <Send size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Required Settlement Documents */}
                                        <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm">
                                            <h4 className="text-[14px] font-bold text-gray-900 mb-6 font-sans">Required Documents</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {settlementOverviewData.documents.map((doc) => (
                                                    <div key={doc.id} className="p-4 rounded-xl border border-gray-100 bg-white transition-all hover:shadow-md group">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                                <FileText size={16} />
                                                            </div>
                                                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border ${doc.status === "Uploaded" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                                doc.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                    "bg-gray-50 text-gray-400 border-gray-100"
                                                                }`}>
                                                                {doc.status}
                                                            </span>
                                                        </div>
                                                        <h5 className="text-[13px] font-bold text-gray-900 mb-1 truncate">{doc.title}</h5>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-3">By {doc.responsible}</p>

                                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                                                            {doc.status === "Pending" ? (
                                                                <button
                                                                    onClick={() => handleUploadDocumentLocal(doc)}
                                                                    className="w-full py-1.5 bg-gray-50 text-gray-600 font-bold text-[10px] rounded-lg hover:bg-blue-900 hover:text-white transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest"
                                                                >
                                                                    <Upload size={12} /> Upload
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleViewDocumentLocal(doc)}
                                                                        className="flex-1 py-1.5 bg-gray-50 text-gray-600 font-bold text-[10px] rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest"
                                                                    >
                                                                        <Eye size={12} /> View
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDownloadDocumentLocal(doc)}
                                                                        className="flex-1 py-1.5 bg-gray-50 text-gray-600 font-bold text-[10px] rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest"
                                                                    >
                                                                        <Download size={12} /> Get
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Settlement Timeline */}
                                        <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm">
                                            <div className="flex items-center justify-between mb-8">
                                                <h4 className="text-[14px] font-bold text-gray-900 font-sans">Settlement Timeline</h4>
                                            </div>
                                            <div className="relative flex items-center justify-between px-10">
                                                <div className="absolute left-20 right-20 h-[1.5px] bg-gray-100 top-5 -z-10"></div>
                                                {settlementOverviewData.timeline.map((step) => (
                                                    <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-4 border-white shadow-sm ring-1 ${step.status === 'completed' ? 'bg-[#00C853] text-white ring-emerald-50' : 'bg-[#FFB300] text-white ring-amber-50'}`}>
                                                            {step.status === 'completed' ? <Check size={18} strokeWidth={3} /> : <Clock size={16} strokeWidth={3} />}
                                                        </div>
                                                        <div className="mt-4 text-center">
                                                            <p className="text-[12px] font-extrabold text-gray-900 leading-tight">{step.label}</p>
                                                            <p className="text-[11px] text-gray-400 font-semibold mt-1 uppercase tracking-tight">{step.date}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Settlement Controls (Admin Only) */}
                                        <div className="bg-[#EEF2FF] border border-blue-100 rounded-[12px] p-6">
                                            <div className="flex items-center gap-2.5 text-[#4338CA] mb-6 font-sans">
                                                <Lock size={16} />
                                                <span className="text-[14px] font-bold">Settlement Controls (Admin Only)</span>
                                            </div>
                                            <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                                                <button
                                                    onClick={handleApproveAllDocs}
                                                    className="flex-1 py-2.5 bg-white border border-gray-100 text-gray-900 font-bold text-[11px] rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm min-w-[180px]"
                                                >
                                                    <CheckCircle2 size={16} className="text-gray-500" /> Approve All Documents
                                                </button>
                                                <button
                                                    onClick={handleLockSettlementLocal}
                                                    className="flex-1 py-2.5 bg-white border border-gray-100 text-gray-900 font-bold text-[11px] rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm min-w-[160px]"
                                                >
                                                    <Lock size={16} className="text-gray-500" /> Lock Settlement
                                                </button>
                                                <button
                                                    onClick={handleReleaseFundsLocal}
                                                    className="flex-2 py-2.5 bg-[#00B050] text-white font-bold text-[12px] rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm min-w-[200px]"
                                                >
                                                    <DollarSign size={16} /> Release Funds
                                                </button>
                                                <button
                                                    onClick={handleExportSettlementPackLocal}
                                                    className="flex-1 py-2.5 bg-white border border-gray-100 text-gray-900 font-bold text-[11px] rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm min-w-[180px]"
                                                >
                                                    <Download size={16} className="text-gray-500" /> Export Settlement Pack
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                                }

                                {settlementSubTab === "PEXA Settlement" && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {/* Informational Blue & Purple Cards - Most Compact */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                            <div className="bg-[#EFF6FF] border border-blue-100 rounded-[14px] p-3 flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0">
                                                    <Info size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-blue-900 leading-tight">Construction: PEXA Live Integration</h4>
                                                    <p className="text-[11px] text-blue-700 font-semibold">Automatic workspace creation and live document sync.</p>
                                                </div>
                                            </div>
                                            <div className="bg-[#FAF5FF] border border-purple-100 rounded-[14px] p-3 flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-purple-100/50 flex items-center justify-center text-purple-600 shrink-0">
                                                    <Info size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-purple-900 leading-tight">Construction: Lodgement Automation</h4>
                                                    <p className="text-[11px] text-purple-700 font-semibold">Automated verification with state Land Registry.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main PEXA Integration Card - Most Compact */}
                                        <div className="bg-white border border-gray-100 rounded-[16px] p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Building size={16} className="text-blue-600" />
                                                <h3 className="text-[13px] font-bold text-gray-900">PEXA Integration</h3>
                                            </div>
                                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                                <div className="w-10 h-10 rounded-[14px] bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                                                    <Building size={20} />
                                                </div>
                                                <h4 className="text-[16px] font-bold text-gray-900 mb-0.5">Connect to PEXA</h4>
                                                <p className="text-[11px] text-gray-500 font-medium mb-4">Manage digital property settlement via PEXA workspace</p>
                                                <button
                                                    onClick={() => {
                                                        setToast({ show: true, message: "Creating PEXA Workspace...", type: "info" });
                                                        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
                                                    }}
                                                    className="px-6 py-2 bg-[#1E3A8A] text-white rounded-[8px] text-[11px] font-bold hover:bg-black transition-all shadow-md active:scale-95"
                                                >
                                                    Create PEXA Workspace
                                                </button>
                                            </div>
                                        </div>

                                        {/* Integration Note Standalone - Micro Gap */}
                                        <div className="bg-white border border-gray-100 rounded-[10px] p-3 flex items-center gap-3 shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                                <Info size={12} />
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-bold">Note: <span className="text-gray-400 font-medium ml-1">Configure PEXA API in system settings.</span></p>
                                        </div>

                                        {/* Roadmap: What's Being Built - Exact Match to Design Image */}
                                        <div className="pt-3">
                                            <h3 className="text-[18px] font-bold text-gray-900 ml-1 mb-6">What's Being Built</h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {[
                                                    { icon: <CheckCircle2 size={18} className="text-[#00C853]" />, title: "Automatic Workspace Creation", desc: "One-click workspace creation from case data with auto-populated property details, parties, and financial information." },
                                                    { icon: <Clock size={18} className="text-[#FFA000]" />, title: "Real-time Settlement Tracking", desc: "Live updates via webhooks showing document status, party actions, lodgement progress, and settlement milestones." },
                                                    { icon: <FileText size={18} className="text-blue-500" />, title: "Smart Document Management", desc: "AI-powered document classification, OCR extraction, automated verification against PEXA requirements, and electronic lodgement." },
                                                    { icon: <DollarSign size={18} className="text-emerald-500" />, title: "Automated Financial Settlements", desc: "Automatic calculation of adjustments, stamp duty, fees, and settlement amounts with real-time validation." },
                                                    { icon: <Users size={18} className="text-indigo-500" />, title: "Multi-party Collaboration", desc: "Automated invitations, role allocation, identity verification, and real-time collaboration for all settlement parties." },
                                                    { icon: <Building size={18} className="text-rose-500" />, title: "Land Registry Integration", desc: "Direct integration with state Land Registry Services for title searches, document lodgement, and registration tracking." }
                                                ].map((item, i) => (
                                                    <div key={i} className="bg-white border border-gray-50 rounded-[14px] p-4 flex items-center gap-6 transition-all hover:bg-gray-50/10">
                                                        <div className="shrink-0">{item.icon}</div>
                                                        <div>
                                                            <h4 className="text-[16px] font-bold text-[#1e293b] m-0 leading-tight">{item.title}</h4>
                                                            <p className="text-[13px] text-[#64748b] font-medium leading-normal mt-1">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "Bids" && (
                            <BidsTab bidHistory={bidHistory} />
                        )}

                        {activeTab === "Messages" && (
                            <MessagesTab
                                caseMessages={caseMessages}
                                newMessageText={newMessageText}
                                setNewMessageText={setNewMessageText}
                                handleSendGeneralMessage={handleSendGeneralMessage}
                            />
                        )}

                    </div >
                </div >
            )}

            {/* Manage Case Modal */}
            {
                isManageModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div id="manage-case-modal" className="bg-white w-full max-w-[1000px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500 border border-gray-100">
                            {/* Modal Header */}
                            <div className="p-8 pb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-[20px] font-black text-gray-900">Manage Case: {caseData.id}</h2>
                                    <p className="text-[13px] text-gray-500 font-medium mt-1">Update details, upload images, and generate AI content</p>
                                </div>
                                <button id="modal-close" onClick={() => setIsManageModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Modal Tabs - Capsule Style */}
                            <div className="flex gap-2.5 px-8 pb-6 border-b border-gray-100">
                                {[
                                    { id: "Case Details", icon: FileText },
                                    { id: "Property Images", icon: ImageIcon },
                                    { id: "AI Content", icon: Sparkles },
                                    { id: "Documents", icon: Download }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setManageModalTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${manageModalTab === tab.id
                                            ? "bg-[#1e40af] text-white border-[#1e40af]"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <tab.icon size={16} className={manageModalTab === tab.id ? "text-white" : "text-gray-900"} />
                                        {tab.id}
                                    </button>
                                ))}
                            </div>

                            {/* Modal Content Container */}
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                {manageModalTab === "Case Details" && (
                                    <div className="space-y-10 animate-in fade-in duration-300">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-[16px] font-black text-gray-900">Basic Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Case Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.id}
                                                        readOnly
                                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium text-gray-400 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Borrower Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.borrower}
                                                        onChange={(e) => setFormData({ ...formData, borrower: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Lender Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.lender}
                                                        onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Loan Details */}
                                        <div className="space-y-4">
                                            <h3 className="text-[16px] font-black text-gray-900">Loan Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Outstanding Debt</label>
                                                    <input
                                                        type="number"
                                                        value={formData.outstandingDebt}
                                                        onChange={(e) => setFormData({ ...formData, outstandingDebt: Number(e.target.value) })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Interest Rate (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.interestRate}
                                                        onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Default Rate (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.defaultRate}
                                                        onChange={(e) => setFormData({ ...formData, defaultRate: Number(e.target.value) })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Days in Default</label>
                                                    <input
                                                        type="number"
                                                        value={formData.daysInDefault}
                                                        onChange={(e) => setFormData({ ...formData, daysInDefault: Number(e.target.value) })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Details */}
                                        <div className="space-y-4">
                                            <h3 className="text-[16px] font-black text-gray-900">Property Details</h3>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Address</label>
                                                    <input
                                                        type="text"
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[12px] font-black text-gray-900">Suburb</label>
                                                        <input
                                                            type="text"
                                                            value={formData.suburb}
                                                            onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[12px] font-black text-gray-900">Postcode</label>
                                                        <input
                                                            type="text"
                                                            value={formData.postcode}
                                                            onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[12px] font-black text-gray-900">Bedrooms</label>
                                                        <input
                                                            type="number"
                                                            value={formData.bedrooms}
                                                            onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[12px] font-black text-gray-900">Bathrooms</label>
                                                        <input
                                                            type="number"
                                                            value={formData.bathrooms}
                                                            onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Valuation */}
                                        <div className="space-y-4">
                                            <h3 className="text-[16px] font-black text-gray-900">Valuation</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Valuation Amount</label>
                                                    <input
                                                        type="number"
                                                        value={formData.propertyValuation}
                                                        onChange={(e) => setFormData({ ...formData, propertyValuation: Number(e.target.value) })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Valuation Date</label>
                                                    <input
                                                        type="text"
                                                        value={formData.valuationDate}
                                                        onChange={(e) => setFormData({ ...formData, valuationDate: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[12px] font-black text-gray-900">Valuer Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.valuerName}
                                                        onChange={(e) => setFormData({ ...formData, valuerName: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {manageModalTab === "Property Images" && (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[18px] font-black text-gray-900">Property Images</h3>
                                            <div className="flex gap-3">
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all">
                                                    <Sparkles size={16} />
                                                    AI Suggest Images
                                                </button>
                                                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all cursor-pointer">
                                                    <Plus size={16} />
                                                    Upload Images
                                                    <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                                                </label>
                                            </div>
                                        </div>

                                        {propertyImages.length === 0 ? (
                                            <div className="aspect-[3/1.1] w-full border-2 border-dashed border-gray-100 rounded-[20px] flex flex-col items-center justify-center bg-white shadow-sm">
                                                <div className="w-16 h-16 flex items-center justify-center text-gray-400 mb-4 opacity-70">
                                                    <ImageIcon size={50} strokeWidth={1.5} />
                                                </div>
                                                <p className="text-gray-900 font-bold text-[15px] mb-1">No images uploaded yet</p>
                                                <p className="text-gray-400 text-[13px] font-medium">Upload property images or use AI to suggest relevant images</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                {propertyImages.map((img) => (
                                                    <div key={img.id} className="group relative aspect-[4/3] rounded-[20px] overflow-hidden border border-gray-100 transition-all">
                                                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => removePropertyImage(img.id)}
                                                            className="absolute top-2 right-2 p-1.5 bg-white text-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {manageModalTab === "AI Content" && (
                                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
                                        <div className="w-20 h-20 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                                            <Sparkles size={32} />
                                        </div>
                                        <h3 className="text-[20px] font-black text-gray-900 mb-2">AI Content Studio</h3>
                                        <p className="text-gray-500 font-medium text-[14px] text-center max-w-sm leading-relaxed">
                                            Coming soon: Generate professional case descriptions, social media, and marketing copy.
                                        </p>
                                    </div>
                                )}

                                {manageModalTab === "Documents" && (
                                    <div className="space-y-10 animate-in fade-in duration-300">
                                        <div className="p-6 bg-[#f0f9ff] border border-[#bae6fd] rounded-[16px] flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#1e40af] shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-[15px] font-black text-gray-900">Document Generator</h3>
                                                <p className="text-[13px] text-gray-500 font-medium">Generate professional documents using case data</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-8 bg-white border border-gray-100 rounded-[20px] shadow-sm flex flex-col items-center text-center">
                                                <div className="w-12 h-12 rounded-xl bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed] mb-4">
                                                    <FileText size={24} />
                                                </div>
                                                <h4 className="text-[16px] font-black text-gray-900 mb-1">Investment Memorandum</h4>
                                                <p className="text-[13px] text-gray-400 font-medium mb-6">Full professional IM</p>
                                                <button
                                                    onClick={() => handleGenerateDoc('IM')}
                                                    disabled={isGeneratingDoc.active}
                                                    className="w-full py-2.5 bg-[#1e40af] text-white rounded-xl text-[13px] font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
                                                >
                                                    {isGeneratingDoc.active && isGeneratingDoc.type === 'IM' ? (
                                                        <RefreshCw size={16} className="animate-spin" />
                                                    ) : <Download size={16} className="rotate-180" />}
                                                    {isGeneratingDoc.active && isGeneratingDoc.type === 'IM' ? 'Generating...' : 'Generate IM'}
                                                </button>
                                            </div>

                                            <div className="p-8 bg-white border border-gray-100 rounded-[20px] shadow-sm flex flex-col items-center text-center">
                                                <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] mb-4">
                                                    <ImageIcon size={24} />
                                                </div>
                                                <h4 className="text-[16px] font-black text-gray-900 mb-1">Marketing Flyer</h4>
                                                <p className="text-[13px] text-gray-400 font-medium mb-6">Single-page summary</p>
                                                <button
                                                    onClick={() => handleGenerateDoc('Flyer')}
                                                    disabled={isGeneratingDoc.active}
                                                    className="w-full py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {isGeneratingDoc.active && isGeneratingDoc.type === 'Flyer' ? (
                                                        <RefreshCw size={16} className="animate-spin" />
                                                    ) : <Download size={16} className="rotate-180" />}
                                                    {isGeneratingDoc.active && isGeneratingDoc.type === 'Flyer' ? 'Generating...' : 'Generate Flyer'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-8 py-6 border-t border-gray-100 flex justify-between items-center bg-white sticky bottom-0">
                                <button
                                    id="btn-modal-discard"
                                    onClick={() => setIsManageModalOpen(false)}
                                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    id="btn-modal-save"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-10 py-2.5 bg-[#1e40af] text-white rounded-xl text-[13px] font-bold hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:bg-gray-400"
                                >
                                    {isSaving ? <RefreshCw size={16} className="animate-spin" /> : null}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )

            }
            {/* Add Task Modal */}
            {isAddTaskModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Add New Task</h3>
                                <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-widest mt-1">Checklist Specification</p>
                            </div>
                            <button onClick={() => setIsAddTaskModalOpen(false)} className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Task Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter professional task title..."
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-[20px] text-[14px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Process Category</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-[20px] text-[14px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                    >
                                        {caseSettlementData.categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Execution Priority</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-[20px] text-[14px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="CRITICAL">CRITICAL</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Assignee</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-[20px] text-[14px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                                        value={newTask.assignee}
                                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                                    >
                                        <option value="Sarah Mitchell">Sarah Mitchell</option>
                                        <option value="Conveyancer">Conveyancer</option>
                                        <option value="Lender's Lawyer">Lender's Lawyer</option>
                                        <option value="Financial Agent">Financial Agent</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-[20px] text-[14px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                                        value={newTask.date}
                                        onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Brief Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter contextual details for this task..."
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-[20px] text-[14px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm resize-none"
                                    value={newTask.desc}
                                    onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    onClick={() => setIsAddTaskModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-[20px] text-[15px] font-bold hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveNewTask}
                                    className="flex-[2] py-4 bg-blue-900 text-white rounded-[20px] text-[15px] font-bold hover:bg-black transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} /> Create New Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Bulk Communication Modal */}
            {
                isBulkCommModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
                        <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300">
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Bulk Communication</h3>
                                </div>
                                <button
                                    onClick={() => setIsBulkCommModalOpen(false)}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                {/* AI Templates Section */}
                                <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 text-indigo-700 mb-4">
                                        <Sparkles size={18} />
                                        <span className="text-[15px] font-bold">AI Message Templates</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Generate Reminder",
                                            "Generate Update",
                                            "Generate Urgent Alert"
                                        ].map((template) => (
                                            <button
                                                key={template}
                                                onClick={() => setBulkMessage({
                                                    subject: `Action Required: ${template.replace("Generate ", "")}`,
                                                    body: `Hi team, this is an automated ${template.toLowerCase().replace("generate ", "")} regarding the pending settlement tasks...`
                                                })}
                                                className="px-4 py-2 bg-white border border-indigo-100 rounded-xl text-[13px] font-bold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm"
                                            >
                                                {template}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recipients Grid */}
                                <div>
                                    <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">Select Recipients</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { name: "Lender's Lawyer", email: "lawyer@example.com" },
                                            { name: "Borrower's Lawyer", email: "borrower-lawyer@example.com" },
                                            { name: "Conveyancer", email: "conveyancer@example.com" },
                                            { name: "Lender", email: "lender@example.com" },
                                            { name: "Accountant", email: "accountant@example.com" },
                                            { name: "Financial Settlement Agent", email: "settlement@brickbanq.com" },
                                            { name: "Existing Lender", email: "lender@example.com" },
                                            { name: "Building Inspector", email: "inspector@example.com" },
                                            { name: "Insurance Broker", email: "insurance@example.com" },
                                            { name: "Strata Manager", email: "strata@example.com" },
                                            { name: "Real Estate Agent", email: "agent@example.com" },
                                            { name: "Compliance Officer", email: "compliance@brickbanq.com" },
                                            { name: "Settlement Coordinator", email: "coordinator@brickbanq.com" }
                                        ].map((contact) => (
                                            <label
                                                key={contact.email + contact.name}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${selectedRecipients.includes(contact.email)
                                                    ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500"
                                                    : "border-gray-100 bg-white hover:border-gray-200"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRecipients.includes(contact.email)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedRecipients([...selectedRecipients, contact.email]);
                                                        else setSelectedRecipients(selectedRecipients.filter(r => r !== contact.email));
                                                    }}
                                                    className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-[14px] font-bold text-gray-900">{contact.name}</p>
                                                    <p className="text-[12px] text-gray-500 font-medium">{contact.email}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Message Inputs */}
                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-gray-900">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="Email subject..."
                                            value={bulkMessage.subject}
                                            onChange={(e) => setBulkMessage({ ...bulkMessage, subject: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-gray-900">Message</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Type your message or use AI to generate one..."
                                            value={bulkMessage.body}
                                            onChange={(e) => setBulkMessage({ ...bulkMessage, body: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between sticky bottom-0">
                                <button
                                    onClick={() => setIsBulkCommModalOpen(false)}
                                    className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-bold text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendBulkComm}
                                    disabled={selectedRecipients.length === 0}
                                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-lg ${selectedRecipients.length > 0
                                        ? "bg-blue-900 text-white hover:bg-black shadow-blue-900/10"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                        }`}
                                >
                                    <Send size={16} /> Send to {selectedRecipients.length} {selectedRecipients.length === 1 ? 'Recipient' : 'Recipients'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* AI Assistant Analysis Modal */}
            {
                isAIAssistantModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
                        <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Sparkles size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">AI Settlement Assistant</h3>
                                </div>
                                <button
                                    onClick={() => setIsAIAssistantModalOpen(false)}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="bg-indigo-50/50 rounded-2xl p-6 mb-8 border border-indigo-100/50">
                                    <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                                        AI-powered analysis of your settlement progress, identifying bottlenecks, suggesting optimizations, and automating communications.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsAIAssistantModalOpen(false);
                                        setToast({ show: true, message: "Analyzing Settlement Progress...", type: "info" });
                                        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
                                    }}
                                    className="w-full py-4 bg-blue-900 text-white rounded-[20px] text-[15px] font-bold hover:bg-black transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3"
                                >
                                    <Sparkles size={18} /> Analyze Settlement Progress
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Checklist Item Modal (Settlement Overview) */}
            {isAddChecklistItemModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Create Item</h3>
                                <p className="text-[12px] text-gray-400 font-medium">Add new settlement checklist item</p>
                            </div>
                            <button onClick={() => setIsAddChecklistItemModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg transition-all text-gray-400 hover:text-gray-900">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Insurance Policy"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    value={newChecklistItem.item}
                                    onChange={(e) => setNewChecklistItem({ ...newChecklistItem, item: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Responsible</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                                        value={newChecklistItem.responsible}
                                        onChange={(e) => setNewChecklistItem({ ...newChecklistItem, responsible: e.target.value })}
                                    >
                                        <option>Lawyer</option>
                                        <option>Conveyancer</option>
                                        <option>Lender</option>
                                        <option>Borrower</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                        value={newChecklistItem.dueDate}
                                        onChange={(e) => setNewChecklistItem({ ...newChecklistItem, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddChecklistItem}
                                className="w-full py-3.5 bg-blue-900 text-white rounded-xl text-[14px] font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                            >
                                Add Checklist Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
