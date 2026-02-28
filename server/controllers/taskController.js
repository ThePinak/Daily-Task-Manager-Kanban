// ─── Task Controller ────────────────────────────────────

import Task from "../models/Task.js";

// Helper: get today's date as "YYYY-MM-DD" in local timezone
const getTodayDate = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// ─────────────────────────────────────────────────────────
// POST /api/tasks — Create a new task
// ─────────────────────────────────────────────────────────
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, estimatedTime } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        const taskDate = getTodayDate();

        // Calculate position: place new task at the bottom of the Todo column
        const lastTask = await Task.findOne({
            userId: req.userId,
            taskDate,
            status: "todo",
        }).sort({ position: -1 });

        const position = lastTask ? lastTask.position + 1 : 0;

        const task = await Task.create({
            userId: req.userId,
            title: title.trim(),
            description: description?.trim() || "",
            priority: priority || "medium",
            estimatedTime: estimatedTime || 0,
            status: "todo",
            taskDate,
            position,
        });

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", "),
            });
        }

        console.error("Create task error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while creating task",
        });
    }
};

// ─────────────────────────────────────────────────────────
// GET /api/tasks/today — Get all of today's tasks for user
// ─────────────────────────────────────────────────────────
export const getTodayTasks = async (req, res) => {
    try {
        const taskDate = getTodayDate();

        const tasks = await Task.find({
            userId: req.userId,
            taskDate,
        }).sort({ status: 1, position: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        console.error("Get today tasks error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while fetching tasks",
        });
    }
};

// ─────────────────────────────────────────────────────────
// PUT /api/tasks/:id — Update task details
// (title, description, priority, estimatedTime)
// ─────────────────────────────────────────────────────────
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, estimatedTime } = req.body;

        const task = await Task.findOne({ _id: id, userId: req.userId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        // Update only provided fields
        if (title !== undefined) {
            if (title.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Task title cannot be empty",
                });
            }
            task.title = title.trim();
        }
        if (description !== undefined) task.description = description.trim();
        if (priority !== undefined) task.priority = priority;
        if (estimatedTime !== undefined) task.estimatedTime = estimatedTime;

        await task.save();

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", "),
            });
        }

        console.error("Update task error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while updating task",
        });
    }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/tasks/:id/move — Drag-and-drop: move task
// between columns and/or to a new position
//
// Body: { status: "ongoing", position: 2 }
//   - status:   the target column
//   - position: the desired index in the target column
// ─────────────────────────────────────────────────────────
export const moveTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, position } = req.body;

        const validStatuses = ["todo", "pending", "ongoing", "completed"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
        }

        if (position === undefined || position === null || position < 0) {
            return res.status(400).json({
                success: false,
                message: "Position is required and must be >= 0",
            });
        }

        const task = await Task.findOne({ _id: id, userId: req.userId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const oldStatus = task.status;
        const oldPosition = task.position;
        const taskDate = task.taskDate;
        const isCrossColumn = oldStatus !== status;

        if (isCrossColumn) {
            // ── CROSS-COLUMN MOVE ──────────────────────────

            // 1. Close the gap in the SOURCE column:
            //    All tasks below the old position shift up by 1
            await Task.updateMany(
                {
                    userId: req.userId,
                    taskDate,
                    status: oldStatus,
                    position: { $gt: oldPosition },
                },
                { $inc: { position: -1 } }
            );

            // 2. Make room in the DESTINATION column:
            //    All tasks at or below the target position shift down by 1
            await Task.updateMany(
                {
                    userId: req.userId,
                    taskDate,
                    status,
                    position: { $gte: position },
                },
                { $inc: { position: 1 } }
            );

            // 3. Update the moved task
            task.status = status;
            task.position = position;
        } else {
            // ── SAME-COLUMN REPOSITION ─────────────────────

            if (oldPosition === position) {
                // No change needed
                return res.status(200).json({ success: true, data: task });
            }

            if (oldPosition < position) {
                // Moving DOWN: shift tasks between (old, new] up by 1
                await Task.updateMany(
                    {
                        userId: req.userId,
                        taskDate,
                        status,
                        position: { $gt: oldPosition, $lte: position },
                    },
                    { $inc: { position: -1 } }
                );
            } else {
                // Moving UP: shift tasks between [new, old) down by 1
                await Task.updateMany(
                    {
                        userId: req.userId,
                        taskDate,
                        status,
                        position: { $gte: position, $lt: oldPosition },
                    },
                    { $inc: { position: 1 } }
                );
            }

            task.position = position;
        }

        await task.save();

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error("Move task error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while moving task",
        });
    }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/tasks/reorder — Bulk-update positions
// within a single column (used after drag-and-drop)
//
// Body: { status: "todo", orderedIds: ["id1", "id2", "id3"] }
//   - status:     the column being reordered
//   - orderedIds: array of task _id strings in the new order
// ─────────────────────────────────────────────────────────
export const reorderTasks = async (req, res) => {
    try {
        const { status, orderedIds } = req.body;

        const validStatuses = ["todo", "pending", "ongoing", "completed"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
        }

        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "orderedIds must be a non-empty array of task IDs",
            });
        }

        // Build bulk write operations: set position = array index
        const bulkOps = orderedIds.map((taskId, index) => ({
            updateOne: {
                filter: { _id: taskId, userId: req.userId, status },
                update: { $set: { position: index } },
            },
        }));

        const result = await Task.bulkWrite(bulkOps);

        res.status(200).json({
            success: true,
            message: `Reordered ${result.modifiedCount} tasks`,
        });
    } catch (error) {
        console.error("Reorder tasks error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while reordering tasks",
        });
    }
};

// ─────────────────────────────────────────────────────────
// DELETE /api/tasks/completed — Delete all completed tasks
// ─────────────────────────────────────────────────────────
export const deleteCompletedTasks = async (req, res) => {
    try {
        const result = await Task.deleteMany({
            userId: req.userId,
            status: "completed",
        });

        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} completed task(s)`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Delete completed tasks error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while deleting completed tasks",
        });
    }
};

// ─────────────────────────────────────────────────────────
// DELETE /api/tasks/:id — Delete a task
// ─────────────────────────────────────────────────────────
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Delete task error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while deleting task",
        });
    }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/tasks/:id/time — Update time spent on a task
// Uses atomic $inc to safely accumulate seconds.
//
// Body: { additionalSeconds: 300, timerRunning: false }
//   - additionalSeconds: seconds to add to totalTimeSpent
//   - timerRunning: if true, set lastTimerStart to now
//                   if false, set lastTimerStart to null
// ─────────────────────────────────────────────────────────
export const updateTimeSpent = async (req, res) => {
    try {
        const { id } = req.params;
        const { additionalSeconds, timerRunning } = req.body;

        if (additionalSeconds === undefined || additionalSeconds < 0) {
            return res.status(400).json({
                success: false,
                message: "additionalSeconds is required and must be >= 0",
            });
        }

        const update = {
            $inc: { totalTimeSpent: Math.round(additionalSeconds) },
        };

        // Track whether timer is actively running (for crash recovery)
        if (timerRunning) {
            update.$set = { lastTimerStart: new Date() };
        } else {
            update.$set = { lastTimerStart: null };
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.userId },
            update,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error("Update time error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while updating time",
        });
    }
};
