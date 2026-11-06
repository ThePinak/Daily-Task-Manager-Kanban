// ─── AddTaskForm Component ──────────────────────────────
// Apple-style frosted task creation form with quick presets.

import React, { useState } from "react";

function AddTaskForm({ onAdd }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [estimatedTime, setEstimatedTime] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onAdd({
                title: title.trim(),
                description: description.trim(),
                priority,
                estimatedTime: estimatedTime || 0,
            });
            // Reset form
            setTitle("");
            setDescription("");
            setPriority("medium");
            setEstimatedTime("");
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to add task:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700
                  text-xs font-semibold text-slate-500 hover:text-brand-500 hover:border-brand-500/50 hover:bg-brand-500/5
                  transition-all duration-200 flex items-center justify-center gap-2 active:scale-98"
            >
                <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Task
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-brand-500/30 bg-white dark:bg-slate-800 p-4 space-y-3 shadow-lg shadow-brand-500/5"
        >
            {/* Title */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                maxLength={100}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2
                  text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 outline-none
                  focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />

            {/* Description */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details or notes (optional)..."
                rows={2}
                maxLength={500}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2
                  text-xs text-slate-600 dark:text-slate-300 placeholder-slate-400 outline-none resize-none
                  focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />

            {/* Priority & Presets */}
            <div className="flex items-center gap-2">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5
                      text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none
                      focus:border-brand-500 transition-all cursor-pointer"
                >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                </select>
            </div>

            {/* Duration preset buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Time:</span>
                {[
                    { label: "30m", value: 0.5 },
                    { label: "1h", value: 1 },
                    { label: "2h", value: 2 },
                    { label: "4h", value: 4 },
                ].map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                            setEstimatedTime((prev) => (prev === opt.value ? "" : opt.value))
                        }
                        className={`flex-1 text-[11px] font-semibold py-1 rounded-lg border transition-all ${
                            estimatedTime === opt.value
                                ? "bg-brand-500 text-white border-brand-500 shadow-xs"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1.5">
                <button
                    type="submit"
                    disabled={!title.trim() || loading}
                    className="flex-1 text-xs font-bold py-2 px-3 rounded-xl
                      bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-sm shadow-brand-500/25
                      disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
                >
                    {loading ? "Adding..." : "Add Task"}
                </button>
                <button
                    type="button"
                    onClick={() => { setIsOpen(false); setTitle(""); setDescription(""); }}
                    className="text-xs font-semibold py-2 px-3 rounded-xl
                      bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all active:scale-98"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default AddTaskForm;
