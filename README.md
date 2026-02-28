# 📋 Daily Task Management Board

A personal productivity tool inspired by Kanban methodology — built for **daily task flow**, not project management. Plan your day, track your time, and stay focused with a clean drag-and-drop interface.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)

---

## 🧐 Problem Statement

People juggle many daily tasks — work assignments, errands, follow-ups, personal goals. The common problems:

- **Forgetting tasks** scattered across sticky notes and mental lists
- **No visibility** into what's in progress vs. what's blocked
- **No time awareness** — tasks take longer than expected with no tracking
- **Complex tools** like Jira/Trello are overkill for daily personal task flow

This app solves all of these with a **zero-authentication, zero-setup** daily board.

---

## ✨ Key Features

| Feature               | Description |
|----------------------|-------------|
| **4-Column Board**   | Todo → Pending → Ongoing → Completed (fixed lifecycle) |
| **Drag & Drop**      | Move tasks between columns with smooth animations |
| **Time Tracking**    | Start/Pause/Resume timer on Ongoing tasks, with real-time display |
| **Priority System**  | High / Medium / Low with color-coded badges |
| **Daily Scoping**    | Tasks are scoped to today's date — fresh board every day |
| **No Login Required**| Anonymous user ID via `localStorage` — works instantly |
| **Optimistic UI**    | Instant UI updates with automatic rollback on failure |
| **Mobile Friendly**  | Touch-friendly drag with responsive grid layout |

---

## 🏗 Tech Stack

| Layer     | Technology | Purpose |
|-----------|-----------|---------|
| Frontend  | React 19 (Vite) | UI components & state |
| Styling   | Tailwind CSS v4 | Utility-first responsive design |
| Drag & Drop | @dnd-kit | Accessible, touch-friendly DnD |
| HTTP Client | Axios | API calls with interceptors |
| Backend   | Express.js 5 | REST API server |
| Database  | MongoDB (Mongoose) | Document storage |
| Dev Tools | Nodemon, ESLint | Hot reload & linting |

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React SPA                                             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │   Todo   │ │ Pending  │ │ Ongoing  │ │Completed │ │ │
│  │  │          │ │          │ │  ⏱ Timer │ │          │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  │       ↕ Drag & Drop (@dnd-kit)                        │ │
│  │  ┌─────────────────┐  ┌────────────────┐              │ │
│  │  │ Axios + userId  │  │ useTimer Hook  │              │ │
│  │  │ (interceptor)   │  │ (30s auto-save)│              │ │
│  │  └────────┬────────┘  └────────────────┘              │ │
│  └───────────┼────────────────────────────────────────────┘ │
└──────────────┼──────────────────────────────────────────────┘
               │ x-anonymous-user-id header
               ▼
┌──────────────────────────────────────────────────────────────┐
│  Express.js API (port 5000)                                  │
│  ┌──────────────────┐  ┌───────────────────────────────────┐│
│  │ userExtractor     │  │ Task Controller                   ││
│  │ middleware         │  │ • createTask      • moveTask     ││
│  │ (reads header,    │─→│ • getTodayTasks   • reorderTasks  ││
│  │  sets req.userId) │  │ • updateTask      • deleteTask    ││
│  └──────────────────┘  │ • updateTimeSpent                 ││
│                         └───────────────┬───────────────────┘│
└─────────────────────────────────────────┼────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│  MongoDB Atlas                                               │
│  Collection: tasks                                           │
│  Index: { userId, taskDate, status, position }               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
ProjectK/
├── server/                    # Backend
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/userExtractor.js  # Anonymous user middleware
│   ├── models/Task.js         # Mongoose schema (10 fields)
│   ├── controllers/taskController.js  # 7 API handlers
│   ├── routes/taskRoutes.js   # Express router (7 endpoints)
│   ├── index.js               # Express entry point
│   ├── .env.example           # Environment template
│   └── package.json
│
└── client/                    # Frontend
    └── src/
        ├── components/
        │   ├── TaskCard.jsx    # Draggable card with timer
        │   ├── Column.jsx     # Droppable status column
        │   └── AddTaskForm.jsx # Task creation form
        ├── pages/Board.jsx    # Main board with DndContext
        ├── hooks/useTimer.js  # Timer hook (start/pause/stop)
        ├── services/
        │   ├── api.js         # Axios instance + interceptor
        │   └── taskService.js # API wrapper functions
        ├── utils/userId.js    # Anonymous ID generation
        ├── App.jsx            # Layout (header + board)
        └── index.css          # Tailwind theme config
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/daily-task-board.git
cd daily-task-board
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/daily-task-board?retryWrites=true&w=majority
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

### 4. Open in browser
Visit `http://localhost:5173` — the board loads immediately, no login required.

---

## 📸 Screenshots

> *Add screenshots here of the running application*
>
> Suggested screenshots:
> 1. Empty board with "Add Task" button
> 2. Board with tasks in all four columns
> 3. Task being dragged between columns
> 4. Timer running on an Ongoing task
> 5. Completed tasks with strikethrough

---

## 🧠 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tasks` | Create a new task (defaults to Todo) |
| `GET` | `/api/tasks/today` | Fetch all of today's tasks |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH` | `/api/tasks/:id/move` | Move task between columns |
| `PATCH` | `/api/tasks/reorder` | Bulk-update positions |
| `PATCH` | `/api/tasks/:id/time` | Update time spent |
| `DELETE` | `/api/tasks/:id` | Delete a task |

All endpoints require the `x-anonymous-user-id` header.

---

## 🔮 Future Improvements

- [ ] Dark/Light mode toggle
- [ ] Task editing modal
- [ ] Task deletion from the UI
- [ ] Previous day history view
- [ ] Daily productivity analytics & charts
- [ ] Subtasks / checklists within tasks
- [ ] Keyboard shortcuts
- [ ] PWA support for offline use

---

## 🛠 Technical Highlights

**For interviews and resume discussions:**

1. **Zero-Auth Architecture** — Users are identified by a UUID stored in `localStorage`, sent via Axios interceptor on every request. No signup friction, instant usability.

2. **Optimistic UI with Rollback** — Drag-and-drop updates the UI instantly before the API call. On failure, the entire task state rolls back to a pre-operation snapshot.

3. **Position-Based Ordering** — Each task has a `position` field. On drag-and-drop, the backend uses `$inc` to shift positions atomically, preventing collisions without locking.

4. **Timer Architecture** — The `useTimer` hook runs a `setInterval` locally, auto-saves to the backend every 30 seconds, and persists unsaved time on unmount. The backend stores `lastTimerStart` for crash recovery.

5. **Single-Collection Design** — One MongoDB collection with a compound index `{ userId, taskDate, status, position }` handles all queries efficiently. Daily scoping via `taskDate` keeps the data clean.

6. **Touch-Friendly DnD** — Uses `@dnd-kit` with separate `PointerSensor` (5px activation distance) and `TouchSensor` (200ms delay) to distinguish taps from drags on mobile devices.

---

## 📜 License

MIT License — feel free to use, modify, and distribute.
