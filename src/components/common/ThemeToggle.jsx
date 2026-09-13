"use client";

import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`p-2 rounded-xl border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${className}`}
      title={`Toggle theme (${theme})`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-violet-400 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
