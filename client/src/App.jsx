// ─── App Layout ─────────────────────────────────────────

import Board from "./pages/Board.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Header ─────────────────────────────────── */}
      <header className="bg-surface-800 border-b border-surface-700 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Daily Task Board
            </h1>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Right side — task count summary */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-surface-700 px-3 py-1.5 rounded-full">
            ✨ Plan your day
          </span>
        </div>
      </header>

      {/* ─── Board ──────────────────────────────────── */}
      <main className="flex-1 p-6 overflow-x-auto">
        <Board />
      </main>
    </div>
  );
}

export default App;
