import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const WS_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

export const createWebSocket = (path) => new WebSocket(`${WS_URL}${path}`)

export const getBorrowerCase = (caseId) => api.get(`/api/borrower/cases/${caseId}`)
export const getBorrowerCaseTimeline = (caseId) => api.get(`/api/borrower/cases/${caseId}/timeline`)
export const getBorrowerDocuments = (caseId) => api.get(`/api/borrower/cases/${caseId}/documents`)
export const uploadBorrowerDocument = (caseId, formData) =>
  api.post(`/api/borrower/cases/${caseId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const submitKYC = (formData) =>
  api.post('/api/borrower/kyc', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getKYCStatus = () => api.get('/api/borrower/kyc/status')

export const getBorrowerContracts = () => api.get('/api/borrower/contracts')
export const createBorrowerContract = (data) => api.post('/api/borrower/contracts', data)

export const getBorrowerTasks = () => api.get('/api/borrower/tasks')
export const createBorrowerTask = (data) => api.post('/api/borrower/tasks', data)
export const updateBorrowerTask = (id, data) => api.patch(`/api/borrower/tasks/${id}`, data)
export const deleteBorrowerTask = (id) => api.delete(`/api/borrower/tasks/${id}`)

export const getAuctionDetails = (auctionId) => api.get(`/api/borrower/auctions/${auctionId}`)

export const getBorrowerProfile = () => api.get('/api/borrower/profile')
export const updateBorrowerProfile = (data) => api.put('/api/borrower/profile', data)
export const uploadProfilePhoto = (formData) =>
  api.post('/api/borrower/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getEnvelopes = () => api.get('/api/borrower/govsign/envelopes')
export const reviewEnvelope = (envelopeId) => api.get(`/api/borrower/govsign/envelopes/${envelopeId}`)
export const signEnvelope = (envelopeId, data) =>
  api.post(`/api/borrower/govsign/envelopes/${envelopeId}/sign`, data)

// GovSign / E-Signatures — integration-friendly; backend can implement these routes.
// GET /api/borrower/govsign/data should return { stats, tasks, alerts, activity, envelopes, documents, templates, hsmCluster, certificates, evidenceChain, evidenceEvents, adminSovereignty, adminPolicies, adminSecurity } (see borrowerMockData.js MOCK_GOVSIGN_* for shapes).
export const getGovSignData = () => api.get('/api/borrower/govsign/data')
export const getGovSignEnvelopes = (params) => api.get('/api/borrower/govsign/envelopes', { params })
export const createGovSignEnvelope = (data) => api.post('/api/borrower/govsign/envelopes', data)
export const getGovSignEnvelope = (id) => api.get(`/api/borrower/govsign/envelopes/${id}`)
export const downloadGovSignEnvelope = (id) =>
  api.get(`/api/borrower/govsign/envelopes/${id}/download`, { responseType: 'blob' })
export const getGovSignCertificates = () => api.get('/api/borrower/govsign/certificates')
export const issueGovSignCertificate = (data) => api.post('/api/borrower/govsign/certificates', data)
export const renewGovSignCertificate = (id) => api.post(`/api/borrower/govsign/certificates/${id}/renew`)
export const exportGovSignCertificate = (id) =>
  api.get(`/api/borrower/govsign/certificates/${id}/export`, { responseType: 'blob' })
export const getGovSignEvidenceLedger = () => api.get('/api/borrower/govsign/evidence/summary')
export const getGovSignEvidenceEvents = (params) => api.get('/api/borrower/govsign/evidence/events', { params })
export const exportGovSignLedgerProof = () =>
  api.get('/api/borrower/govsign/evidence/export', { responseType: 'blob' })
export const getGovSignAdmin = () => api.get('/api/borrower/govsign/admin')
export const updateGovSignAdminSetting = (id, payload) => api.patch(`/api/borrower/govsign/admin/settings/${id}`, payload)
export const getGovSignDocuments = () => api.get('/api/borrower/govsign/documents')
export const getGovSignTemplates = () => api.get('/api/borrower/govsign/templates')
export const createGovSignTemplate = (data) => api.post('/api/borrower/govsign/templates', data)
export const deleteGovSignTemplate = (id) => api.delete(`/api/borrower/govsign/templates/${id}`)

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
      err.code = 'ERR_NETWORK'
      err.isOffline = true
    }
    return Promise.reject(err)
  }
)

export const borrowerApi = {
  getDashboardStats: () => api.get('/api/borrower/dashboard/stats'),
  getNextActions: () => api.get('/api/borrower/dashboard/actions'),
  getCaseTimeline: () => api.get('/api/borrower/case/timeline'),

  getCases: () => api.get('/api/borrower/cases'),
  getCaseDetails: (caseId) => api.get(`/api/borrower/case/${caseId}`),
  getCaseSummary: (caseId) => api.get(`/api/borrower/case/${caseId}/summary`),
  getFinancialOverview: (caseId) => api.get(`/api/borrower/case/${caseId}/financial`),

  /** Export case report (PDF or JSON). Backend: GET /api/borrower/case/:caseId/export returns blob. */
  exportCaseReport: (caseId, format = 'json') =>
    api.get(`/api/borrower/case/${caseId}/export`, { params: { format }, responseType: 'blob' }),
  /** Update case details. Backend: PATCH /api/borrower/case/:caseId */
  updateCase: (caseId, data) => api.patch(`/api/borrower/case/${caseId}`, data),
  /** Get bids for a case. Backend: GET /api/borrower/case/:caseId/bids */
  getCaseBids: (caseId) => api.get(`/api/borrower/case/${caseId}/bids`),
  /** Send a case message. Backend: POST /api/borrower/case/:caseId/messages */
  sendCaseMessage: (caseId, data) => api.post(`/api/borrower/case/${caseId}/messages`, data),
  /** Get case messages. Backend: GET /api/borrower/case/:caseId/messages */
  getCaseMessages: (caseId) => api.get(`/api/borrower/case/${caseId}/messages`),
  /** Update settlement task. Backend: PATCH /api/borrower/case/:caseId/settlement/tasks/:taskId */
  updateSettlementTask: (caseId, taskId, data) =>
    api.patch(`/api/borrower/case/${caseId}/settlement/tasks/${taskId}`, data),
  /** Upload case document. Backend: POST /api/borrower/case/:caseId/documents */
  uploadCaseDocument: (caseId, formData) =>
    api.post(`/api/borrower/case/${caseId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  /** Get case documents list. Backend: GET /api/borrower/case/:caseId/documents */
  getCaseDocuments: (caseId) => api.get(`/api/borrower/case/${caseId}/documents`),
  /** Lawyer review: reject case. Backend: POST /api/borrower/case/:caseId/reject */
  rejectCase: (caseId, data) => api.post(`/api/borrower/case/${caseId}/reject`, data || {}),
  /** Lawyer review: approve case. Backend: POST /api/borrower/case/:caseId/approve */
  approveCase: (caseId, data) => api.post(`/api/borrower/case/${caseId}/approve`, data || {}),

  // Investment Memorandum
  getInvestmentMemo: (caseId) => api.get(`/api/borrower/case/${caseId}/investment-memo`),
  updateInvestmentMemo: (caseId, data) => api.put(`/api/borrower/case/${caseId}/investment-memo`, data),
  generateInvestmentMemoPdf: (caseId) =>
    api.post(`/api/borrower/case/${caseId}/investment-memo/pdf`, {}, { responseType: 'blob' }),
  emailInvestmentMemo: (caseId, recipients) =>
    api.post(`/api/borrower/case/${caseId}/investment-memo/email`, { recipients }),

  getContracts: () => api.get('/api/borrower/contracts'),
  getContractDetails: (contractId) => api.get(`/api/borrower/contracts/${contractId}`),
  downloadContract: (contractId) =>
    api.get(`/api/borrower/contracts/${contractId}/download`, { responseType: 'blob' }),

  submitKYC: (formData) => api.post('/api/borrower/kyc/submit', formData),
  uploadDocument: (file) => {
    const data = new FormData()
    data.append('file', file)
    return api.post('/api/borrower/kyc/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  getNotifications: (filters) => api.get('/api/borrower/notifications', { params: filters }),
  markAsRead: (notificationId) => api.patch(`/api/borrower/notifications/${notificationId}/read`),
  deleteNotification: (notificationId) => api.delete(`/api/borrower/notifications/${notificationId}`),
  markAllAsRead: () => api.post('/api/borrower/notifications/mark-all-read'),

  getProfile: () => api.get('/api/borrower/profile'),
  updateProfile: (data) => api.patch('/api/borrower/profile', data),
  uploadProfilePhoto: (file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return api.post('/api/borrower/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Organization Settings
  getOrganization: () => api.get('/api/borrower/organization'),
  updateOrganization: (data) => api.patch('/api/borrower/organization', data),
  inviteTeamMember: (data) => api.post('/api/borrower/organization/team/invite', data),
  updateTeamMember: (memberId, data) => api.patch(`/api/borrower/organization/team/${memberId}`, data),
  removeTeamMember: (memberId) => api.delete(`/api/borrower/organization/team/${memberId}`),

  // Security Settings
  getSecuritySettings: () => api.get('/api/borrower/security'),
  updateSecuritySettings: (data) => api.patch('/api/borrower/security', data),
  changePassword: (data) => api.post('/api/borrower/security/change-password', data),
  toggleTwoFactor: (enabled) => api.patch('/api/borrower/security/two-factor', { enabled }),
  getActiveSessions: () => api.get('/api/borrower/security/sessions'),
  revokeSession: (sessionId) => api.delete(`/api/borrower/security/sessions/${sessionId}`),
  revokeAllOtherSessions: () => api.post('/api/borrower/security/sessions/revoke-all'),

  // Notification Settings
  getNotificationPreferences: () => api.get('/api/borrower/notifications/preferences'),
  updateNotificationPreferences: (data) => api.patch('/api/borrower/notifications/preferences', data),

  // User Management
  getUsers: () => api.get('/api/borrower/users'),
  createUser: (data) => api.post('/api/borrower/users', data),
  updateUser: (userId, data) => api.patch(`/api/borrower/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/api/borrower/users/${userId}`),
  getUserDetails: (userId) => api.get(`/api/borrower/users/${userId}`),

  // Module Settings
  getModuleSettings: () => api.get('/api/borrower/module-settings'),
  updateModuleSettings: (data) => api.patch('/api/borrower/module-settings', data),

  // Access Control
  getRoles: () => api.get('/api/borrower/roles'),
  createRole: (data) => api.post('/api/borrower/roles', data),
  updateRole: (roleId, data) => api.patch(`/api/borrower/roles/${roleId}`, data),
  deleteRole: (roleId) => api.delete(`/api/borrower/roles/${roleId}`),
  getRoleDetails: (roleId) => api.get(`/api/borrower/roles/${roleId}`),

  // Integrations
  getIntegrations: () => api.get('/api/borrower/integrations'),
  connectIntegration: (integrationId) => api.post(`/api/borrower/integrations/${integrationId}/connect`),
  disconnectIntegration: (integrationId) => api.delete(`/api/borrower/integrations/${integrationId}/disconnect`),

  // GovSign / E-Signatures
  getGovSignData: () => api.get('/api/borrower/govsign/data'),
  getGovSignEnvelopes: (params) => api.get('/api/borrower/govsign/envelopes', { params }),
  createGovSignEnvelope: (data) => api.post('/api/borrower/govsign/envelopes', data),
  getGovSignEnvelope: (id) => api.get(`/api/borrower/govsign/envelopes/${id}`),
  downloadGovSignEnvelope: (id) => api.get(`/api/borrower/govsign/envelopes/${id}/download`, { responseType: 'blob' }),
  getGovSignCertificates: () => api.get('/api/borrower/govsign/certificates'),
  issueGovSignCertificate: (data) => api.post('/api/borrower/govsign/certificates', data),
  renewGovSignCertificate: (id) => api.post(`/api/borrower/govsign/certificates/${id}/renew`),
  exportGovSignCertificate: (id) => api.get(`/api/borrower/govsign/certificates/${id}/export`, { responseType: 'blob' }),
  getGovSignEvidenceLedger: () => api.get('/api/borrower/govsign/evidence/summary'),
  getGovSignEvidenceEvents: (params) => api.get('/api/borrower/govsign/evidence/events', { params }),
  exportGovSignLedgerProof: () => api.get('/api/borrower/govsign/evidence/export', { responseType: 'blob' }),
  getGovSignAdmin: () => api.get('/api/borrower/govsign/admin'),
  updateGovSignAdminSetting: (id, payload) => api.patch(`/api/borrower/govsign/admin/settings/${id}`, payload),
  getGovSignDocuments: () => api.get('/api/borrower/govsign/documents'),
  getGovSignTemplates: () => api.get('/api/borrower/govsign/templates'),
  createGovSignTemplate: (data) => api.post('/api/borrower/govsign/templates', data),
  deleteGovSignTemplate: (id) => api.delete(`/api/borrower/govsign/templates/${id}`),
}

export default api
