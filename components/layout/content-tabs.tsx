import {
  IconCode,
  IconCopy,
  IconCheck,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/lib/challenges";
import { CodeBlock } from "../ui/code-block";
import { Suspense } from "react";
import { DemoModal } from "./demo-modal";

interface ContentTabsProps {
  challenge: Challenge;
  DemoComponent: React.ComponentType | null;
  copied: boolean;
  onCopyCode: () => void;
}

export function ContentTabs({
  challenge,
  DemoComponent,
  copied,
  onCopyCode,
}: ContentTabsProps) {
  return (
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
              {challenge.language}
            </span>
            <Button variant="outline" size="sm" onClick={onCopyCode}>
              {copied ? (
                <IconCheck className="size-4" />
              ) : (
                <IconCopy className="size-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Suspense
            fallback={
              <div className="rounded-none bg-[#24292e] p-4 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                </div>
              </div>
            }
          >
            <CodeBlock
              className="rounded-none"
              code={challenge.code}
              language={challenge.language || "tsx"}
              showLineNumbers
            />
          </Suspense>
        </Card>

        {/* Common Mistakes */}
        <Card className="p-4 mt-4 border-destructive/30 bg-destructive/5">
          <h3 className="text-sm font-semibold text-destructive mb-2">
            Common Mistakes
          </h3>
          <ul className="space-y-1">
            {challenge.commonMistakes.map((mistake, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <IconX className="size-4 text-destructive" />
                {mistake}
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        {DemoComponent ? (
          <DemoModal>
            <DemoComponent />
          </DemoModal>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <IconCode className="size-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Live preview not available for this challenge.
            </p>
            <p className="text-xs mt-1">
              This is an algorithm challenge - check the Solution Code tab.
            </p>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
