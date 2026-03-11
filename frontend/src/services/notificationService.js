import API from "./api";

export const getMyNotifications = () => API.get("/notifications/");
export const getNotifications = getMyNotifications;
export const getUnreadCount = () => API.get("/notifications/unread-count");
export const markNotificationRead = (id) => API.post(`/notifications/${id}/read`);
export const markAllRead = () => API.post("/notifications/read-all");
