// ─── Task Model ─────────────────────────────────────────

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },

        status: {
            type: String,
            required: true,
            enum: {
                values: ["todo", "pending", "ongoing", "completed"],
                message: "{VALUE} is not a valid status",
            },
            default: "todo",
        },

        priority: {
            type: String,
            enum: {
                values: ["low", "medium", "high"],
                message: "{VALUE} is not a valid priority",
            },
            default: "medium",
        },

        position: {
            type: Number,
            required: true,
            default: 0,
        },

        taskDate: {
            type: String,
            required: true,
            // Format: "YYYY-MM-DD"
        },

        estimatedTime: {
            type: Number,
            default: 0,
            min: 0,
            // Estimated duration in hours (e.g. 0.5, 1, 2)
        },

        totalTimeSpent: {
            type: Number,
            default: 0,
            min: 0,
            // Accumulated seconds spent in Ongoing
        },

        lastTimerStart: {
            type: Date,
            default: null,
            // Server-side crash recovery timestamp
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for the primary board-load query
taskSchema.index({ userId: 1, taskDate: 1, status: 1, position: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
