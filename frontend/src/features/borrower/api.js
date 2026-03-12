import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

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
  getGovSignData: () => api.get('/api/borrower/govsign'),
}

export default api
