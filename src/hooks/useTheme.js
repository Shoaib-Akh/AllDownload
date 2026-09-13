"use client";

import { createContext, useContext, useState, useEffect, useCallback, createElement } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on client mount
  useEffect(() => {
    try {
      let stored = localStorage.getItem("theme");
      // Clean any invalid or corrupted values from localStorage
      if (stored !== "light" && stored !== "dark") {
        if (stored) {
          localStorage.removeItem("theme");
        }
        stored = null;
      }
      
      const initialTheme = stored || "dark";
      setThemeState(initialTheme);
      
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme) => {
    const finalTheme = newTheme === "light" ? "light" : "dark";
    setThemeState(finalTheme);
    try {
      localStorage.setItem("theme", finalTheme);
    } catch {
      // ignore
    }
    if (finalTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", nextTheme);
      } catch {
        // ignore
      }
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return nextTheme;
    });
  }, []);

  // Sync with storage changes across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "theme") {
        const val = e.newValue === "light" ? "light" : "dark";
        setThemeState(val);
        if (val === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isDark = theme === "dark";

  return createElement(
    ThemeContext.Provider,
    { value: { theme, toggleTheme, setTheme, isDark, mounted } },
    children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
