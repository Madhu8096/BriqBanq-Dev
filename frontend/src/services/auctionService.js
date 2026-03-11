import API from "./api";

export const createAuction = (data) => API.post("/auctions/", data);
export const startAuction = (id) => API.post(`/auctions/${id}/start`);
export const getAuctions = () => API.get("/auctions/");
export const getAuctionDetails = (id) => API.get(`/auctions/${id}`);
export const closeAuction = (id) => API.post(`/auctions/${id}/close`);
export const getAuctionWinner = (id) => API.get(`/auctions/${id}/winner`);
export const pauseAuction = (id) => API.post(`/auctions/${id}/pause`);
export const resumeAuction = (id) => API.post(`/auctions/${id}/resume`);
export const endAuction = (id) => API.post(`/auctions/${id}/end`);
