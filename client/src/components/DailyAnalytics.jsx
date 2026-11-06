// ─── DailyAnalytics Component ───────────────────────────
// Dedicated Analytics & Progress view in Apple-inspired frosted glass aesthetic.

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
    const totalEstimatedSeconds = totalEstimatedHours * 3600;

    // Priority breakdown
    const highPriority = tasks.filter((t) => t.priority === "high");
    const mediumPriority = tasks.filter((t) => t.priority === "medium");
    const lowPriority = tasks.filter((t) => t.priority === "low");

    // Motivational state
    let motivation = {
        title: "Ready to Start?",
        desc: "Add your planned tasks in the Kanban board to kick off your day.",
        badge: "Planning Phase",
        badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
    if (totalCount > 0) {
        if (progressPercent === 100) {
            motivation = {
                title: "Fantastic Job! 🎉",
                desc: "All tasks for today are officially completed. Enjoy your evening!",
                badge: "Goal Achieved",
                badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            };
        } else if (progressPercent >= 50) {
            motivation = {
                title: "More Than Halfway There! ⚡",
                desc: "You're making great daily progress. Keep the momentum going!",
                badge: "High Velocity",
                badgeColor: "bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/20",
            };
        } else if (progressPercent > 0 || ongoingCount > 0) {
            motivation = {
                title: "In the Flow 🚀",
                desc: "Tasks are in motion. Focus on one high-impact task at a time.",
                badge: "Active Focus",
                badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
            };
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* ─── Hero Progress Card (Apple Glass) ─── */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-brand-400/20 to-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left: Progress Ring + Percentage */}
                    <div className="flex items-center gap-6">
                        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="9"
                                    className="text-slate-200 dark:text-slate-700/60"
                                    fill="transparent"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="url(#progressGradient)"
                                    strokeWidth="9"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                    fill="transparent"
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0071e3" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                                    {progressPercent}%
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                    Done
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${motivation.badgeColor}`}>
                                    {motivation.badge}
                                </span>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                {motivation.title}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm">
                                {motivation.desc}
                            </p>
                        </div>
                    </div>

                    {/* Middle: Progress stats */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Task Completion</span>
                            <span className="font-semibold text-slate-800 dark:text-white">
                                {completedCount} of {totalCount} completed
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-3 overflow-hidden p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-brand-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-400">
                            <span>{totalCount - completedCount} tasks remaining</span>
                            <span>{progressPercent}% goal reached</span>
                        </div>
                    </div>

                    {/* Right: Quick actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-center">
                        <button
                            onClick={onNavigateToBoard}
                            className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Go to Kanban Board
                        </button>
                        {completedCount > 0 && onClearCompleted && (
                            <button
                                onClick={onClearCompleted}
                                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                            >
                                Clear Completed Tasks
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Apple Metric Tiles (4-Column) ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Time Spent */}
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-sky-500 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                        {formatSeconds(totalSecondsSpent)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Total Time Tracked
                    </div>
                    <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-2">
                        {totalEstimatedHours > 0 ? `Est. ${formatHours(totalEstimatedHours)} total` : "Live timer tracking"}
                    </div>
                </div>

                {/* In Progress */}
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-500 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        {ongoingCount}
                        {ongoingCount > 0 && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Ongoing Tasks
                    </div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                        {ongoingCount === 1 ? "1 active in focus" : `${ongoingCount} active now`}
                    </div>
                </div>

                {/* Pending Backlog */}
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-500 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                        {todoCount + pendingCount}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Backlog Queued
                    </div>
                    <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-2">
                        {todoCount} Todo · {pendingCount} Pending
                    </div>
                </div>

                {/* Completion Metric */}
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                        {completedCount}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Completed Today
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                        {progressPercent}% success rate
                    </div>
                </div>
            </div>

            {/* ─── Distribution & Priorities Breakdown ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="glass-card rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <span>Workflow Stage Breakdown</span>
                    </h3>

                    {/* Multi-segment stacked bar */}
                    {totalCount > 0 ? (
                        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700/50 mb-4">
                            <div style={{ width: `${(todoCount / totalCount) * 100}%` }} className="bg-amber-400 transition-all" title="Todo" />
                            <div style={{ width: `${(pendingCount / totalCount) * 100}%` }} className="bg-violet-400 transition-all" title="Pending" />
                            <div style={{ width: `${(ongoingCount / totalCount) * 100}%` }} className="bg-sky-400 transition-all" title="Ongoing" />
                            <div style={{ width: `${(completedCount / totalCount) * 100}%` }} className="bg-emerald-400 transition-all" title="Completed" />
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-white">To Do</div>
                                <div className="text-[11px] text-slate-500">{todoCount} tasks</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                            <div className="w-3 h-3 rounded-full bg-violet-400" />
                            <div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-white">Pending</div>
                                <div className="text-[11px] text-slate-500">{pendingCount} tasks</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                            <div className="w-3 h-3 rounded-full bg-sky-400" />
                            <div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-white">Ongoing</div>
                                <div className="text-[11px] text-slate-500">{ongoingCount} tasks</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            <div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-white">Completed</div>
                                <div className="text-[11px] text-slate-500">{completedCount} tasks</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Breakdown */}
                <div className="glass-card rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                        Tasks by Priority Level
                    </h3>

                    <div className="space-y-3">
                        {/* High */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span className="text-xs font-bold text-slate-800 dark:text-white">High Priority</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    {highPriority.length} tasks
                                </span>
                                <span className="text-slate-400">
                                    ({highPriority.filter((t) => t.status === "completed").length} done)
                                </span>
                            </div>
                        </div>

                        {/* Medium */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <span className="text-xs font-bold text-slate-800 dark:text-white">Medium Priority</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    {mediumPriority.length} tasks
                                </span>
                                <span className="text-slate-400">
                                    ({mediumPriority.filter((t) => t.status === "completed").length} done)
                                </span>
                            </div>
                        </div>

                        {/* Low */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-slate-800 dark:text-white">Low Priority</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {lowPriority.length} tasks
                                </span>
                                <span className="text-slate-400">
                                    ({lowPriority.filter((t) => t.status === "completed").length} done)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Completed Tasks Journal ─── */}
            <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span>Completed Tasks Journal</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            {completedCount}
                        </span>
                    </h3>
                </div>

                {completedTasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <div className="text-3xl mb-2">🌱</div>
                        <p className="text-xs">No tasks completed yet today. Move tasks to Completed on the board!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {completedTasks.map((t) => (
                            <div key={t._id} className="py-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-slate-800 dark:text-white line-through opacity-80">
                                            {t.title}
                                        </div>
                                        {t.description && (
                                            <div className="text-[11px] text-slate-400 truncate max-w-md">
                                                {t.description}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {t.totalTimeSpent > 0 && (
                                        <span className="text-[11px] text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded-md font-medium">
                                            ⏱ {formatSeconds(t.totalTimeSpent)}
                                        </span>
                                    )}
                                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500">
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
