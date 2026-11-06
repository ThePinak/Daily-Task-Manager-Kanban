// ─── App Layout ─────────────────────────────────────────
// Apple-inspired UI with Frosted Glassmorphism, Default Light Mode,
// Background Ambient Blur Blobs, and Segmented Tab Navigation.

import React, { useState, useEffect } from "react";
import Board from "./pages/Board.jsx";

function App() {
  // Light mode by default
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Tab navigation: "board" | "analytics" | "focus"
  const [activeTab, setActiveTab] = useState("board");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50/70 dark:bg-slate-950 transition-colors duration-300">
      {/* ─── Ambient Background Blur Orbs (Apple Glassmorphism) ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Top-left sky blue orb */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-sky-400/25 to-blue-500/20 blur-3xl" />
        {/* Top-right purple orb */}
        <div className="absolute top-10 -right-28 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-500/15 blur-3xl" />
        {/* Center-bottom emerald/amber orb */}
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/15 to-amber-300/15 blur-3xl" />
      </div>

      {/* ─── Glass Header ─── */}
      <header className="sticky top-0 z-40 glass-surface border-b border-slate-200/60 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              TaskFlow
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Daily Kanban & Productivity
            </p>
          </div>
        </div>

        {/* Center: Apple Segmented Control Tab Bar */}
        <nav className="flex items-center bg-slate-200/70 dark:bg-slate-800/90 p-1 rounded-2xl shadow-inner border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "board"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>📋</span>
            <span>Board</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>📊</span>
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("focus")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "focus"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>⏱</span>
            <span>Focus</span>
          </button>
        </nav>

        {/* Right side — Date + Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl hidden md:inline border border-slate-200/50 dark:border-slate-700/50">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-slate-200/60 dark:border-slate-700/60 active:scale-95"
          >
            {theme === "light" ? (
              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        <Board activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      {/* ─── Minimalist Footer ─── */}
      <footer className="py-4 text-center text-[11px] font-medium text-slate-400">
        TaskFlow · Designed with Apple Aesthetics
      </footer>
    </div>
  );
}

export default App;
