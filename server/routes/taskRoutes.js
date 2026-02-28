// ─── Task Routes ────────────────────────────────────────

import { Router } from "express";
import {
    createTask,
    getTodayTasks,
    updateTask,
    moveTask,
    reorderTasks,
    deleteTask,
    deleteCompletedTasks,
    updateTimeSpent,
} from "../controllers/taskController.js";

const router = Router();

// POST   /api/tasks              → Create a new task
router.post("/", createTask);

// GET    /api/tasks/today         → Get all of today's tasks
router.get("/today", getTodayTasks);

// PUT    /api/tasks/:id           → Update task details
router.put("/:id", updateTask);

// PATCH  /api/tasks/reorder       → Bulk-update positions within a column
router.patch("/reorder", reorderTasks);

// PATCH  /api/tasks/:id/move      → Move task between columns (drag-and-drop)
router.patch("/:id/move", moveTask);

// PATCH  /api/tasks/:id/time      → Update time spent on a task
router.patch("/:id/time", updateTimeSpent);

// DELETE /api/tasks/completed      → Delete all completed tasks for today
router.delete("/completed", deleteCompletedTasks);

// DELETE /api/tasks/:id           → Delete a task
router.delete("/:id", deleteTask);

export default router;


