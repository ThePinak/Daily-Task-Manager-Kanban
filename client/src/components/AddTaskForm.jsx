// ─── AddTaskForm Component ──────────────────────────────
// Pure White Task Creation Form. Zero emojis, clean typography.

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
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-gray-300 bg-white
                  text-xs font-semibold text-gray-600 hover:text-brand-600 hover:border-brand-500 hover:bg-gray-50
                  transition-all duration-150 flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
            >
                <svg className="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Task
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white p-3.5 space-y-2.5 shadow-xs"
        >
            {/* Title */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                autoFocus
                maxLength={100}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2
                  text-xs font-medium text-gray-900 placeholder-gray-400 outline-none
                  focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />

            {/* Description */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description or notes (optional)..."
                rows={2}
                maxLength={500}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2
                  text-xs text-gray-700 placeholder-gray-400 outline-none resize-none
                  focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />

            {/* Priority & Presets (No emojis) */}
            <div className="flex items-center gap-2">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5
                      text-xs font-medium text-gray-800 outline-none
                      focus:border-brand-500 transition-all cursor-pointer"
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
            </div>

            {/* Duration presets */}
            <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mr-1">Time:</span>
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
                        className={`flex-1 text-[11px] font-semibold py-1 rounded-md border transition-all ${
                            estimatedTime === opt.value
                                ? "bg-brand-500 text-white border-brand-500 shadow-2xs"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
                <button
                    type="submit"
                    disabled={!title.trim() || loading}
                    className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg
                      bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-2xs
                      disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
                >
                    {loading ? "Adding..." : "Add Task"}
                </button>
                <button
                    type="button"
                    onClick={() => { setIsOpen(false); setTitle(""); setDescription(""); }}
                    className="text-xs font-semibold py-2 px-3 rounded-lg
                      bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all active:scale-98"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default AddTaskForm;
