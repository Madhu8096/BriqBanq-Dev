// src/services/caseApi.js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Cases
export const getCaseDetails = (caseId) => api.get(`/api/cases/${caseId}`)
export const updateCaseDetails = (caseId, data) => api.put(`/api/cases/${caseId}`, data)

// Documents
export const uploadDocument = (caseId, formData) => api.post(`/api/cases/${caseId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteDocument = (caseId, docId) => api.delete(`/api/cases/${caseId}/documents/${docId}`)

// Images
export const uploadImages = (caseId, formData) => api.post(`/api/cases/${caseId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteImage = (caseId, imageId) => api.delete(`/api/cases/${caseId}/images/${imageId}`)

// AI Content
export const generateAIContent = (caseId, contentType) => api.post(`/api/cases/${caseId}/ai-generate`, { contentType })

// Documents Generation
export const generateIM = (caseId) => api.post(`/api/cases/${caseId}/generate-im`, {}, { responseType: 'blob' })
export const generateFlyer = (caseId) => api.post(`/api/cases/${caseId}/generate-flyer`, {}, { responseType: 'blob' })

// Messages
export const getCaseMessages = (caseId) => api.get(`/api/cases/${caseId}/messages`)
export const sendMessage = (caseId, message) => api.post(`/api/cases/${caseId}/messages`, { message })

// Bids
export const getCaseBids = (caseId) => api.get(`/api/cases/${caseId}/bids`)

// Activity
export const getCaseActivity = (caseId) => api.get(`/api/cases/${caseId}/activity`)

// Settlement
export const updateSettlementItem = (caseId, itemId, data) => api.patch(`/api/cases/${caseId}/settlement/${itemId}`, data)
export const markReadyForSettlement = (caseId) => api.post(`/api/cases/${caseId}/settlement/ready`)

export default api
