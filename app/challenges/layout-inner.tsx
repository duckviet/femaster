"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  challenges,
  getDomainBySubcategory,
  getChallengesBySubcategory,
  type Challenge,
  type DomainCategory,
  type SkillSubcategory,
} from "@/lib/challenges";
import { Sidebar, ChallengeHeader, ChallengeFooter } from "@/components/layout";
import { ChallengeSearch } from "@/components/challenge-search";
import { useChallenge } from "./challenge-context";
import usePersistentState from "@/hooks/usePersistentState";

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
  const defaultDomain =
    getDomainBySubcategory(challenge.subcategory)?.id ?? "react-architecture";
  const [persistedExpandedDomains, setPersistedExpandedDomains] =
    usePersistentState<DomainCategory[]>("challenges.expanded-domains", [
      defaultDomain,
    ]);
  const [persistedSubcategory, setPersistedSubcategory] =
    usePersistentState<SkillSubcategory>(
      "challenges.selected-subcategory",
      challenge.subcategory,
    );
  const [persistedSidebarCollapsed, setPersistedSidebarCollapsed] =
    usePersistentState<boolean>("challenges.sidebar-collapsed", false);

  const expandedDomains =
    persistedExpandedDomains && persistedExpandedDomains.length > 0
      ? persistedExpandedDomains
      : [defaultDomain];
  const selectedSubcategory = persistedSubcategory ?? challenge.subcategory;
  const isSidebarCollapsed = persistedSidebarCollapsed ?? false;
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

  useEffect(() => {
    if (selectedSubcategory !== challenge.subcategory) {
      setPersistedSubcategory(challenge.subcategory);
    }

    const domain = getDomainBySubcategory(challenge.subcategory)?.id;
    if (!domain) return;

    setPersistedExpandedDomains((prev) => {
      const current = prev && prev.length > 0 ? prev : [defaultDomain];
      return current.includes(domain) ? current : [...current, domain];
    });
  }, [
    challenge.subcategory,
    defaultDomain,
    selectedSubcategory,
    setPersistedExpandedDomains,
    setPersistedSubcategory,
  ]);

  const filteredChallenges = getChallengesBySubcategory(selectedSubcategory);

  const toggleDomain = (domain: DomainCategory) => {
    setPersistedExpandedDomains((prev) => {
      const current = prev && prev.length > 0 ? prev : [defaultDomain];
      return current.includes(domain)
        ? current.filter((d) => d !== domain)
        : [...current, domain];
    });
  };

  const handleSubcategoryChange = (subcategory: SkillSubcategory) => {
    setPersistedSubcategory(subcategory);

    const parentDomain = getDomainBySubcategory(subcategory)?.id;
    if (parentDomain) {
      setPersistedExpandedDomains((prev) => {
        const current = prev && prev.length > 0 ? prev : [defaultDomain];
        return current.includes(parentDomain)
          ? current
          : [...current, parentDomain];
      });
    }

    const firstInSubcategory = getChallengesBySubcategory(subcategory)[0];
    if (firstInSubcategory) {
      router.push(`/challenges/${firstInSubcategory.id}`);
    }
  };

  const handleToggleSidebar = useCallback(() => {
    setPersistedSidebarCollapsed((prev) => !(prev ?? false));
  }, [setPersistedSidebarCollapsed]);

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
      setPersistedSubcategory(c.subcategory);
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
        isCollapsed={isSidebarCollapsed}
        expandedDomains={expandedDomains}
        selectedSubcategory={selectedSubcategory}
        onToggleCollapse={handleToggleSidebar}
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
              setPersistedSubcategory(c.subcategory);
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
