"use client";

import React, { useEffect, useState } from "react";
import {
  ProblemStatement,
  ContentTabs,
  ContentSplit,
} from "@/components/layout";
import { CodeEditor } from "@/components/code-editor";
import { getDemoComponent } from "@/lib/demo-registry";
import type { Challenge } from "@/lib/challenges";
import { useChallenge } from "@/app/challenges/challenge-context";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChallengeClientProps {
  challenge: Challenge;
}

export default function ChallengeClient({ challenge }: ChallengeClientProps) {
  const { showDemo, setShowDemo, copied, viewMode } = useChallenge();
  const [activeTab, setActiveTab] = useState("solution");
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample test cases (per-challenge)
  const { functionName, sampleTestCases } = (() => {
    if (challenge.id === "deep-merge") {
      return {
        functionName: "deepMerge",
        sampleTestCases: [
          {
            name: "Merge nested objects",
            args: [{ a: { b: 1 } }, { a: { c: 2 } }],
            expected: { a: { b: 1, c: 2 } },
          },
        ] as Array<{ name: string; args: any[]; expected: any }>,
      };
    }

    // Default: no tests until defined
    return {
      functionName: undefined,
      sampleTestCases: [] as Array<{
        name: string;
        args: any[];
        expected: any;
      }>,
    };
  })();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      className="space-y-4"
    >
      {/* Problem Statement */}
      <ProblemStatement challenge={challenge} />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="solution" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="practice">
          {mounted ? (
            <CodeEditor
              challenge={challenge}
              testCases={sampleTestCases}
              functionName={functionName}
            />
          ) : null}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
