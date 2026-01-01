"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const mockResults = [
  "React Hooks Tutorial",
  "React Context API Guide",
  "React Performance Tips",
  "React Testing Library",
  "React Server Components",
  "React Native Basics",
  "Redux vs Context",
  "Next.js App Router",
  "TypeScript with React",
  "Tailwind CSS Setup",
];

export function UseDebounceDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const filtered = mockResults.filter((item) =>
          item.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setResults(filtered);
        setIsSearching(false);
        setApiCallCount((c) => c + 1);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Debounced Search</h3>
        <span className="text-xs text-muted-foreground">
          API calls: {apiCallCount}
        </span>
      </div>

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search (500ms debounce)..."
        className="w-full"
      />

      <div className="text-xs text-muted-foreground">
        <span>Input: &quot;{searchTerm}&quot;</span>
        <span className="mx-2">→</span>
        <span>Debounced: &quot;{debouncedSearch}&quot;</span>
      </div>

      <div className="min-h-[120px] border rounded-md p-2">
        {isSearching ? (
          <div className="text-sm text-muted-foreground animate-pulse">
            Searching...
          </div>
        ) : results.length > 0 ? (
          <ul className="space-y-1">
            {results.map((result, i) => (
              <li
                key={i}
                className="text-sm py-1 px-2 hover:bg-muted rounded cursor-pointer"
              >
                {result}
              </li>
            ))}
          </ul>
        ) : debouncedSearch ? (
          <div className="text-sm text-muted-foreground">No results found</div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Start typing to search...
          </div>
        )}
      </div>
    </div>
  );
}
