# Challenge Demo Implementation Plans

## Overview

Comprehensive guide for creating interactive and visual demos for FEMaster coding challenges. Each demo should help users understand the problem, see the solution in action, and experiment with different inputs.

---

## Demo Design Principles

### 1. Educational First

- **Show, Don't Tell**: Visualize the algorithm/pattern in action
- **Progressive Disclosure**: Start simple, allow complexity
- **Immediate Feedback**: Update in real-time as users interact
- **Visible State**: Display internal state, counters, metrics

### 2. User Interaction

- **Input Controls**: Text inputs, sliders, buttons, dropdowns
- **Real-time Updates**: Debounce/throttle where appropriate
- **Reset Functionality**: Easy way to start over
- **Example Presets**: Pre-filled examples for quick exploration

### 3. Visual Clarity

- **Highlighted States**: Use colors to show active/selected items
- **Animations**: Smooth transitions (not overwhelming)
- **Metrics Display**: Show performance data, counts, complexity
- **Responsive Design**: Work on mobile and desktop

### 4. Performance

- **Contained Scope**: Keep demos lightweight
- **Memoization**: Use React.memo, useMemo where needed
- **Lazy Loading**: Load heavy demos only when visible
- **Web Workers**: For computationally expensive demos

### 5. Code Structure

- **Self-Contained**: Each demo is independent
- **Reusable Components**: Extract common UI patterns
- **TypeScript**: Full type safety
- **Clean Code**: Follow project conventions

---

## Demo Architecture Patterns

### Pattern 1: Interactive Input/Output

**Used for**: Hooks, utilities, algorithms
**Structure**:

```tsx
export function DemoName() {
  const [input, setInput] = useState(initial);
  const output = useCustomHook(input); // or function(input)

  return (
    <div className="demo-container">
      <h3>Demo Title</h3>
      <InputControls value={input} onChange={setInput} />
      <MetricsDisplay />
      <OutputVisualization data={output} />
    </div>
  );
}
```

**Examples**: UseDebounceDemo, MemoizeTTLDemo

### Pattern 2: Recursive/Tree Visualization

**Used for**: Nested structures, trees, graphs
**Structure**:

```tsx
const RecursiveItem = ({ item, depth }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <ItemContent />
      {expanded &&
        item.children?.map((child) => (
          <RecursiveItem item={child} depth={depth + 1} />
        ))}
    </div>
  );
};
```

**Examples**: NestedCommentsDemo, FileExplorerDemo

### Pattern 3: List/Collection Operations

**Used for**: Data structure operations, virtualization
**Structure**:

```tsx
export function DemoName() {
  const [items, setItems] = useState(initialData);
  const handleOperation = (type, data) => {
    // add, remove, update logic
  };

  return (
    <div className="demo-container">
      <ControlPanel onOperation={handleOperation} />
      <ItemsList items={items} />
      <MetricsDisplay count={items.length} />
    </div>
  );
}
```

**Examples**: VirtualListDemo, LRUCacheDemo

### Pattern 4: Step-by-Step Execution

**Used for**: Algorithms, transformations
**Structure**:

```tsx
export function DemoName() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const steps = computeSteps(data);

  return (
    <div className="demo-container">
      <StepControls step={step} total={steps.length} />
      <Visualization data={steps[step]} />
      <Explanation text={steps[step].description} />
    </div>
  );
}
```

**Examples**: DeepMergeDemo, FlatToTreeDemo

### Pattern 5: Performance Comparison

**Used for**: Optimization patterns, workers
**Structure**:

```tsx
export function DemoName() {
  const [mode, setMode] = useState<'slow' | 'fast'>('slow');
  const [metrics, setMetrics] = useState({ time: 0, operations: 0 });

  const runBenchmark = async () => {
    const start = performance.now();
    await processData(mode);
    setMetrics({ time: performance.now() - start, ... });
  };

  return (
    <div className="demo-container">
      <ModeSelector value={mode} onChange={setMode} />
      <BenchmarkRunner onRun={runBenchmark} />
      <MetricsChart data={metrics} />
    </div>
  );
}
```

**Examples**: WebWorkerFilterDemo, React.memoDemo

---

## Demo Plans for Existing Challenges

### 1. Compound Tabs Demo

**Challenge**: Compound component pattern for tabs
**Demo Type**: Interactive Input/Output
**Priority**: High

**Features**:

- Interactive tab switching
- Controlled vs Uncontrolled modes toggle
- Custom tab content with forms
- Show component composition structure

**Implementation**: See [compound-tabs-demo.tsx](components/challenge-demos/compound-tabs-demo.tsx)

**Visual Elements**:

- Tab switching animations
- Active state indicator
- Mode badge (Controlled/Uncontrolled)
- State display panel

---

### 2. Deep Merge Demo

**Challenge**: Recursively merge nested objects
**Demo Type**: Step-by-Step Execution
**Priority**: High

**Features**:

- Two object editors (JSON input)
- Step-by-step merge visualization
- Highlight conflicting keys
- Show resolution strategy (overwrite, merge, array concat)

**Implementation**: See [deep-merge-demo.tsx](components/challenge-demos/deep-merge-demo.tsx)

**Visual Elements**:

- Side-by-side object display
- Tree view with expand/collapse
- Highlighted conflicting keys (yellow)
- Animation of merge operations
- Final result display

---

### 3. Flat to Tree Demo

**Challenge**: Convert flat array to tree structure
**Demo Type**: Interactive Input/Output
**Priority**: High

**Features**:

- Input: Flat array editor (id, parentId, name)
- Output: Visualized tree
- Add/remove nodes
- Show transformation steps
- Handle orphaned nodes

**Implementation**: See [flat-to-tree-demo.tsx](components/challenge-demos/flat-to-tree-demo.tsx)

**Visual Elements**:

- Editable table for flat data
- Hierarchical tree visualization
- Connecting lines between parent/child
- Orphan nodes warning
- Add/remove node buttons

---

### 4. LRU Cache Demo

**Challenge**: Implement Least Recently Used cache
**Demo Type**: List/Collection Operations
**Priority**: High

**Features**:

- Interactive get/put operations
- Visual cache state (list with capacity)
- Highlight recently used item
- Show eviction when capacity exceeded
- Operation history log
- Performance metrics (hit/miss rate)

**Implementation**: See [lru-cache-demo.tsx](components/challenge-demos/lru-cache-demo.tsx)

**Visual Elements**:

- Horizontal cache visualization (MRU → LRU)
- Color coding (green for MRU, red for LRU)
- Real-time statistics
- Operation history log
- Capacity indicator

---

### 5. Longest Substring Demo

**Challenge**: Find longest substring without repeating characters
**Demo Type**: Step-by-Step Execution
**Priority**: Medium

**Features**:

- Text input
- Character-by-character visualization
- Sliding window highlight
- Current substring display
- Max length tracking

**Implementation**: See [longest-substring-demo.tsx](components/challenge-demos/longest-substring-demo.tsx)

**Visual Elements**:

- Character grid with sliding window
- Current pointer highlight (orange ring)
- Window highlight (blue background)
- Play/pause animation
- Current vs max comparison

---

### 6. Web Worker Filter Demo

**Challenge**: Filter large dataset using Web Worker
**Demo Type**: Performance Comparison
**Priority**: High

**Features**:

- Toggle: Main Thread vs Web Worker
- Large dataset (100k items)
- Real-time filtering
- Performance metrics comparison
- CPU usage indicator
- Blocking vs non-blocking demonstration

**Implementation**: See [web-worker-filter-demo.tsx](components/challenge-demos/web-worker-filter-demo.tsx)

**Visual Elements**:

- Main thread vs Worker toggle
- Processing time comparison
- Blocking indicator
- Interactive button to test UI freeze
- Performance metrics chart
- Results preview

---

### 7. Memoize TTL Demo

**Challenge**: Function memoization with TTL (time-to-live)
**Demo Type**: Interactive Input/Output
**Priority**: Medium

**Features**:

- Function input (expensive calculation)
- TTL slider (1-10 seconds)
- Call history with timestamps
- Cache hit/miss indicator
- Cache expiration visualization
- Performance comparison

**Implementation**: See [memoize-ttl-demo.tsx](components/challenge-demos/memoize-ttl-demo.tsx)

**Visual Elements**:

- TTL slider with visual indicator
- Call history with timestamps
- Cache hit/miss badges
- Expiration countdown
- Performance statistics
- Cache state visualization

---

## Implemented Demos

### Completed (12/12) ✅

All demos are now fully implemented with interactive visualizations:

1. **Nested Comments Demo** - Recursive comment system with expand/collapse
2. **Use Debounce Demo** - Real-time search with debounce visualization
3. **Virtual List Demo** - Windowing/virtualization for large lists
4. **Compound Tabs Demo** - Compound component pattern with controlled/uncontrolled modes
5. **LRU Cache Demo** - O(1) cache operations with MRU/LRU visualization
6. **Web Worker Filter Demo** - Main thread vs worker performance comparison
7. **Deep Merge Demo** - Step-by-step object merging with conflict resolution
8. **Flat to Tree Demo** - Array-to-tree conversion with node management
9. **Longest Substring Demo** - Sliding window algorithm with animation
10. **Memoize TTL Demo** - Function caching with TTL expiration tracking
11. **HOC Pattern Demo** ✨ - Higher-Order Component composition with auth and logging
12. **Render Props Demo** ✨ - Mouse tracking with multiple render implementations

---

## Demo Plans for Future Challenges

### React & Component Architecture

#### Undo/Redo Demo

**Priority**: Medium
**Features**:

- Drawing canvas
- Undo/redo buttons with keyboard shortcuts
- History stack visualization
- Time-travel slider

#### File Explorer Demo

**Features**:

- Expandable folder tree
- Add/delete files/folders
- Search functionality
- Drag-and-drop (bonus)

---

### Performance & Scalability

#### Infinite Scroll Demo

**Features**:

- Image gallery with pagination
- Scroll to load more
- Loading skeleton states
- Scroll position indicator

#### useThrottle Demo

**Features**:

- Scroll position tracker
- Throttled vs unthrottled comparison
- Call frequency chart
- Performance metrics

#### SWR Pattern Demo

**Features**:

- Stale data display with refetch indicator
- Manual revalidation button
- Cache status display
- Background refetch visualization

---

### Core CS & JavaScript

#### Trie Autocomplete Demo

**Features**:

- Input with autocomplete dropdown
- Tree visualization of trie structure
- Insert word functionality
- Prefix highlight

#### Promise Combinators Demo

**Features**:

- Multiple async tasks with delays
- Toggle between Promise.all/race/allSettled
- Visual task execution timeline
- Result comparison

#### Retry with Backoff Demo

**Features**:

- Flaky API simulation
- Retry attempts counter
- Exponential backoff visualization
- Success/failure metrics

#### Deep Clone Demo

**Features**:

- Object editor with circular references
- Clone result display
- Reference comparison
- Performance metrics

---

### Custom Hooks & Browser API

#### useIntersectionObserver Demo

**Features**:

- Scrollable list with lazy-loaded images
- Intersection status indicators
- Threshold slider
- Performance metrics

#### useClickOutside Demo

**Features**:

- Dropdown menu
- Modal dialog
- Click counter (inside vs outside)
- Multiple instances

#### useDragAndDrop Demo

**Features**:

- Kanban board
- Drag items between columns
- Drop zone highlights
- Reorder within column

#### Event Emitter Demo

**Features**:

- Multiple subscribers
- Emit custom events
- Event history log
- Unsubscribe functionality

---

## Component Structure

### Recommended File Structure

```
components/
  challenge-demos/
    nested-comments-demo.tsx
    use-debounce-demo.tsx
    virtual-list-demo.tsx
    compound-tabs-demo.tsx
    deep-merge-demo.tsx
    flat-to-tree-demo.tsx
    lru-cache-demo.tsx
    longest-substring-demo.tsx
    web-worker-filter-demo.tsx
    memoize-ttl-demo.tsx
    index.ts                    # Export all demos
    shared/                     # Shared demo components
      demo-container.tsx
      control-panel.tsx
      metrics-display.tsx
      step-controls.tsx
      code-highlighter.tsx
    workers/                    # Web Workers
      filter-worker.ts
    utils/                      # Demo utilities
      demo-data-generator.ts
      performance-tracker.ts
      animation-helpers.ts
```

### Shared Component Templates

#### DemoContainer

```tsx
interface DemoContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function DemoContainer({
  title,
  subtitle,
  children,
  actions,
}: DemoContainerProps) {
  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
```

#### MetricsDisplay

```tsx
interface Metric {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
}

export function MetricsDisplay({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className={`p-3 rounded text-center ${getVariantClass(
            metric.variant
          )}`}
        >
          <div className="text-xs text-muted-foreground">{metric.label}</div>
          <div className="text-lg font-bold">{metric.value}</div>
        </div>
      ))}
    </div>
  );
}
```

#### StepControls

```tsx
export function StepControls({
  step,
  total,
  onStepChange,
  onPlay,
  isPlaying,
}: StepControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => onStepChange(Math.max(0, step - 1))}>
          ← Prev
        </Button>
        <Button
          size="sm"
          onClick={() => onStepChange(Math.min(total - 1, step + 1))}
        >
          Next →
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Step {step + 1} / {total}
      </div>
      <Button size="sm" onClick={onPlay}>
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </Button>
    </div>
  );
}
```

---

## Implementation Checklist

### For Each Demo:

#### Planning Phase

- [ ] Define demo objectives and learning goals
- [ ] Sketch UI mockup
- [ ] Identify required interactions
- [ ] List visual elements needed
- [ ] Plan data structures

#### Development Phase

- [ ] Create demo component file
- [ ] Implement core functionality
- [ ] Add interactive controls
- [ ] Add visual feedback
- [ ] Add metrics/statistics
- [ ] Add responsive styles
- [ ] Test on mobile

#### Polish Phase

- [ ] Add animations/transitions
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add accessibility features
- [ ] Add helpful tooltips/hints
- [ ] Optimize performance
- [ ] Add TypeScript types

#### Integration Phase

- [ ] Export from index.ts
- [ ] Update challenge JSON with demoComponentKey
- [ ] Test in main app
- [ ] Add to demo registry
- [ ] Update documentation

---

## Best Practices

### Performance

- Use `React.memo` for expensive child components
- Use `useMemo` for computed values
- Use `useCallback` for event handlers passed to children
- Debounce text inputs (300-500ms)
- Throttle scroll/resize handlers (100-200ms)
- Lazy load heavy demos with Intersection Observer

### User Experience

- Provide instant feedback on interactions
- Show loading states for async operations
- Display clear error messages
- Add "Reset" button to restore initial state
- Include example presets for quick exploration
- Add tooltips for complex features

### Accessibility

- Use semantic HTML
- Add ARIA labels for interactive elements
- Ensure keyboard navigation works
- Use sufficient color contrast
- Add focus indicators
- Test with screen readers

### Code Quality

- Follow project TypeScript conventions
- Extract reusable logic into hooks
- Keep components under 200 lines
- Add JSDoc comments for complex functions
- Use consistent naming conventions
- Write self-documenting code

---

## Testing Strategy

### Unit Tests

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { LRUCacheDemo } from "./lru-cache-demo";

describe("LRUCacheDemo", () => {
  it("should display initial empty cache", () => {
    render(<LRUCacheDemo />);
    expect(screen.getByText(/0\/3/)).toBeInTheDocument();
  });

  it("should add item on PUT", () => {
    render(<LRUCacheDemo />);
    fireEvent.change(screen.getByPlaceholderText("Key"), {
      target: { value: "a" },
    });
    fireEvent.change(screen.getByPlaceholderText("Value"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByText("PUT"));
    expect(screen.getByText(/1\/3/)).toBeInTheDocument();
  });
});
```

### Visual Regression Tests

- Use Playwright/Chromatic for screenshot comparisons
- Test different states (empty, loading, filled, error)
- Test responsive breakpoints
- Test dark/light themes

### Performance Tests

- Measure render time with React Profiler
- Test with large datasets (10k+ items)
- Monitor memory leaks
- Check bundle size impact

---

## Future Enhancements

### Phase 1 (Quick Wins)

- Add "Share Demo" button (URL with state)
- Add "Fullscreen" mode for demos
- Add "Copy State" to clipboard
- Add demo performance profiler

### Phase 2 (Medium-term)

- Add demo recording/playback
- Add collaborative demo sessions
- Add demo customization (themes, speed)
- Add demo analytics tracking

### Phase 3 (Long-term)

- Add AI-powered demo explanations
- Add voice narration for demos
- Add 3D visualizations
- Add VR/AR demos (experimental)

---

## Contribution Guidelines

### Adding a New Demo

1. **Create branch**: `git checkout -b demo/challenge-name`
2. **Create demo file**: `components/challenge-demos/challenge-name-demo.tsx`
3. **Implement demo** following patterns above
4. **Export from index**: Add to `challenge-demos/index.ts`
5. **Update challenge JSON**: Add `"demoComponentKey": "ChallengeName"`
6. **Test thoroughly**: All interactions and edge cases
7. **Submit PR**: With screenshots/video of demo in action

### Review Checklist

- [ ] Demo is educational and interactive
- [ ] Code follows project conventions
- [ ] TypeScript types are correct
- [ ] Responsive on mobile
- [ ] Accessible (keyboard nav, screen readers)
- [ ] Performance is good (no lag/jank)
- [ ] No console errors/warnings

---

## Resources

### Inspiration

- [Visualgo](https://visualgo.net/) - Algorithm visualizations
- [React Spring Examples](https://react-spring.dev/) - Animation ideas
- [D3.js Gallery](https://observablehq.com/@d3/gallery) - Data viz patterns
- [CodeSandbox Demos](https://codesandbox.io/explore) - Interactive examples

### Libraries to Consider

- **Animation**: Framer Motion, React Spring
- **Charts**: Recharts, Victory, Chart.js
- **Code Editor**: Monaco Editor, CodeMirror
- **Diagrams**: React Flow, Mermaid
- **3D**: Three.js, React Three Fiber

---

Last updated: 2026-01-13
