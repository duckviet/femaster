"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  IconRotateClockwise,
  IconRotate,
  IconTrash,
  IconDownload,
} from "@tabler/icons-react";

interface Point {
  x: number;
  y: number;
}

interface DrawingCommand {
  id: string;
  points: Point[];
  color: string;
}

export function UndoRedoDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<DrawingCommand[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  // Redraw canvas based on history up to currentIndex
  const redrawCanvas = useCallback(
    (historyData: DrawingCommand[], index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Redraw all strokes up to current index
      for (let i = 0; i <= index; i++) {
        const cmd = historyData[i];
        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (cmd.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(cmd.points[0].x, cmd.points[0].y);

          for (let j = 1; j < cmd.points.length; j++) {
            ctx.lineTo(cmd.points[j].x, cmd.points[j].y);
          }
          ctx.stroke();
        }
      }
    },
    []
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPoints([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = [...currentPoints, { x, y }];
    setCurrentPoints(newPoints);

    // Live preview while drawing
    const ctx = canvas.getContext("2d");
    if (ctx) {
      redrawCanvas(history, currentIndex);

      // Draw current stroke
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(newPoints[0].x, newPoints[0].y);
      for (let i = 1; i < newPoints.length; i++) {
        ctx.lineTo(newPoints[i].x, newPoints[i].y);
      }
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || currentPoints.length === 0) {
      setIsDrawing(false);
      return;
    }

    // Add new command to history
    const newCommand: DrawingCommand = {
      id: Math.random().toString(36),
      points: currentPoints,
      color: strokeColor,
    };

    // Remove any future history (redo stack)
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newCommand);

    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setCurrentPoints([]);
    setIsDrawing(false);

    // Redraw
    redrawCanvas(newHistory, newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentIndex < 0) return;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    redrawCanvas(history, newIndex);
  };

  const handleRedo = () => {
    if (currentIndex >= history.length - 1) return;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    redrawCanvas(history, newIndex);
  };

  const handleClear = () => {
    setHistory([]);
    setCurrentIndex(-1);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "drawing.png";
    link.click();
  };

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-sm font-semibold">Drawing Canvas with Undo/Redo</h3>
        <p className="text-xs text-muted-foreground">
          Draw on the canvas, then use undo/redo to navigate history
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium">Color:</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-8 h-8 cursor-pointer rounded border"
          />
        </div>

        <div className="flex items-center gap-1 border-l pl-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <IconRotate className="size-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <IconRotateClockwise className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-l pl-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={history.length === 0}
          >
            <IconDownload className="size-4" />
            Download
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            disabled={history.length === 0}
          >
            <IconTrash className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full cursor-crosshair bg-white"
        />
      </div>

      {/* History Info */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-blue-50 rounded">
          <div className="text-muted-foreground">Total Strokes</div>
          <div className="text-lg font-semibold text-blue-600">
            {history.length}
          </div>
        </div>

        <div className="p-2 bg-green-50 rounded">
          <div className="text-muted-foreground">Current Position</div>
          <div className="text-lg font-semibold text-green-600">
            {currentIndex + 1} / {history.length}
          </div>
        </div>

        <div className="p-2 bg-purple-50 rounded">
          <div className="text-muted-foreground">Redo Available</div>
          <div className="text-lg font-semibold text-purple-600">
            {Math.max(0, history.length - currentIndex - 1)}
          </div>
        </div>
      </div>

      {/* History List */}
      {history.length > 0 && (
        <div className="border rounded-lg p-2 bg-card/50 max-h-40 overflow-auto">
          <div className="text-xs font-semibold mb-2">History</div>
          <div className="space-y-1">
            {history.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`text-xs px-2 py-1 rounded flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors ${
                  idx === currentIndex
                    ? "bg-primary/10 text-primary font-medium"
                    : idx < currentIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => {
                  setCurrentIndex(idx);
                  redrawCanvas(history, idx);
                }}
              >
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: cmd.color, borderColor: cmd.color }}
                />
                <span>Stroke {idx + 1}</span>
                {idx === currentIndex && " ← current"}
                {idx > currentIndex && " (redo)"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-muted-foreground border-t pt-2">
        <p>
          <strong>How it works:</strong> Each stroke is stored as a command in
          the history. When you undo, we move back in the history and redraw the
          canvas. When you redo, we move forward. If you draw after undo, the
          future history is cleared.
        </p>
      </div>
    </div>
  );
}
