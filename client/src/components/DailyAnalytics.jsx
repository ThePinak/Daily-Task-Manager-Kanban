// ─── DailyAnalytics Component ───────────────────────────
// Apple-style Analytics & Progress view in Pure White theme. Zero emojis, high contrast.

import React from "react";

function formatSeconds(totalSeconds) {
    if (!totalSeconds || totalSeconds <= 0) return "0m";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
}

function formatHours(hours) {
    if (!hours || hours <= 0) return "0h";
    return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export default function DailyAnalytics({ tasks = [], onClearCompleted, onNavigateToBoard }) {
    const totalCount = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed");
    const completedCount = completedTasks.length;
    const ongoingTasks = tasks.filter((t) => t.status === "ongoing");
    const ongoingCount = ongoingTasks.length;
    const pendingTasks = tasks.filter((t) => t.status === "pending");
    const pendingCount = pendingTasks.length;
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const todoCount = todoTasks.length;

    const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    const totalSecondsSpent = tasks.reduce((acc, t) => acc + (t.totalTimeSpent || 0), 0);
    const totalEstimatedHours = tasks.reduce((acc, t) => acc + (t.estimatedTime || 0), 0);

    // Priority breakdown
    const highPriority = tasks.filter((t) => t.priority === "high");
    const mediumPriority = tasks.filter((t) => t.priority === "medium");
    const lowPriority = tasks.filter((t) => t.priority === "low");

    // Motivational state (Zero emojis)
    let motivation = {
        title: "Ready to Plan",
        desc: "Add your planned tasks in the Kanban board to organize your day.",
        badge: "Planning Phase",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    };
    if (totalCount > 0) {
        if (progressPercent === 100) {
            motivation = {
                title: "Goal Completed",
                desc: "All planned tasks for today have been completed.",
                badge: "All Tasks Finished",
                badgeColor: "bg-green-50 text-green-800 border-green-200",
            };
        } else if (progressPercent >= 50) {
            motivation = {
                title: "Strong Momentum",
                desc: "More than half of your daily tasks are completed.",
                badge: "Over Halfway",
                badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
            };
        } else if (progressPercent > 0 || ongoingCount > 0) {
            motivation = {
                title: "Work in Progress",
                desc: "Tasks are currently active and being tracked.",
                badge: "Active Focus",
                badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
            };
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* ─── Hero Progress Card (Pure White) ─── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left: Radial Progress Ring */}
                    <div className="flex items-center gap-5">
                        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="#f3f4f6"
                                    strokeWidth="8"
                                    fill="transparent"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="#0071e3"
                                    strokeWidth="8"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-700 ease-out"
                                    fill="transparent"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-xl font-bold tracking-tight text-gray-950 font-mono">
                                    {progressPercent}%
                                </span>
                                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                                    Done
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${motivation.badgeColor} mb-1`}>
                                {motivation.badge}
                            </span>
                            <h2 className="text-base font-bold text-gray-950 tracking-tight">
                                {motivation.title}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5 max-w-sm">
                                {motivation.desc}
                            </p>
                        </div>
                    </div>

                    {/* Middle: Progress stats */}
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Daily Completion</span>
                            <span className="font-semibold text-gray-950">
                                {completedCount} of {totalCount} completed
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-gray-400">
                            <span>{totalCount - completedCount} tasks remaining</span>
                            <span>{progressPercent}% rate</span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-center">
                        <button
                            onClick={onNavigateToBoard}
                            className="w-full py-2 px-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            Open Kanban Board
                        </button>
                        {completedCount > 0 && onClearCompleted && (
                            <button
                                onClick={onClearCompleted}
                                className="w-full py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98"
                            >
                                Clear Completed Tasks
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Metric Tiles (Pure White) ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Time Tracked */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mb-2.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-gray-950 font-mono tracking-tight">
                        {formatSeconds(totalSecondsSpent)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        Time Tracked
                    </div>
                    <div className="text-[11px] text-sky-700 font-medium mt-1.5">
                        {totalEstimatedHours > 0 ? `Est. ${formatHours(totalEstimatedHours)} total` : "Live timer"}
                    </div>
                </div>

                {/* Ongoing */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mb-2.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-gray-950 font-mono tracking-tight">
                        {ongoingCount}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        In Progress
                    </div>
                    <div className="text-[11px] text-purple-700 font-medium mt-1.5">
                        {ongoingCount === 1 ? "1 active task" : `${ongoingCount} active tasks`}
                    </div>
                </div>

                {/* Backlog */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-2.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-gray-950 font-mono tracking-tight">
                        {todoCount + pendingCount}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        Backlog Queued
                    </div>
                    <div className="text-[11px] text-amber-800 font-medium mt-1.5">
                        {todoCount} To Do · {pendingCount} Pending
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 border border-green-200 flex items-center justify-center mb-2.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-gray-950 font-mono tracking-tight">
                        {completedCount}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        Completed Today
                    </div>
                    <div className="text-[11px] text-green-700 font-medium mt-1.5">
                        {progressPercent}% success rate
                    </div>
                </div>
            </div>

            {/* ─── Breakdown Columns ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Status Breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider mb-3">
                        Workflow Stage Breakdown
                    </h3>

                    {totalCount > 0 && (
                        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-100 mb-3.5">
                            <div style={{ width: `${(todoCount / totalCount) * 100}%` }} className="bg-amber-400" title="To Do" />
                            <div style={{ width: `${(pendingCount / totalCount) * 100}%` }} className="bg-purple-400" title="Pending" />
                            <div style={{ width: `${(ongoingCount / totalCount) * 100}%` }} className="bg-sky-400" title="Ongoing" />
                            <div style={{ width: `${(completedCount / totalCount) * 100}%` }} className="bg-green-500" title="Completed" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <div>
                                <div className="text-xs font-semibold text-gray-900">To Do</div>
                                <div className="text-[11px] text-gray-500">{todoCount} tasks</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                            <div>
                                <div className="text-xs font-semibold text-gray-900">Pending</div>
                                <div className="text-[11px] text-gray-500">{pendingCount} tasks</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                            <div>
                                <div className="text-xs font-semibold text-gray-900">Ongoing</div>
                                <div className="text-[11px] text-gray-500">{ongoingCount} tasks</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <div>
                                <div className="text-xs font-semibold text-gray-900">Completed</div>
                                <div className="text-[11px] text-gray-500">{completedCount} tasks</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider mb-3">
                        Priority Level Summary
                    </h3>

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/50 border border-red-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs font-semibold text-red-900">High Priority</span>
                            </div>
                            <span className="text-xs font-bold text-red-700">
                                {highPriority.length} tasks
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs font-semibold text-amber-900">Medium Priority</span>
                            </div>
                            <span className="text-xs font-bold text-amber-700">
                                {mediumPriority.length} tasks
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50/50 border border-green-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs font-semibold text-green-900">Low Priority</span>
                            </div>
                            <span className="text-xs font-bold text-green-700">
                                {lowPriority.length} tasks
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Completed Tasks Journal ─── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
                    <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center gap-2">
                        <span>Completed Tasks Journal</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-800">
                            {completedCount}
                        </span>
                    </h3>
                </div>

                {completedTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-xs">No tasks completed yet today.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {completedTasks.map((t) => (
                            <div key={t._id} className="py-2.5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 rounded-md bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-900 line-through">
                                            {t.title}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {t.totalTimeSpent > 0 && (
                                        <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono font-medium">
                                            {formatSeconds(t.totalTimeSpent)}
                                        </span>
                                    )}
                                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                        {t.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
