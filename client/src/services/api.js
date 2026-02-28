// ─── Axios Base Instance ────────────────────────────────
// Centralized HTTP client for all API calls.
// All requests include the x-anonymous-user-id header for user isolation.

import axios from "axios";
import { getAnonymousUserId } from "../utils/userId.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
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
