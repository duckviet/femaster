"use client";

import { useState, useCallback, useEffect } from "react";
import {
  challenges,
  getChallengesBySubcategory,
  type DomainCategory,
  type SkillSubcategory,
} from "@/lib/challenges";
import { getDemoComponent } from "@/lib/demo-registry";
import {
  Sidebar,
  ChallengeHeader,
  ProblemStatement,
  ChallengeFooter,
  ContentTabs,
  ContentSplit,
} from "@/components/layout";
import { ChallengeSearch } from "@/components/challenge-search";

export default function ChallengePage() {
  const [expandedDomains, setExpandedDomains] = useState<DomainCategory[]>([
    "react-architecture",
  ]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SkillSubcategory>("recursive-ui");
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    challenges[0].id
  );
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewModeState] = useState<"tabs" | "split">("tabs");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as
      | "tabs"
      | "split"
      | null;
    if (savedViewMode) {
      setViewModeState(savedViewMode);
    }
  }, []);

  // Wrapper function to save view mode to localStorage
  const setViewMode = useCallback((mode: "tabs" | "split") => {
    setViewModeState(mode);
    localStorage.setItem("viewMode", mode);
  }, []);

  const filteredChallenges = getChallengesBySubcategory(selectedSubcategory);
  const currentChallenge =
    challenges.find((c) => c.id === selectedChallengeId) ?? challenges[0];
  const currentIndex = challenges.findIndex(
    (c) => c.id === selectedChallengeId
  );

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
      setSelectedChallengeId(firstInSubcategory.id);
    }
  };

  const handleCopyCode = useCallback(async () => {
    await navigator.clipboard.writeText(currentChallenge.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentChallenge.code]);

  const handleNextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      const next = challenges[currentIndex + 1];
      setSelectedChallengeId(next.id);
      setSelectedSubcategory(next.subcategory);
    }
  };

  const handlePrevChallenge = () => {
    if (currentIndex > 0) {
      const prev = challenges[currentIndex - 1];
      setSelectedChallengeId(prev.id);
      setSelectedSubcategory(prev.subcategory);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Arrow keys for prev/next
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        handlePrevChallenge();
      } else if (
        e.key === "ArrowRight" &&
        currentIndex < challenges.length - 1
      ) {
        e.preventDefault();
        handleNextChallenge();
      }

      // Number keys (1-9) for quick challenge selection
      if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (index < challenges.length) {
          e.preventDefault();
          const challenge = challenges[index];
          setSelectedChallengeId(challenge.id);
          setSelectedSubcategory(challenge.subcategory);
        }
      }

      // Ctrl+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handleSelectChallenge = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge) {
      setSelectedChallengeId(challenge.id);
      setSelectedSubcategory(challenge.subcategory);
    }
  };

  const DemoComponent = showDemo
    ? getDemoComponent(currentChallenge.demoComponentKey)
    : null;
  const canGoNext = currentIndex < challenges.length - 1;
  const canGoPrev = currentIndex > 0;

  // Reset demo visibility when challenge changes
  useEffect(() => {
    setShowDemo(false);
  }, [selectedChallengeId]);

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
          currentChallenge={currentChallenge}
          filteredChallenges={filteredChallenges}
          selectedChallengeId={selectedChallengeId}
          viewMode={viewMode}
          copied={copied}
          onChallengeChange={setSelectedChallengeId}
          onCopyCode={handleCopyCode}
          onViewModeChange={setViewMode}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Problem Statement */}
          <ProblemStatement challenge={currentChallenge} />

          {/* Code / Preview - Tabs or Split View */}
          {viewMode === "tabs" ? (
            <ContentTabs
              challenge={currentChallenge}
              DemoComponent={DemoComponent}
              copied={copied}
              onCopyCode={handleCopyCode}
            />
          ) : (
            <ContentSplit
              challenge={currentChallenge}
              DemoComponent={DemoComponent}
              copied={copied}
              onCopyCode={handleCopyCode}
            />
          )}
        </div>

        {/* Footer */}
        <ChallengeFooter
          currentIndex={currentIndex}
          totalChallenges={challenges.length}
          hasDemo={getDemoComponent(currentChallenge.demoComponentKey) !== null}
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
