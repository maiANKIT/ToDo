import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================================
// GLOBAL 401 HANDLER
// Any request, from anywhere in the app, that comes back
// Unauthorized (session invalidated, device limit exceeded,
// token expired, etc.) forces an immediate logout.
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const alreadyLoggedOut = !localStorage.getItem("token");

      if (!alreadyLoggedOut) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Let AuthContext (and anything else listening) know
        // the session died, so React state resets too —
        // not just localStorage.
        window.dispatchEvent(new Event("session-expired"));

        // Hard redirect ensures a clean app state, not just
        // a route change while stale React state lingers.
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;