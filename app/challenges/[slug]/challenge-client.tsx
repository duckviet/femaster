"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const { showDemo, setShowDemo, copied, viewMode, handleCopyCode } =
    useChallenge();
  const [activeTab, setActiveTab] = useState("solution");
  const [mounted, setMounted] = useState(false);

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

  // Use test cases from challenge data or empty array
  const functionName = challenge.functionName;
  const sampleTestCases = challenge.testCases || [];

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
            <>
              {challenge?.practicable ? (
                <CodeEditor
                  challenge={challenge}
                  testCases={sampleTestCases}
                  functionName={functionName}
                />
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Practice Unavailable
                  </h3>
                </div>
              )}
            </>
          ) : null}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
