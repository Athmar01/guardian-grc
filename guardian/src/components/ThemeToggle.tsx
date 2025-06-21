"use client";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Button } from '@/components/ui/Button';

import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  isCollapsed: boolean;
}

export default function ThemeToggle({ isCollapsed }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check local storage or system preference
    const dark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  return (
    <Button
      variant="outline"
      size={isCollapsed ? "icon" : "default"}
      onClick={toggleTheme}
      className={cn(
        "transition-all duration-200",
        !isCollapsed && "w-full flex items-center justify-start gap-2 px-3",
        isCollapsed && "rounded-full mx-auto" // Center icon button when collapsed
      )}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <SunIcon className={cn("w-5 h-5", isCollapsed ? "text-yellow-500" : "text-yellow-500")} />
      ) : (
        <MoonIcon className={cn("w-5 h-5", isCollapsed ? "text-slate-500" : "text-slate-500")} />
      )}
      {!isCollapsed && (
        <span className="text-sm">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </Button>
  );
} 