"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

export function InfiniteScrollDemo() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Simulate API call
  const fetchItems = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

    const newItems: ImageItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: pageNum * 12 + i,
      src: `https://picsum.photos/200/200?random=${pageNum * 12 + i}`,
      alt: `Image ${pageNum * 12 + i}`,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setPage(pageNum);

    // Stop after 5 pages
    if (pageNum >= 4) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          fetchItems(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page, isLoading, hasMore, fetchItems]);

  // Load initial items
  useEffect(() => {
    if (items.length === 0) {
      fetchItems(0);
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-sm font-semibold">Infinite Scroll Demo</h3>
        <p className="text-xs text-muted-foreground">
          Scroll down to load more images. Uses Intersection Observer API.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-blue-50 rounded">
          <div className="text-muted-foreground">Loaded</div>
          <div className="text-lg font-semibold text-blue-600">
            {items.length}
          </div>
        </div>
        <div className="p-2 bg-purple-50 rounded">
          <div className="text-muted-foreground">Page</div>
          <div className="text-lg font-semibold text-purple-600">
            {page + 1}
          </div>
        </div>
        <div className="p-2 bg-amber-50 rounded">
          <div className="text-muted-foreground">Status</div>
          <div className="text-lg font-semibold text-amber-600">
            {hasMore ? "Loading..." : "Complete"}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="border rounded-lg overflow-hidden bg-card/50">
        <div className="grid grid-cols-3 gap-3 p-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="aspect-square bg-muted rounded overflow-hidden"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Sentinel element */}
        {hasMore && (
          <div
            ref={sentinelRef}
            className="h-20 flex items-center justify-center bg-muted/50 text-xs text-muted-foreground"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <IconLoader className="size-4 animate-spin" />
                Loading more...
              </div>
            ) : (
              "Scroll down to load more"
            )}
          </div>
        )}

        {/* End message */}
        {!hasMore && (
          <div className="h-12 flex items-center justify-center bg-green-50 text-xs font-semibold text-green-700">
            All items loaded! ({items.length} total)
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground border-t pt-2">
        <p className="mb-2">
          <strong>How it works:</strong>
        </p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Sentinel element at bottom of list</li>
          <li>IntersectionObserver detects when sentinel enters viewport</li>
          <li>When visible, automatically loads next page</li>
          <li>Loading state prevents duplicate requests</li>
          <li>No manual scroll event listeners needed</li>
        </ul>
      </div>
    </div>
  );
}
