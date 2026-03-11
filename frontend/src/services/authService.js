import API from "./api";

export const login = (data) => API.post("/identity/login", data);
export const register = (data) => API.post("/identity/register", data);
export const logout = () => API.post("/identity/logout");
export const refreshToken = () => API.post("/identity/refresh");
