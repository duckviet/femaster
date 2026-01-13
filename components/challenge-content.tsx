"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/code-editor";
import type { Challenge } from "@/lib/challenges";

interface ChallengeContentProps {
  challenge: Challenge;
  children?: React.ReactNode;
}

export function ChallengeContent({
  challenge,
  children,
}: ChallengeContentProps) {
  const [activeTab, setActiveTab] = useState("learn");

  // Sample test cases for demonstration
  const sampleTestCases = [
    {
      name: "Sample",
      args: [],
      expected: undefined,
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="learn">Learn</TabsTrigger>
        <TabsTrigger value="code">Try It Yourself</TabsTrigger>
      </TabsList>

      <TabsContent value="learn" className="space-y-4">
        {children}
      </TabsContent>

      <TabsContent value="code">
        <CodeEditor challenge={challenge} testCases={sampleTestCases} />
      </TabsContent>
    </Tabs>
  );
}
