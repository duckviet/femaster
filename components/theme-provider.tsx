"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  hasHydrated: boolean;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "femaster-theme";

const getSystemTheme = (): "light" | "dark" =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      hasHydrated: false,
      setTheme: (theme) => set({ theme, hasHydrated: true }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const hasHydrated = useThemeStore((state) => state.hasHydrated);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Apply theme to DOM and listen for system preference changes
  useLayoutEffect(() => {
    const nextResolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(nextResolved);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(nextResolved);
  }, [theme]);

  useLayoutEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = (isDark: boolean) => {
      const nextResolved = isDark ? "dark" : "light";
      setResolvedTheme(nextResolved);

      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(nextResolved);
    };

    applySystemTheme(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) =>
      applySystemTheme(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    actualTheme: resolvedTheme,
    hasHydrated,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  // Đợi component mount để tránh lỗi Hydration (Server ko biết localStorage)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Tránh render nội dung cho đến khi đã xác định được theme trên client
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <>{children}</>;
}
