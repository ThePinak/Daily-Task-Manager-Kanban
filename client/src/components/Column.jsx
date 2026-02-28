// ─── Column Component ───────────────────────────────────
// Droppable column using @dnd-kit/sortable.

import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard.jsx";
import AddTaskForm from "./AddTaskForm.jsx";

const COLUMN_CONFIG = {
    todo: {
        label: "Todo",
        icon: "📋",
        accent: "border-t-todo",
        countBg: "bg-amber-500/15 text-amber-400",
        dropHighlight: "ring-todo/40",
        emptyText: "No tasks yet — add one!",
    },
    pending: {
        label: "Pending",
        icon: "⏳",
        accent: "border-t-pending",
        countBg: "bg-violet-500/15 text-violet-400",
        dropHighlight: "ring-pending/40",
        emptyText: "No pending tasks",
    },
    ongoing: {
        label: "Ongoing",
        icon: "🔄",
        accent: "border-t-ongoing",
        countBg: "bg-blue-500/15 text-blue-400",
        dropHighlight: "ring-ongoing/40",
        emptyText: "Nothing in progress",
    },
    completed: {
        label: "Completed",
        icon: "✅",
        accent: "border-t-completed",
        countBg: "bg-emerald-500/15 text-emerald-400",
        dropHighlight: "ring-completed/40",
        emptyText: "No completed tasks yet",
    },
};

function Column({ status, tasks = [], onComplete, onAddTask, onClearCompleted, onDelete }) {
    const config = COLUMN_CONFIG[status];
    const isCompleted = status === "completed";
    const isOngoing = status === "ongoing";

    // Make this column a droppable area
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${status}`,
        data: {
            type: "column",
            status,
        },
    });

    // Task IDs for SortableContext
    const taskIds = tasks.map((t) => t._id);

    return (
        <div
            className={`
        flex flex-col rounded-xl border border-surface-700/50 bg-surface-800/40
        border-t-[3px] ${config.accent} min-h-[300px]
        transition-all duration-200
        ${isOver ? `ring-2 ${config.dropHighlight} bg-surface-800/60` : ""}
      `}
        >
            {/* Column Header */}
            <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-base">{config.icon}</span>
                    <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                        {config.label}
                    </h2>
                </div>

                <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${config.countBg}`}
                >
                    {tasks.length}
                </span>

                {/* Clear completed button */}
                {isCompleted && tasks.length > 0 && onClearCompleted && (
                    <button
                        onClick={onClearCompleted}
                        title="Clear all completed tasks"
                        className="text-[11px] font-medium px-2 py-0.5 rounded-lg
                          bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:text-red-300
                          transition-all duration-200 flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear
                    </button>
                )}
            </div>

            {/* Task Cards — droppable + sortable */}
            <div
                ref={setNodeRef}
                className="flex-1 px-3 pb-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-220px)]"
            >
                {/* Add Task button — Todo column only */}
                {status === "todo" && onAddTask && (
                    <AddTaskForm onAdd={onAddTask} />
                )}

                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                isCompleted={isCompleted}
                                isOngoing={isOngoing}
                                onComplete={onComplete}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <div className="flex-1 flex items-center justify-center py-12">
                            <p className="text-xs text-gray-600 text-center">
                                {isOver ? "Drop here!" : config.emptyText}
                            </p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

export default Column;
