"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CacheEntry {
  key: string;
  value: string;
}

class LRUCache {
  private capacity: number;
  private cache: Map<string, string>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: string): string | null {
    if (!this.cache.has(key)) return null;

    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: string, value: string): string | null {
    let evicted: string | null = null;

    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value ?? "";
      this.cache.delete(oldestKey);
      evicted = oldestKey;
    }

    this.cache.set(key, value);
    return evicted;
  }

  toArray(): CacheEntry[] {
    return Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      value,
    }));
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export function LRUCacheDemo() {
  const [capacity, setCapacity] = useState(3);
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [cache, setCache] = useState(() => new LRUCache(capacity));
  const [cacheState, setCacheState] = useState<CacheEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [stats, setStats] = useState({ hits: 0, misses: 0 });

  const updateCacheState = useCallback((cacheInstance: LRUCache) => {
    setCacheState(cacheInstance.toArray());
  }, []);

  const handleGet = () => {
    if (!inputKey.trim()) return;

    const result = cache.get(inputKey);
    const isHit = result !== null;

    setStats((s) => ({
      hits: s.hits + (isHit ? 1 : 0),
      misses: s.misses + (isHit ? 0 : 1),
    }));

    setHistory((h) =>
      [`GET(${inputKey}) → ${result ?? "MISS"}`, ...h].slice(0, 10)
    );

    updateCacheState(cache);
    setInputKey("");
  };

  const handlePut = () => {
    if (!inputKey.trim()) return;

    const evicted = cache.put(inputKey, inputValue);
    setHistory((h) =>
      [
        `PUT(${inputKey}, ${inputValue})${
          evicted ? ` → Evicted: ${evicted}` : ""
        }`,
        ...h,
      ].slice(0, 10)
    );

    updateCacheState(cache);
    setInputKey("");
    setInputValue("");
  };

  const handleCapacityChange = (newCapacity: number) => {
    if (newCapacity < 1) return;
    setCapacity(newCapacity);
    const newCache = new LRUCache(newCapacity);
    setCache(newCache);
    setCacheState([]);
    setHistory([]);
    setStats({ hits: 0, misses: 0 });
  };

  const handleReset = () => {
    cache.clear();
    setCacheState([]);
    setHistory([]);
    setStats({ hits: 0, misses: 0 });
    setInputKey("");
    setInputValue("");
  };

  const hitRate =
    stats.hits + stats.misses > 0
      ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">LRU Cache O(1) Operations</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Least Recently Used cache with HashMap + Doubly Linked List
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium">Capacity:</label>
          <Input
            type="number"
            min="1"
            max="10"
            value={capacity}
            onChange={(e) => handleCapacityChange(parseInt(e.target.value))}
            className="w-12 h-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Cache Usage</div>
          <div className="text-sm font-bold">
            {cacheState.length}/{capacity}
          </div>
        </div>
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Hit Rate</div>
          <div className="text-sm font-bold text-green-600">{hitRate}%</div>
        </div>
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-xs text-muted-foreground">Total Ops</div>
          <div className="text-sm font-bold">{stats.hits + stats.misses}</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">Input Controls</label>
        <div className="flex gap-2">
          <Input
            placeholder="Key"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGet();
            }}
            className="flex-1 h-8 text-xs"
          />
          <Input
            placeholder="Value (for PUT)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePut();
            }}
            className="flex-1 h-8 text-xs"
          />
          <Button
            onClick={handleGet}
            size="sm"
            variant="outline"
            className="h-8 text-xs"
          >
            GET
          </Button>
          <Button
            onClick={handlePut}
            size="sm"
            className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
          >
            PUT
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Press Enter or click buttons to execute. GET will move key to MRU
          position.
        </p>
      </div>

      <div className="border rounded-lg p-3 bg-muted/30">
        <h4 className="text-xs font-semibold mb-2">Cache State (MRU → LRU)</h4>
        {cacheState.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">
            Cache is empty. Use PUT to add items.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {cacheState.map((item, idx) => (
              <div
                key={item.key}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  idx === cacheState.length - 1
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : idx === 0
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-amber-100 text-amber-700 border border-amber-300"
                }`}
              >
                <span className="font-bold">{item.key}</span>
                <span className="text-muted-foreground">: {item.value}</span>
                {idx === 0 && <span className="ml-1">⭐ MRU</span>}
                {idx === cacheState.length - 1 && (
                  <span className="ml-1">🔴 LRU</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-green-50 border border-green-200 rounded">
          <div className="text-xs text-green-700 font-medium">Hits</div>
          <div className="text-lg font-bold text-green-600">{stats.hits}</div>
        </div>
        <div className="p-2 bg-red-50 border border-red-200 rounded">
          <div className="text-xs text-red-700 font-medium">Misses</div>
          <div className="text-lg font-bold text-red-600">{stats.misses}</div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="border rounded-lg p-3">
          <h4 className="text-xs font-semibold mb-2">Operation History</h4>
          <div className="space-y-1 max-h-32 overflow-auto">
            {history.map((op, idx) => (
              <div
                key={idx}
                className="text-xs text-muted-foreground font-mono"
              >
                {op.includes("Evicted") ? (
                  <span className="text-red-600">{op}</span>
                ) : op.includes("MISS") ? (
                  <span className="text-orange-600">{op}</span>
                ) : (
                  <span className="text-green-600">{op}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleReset}
        size="sm"
        variant="outline"
        className="w-full h-8 text-xs"
      >
        Reset Cache
      </Button>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 space-y-1">
        <p className="font-medium">💡 How LRU Cache Works</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Uses <strong>HashMap</strong> for O(1) lookups and{" "}
            <strong>Doubly Linked List</strong> for O(1) ordering
          </li>
          <li>
            <strong>GET</strong>: Returns value and moves key to MRU position
          </li>
          <li>
            <strong>PUT</strong>: Adds/updates and moves to MRU; evicts LRU if
            full
          </li>
          <li>
            Both operations: <strong>O(1) time complexity</strong>
          </li>
          <li>MRU (Most Recently Used) = most recent access/update</li>
          <li>LRU (Least Recently Used) = next item to evict</li>
        </ul>
      </div>
    </div>
  );
}
