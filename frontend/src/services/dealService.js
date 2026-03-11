import API from "./api";

export const createDeal = (data) => API.post("/deals/", data);
export const listAllDeals = () => API.get("/deals/");
export const getDeal = (id) => API.get(`/deals/${id}`);
export const listDeal = (id) => API.post(`/deals/${id}/list`);
export const closeDeal = (id) => API.post(`/deals/${id}/close`);
