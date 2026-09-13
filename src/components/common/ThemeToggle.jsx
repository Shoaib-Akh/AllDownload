"use client";

import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, isDark, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 cursor-pointer ${className}`}
      title={mounted ? (isDark ? "Dark mode active — Click to switch to Light mode" : "Light mode active — Click to switch to Dark mode") : "Toggle theme"}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun icon: active in light mode */}
      <Sun
        className={`w-4 h-4 text-amber-500 transition-all duration-300 transform ${
          mounted && !isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0 absolute"
        }`}
      />
      {/* Moon icon: active in dark mode */}
      <Moon
        className={`w-4 h-4 text-violet-400 transition-all duration-300 transform ${
          !mounted || isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0 absolute"
        }`}
      />
    </button>
  );
}
