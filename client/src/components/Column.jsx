// ─── Column Component ───────────────────────────────────
// Droppable column using @dnd-kit/sortable with Apple-inspired frosted design.

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard.jsx";
import AddTaskForm from "./AddTaskForm.jsx";

const COLUMN_CONFIG = {
    todo: {
        label: "To Do",
        icon: "📋",
        headerBg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        countBg: "bg-amber-500 text-white dark:bg-amber-500/25 dark:text-amber-300",
        dropHighlight: "ring-2 ring-amber-400/50 bg-amber-500/5",
        emptyText: "No tasks to do",
    },
    pending: {
        label: "Pending",
        icon: "⏳",
        headerBg: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
        countBg: "bg-violet-500 text-white dark:bg-violet-500/25 dark:text-violet-300",
        dropHighlight: "ring-2 ring-violet-400/50 bg-violet-500/5",
        emptyText: "No pending tasks",
    },
    ongoing: {
        label: "Ongoing",
        icon: "⚡",
        headerBg: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
        countBg: "bg-sky-500 text-white dark:bg-sky-500/25 dark:text-sky-300",
        dropHighlight: "ring-2 ring-sky-400/50 bg-sky-500/5",
        emptyText: "Nothing in progress",
    },
    completed: {
        label: "Completed",
        icon: "✓",
        headerBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        countBg: "bg-emerald-500 text-white dark:bg-emerald-500/25 dark:text-emerald-300",
        dropHighlight: "ring-2 ring-emerald-400/50 bg-emerald-500/5",
        emptyText: "No completed tasks yet",
    },
};

function Column({ status, tasks = [], onComplete, onAddTask, onClearCompleted, onDelete, onMoveTask }) {
    const config = COLUMN_CONFIG[status];
    const isCompleted = status === "completed";
    const isOngoing = status === "ongoing";

    // Droppable area
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${status}`,
        data: {
            type: "column",
            status,
        },
    });

    const taskIds = tasks.map((t) => t._id);

    return (
        <div
            className={`
        flex flex-col rounded-3xl glass-card
        min-h-[480px] transition-all duration-200 overflow-hidden
        ${isOver ? config.dropHighlight : ""}
      `}
        >
            {/* Column Header */}
            <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold border ${config.headerBg}`}>
                        {config.icon}
                    </span>
                    <h2 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                        {config.label}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs ${config.countBg}`}
                    >
                        {tasks.length}
                    </span>

                    {/* Clear completed button */}
                    {isCompleted && tasks.length > 0 && onClearCompleted && (
                        <button
                            onClick={onClearCompleted}
                            title="Clear all completed tasks"
                            className="text-[11px] font-medium px-2 py-0.5 rounded-lg
                              bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/25
                              transition-all duration-200 flex items-center gap-1 active:scale-95"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Task Cards — droppable + sortable */}
            <div
                ref={setNodeRef}
                className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]"
            >
                {/* Add Task button — Todo column only */}
                {status === "todo" && onAddTask && (
                    <AddTaskForm onAdd={onAddTask} />
                )}

                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                isCompleted={isCompleted}
                                isOngoing={isOngoing}
                                onComplete={onComplete}
                                onDelete={onDelete}
                                onMoveTask={onMoveTask}
                            />
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm mb-2 opacity-60">
                                {config.icon}
                            </div>
                            <p className="text-xs text-center font-medium">
                                {isOver ? "Drop task here" : config.emptyText}
                            </p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

export default Column;
