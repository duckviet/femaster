"use client";

import { useState, useMemo, useEffect } from "react";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { challenges, type Challenge, domainStructure } from "@/lib/challenges";

interface ChallengeSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectChallenge: (challengeId: string) => void;
}

type DifficultyFilter = "all" | "Mid" | "Senior";
type DomainFilter = "all" | string;

export function ChallengeSearch({
  open,
  onOpenChange,
  onSelectChallenge,
}: ChallengeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("all");

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDifficultyFilter("all");
      setDomainFilter("all");
    }
  }, [open]);

  // Fuzzy search implementation
  const filteredChallenges = useMemo(() => {
    let results = challenges;

    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      results = results.filter((c) => c.difficulty === difficultyFilter);
    }

    // Apply domain filter
    if (domainFilter !== "all") {
      results = results.filter((c) => c.domain === domainFilter);
    }

    // Apply search query (fuzzy matching on title, statement, and common mistakes)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((challenge) => {
        const titleMatch = challenge.title.toLowerCase().includes(query);
        const statementMatch = challenge.statement
          .toLowerCase()
          .includes(query);
        const mistakesMatch = challenge.commonMistakes.some((m) =>
          m.toLowerCase().includes(query)
        );

        // Simple fuzzy matching: check if query characters appear in order
        const fuzzyMatch = (text: string) => {
          const chars = query.split("");
          let lastIndex = -1;
          return chars.every((char) => {
            const index = text.toLowerCase().indexOf(char, lastIndex + 1);
            if (index > lastIndex) {
              lastIndex = index;
              return true;
            }
            return false;
          });
        };

        return (
          titleMatch ||
          statementMatch ||
          mistakesMatch ||
          fuzzyMatch(challenge.title)
        );
      });
    }

    return results;
  }, [searchQuery, difficultyFilter, domainFilter]);

  const handleSelectChallenge = (challengeId: string) => {
    onSelectChallenge(challengeId);
    onOpenChange(false);
  };

  const hasActiveFilters =
    difficultyFilter !== "all" || domainFilter !== "all" || searchQuery.trim();

  const clearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("all");
    setDomainFilter("all");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Search Challenges
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 border-b">
          {/* Search Input */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
              autoFocus
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <IconFilter className="size-4 text-muted-foreground" />
            <Select
              value={difficultyFilter}
              onValueChange={(value) =>
                setDifficultyFilter(value as DifficultyFilter)
              }
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulty</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={domainFilter}
              onValueChange={(value) => setDomainFilter(value as DomainFilter)}
            >
              <SelectTrigger className="w-[200px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domainStructure.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id}>
                    {domain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2"
              >
                <IconX className="size-3 mr-1" />
                Clear
              </Button>
            )}

            <div className="flex-1" />
            <div className="text-xs text-muted-foreground">
              {filteredChallenges.length} result
              {filteredChallenges.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto px-6 py-2">
          {filteredChallenges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-sm text-muted-foreground">
                No challenges found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {filteredChallenges.map((challenge, index) => (
                <button
                  key={challenge.id}
                  onClick={() => handleSelectChallenge(challenge.id)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent hover:border-accent-foreground/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-mono text-muted-foreground mt-1 w-6">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {challenge.title}
                        </h4>
                        <Badge
                          variant={
                            challenge.difficulty === "Senior"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {challenge.difficulty}
                        </Badge>
                        {challenge.demoComponentKey && (
                          <Badge variant="outline" className="text-xs">
                            Demo
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {challenge.statement}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-normal"
                        >
                          {
                            domainStructure.find(
                              (d) => d.id === challenge.domain
                            )?.label
                          }
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {challenge.subcategory}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <kbd className="px-2 py-1 bg-background border rounded text-xs">
                ↑↓
              </kbd>
              <span className="ml-1">Navigate</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-background border rounded text-xs">
                Enter
              </kbd>
              <span className="ml-1">Select</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-background border rounded text-xs">
                Esc
              </kbd>
              <span className="ml-1">Close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
