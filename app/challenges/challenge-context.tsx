"use client";

import React, { createContext, useContext, useRef } from "react";
import type { Challenge } from "@/lib/challenges";

interface ChallengeContextType {
  challenge: Challenge;
  currentIndex: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  nextSlug?: string;
  prevSlug?: string;
  copied: boolean;
  setCopied: (copied: boolean) => void;
  showDemo: boolean;
  setShowDemo: (show: boolean) => void;
  viewMode: "tabs" | "split";
  setViewMode: (mode: "tabs" | "split") => void;
  handleCopyCode: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(
  undefined
);

export function ChallengeProvider({
  children,
  challenge,
  currentIndex,
  canGoNext,
  canGoPrev,
  nextSlug,
  prevSlug,
}: {
  children: React.ReactNode;
  challenge: Challenge;
  currentIndex: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  nextSlug?: string;
  prevSlug?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [showDemo, setShowDemo] = React.useState(false);
  const [viewMode, setViewModeState] = React.useState<"tabs" | "split">("tabs");

  const setViewMode = React.useCallback((mode: "tabs" | "split") => {
    setViewModeState(mode);
    localStorage.setItem("viewMode", mode);
  }, []);

  // Load view mode from localStorage on mount
  React.useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as
      | "tabs"
      | "split"
      | null;
    if (savedViewMode) {
      setViewModeState(savedViewMode);
    }
  }, []);
  const copyTimeoutRef = useRef<number | null>(null);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(challenge.code);
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      copyTimeoutRef.current = null;
    }, 1500);
  };
  return (
    <ChallengeContext.Provider
      value={{
        challenge,
        currentIndex,
        canGoNext,
        canGoPrev,
        nextSlug,
        prevSlug,
        copied,
        setCopied,
        showDemo,
        setShowDemo,
        viewMode,
        setViewMode,
        handleCopyCode,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge(): ChallengeContextType {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error("useChallenge must be used within ChallengeProvider");
  }
  return context;
}
