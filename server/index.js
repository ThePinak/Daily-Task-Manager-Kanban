// ─── Daily Task Management Board — Server Entry Point ───

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userExtractor from "./middleware/userExtractor.js";
import taskRoutes from "./routes/taskRoutes.js";

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ─── Core Middleware ─────────────────────────────────────

// Enable CORS for all origins (no auth, open API)
// app.use(cors());
import cors from "cors";

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-anonymous-user-id"]
}));
// Parse incoming JSON request bodies
app.use(express.json());

// ─── Health Check Route ─────────────────────────────────

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Daily Task Board API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────

// All /api/tasks routes require x-user-id header
app.use("/api/tasks", userExtractor, taskRoutes);

// ─── Start Server ───────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
