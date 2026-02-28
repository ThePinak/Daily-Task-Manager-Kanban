// ─── Task API Service ───────────────────────────────────
// All backend calls related to tasks.

import api from "./api.js";

/**
 * Fetch all tasks for today.
 */
export const fetchTodayTasks = async () => {
    const response = await api.get("/tasks/today");
    return response.data;
};

/**
 * Create a new task.
 */
export const createTask = async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
};

/**
 * Update task details (title, description, priority, estimatedTime).
 */
export const updateTask = async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
};

/**
 * Move a task to a new status/position (drag-and-drop).
 */
export const moveTask = async (taskId, status, position) => {
    const response = await api.patch(`/tasks/${taskId}/move`, { status, position });
    return response.data;
};

/**
 * Delete a task.
 */
export const deleteTask = async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
};

/**
 * Delete all completed tasks for today.
 */
export const deleteCompletedTasks = async () => {
    const response = await api.delete("/tasks/completed");
    return response.data;
};

/**
 * Update time spent on a task.
 * @param {string} taskId
 * @param {number} additionalSeconds - Seconds to add
 * @param {boolean} timerRunning - Whether timer is still active
 */
export const updateTimeSpent = async (taskId, additionalSeconds, timerRunning = false) => {
    const response = await api.patch(`/tasks/${taskId}/time`, {
        additionalSeconds,
        timerRunning,
    });
    return response.data;
};
