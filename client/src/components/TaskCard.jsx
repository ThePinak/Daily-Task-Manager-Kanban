// ─── TaskCard Component ─────────────────────────────────
// Apple-inspired frosted glass draggable card with timer & navigation.

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTimer } from "../hooks/useTimer.js";

// Status order for move navigation
const STATUSES = ["todo", "pending", "ongoing", "completed"];
const STATUS_LABELS = { todo: "Todo", pending: "Pending", ongoing: "Ongoing", completed: "Done" };

const PRIORITY_CONFIG = {
    high: {
        dot: "bg-rose-500",
        badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        label: "High",
    },
    medium: {
        dot: "bg-amber-500",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        label: "Medium",
    },
    low: {
        dot: "bg-emerald-500",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        label: "Low",
    },
};

// Format seconds to HH:MM:SS or MM:SS
function formatSeconds(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// Format hours for display
function formatHours(hours) {
    if (!hours) return null;
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours}h`;
}

function TaskCard({ task, isCompleted = false, isOngoing = false, onComplete, onDelete, onMoveTask }) {
    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
    const estimatedDisplay = formatHours(task.estimatedTime);

    // Timer — only active for Ongoing tasks
    const { elapsed, isRunning, start, pause, stop } = useTimer(
        task._id,
        task.totalTimeSpent || 0
    );

    // Remaining time (estimated in hours → seconds, minus elapsed)
    const estimatedSeconds = (task.estimatedTime || 0) * 3600;
    const remaining = Math.max(0, estimatedSeconds - elapsed);

    // Handle Complete button
    const handleComplete = async () => {
        await stop();
        if (onComplete) onComplete(task._id);
    };

    // Move navigation
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
        group relative rounded-2xl p-4 transition-all duration-200 select-none
        ${isDragging
                    ? "opacity-50 shadow-2xl scale-[1.03] z-50 ring-2 ring-brand-500 bg-white dark:bg-slate-800"
                    : isOngoing && isRunning
                        ? "bg-white dark:bg-slate-800/90 border border-sky-400/60 shadow-md shadow-sky-500/10 ring-2 ring-sky-400/20"
                        : isCompleted
                            ? "bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 opacity-75"
                            : "bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md cursor-grab active:cursor-grabbing"
                }
      `}
        >
            {/* Delete button — Todo/Pending only */}
            {!isCompleted && !isOngoing && onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    title="Delete task"
                    className="absolute top-3.5 right-3.5 p-1 rounded-lg
                      opacity-0 group-hover:opacity-100
                      text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10
                      transition-all duration-150"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}

            {/* Top row: priority + estimated time */}
            <div className="flex items-center justify-between mb-2">
                <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${priority.badge}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                    {priority.label}
                </span>

                {estimatedDisplay && !isOngoing && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {estimatedDisplay}
                    </span>
                )}

                {/* Running indicator pulse */}
                {isOngoing && isRunning && (
                    <span className="flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        Focusing
                    </span>
                )}
            </div>

            {/* Title */}
            <h3
                className={`text-xs font-bold leading-snug mb-1 text-slate-800 dark:text-white ${
                    isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""
                }`}
            >
                {task.title}
            </h3>

            {/* Description */}
            {task.description && (
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                    {task.description}
                </p>
            )}

            {/* ─── Timer Section (Ongoing only) ──────────── */}
            {isOngoing && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    {/* Time display grid */}
                    <div className="grid grid-cols-3 gap-2 mb-2.5 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl">
                        {/* Estimated */}
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-semibold">Est.</p>
                            <p className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
                                {estimatedSeconds > 0 ? formatSeconds(estimatedSeconds) : "—"}
                            </p>
                        </div>

                        {/* Spent */}
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-semibold">Spent</p>
                            <p className={`text-[11px] font-mono font-bold ${isRunning ? "text-sky-600 dark:text-sky-400" : "text-slate-700 dark:text-slate-200"}`}>
                                {formatSeconds(elapsed)}
                            </p>
                        </div>

                        {/* Remaining */}
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-semibold">Left</p>
                            <p className={`text-[11px] font-mono font-bold ${remaining === 0 && estimatedSeconds > 0 ? "text-rose-500" : "text-slate-600 dark:text-slate-300"}`}>
                                {estimatedSeconds > 0 ? formatSeconds(remaining) : "—"}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {estimatedSeconds > 0 && (
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                    elapsed >= estimatedSeconds ? "bg-rose-500" : "bg-sky-500"
                                }`}
                                style={{ width: `${Math.min(100, (elapsed / estimatedSeconds) * 100)}%` }}
                            />
                        </div>
                    )}

                    {/* Timer controls */}
                    <div className="flex items-center gap-2">
                        {!isRunning ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); start(); }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex-1 text-xs font-semibold py-1.5 px-3 rounded-xl
                                  bg-sky-50 hover:bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:hover:bg-sky-500/25 dark:text-sky-400 transition-all active:scale-95"
                            >
                                {elapsed > task.totalTimeSpent ? "▶ Resume" : "▶ Start"}
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); pause(); }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex-1 text-xs font-semibold py-1.5 px-3 rounded-xl
                                  bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:text-amber-400 transition-all active:scale-95"
                            >
                                ⏸ Pause
                            </button>
                        )}

                        <button
                            onClick={(e) => { e.stopPropagation(); handleComplete(); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="text-xs font-semibold py-1.5 px-3.5 rounded-xl
                              bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            ✓ Done
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Time spent (non-Ongoing, non-timer view) ── */}
            {!isOngoing && task.totalTimeSpent > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <svg className="w-3 h-3 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatSeconds(task.totalTimeSpent)} tracked
                    </span>
                </div>
            )}

            {/* ─── Move Navigation Buttons ─── */}
            {!isCompleted && onMoveTask && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                        onClick={(e) => { e.stopPropagation(); if (prevStatus) onMoveTask(task._id, prevStatus); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        disabled={!canMoveLeft}
                        title={prevStatus ? `Move to ${STATUS_LABELS[prevStatus]}` : ""}
                        className={`p-1 rounded-lg transition-all ${
                            canMoveLeft
                                ? "text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90"
                                : "text-slate-200 dark:text-slate-700 cursor-not-allowed"
                        }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                        {STATUS_LABELS[task.status]}
                    </span>

                    <button
                        onClick={(e) => { e.stopPropagation(); if (nextStatus) onMoveTask(task._id, nextStatus); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        disabled={!canMoveRight}
                        title={nextStatus ? `Move to ${STATUS_LABELS[nextStatus]}` : ""}
                        className={`p-1 rounded-lg transition-all ${
                            canMoveRight
                                ? "text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90"
                                : "text-slate-200 dark:text-slate-700 cursor-not-allowed"
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
