"use client";

import React, { useEffect, useState } from "react";
import {
  ProblemStatement,
  ContentTabs,
  ContentSplit,
} from "@/components/layout";
import { getDemoComponent } from "@/lib/demo-registry";
import type { Challenge } from "@/lib/challenges";
import { useChallenge } from "@/app/challenges/challenge-context";
import { motion } from "framer-motion";

interface ChallengeClientProps {
  challenge: Challenge;
}

export default function ChallengeClient({ challenge }: ChallengeClientProps) {
  const { showDemo, setShowDemo, copied } = useChallenge();
  const [viewMode, setViewMode] = React.useState<"tabs" | "split">("tabs");

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as
      | "tabs"
      | "split"
      | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(challenge.code);
  };

  const DemoComponent = showDemo
    ? getDemoComponent(challenge.demoComponentKey)
    : null;

  // Reset demo visibility when challenge changes
  useEffect(() => {
    setShowDemo(false);
  }, [challenge.id, setShowDemo]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
    >
      {/* Problem Statement */}
      <ProblemStatement challenge={challenge} />

      {/* Code / Preview - Tabs or Split View */}
      {viewMode === "tabs" ? (
        <ContentTabs
          challenge={challenge}
          DemoComponent={DemoComponent}
          copied={copied}
          onCopyCode={handleCopyCode}
        />
      ) : (
        <ContentSplit
          challenge={challenge}
          DemoComponent={DemoComponent}
          copied={copied}
          onCopyCode={handleCopyCode}
        />
      )}
    </motion.div>
  );
}
