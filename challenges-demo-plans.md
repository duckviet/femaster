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
      {expanded && item.children?.map(child =>
        <RecursiveItem item={child} depth={depth + 1} />
      )}
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

**Implementation**:
```tsx
export function CompoundTabsDemo() {
  const [mode, setMode] = useState<'controlled' | 'uncontrolled'>('controlled');
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Compound Tabs Demo</h3>
        <Select value={mode} onValueChange={setMode}>
          <option value="controlled">Controlled</option>
          <option value="uncontrolled">Uncontrolled</option>
        </Select>
      </div>

      <Tabs value={mode === 'controlled' ? activeTab : undefined}
            onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tab1">Profile</TabsTrigger>
          <TabsTrigger value="tab2">Settings</TabsTrigger>
          <TabsTrigger value="tab3">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Profile content...</TabsContent>
        <TabsContent value="tab2">Settings content...</TabsContent>
        <TabsContent value="tab3">Notifications content...</TabsContent>
      </Tabs>

      {mode === 'controlled' && (
        <div className="text-xs text-muted-foreground">
          Active tab: {activeTab}
        </div>
      )}
    </div>
  );
}
```

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

**Implementation**:
```tsx
export function DeepMergeDemo() {
  const [obj1, setObj1] = useState(defaultObj1);
  const [obj2, setObj2] = useState(defaultObj2);
  const [strategy, setStrategy] = useState<'overwrite' | 'concat'>('overwrite');
  const [step, setStep] = useState(0);

  const mergeSteps = useMemo(() =>
    computeMergeSteps(obj1, obj2, strategy),
    [obj1, obj2, strategy]
  );

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <h3 className="text-sm font-semibold">Deep Merge Visualization</h3>

      <div className="grid grid-cols-2 gap-4">
        <ObjectEditor label="Object 1" value={obj1} onChange={setObj1} />
        <ObjectEditor label="Object 2" value={obj2} onChange={setObj2} />
      </div>

      <Select value={strategy} onValueChange={setStrategy}>
        <option value="overwrite">Overwrite Arrays</option>
        <option value="concat">Concat Arrays</option>
      </Select>

      <StepControls
        step={step}
        total={mergeSteps.length}
        onStepChange={setStep}
      />

      <MergeVisualization
        current={mergeSteps[step]}
        highlight={mergeSteps[step].conflictKeys}
      />

      <div className="text-xs text-muted-foreground">
        {mergeSteps[step].description}
      </div>
    </div>
  );
}
```

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

**Implementation**:
```tsx
interface FlatNode {
  id: string;
  parentId: string | null;
  name: string;
}

export function FlatToTreeDemo() {
  const [flatData, setFlatData] = useState<FlatNode[]>(defaultData);
  const [showOrphans, setShowOrphans] = useState(true);

  const { tree, orphans } = useMemo(() =>
    flatToTree(flatData),
    [flatData]
  );

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <h3 className="text-sm font-semibold">Flat Array → Tree Conversion</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-medium mb-2">Flat Array Input</h4>
          <FlatDataTable
            data={flatData}
            onChange={setFlatData}
          />
          <Button onClick={() => addNode()} size="sm">Add Node</Button>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Tree Output</h4>
          <TreeVisualization tree={tree} />
          {orphans.length > 0 && showOrphans && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
              <p className="text-xs font-medium text-amber-900">
                Orphaned Nodes: {orphans.map(n => n.name).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {flatData.length} nodes → {countTreeNodes(tree)} tree nodes
      </div>
    </div>
  );
}
```

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

**Implementation**:
```tsx
export function LRUCacheDemo() {
  const [capacity, setCapacity] = useState(3);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [cache] = useState(() => new LRUCache(capacity));
  const [cacheState, setCacheState] = useState<Array<{key: string, value: any}>>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [stats, setStats] = useState({ hits: 0, misses: 0 });

  const handleGet = () => {
    const result = cache.get(key);
    const isHit = result !== undefined;
    setStats(s => ({
      hits: s.hits + (isHit ? 1 : 0),
      misses: s.misses + (isHit ? 0 : 1)
    }));
    setHistory(h => [`GET(${key}) → ${result ?? 'MISS'}`, ...h].slice(0, 10));
    setCacheState(cache.toArray());
  };

  const handlePut = () => {
    const evicted = cache.put(key, value);
    setHistory(h => [
      `PUT(${key}, ${value})${evicted ? ` → Evicted: ${evicted}` : ''}`,
      ...h
    ].slice(0, 10));
    setCacheState(cache.toArray());
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">LRU Cache (O(1) Operations)</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs">Capacity:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(+e.target.value)}
            className="w-16 px-2 py-1 border rounded text-xs"
            min="1"
            max="10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleGet} variant="outline">GET</Button>
        <Button onClick={handlePut}>PUT</Button>
      </div>

      <div className="border rounded-lg p-3">
        <h4 className="text-xs font-medium mb-2">Cache State ({cacheState.length}/{capacity})</h4>
        <div className="flex gap-2">
          {cacheState.map((item, idx) => (
            <div
              key={item.key}
              className={`p-2 rounded border-2 ${
                idx === 0 ? 'border-green-500 bg-green-50' : 'border-muted bg-muted'
              }`}
            >
              <div className="text-xs font-mono">
                {item.key}: {item.value}
              </div>
              {idx === 0 && (
                <div className="text-[10px] text-green-600 font-medium">MRU</div>
              )}
              {idx === cacheState.length - 1 && (
                <div className="text-[10px] text-red-600 font-medium">LRU</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-muted rounded">
          <div className="text-xs text-muted-foreground">Hits</div>
          <div className="text-lg font-bold text-green-600">{stats.hits}</div>
        </div>
        <div className="p-2 bg-muted rounded">
          <div className="text-xs text-muted-foreground">Misses</div>
          <div className="text-lg font-bold text-red-600">{stats.misses}</div>
        </div>
        <div className="p-2 bg-muted rounded">
          <div className="text-xs text-muted-foreground">Hit Rate</div>
          <div className="text-lg font-bold">
            {stats.hits + stats.misses > 0
              ? Math.round(stats.hits / (stats.hits + stats.misses) * 100)
              : 0}%
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium mb-2">Operation History</h4>
        <div className="space-y-1 max-h-32 overflow-auto">
          {history.map((op, idx) => (
            <div key={idx} className="text-xs font-mono text-muted-foreground">
              {op}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

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

**Implementation**:
```tsx
export function LongestSubstringDemo() {
  const [input, setInput] = useState('abcabcbb');
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);

  const steps = useMemo(() =>
    computeSteps(input),
    [input]
  );

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep(s => s < steps.length - 1 ? s + 1 : s);
    }, 500);
    return () => clearInterval(timer);
  }, [playing, steps.length]);

  const currentStep = steps[step];

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <h3 className="text-sm font-semibold">Longest Substring Without Repeating</h3>

      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setStep(0);
          setPlaying(false);
        }}
        placeholder="Enter string..."
      />

      <div className="flex gap-2">
        <Button onClick={() => setPlaying(!playing)} size="sm">
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={() => setStep(0)} size="sm" variant="outline">Reset</Button>
      </div>

      <div className="font-mono text-lg flex gap-1 justify-center">
        {input.split('').map((char, idx) => (
          <span
            key={idx}
            className={`
              px-2 py-1 border-2 rounded
              ${idx >= currentStep.start && idx < currentStep.end
                ? 'border-blue-500 bg-blue-50'
                : 'border-muted'}
              ${idx === currentStep.pointer
                ? 'ring-2 ring-orange-500'
                : ''}
            `}
          >
            {char}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-muted rounded">
          <div className="text-xs text-muted-foreground">Current Window</div>
          <div className="text-lg font-bold">{currentStep.substring}</div>
          <div className="text-xs text-muted-foreground">Length: {currentStep.length}</div>
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-xs text-green-700">Max Substring</div>
          <div className="text-lg font-bold text-green-900">{currentStep.maxSubstring}</div>
          <div className="text-xs text-green-700">Length: {currentStep.maxLength}</div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Step {step + 1}/{steps.length}: {currentStep.description}
      </div>
    </div>
  );
}
```

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

**Implementation**:
```tsx
export function WebWorkerFilterDemo() {
  const [useWorker, setUseWorker] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setMetrics] = useState({ time: 0, blocked: false });
  const [workerReady, setWorkerReady] = useState(false);

  const data = useMemo(() =>
    generateLargeDataset(100000),
    []
  );

  useEffect(() => {
    const worker = new Worker(new URL('./filter-worker.ts', import.meta.url));
    worker.onmessage = (e) => {
      setResults(e.data.results);
      setMetrics({ time: e.data.time, blocked: false });
      setIsProcessing(false);
    };
    setWorkerReady(true);
    return () => worker.terminate();
  }, []);

  const handleFilter = async (text: string) => {
    setIsProcessing(true);
    const start = performance.now();

    if (useWorker && workerReady) {
      worker.postMessage({ data, filterText: text });
      setMetrics(m => ({ ...m, blocked: false }));
    } else {
      // Block main thread
      setMetrics(m => ({ ...m, blocked: true }));
      await new Promise(resolve => setTimeout(resolve, 0));
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
      setMetrics({ time: performance.now() - start, blocked: true });
      setIsProcessing(false);
    }
  };

  const debouncedFilter = useDebounce(filterText, 300);

  useEffect(() => {
    if (debouncedFilter) {
      handleFilter(debouncedFilter);
    }
  }, [debouncedFilter, useWorker]);

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Web Worker Heavy Filtering</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={useWorker}
            onCheckedChange={setUseWorker}
          />
          <span className="text-xs">
            {useWorker ? '⚡ Worker' : '🐌 Main Thread'}
          </span>
        </div>
      </div>

      <Input
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder="Filter 100,000 items..."
        disabled={isProcessing}
      />

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Dataset Size</div>
          <div className="text-lg font-bold">100,000</div>
        </div>
        <div className="p-3 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Results</div>
          <div className="text-lg font-bold">{results.length}</div>
        </div>
        <div className={`p-3 rounded text-center ${
          metrics.time > 100 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="text-xs text-muted-foreground">Processing Time</div>
          <div className="text-lg font-bold">{metrics.time.toFixed(0)}ms</div>
        </div>
      </div>

      {metrics.blocked && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-center">
          <p className="text-xs font-medium text-amber-900">
            ⚠️ Main thread was blocked! UI couldn't update during processing.
          </p>
        </div>
      )}

      <div className="border rounded-lg p-2 max-h-40 overflow-auto">
        <div className="text-xs text-muted-foreground mb-2">
          Showing {Math.min(results.length, 20)} of {results.length} results
        </div>
        {results.slice(0, 20).map(item => (
          <div key={item.id} className="text-sm py-1 px-2 hover:bg-muted rounded">
            {item.name}
          </div>
        ))}
      </div>

      <InteractionTest isProcessing={isProcessing} />
    </div>
  );
}

// Helper component to show blocking
function InteractionTest({ isProcessing }: { isProcessing: boolean }) {
  const [count, setCount] = useState(0);

  return (
    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
      <p className="text-xs mb-2">Test UI Responsiveness:</p>
      <Button
        onClick={() => setCount(c => c + 1)}
        size="sm"
        disabled={isProcessing}
      >
        Click me! ({count})
      </Button>
      <p className="text-[10px] text-muted-foreground mt-1">
        If using main thread, button will freeze during processing
      </p>
    </div>
  );
}
```

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

**Implementation**:
```tsx
export function MemoizeTTLDemo() {
  const [ttl, setTtl] = useState(3000); // 3 seconds
  const [input, setInput] = useState(5);
  const [history, setHistory] = useState<Array<{
    input: number;
    result: number;
    fromCache: boolean;
    timestamp: number;
  }>>([]);

  // Expensive function simulation
  const expensiveFunction = (n: number): number => {
    // Simulate expensive calculation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(n);
    }
    return result;
  };

  const memoized = useMemo(() =>
    memoizeWithTTL(expensiveFunction, ttl),
    [ttl]
  );

  const handleCalculate = () => {
    const start = performance.now();
    const result = memoized(input);
    const time = performance.now() - start;
    const fromCache = time < 1; // Fast = from cache

    setHistory(h => [{
      input,
      result,
      fromCache,
      timestamp: Date.now()
    }, ...h].slice(0, 10));
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <h3 className="text-sm font-semibold">Memoize with TTL</h3>

      <div className="space-y-2">
        <label className="text-xs font-medium">TTL (Time to Live)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={ttl}
            onChange={(e) => setTtl(+e.target.value)}
            className="flex-1"
          />
          <span className="text-sm font-mono w-16">{ttl / 1000}s</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          value={input}
          onChange={(e) => setInput(+e.target.value)}
          placeholder="Input number"
          className="flex-1"
        />
        <Button onClick={handleCalculate}>
          Calculate
        </Button>
      </div>

      <div className="border rounded-lg p-3">
        <h4 className="text-xs font-medium mb-2">Call History</h4>
        <div className="space-y-2">
          {history.map((call, idx) => {
            const age = Date.now() - call.timestamp;
            const isExpired = age > ttl;

            return (
              <div
                key={idx}
                className={`p-2 rounded flex items-center justify-between ${
                  call.fromCache ? 'bg-green-50 border border-green-200' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono">f({call.input})</span>
                  <span className="text-xs">→</span>
                  <span className="text-xs font-mono">{call.result.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {call.fromCache && !isExpired && (
                    <Badge variant="success" className="text-[10px]">
                      💾 Cache Hit
                    </Badge>
                  )}
                  {isExpired && (
                    <Badge variant="destructive" className="text-[10px]">
                      ⏰ Expired
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {(age / 1000).toFixed(1)}s ago
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
          <div className="text-xs text-green-700">Cache Hits</div>
          <div className="text-2xl font-bold text-green-900">
            {history.filter(h => h.fromCache).length}
          </div>
        </div>
        <div className="p-3 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Cache Misses</div>
          <div className="text-2xl font-bold">
            {history.filter(h => !h.fromCache).length}
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        💡 Try calling with the same input within {ttl / 1000}s to see cache hit!
      </div>
    </div>
  );
}
```

**Visual Elements**:
- TTL slider with visual indicator
- Call history with timestamps
- Cache hit/miss badges
- Expiration countdown
- Performance statistics
- Cache state visualization

---

## Demo Plans for Future Challenges

### React & Component Architecture

#### HOC Pattern Demo
**Features**:
- Show wrapped component before/after HOC
- Toggle authentication state
- Display injected props
- Show composition with multiple HOCs

#### Render Props Demo
**Features**:
- Mouse tracker with multiple render functions
- Toggle between different render implementations
- Show data flow visualization

#### Undo/Redo Demo
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

export function DemoContainer({ title, subtitle, children, actions }: DemoContainerProps) {
  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
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
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function MetricsDisplay({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map((metric, idx) => (
        <div key={idx} className={`p-3 rounded text-center ${getVariantClass(metric.variant)}`}>
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
  isPlaying
}: StepControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => onStepChange(Math.max(0, step - 1))}>
          ← Prev
        </Button>
        <Button size="sm" onClick={() => onStepChange(Math.min(total - 1, step + 1))}>
          Next →
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Step {step + 1} / {total}
      </div>
      <Button size="sm" onClick={onPlay}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
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
import { render, screen, fireEvent } from '@testing-library/react';
import { LRUCacheDemo } from './lru-cache-demo';

describe('LRUCacheDemo', () => {
  it('should display initial empty cache', () => {
    render(<LRUCacheDemo />);
    expect(screen.getByText(/0\/3/)).toBeInTheDocument();
  });

  it('should add item on PUT', () => {
    render(<LRUCacheDemo />);
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: 'a' }});
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: '1' }});
    fireEvent.click(screen.getByText('PUT'));
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
