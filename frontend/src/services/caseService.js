import API from "./api";

export const createCase = (data) => API.post("/cases/", data);
export const getCases = () => API.get("/cases/");
export const getMyCases = () => API.get("/cases/my-cases");
export const getCaseById = (id) => API.get(`/cases/${id}`);
export const updateCase = (id, data) => API.put(`/cases/${id}`, data);
export const updateCaseStatus = (id, statusData) => API.put(`/cases/${id}/status`, statusData);
export const submitCase = (id) => API.post(`/cases/${id}/submit`);
export const startCaseReview = (id) => API.post(`/cases/${id}/review`);
export const approveCase = (id, data) => API.post(`/cases/${id}/approve`, data);
export const rejectCase = (id, data) => API.post(`/cases/${id}/reject`, data);
export const listCaseForAuction = (id, data) => API.post(`/cases/${id}/list`, data);
export const assignParticipants = (id, data) => API.post(`/cases/${id}/assign`, data);
