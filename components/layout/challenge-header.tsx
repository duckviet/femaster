import { useCallback } from "react";
import {
  IconCode,
  IconCopy,
  IconCheck,
  IconChevronRight,
  IconLayoutColumns,
  IconLayoutRows,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Challenge } from "@/lib/challenges";

interface ChallengeHeaderProps {
  currentChallenge: Challenge;
  filteredChallenges: Challenge[];
  selectedChallengeId: string;
  viewMode: "tabs" | "split";
  copied: boolean;
  onChallengeChange: (id: string) => void;
  onCopyCode: () => void;
  onViewModeChange: (mode: "tabs" | "split") => void;
}

export function ChallengeHeader({
  currentChallenge,
  filteredChallenges,
  selectedChallengeId,
  viewMode,
  copied,
  onChallengeChange,
  onCopyCode,
  onViewModeChange,
}: ChallengeHeaderProps) {
  return (
    <header className="border-b p-4 flex items-center gap-4">
      <Select value={selectedChallengeId} onValueChange={onChallengeChange}>
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
          currentChallenge.difficulty === "Senior" ? "destructive" : "secondary"
        }
      >
        {currentChallenge.difficulty}
      </Badge>

      <div className="flex-1" />

      <div className="flex items-center gap-1 border rounded-md p-0.5">
        <Button
          variant={viewMode === "tabs" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("tabs")}
          className="h-7 px-2"
        >
          <IconLayoutRows className="size-4" />
        </Button>
        <Button
          variant={viewMode === "split" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("split")}
          className="h-7 px-2"
        >
          <IconLayoutColumns className="size-4" />
        </Button>
      </div>

      <Button variant="outline" size="sm" onClick={onCopyCode}>
        {copied ? (
          <IconCheck className="size-4" />
        ) : (
          <IconCopy className="size-4" />
        )}
        {copied ? "Copied!" : "Copy Code"}
      </Button>
    </header>
  );
}
