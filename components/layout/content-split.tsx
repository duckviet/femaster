import {
  IconCode,
  IconCopy,
  IconCheck,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/lib/challenges";

interface ContentSplitProps {
  challenge: Challenge;
  DemoComponent: React.ComponentType | null;
  copied: boolean;
  onCopyCode: () => void;
}

export function ContentSplit({
  challenge,
  DemoComponent,
  copied,
  onCopyCode,
}: ContentSplitProps) {
  return (
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
          <CodeBlock
            className="rounded-none"
            code={challenge.code}
            language={challenge.language || "tsx"}
            showLineNumbers
          />
        </Card>

        {/* Common Mistakes */}
        <Card className="p-4 border-destructive/30 bg-destructive/5">
          <h3 className="text-sm font-semibold text-destructive mb-2">
            Common Mistakes
          </h3>
          <ul className="space-y-1">
            {challenge.commonMistakes.map((mistake, i) => (
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
            <p className="text-xs mt-1">This is an algorithm challenge.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
