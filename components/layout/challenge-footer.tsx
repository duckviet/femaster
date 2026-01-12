import {
  IconChevronRight,
  IconChevronLeft,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface ChallengeFooterProps {
  currentIndex: number;
  totalChallenges: number;
  hasDemo: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNextChallenge: () => void;
  onPrevChallenge: () => void;
  onRunDemo?: () => void;
}

export function ChallengeFooter({
  currentIndex,
  totalChallenges,
  hasDemo,
  canGoNext,
  canGoPrev,
  onNextChallenge,
  onPrevChallenge,
  onRunDemo,
}: ChallengeFooterProps) {
  return (
    <footer className="border-t p-4 flex items-center justify-between bg-card/50">
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground">
          Challenge {currentIndex + 1} of {totalChallenges}
        </div>
        <div className="text-[10px] text-muted-foreground/60">
          (←/→ to navigate, 1-9 for quick select)
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasDemo && (
          <Button variant="outline" size="sm" onClick={onRunDemo}>
            <IconPlayerPlay className="size-4" />
            Run Demo
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={onPrevChallenge}
          disabled={!canGoPrev}
        >
          <IconChevronLeft className="size-4" />
          Previous
        </Button>

        <Button size="sm" onClick={onNextChallenge} disabled={!canGoNext}>
          Next
          <IconChevronRight className="size-4" />
        </Button>
      </div>
    </footer>
  );
}
