import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

// Add a request interceptor to include the JWT token and debug logs
api.interceptors.request.use(
  (config) => {
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("[API 401] Token expired or unauthorized. Logging out...");
      // Use clean clearing
      localStorage.clear(); 
      
      // Redirect to signin if not already there
      if (!window.location.pathname.includes("/signin")) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

/** Create a WebSocket for real-time feeds (e.g. auctions). Replace with your backend WS URL. */
export function createWebSocket(path) {
  const base = (import.meta.env.VITE_WS_URL || window.location.origin).replace(/^http/, 'ws');
  return new WebSocket(`${base}${path}`);
}

export default api;
