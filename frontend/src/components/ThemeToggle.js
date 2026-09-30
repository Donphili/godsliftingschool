import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getInitialTheme, applyTheme } from "@/lib/theme";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      data-testid="theme-toggle"
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-ink bg-white dark:bg-card dark:border-border hover:-translate-y-0.5 transition-transform ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-sun" />
      ) : (
        <Moon className="w-5 h-5 text-ink" />
      )}
    </button>
  );
}
