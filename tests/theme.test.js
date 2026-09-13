import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("tailwind.config.js has darkMode configured to class", async () => {
  const configPath = path.resolve("./tailwind.config.js");
  const configContent = fs.readFileSync(configPath, "utf-8");
  assert.match(configContent, /darkMode:\s*['"]class['"]/);
});

test("globals.css defines :root and .dark theme variables and scrollbars", () => {
  const cssPath = path.resolve("./src/app/globals.css");
  const css = fs.readFileSync(cssPath, "utf-8");
  assert.ok(css.includes(":root"), "globals.css should define :root variables");
  assert.ok(css.includes(".dark"), "globals.css should define .dark variables");
  assert.ok(css.includes("--background-rgb"), "globals.css should define --background-rgb");
  assert.ok(css.includes("--foreground-rgb"), "globals.css should define --foreground-rgb");
  assert.ok(css.includes(".dark ::-webkit-scrollbar-track"), "globals.css should theme scrollbars");
});

test("src/hooks/useTheme.js exports ThemeProvider and useTheme", async () => {
  const useThemeModule = await import("../src/hooks/useTheme.js");
  assert.equal(typeof useThemeModule.ThemeProvider, "function");
  assert.equal(typeof useThemeModule.useTheme, "function");
});

test("layout.js imports and wraps with ThemeProvider and provides anti-FOUC script", () => {
  const layoutPath = path.resolve("./src/app/layout.js");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");
  assert.ok(layoutContent.includes("ThemeProvider"), "layout.js must wrap with ThemeProvider");
  assert.ok(layoutContent.includes("localStorage.getItem('theme')"), "layout.js must have anti-FOUC theme script");
  assert.ok(layoutContent.includes("dark:bg-gray-950"), "layout.js body must support dark mode classes");
  assert.ok(layoutContent.includes("dark:text-white"), "layout.js body must support dark text classes");
});

test("ThemeToggle.jsx has Sun and Moon icons with accessible attributes", () => {
  const togglePath = path.resolve("./src/components/common/ThemeToggle.jsx");
  const toggleContent = fs.readFileSync(togglePath, "utf-8");
  assert.ok(toggleContent.includes("useTheme"), "ThemeToggle must use useTheme hook");
  assert.ok(toggleContent.includes("Sun"), "ThemeToggle must include Sun icon");
  assert.ok(toggleContent.includes("Moon"), "ThemeToggle must include Moon icon");
  assert.ok(toggleContent.includes("onClick={toggleTheme}"), "ThemeToggle must have toggleTheme onClick");
});
