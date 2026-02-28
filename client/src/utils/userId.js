// ─── Anonymous User ID Utility ──────────────────────────
// Generates a UUID on first visit and stores it in localStorage.
// All subsequent visits use the same ID.

const STORAGE_KEY = "anonymousUserId";

/**
 * Get or create the anonymous user ID.
 * @returns {string} UUID string
 */
export const getAnonymousUserId = () => {
    let userId = localStorage.getItem(STORAGE_KEY);

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, userId);
    }

    return userId;
};
