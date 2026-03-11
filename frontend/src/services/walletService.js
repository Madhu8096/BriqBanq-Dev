import API from "./api";

export const createWallet = (data) => API.post("/wallets/", data);
export const getWalletBalance = (walletId) => API.get(`/wallets/${walletId}/balance`);
export const getMyWallet = () => API.get("/wallets/my-wallet");
export const getMyLedger = () => API.get("/wallets/my-wallet/ledger");
export const depositFunds = (data) => API.post("/wallets/my-wallet/deposit", data);
export const getTransactions = () => API.get("/wallets/transactions");
export const withdrawFunds = (data) => API.post("/wallets/my-wallet/withdraw", data);
