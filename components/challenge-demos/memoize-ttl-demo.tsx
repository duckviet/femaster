"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CacheEntry {
  result: number;
  timestamp: number;
  fromCache: boolean;
  time: number;
}

function createMemoizeTTL<T, R>(fn: (arg: T) => R, ttl: number) {
  const cache = new Map<T, { result: R; timestamp: number }>();

  return (arg: T): R => {
    const now = Date.now();
    const cached = cache.get(arg);

    if (cached && now - cached.timestamp < ttl) {
      return cached.result;
    }

    const result = fn(arg);
    cache.set(arg, { result, timestamp: now });
    return result;
  };
}

// Expensive function simulation
function expensiveCalculation(n: number): number {
  let result = 0;
  // Simulate expensive computation
  for (let i = 0; i < 50000000; i++) {
    result += Math.sqrt(n) * Math.random();
  }
  return Math.floor(result / n);
}

export function MemoizeTTLDemo() {
  const [ttl, setTtl] = useState(3000);
  const [input, setInput] = useState("42");
  const [history, setHistory] = useState<CacheEntry[]>([]);
  const [stats, setStats] = useState({ cacheHits: 0, cacheMisses: 0 });

  const memoizedFnRef = useRef(
    createMemoizeTTL((n: number) => expensiveCalculation(n), ttl)
  );

  // Update memoized function when TTL changes
  useMemo(() => {
    memoizedFnRef.current = createMemoizeTTL(
      (n: number) => expensiveCalculation(n),
      ttl
    );
    setHistory([]);
    setStats({ cacheHits: 0, cacheMisses: 0 });
  }, [ttl]);

  const handleCalculate = useCallback(() => {
    const num = parseInt(input);
    if (isNaN(num)) return;

    const start = performance.now();
    const result = memoizedFnRef.current(num);
    const time = performance.now() - start;

    const isQuick = time < 5;
    const fromCache = isQuick;

    setStats((s) => ({
      cacheHits: s.cacheHits + (fromCache ? 1 : 0),
      cacheMisses: s.cacheMisses + (fromCache ? 0 : 1),
    }));

    setHistory((h) =>
      [
        {
          result,
          timestamp: Date.now(),
          fromCache,
          time,
        },
        ...h,
      ].slice(0, 15)
    );
  }, [input]);

  const handleClearCache = () => {
    memoizedFnRef.current = createMemoizeTTL(
      (n: number) => expensiveCalculation(n),
      ttl
    );
    setHistory([]);
    setStats({ cacheHits: 0, cacheMisses: 0 });
  };

  const totalOps = stats.cacheHits + stats.cacheMisses;
  const hitRate =
    totalOps > 0 ? ((stats.cacheHits / totalOps) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Memoize with TTL</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Cache expensive function results with time-to-live expiration
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium">TTL (milliseconds)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={ttl}
              onChange={(e) => setTtl(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded w-16 text-center">
              {ttl}ms
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Cache expires {ttl / 1000}s after being set
          </p>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium block mb-1">Number</label>
          <Input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCalculate();
            }}
            placeholder="Enter number..."
            className="h-8 text-sm"
          />
        </div>
        <Button onClick={handleCalculate} className="h-8 text-xs">
          Calculate
        </Button>
        <Button
          onClick={handleClearCache}
          variant="outline"
          size="sm"
          className="h-8 text-xs"
        >
          Clear Cache
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-green-50 border border-green-200 rounded text-center">
          <div className="text-xs text-green-700 font-medium">Cache Hits</div>
          <div className="text-lg font-bold text-green-900">
            {stats.cacheHits}
          </div>
        </div>
        <div className="p-2 bg-red-50 border border-red-200 rounded text-center">
          <div className="text-xs text-red-700 font-medium">Cache Misses</div>
          <div className="text-lg font-bold text-red-900">
            {stats.cacheMisses}
          </div>
        </div>
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
          <div className="text-xs text-blue-700 font-medium">Hit Rate</div>
          <div className="text-lg font-bold text-blue-900">{hitRate}%</div>
        </div>
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground font-medium">
            Total Ops
          </div>
          <div className="text-lg font-bold">{totalOps}</div>
        </div>
      </div>

      {/* Call History */}
      {history.length > 0 && (
        <div className="border rounded-lg p-3">
          <h4 className="text-xs font-semibold mb-2">
            Call History (Latest First)
          </h4>
          <div className="space-y-2 max-h-48 overflow-auto">
            {history.map((entry, idx) => {
              const age = Math.round((Date.now() - entry.timestamp) / 1000);
              const isExpired = age > ttl / 1000;

              return (
                <div
                  key={idx}
                  className={`text-xs p-2 rounded flex justify-between items-center border ${
                    entry.fromCache
                      ? "bg-green-50 border-green-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div className="flex-1">
                    <span className="font-mono font-bold">
                      fn({input}) = {entry.result}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={entry.fromCache ? "default" : "secondary"}
                      className={`text-xs ${
                        entry.fromCache
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                    >
                      {entry.fromCache ? "✓ Cache Hit" : "✗ Cache Miss"}
                    </Badge>
                    <span className="text-muted-foreground">
                      {entry.time.toFixed(1)}ms
                    </span>
                    <span
                      className={`text-xs ${
                        isExpired
                          ? "text-red-600 line-through"
                          : "text-muted-foreground"
                      }`}
                    >
                      {age}s ago
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 space-y-2">
        <p className="font-medium">💡 How to Use</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Adjust TTL slider (cache expiration time)</li>
          <li>Enter a number and click "Calculate"</li>
          <li>
            Click "Calculate" again with the SAME number within TTL → Cache Hit
            ✓
          </li>
          <li>After TTL expires, the cache entry is removed</li>
          <li>Use "Clear Cache" to manually reset all cached values</li>
        </ol>
      </div>

      <div className="p-3 bg-muted rounded text-xs space-y-1">
        <p className="font-medium">📊 Memoize with TTL Benefits</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>
            <strong>Avoid Recalculation:</strong> Same input = instant result
            from cache
          </li>
          <li>
            <strong>Automatic Cleanup:</strong> Old cached values expire
            automatically
          </li>
          <li>
            <strong>Memory Efficient:</strong> TTL prevents infinite cache
            growth
          </li>
          <li>
            <strong>Performance Boost:</strong> Cache hits are orders of
            magnitude faster
          </li>
          <li>
            <strong>Use Cases:</strong> API responses, expensive computations,
            memoized selectors
          </li>
        </ul>
      </div>
    </div>
  );
}
