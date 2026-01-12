import {
  IconChevronRight,
  IconChevronDown,
  IconCode,
  IconRocket,
  IconBrandReact,
  IconTools,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  domainStructure,
  getChallengesBySubcategory,
  type DomainCategory,
  type SkillSubcategory,
} from "@/lib/challenges";
import { ReactNode } from "react";

const domainIcons: Record<DomainCategory, ReactNode> = {
  "react-architecture": <IconBrandReact className="size-4" />,
  "performance-scalability": <IconRocket className="size-4" />,
  "core-cs-javascript": <IconCode className="size-4" />,
  "custom-hooks-browser": <IconTools className="size-4" />,
};

interface SidebarProps {
  expandedDomains: DomainCategory[];
  selectedSubcategory: SkillSubcategory;
  onToggleDomain: (domain: DomainCategory) => void;
  onSubcategoryChange: (subcategory: SkillSubcategory) => void;
  challengeCount: number;
}

export function Sidebar({
  expandedDomains,
  selectedSubcategory,
  onToggleDomain,
  onSubcategoryChange,
  challengeCount,
}: SidebarProps) {
  return (
    <aside className="w-72 border-r bg-card/50 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">Frontend Challenges</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {challengeCount} coding challenges
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
                onClick={() => onToggleDomain(domain.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted"
              >
                {domainIcons[domain.id]}
                <span className="flex-1 text-left text-xs">{domain.label}</span>
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
                    const subCount = getChallengesBySubcategory(sub.id).length;
                    const isActive = selectedSubcategory === sub.id;
                    const isEmpty = subCount === 0;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => !isEmpty && onSubcategoryChange(sub.id)}
                        disabled={isEmpty}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
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

      <div className="p-3 border-t">
        <p className="text-xs text-muted-foreground text-center">@</p>
      </div>
    </aside>
  );
}
