# 📖 PROJECT EXPLANATION — Daily Task Management Board

> This document explains EVERYTHING about this project in simple language.
> Read it to deeply understand how the project works, why each piece exists,
> and how to confidently explain it in interviews.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [No Authentication Design](#3-no-authentication-design)
4. [Frontend Explanation (React)](#4-frontend-explanation-react)
5. [Backend Explanation (Node + Express)](#5-backend-explanation-node--express)
6. [Database Explanation (MongoDB)](#6-database-explanation-mongodb)
7. [Task Lifecycle](#7-task-lifecycle)
8. [Drag & Drop Mechanism](#8-drag--drop-mechanism)
9. [Time Tracking System](#9-time-tracking-system)
10. [Design & Engineering Decisions](#10-design--engineering-decisions)
11. [How to Explain This in Interviews](#11-how-to-explain-this-in-interviews)

---

## 1. Project Overview

### What problem does this solve?

Every day, you have things to do. Some are important, some can wait. You need a way to:

- **See all your tasks** at a glance
- **Know what stage** each task is in (not started? in progress? done?)
- **Track how much time** you're spending on things
- **Prioritize** what matters most

Most tools (Jira, Trello, Asana) are built for **teams and long-term projects**. They're powerful, but way too complex for daily personal use.

### What this project does

This app gives you a **4-column board** for your day:

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   TODO   │  │ PENDING  │  │ ONGOING  │  │COMPLETED │
│          │  │          │  │ (timer!) │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

- **Todo** — Things you plan to do today
- **Pending** — Tasks waiting on something (sorted by priority)
- **Ongoing** — What you're actively working on (with a timer)
- **Completed** — What you've finished

You drag tasks between columns. That's it. Simple, fast, and focused.

### Why is it different from a normal Kanban board?

| Normal Kanban | This Project |
|---|---|
| For teams | For one person |
| Requires login | No login needed |
| Tasks live forever | Tasks are scoped to **today** |
| No time tracking | Built-in timer on active tasks |
| Columns are customizable | Columns are fixed (enforces a workflow) |

---

## 2. High-Level Architecture

This project has **3 layers** that talk to each other:

```
[Browser] ⟷ [Server] ⟷ [Database]
 (React)    (Express)   (MongoDB)
```

### How they connect

1. **Browser (React app)** — The user sees and interacts with the board
2. **Server (Express API)** — Receives requests, processes them, talks to the database
3. **Database (MongoDB)** — Stores all the task data permanently

### Data flow — what happens when a user uses the app

**Step 1: Page loads**
```
Browser → GET /api/tasks/today → Server → MongoDB query → Server → Browser
```
The browser asks the server: "Give me today's tasks." The server queries MongoDB, filters by the user's ID and today's date, and sends the tasks back.

**Step 2: User creates a task**
```
Browser → POST /api/tasks → Server → MongoDB insert → Server → Browser
```
The browser sends the task data (title, priority, etc.) to the server. The server saves it to MongoDB and returns the saved task.

**Step 3: User drags a task**
```
Browser updates UI immediately (optimistic update)
Browser → PATCH /api/tasks/:id/move → Server → MongoDB update
If the API fails → Browser rolls back to the previous state
```

**Step 4: User starts a timer**
```
Browser starts a local interval (ticks every 1 second)
Every 30 seconds → PATCH /api/tasks/:id/time → Server → MongoDB
When paused/stopped → Final save to MongoDB
```

### The key idea

The frontend handles **what the user sees**. The backend handles **what gets saved**. The database **remembers everything**. They communicate through **HTTP API calls**.

---

## 3. No Authentication Design

### Why there is no login/signup

This app is for **personal daily use**. Adding login would:
- Slow down the user (forms, passwords, email verification)
- Add complexity (JWT tokens, session management, password hashing)
- Be unnecessary — this isn't a multi-user collaboration tool

So instead, we use **anonymous identification**.

### What is anonymousUserId?

It's a **random string** that uniquely identifies your browser. Example:

```
"a1b2c3d4-e5f6-7890-abcd-1234567890ef"
```

This is a **UUID** (Universally Unique Identifier). The chances of two users getting the same UUID are basically zero.

### How it works — step by step

**First visit:**
```
1. Browser opens the app
2. Code checks localStorage: "Do I have an anonymousUserId?"
3. Answer: No → Generate a new UUID
4. Save it to localStorage
5. UUID is now permanent for this browser
```

**Every subsequent visit:**
```
1. Browser opens the app
2. Code checks localStorage: "Do I have an anonymousUserId?"
3. Answer: Yes → Use the existing one
```

**On every API call:**
```
1. Axios interceptor runs BEFORE the request is sent
2. It reads the UUID from localStorage
3. It attaches it as a header: x-anonymous-user-id: a1b2c3d4-...
4. Server receives the request
5. Middleware reads the header and puts it on req.userId
6. Controller uses req.userId to filter ALL database queries
```

### How user data stays isolated

Every single database query includes the user's ID:

```
Find tasks WHERE userId = "a1b2c3d4-..." AND taskDate = "2026-02-28"
```

User A's tasks are **never** mixed with User B's tasks. The userId acts as a **data boundary**.

### Where is the code?

| What | File | What it does |
|---|---|---|
| Generate/retrieve UUID | `client/src/utils/userId.js` | `getAnonymousUserId()` — checks localStorage, generates if missing |
| Attach to every request | `client/src/services/api.js` | Axios interceptor adds `x-anonymous-user-id` header |
| Read on server side | `server/middleware/userExtractor.js` | Reads header, validates, sets `req.userId` |

---

## 4. Frontend Explanation (React)

### Folder structure and purpose

```
client/src/
├── components/     → Reusable UI pieces (TaskCard, Column, AddTaskForm)
├── pages/          → Full page layouts (Board is the main page)
├── context/        → React context (prepared for future use)
├── hooks/          → Custom React hooks (useTimer for time tracking)
├── services/       → API call functions (talk to the backend)
├── utils/          → Utility functions (userId generation)
├── App.jsx         → Root layout (header + board)
├── main.jsx        → Entry point (renders App into the DOM)
└── index.css       → Global styles and Tailwind theme
```

### What each folder does — explained simply

**components/** — These are like LEGO blocks. Each one is a small, focused piece of UI:
- `TaskCard.jsx` — One task card (shows title, priority, timer)
- `Column.jsx` — One vertical column (Todo, Pending, etc.)
- `AddTaskForm.jsx` — The form to create a new task

**pages/** — These are full screens the user sees:
- `Board.jsx` — The main board that shows all 4 columns

**services/** — These are the "messengers" that talk to the backend:
- `api.js` — Creates an Axios instance with the user ID header
- `taskService.js` — Functions like `fetchTodayTasks()`, `createTask()`, `moveTask()`

**hooks/** — These are reusable pieces of logic:
- `useTimer.js` — Manages the timer (start, pause, stop, auto-save)

**utils/** — Small helper functions:
- `userId.js` — Generates and stores the anonymous user ID

### How App.jsx works

`App.jsx` is simple. It renders:
1. A **header** — Shows "Daily Task Board", today's date, and a logo
2. The **Board** component — Where all the action happens

Think of it as the "frame" of the application.

### How main.jsx works

`main.jsx` is the **entry point** of the entire React app. It does ONE thing:
1. Find the `<div id="root">` in `index.html`
2. Render the `<App />` component inside it

This is where React "boots up."

### How tasks are fetched and shown

When the Board page loads:

```
1. useEffect runs (on component mount)
2. Calls fetchTodayTasks() from taskService
3. fetchTodayTasks() makes a GET request to /api/tasks/today
4. Axios interceptor attaches the anonymousUserId header
5. Server returns today's tasks for this user
6. Board stores them in useState → tasks = [task1, task2, ...]
7. getGroupedTasks() sorts them into 4 groups by status
8. Each group is passed to a <Column> component
9. Each Column renders <TaskCard> for each task
```

### How drag-and-drop works on the frontend

The frontend uses a library called **@dnd-kit**. Here's the flow:

```
1. User grabs a TaskCard → handleDragStart fires
   → Stores the active task for the DragOverlay (floating card)

2. User drags over a Column → handleDragOver fires
   → If the column is different, instantly update the task's status in state
   → This gives the "live preview" effect

3. User drops the card → handleDragEnd fires
   → Save a snapshot of the current state (for rollback)
   → Calculate the new position
   → Update the UI optimistically
   → Call the backend API (moveTask)
   → If API fails → restore the snapshot (rollback)
```

### How time tracking works from the UI side

Only tasks in the **Ongoing** column show timer controls:

```
1. TaskCard detects isOngoing=true
2. It initializes the useTimer hook with the task's saved time
3. User clicks "Start" → hook starts a setInterval (1 tick/second)
4. elapsed counter increases every second
5. The UI shows: Estimated | Spent | Remaining
6. User clicks "Pause" → interval stops, unsaved time is sent to backend
7. User clicks "Done" → timer stops, time saved, task moves to Completed
```

---

## 5. Backend Explanation (Node + Express)

### Folder structure

```
server/
├── config/db.js           → Connects to MongoDB
├── middleware/             → Functions that run BEFORE controllers
│   └── userExtractor.js   → Reads anonymousUserId from headers
├── models/                → Data structures (schemas)
│   └── Task.js            → Defines what a "task" looks like in the database
├── controllers/           → Business logic (what happens when an API is called)
│   └── taskController.js  → 7+ functions that handle task operations
├── routes/                → URL mappings (which URL calls which controller)
│   └── taskRoutes.js      → Maps URLs like /api/tasks to controller functions
└── index.js               → The main file that starts everything
```

### How index.js works

This is the **entry point** of the backend. It does these things in order:

```
1. Load environment variables (.env file) → dotenv.config()
2. Connect to MongoDB → connectDB()
3. Create an Express app → express()
4. Set up middleware:
   → cors() — allows the frontend to call the API
   → express.json() — parses JSON request bodies
5. Define a health check route → GET /api/health
6. Mount task routes → /api/tasks → with userExtractor middleware
7. Start listening on port 5000
```

### How the anonymous user middleware works

`userExtractor.js` runs **before** every task API call. It does:

```
1. Read the header: x-anonymous-user-id
2. If it's missing or empty → return 400 error ("Missing required header")
3. If it exists → trim whitespace, attach to req.userId
4. Call next() → pass control to the actual controller function
```

This means **every controller** can simply use `req.userId` without worrying about where it came from.

### How the APIs work

Here's what each API endpoint does:

| Endpoint | What happens internally |
|---|---|
| `POST /api/tasks` | Validates title, finds the last position in Todo column, creates task with today's date |
| `GET /api/tasks/today` | Queries all tasks WHERE userId = current user AND taskDate = today, sorted by position |
| `PUT /api/tasks/:id` | Finds the task by ID + userId, updates allowed fields (title, description, priority, estimatedTime) |
| `PATCH /api/tasks/:id/move` | Moves a task to a new column. Shifts other tasks' positions using `$inc`. Called on drag-and-drop |
| `PATCH /api/tasks/reorder` | Receives an array of `[{id, position}]` and updates all positions at once. Used for within-column reorder |
| `PATCH /api/tasks/:id/time` | Adds seconds to `totalTimeSpent` using atomic `$inc`. Also sets/clears `lastTimerStart` |
| `DELETE /api/tasks/:id` | Finds and deletes one task by ID + userId |
| `DELETE /api/tasks/completed` | Deletes ALL completed tasks for today for this user |

### How drag-and-drop updates the backend

When you drag a task from one column to another:

```
1. Frontend calls PATCH /api/tasks/:id/move
2. Body: { status: "ongoing", position: 2 }
3. Backend reads the task's CURRENT status
4. If the status changed (cross-column move):
   a. Shift tasks DOWN in the source column ($inc position by -1 for tasks above)
   b. Shift tasks DOWN in the destination column ($inc position by +1 for tasks at/below target)
   c. Update the dragged task's status and position
5. If same column (reorder):
   a. Shift positions between old and new index
   b. Update the task's position
```

### How time tracking data is saved

When the timer sends time to the backend:

```
1. Frontend calls PATCH /api/tasks/:id/time
2. Body: { additionalSeconds: 30, timerRunning: true }
3. Backend uses $inc to ADD seconds to totalTimeSpent
   → $inc is ATOMIC — even if two requests arrive at the same time, no data is lost
4. If timerRunning is true → set lastTimerStart to current server time
5. If timerRunning is false → set lastTimerStart to null
```

Why `$inc` instead of just setting the value? Because the frontend sends "I've worked 30 more seconds" instead of "total time is 250 seconds." This prevents data loss if the frontend's total is slightly out of sync.

---

## 6. Database Explanation (MongoDB)

### The Task schema — field by field

```
Task {
    userId          → String, required, indexed
    title           → String, required, max 100 chars
    description     → String, optional, max 500 chars
    status          → String, one of: "todo", "pending", "ongoing", "completed"
    priority        → String, one of: "low", "medium", "high"
    position        → Number, the order within its column
    taskDate        → String, format "YYYY-MM-DD"
    estimatedTime   → Number, estimated duration in hours
    totalTimeSpent  → Number, accumulated seconds spent working
    lastTimerStart  → Date or null, for crash recovery
    createdAt       → Date, auto-generated by Mongoose
    updatedAt       → Date, auto-updated by Mongoose
}
```

### Why each field exists

| Field | Why it exists |
|---|---|
| `userId` | To isolate data between different users. Every query filters by this |
| `title` | The name of the task — what you need to do |
| `description` | Optional extra details or notes |
| `status` | Which column the task belongs to (todo/pending/ongoing/completed) |
| `priority` | How important the task is (shown as colored badges) |
| `position` | The order within a column. Task at position 0 is at the top |
| `taskDate` | Which day this task belongs to. Stored as "2026-02-28" |
| `estimatedTime` | How long you think this task will take (in hours) |
| `totalTimeSpent` | How many seconds you've actually spent on it (accumulated over sessions) |
| `lastTimerStart` | When was the timer last started? Used for crash recovery if the browser closes unexpectedly |

### How daily tasks are handled

Tasks are filtered by `taskDate`. When you open the app:
- The backend generates today's date as a string: `"2026-02-28"`
- It only returns tasks WHERE `taskDate = "2026-02-28"`
- Yesterday's tasks still exist in the database, but they're not shown

This means **every day is a fresh board** without deleting old data.

### The compound index

```
{ userId: 1, taskDate: 1, status: 1, position: 1 }
```

This index tells MongoDB: "I will frequently query by userId + taskDate + status, and I want results sorted by position." MongoDB can then find your tasks extremely fast — even if the database has millions of tasks.

---

## 7. Task Lifecycle

### The 4 stages

```
TODO → PENDING → ONGOING → COMPLETED
```

But tasks don't have to follow this order strictly. You can drag from any column to any other. The columns are a **suggested workflow**, not a rigid rule.

### What happens internally at each stage

**Task is created:**
```
→ Status = "todo"
→ Position = last position in Todo column + 1
→ taskDate = today's date
→ totalTimeSpent = 0
→ Saved to MongoDB
```

**Task is dragged to Pending:**
```
→ Frontend updates status to "pending" immediately
→ Backend shifts positions in both source and destination columns
→ Pending column sorts tasks by priority (High → Medium → Low)
```

**Task is dragged to Ongoing:**
```
→ Timer controls appear (Start, Pause, Done)
→ User can now track time
→ Timer does NOT auto-start — user must click "Start"
```

**Timer is started:**
```
→ setInterval starts (1 tick per second)
→ elapsed counter increases
→ Backend is notified: "timer is running"
→ lastTimerStart is set on the server
→ Auto-save runs every 30 seconds
```

**Timer is paused:**
```
→ setInterval is cleared
→ Unsaved seconds are sent to the backend
→ totalTimeSpent increases by the unsaved amount
→ lastTimerStart is set to null
```

**Task is completed (user clicks "Done"):**
```
→ Timer is stopped
→ Any unsaved time is persisted
→ Task moves to the Completed column
→ Backend updates status to "completed"
→ On the UI, completed tasks appear muted with a strikethrough
```

**Task is deleted:**
```
→ User clicks the trash icon on a completed task
→ UI removes it immediately (optimistic update)
→ Backend deletes it from MongoDB
→ If the API fails, the task reappears (rollback)
```

---

## 8. Drag & Drop Mechanism

### How it works conceptually

Think of drag-and-drop as 3 events:

```
GRAB → MOVE → DROP
```

**GRAB (onDragStart):**
- User clicks and holds a task card
- We save a reference to the dragged task
- A floating copy (DragOverlay) appears under the cursor

**MOVE (onDragOver):**
- As the user moves the card, we detect which column they're hovering over
- If it's a different column, we immediately move the task in the UI
- This creates the "live preview" feeling

**DROP (onDragEnd):**
- User releases the card
- We calculate the final position
- We save the previous state as a backup (snapshot)
- We update the UI optimistically
- We call the backend to persist the change
- If the backend fails, we restore the snapshot

### How frontend and backend stay in sync

The key concept is **optimistic updates**:

```
1. User performs an action (drag)
2. UI updates IMMEDIATELY (user sees instant feedback)
3. API call is made in the background
4. If API succeeds → nothing more to do
5. If API fails → ROLLBACK the UI to the saved snapshot
```

This makes the app feel fast. The user never waits for the server.

### Why the position (order) field is needed

Without a position field, tasks would appear in random order. The position field ensures:

- Task at position 0 appears first
- Task at position 1 appears second
- And so on

When you drag a task, the positions of OTHER tasks also change:

```
Before: Task_A(pos:0), Task_B(pos:1), Task_C(pos:2)
Drag Task_C to position 1:
After:  Task_A(pos:0), Task_C(pos:1), Task_B(pos:2)
```

The backend uses MongoDB's `$inc` operator to shift positions atomically.

---

## 9. Time Tracking System

### How the timer works

The timer is managed by a **custom React hook** called `useTimer`. Here's what happens:

```
1. Hook initializes with the task's saved totalTimeSpent
2. elapsed = totalTimeSpent (example: 120 seconds from last session)
3. User clicks "Start"
4. setInterval starts, ticking every 1000ms (1 second)
5. Each tick: elapsed += 1, sessionUnsaved += 1
6. Display updates every second: "02:01" → "02:02" → "02:03"
```

### How timeSpent is calculated

```
Total time on screen = initialTimeSpent (from database) + time ticked this session
```

The `elapsed` variable holds this total. It starts from what the database has, and grows as the timer ticks.

### How remaining time is derived

```
remaining = estimatedTime (in seconds) - elapsed

If remaining < 0, we show 0 (can't have negative time)
If remaining = 0 and estimatedTime > 0, the progress bar turns red
```

### What happens on refresh

When you refresh the page:

```
1. The React component unmounts
2. useEffect cleanup runs
3. It detects unsaved time in sessionStartRef
4. It sends that unsaved time to the backend
5. When the page reloads, the task loads with the updated totalTimeSpent
6. The timer starts from where it left off
```

However, the timer does NOT auto-resume after refresh. The user must click "Start" again. But no time is lost — it was saved.

### Edge cases handled

| Edge Case | How it's handled |
|---|---|
| User refreshes mid-timer | Cleanup function sends unsaved time to backend |
| Browser crashes | Server has `lastTimerStart` — can calculate lost time |
| Auto-save while running | Every 30 seconds, unsaved time is synced to backend |
| Timer paused | Session time is immediately persisted |
| Task dragged out of Ongoing | Component unmounts → cleanup saves time |
| Two clicks on Start | Prevented — `if (intervalRef.current) return` |

---

## 10. Design & Engineering Decisions

### Why MERN stack?

| Choice | Reason |
|---|---|
| **MongoDB** | Flexible schema, no migrations needed. Perfect for a task document with varying fields |
| **Express.js** | Minimal, fast, and the standard for Node.js APIs |
| **React** | Component-based, great for interactive UIs with real-time state changes |
| **Node.js** | JavaScript everywhere (frontend + backend), large ecosystem |

### Why no authentication?

- This is a **personal productivity tool**, not a SaaS product
- Adding auth would require: signup forms, login flow, JWT tokens, password hashing, email verification
- The anonymous UUID approach gives **instant usability** with zero friction
- Users open the app and start working immediately

### Why a fixed workflow?

Free-form columns let you create "In Review", "Blocked", etc. But for daily personal tasks:
- You don't need that complexity
- A fixed flow (Todo → Pending → Ongoing → Completed) keeps you **focused**
- It enforces a simple mental model: "What do I need to do? What am I waiting on? What am I working on? What's done?"

### Why time tracking was added?

- Most people **underestimate** how long tasks take
- Seeing "Time Spent: 2h 15m" gives you real feedback
- It helps you plan better tomorrow
- The timer makes the "Ongoing" column feel active and alive

### Trade-offs of this design

| Trade-off | Why it's acceptable |
|---|---|
| No real authentication | This is a personal tool, not a shared system |
| Data tied to one browser | Acceptable for daily use. Clearing localStorage loses the link to old data |
| No offline support | Requires internet for MongoDB Atlas. Could be improved with IndexedDB |
| No previous day view | Keeps the UI focused on today. Old data exists in the DB for future features |

---

## 11. How to Explain This in Interviews

### Simple explanation (30 seconds)

> "I built a personal daily task management board using the MERN stack. It's like a simplified Kanban board where you drag tasks through four stages — Todo, Pending, Ongoing, and Completed. It has built-in time tracking for active tasks, and it works without any login. Each user gets a unique anonymous ID stored in the browser."

### Technical explanation (2–3 minutes)

> "This is a full-stack MERN application. On the frontend, I used React with Vite and Tailwind CSS. The board has four fixed columns and uses @dnd-kit for drag-and-drop with optimistic UI updates — meaning the UI updates instantly and rolls back if the API call fails.
>
> On the backend, Express handles 7 REST endpoints. There's a middleware that reads an anonymous user ID from request headers to isolate each user's data without authentication. The ID is a UUID generated on the client and stored in localStorage, attached to every request via an Axios interceptor.
>
> Tasks are stored in MongoDB with a compound index on userId, taskDate, status, and position for fast queries. The position field handles ordering within columns — when tasks are dragged, the backend uses atomic $inc operations to shift positions.
>
> For time tracking, I built a custom React hook called useTimer. It runs a local setInterval, auto-saves to the backend every 30 seconds, and persists unsaved time on component unmount. The backend stores a lastTimerStart timestamp for crash recovery."

### What interviewers will like about this project

1. **It's not a tutorial clone** — It solves a real problem with thoughtful decisions
2. **Full-stack depth** — Frontend state management, backend API design, database indexing
3. **Optimistic UI** — Shows you understand real-world UX patterns
4. **Drag-and-drop** — A non-trivial UI interaction with backend sync
5. **Time tracking** — Shows you can handle real-time features, intervals, and edge cases
6. **No auth by design** — Shows you made a deliberate choice, not just skipped it
7. **Clean code** — Separated into logical folders, each file has one responsibility
8. **Error handling** — Rollback on failure, validation, proper HTTP status codes
9. **Performance** — Compound index, atomic operations, debounced saves

### Questions interviewers might ask

**Q: Why didn't you add authentication?**
> "This is a personal daily tool. Adding auth would add complexity without value for the use case. Instead, I used an anonymous UUID system that gives user isolation without login friction."

**Q: What happens if two users get the same UUID?**
> "The chance is astronomically low — UUID v4 has 122 random bits. But even if it happened, the worst case is seeing someone else's tasks, which is acceptable for a personal tool without sensitive data."

**Q: How do you handle race conditions in drag-and-drop?**
> "I use MongoDB's $inc operator for atomic position updates. Even if two requests arrive at the same time, each one increments independently without overwriting."

**Q: What would you add if you had more time?**
> "Authentication for cross-device access, a previous-day history view, daily productivity analytics, and offline support using IndexedDB."

---

*This document covers everything you need to understand and explain the Daily Task Management Board project. Re-read it before interviews, and practice the 30-second and 2–3 minute explanations out loud.*
