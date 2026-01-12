"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DataItem {
  id: number;
  name: string;
  category: string;
}

function generateSampleData(count: number): DataItem[] {
  const categories = [
    "Technology",
    "Business",
    "Health",
    "Science",
    "Arts",
    "Sports",
  ];
  const firstNames = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
  ];

  const data: DataItem[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i,
      name: `${firstNames[i % firstNames.length]} ${
        lastNames[i % lastNames.length]
      } ${i}`,
      category: categories[i % categories.length],
    });
  }
  return data;
}

export function WebWorkerFilterDemo() {
  const [filterText, setFilterText] = useState("");
  const [results, setResults] = useState<DataItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWorker, setUseWorker] = useState(false);
  const [metrics, setMetrics] = useState({
    time: 0,
    blocked: false,
    mode: "Main Thread",
  });
  const [interactionCount, setInteractionCount] = useState(0);
  const [sampleSize, setSampleSize] = useState(10000);
  const [data] = useState<DataItem[]>(() => generateSampleData(sampleSize));
  const workerRef = useRef<Worker | null>(null);
  const [workerReady, setWorkerReady] = useState(false);

  // Initialize Worker
  useEffect(() => {
    try {
      const workerCode = `
        self.onmessage = function(e) {
          const { query, data } = e.data;
          const start = performance.now();
          
          const filtered = data.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
          );
          
          const time = performance.now() - start;
          self.postMessage({ results: filtered, time, blocked: false });
        };
      `;

      const blob = new Blob([workerCode], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      worker.onmessage = (e) => {
        const { results, time } = e.data;
        setResults(results);
        setMetrics({ time, blocked: false, mode: "Web Worker" });
        setIsProcessing(false);
      };

      worker.onerror = () => {
        console.error("Worker error");
        setIsProcessing(false);
      };

      workerRef.current = worker;
      setWorkerReady(true);

      return () => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };
    } catch (error) {
      console.error("Failed to initialize worker:", error);
      setWorkerReady(false);
    }
  }, []);

  const filterOnMainThread = useCallback(
    (query: string) => {
      setIsProcessing(true);
      setMetrics({ ...metrics, blocked: true, mode: "Main Thread" });

      // Force a blocking operation by using setTimeout with 0
      setTimeout(() => {
        const start = performance.now();

        const filtered = data.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        const time = performance.now() - start;
        setResults(filtered);
        setMetrics({ time, blocked: true, mode: "Main Thread" });
        setIsProcessing(false);
      }, 0);
    },
    [data, metrics]
  );

  const filterWithWorker = useCallback(
    (query: string) => {
      if (!workerRef.current) return;

      setIsProcessing(true);
      workerRef.current.postMessage({ query, data });
    },
    [data]
  );

  const handleFilter = (query: string) => {
    setFilterText(query);

    if (!query.trim()) {
      setResults([]);
      setMetrics({ time: 0, blocked: false, mode: "Main Thread" });
      return;
    }

    if (useWorker && workerReady) {
      filterWithWorker(query);
    } else {
      filterOnMainThread(query);
    }
  };

  const handleToggleMode = () => {
    setUseWorker(!useWorker);
    setResults([]);
    setMetrics({ time: 0, blocked: false, mode: "Main Thread" });
    setFilterText("");
  };

  const handleTestClick = () => {
    setInteractionCount((c) => c + 1);
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            Heavy Filtering with Web Workers
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Filter {sampleSize.toLocaleString()} items with or without Web
            Worker
          </p>
        </div>
        <Button
          onClick={handleToggleMode}
          size="sm"
          variant="outline"
          disabled={!workerReady}
        >
          Use {useWorker ? "Main Thread" : "Web Worker"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Mode:</span>
        <Badge variant={useWorker && workerReady ? "default" : "secondary"}>
          {useWorker && workerReady ? "⚙️ Web Worker" : "🧵 Main Thread"}
        </Badge>
        {!workerReady && (
          <Badge variant="destructive">Worker Init Failed</Badge>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Search by name or category (e.g. 'John', 'Technology')..."
          value={filterText}
          onChange={(e) => handleFilter(e.target.value)}
          disabled={isProcessing}
          className="h-8 text-xs"
        />
        {isProcessing && (
          <div className="text-xs text-muted-foreground">Processing... ⏳</div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Dataset</div>
          <div className="text-sm font-bold">{sampleSize.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Results</div>
          <div className="text-sm font-bold">{results.length}</div>
        </div>
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Time</div>
          <div className="text-sm font-bold">{metrics.time.toFixed(2)}ms</div>
        </div>
        <div
          className={`p-2 rounded text-center transition-colors ${
            metrics.blocked
              ? "bg-red-100 border border-red-300"
              : "bg-green-100 border border-green-300"
          }`}
        >
          <div className="text-xs font-medium">
            {metrics.blocked ? "🔴 Blocked" : "✅ Non-blocking"}
          </div>
        </div>
      </div>

      {metrics.blocked && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-center">
          <p className="text-xs text-amber-700 font-medium">
            ⚠️ UI BLOCKING: Main thread is busy! Try clicking "Test Response"
            below.
          </p>
          <p className="text-xs text-amber-600 mt-1">
            The button below may freeze during filtering when using main thread.
          </p>
        </div>
      )}

      <div className="border rounded-lg p-3 bg-muted/30 max-h-40 overflow-auto">
        <h4 className="text-xs font-semibold mb-2">
          Results ({results.length})
        </h4>
        {results.length === 0 && filterText ? (
          <div className="text-xs text-muted-foreground italic">
            No results found
          </div>
        ) : results.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">
            Type in the search box to see results
          </div>
        ) : (
          <div className="space-y-1">
            {results.slice(0, 20).map((item) => (
              <div
                key={item.id}
                className="text-xs p-2 bg-background rounded flex justify-between items-center hover:bg-muted transition-colors"
              >
                <span className="font-medium">{item.name}</span>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
            ))}
            {results.length > 20 && (
              <div className="text-xs text-muted-foreground italic">
                ... and {results.length - 20} more results
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
        <p className="text-xs font-medium text-blue-700 mb-2">
          🧪 Test UI Responsiveness
        </p>
        <p className="text-xs text-blue-600 mb-2">
          Click the button while filtering. With main thread, it will freeze.
          With Web Worker, it stays responsive.
        </p>
        <Button
          onClick={handleTestClick}
          disabled={isProcessing}
          size="sm"
          variant="outline"
          className="w-full h-8 text-xs"
        >
          Click Me! ({interactionCount}) {isProcessing && "🔄"}
        </Button>
      </div>

      <div className="p-3 bg-muted rounded text-xs space-y-2">
        <p className="font-medium">📊 Performance Comparison</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <p className="font-medium text-muted-foreground">Main Thread</p>
            <ul className="text-muted-foreground space-y-1 mt-1 text-xs">
              <li>✓ Simpler code</li>
              <li>✗ Blocks UI</li>
              <li>✗ Janky experience</li>
              <li>✗ Bad UX for large data</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Web Worker</p>
            <ul className="text-green-700 space-y-1 mt-1 text-xs">
              <li>✓ Non-blocking UI</li>
              <li>✓ Smooth experience</li>
              <li>✓ Responsive app</li>
              <li>⚠️ More complex setup</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-3 bg-muted rounded text-xs space-y-1">
        <p className="font-medium">💡 How Web Workers Work</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>
            Web Worker runs in <strong>separate thread</strong> from main thread
          </li>
          <li>
            <strong>postMessage</strong> sends data to worker (non-blocking)
          </li>
          <li>
            Worker performs heavy computation without freezing UI interactions
          </li>
          <li>
            Results sent back via <strong>onmessage</strong> when ready
          </li>
          <li>Perfect for: filtering, sorting, image processing, AI models</li>
        </ul>
      </div>
    </div>
  );
}
