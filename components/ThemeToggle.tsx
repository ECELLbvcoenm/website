"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const x = event.clientX;
    const y = event.clientY;

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };
    if (!doc.startViewTransition) {
      toggleTheme();
      return;
    }

    document.documentElement.style.setProperty("--reveal-x", `${x}px`);
    document.documentElement.style.setProperty("--reveal-y", `${y}px`);

    // Always use the collapse animation to match the dark-to-light transition
    document.documentElement.classList.add("theme-reveal-collapse");

    const transition = doc.startViewTransition(() => {
      toggleTheme();
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove("theme-reveal-expand", "theme-reveal-collapse");
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
      style={{
        background: "var(--bg-glass)",
        border: "1px solid var(--border-glass)",
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <Sun className="w-5 h-5" style={{ color: "var(--text-accent)" }} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <Moon className="w-5 h-5" style={{ color: "var(--text-accent)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
