"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  challenges,
  getChallengesBySubcategory,
  type Challenge,
  type DomainCategory,
  type SkillSubcategory,
} from "@/lib/challenges";
import { Sidebar, ChallengeHeader, ChallengeFooter } from "@/components/layout";
import { ChallengeSearch } from "@/components/challenge-search";
import { useChallenge } from "./challenge-context";

interface ChallengesLayoutInnerProps {
  children: React.ReactNode;
  challenge: Challenge;
  currentIndex: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  nextSlug?: string;
  prevSlug?: string;
}

export function ChallengesLayoutInner({
  children,
  challenge,
  currentIndex,
  canGoNext,
  canGoPrev,
  nextSlug,
  prevSlug,
}: ChallengesLayoutInnerProps) {
  const router = useRouter();
  const [expandedDomains, setExpandedDomains] = useState<DomainCategory[]>([
    "react-architecture",
  ]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SkillSubcategory>(challenge.subcategory);
  const [searchOpen, setSearchOpen] = useState(false);
  const { setShowDemo, viewMode, setViewMode, copied, handleCopyCode } =
    useChallenge();

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as
      | "tabs"
      | "split"
      | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, [setViewMode]);

  const filteredChallenges = getChallengesBySubcategory(selectedSubcategory);

  const toggleDomain = (domain: DomainCategory) => {
    setExpandedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );
  };

  const handleSubcategoryChange = (subcategory: SkillSubcategory) => {
    setSelectedSubcategory(subcategory);
    const firstInSubcategory = getChallengesBySubcategory(subcategory)[0];
    if (firstInSubcategory) {
      router.push(`/challenges/${firstInSubcategory.id}`);
    }
  };

  const handleNextChallenge = () => {
    if (nextSlug) {
      router.push(`/challenges/${nextSlug}`);
    }
  };

  const handlePrevChallenge = () => {
    if (prevSlug) {
      router.push(`/challenges/${prevSlug}`);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && canGoPrev) {
        e.preventDefault();
        handlePrevChallenge();
      } else if (e.key === "ArrowRight" && canGoNext) {
        e.preventDefault();
        handleNextChallenge();
      }

      if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (index < challenges.length) {
          e.preventDefault();
          const c = challenges[index];
          router.push(`/challenges/${c.id}`);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoNext, canGoPrev, nextSlug, prevSlug, router]);

  const handleSelectChallenge = (challengeId: string) => {
    const c = challenges.find((ch) => ch.id === challengeId);
    if (c) {
      router.push(`/challenges/${c.id}`);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Search Dialog */}
      <ChallengeSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectChallenge={handleSelectChallenge}
      />

      {/* Sidebar */}
      <Sidebar
        expandedDomains={expandedDomains}
        selectedSubcategory={selectedSubcategory}
        onToggleDomain={toggleDomain}
        onSubcategoryChange={handleSubcategoryChange}
        challengeCount={challenges.length}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ChallengeHeader
          currentChallenge={challenge}
          filteredChallenges={filteredChallenges}
          selectedChallengeId={challenge.id}
          viewMode={viewMode}
          copied={copied}
          onChallengeChange={(id) => {
            const c = challenges.find((ch) => ch.id === id);
            if (c) {
              router.push(`/challenges/${c.id}`);
            }
          }}
          onCopyCode={handleCopyCode}
          onViewModeChange={setViewMode}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">{children}</div>

        {/* Footer */}
        <ChallengeFooter
          currentIndex={currentIndex}
          totalChallenges={challenges.length}
          hasDemo={!!challenge.demoComponentKey}
          canGoNext={canGoNext}
          canGoPrev={canGoPrev}
          onNextChallenge={handleNextChallenge}
          onPrevChallenge={handlePrevChallenge}
          onRunDemo={() => setShowDemo(true)}
        />
      </main>
    </div>
  );
}
