"use client";

import React, { createContext, useContext } from "react";
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
