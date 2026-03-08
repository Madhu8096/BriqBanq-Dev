// This acts as the base client for all API requests.
// For now, it returns dummy data simulated as promises to ensure the UI is backend-ready.

import { auctionsData } from "../data/auctionsData";
import { dealsData } from "../data/dealsData";
import { contractsData } from "../data/contractsData";
import { escrowData } from "../data/escrowData";

const USE_SIMULATOR = import.meta.env.VITE_USE_SIMULATOR === "true";

const simulateBackend = async (data, methodName) => {
    // 1. Realistic Network Delay (300ms to 1500ms)
    const delay = Math.floor(Math.random() * (1500 - 300 + 1)) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // 2. Simulate Random API Failures (20%) - ONLY IN SIMULATOR
    if (Math.random() < 0.2) {
        console.error(`[API FAIL] ${methodName} after ${delay}ms`);
        return { success: false, error: "Simulated server error" };
    }

    // 3. Simulate Malformed & Partial Data (10%)
    const isMalformed = Math.random() < 0.1;
    let finalData = data;
    if (isMalformed) {
        const rand = Math.random();
        if (rand < 0.25) finalData = null;
        else if (rand < 0.5) finalData = undefined;
        else if (rand < 0.75) finalData = Array.isArray(data) ? [] : {};
        else finalData = Array.isArray(data) && data.length > 0 ? [{ id: data[0]?.id || 1 }] : { id: 1 };
        console.warn(`[API MALFORMED] ${methodName} returning malformed data.`);
    }

    console.log(`[API SUCCESS] ${methodName} in ${delay}ms`, finalData);

    // 4. Standardized API Response Format
    return {
        success: true,
        data: finalData,
        message: "OK"
    };
};

// Generic fetch wrapper for when the backend is connected
const apiFetch = async (url, options = {}) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const rawText = await res.text();
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            throw new Error(`Failed to parse backend response as JSON. Received: ${rawText.substring(0, 20)}...`);
        }

        // Assuming your future API returns { success: true, data: ..., message: "OK" }
        // If not, you map the response here to match the standard contract.
        return data;
    } catch (err) {
        console.error(`[API REAL FAIL] ${url}`, err);
        return { success: false, error: err.message };
    }
};

export const auctionService = {
    getAuctions: async () => {
        if (USE_SIMULATOR) return simulateBackend(auctionsData || [], "getAuctions");
        return apiFetch("/api/investor/auctions");
    },
    getAuctionById: async (id) => {
        if (USE_SIMULATOR) {
            const deal = dealsData.find(d => d.id === id);
            if (!deal) return simulateBackend(null, `getAuctionById(${id})`);

            // Add defensive fallbacks for complex objects to ensure UI stability
            const enrichedDeal = {
                ...deal,
                images: deal.images || [deal.image].filter(Boolean) || [],
                bidHistory: deal.bidHistory || [],
                documents: deal.documents || [],
                metrics: deal.metrics || {},
                financials: deal.financials || {},
                propertyDetails: deal.propertyDetails || {}
            };
            return simulateBackend(enrichedDeal, `getAuctionById(${id})`);
        }
        return apiFetch(`/api/investor/auctions/${id}`);
    },
    placeBid: async (id, amount) => {
        if (USE_SIMULATOR) {
            const dealIndex = dealsData.findIndex(d => d.id === id);
            if (dealIndex !== -1) {
                // Update in-memory data for session persistence
                const newBid = {
                    user: "You",
                    amount: Number(amount),
                    time: "Just now",
                    timestamp: new Date().toISOString()
                };

                dealsData[dealIndex] = {
                    ...dealsData[dealIndex],
                    currentBid: Number(amount),
                    bidHistory: [newBid, ...(dealsData[dealIndex].bidHistory || [])]
                };

                return simulateBackend({ success: true, bid: newBid }, `placeBid(${id}, ${amount})`);
            }
            return simulateBackend(null, `placeBid(${id}) - Deal not found`, false);
        }
        return apiFetch(`/api/investor/auctions/${id}/bid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
    },
    getBidHistory: async (id) => {
        if (USE_SIMULATOR) {
            const deal = dealsData.find(d => d.id === id);
            return simulateBackend(deal?.bidHistory || [], `getBidHistory(${id})`);
        }
        return apiFetch(`/api/investor/auctions/${id}/bids`);
    },
    getDocuments: async (id) => {
        if (USE_SIMULATOR) {
            const deal = dealsData.find(d => d.id === id);
            return simulateBackend(deal?.documents || [], `getDocuments(${id})`);
        }
        return apiFetch(`/api/investor/auctions/${id}/documents`);
    }
};

export const dealsService = {
    getDeals: async () => {
        if (USE_SIMULATOR) return simulateBackend(dealsData || [], "getDeals");
        return apiFetch("/api/investor/deals");
    },
    getDealById: async (id) => {
        if (USE_SIMULATOR) return simulateBackend(dealsData.find(d => d.id === id) || null, `getDealById(${id})`);
        return apiFetch(`/api/investor/deals/${id}`);
    },
    purchaseDeal: async (id) => {
        if (USE_SIMULATOR) {
            const dealIndex = dealsData.findIndex(d => d.id === id);
            if (dealIndex !== -1) {
                // Update in-memory data
                const deal = dealsData[dealIndex];
                dealsData[dealIndex] = {
                    ...deal,
                    status: "Sold",
                    currentBid: deal.buyNowPrice || deal.targetAmount
                };
                return simulateBackend({ success: true, deal: dealsData[dealIndex] }, `purchaseDeal(${id})`);
            }
            return simulateBackend(null, `purchaseDeal(${id}) - Deal not found`, false);
        }
        return apiFetch(`/api/investor/deals/${id}/purchase`, { method: 'POST' });
    },
    updateDeal: async (id, payload) => {
        if (USE_SIMULATOR) return simulateBackend({ id, data: payload }, `updateDeal(${id})`);
        return apiFetch(`/api/investor/deals/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    },
    addDealNote: async (id, noteData) => {
        if (USE_SIMULATOR) return simulateBackend({ id, note: noteData }, `addDealNote(${id})`);
        return apiFetch(`/api/investor/deals/${id}/notes`, { method: 'POST', body: JSON.stringify(noteData) });
    },
    deleteDealNote: async (id, noteId) => {
        if (USE_SIMULATOR) return simulateBackend({ id, noteId }, `deleteDealNote(${id})`);
        return apiFetch(`/api/investor/deals/${id}/notes/${noteId}`, { method: 'DELETE' });
    },
    updateTaskStatus: async (id, taskId, status) => {
        if (USE_SIMULATOR) return simulateBackend({ id, taskId, status }, `updateTaskStatus(${id})`);
        return apiFetch(`/api/investor/deals/${id}/tasks/${taskId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    }
};

export const contractService = {
    getContracts: async () => {
        if (USE_SIMULATOR) return simulateBackend(contractsData || [], "getContracts");
        return apiFetch("/api/investor/contracts");
    },
    getContractById: async (id) => {
        if (USE_SIMULATOR) return simulateBackend(contractsData.find(c => c.id === id) || null, `getContractById(${id})`);
        return apiFetch(`/api/investor/contracts/${id}`);
    },
    signContract: async (id, signatureData) => {
        if (USE_SIMULATOR) return simulateBackend({ id, status: 'Signed' }, `signContract(${id})`);
        return apiFetch(`/api/investor/contracts/${id}/sign`, { method: 'POST', body: JSON.stringify(signatureData) });
    },
    uploadContractDocument: async (id, formData) => {
        if (USE_SIMULATOR) return simulateBackend({ id, documents: [] }, `uploadContractDocument(${id})`);
        return apiFetch(`/api/investor/contracts/${id}/documents`, { method: 'POST', body: formData }); // Note: do not stringify formData
    }
};

export const escrowService = {
    getEscrowInfo: async () => {
        if (USE_SIMULATOR) return simulateBackend(escrowData || null, "getEscrowInfo");
        return apiFetch("/api/investor/escrow");
    },
    getEscrowTransactions: async () => {
        if (USE_SIMULATOR) return simulateBackend(escrowData?.transactions || [], "getEscrowTransactions");
        return apiFetch("/api/investor/escrow/transactions");
    },
    releaseFunds: async (escrowId, transactionId) => {
        if (USE_SIMULATOR) return simulateBackend({ transactionId, status: 'completed' }, `releaseFunds(${escrowId})`);
        return apiFetch(`/api/investor/escrow/${escrowId}/release/${transactionId}`, { method: 'POST' });
    },
    authorizeAllReleases: async (escrowId) => {
        if (USE_SIMULATOR) return simulateBackend({ escrowId, status: 'completed' }, `authorizeAllReleases(${escrowId})`);
        return apiFetch(`/api/investor/escrow/${escrowId}/authorize_all`, { method: 'POST' });
    }
};

export const userService = {
    getUserProfile: async () => {
        if (USE_SIMULATOR) return simulateBackend({}, "getUserProfile");
        return apiFetch("/api/user/profile");
    },
    updateUserProfile: async (payload) => {
        if (USE_SIMULATOR) return simulateBackend(payload, "updateUserProfile");
        return apiFetch("/api/user/profile", { method: 'PUT', body: JSON.stringify(payload) });
    },
    getUserSettings: async () => {
        if (USE_SIMULATOR) return simulateBackend({}, "getUserSettings");
        return apiFetch("/api/user/settings");
    },
    updateUserSettings: async (settingsType, payload) => {
        if (USE_SIMULATOR) return simulateBackend({ type: settingsType, payload }, "updateUserSettings");
        return apiFetch(`/api/user/settings/${settingsType}`, { method: 'PUT', body: JSON.stringify(payload) });
    },
    getInvestorDocuments: async () => {
        const mockDocs = [
            { name: "Proof of Funds - March 2026.pdf", type: "PDF", size: "2.4 MB", file: "#", category: "Financial" },
            { name: "Certified ID Copy.pdf", type: "PDF", size: "1.1 MB", file: "#", category: "Identification" },
            { name: "Trust Deed - Platinum Capital.pdf", type: "PDF", size: "4.5 MB", file: "#", category: "Legal" }
        ];
        if (USE_SIMULATOR) return simulateBackend(mockDocs, "getInvestorDocuments");
        return apiFetch("/api/user/documents");
    }
};

export const authService = {
    changePassword: async (payload) => {
        if (USE_SIMULATOR) return simulateBackend({ success: true }, `changePassword`);
        return apiFetch("/api/auth/change-password", { method: 'POST', body: JSON.stringify(payload) });
    },
    enable2FA: async () => {
        if (USE_SIMULATOR) return simulateBackend({ success: true, enabled: true }, "enable2FA");
        return apiFetch("/api/auth/2fa/enable", { method: 'POST' });
    },
    disable2FA: async () => {
        if (USE_SIMULATOR) return simulateBackend({ success: true, enabled: false }, "disable2FA");
        return apiFetch("/api/auth/2fa/disable", { method: 'POST' });
    },
    getActiveSessions: async () => {
        const mockSessions = [
            { id: 1, device: "MacBook Pro", location: "Melbourne, VIC", lastActive: "Just now", current: true, icon: "monitor" },
            { id: 2, device: "iPhone 14 Pro", location: "Sydney, NSW", lastActive: "2 hours ago", current: false, icon: "smartphone" },
            { id: 3, device: "Windows PC", location: "Brisbane, QLD", lastActive: "1 day ago", current: false, icon: "monitor" }
        ];
        if (USE_SIMULATOR) return simulateBackend(mockSessions, "getActiveSessions");
        return apiFetch("/api/auth/sessions");
    },
    logoutSession: async (sessionId) => {
        if (USE_SIMULATOR) return simulateBackend({ sessionId, success: true }, `logoutSession(${sessionId})`);
        return apiFetch(`/api/auth/sessions/${sessionId}`, { method: 'DELETE' });
    },
    logoutAllOtherSessions: async () => {
        if (USE_SIMULATOR) return simulateBackend({ success: true }, "logoutAllOtherSessions");
        return apiFetch("/api/auth/sessions/logout-others", { method: 'DELETE' });
    }
};

export const notificationService = {
    getNotifications: async () => {
        if (USE_SIMULATOR) return simulateBackend({ notifications: [] }, "getNotifications");
        return apiFetch("/api/user/notifications");
    },
    getPreferences: async () => {
        const currentRole = localStorage.getItem("currentRole") || "investor";
        const storageKey = `brickbanq_notification_prefs_${currentRole}`;

        const defaultPrefs = {
            email: {
                dealUpdates: true,
                auctionAlerts: true,
                contractReminders: true,
                paymentNotifications: true,
                systemUpdates: false,
                marketingEmails: false
            },
            push: {
                dealUpdates: true,
                auctionAlerts: true,
                bidActivity: true,
                messages: true,
                systemAlerts: true
            },
            sms: {
                criticalAlerts: true,
                auctionReminders: false,
                paymentAlerts: true
            }
        };

        if (USE_SIMULATOR) {
            const saved = localStorage.getItem(storageKey);
            return simulateBackend(saved ? JSON.parse(saved) : defaultPrefs, "getPreferences");
        }
        return apiFetch("/api/user/notification-preferences");
    },
    updatePreferences: async (payload) => {
        const currentRole = localStorage.getItem("currentRole") || "investor";
        const storageKey = `brickbanq_notification_prefs_${currentRole}`;

        if (USE_SIMULATOR) {
            localStorage.setItem(storageKey, JSON.stringify(payload));
            return simulateBackend(payload, "updatePreferences");
        }
        return apiFetch("/api/user/notification-preferences", { method: 'PUT', body: JSON.stringify(payload) });
    },
    markAsRead: async (id) => {
        if (USE_SIMULATOR) return simulateBackend({ id }, `markAsRead(${id})`);
        return apiFetch(`/api/user/notifications/${id}/read`, { method: 'PUT' });
    },
    markAllAsRead: async () => {
        if (USE_SIMULATOR) return simulateBackend({}, "markAllAsRead");
        return apiFetch("/api/user/notifications/read_all", { method: 'PUT' });
    },
    deleteNotification: async (id) => {
        if (USE_SIMULATOR) return simulateBackend({ id }, `deleteNotification(${id})`);
        return apiFetch(`/api/user/notifications/${id}`, { method: 'DELETE' });
    },
    deleteAllNotifications: async () => {
        if (USE_SIMULATOR) return simulateBackend({}, "deleteAllNotifications");
        return apiFetch("/api/user/notifications", { method: 'DELETE' });
    }
};

export const formService = {
    getForms: async () => {
        const mockForms = [
            { id: "case-creation", name: "Case Creation Form", description: "Main form for creating mortgage in possession cases" },
            { id: "borrower", name: "Borrower Details Form", description: "Form for collecting borrower information" },
            { id: "property", name: "Property Details Form", description: "Form for property information" },
            { id: "lender", name: "Lender Details Form", description: "Form for lender information" },
            { id: "kyc", name: "KYC Verification Form", description: "Form for Know Your Customer verification" }
        ];
        if (USE_SIMULATOR) return simulateBackend(mockForms, "getForms");
        return apiFetch("/api/forms");
    },
    getFormFields: async (formId) => {
        const initialFields = {
            "case-creation": [
                { id: 101, name: "Property Manager Name", type: "Text", required: false },
                { id: 102, name: "Insurance Policy Number", type: "Text", required: true },
                { id: 103, name: "Expected Settlement Amount", type: "Currency", required: false }
            ],
            "borrower": [
                { id: 201, name: "Employer Name", type: "Text", required: false },
                { id: 202, name: "Years at Current Address", type: "Number", required: false }
            ],
            "property": [
                { id: 301, name: "Property Management Company", type: "Text", required: false },
                { id: 302, name: "Council Rates Account", type: "Text", required: false },
                { id: 303, name: "Body Corporate Name", type: "Text", required: false }
            ],
            "lender": [
                { id: 401, name: "Internal Reference Number", type: "Text", required: false },
                { id: 402, name: "Relationship Manager", type: "Text", required: false }
            ],
            "kyc": [
                { id: 501, name: "Source of Funds", type: "Select • 6 options", required: true },
                { id: 502, name: "Purpose of Transaction", type: "Textarea", required: true }
            ]
        };
        if (USE_SIMULATOR) return simulateBackend(initialFields[formId] || [], `getFormFields(${formId})`);
        return apiFetch(`/api/forms/${formId}/fields`);
    },
    addField: async (formId, fieldData) => {
        if (USE_SIMULATOR) return simulateBackend({ ...fieldData, id: Date.now() }, `addField(${formId})`);
        return apiFetch(`/api/forms/${formId}/fields`, { method: 'POST', body: JSON.stringify(fieldData) });
    },
    updateField: async (formId, fieldId, payload) => {
        if (USE_SIMULATOR) return simulateBackend({ id: fieldId, ...payload }, `updateField(${formId}, ${fieldId})`);
        return apiFetch(`/api/forms/${formId}/fields/${fieldId}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
    deleteField: async (formId, fieldId) => {
        if (USE_SIMULATOR) return simulateBackend({ success: true }, `deleteField(${formId}, ${fieldId})`);
        return apiFetch(`/api/forms/${formId}/fields/${fieldId}`, { method: 'DELETE' });
    }
};

export const integrationService = {
    getIntegrations: async () => {
        const mockIntegrations = [
            {
                id: "infotrack",
                type: "shield",
                name: "InfoTrack",
                description: "Identity verification, KYC checks, title searches, and property verification",
                status: "Connected",
                lastTestedAt: "2/27/2026, 7:50:31 AM",
                testSuccess: true,
                fields: [
                    { label: 'API Key', value: 'sk_live_1234567890abcdef1234567890abcdef', isSecret: true },
                    { label: 'Client ID', value: 'BRICK001' },
                    { label: 'Environment', value: 'production' }
                ]
            },
            {
                id: "rpdata",
                type: "database",
                name: "RP Data / CoreLogic",
                description: "Property valuations, sales history, market insights, and property reports",
                status: "Connected",
                lastTestedAt: "2/26/2026, 9:50:31 AM",
                testSuccess: true,
                fields: [
                    { label: 'API Key', value: 'sk_live_1234567891234567890abcdef', isSecret: true },
                    { label: 'Subscriber ID', value: 'SUB12345' },
                    { label: 'API Endpoint', value: 'https://api.corelogic.asia' }
                ]
            },
            {
                id: "equifax",
                type: "file",
                name: "Equifax",
                description: "Credit checks, credit reports, and borrower financial assessment",
                status: "Connected",
                lastTestedAt: "2/26/2026, 9:50:31 PM",
                testSuccess: true,
                fields: [
                    { label: 'Username', value: 'brickbanq_api' },
                    { label: 'Password', value: 'password123', isSecret: true },
                    { label: 'Customer ID', value: 'CUST789456' }
                ]
            },
            {
                id: "austrac",
                type: "shield",
                name: "AUSTRAC Reporting",
                description: "AML/CTF compliance reporting and suspicious matter reporting",
                status: "Connected",
                lastTestedAt: "2/27/2026, 8:50:31 AM",
                testSuccess: false,
                fields: [
                    { label: 'Publishable Key', value: 'pk_test_xxxxxxxxxxxx' },
                    { label: 'Secret Key', value: 'sk_test_xxxxxxxxxxxx', isSecret: true },
                    { label: 'Webhook Secret', value: 'whsec_xxxxxxxxxxxx' }
                ]
            },
            {
                id: "stripe",
                type: "zap",
                name: "Stripe",
                description: "Payment processing for deposits, fees, and investor transactions",
                status: "Error",
                lastTestedAt: "2/27/2026, 8:50:31 AM",
                testSuccess: false,
                fields: [
                    { label: 'Publishable Key', value: 'pk_test_xxxxxxxxxxxx' },
                    { label: 'Secret Key', value: 'sk_test_xxxxxxxxxxxx', isSecret: true },
                    { label: 'Webhook Secret', value: 'whsec_...' }
                ]
            },
            {
                id: "pexa",
                type: "globe",
                name: "PEXA",
                description: "Property Exchange Australia - electronic property settlements",
                status: "Disconnected",
                fields: [
                    { label: 'Subscriber ID', value: '', placeholder: 'Enter PEXA Subscriber ID' },
                    { label: 'API Key', value: '', placeholder: 'Enter PEXA API Key', isSecret: true },
                    { label: 'Environment', value: '', placeholder: 'production or test' }
                ]
            }
        ];
        if (USE_SIMULATOR) return simulateBackend(mockIntegrations, "getIntegrations");
        return apiFetch("/api/integrations");
    },
    testIntegration: async (id) => {
        if (USE_SIMULATOR) return simulateBackend({ success: Math.random() > 0.3, timestamp: new Date().toLocaleString() }, `testIntegration(${id})`);
        return apiFetch(`/api/integrations/${id}/test`, { method: 'POST' });
    }
};

let inMemoryCases = [
    { id: "MIP-2026-001", borrower: "Sarah Mitchell", property: "45 Victoria Street", suburb: "Potts Point", state: "NSW", loanAmount: 980000, valuation: 1250000, status: "In Auction", risk: "Medium Risk", auctionEnd: "2h 14m", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000" },
    { id: "MIP-2026-002", borrower: "James Chen", property: "128 Brighton Boulevard", suburb: "North Bondi", state: "NSW", loanAmount: 2100000, valuation: 3200000, status: "Active", risk: "Low Risk", auctionEnd: "5d 12h", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000" },
    { id: "MIP-2026-003", borrower: "Emma Rodriguez", property: "7 Park Lane", suburb: "South Yarra", state: "VIC", loanAmount: 1600000, valuation: 1850000, status: "Active", risk: "Low Risk", auctionEnd: "-", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1000" },
    { id: "MIP-2026-004", borrower: "Michael Thompson", property: "92 George Street", suburb: "Brisbane CBD", state: "QLD", loanAmount: 480000, valuation: 520000, status: "Pending", risk: "High Risk", auctionEnd: "-", image: "https://images.unsplash.com/photo-1592595894519-32b5692994a4?q=80&w=1000" },
    { id: "MIP-2026-005", borrower: "Lisa Anderson", property: "156 Stirling Highway", suburb: "Nedlands", state: "WA", loanAmount: 1950000, valuation: 2800000, status: "Completed", risk: "Low Risk", auctionEnd: "-", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000" }
];

export const casesService = {
    getCases: async () => {
        if (USE_SIMULATOR) return simulateBackend(inMemoryCases, "getCases");
        return apiFetch("/api/lender/portfolio");
    },
    submitCase: async (payload) => {
        if (USE_SIMULATOR) {
            const newCase = {
                id: `MIP-2026-${String(inMemoryCases.length + 1).padStart(3, '0')}`,
                borrower: payload.borrowerName || "New Borrower",
                property: payload.propertyAddress || "New Property",
                suburb: payload.suburb || "Sydney",
                state: payload.state || "NSW",
                loanAmount: Number(payload.loanAmount) || 0,
                valuation: Number(payload.valuation) || 0,
                status: "Pending",
                risk: "Low Risk",
                auctionEnd: "-",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
            };
            inMemoryCases = [newCase, ...inMemoryCases];
            return simulateBackend({ success: true, caseId: newCase.id, newCase }, 'submitCase');
        }
        return apiFetch("/api/lender/cases", { method: 'POST', body: JSON.stringify(payload) });
    },
    updateCaseStatus: async (caseId, newStatus) => {
        if (USE_SIMULATOR) return simulateBackend({ success: true, caseId, newStatus }, 'updateCaseStatus');
        return apiFetch(`/api/lender/cases/${caseId}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
    }
};

export const communicationService = {
    getTemplates: async () => {
        const mockTemplates = [
            { id: 1, title: 'Welcome Email', desc: 'Welcome to Brickbanq!', tag: 'Onboarding', used: 247, modified: '2 days ago' },
            { id: 2, title: 'Monthly Newsletter', desc: 'Your Monthly Market Update', tag: 'Marketing', used: 1523, modified: '1 week ago' },
            { id: 3, title: 'Case Update Notification', desc: 'Update on Your Case #{case_id}', tag: 'Transactional', used: 892, modified: '3 days ago' },
            { id: 4, title: 'Payment Reminder', desc: 'Payment Due Reminder', tag: 'Billing', used: 456, modified: '5 days ago' },
            { id: 5, title: 'Document Request', desc: 'Action Required: Document Submission', tag: 'Operations', used: 678, modified: '1 day ago' }
        ];
        if (USE_SIMULATOR) return simulateBackend(mockTemplates, "getTemplates");
        return apiFetch("/api/communications/templates");
    },
    getCampaigns: async () => {
        const mockCampaigns = [
            { id: 1, title: 'Q1 2026 Investor Update', status: 'sent', recipients: 247, type: 'Monthly Newsletter', date: '2026-01-15', openRate: 78, clickRate: 34 },
            { id: 2, title: 'New Property Listings Alert', status: 'scheduled', recipients: 156, type: 'Case Update Notification', date: '2026-03-28' },
            { id: 3, title: 'Payment Reminder Batch', status: 'draft', recipients: 89, type: 'Payment Reminder' },
            { id: 4, title: 'Document Collection Drive', status: 'sending', recipients: 345, type: 'Document Request', progress: 123 }
        ];
        if (USE_SIMULATOR) return simulateBackend(mockCampaigns, "getCampaigns");
        return apiFetch("/api/communications/campaigns");
    },
    getSegments: async () => {
        const mockSegments = [
            { id: 1, title: 'Active Investors', count: 247, desc: 'Investors with active bids or purchases', criteria: 'Role: Investor, Status: Active, Last Activity: < 30 days', bg: 'bg-blue-50', color: 'text-blue-600' },
            { id: 2, title: 'High-Value Lenders', count: 34, desc: 'Lenders with 5+ cases valued over $1M', criteria: 'Role: Lender, Case Value: >$1M, Case Count: >=5', bg: 'bg-emerald-50', color: 'text-emerald-600' },
            { id: 3, title: 'Pending KYC Users', count: 89, desc: 'Users who haven\'t completed KYC verification', criteria: 'Criteria: KYC Status: Pending, Registration: <14 days', bg: 'bg-orange-50', color: 'text-orange-600' },
            { id: 4, title: 'Lawyers - Active Cases', count: 23, desc: 'Lawyers with assigned cases requiring review', criteria: 'Criteria: Role: Lawyer, Pending Reviews: >0', bg: 'bg-purple-50', color: 'text-purple-600' },
            { id: 5, title: 'Dormant Users', count: 156, desc: 'Users with no activity in 90+ days', criteria: 'Criteria: Last Activity: >90 days, Status: Active', bg: 'bg-gray-50', color: 'text-gray-400' }
        ];
        if (USE_SIMULATOR) return simulateBackend(mockSegments, "getSegments");
        return apiFetch("/api/communications/segments");
    },
    getAnalytics: async () => {
        const mockAnalytics = {
            totalSent: 3796,
            avgOpenRate: 78,
            avgClickRate: 34,
            chartData: [
                { name: 'Mon', sent: 400, opened: 240 },
                { name: 'Tue', sent: 300, opened: 139 },
                { name: 'Wed', sent: 200, opened: 980 },
                { name: 'Thu', sent: 278, opened: 390 },
                { name: 'Fri', sent: 189, opened: 480 },
                { name: 'Sat', sent: 239, opened: 380 },
                { name: 'Sun', sent: 349, opened: 430 }
            ],
            topTemplates: [
                { name: 'Monthly Newsletter', performance: 85 },
                { name: 'Welcome Email', performance: 92 },
                { name: 'Payment Reminder', performance: 64 }
            ]
        };
        if (USE_SIMULATOR) return simulateBackend(mockAnalytics, "getAnalytics");
        return apiFetch("/api/communications/analytics");
    }
};

let inMemoryActivities = [
    { id: 1, title: "New bid placed on MIP-2026-003", time: "2 hours ago", type: "bid", details: "A$1.65M from Investment Corp" },
    { id: 2, title: "Case MIP-2026-001 moved to auction", time: "5 hours ago", type: "status", details: "Compliance check passed" },
    { id: 3, title: "Settlement completed: $2.4M recovered", time: "1 day ago", type: "completion", details: "Funds disbursed to escrow" },
    { id: 4, title: "Compliance review required for 2 cases", time: "1 day ago", type: "alert", details: "Action required in Evidence Ledger" },
    { id: 5, title: "New valuation report available", time: "2 days ago", type: "file", details: "RP Data / CoreLogic update" }
];

export const activityService = {
    getRecentActivity: async () => {
        if (USE_SIMULATOR) return simulateBackend([...inMemoryActivities], "getRecentActivity");
        return apiFetch("/api/lender/activity");
    },
    logActivity: async (activity) => {
        const newActivity = {
            id: Date.now(),
            time: "Just now",
            ...activity
        };
        if (USE_SIMULATOR) {
            inMemoryActivities = [newActivity, ...inMemoryActivities];
            // Dispatch event for components to refresh
            window.dispatchEvent(new CustomEvent('new-activity', { detail: newActivity }));
            return simulateBackend(newActivity, "logActivity");
        }
        return apiFetch("/api/lender/activity", { method: 'POST', body: JSON.stringify(activity) });
    }
};
