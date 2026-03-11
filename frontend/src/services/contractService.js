import API from "./api";

export const getContract = (id) => API.get(`/contracts/${id}`);
export const createContract = (data) => API.post("/contracts/", data);
export const generateContract = createContract;
export const sendForSignatures = (id) => API.post(`/contracts/${id}/send`);
export const signContract = (id, data) => API.post(`/contracts/${id}/sign`, data);
export const executeContract = (id) => API.post(`/contracts/${id}/execute`);
export const getDealContracts = (dealId) => API.get(`/contracts/deal/${dealId}`);
export const getSignatures = (id) => API.get(`/contracts/${id}/signatures`);
