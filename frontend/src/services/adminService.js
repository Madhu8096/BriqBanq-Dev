import API from "./api";

export const getDashboard = () => API.get("/admin/dashboard");
export const getPlatformStats = () => API.get("/admin/platform-stats");
export const getSettings = () => API.get("/admin/settings");
export const createSetting = (data) => API.post("/admin/settings", data);
export const updateSetting = (key, data) => API.put(`/admin/settings/${key}`, data);
export const deleteSetting = (key) => API.delete(`/admin/settings/${key}`);
export const seedDefaults = () => API.post("/admin/settings/seed");
