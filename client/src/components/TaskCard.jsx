// ─── TaskCard Component ─────────────────────────────────
// Apple-style pure white task card. Zero emojis, high contrast, clean typography.

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTimer } from "../hooks/useTimer.js";

const STATUSES = ["todo", "pending", "ongoing", "completed"];
const STATUS_LABELS = { todo: "Todo", pending: "Pending", ongoing: "Ongoing", completed: "Done" };

const PRIORITY_CONFIG = {
    high: {
        dot: "bg-red-500",
        badge: "bg-red-50 text-red-700 border border-red-200 font-semibold",
        label: "High",
    },
    medium: {
        dot: "bg-amber-500",
        badge: "bg-amber-50 text-amber-800 border border-amber-200 font-semibold",
        label: "Medium",
    },
    low: {
        dot: "bg-green-500",
        badge: "bg-green-50 text-green-800 border border-green-200 font-semibold",
        label: "Low",
    },
};

function formatSeconds(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function formatHours(hours) {
    if (!hours) return null;
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours}h`;
}

function TaskCard({ task, isCompleted = false, isOngoing = false, onComplete, onDelete, onMoveTask }) {
    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
    const estimatedDisplay = formatHours(task.estimatedTime);

    // Timer — active for Ongoing tasks
    const { elapsed, isRunning, start, pause, stop } = useTimer(
        task._id,
        task.totalTimeSpent || 0
    );

    const estimatedSeconds = (task.estimatedTime || 0) * 3600;
    const remaining = Math.max(0, estimatedSeconds - elapsed);

    const handleComplete = async () => {
        await stop();
        if (onComplete) onComplete(task._id);
    };

    const currentIndex = STATUSES.indexOf(task.status);
    const canMoveLeft = currentIndex > 0;
    const canMoveRight = currentIndex < STATUSES.length - 1;
    const prevStatus = canMoveLeft ? STATUSES[currentIndex - 1] : null;
    const nextStatus = canMoveRight ? STATUSES[currentIndex + 1] : null;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task._id,
        data: { type: "task", task },
        disabled: isCompleted,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        group relative rounded-xl p-3.5 transition-all duration-150 select-none
        ${isDragging
                    ? "opacity-50 shadow-xl scale-[1.02] z-50 ring-2 ring-brand-500 bg-white"
                    : isOngoing && isRunning
                        ? "bg-white border-2 border-sky-500 shadow-sm"
                        : isCompleted
                            ? "bg-gray-50/80 border border-gray-200/80 opacity-70"
                            : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xs cursor-grab active:cursor-grabbing"
                }
      `}
        >
            {/* Delete button — Todo/Pending only */}
            {!isCompleted && !isOngoing && onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    title="Delete task"
                    className="absolute top-3 right-3 p-1 rounded-md
                      opacity-0 group-hover:opacity-100
                      text-gray-400 hover:text-red-600 hover:bg-red-50
                      transition-all duration-150"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}

            {/* Top row: Priority & estimated time */}
            <div className="flex items-center justify-between mb-2">
                <span
                    className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full ${priority.badge}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                    {priority.label}
                </span>

                {estimatedDisplay && !isOngoing && (
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {estimatedDisplay}
                    </span>
                )}

                {/* Active indicator */}
                {isOngoing && isRunning && (
                    <span className="flex items-center gap-1.5 text-[11px] text-sky-700 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        Active
                    </span>
                )}
            </div>

            {/* Title */}
            <h3
                className={`text-xs font-semibold leading-snug mb-1 text-gray-950 ${
                    isCompleted ? "line-through text-gray-400" : ""
                }`}
            >
                {task.title}
            </h3>

            {/* Description */}
            {task.description && (
                <p className="text-[11px] leading-relaxed text-gray-600 line-clamp-2 mb-2">
                    {task.description}
                </p>
            )}

            {/* ─── Timer Section (Ongoing only) ──────────── */}
            {isOngoing && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                    {/* Time display grid */}
                    <div className="grid grid-cols-3 gap-1.5 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <div className="text-center">
                            <p className="text-[9px] text-gray-400 font-semibold uppercase">Est.</p>
                            <p className="text-[11px] font-mono font-bold text-gray-700">
                                {estimatedSeconds > 0 ? formatSeconds(estimatedSeconds) : "—"}
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-[9px] text-gray-400 font-semibold uppercase">Spent</p>
                            <p className={`text-[11px] font-mono font-bold ${isRunning ? "text-sky-600" : "text-gray-900"}`}>
                                {formatSeconds(elapsed)}
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-[9px] text-gray-400 font-semibold uppercase">Left</p>
                            <p className={`text-[11px] font-mono font-bold ${remaining === 0 && estimatedSeconds > 0 ? "text-red-600" : "text-gray-700"}`}>
                                {estimatedSeconds > 0 ? formatSeconds(remaining) : "—"}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {estimatedSeconds > 0 && (
                        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                    elapsed >= estimatedSeconds ? "bg-red-500" : "bg-sky-500"
                                }`}
                                style={{ width: `${Math.min(100, (elapsed / estimatedSeconds) * 100)}%` }}
                            />
                        </div>
                    )}

                    {/* Timer controls (No emojis) */}
                    <div className="flex items-center gap-1.5">
                        {!isRunning ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); start(); }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg
                                  bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-all flex items-center justify-center gap-1"
                            >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                {elapsed > task.totalTimeSpent ? "Resume" : "Start"}
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); pause(); }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg
                                  bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all flex items-center justify-center gap-1"
                            >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                                Pause
                            </button>
                        )}

                        <button
                            onClick={(e) => { e.stopPropagation(); handleComplete(); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="text-xs font-semibold py-1.5 px-3 rounded-lg
                              bg-green-600 hover:bg-green-700 text-white transition-all flex items-center justify-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Time spent (non-Ongoing) */}
            {!isOngoing && task.totalTimeSpent > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                        <svg className="w-3 h-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatSeconds(task.totalTimeSpent)} tracked
                    </span>
                </div>
            )}

            {/* Move Navigation Buttons */}
            {!isCompleted && onMoveTask && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                        onClick={(e) => { e.stopPropagation(); if (prevStatus) onMoveTask(task._id, prevStatus); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        disabled={!canMoveLeft}
                        title={prevStatus ? `Move to ${STATUS_LABELS[prevStatus]}` : ""}
                        className={`p-1 rounded-md transition-all ${
                            canMoveLeft
                                ? "text-gray-400 hover:text-gray-900 hover:bg-gray-100 active:scale-90"
                                : "text-gray-200 cursor-not-allowed"
                        }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                        {STATUS_LABELS[task.status]}
                    </span>

                    <button
                        onClick={(e) => { e.stopPropagation(); if (nextStatus) onMoveTask(task._id, nextStatus); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        disabled={!canMoveRight}
                        title={nextStatus ? `Move to ${STATUS_LABELS[nextStatus]}` : ""}
                        className={`p-1 rounded-md transition-all ${
                            canMoveRight
                                ? "text-gray-400 hover:text-gray-900 hover:bg-gray-100 active:scale-90"
                                : "text-gray-200 cursor-not-allowed"
                        }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default TaskCard;
