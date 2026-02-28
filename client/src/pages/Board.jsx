// ─── Board Page ─────────────────────────────────────────
// Main board with DndContext for drag-and-drop between columns.

import { useState, useEffect, useCallback } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import Column from "../components/Column.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { fetchTodayTasks, moveTask as moveTaskApi, createTask, deleteCompletedTasks, deleteTask } from "../services/taskService.js";

// Priority sort order for the Pending column
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// Status columns in display order
const STATUSES = ["todo", "pending", "ongoing", "completed"];

function Board() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    // ─── Sensors (pointer + touch for mobile) ───────────
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
        })
    );

    // ─── Fetch tasks on mount ───────────────────────────
    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchTodayTasks();
                setTasks(result.data || []);
            } catch (err) {
                console.error("Failed to load tasks:", err);
                setError("Failed to load tasks. Is the backend running?");
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    // ─── Group tasks by status ─────────────────────────
    const getGroupedTasks = useCallback(() => {
        const grouped = {};
        for (const status of STATUSES) {
            const filtered = tasks.filter((t) => t.status === status);

            if (status === "pending") {
                filtered.sort(
                    (a, b) =>
                        (PRIORITY_ORDER[a.priority] ?? 1) -
                        (PRIORITY_ORDER[b.priority] ?? 1)
                );
            } else {
                filtered.sort((a, b) => a.position - b.position);
            }

            grouped[status] = filtered;
        }
        return grouped;
    }, [tasks]);

    const groupedTasks = getGroupedTasks();

    // ─── Find which column a task belongs to ────────────
    const findTaskColumn = (taskId) => {
        const task = tasks.find((t) => t._id === taskId);
        return task ? task.status : null;
    };

    // ─── Drag Start ──────────────────────────────────────
    const handleDragStart = (event) => {
        const { active } = event;
        const task = tasks.find((t) => t._id === active.id);
        if (task) setActiveTask(task);
    };

    // ─── Drag Over (live preview while dragging) ────────
    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Determine source and destination columns
        const sourceStatus = findTaskColumn(activeId);

        let destStatus;
        if (String(overId).startsWith("column-")) {
            // Dropped on a column directly
            destStatus = String(overId).replace("column-", "");
        } else {
            // Dropped on another task — find that task's column
            destStatus = findTaskColumn(overId);
        }

        if (!sourceStatus || !destStatus || sourceStatus === destStatus) return;

        // ── Move task to a different column (live preview) ──
        setTasks((prev) => {
            return prev.map((t) =>
                t._id === activeId ? { ...t, status: destStatus } : t
            );
        });
    };

    // ─── Drag End (final placement + API call) ──────────
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const draggedTask = activeTask; // capture before clearing
        setActiveTask(null);

        if (!over || !draggedTask) return;

        const activeId = active.id;
        const overId = over.id;

        // Use the ORIGINAL status from when drag started (before handleDragOver changed it)
        const sourceStatus = draggedTask.status;

        let destStatus;
        if (String(overId).startsWith("column-")) {
            destStatus = String(overId).replace("column-", "");
        } else {
            destStatus = findTaskColumn(overId);
        }

        if (!sourceStatus || !destStatus) return;

        // Save snapshot for rollback
        const snapshot = [...tasks];

        // Calculate new position
        const destTasks = tasks
            .filter((t) => t.status === destStatus && t._id !== activeId)
            .sort((a, b) => a.position - b.position);

        let newPosition;

        if (String(overId).startsWith("column-")) {
            // Dropped on empty area of column → place at end
            newPosition = destTasks.length;
        } else if (sourceStatus === destStatus) {
            // Reorder within same column
            const oldIndex = groupedTasks[destStatus].findIndex(
                (t) => t._id === activeId
            );
            const newIndex = groupedTasks[destStatus].findIndex(
                (t) => t._id === overId
            );

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const reordered = arrayMove(
                    groupedTasks[destStatus],
                    oldIndex,
                    newIndex
                );

                // Update positions optimistically
                setTasks((prev) => {
                    const updated = [...prev];
                    reordered.forEach((task, index) => {
                        const idx = updated.findIndex((t) => t._id === task._id);
                        if (idx !== -1) updated[idx] = { ...updated[idx], position: index };
                    });
                    return updated;
                });

                newPosition = newIndex;
            } else {
                return; // No meaningful change
            }
        } else {
            // Cross-column drop on a specific task
            const overIndex = destTasks.findIndex((t) => t._id === overId);
            newPosition = overIndex !== -1 ? overIndex : destTasks.length;
        }

        // Update position optimistically
        setTasks((prev) =>
            prev.map((t) =>
                t._id === activeId
                    ? { ...t, status: destStatus, position: newPosition }
                    : t
            )
        );

        // Persist to backend
        try {
            await moveTaskApi(activeId, destStatus, newPosition);
        } catch (err) {
            console.error("Failed to move task:", err);
            // Rollback on failure
            setTasks(snapshot);
        }
    };

    // ─── Complete task (from Ongoing → Completed) ────────
    const handleCompleteTask = async (taskId) => {
        const snapshot = [...tasks];
        const completedTasks = tasks.filter(
            (t) => t.status === "completed"
        );
        const newPosition = completedTasks.length;

        // Optimistic update
        setTasks((prev) =>
            prev.map((t) =>
                t._id === taskId
                    ? { ...t, status: "completed", position: newPosition }
                    : t
            )
        );

        try {
            await moveTaskApi(taskId, "completed", newPosition);
        } catch (err) {
            console.error("Failed to complete task:", err);
            setTasks(snapshot);
        }
    };

    // ─── Add new task ───────────────────────────────────────
    const handleAddTask = async (taskData) => {
        const result = await createTask(taskData);
        if (result.success && result.data) {
            setTasks((prev) => [...prev, result.data]);
        }
    };

    // ─── Clear completed tasks ───────────────────────────
    const handleClearCompleted = async () => {
        const snapshot = [...tasks];

        // Optimistic update
        setTasks((prev) => prev.filter((t) => t.status !== "completed"));

        try {
            await deleteCompletedTasks();
        } catch (err) {
            console.error("Failed to clear completed tasks:", err);
            setTasks(snapshot);
        }
    };

    // ─── Move task to a specific column ──────────────────
    const handleMoveTask = async (taskId, targetStatus) => {
        const snapshot = [...tasks];

        // Calculate position at end of target column
        const targetTasks = tasks.filter((t) => t.status === targetStatus);
        const newPosition = targetTasks.length;

        // Optimistic update
        setTasks((prev) =>
            prev.map((t) =>
                t._id === taskId
                    ? { ...t, status: targetStatus, position: newPosition }
                    : t
            )
        );

        try {
            await moveTaskApi(taskId, targetStatus, newPosition);
        } catch (err) {
            console.error("Failed to move task:", err);
            setTasks(snapshot);
        }
    };

    // ─── Delete a single task ───────────────────────────
    const handleDeleteTask = async (taskId) => {
        const snapshot = [...tasks];

        // Optimistic update
        setTasks((prev) => prev.filter((t) => t._id !== taskId));

        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error("Failed to delete task:", err);
            setTasks(snapshot);
        }
    };

    // ─── Loading state ──────────────────────────────────
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading your tasks...</p>
                </div>
            </div>
        );
    }

    // ─── Error state ────────────────────────────────────
    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center bg-surface-800 border border-red-500/30 rounded-xl p-8 max-w-md">
                    <div className="text-3xl mb-3">⚠️</div>
                    <p className="text-sm text-red-400 font-medium mb-2">
                        Connection Error
                    </p>
                    <p className="text-xs text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {STATUSES.map((status) => (
                    <Column
                        key={status}
                        status={status}
                        tasks={groupedTasks[status]}
                        onComplete={handleCompleteTask}
                        onAddTask={handleAddTask}
                        onClearCompleted={handleClearCompleted}
                        onDelete={handleDeleteTask}
                        onMoveTask={handleMoveTask}
                    />
                ))}
            </div>

            {/* Drag Overlay — floating card that follows cursor */}
            <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
                {activeTask ? (
                    <div className="opacity-90 rotate-[2deg] scale-105">
                        <TaskCard task={activeTask} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default Board;
