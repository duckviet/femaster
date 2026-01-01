"use client";

import { useState, useCallback } from "react";
import {
  IconCode,
  IconRocket,
  IconBrandReact,
  IconCopy,
  IconCheck,
  IconChevronRight,
  IconChevronDown,
  IconPlayerPlay,
  IconLayoutColumns,
  IconLayoutRows,
  IconTools,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  challenges,
  domainStructure,
  getChallengesBySubcategory,
  type DomainCategory,
  type SkillSubcategory,
} from "@/lib/challenges";
import {
  NestedCommentsDemo,
  UseDebounceDemo,
  VirtualListDemo,
} from "@/components/challenge-demos";
import { CodeBlock } from "@/components/ui/code-block";

const domainIcons: Record<DomainCategory, React.ReactNode> = {
  "react-architecture": <IconBrandReact className="size-4" />,
  "performance-scalability": <IconRocket className="size-4" />,
  "core-cs-javascript": <IconCode className="size-4" />,
  "custom-hooks-browser": <IconTools className="size-4" />,
};

const demoComponents: Record<string, React.ComponentType> = {
  "nested-comments": NestedCommentsDemo,
  "use-debounce": UseDebounceDemo,
  "virtual-list": VirtualListDemo,
};

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
    const currentIndex = challenges.findIndex(
      (c) => c.id === selectedChallengeId
    );
    if (currentIndex < challenges.length - 1) {
      const next = challenges[currentIndex + 1];
      setSelectedChallengeId(next.id);
      setSelectedSubcategory(next.subcategory);
    }
  };

  const DemoComponent = currentChallenge.demoComponentKey
    ? demoComponents[currentChallenge.demoComponentKey]
    : null;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - 2 Level Menu */}
      <aside className="w-72 border-r bg-card/50 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">Frontend Challenges</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {challenges.length} coding challenges
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {domainStructure.map((domain) => {
            const isExpanded = expandedDomains.includes(domain.id);
            const domainChallengeCount = domain.subcategories.reduce(
              (acc, sub) => acc + getChallengesBySubcategory(sub.id).length,
              0
            );

            return (
              <div key={domain.id} className="space-y-0.5">
                {/* Domain Header (Level 1) */}
                <button
                  onClick={() => toggleDomain(domain.id)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted"
                >
                  {domainIcons[domain.id]}
                  <span className="flex-1 text-left text-xs">
                    {domain.label}
                  </span>
                  <Badge variant="secondary" className="text-xs mr-1">
                    {domainChallengeCount}
                  </Badge>
                  {isExpanded ? (
                    <IconChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <IconChevronRight className="size-4 text-muted-foreground" />
                  )}
                </button>

                {/* Subcategories (Level 2) */}
                {isExpanded && (
                  <div className="ml-4 pl-3 border-l border-muted space-y-0.5">
                    {domain.subcategories.map((sub) => {
                      const subCount = getChallengesBySubcategory(
                        sub.id
                      ).length;
                      const isActive = selectedSubcategory === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubcategoryChange(sub.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span className="flex-1 text-left">{sub.label}</span>
                          <Badge
                            variant={isActive ? "default" : "secondary"}
                            className="text-[10px] h-5"
                          >
                            {subCount}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Mid → Senior Level
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Dropdown */}
        <header className="border-b p-4 flex items-center gap-4">
          <Select
            value={selectedChallengeId}
            onValueChange={setSelectedChallengeId}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select challenge" />
            </SelectTrigger>
            <SelectContent>
              {filteredChallenges.map((challenge) => (
                <SelectItem key={challenge.id} value={challenge.id}>
                  {challenge.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge
            variant={
              currentChallenge.difficulty === "Senior"
                ? "destructive"
                : "secondary"
            }
          >
            {currentChallenge.difficulty}
          </Badge>

          <div className="flex-1" />

          <div className="flex items-center gap-1 border rounded-md p-0.5">
            <Button
              variant={viewMode === "tabs" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tabs")}
              className="h-7 px-2"
            >
              <IconLayoutRows className="size-4" />
            </Button>
            <Button
              variant={viewMode === "split" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="h-7 px-2"
            >
              <IconLayoutColumns className="size-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            {copied ? (
              <IconCheck className="size-4" />
            ) : (
              <IconCopy className="size-4" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Problem Statement */}
          <Card className="p-5 mb-6">
            <h2 className="text-xl font-semibold mb-3">
              {currentChallenge.title}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Problem Statement
                </h3>
                <p className="text-sm">{currentChallenge.statement}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Constraints & Edge Cases
                </h3>
                <ul className="space-y-1">
                  {currentChallenge.constraints.map((constraint, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>

              {currentChallenge.complexity && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Complexity
                    </h3>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {currentChallenge.complexity}
                    </code>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Code / Preview - Tabs or Split View */}
          {viewMode === "tabs" ? (
            <Tabs defaultValue="code" className="w-full">
              <TabsList variant="line">
                <TabsTrigger value="code">
                  <IconCode className="size-4" />
                  Solution Code
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <IconPlayerPlay className="size-4" />
                  Live Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-4">
                <Card className="p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                    <span className="text-xs text-muted-foreground">
                      {currentChallenge.language}
                    </span>
                  </div>
                  <pre className="p-4 overflow-auto text-sm max-h-[400px] bg-background">
                    <code>{currentChallenge.code}</code>
                  </pre>
                </Card>

                {/* Common Mistakes */}
                <Card className="p-4 mt-4 border-destructive/30 bg-destructive/5">
                  <h3 className="text-sm font-semibold text-destructive mb-2">
                    Common Mistakes
                  </h3>
                  <ul className="space-y-1">
                    {currentChallenge.commonMistakes.map((mistake, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <IconX className="size-4 text-destructive " />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                {DemoComponent ? (
                  <DemoComponent />
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    <IconCode className="size-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      Live preview not available for this challenge.
                    </p>
                    <p className="text-xs mt-1">
                      This is an algorithm challenge - check the Solution Code
                      tab.
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            /* Split View Mode */
            <div className="grid grid-cols-2 gap-4">
              {/* Left: Solution Code */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IconCode className="size-4" />
                  Solution Code
                </div>
                <Card className="p-0 overflow-hidden gap-0">
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                    <span className="text-xs text-muted-foreground">
                      {currentChallenge.language}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                    >
                      {copied ? (
                        <IconCheck className="size-4" />
                      ) : (
                        <IconCopy className="size-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <CodeBlock
                    className="rounded-none"
                    code={currentChallenge.code}
                    language={currentChallenge.language || "tsx"}
                    showLineNumbers
                  />
                </Card>

                {/* Common Mistakes */}
                <Card className="p-4 border-destructive/30 bg-destructive/5">
                  <h3 className="text-sm font-semibold text-destructive mb-2">
                    Common Mistakes
                  </h3>
                  <ul className="space-y-1">
                    {currentChallenge.commonMistakes.map((mistake, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-destructive">✗</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Right: Live Preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IconPlayerPlay className="size-4" />
                  Live Preview
                </div>
                {DemoComponent ? (
                  <DemoComponent />
                ) : (
                  <Card className="p-8 text-center text-muted-foreground h-[350px] flex flex-col items-center justify-center">
                    <IconCode className="size-12 mb-3 opacity-30" />
                    <p className="text-sm">
                      Live preview not available for this challenge.
                    </p>
                    <p className="text-xs mt-1">
                      This is an algorithm challenge.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <footer className="border-t p-4 flex items-center justify-between bg-card/50">
          <div className="text-xs text-muted-foreground">
            Challenge{" "}
            {challenges.findIndex((c) => c.id === selectedChallengeId) + 1} of{" "}
            {challenges.length}
          </div>

          <div className="flex items-center gap-2">
            {DemoComponent && (
              <Button variant="outline" size="sm">
                <IconPlayerPlay className="size-4" />
                Run Demo
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleNextChallenge}
              disabled={
                challenges.findIndex((c) => c.id === selectedChallengeId) ===
                challenges.length - 1
              }
            >
              Next Challenge
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
