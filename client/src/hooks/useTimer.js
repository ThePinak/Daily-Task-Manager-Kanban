// ─── useTimer Hook ──────────────────────────────────────
// Manages a per-task timer with start/pause/resume/stop.
// Persists accumulated time to the backend on pause/stop.

import { useState, useEffect, useRef, useCallback } from "react";
import { updateTimeSpent } from "../services/taskService.js";

/**
 * @param {string} taskId - The task's _id.
 * @param {number} initialTimeSpent - Seconds already spent (from DB).
 * @param {boolean} autoStart - Optionally start timer automatically.
 * @returns Timer state and controls.
 */
export function useTimer(taskId, initialTimeSpent = 0, autoStart = false) {
    const [elapsed, setElapsed] = useState(initialTimeSpent);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const sessionStartRef = useRef(0); // seconds accumulated this session (unsaved)
    const lastSyncRef = useRef(initialTimeSpent);

    // Start or resume the timer
    const start = useCallback(() => {
        if (intervalRef.current) return; // already running
        setIsRunning(true);
        sessionStartRef.current = 0;

        intervalRef.current = setInterval(() => {
            setElapsed((prev) => prev + 1);
            sessionStartRef.current += 1;
        }, 1000);

        // Tell backend the timer is running (for crash recovery)
        updateTimeSpent(taskId, 0, true).catch(() => { });
    }, [taskId]);

    // Pause the timer and persist accumulated time
    const pause = useCallback(async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);

        const unsaved = sessionStartRef.current;
        if (unsaved > 0) {
            try {
                await updateTimeSpent(taskId, unsaved, false);
                lastSyncRef.current += unsaved;
                sessionStartRef.current = 0;
            } catch (err) {
                console.error("Failed to persist time:", err);
            }
        }
    }, [taskId]);

    // Stop timer completely (for task completion or drag-out)
    const stop = useCallback(async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);

        const unsaved = sessionStartRef.current;
        if (unsaved > 0) {
            try {
                await updateTimeSpent(taskId, unsaved, false);
                lastSyncRef.current += unsaved;
                sessionStartRef.current = 0;
            } catch (err) {
                console.error("Failed to persist time:", err);
            }
        }

        return lastSyncRef.current;
    }, [taskId]);

    // Reset (when task changes)
    const reset = useCallback((newInitial) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
        setElapsed(newInitial || 0);
        sessionStartRef.current = 0;
        lastSyncRef.current = newInitial || 0;
    }, []);

    // Auto-start if requested
    useEffect(() => {
        if (autoStart) start();
    }, [autoStart, start]);

    // Periodic auto-save every 30s while running
    useEffect(() => {
        if (!isRunning) return;

        const autoSave = setInterval(() => {
            const unsaved = sessionStartRef.current;
            if (unsaved > 0) {
                updateTimeSpent(taskId, unsaved, true)
                    .then(() => {
                        lastSyncRef.current += unsaved;
                        sessionStartRef.current = 0;
                    })
                    .catch(() => { });
            }
        }, 30000);

        return () => clearInterval(autoSave);
    }, [isRunning, taskId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                // Persist any unsaved time
                const unsaved = sessionStartRef.current;
                if (unsaved > 0) {
                    updateTimeSpent(taskId, unsaved, false).catch(() => { });
                }
            }
        };
    }, [taskId]);

    return {
        elapsed,       // Total seconds (initial + current session)
        isRunning,     // Whether timer is actively ticking
        start,         // Start / resume
        pause,         // Pause and save
        stop,          // Stop completely and save
        reset,         // Reset to new initial value
    };
}
