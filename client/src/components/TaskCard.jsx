// ─── TaskCard Component ─────────────────────────────────
// Draggable task card with timer controls for Ongoing tasks.

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTimer } from "../hooks/useTimer.js";

const PRIORITY_CONFIG = {
    high: {
        dot: "bg-priority-high",
        badge: "bg-red-500/15 text-red-400",
        label: "High",
    },
    medium: {
        dot: "bg-priority-medium",
        badge: "bg-amber-500/15 text-amber-400",
        label: "Medium",
    },
    low: {
        dot: "bg-priority-low",
        badge: "bg-emerald-500/15 text-emerald-400",
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

// Format hours for display (estimatedTime is now in hours)
function formatHours(hours) {
    if (!hours) return null;
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours}h`;
}

function TaskCard({ task, isCompleted = false, isOngoing = false, onComplete, onDelete }) {
    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
    const estimatedDisplay = formatHours(task.estimatedTime);

    // Timer — only active for Ongoing tasks
    const { elapsed, isRunning, start, pause, stop } = useTimer(
        task._id,
        task.totalTimeSpent || 0
    );

    // Remaining time (estimated in minutes → seconds, minus elapsed)
    const estimatedSeconds = (task.estimatedTime || 0) * 3600;
    const remaining = Math.max(0, estimatedSeconds - elapsed);

    // Handle Complete button
    const handleComplete = async () => {
        await stop();
        if (onComplete) onComplete(task._id);
    };

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
        group relative rounded-xl border p-4 transition-all duration-200 select-none
        ${isDragging
                    ? "opacity-50 shadow-2xl shadow-brand-500/20 scale-[1.02] border-brand-500/50 bg-surface-700 z-50"
                    : isOngoing && isRunning
                        ? "bg-surface-800 border-ongoing/50 shadow-lg shadow-ongoing/10 ring-1 ring-ongoing/20"
                        : isCompleted
                            ? "bg-surface-800/30 border-surface-700/30 opacity-70"
                            : "bg-surface-800 border-surface-700/50 hover:border-surface-600 hover:shadow-lg hover:shadow-black/20 cursor-grab active:cursor-grabbing"
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
                      text-gray-500 hover:text-red-400 hover:bg-red-500/10
                      transition-all duration-200"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
            {/* Top row: priority + estimated time */}
            <div className="flex items-center justify-between mb-2.5">
                <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${priority.badge}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                    {priority.label}
                </span>

                {estimatedDisplay && !isOngoing && (
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {estimatedDisplay}
                    </span>
                )}

                {/* Running indicator pulse */}
                {isOngoing && isRunning && (
                    <span className="flex items-center gap-1.5 text-[11px] text-ongoing font-medium">
                        <span className="w-2 h-2 rounded-full bg-ongoing animate-pulse" />
                        Active
                    </span>
                )}
            </div>

            {/* Title */}
            <h3
                className={`text-sm font-semibold leading-snug mb-1 ${isCompleted ? "line-through text-gray-500" : "text-gray-100"
                    }`}
            >
                {task.title}
            </h3>

            {/* Description */}
            {task.description && (
                <p
                    className={`text-xs leading-relaxed ${isCompleted ? "text-gray-600" : "text-gray-400"
                        }`}
                >
                    {task.description}
                </p>
            )}

            {/* ─── Timer Section (Ongoing only) ──────────── */}
            {isOngoing && (
                <div className="mt-3 pt-3 border-t border-surface-700/50">
                    {/* Time display grid */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {/* Estimated */}
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Est.</p>
                            <p className="text-xs font-mono font-bold text-gray-400">
                                {estimatedSeconds > 0 ? formatSeconds(estimatedSeconds) : "—"}
                            </p>
                        </div>

                        {/* Spent */}
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Spent</p>
                            <p className={`text-xs font-mono font-bold ${isRunning ? "text-ongoing" : "text-gray-300"}`}>
                                {formatSeconds(elapsed)}
                            </p>
                        </div>

                        {/* Remaining */}
                        <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Left</p>
                            <p className={`text-xs font-mono font-bold ${remaining === 0 && estimatedSeconds > 0 ? "text-priority-high" : "text-gray-400"}`}>
                                {estimatedSeconds > 0 ? formatSeconds(remaining) : "—"}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {estimatedSeconds > 0 && (
                        <div className="w-full h-1 bg-surface-700 rounded-full mb-3 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${elapsed >= estimatedSeconds ? "bg-priority-high" : "bg-ongoing"
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
                                className="flex-1 text-[11px] font-medium py-1.5 px-3 rounded-lg
                  bg-ongoing/15 text-ongoing hover:bg-ongoing/25 transition-colors"
                            >
                                {elapsed > task.totalTimeSpent ? "▶ Resume" : "▶ Start"}
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); pause(); }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex-1 text-[11px] font-medium py-1.5 px-3 rounded-lg
                  bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
                            >
                                ⏸ Pause
                            </button>
                        )}

                        <button
                            onClick={(e) => { e.stopPropagation(); handleComplete(); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="text-[11px] font-medium py-1.5 px-3 rounded-lg
                bg-completed/15 text-completed hover:bg-completed/25 transition-colors"
                        >
                            ✓ Done
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Time spent (non-Ongoing, non-timer view) ── */}
            {!isOngoing && task.totalTimeSpent > 0 && (
                <div className="mt-3 pt-2.5 border-t border-surface-700/50">
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {formatSeconds(task.totalTimeSpent)} spent
                    </span>
                </div>
            )}
        </div>
    );
}

export default TaskCard;
