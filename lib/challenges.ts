// Domain Categories (Level 1)
export type DomainCategory =
  | "react-architecture"
  | "performance-scalability"
  | "core-cs-javascript"
  | "custom-hooks-browser";

// Skill Subcategories (Level 2)
export type SkillSubcategory =
  // React & Component Architecture
  | "design-patterns"
  | "state-management"
  | "recursive-ui"
  // Performance & Scalability
  | "rendering-optimization"
  | "network-caching"
  | "offloading-computation"
  // Core CS & JavaScript
  | "data-structures"
  | "async-flow"
  | "object-logic"
  // Custom Hooks & Browser API
  | "dom-interaction"
  | "event-systems";

export interface Challenge {
  id: string;
  title: string;
  domain: DomainCategory;
  subcategory: SkillSubcategory;
  difficulty: "Mid" | "Senior";
  statement: string;
  constraints: string[];
  complexity?: string;
  code: string;
  language: "tsx" | "typescript" | "javascript";
  commonMistakes: string[];
  demoComponentKey?: string;
}

export interface SubcategoryInfo {
  id: SkillSubcategory;
  label: string;
  description: string;
}

export interface DomainInfo {
  id: DomainCategory;
  label: string;
  icon: string;
  subcategories: SubcategoryInfo[];
}

import nestedComments from "@/data/challenges/nested-comments.json";
import useDebounce from "@/data/challenges/use-debounce.json";
import compoundTabs from "@/data/challenges/compound-tabs.json";
import deepMerge from "@/data/challenges/deep-merge.json";
import flatToTree from "@/data/challenges/flat-to-tree.json";
import lruCache from "@/data/challenges/lru-cache.json";
import longestSubstring from "@/data/challenges/longest-substring.json";
import virtualList from "@/data/challenges/virtual-list.json";
import webWorkerFilter from "@/data/challenges/web-worker-filter.json";
import memoizeTtl from "@/data/challenges/memoize-ttl.json";

export const domainStructure: DomainInfo[] = [
  {
    id: "react-architecture",
    label: "React & Component Architecture",
    icon: "IconBrandReact",
    subcategories: [
      {
        id: "design-patterns",
        label: "Design Patterns",
        description: "Compound Components, Render Props, HOCs",
      },
      {
        id: "state-management",
        label: "State Management",
        description: "Complex State, Undo/Redo, Context API",
      },
      {
        id: "recursive-ui",
        label: "Recursive UI",
        description: "Nested Data, Tree View",
      },
    ],
  },
  {
    id: "performance-scalability",
    label: "Performance & Scalability",
    icon: "IconRocket",
    subcategories: [
      {
        id: "rendering-optimization",
        label: "Rendering Optimization",
        description: "Windowing/Virtualization, Memoization",
      },
      {
        id: "network-caching",
        label: "Network & Caching",
        description: "Debouncing, Throttling, LRU Cache",
      },
      {
        id: "offloading-computation",
        label: "Offloading Computation",
        description: "Web Workers, Batching",
      },
    ],
  },
  {
    id: "core-cs-javascript",
    label: "Core CS & JavaScript",
    icon: "IconCode",
    subcategories: [
      {
        id: "data-structures",
        label: "Data Structures",
        description: "Tree Transformation, Linked List, Map/Set",
      },
      {
        id: "async-flow",
        label: "Asynchronous Flow",
        description: "Concurrency Limit, Task Queue, Custom Promises",
      },
      {
        id: "object-logic",
        label: "Object & Logic",
        description: "Deep Merge, Path Finding, Memoize",
      },
    ],
  },
  {
    id: "custom-hooks-browser",
    label: "Custom Hooks & Browser API",
    icon: "IconTools",
    subcategories: [
      {
        id: "dom-interaction",
        label: "DOM Interaction",
        description: "Intersection Observer, Resize Observer",
      },
      {
        id: "event-systems",
        label: "Event Systems",
        description: "Pub/Sub, Custom Event Emitter",
      },
    ],
  },
];

type RawChallenge = Omit<Challenge, "code"> & {
  code?: string;
  codeLines?: string[];
};

const rawChallenges: RawChallenge[] = [
  nestedComments,
  useDebounce,
  compoundTabs,
  deepMerge,
  flatToTree,
  lruCache,
  longestSubstring,
  virtualList,
  webWorkerFilter,
  memoizeTtl,
].map((challenge) => ({
  ...challenge,
  // JSON imports type domain/subcategory as string; narrow to our union types.
  domain: challenge.domain as DomainCategory,
  subcategory: challenge.subcategory as SkillSubcategory,
  difficulty: challenge.difficulty as Challenge["difficulty"],
  language: challenge.language as Challenge["language"],
}));

export const challenges: Challenge[] = rawChallenges.map((item) => ({
  ...item,
  code: item.code ?? (item.codeLines ? item.codeLines.join("\n") : ""),
}));

// Legacy compatibility for current page usage
export type ChallengeCategory = DomainCategory;
export const categories: Record<
  ChallengeCategory,
  { label: string; icon: string }
> = Object.fromEntries(
  domainStructure.map((d) => [d.id, { label: d.label, icon: d.icon }])
) as Record<ChallengeCategory, { label: string; icon: string }>;

export function getChallengesByDomain(domain: DomainCategory): Challenge[] {
  return challenges.filter((c) => c.domain === domain);
}

export function getChallengesBySubcategory(
  subcategory: SkillSubcategory
): Challenge[] {
  return challenges.filter((c) => c.subcategory === subcategory);
}

export function getChallengesByCategory(
  category: ChallengeCategory
): Challenge[] {
  return getChallengesByDomain(category);
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}

export function getSubcategoryInfo(
  subcategory: SkillSubcategory
): SubcategoryInfo | undefined {
  for (const domain of domainStructure) {
    const sub = domain.subcategories.find((s) => s.id === subcategory);
    if (sub) return sub;
  }
  return undefined;
}

export function getDomainBySubcategory(
  subcategory: SkillSubcategory
): DomainInfo | undefined {
  return domainStructure.find((d) =>
    d.subcategories.some((s) => s.id === subcategory)
  );
}
