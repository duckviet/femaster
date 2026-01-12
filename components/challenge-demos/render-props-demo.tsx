"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
}

// Mouse Tracker Component using Render Props pattern
interface MouseTrackerProps {
  children: (position: Position) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const trackerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (trackerRef.current) {
        const rect = trackerRef.current.getBoundingClientRect();
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const element = trackerRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      return () => element.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={trackerRef}
      className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 rounded-lg overflow-hidden cursor-crosshair"
    >
      {children(position)}
    </div>
  );
}

// Different render function implementations
function CircleCursor({ x, y }: Position) {
  return (
    <div
      className="absolute w-8 h-8 bg-blue-400 rounded-full opacity-60 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    />
  );
}

function CrosshairCursor({ x, y }: Position) {
  return (
    <>
      <div
        className="absolute w-0.5 h-full bg-red-500 opacity-50 pointer-events-none"
        style={{ left: `${x}px` }}
      />
      <div
        className="absolute h-0.5 w-full bg-red-500 opacity-50 pointer-events-none"
        style={{ top: `${y}px` }}
      />
      <div
        className="absolute w-6 h-6 border-2 border-red-500 rounded-full opacity-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      />
    </>
  );
}

function CoordinateDisplay({ x, y }: Position) {
  return (
    <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-2 rounded text-xs font-mono pointer-events-none">
      <div>X: {Math.round(x)}</div>
      <div>Y: {Math.round(y)}</div>
    </div>
  );
}

export function RenderPropsDemo() {
  const [renderMode, setRenderMode] = useState<
    "circle" | "crosshair" | "coords"
  >("circle");
  const [showDataFlow, setShowDataFlow] = useState(false);

  const renderFunction = {
    circle: (pos: Position) => <CircleCursor {...pos} />,
    crosshair: (pos: Position) => <CrosshairCursor {...pos} />,
    coords: (pos: Position) => <CoordinateDisplay {...pos} />,
  }[renderMode];

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Render Props Pattern Demo</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Mouse over the box and toggle render implementations
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setRenderMode("circle")}
          size="sm"
          variant={renderMode === "circle" ? "default" : "outline"}
        >
          Circle Cursor
        </Button>
        <Button
          onClick={() => setRenderMode("crosshair")}
          size="sm"
          variant={renderMode === "crosshair" ? "default" : "outline"}
        >
          Crosshair
        </Button>
        <Button
          onClick={() => setRenderMode("coords")}
          size="sm"
          variant={renderMode === "coords" ? "default" : "outline"}
        >
          Coordinates
        </Button>
        <Button
          onClick={() => setShowDataFlow(!showDataFlow)}
          size="sm"
          variant="outline"
        >
          {showDataFlow ? "Hide" : "Show"} Data Flow
        </Button>
      </div>

      <MouseTracker>{renderFunction}</MouseTracker>

      {showDataFlow && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-purple-900">
            Data Flow (Render Props)
          </p>
          <div className="text-xs text-purple-700 font-mono space-y-1">
            <div className="flex items-center gap-2">
              <span>1. MouseTracker</span>
              <span className="text-purple-400">→</span>
              <span>tracks position</span>
            </div>
            <div className="flex items-center gap-2">
              <span>2. Position object</span>
              <span className="text-purple-400">→</span>
              <span>passed to children function</span>
            </div>
            <div className="flex items-center gap-2">
              <span>3. Render function</span>
              <span className="text-purple-400">→</span>
              <span>decides how to display</span>
            </div>
            <div className="flex items-center gap-2">
              <span>4. UI updates</span>
              <span className="text-purple-400">→</span>
              <span>follow mouse</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs font-medium text-amber-900 mb-2">Key Benefits</p>
        <ul className="space-y-1 text-xs text-amber-800">
          <li>✓ Logic separated from presentation</li>
          <li>✓ Multiple render implementations</li>
          <li>✓ No wrapper hell (vs HOC)</li>
          <li>✓ Flexible data sharing</li>
        </ul>
      </div>
    </div>
  );
}
