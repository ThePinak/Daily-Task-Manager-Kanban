// ─── FocusTimer Component ──────────────────────────────
// Apple-style minimalist focus and pomodoro timer for active tasks.

import React, { useState, useEffect } from "react";

function formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusTimer({ tasks = [], onCompleteTask }) {
    const focusableTasks = tasks.filter((t) => t.status === "ongoing" || t.status === "pending" || t.status === "todo");
    const [selectedTaskId, setSelectedTaskId] = useState(() => focusableTasks[0]?._id || "");
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min default pomodoro
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("pomodoro"); // pomodoro (countdown) or stopwatch (count up)

    const currentTask = tasks.find((t) => t._id === selectedTaskId);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (mode === "pomodoro") {
                        if (prev <= 1) {
                            setIsRunning(false);
                            return 0;
                        }
                        return prev - 1;
                    } else {
                        return prev + 1;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, mode]);

    const setPreset = (minutes) => {
        setIsRunning(false);
        setMode("pomodoro");
        setTimeLeft(minutes * 60);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(25 * 60);
        setMode("pomodoro");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Task selector */}
                <div className="mb-6 max-w-sm mx-auto">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Focusing on
                    </label>
                    {focusableTasks.length > 0 ? (
                        <select
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/30 transition-all cursor-pointer"
                        >
                            {focusableTasks.map((t) => (
                                <option key={t._id} value={t._id}>
                                    {t.status === "ongoing" ? "🔄 " : "📋 "} {t.title} ({t.priority})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/50 py-2 px-3 rounded-xl">
                            All tasks completed! Add new tasks in the board.
                        </div>
                    )}
                </div>

                {/* Preset Chips */}
                <div className="flex justify-center gap-2 mb-8">
                    {[15, 25, 45, 60].map((mins) => (
                        <button
                            key={mins}
                            onClick={() => setPreset(mins)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                mode === "pomodoro" && timeLeft === mins * 60
                                    ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            }`}
                        >
                            {mins}m
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setIsRunning(false);
                            setMode("stopwatch");
                            setTimeLeft(0);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                            mode === "stopwatch"
                                ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
                                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                    >
                        ⏱ Count Up
                    </button>
                </div>

                {/* Digital Display */}
                <div className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white font-mono my-6 select-none">
                    {formatSeconds(timeLeft)}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                            isRunning
                                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                                : "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/30"
                        }`}
                    >
                        {isRunning ? (
                            <>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                                Pause
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Start Focus
                            </>
                        )}
                    </button>

                    <button
                        onClick={resetTimer}
                        title="Reset timer"
                        className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Complete Task shortcut if task selected */}
                {currentTask && onCompleteTask && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                        <button
                            onClick={() => onCompleteTask(currentTask._id)}
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5"
                        >
                            ✓ Mark "{currentTask.title}" as Completed
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
