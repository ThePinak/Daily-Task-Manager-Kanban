// ─── Axios Base Instance ────────────────────────────────
// Centralized HTTP client for all API calls.
// All requests include the x-anonymous-user-id header for user isolation.

import axios from "axios";
import { getAnonymousUserId } from "../utils/userId.js";

// In production (Vercel), hit the Render backend directly.
// In development (localhost), use the Vite proxy.
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const api = axios.create({
    baseURL: isLocal ? "/api" : "https://daily-task-manager-kanban.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach anonymousUserId to every outgoing request
api.interceptors.request.use((config) => {
    config.headers["x-anonymous-user-id"] = getAnonymousUserId();
    return config;
});

export default api;
