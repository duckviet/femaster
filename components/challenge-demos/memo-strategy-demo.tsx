"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";

interface ListItem {
  id: number;
  name: string;
  value: number;
  renderCount: number;
}

interface ListItemProps {
  item: ListItem;
  isOptimized: boolean;
  onUpdate: (id: number) => void;
}

// Unoptimized version
const UnoptimizedListItem = ({ item, onUpdate }: ListItemProps) => {
  const renderRef = useRef(0);
  renderRef.current++;

  return (
    <div className="flex items-center justify-between p-2 border-b hover:bg-muted">
      <div>
        <span className="font-mono text-sm">{item.name}</span>
        <span className="text-xs text-muted-foreground ml-2">#{item.id}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono">{item.value}</span>
        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
          Renders: {renderRef.current}
        </span>
        <button
          onClick={() => onUpdate(item.id)}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Update
        </button>
      </div>
    </div>
  );
};

// Optimized version
const OptimizedListItem = React.memo(
  ({ item, onUpdate }: ListItemProps) => {
    const renderRef = useRef(0);
    renderRef.current++;

    return (
      <div className="flex items-center justify-between p-2 border-b hover:bg-muted">
        <div>
          <span className="font-mono text-sm">{item.name}</span>
          <span className="text-xs text-muted-foreground ml-2">#{item.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono">{item.value}</span>
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
            Renders: {renderRef.current}
          </span>
          <button
            onClick={() => onUpdate(item.id)}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Update
          </button>
        </div>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.item.id === next.item.id &&
      prev.item.value === next.item.value &&
      prev.item.name === next.item.name &&
      prev.isOptimized === next.isOptimized
    );
  }
);

OptimizedListItem.displayName = "OptimizedListItem";

export function MemoStrategyDemo() {
  const initialItems = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 100),
    renderCount: 0,
  }));

  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [unoptimizedRenders, setUnoptimizedRenders] = useState(0);
  const [optimizedRenders, setOptimizedRenders] = useState(0);
  const [filter, setFilter] = useState("");

  // Unoptimized: creates new function every render
  const handleUpdateUnoptimized = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, value: Math.floor(Math.random() * 100) }
          : item
      )
    );
    setUnoptimizedRenders((prev) => prev + 1);
  };

  // Optimized: stable function reference
  const handleUpdateOptimized = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, value: Math.floor(Math.random() * 100) }
          : item
      )
    );
    setOptimizedRenders((prev) => prev + 1);
  }, []);

  // Unoptimized: inline filter
  const filteredItemsUnoptimized = items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Optimized: memoized filter
  const filteredItemsOptimized = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [items, filter]
  );

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-sm font-semibold">
          React.memo and useMemo Comparison
        </h3>
        <p className="text-xs text-muted-foreground">
          Compare re-render counts. Optimized items use React.memo to skip
          unnecessary renders.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items..."
          className="flex-1 px-2 py-1 border rounded text-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-red-50 rounded">
          <div className="text-muted-foreground">Unoptimized Updates</div>
          <div className="text-lg font-semibold text-red-600">
            {unoptimizedRenders}
          </div>
        </div>
        <div className="p-2 bg-green-50 rounded">
          <div className="text-muted-foreground">Optimized Updates</div>
          <div className="text-lg font-semibold text-green-600">
            {optimizedRenders}
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-2 gap-4">
        {/* Unoptimized */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-2 bg-red-50 font-semibold text-xs border-b">
            Unoptimized
          </div>
          <div className="max-h-64 overflow-auto">
            {filteredItemsUnoptimized.map((item) => (
              <UnoptimizedListItem
                key={item.id}
                item={item}
                isOptimized={false}
                onUpdate={handleUpdateUnoptimized}
              />
            ))}
          </div>
        </div>

        {/* Optimized */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-2 bg-green-50 font-semibold text-xs border-b">
            Optimized
          </div>
          <div className="max-h-64 overflow-auto">
            {filteredItemsOptimized.map((item) => (
              <OptimizedListItem
                key={item.id}
                item={item}
                isOptimized={true}
                onUpdate={handleUpdateOptimized}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground border-t pt-2">
        <p className="mb-2">
          <strong>Observations:</strong>
        </p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Click "Update" on a single item in each list</li>
          <li>Unoptimized: ALL items re-render</li>
          <li>Optimized: Only the updated item re-renders</li>
          <li>React.memo prevents re-render if props didn't change</li>
          <li>useCallback keeps function reference stable</li>
        </ul>
      </div>
    </div>
  );
}
