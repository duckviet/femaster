import {
  NestedCommentsDemo,
  UseDebounceDemo,
  VirtualListDemo,
  CompoundTabsDemo,
  LRUCacheDemo,
  WebWorkerFilterDemo,
  DeepMergeDemo,
  FlatToTreeDemo,
  LongestSubstringDemo,
  MemoizeTTLDemo,
  HOCPatternDemo,
  RenderPropsDemo,
  UndoRedoDemo,
  FileExplorerDemo,
  MemoStrategyDemo,
  InfiniteScrollDemo,
  CustomCursorDemo,
} from "@/components/challenge-demos";

export const demoRegistry = {
  "nested-comments": NestedCommentsDemo,
  "use-debounce": UseDebounceDemo,
  "virtual-list": VirtualListDemo,
  CompoundTabsDemo: CompoundTabsDemo,
  LRUCacheDemo: LRUCacheDemo,
  WebWorkerFilterDemo: WebWorkerFilterDemo,
  DeepMergeDemo: DeepMergeDemo,
  FlatToTreeDemo: FlatToTreeDemo,
  LongestSubstringDemo: LongestSubstringDemo,
  MemoizeTTLDemo: MemoizeTTLDemo,
  HOCPatternDemo: HOCPatternDemo,
  RenderPropsDemo: RenderPropsDemo,
  UndoRedoDemo: UndoRedoDemo,
  FileExplorerDemo: FileExplorerDemo,
  MemoStrategyDemo: MemoStrategyDemo,
  InfiniteScrollDemo: InfiniteScrollDemo,
  CustomCursorDemo: CustomCursorDemo,
} as const;

export type DemoKey = keyof typeof demoRegistry;

export function getDemoComponent(
  demoComponentKey?: string,
): React.ComponentType | null {
  if (!demoComponentKey) return null;
  return demoRegistry[demoComponentKey as DemoKey] ?? null;
}
