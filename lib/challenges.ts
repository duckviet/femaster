// Domain Categories (Level 1)
export type DomainCategory =
  | "react-architecture"
  | "performance-scalability"
  | "core-cs-javascript"
  | "custom-hooks-browser"
  | "animation-interaction";

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
  | "event-systems"
  // Animation & Motion
  | "custom-cursor"
  | "scroll-trigger"
  | "image-sequence"
  | "page-transition";

export interface Challenge {
  id: string;
  title: string;
  domain: DomainCategory;
  subcategory: SkillSubcategory;
  difficulty: "Mid" | "Senior";
  statement: string;
  constraints: string[];
  complexity?: string;
  code: { language: "tsx" | "typescript" | "javascript"; content: string }[];
  language: "tsx" | "typescript" | "javascript";
  commonMistakes: string[];
  demoComponentKey?: string;
  practicable?: boolean;
  functionName?: string;
  testCases?: Array<{
    name: string;
    args: any[];
    expected: any;
  }>;
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
  {
    id: "animation-interaction",
    label: "Animation & Interaction",
    icon: "IconSparkles",
    subcategories: [
      {
        id: "custom-cursor",
        label: "Custom Cursor",
        description: "Motion values, springs, transforms",
      },
      {
        id: "scroll-trigger",
        label: "Scroll Trigger",
        description: "Motion values, springs, transforms",
      },
      {
        id: "image-sequence",
        label: "Image Sequence",
        description: "Motion values, springs, transforms",
      },
      {
        id: "page-transition",
        label: "Page Transition",
        description: "Motion values, springs, transforms",
      },
    ],
  },
];

export function normalizeChallengeImport(raw: any): Challenge {
  const normalizedCode = (raw.code || []).map((entry: any) => ({
    ...entry,
    content: Array.isArray(entry.content)
      ? entry.content.join("\n")
      : (entry.content ?? ""),
  }));

  return {
    ...raw,
    domain: raw.domain as DomainCategory,
    subcategory: raw.subcategory as SkillSubcategory,
    difficulty: raw.difficulty as Challenge["difficulty"],
    language: normalizedCode[0]?.language as Challenge["language"],
    code: normalizedCode as Challenge["code"],
  };
}

// Legacy compatibility for current page usage
export type ChallengeCategory = DomainCategory;
export const categories: Record<
  ChallengeCategory,
  { label: string; icon: string }
> = Object.fromEntries(
  domainStructure.map((d) => [d.id, { label: d.label, icon: d.icon }]),
) as Record<ChallengeCategory, { label: string; icon: string }>;

export function getChallengesByDomain(
  allChallenges: Challenge[],
  domain: DomainCategory,
): Challenge[] {
  return allChallenges.filter((c) => c.domain === domain);
}

export function getChallengesBySubcategory(
  allChallenges: Challenge[],
  subcategory: SkillSubcategory,
): Challenge[] {
  return allChallenges.filter((c) => c.subcategory === subcategory);
}

export function getChallengesByCategory(
  allChallenges: Challenge[],
  category: ChallengeCategory,
): Challenge[] {
  return getChallengesByDomain(allChallenges, category);
}

export function getSubcategoryInfo(
  subcategory: SkillSubcategory,
): SubcategoryInfo | undefined {
  for (const domain of domainStructure) {
    const sub = domain.subcategories.find((s) => s.id === subcategory);
    if (sub) return sub;
  }
  return undefined;
}

export function getDomainBySubcategory(
  subcategory: SkillSubcategory,
): DomainInfo | undefined {
  return domainStructure.find((d) =>
    d.subcategories.some((s) => s.id === subcategory),
  );
}
