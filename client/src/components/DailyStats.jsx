// ─── DailyStats Component ──────────────────────────────
// Summary bar displaying daily task progress, completion rate,
// status counts, and tracked time vs estimated time.

import React from "react";

// Helper to format seconds into readable hours and minutes
function formatTime(totalSeconds) {
    if (!totalSeconds || totalSeconds <= 0) return "0m";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (hours > 0) {
        return `${hours}h`;
    }
    return `${minutes}m`;
}

// Helper to format estimated hours
function formatHours(hours) {
    if (!hours || hours <= 0) return "0h";
    return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export default function DailyStats({ tasks = [] }) {
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const ongoingCount = tasks.filter((t) => t.status === "ongoing").length;
    const pendingCount = tasks.filter((t) => t.status === "pending").length;
    const todoCount = tasks.filter((t) => t.status === "todo").length;

    // Completion percentage
    const progressPercent =
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    // Accumulated total time spent (in seconds) across all tasks
    const totalSecondsSpent = tasks.reduce(
        (acc, t) => acc + (t.totalTimeSpent || 0),
        0
    );

    // Total estimated hours
    const totalEstimatedHours = tasks.reduce(
        (acc, t) => acc + (t.estimatedTime || 0),
        0
    );

    return (
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-4 sm:p-5 mb-6 shadow-sm">
            {/* Top row: Summary & Progress bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white tracking-wide">
                        Today's Progress
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand-500/20 text-brand-400 border border-brand-500/30">
                        {progressPercent}% Complete
                    </span>
                    {ongoingCount > 0 && (
                        <span className="flex items-center gap-1.5 text-xs text-ongoing px-2 py-0.5 rounded-full bg-ongoing/10 border border-ongoing/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-ongoing animate-pulse" />
                            {ongoingCount} in progress
                        </span>
                    )}
                </div>

                <div className="text-xs text-gray-400">
                    <span className="font-semibold text-white">{completedCount}</span> of{" "}
                    <span className="font-semibold text-white">{totalCount}</span> tasks completed
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-700 rounded-full h-2 overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Bottom row: Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {/* Status Badges summary */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-700/40 border border-surface-700">
                    <div className="w-8 h-8 rounded-lg bg-todo/15 text-todo flex items-center justify-center font-bold text-sm">
                        {todoCount}
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400 font-medium">To Do</div>
                        <div className="text-xs font-semibold text-gray-200">
                            {todoCount === 1 ? "1 task" : `${todoCount} tasks`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-700/40 border border-surface-700">
                    <div className="w-8 h-8 rounded-lg bg-pending/15 text-pending flex items-center justify-center font-bold text-sm">
                        {pendingCount}
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400 font-medium">Pending</div>
                        <div className="text-xs font-semibold text-gray-200">
                            {pendingCount === 1 ? "1 task" : `${pendingCount} tasks`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-700/40 border border-surface-700">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400 font-medium">Time Spent</div>
                        <div className="text-xs font-semibold text-gray-200">
                            {formatTime(totalSecondsSpent)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-700/40 border border-surface-700">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        {completedCount}
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400 font-medium">Completed</div>
                        <div className="text-xs font-semibold text-gray-200">
                            {totalEstimatedHours > 0
                                ? `Est. ${formatHours(totalEstimatedHours)}`
                                : `${completedCount} done`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
