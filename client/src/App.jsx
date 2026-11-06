// ─── App Layout ─────────────────────────────────────────
// Clean Pure White Theme with Apple-style Navigation & Stunning Landing Page.

import React, { useState } from "react";
import Board from "./pages/Board.jsx";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  // Current view: "landing" | "app"
  const [view, setView] = useState("landing");

  // Tab navigation in app view: "board" | "analytics" | "focus"
  const [activeTab, setActiveTab] = useState("board");

  if (view === "landing") {
    return <LandingPage onLaunchApp={() => setView("app")} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/60 text-gray-900 selection:bg-brand-500 selection:text-white">
      {/* ─── Frosted White Glass Header ─── */}
      <header className="sticky top-0 z-40 glass-header px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Brand Logo & Title (Clickable to return to Landing) */}
        <div
          onClick={() => setView("landing")}
          title="Return to Home page"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-500 group-hover:bg-brand-600 transition-colors flex items-center justify-center shadow-xs text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-gray-950 tracking-tight group-hover:text-brand-600 transition-colors">
                TaskFlow
              </h1>
              <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-600 transition-colors">
                ← Home
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              Daily Kanban & Productivity
            </p>
          </div>
        </div>

        {/* Center: Apple Segmented Control Tab Bar */}
        <nav className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "board"
                ? "bg-white text-gray-950 shadow-xs border border-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>Board</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-white text-gray-950 shadow-xs border border-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("focus")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "focus"
                ? "bg-white text-gray-950 shadow-xs border border-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Focus</span>
          </button>
        </nav>

        {/* Right side — Date + Landing shortcut */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs hidden sm:inline">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>

          <button
            onClick={() => setView("landing")}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
          >
            Home
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        <Board activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      {/* ─── Clean Minimalist Footer ─── */}
      <footer className="py-4 text-center text-xs font-normal text-gray-400 border-t border-gray-200/60">
        TaskFlow · Minimalist Productivity
      </footer>
    </div>
  );
}

export default App;
