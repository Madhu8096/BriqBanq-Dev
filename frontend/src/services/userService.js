import API from "./api";

export const getCurrentUser = () => API.get("/users/me");
export const updateUserProfile = (data) => API.put("/users/me", data);
export const changePassword = (data) => API.put("/identity/me/password", data);
export const suspendUser = (userId) => API.post(`/identity/users/${userId}/suspend`);
export const reactivateUser = (userId) => API.post(`/identity/users/${userId}/reactivate`);
export const listUsers = () => API.get("/identity/users");
