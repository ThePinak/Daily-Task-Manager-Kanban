// ─── Board Page ─────────────────────────────────────────
// Main Kanban board with Search & Priority Filters.
// Pure white design, high contrast readability, zero emojis.

import React, { useState, useEffect, useCallback } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";

import Column from "../components/Column.jsx";
import TaskCard from "../components/TaskCard.jsx";
import DailyAnalytics from "../components/DailyAnalytics.jsx";
import FocusTimer from "../components/FocusTimer.jsx";
import { fetchTodayTasks, moveTask as moveTaskApi, createTask, deleteCompletedTasks, deleteTask } from "../services/taskService.js";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const STATUSES = ["todo", "pending", "ongoing", "completed"];

function Board({ activeTab = "board", setActiveTab }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("all");

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
        })
    );

    // Fetch tasks on mount
    useEffect(() => {
        loadTasks();
    }, []);

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

    // Filtered Tasks
    const filteredTasks = tasks.filter((t) => {
        const matchesSearch =
            !searchQuery.trim() ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPriority =
            selectedPriority === "all" || t.priority === selectedPriority;
        return matchesSearch && matchesPriority;
    });

    // Group tasks by status
    const getGroupedTasks = useCallback(() => {
        const grouped = {};
        for (const status of STATUSES) {
            const list = filteredTasks.filter((t) => t.status === status);

            if (status === "pending") {
                list.sort(
                    (a, b) =>
                        (PRIORITY_ORDER[a.priority] ?? 1) -
                        (PRIORITY_ORDER[b.priority] ?? 1)
                );
            } else {
                list.sort((a, b) => a.position - b.position);
            }

            grouped[status] = list;
        }
        return grouped;
    }, [filteredTasks]);

    const groupedTasks = getGroupedTasks();

    const findTaskColumn = (taskId) => {
        const task = tasks.find((t) => t._id === taskId);
        return task ? task.status : null;
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const task = tasks.find((t) => t._id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeColumn = findTaskColumn(activeId);
        let overColumn = null;

        if (overId.startsWith("column-")) {
            overColumn = overId.replace("column-", "");
        } else {
            overColumn = findTaskColumn(overId);
        }

        if (!activeColumn || !overColumn || activeColumn === overColumn) return;

        setTasks((prev) => {
            const activeIndex = prev.findIndex((t) => t._id === activeId);
            if (activeIndex === -1) return prev;

            const updated = [...prev];
            updated[activeIndex] = { ...updated[activeIndex], status: overColumn };
            return updated;
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeTask = tasks.find((t) => t._id === activeId);
        if (!activeTask) return;

        let targetStatus = null;
        let targetIndex = 0;

        if (overId.startsWith("column-")) {
            targetStatus = overId.replace("column-", "");
            targetIndex = tasks.filter((t) => t.status === targetStatus).length;
        } else {
            const overTask = tasks.find((t) => t._id === overId);
            if (!overTask) return;
            targetStatus = overTask.status;

            const columnTasks = tasks
                .filter((t) => t.status === targetStatus)
                .sort((a, b) => a.position - b.position);
            targetIndex = columnTasks.findIndex((t) => t._id === overId);
        }

        const snapshot = [...tasks];

        setTasks((prev) => {
            const withoutActive = prev.filter((t) => t._id !== activeId);
            const targetColumnTasks = withoutActive
                .filter((t) => t.status === targetStatus)
                .sort((a, b) => a.position - b.position);

            const updatedTask = {
                ...activeTask,
                status: targetStatus,
                position: targetIndex,
            };

            targetColumnTasks.splice(targetIndex, 0, updatedTask);

            const reindexed = targetColumnTasks.map((t, idx) => ({
                ...t,
                position: idx,
            }));

            const otherTasks = withoutActive.filter((t) => t.status !== targetStatus);
            return [...otherTasks, ...reindexed];
        });

        try {
            await moveTaskApi(activeId, targetStatus, targetIndex);
        } catch (err) {
            console.error("Failed to move task:", err);
            setTasks(snapshot);
        }
    };

    const handleMoveTask = async (taskId, newStatus) => {
        const task = tasks.find((t) => t._id === taskId);
        if (!task || task.status === newStatus) return;

        const snapshot = [...tasks];
        const targetColumnTasks = tasks.filter((t) => t.status === newStatus);
        const newPosition = targetColumnTasks.length;

        setTasks((prev) =>
            prev.map((t) =>
                t._id === taskId
                    ? { ...t, status: newStatus, position: newPosition }
                    : t
            )
        );

        try {
            await moveTaskApi(taskId, newStatus, newPosition);
        } catch (err) {
            console.error("Failed to move task:", err);
            setTasks(snapshot);
        }
    };

    const handleCompleteTask = async (taskId) => {
        const snapshot = [...tasks];
        const completedTasks = tasks.filter((t) => t.status === "completed");
        const newPosition = completedTasks.length;

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

    const handleAddTask = async (taskData) => {
        const todoTasks = tasks.filter((t) => t.status === "todo");
        const position = todoTasks.length;

        const optimisticTask = {
            _id: `temp-${Date.now()}`,
            ...taskData,
            status: "todo",
            position,
            totalTimeSpent: 0,
            taskDate: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
        };

        setTasks((prev) => [...prev, optimisticTask]);

        try {
            const result = await createTask({ ...taskData, position });
            setTasks((prev) =>
                prev.map((t) => (t._id === optimisticTask._id ? result.data : t))
            );
        } catch (err) {
            console.error("Failed to create task:", err);
            setTasks((prev) => prev.filter((t) => t._id !== optimisticTask._id));
        }
    };

    const handleClearCompleted = async () => {
        const snapshot = [...tasks];
        setTasks((prev) => prev.filter((t) => t.status !== "completed"));

        try {
            await deleteCompletedTasks();
        } catch (err) {
            console.error("Failed to clear completed tasks:", err);
            setTasks(snapshot);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const snapshot = [...tasks];
        setTasks((prev) => prev.filter((t) => t._id !== taskId));

        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error("Failed to delete task:", err);
            setTasks(snapshot);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs font-semibold text-gray-500">Loading your board...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <div className="text-center bg-white border border-gray-200 rounded-2xl p-8 max-w-md shadow-xs">
                    <p className="text-sm text-red-600 font-bold mb-2">
                        Connection Error
                    </p>
                    <p className="text-xs text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={loadTasks}
                        className="text-xs bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Render based on Active Tab
    if (activeTab === "analytics") {
        return (
            <DailyAnalytics
                tasks={tasks}
                onClearCompleted={handleClearCompleted}
                onNavigateToBoard={() => setActiveTab && setActiveTab("board")}
            />
        );
    }

    if (activeTab === "focus") {
        return (
            <FocusTimer
                tasks={tasks}
                onCompleteTask={handleCompleteTask}
            />
        );
    }

    // Default: Kanban Board Tab
    return (
        <div className="max-w-7xl mx-auto space-y-4">
            {/* Search & Priority Filter Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
                {/* Search Input */}
                <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-brand-500 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-gray-400 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Priority filter pills (No emojis) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
                        Priority:
                    </span>
                    {[
                        { key: "all", label: "All", dot: null },
                        { key: "high", label: "High", dot: "bg-red-500" },
                        { key: "medium", label: "Medium", dot: "bg-amber-500" },
                        { key: "low", label: "Low", dot: "bg-green-500" },
                    ].map((p) => (
                        <button
                            key={p.key}
                            onClick={() => setSelectedPriority(p.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                                selectedPriority === p.key
                                    ? "bg-brand-500 text-white shadow-2xs"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                        >
                            {p.dot && <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />}
                            {p.label}
                        </button>
                    ))}

                    <span className="text-xs text-gray-400 font-medium ml-2 pl-2 border-l border-gray-200">
                        {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                    </span>
                </div>
            </div>

            {/* Kanban Board Drag & Drop Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
                    {activeTask ? (
                        <div className="opacity-95 rotate-[1.5deg] scale-102 shadow-xl bg-white rounded-xl">
                            <TaskCard task={activeTask} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export default Board;
