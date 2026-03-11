import API from "./api";

export const createEscrow = (data) => API.post("/escrows/", data);
export const holdEscrow = (id) => API.post(`/escrows/${id}/hold`);
export const releaseEscrow = (id) => API.post(`/escrows/${id}/release`);
export const refundEscrow = (id) => API.post(`/escrows/${id}/refund`);
export const getDealEscrows = (dealId) => API.get(`/escrows/deal/${dealId}`);
// User prompt requested depositEscrow, assuming hold/create is similar context.
export const depositEscrow = (id, data) => API.post(`/escrows/${id}/hold`, data); 
