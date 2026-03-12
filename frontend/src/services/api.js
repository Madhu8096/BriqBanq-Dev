import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/** Create a WebSocket for real-time feeds (e.g. auctions). Replace with your backend WS URL. */
export function createWebSocket(path) {
  const base = (import.meta.env.VITE_WS_URL || window.location.origin).replace(/^http/, 'ws');
  return new WebSocket(`${base}${path}`);
}

export default api;
