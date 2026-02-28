// ─── App Layout ─────────────────────────────────────────

import { useState, useEffect } from "react";
import Board from "./pages/Board.jsx";

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

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
              My Task Board
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

        {/* Right side — theme toggle + label */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-300 bg-surface-700 px-3 py-2 rounded-full hidden sm:inline">
            Plan your day
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ─── Board ──────────────────────────────────── */}
      <main className="flex-1 p-6 overflow-x-auto">
        <Board />
      </main>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="py-3 text-center text-xs text-gray-500">
        Made with <span className="text-red-400">❤</span> by Pinak
      </footer>
    </div>
  );
}

export default App;
