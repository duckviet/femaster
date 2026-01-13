"use client";

import { useState, useEffect } from "react";
import {
  ProblemStatement,
  ContentTabs,
  ContentSplit,
} from "@/components/layout";
import { getDemoComponent } from "@/lib/demo-registry";
import type { Challenge } from "@/lib/challenges";
import { motion } from "framer-motion";

interface ChallengeClientProps {
  challenge: Challenge;
}

export default function ChallengeClient({ challenge }: ChallengeClientProps) {
  const [showDemo, setShowDemo] = useState(false);
  const [viewMode, setViewMode] = useState<"tabs" | "split">("tabs");
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DemoComponent = showDemo
    ? getDemoComponent(challenge.demoComponentKey)
    : null;

  // Reset demo visibility when challenge changes
  useEffect(() => {
    setShowDemo(false);
  }, [challenge.id]);

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
