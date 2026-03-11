import API from "./api";

export const placeBid = (data) => API.post("/bids/place", data);
export const validateBid = (data) => API.post("/bids/validate", data);
export const getMyBids = () => API.get("/bids/my-bids");
export const getAuctionBids = (auctionId) => API.get(`/bids/auction/${auctionId}`);
