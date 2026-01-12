import { IconChevronRight, IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface ChallengeFooterProps {
  currentIndex: number;
  totalChallenges: number;
  hasDemo: boolean;
  canGoNext: boolean;
  onNextChallenge: () => void;
}

export function ChallengeFooter({
  currentIndex,
  totalChallenges,
  hasDemo,
  canGoNext,
  onNextChallenge,
}: ChallengeFooterProps) {
  return (
    <footer className="border-t p-4 flex items-center justify-between bg-card/50">
      <div className="text-xs text-muted-foreground">
        Challenge {currentIndex + 1} of {totalChallenges}
      </div>

      <div className="flex items-center gap-2">
        {hasDemo && (
          <Button variant="outline" size="sm">
            <IconPlayerPlay className="size-4" />
            Run Demo
          </Button>
        )}

        <Button size="sm" onClick={onNextChallenge} disabled={!canGoNext}>
          Next Challenge
          <IconChevronRight className="size-4" />
        </Button>
      </div>
    </footer>
  );
}
