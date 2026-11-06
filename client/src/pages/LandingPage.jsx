// ─── LandingPage Component ────────────────────────────────
// Apple-inspired, pure white, ultra-refined landing page for TaskFlow.
// High contrast, crisp typography, interactive preview, zero emojis.

import React from "react";

export default function LandingPage({ onLaunchApp }) {
    return (
        <div className="min-h-screen bg-white text-gray-950 flex flex-col selection:bg-brand-500 selection:text-white">
            {/* ─── Top Navigation Bar ─── */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-150 px-6 sm:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm tracking-tight">TaskFlow</span>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="#features"
                        className="text-xs font-medium text-gray-600 hover:text-gray-950 transition-colors hidden sm:inline"
                    >
                        Features
                    </a>
                    <a
                        href="#workflow"
                        className="text-xs font-medium text-gray-600 hover:text-gray-950 transition-colors hidden sm:inline"
                    >
                        How It Works
                    </a>
                    <a
                        href="https://github.com/ThePinak/Daily-Task-Manager-Kanban"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-gray-600 hover:text-gray-950 transition-colors hidden sm:inline"
                    >
                        GitHub
                    </a>

                    <button
                        onClick={onLaunchApp}
                        className="px-4 py-2 rounded-xl bg-gray-950 text-white hover:bg-gray-800 text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                        <span>Open Board</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ─── Hero Section ─── */}
            <section className="pt-20 pb-16 px-6 sm:px-12 max-w-5xl mx-auto text-center">
                {/* Announcement Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-6 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span>Pure White Apple Aesthetics · Zero Login Required</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-950 leading-[1.08] max-w-4xl mx-auto">
                    Organize your day.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-gray-700 to-gray-500">
                        Focus on what matters.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
                    A distraction-free daily Kanban system built for high-impact focus. Plan your day, track your time with integrated timers, and visualize your daily progress.
                </p>

                {/* Call to Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={onLaunchApp}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Launch Your Board</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>

                    <a
                        href="#features"
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-all text-center"
                    >
                        Explore Features
                    </a>
                </div>

                {/* Micro trust indicators */}
                <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Instant Local Storage
                    </span>
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Cloud MongoDB Sync
                    </span>
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Zero Clutter
                    </span>
                </div>

                {/* ─── Interactive Interactive Board Preview Mockup ─── */}
                <div className="mt-14 rounded-2xl border border-gray-200 bg-white p-3 sm:p-5 shadow-lg shadow-gray-200/50 text-left">
                    {/* Mockup Header Bar */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-150">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-green-400/80 inline-block" />
                            <span className="text-xs font-semibold text-gray-500 ml-2">TaskFlow Daily Board</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                4 Columns
                            </span>
                            <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                                Live Session
                            </span>
                        </div>
                    </div>

                    {/* Mockup 4 Columns Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-4">
                        {/* To Do Column */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-3 flex flex-col justify-between min-h-[190px]">
                            <div>
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/60">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">To Do</span>
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">2</span>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-2xs space-y-1 mb-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">High</span>
                                        <span className="text-[10px] text-gray-400 font-medium">1h</span>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-900">Ship product release</div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-2xs space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Med</span>
                                        <span className="text-[10px] text-gray-400 font-medium">30m</span>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-900">Review PR comments</div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Column */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-3 flex flex-col justify-between min-h-[190px]">
                            <div>
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/60">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pending</span>
                                    <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded">1</span>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-2xs space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-800 border border-green-200">Low</span>
                                        <span className="text-[10px] text-gray-400 font-medium">45m</span>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-900">Update API endpoints</div>
                                </div>
                            </div>
                        </div>

                        {/* Ongoing Column */}
                        <div className="bg-sky-50/30 border border-sky-200/80 rounded-xl p-3 flex flex-col justify-between min-h-[190px]">
                            <div>
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-sky-200/60">
                                    <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">Ongoing</span>
                                    <span className="text-[10px] font-bold bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded">1</span>
                                </div>
                                <div className="bg-white border-2 border-sky-500 rounded-lg p-2.5 shadow-2xs space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">High</span>
                                        <span className="text-[10px] font-semibold text-sky-700">Active</span>
                                    </div>
                                    <div className="text-xs font-bold text-gray-900">UI redesign overhaul</div>
                                    <div className="bg-gray-50 border border-gray-100 rounded p-1.5 flex justify-between text-[10px] font-mono font-bold text-gray-700">
                                        <span>Spent</span>
                                        <span className="text-sky-600">24:18</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Column */}
                        <div className="bg-green-50/30 border border-green-200/80 rounded-xl p-3 flex flex-col justify-between min-h-[190px]">
                            <div>
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-200/60">
                                    <span className="text-xs font-bold text-green-900 uppercase tracking-wider">Completed</span>
                                    <span className="text-[10px] font-bold bg-green-100 text-green-900 px-1.5 py-0.5 rounded">3</span>
                                </div>
                                <div className="bg-white/80 border border-gray-200 rounded-lg p-2.5 shadow-2xs space-y-1 opacity-80">
                                    <div className="text-xs font-medium text-gray-600 line-through">Database setup</div>
                                    <div className="text-[10px] text-gray-400">Tracked: 35m</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Features Grid ─── */}
            <section id="features" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto border-t border-gray-150">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Features</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 mt-2">
                        Everything you need for daily focus.
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 font-normal">
                        Carefully crafted tools to keep you in flow state all day long.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-gray-300 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-950 tracking-tight">4-Column Kanban Lifecycle</h3>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                            Organize tasks smoothly across To Do, Pending, Ongoing, and Completed. Accessible drag-and-drop powered by modern Sortable mechanics.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-gray-300 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-950 tracking-tight">Integrated Live Timers</h3>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                            Track live seconds spent on ongoing tasks with auto-saving, elapsed vs remaining calculation, and a dedicated distraction-free Pomodoro mode.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-gray-300 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-950 tracking-tight">Daily Progress & Analytics</h3>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                            Visualize your daily completion rate with dynamic radial rings, status distribution breakdowns, priority matrix, and completed task journals.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Workflow Step by Step ─── */}
            <section id="workflow" className="py-20 px-6 sm:px-12 max-w-5xl mx-auto border-t border-gray-150">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Daily Habit</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 mt-2">
                        How to use TaskFlow in 3 simple steps
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center mx-auto sm:mx-0">
                            1
                        </div>
                        <h3 className="text-sm font-bold text-gray-950">Plan in the Morning</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Add the essential tasks you plan to accomplish today in the To Do column. Assign priorities (High, Medium, Low) and estimates.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center mx-auto sm:mx-0">
                            2
                        </div>
                        <h3 className="text-sm font-bold text-gray-950">Focus on One Task</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Drag your chosen task to Ongoing and start the timer (or enter Focus Mode). Give it your undivided attention until complete.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center mx-auto sm:mx-0">
                            3
                        </div>
                        <h3 className="text-sm font-bold text-gray-950">Review Your Accomplishments</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Check the Analytics tab to view your completed tasks, total focused time, and celebrate a productive day.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Bottom CTA Banner ─── */}
            <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto mb-12">
                <div className="rounded-3xl bg-gray-950 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto leading-tight">
                        Start your productive day right now.
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                        No credit card. No password. Just open the board and get into flow.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={onLaunchApp}
                            className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span>Open Daily Board</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── Clean Minimalist Footer ─── */}
            <footer className="border-t border-gray-200 py-8 px-6 sm:px-12 text-center text-xs text-gray-500">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">TaskFlow</span>
                        <span>·</span>
                        <span>Minimalist Daily Task Management</span>
                    </div>

                    <div className="flex items-center gap-4 text-gray-500">
                        <a
                            href="https://github.com/ThePinak/Daily-Task-Manager-Kanban"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-gray-900 transition-colors"
                        >
                            GitHub
                        </a>
                        <span>·</span>
                        <span>MIT License</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
