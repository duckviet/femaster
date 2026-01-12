"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface LongestSubstringStep {
  left: number;
  right: number;
  currentWindow: string;
  maxSubstring: string;
  maxLength: number;
  description: string;
  seenChars: Map<string, number>;
}

function computeSteps(s: string): LongestSubstringStep[] {
  const steps: LongestSubstringStep[] = [];
  let maxSubstring = "";
  let maxLength = 0;
  let left = 0;
  const seenChars = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If character is already in window, move left pointer
    while (seenChars.has(char) && seenChars.get(char)! >= left) {
      const leftChar = s[left];
      seenChars.delete(leftChar);
      left++;
    }

    seenChars.set(char, right);
    const currentWindow = s.substring(left, right + 1);
    const windowLength = right - left + 1;

    if (windowLength > maxLength) {
      maxLength = windowLength;
      maxSubstring = currentWindow;
    }

    steps.push({
      left,
      right,
      currentWindow,
      maxSubstring,
      maxLength,
      description: `right=${right}, char='${char}' → window="${currentWindow}" (len=${windowLength})`,
      seenChars: new Map(seenChars),
    });
  }

  if (steps.length === 0) {
    return [
      {
        left: 0,
        right: -1,
        currentWindow: "",
        maxSubstring: "",
        maxLength: 0,
        description: "Empty string",
        seenChars: new Map(),
      },
    ];
  }

  return steps;
}

export function LongestSubstringDemo() {
  const [input, setInput] = useState("abcabcbb");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [step, setStep] = useState(0);

  const steps = useMemo(() => computeSteps(input), [input]);

  // Auto-play animation
  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setStep((s) => {
        if (s < steps.length - 1) {
          return s + 1;
        } else {
          setPlaying(false);
          return s;
        }
      });
    }, speed);

    return () => clearInterval(timer);
  }, [playing, steps.length, speed]);

  const currentStep = steps[Math.min(step, steps.length - 1)] || steps[0];

  const handleReset = () => {
    setStep(0);
    setPlaying(false);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            Longest Substring Without Repeating Characters
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Sliding window with character frequency tracking
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setStep(0);
            setPlaying(false);
          }}
          placeholder="Enter string..."
          className="h-8 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handlePlayPause}
          size="sm"
          className="h-8 text-xs"
          disabled={step === steps.length - 1 && !playing}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </Button>
        <Button
          onClick={handleReset}
          size="sm"
          variant="outline"
          className="h-8 text-xs"
        >
          Reset
        </Button>

        <div className="flex-1" />

        <label className="text-xs text-muted-foreground flex items-center gap-2">
          Speed:
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-24"
          />
        </label>
      </div>

      {/* Input Display */}
      <div className="border rounded-lg p-4 bg-background space-y-3">
        <div className="text-xs text-muted-foreground mb-2">String:</div>
        <div className="font-mono text-lg flex gap-1 justify-center flex-wrap">
          {input.split("").map((char, idx) => (
            <div
              key={idx}
              className={`p-2 rounded text-center min-w-8 font-bold transition-all ${
                idx < currentStep.left
                  ? "bg-gray-200 text-gray-600"
                  : idx >= currentStep.left && idx <= currentStep.right
                  ? idx === currentStep.right
                    ? "bg-blue-500 text-white ring-2 ring-blue-300"
                    : "bg-blue-100 text-blue-900 border-2 border-blue-500"
                  : "bg-white border border-gray-300"
              }`}
            >
              {char}
            </div>
          ))}
        </div>

        {/* Window Indicator */}
        <div className="text-xs text-muted-foreground">
          <div>
            Window: [{currentStep.left}, {currentStep.right}]
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-xs text-blue-700 font-medium">
            Current Window
          </div>
          <div className="text-sm font-bold text-blue-900 font-mono">
            "{currentStep.currentWindow}"
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Length: {currentStep.maxLength}
          </div>
        </div>

        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-xs text-green-700 font-medium">
            Max Substring
          </div>
          <div className="text-sm font-bold text-green-900 font-mono">
            "{currentStep.maxSubstring}"
          </div>
          <div className="text-xs text-green-600 mt-1">
            Max Length: {currentStep.maxLength}
          </div>
        </div>
      </div>

      {/* Step Information */}
      <div className="p-3 bg-muted rounded-lg">
        <div className="text-xs font-medium mb-2">
          📍 Step {step + 1} of {steps.length}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {currentStep.description}
        </div>
      </div>

      {/* Character Frequency */}
      {currentStep.seenChars.size > 0 && (
        <div className="p-3 bg-muted/30 rounded border">
          <div className="text-xs font-semibold mb-2">Characters in Window</div>
          <div className="flex flex-wrap gap-2">
            {Array.from(currentStep.seenChars.entries()).map(([char, idx]) => (
              <Badge key={char} variant="outline" className="text-xs">
                <span className="font-mono mr-1">&apos;{char}&apos;</span>
                <span className="text-muted-foreground">@ {idx}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
        <div className="text-xs text-right text-muted-foreground">
          {step + 1} / {steps.length}
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 space-y-1">
        <p className="font-medium">💡 Sliding Window Algorithm</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Maintain a window [left, right] of unique characters</li>
          <li>Expand window by moving right pointer</li>
          <li>Track character positions in a Map/Set</li>
          <li>When duplicate found, shrink from left until unique again</li>
          <li>Track maximum substring throughout</li>
          <li>
            <strong>Time:</strong> O(n), <strong>Space:</strong> O(min(n,
            charset))
          </li>
        </ul>
      </div>
    </div>
  );
}
