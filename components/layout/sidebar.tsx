import {
  IconChevronRight,
  IconChevronDown,
  IconChevronLeft,
  IconCode,
  IconRocket,
  IconBrandReact,
  IconTools,
  IconSparkles,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  domainStructure,
  getChallengesBySubcategory,
  getDomainBySubcategory,
  type Challenge,
  type DomainCategory,
  type SkillSubcategory,
} from "@/lib/challenges";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const domainIcons: Record<DomainCategory, ReactNode> = {
  "react-architecture": <IconBrandReact className="size-4" />,
  "performance-scalability": <IconRocket className="size-4" />,
  "core-cs-javascript": <IconCode className="size-4" />,
  "custom-hooks-browser": <IconTools className="size-4" />,
  "animation-interaction": <IconSparkles className="size-4" />,
};

interface SidebarProps {
  isCollapsed: boolean;
  expandedDomains: DomainCategory[];
  selectedSubcategory: SkillSubcategory;
  onToggleCollapse: () => void;
  onToggleDomain: (domain: DomainCategory) => void;
  onSubcategoryChange: (subcategory: SkillSubcategory) => void;
  challengeCount: number;
  challenges: Challenge[];
}

export function Sidebar({
  isCollapsed,
  expandedDomains,
  selectedSubcategory,
  onToggleCollapse,
  onToggleDomain,
  onSubcategoryChange,
  challengeCount,
  challenges,
}: SidebarProps) {
  const selectedDomain = getDomainBySubcategory(selectedSubcategory)?.id;

  return (
    <aside
      className={cn(
        "border-r bg-card/50 flex flex-col transition-all duration-200",
        isCollapsed ? "w-16" : "w-72",
      )}
    >
      <div className="p-4 border-b h-16">
        <div className="flex gap-2 items-center justify-between relative">
          <div className="flex gap-2 items-center min-w-0">
            <div
              className="h-8 w-8 bg-primary shrink-0"
              style={{
                maskImage: 'url("/logo/femaster-icon.svg")',
                WebkitMaskImage: 'url("/logo/femaster-icon.svg")',
                maskRepeat: "no-repeat",
                maskSize: "contain",
              }}
            />
            {!isCollapsed && (
              <h1 className="text-2xl font-semibold">Femaster</h1>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 w-6",
              isCollapsed
                ? " absolute left-9 top-0"
                : " absolute right-3 top-0",
            )}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <IconChevronRight className="size-4" />
            ) : (
              <IconChevronLeft className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {isCollapsed ? (
        <nav className="flex-1 p-2 space-y-1 overflow-auto">
          {domainStructure.map((domain) => {
            const isActive = selectedDomain === domain.id;
            const domainChallengeCount = domain.subcategories.reduce(
              (acc, sub) =>
                acc + getChallengesBySubcategory(challenges, sub.id).length,
              0,
            );

            return (
              <button
                key={domain.id}
                onClick={() => onToggleDomain(domain.id)}
                className={cn(
                  "w-full flex items-center justify-center p-2 transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={`${domain.label} (${domainChallengeCount})`}
                aria-label={domain.label}
              >
                {domainIcons[domain.id]}
              </button>
            );
          })}
        </nav>
      ) : (
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {domainStructure.map((domain) => {
            const isExpanded = expandedDomains.includes(domain.id);
            const domainChallengeCount = domain.subcategories.reduce(
              (acc, sub) =>
                acc + getChallengesBySubcategory(challenges, sub.id).length,
              0,
            );

            return (
              <div key={domain.id} className="space-y-0.5">
                {/* Domain Header (Level 1) */}
                <button
                  onClick={() => onToggleDomain(domain.id)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
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
                        challenges,
                        sub.id,
                      ).length;
                      const isActive = selectedSubcategory === sub.id;
                      const isEmpty = subCount === 0;

                      return (
                        <button
                          key={sub.id}
                          onClick={() =>
                            !isEmpty && onSubcategoryChange(sub.id)
                          }
                          disabled={isEmpty}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                            isEmpty
                              ? "text-muted-foreground/50 cursor-not-allowed"
                              : isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span className="flex-1 text-left">{sub.label}</span>
                          {isEmpty ? (
                            <span className="text-[10px] text-muted-foreground/60 font-medium">
                              Coming Soon
                            </span>
                          ) : (
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className="text-[10px] h-5"
                            >
                              {subCount}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}

      <div className="p-3 border-t">
        <p className="text-xs text-muted-foreground text-center">
          {isCollapsed ? `${challengeCount} challenges` : "@all right serviced"}
        </p>
      </div>
    </aside>
  );
}
