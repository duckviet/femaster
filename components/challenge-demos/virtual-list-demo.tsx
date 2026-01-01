"use client";

import React, { useRef, useState, useMemo } from "react";

const ITEM_HEIGHT = 60;
const WINDOW_HEIGHT = 300;
const BUFFER = 3;

interface Item {
  id: number;
  title: string;
  price: string;
}

export function VirtualListDemo() {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate 10,000 items
  const items: Item[] = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      price: `$${(Math.random() * 100).toFixed(2)}`,
    }));
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + WINDOW_HEIGHT) / ITEM_HEIGHT) + BUFFER
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * ITEM_HEIGHT;
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div className="p-4 bg-card rounded-lg border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Virtual List (10,000 items)</h3>
        <span className="text-xs text-muted-foreground">
          Rendering: {visibleItems.length} items
        </span>
      </div>

      <div
        ref={containerRef}
        onScroll={onScroll}
        className="border rounded-md overflow-auto"
        style={{ height: WINDOW_HEIGHT }}
      >
        <div
          style={{ height: totalHeight, width: "100%", position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              transform: `translateY(${offsetY}px)`,
              width: "100%",
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 border-b hover:bg-muted/50"
                style={{ height: ITEM_HEIGHT }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs">
                    #{item.id}
                  </div>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Scroll position: {Math.round(scrollTop)}px | Items {startIndex + 1} -{" "}
        {endIndex + 1} visible
      </div>
    </div>
  );
}
