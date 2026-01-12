"use client";

import { useState, useCallback } from "react";
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
  const [viewMode, setViewMode] = useState<"tabs" | "split">("tabs");

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

  const DemoComponent = getDemoComponent(currentChallenge.demoComponentKey);
  const canGoNext = currentIndex < challenges.length - 1;

  return (
    <div className="flex h-screen bg-background">
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
          hasDemo={DemoComponent !== null}
          canGoNext={canGoNext}
          onNextChallenge={handleNextChallenge}
        />
      </main>
    </div>
  );
}
