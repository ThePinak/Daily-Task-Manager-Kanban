// ─── AddTaskForm Component ──────────────────────────────
// Inline form at the top of the Todo column to create tasks.

import { useState } from "react";

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
                className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-surface-600
          text-sm text-gray-400 hover:text-gray-200 hover:border-brand-500/50 hover:bg-surface-800/60
          transition-all duration-200 flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Task
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-brand-500/30 bg-surface-800 p-4 space-y-3 shadow-lg shadow-brand-500/5"
        >
            {/* Title */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                autoFocus
                maxLength={100}
                className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2
          text-sm text-gray-100 placeholder-gray-500 outline-none
          focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
            />

            {/* Description */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                maxLength={500}
                className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2
          text-xs text-gray-300 placeholder-gray-500 outline-none resize-none
          focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
            />

            {/* Priority select */}
            <div className="flex gap-2">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex-1 bg-surface-700 border border-surface-600 rounded-lg px-3 py-1.5
            text-xs text-gray-300 outline-none
            focus:border-brand-500/50 transition-all cursor-pointer"
                >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                </select>
            </div>

            {/* Duration preset buttons */}
            <div className="flex gap-2">
                <span className="text-[11px] text-gray-500 self-center mr-0.5">Duration</span>
                {[
                    { label: "30m", value: 0.5 },
                    { label: "1h", value: 1 },
                    { label: "2h", value: 2 },
                ].map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                            setEstimatedTime((prev) =>
                                prev === opt.value ? "" : opt.value
                            )
                        }
                        className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg border transition-all
                ${estimatedTime === opt.value
                                ? "bg-brand-600/20 border-brand-500/50 text-brand-400"
                                : "bg-surface-700 border-surface-600 text-gray-400 hover:text-gray-200 hover:border-surface-500"
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
                <button
                    type="submit"
                    disabled={!title.trim() || loading}
                    className="flex-1 text-xs font-medium py-2 px-3 rounded-lg
            bg-brand-600 text-white hover:bg-brand-700 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? "Adding..." : "Add Task"}
                </button>
                <button
                    type="button"
                    onClick={() => { setIsOpen(false); setTitle(""); setDescription(""); }}
                    className="text-xs font-medium py-2 px-3 rounded-lg
            bg-surface-700 text-gray-400 hover:text-gray-200 hover:bg-surface-600 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default AddTaskForm;
