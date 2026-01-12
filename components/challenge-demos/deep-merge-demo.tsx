"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MergeStep {
  description: string;
  current: Record<string, any>;
  conflictKeys: string[];
  path: string;
}

function deepMergeWithSteps(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
  strategy: "overwrite" | "concat" = "overwrite",
  path = "root"
): MergeStep[] {
  const steps: MergeStep[] = [];
  let result = JSON.parse(JSON.stringify(obj1));

  const merge = (target: any, source: any, currentPath: string) => {
    for (const key in source) {
      const fullPath = `${currentPath}.${key}`;
      const isConflict = key in target;

      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === "object" &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        // Nested object - recurse
        merge(target[key], source[key], fullPath);
      } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
        // Array handling based on strategy
        if (strategy === "concat") {
          target[key] = [...target[key], ...source[key]];
        } else {
          target[key] = source[key];
        }
        steps.push({
          description: `${
            strategy === "concat" ? "Concatenate" : "Overwrite"
          } array at ${fullPath}`,
          current: JSON.parse(JSON.stringify(result)),
          conflictKeys: [key],
          path: fullPath,
        });
      } else {
        // Simple value - merge
        const oldValue = target[key];
        target[key] = source[key];

        if (isConflict) {
          steps.push({
            description: `Overwrite ${fullPath}: ${JSON.stringify(
              oldValue
            )} → ${JSON.stringify(source[key])}`,
            current: JSON.parse(JSON.stringify(result)),
            conflictKeys: [key],
            path: fullPath,
          });
        } else {
          steps.push({
            description: `Add ${fullPath}: ${JSON.stringify(source[key])}`,
            current: JSON.parse(JSON.stringify(result)),
            conflictKeys: [],
            path: fullPath,
          });
        }
      }
    }
  };

  merge(result, obj2, path);

  if (steps.length === 0) {
    steps.push({
      description: "Objects are identical",
      current: result,
      conflictKeys: [],
      path: "root",
    });
  }

  return steps;
}

const defaultObj1 = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    zip: "10001",
  },
  hobbies: ["reading", "gaming"],
};

const defaultObj2 = {
  age: 31,
  email: "john@example.com",
  address: {
    country: "USA",
  },
  hobbies: ["coding"],
};

export function DeepMergeDemo() {
  const [obj1Str, setObj1Str] = useState(JSON.stringify(defaultObj1, null, 2));
  const [obj2Str, setObj2Str] = useState(JSON.stringify(defaultObj2, null, 2));
  const [strategy, setStrategy] = useState<"overwrite" | "concat">("overwrite");
  const [step, setStep] = useState(0);

  let obj1: Record<string, any> = {};
  let obj2: Record<string, any> = {};

  try {
    obj1 = JSON.parse(obj1Str);
    obj2 = JSON.parse(obj2Str);
  } catch {
    // Invalid JSON
  }

  const mergeSteps = useMemo(
    () => deepMergeWithSteps(obj1, obj2, strategy),
    [obj1, obj2, strategy]
  );

  const currentStep = mergeSteps[Math.min(step, mergeSteps.length - 1)];

  const renderJsonValue = (value: any, depth = 0): React.ReactNode => {
    if (value === null) return <span className="text-orange-600">null</span>;
    if (typeof value === "boolean")
      return <span className="text-blue-600">{String(value)}</span>;
    if (typeof value === "number")
      return <span className="text-green-600">{value}</span>;
    if (typeof value === "string")
      return <span className="text-red-600">&quot;{value}&quot;</span>;

    if (Array.isArray(value)) {
      return (
        <>
          [
          {value.length > 0 && (
            <div style={{ marginLeft: `${depth + 1}em` }}>
              {value.map((item, i) => (
                <div key={i}>
                  {renderJsonValue(item, depth + 1)}
                  {i < value.length - 1 && ","}
                </div>
              ))}
            </div>
          )}
          ]
        </>
      );
    }

    if (typeof value === "object") {
      const keys = Object.keys(value);
      return (
        <>
          {"{"}
          {keys.length > 0 && (
            <div style={{ marginLeft: `${depth + 1}em` }}>
              {keys.map((key, i) => (
                <div key={key}>
                  <span className="font-medium">{key}</span>: &nbsp;
                  {renderJsonValue(value[key], depth + 1)}
                  {i < keys.length - 1 && ","}
                </div>
              ))}
            </div>
          )}
          {"}"}
        </>
      );
    }

    return String(value);
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Deep Merge Visualization</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Recursively merge nested objects step by step
          </p>
        </div>
        <Select value={strategy} onValueChange={(v: any) => setStrategy(v)}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overwrite">Overwrite Arrays</SelectItem>
            <SelectItem value="concat">Concat Arrays</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium">Object 1</label>
          <textarea
            value={obj1Str}
            onChange={(e) => {
              setObj1Str(e.target.value);
              setStep(0);
            }}
            className="w-full h-32 p-2 text-xs font-mono border rounded bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium">Object 2</label>
          <textarea
            value={obj2Str}
            onChange={(e) => {
              setObj2Str(e.target.value);
              setStep(0);
            }}
            className="w-full h-32 p-2 text-xs font-mono border rounded bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setStep(Math.max(0, step - 1))}
            size="sm"
            variant="outline"
            disabled={step === 0}
          >
            ← Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Step {step + 1} / {mergeSteps.length}
          </span>
          <Button
            onClick={() => setStep(Math.min(mergeSteps.length - 1, step + 1))}
            size="sm"
            variant="outline"
            disabled={step === mergeSteps.length - 1}
          >
            Next →
          </Button>
        </div>
        <Button
          onClick={() => setStep(0)}
          size="sm"
          variant="ghost"
          className="h-8 text-xs"
        >
          Reset
        </Button>
      </div>

      <div className="p-3 bg-muted/30 rounded border text-xs">
        <p className="font-medium mb-1">📝 Step {step + 1}:</p>
        <p>{currentStep.description}</p>
      </div>

      <div className="border rounded-lg p-3 bg-background">
        <h4 className="text-xs font-semibold mb-2">Result (Live)</h4>
        <div className="text-xs font-mono max-h-48 overflow-auto">
          {renderJsonValue(currentStep.current)}
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 space-y-1">
        <p className="font-medium">💡 Deep Merge Algorithm</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Recursively traverse both objects</li>
          <li>For nested objects, merge recursively</li>
          <li>For arrays, choose strategy (overwrite or concat)</li>
          <li>For primitive values, source overwrites target</li>
          <li>Handle conflicts when keys exist in both objects</li>
        </ul>
      </div>
    </div>
  );
}
