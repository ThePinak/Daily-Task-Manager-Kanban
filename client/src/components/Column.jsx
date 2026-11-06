// ─── Column Component ───────────────────────────────────
// Droppable Kanban column in pure white Apple design. Zero emojis, high contrast.

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
        badge: "bg-amber-50 text-amber-800 border border-amber-200",
        countBadge: "bg-amber-100 text-amber-900",
        dropHighlight: "ring-2 ring-amber-400 bg-amber-50/20",
        emptyText: "No tasks to do",
        icon: (
            <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        ),
    },
    pending: {
        label: "Pending",
        badge: "bg-purple-50 text-purple-800 border border-purple-200",
        countBadge: "bg-purple-100 text-purple-900",
        dropHighlight: "ring-2 ring-purple-400 bg-purple-50/20",
        emptyText: "No pending tasks",
        icon: (
            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    ongoing: {
        label: "Ongoing",
        badge: "bg-sky-50 text-sky-800 border border-sky-200",
        countBadge: "bg-sky-100 text-sky-900",
        dropHighlight: "ring-2 ring-sky-400 bg-sky-50/20",
        emptyText: "Nothing in progress",
        icon: (
            <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    completed: {
        label: "Completed",
        badge: "bg-green-50 text-green-800 border border-green-200",
        countBadge: "bg-green-100 text-green-900",
        dropHighlight: "ring-2 ring-green-400 bg-green-50/20",
        emptyText: "No completed tasks",
        icon: (
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
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
        flex flex-col rounded-2xl bg-white border border-gray-200 shadow-xs
        min-h-[500px] transition-all duration-200 overflow-hidden
        ${isOver ? config.dropHighlight : ""}
      `}
        >
            {/* Column Header */}
            <div className="p-3.5 px-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md flex items-center justify-center bg-white border border-gray-200 shadow-2xs">
                        {config.icon}
                    </span>
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        {config.label}
                    </h2>
                </div>

                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md min-w-[20px] text-center ${config.countBadge}`}
                    >
                        {tasks.length}
                    </span>

                    {/* Clear completed button */}
                    {isCompleted && tasks.length > 0 && onClearCompleted && (
                        <button
                            onClick={onClearCompleted}
                            title="Clear all completed tasks"
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md
                              bg-red-50 text-red-700 hover:bg-red-100 border border-red-200
                              transition-all duration-150 flex items-center gap-1 active:scale-95"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Task Cards Container */}
            <div
                ref={setNodeRef}
                className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)]"
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
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
                            <p className="text-xs font-medium">
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
