// ─── FocusTimer Component ──────────────────────────────
// Pure White Apple-style Minimalist Focus Timer. Zero emojis, high contrast.

import React, { useState, useEffect } from "react";

function formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusTimer({ tasks = [], onCompleteTask }) {
    const focusableTasks = tasks.filter((t) => t.status === "ongoing" || t.status === "pending" || t.status === "todo");
    const [selectedTaskId, setSelectedTaskId] = useState(() => focusableTasks[0]?._id || "");
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("pomodoro");

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
            <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
                {/* Task selector */}
                <div className="mb-6 max-w-sm mx-auto">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Active Task
                    </label>
                    {focusableTasks.length > 0 ? (
                        <select
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:border-brand-500 transition-all cursor-pointer"
                        >
                            {focusableTasks.map((t) => (
                                <option key={t._id} value={t._id}>
                                    {t.title} ({t.priority})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="text-xs text-gray-400 bg-gray-50 py-2 px-3 rounded-lg border border-gray-200">
                            All tasks completed. Add tasks to start focus.
                        </div>
                    )}
                </div>

                {/* Preset Chips */}
                <div className="flex justify-center gap-2 mb-8">
                    {[15, 25, 45, 60].map((mins) => (
                        <button
                            key={mins}
                            onClick={() => setPreset(mins)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                mode === "pomodoro" && timeLeft === mins * 60
                                    ? "bg-brand-500 text-white shadow-2xs"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            mode === "stopwatch"
                                ? "bg-brand-500 text-white shadow-2xs"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        Count Up
                    </button>
                </div>

                {/* Digital Display */}
                <div className="text-7xl sm:text-8xl font-bold tracking-tighter text-gray-950 font-mono my-6 select-none">
                    {formatSeconds(timeLeft)}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`px-8 py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow-xs active:scale-95 flex items-center gap-2 ${
                            isRunning
                                ? "bg-amber-600 hover:bg-amber-700 text-white"
                                : "bg-brand-500 hover:bg-brand-600 text-white"
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
                        className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Complete Task button if task selected */}
                {currentTask && onCompleteTask && (
                    <div className="mt-8 pt-5 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={() => onCompleteTask(currentTask._id)}
                            className="text-xs text-green-700 hover:bg-green-50 px-3.5 py-1.5 rounded-lg border border-green-200 transition-all font-semibold flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Mark "{currentTask.title}" as Completed
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
