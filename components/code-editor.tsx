"use client";

import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconAlertCircle,
  IconCheck,
  IconLoader,
  IconTestPipe,
  IconX,
} from "@tabler/icons-react";
import { Challenge } from "@/lib/challenges";

interface CodeEditorProps {
  challenge: Challenge;
  functionName?: string;
  testCases?: Array<{
    name: string;
    args: any[];
    expected: any;
  }>;
}

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  output?: string;
}

export function CodeEditor({
  challenge,
  testCases = [],
  functionName,
}: CodeEditorProps) {
  const [code, setCode] = useState(challenge.code[0].content);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const editorRef = useRef(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Create a worker to execute user code safely
      const blob = new Blob(
        [
          `
        // Load Babel in the worker so we can strip TypeScript syntax before executing
        self.importScripts("https://unpkg.com/@babel/standalone@7.26.3/babel.min.js");

        const transpile = (code) => {
          try {
            return self.Babel.transform(code, {
              presets: ["typescript", "react"],
              filename: "user-code.tsx",
            }).code;
          } catch (error) {
            const message = error?.message || "Transpile failed";
            throw new Error(message);
          }
        };

        self.onmessage = async (event) => {
          const { userCode, testCases, functionName } = event.data;
          const results = [];
          
          try {
            // Transpile TS/TSX to runnable JS to avoid syntax errors like "Unexpected token ':'"
            const transpiled = transpile(userCode);
            
            // Execute the transpiled code and try to locate the target function
            const exports = {};
            const module = { exports };
            const fnHolder = { fn: null };

            // Build the function code to execute user code and find the target function
            let fnCode = '"use strict";\\n' + transpiled + '\\n;fnHolder.fn = (function() {\\n';
            if (functionName) {
              fnCode += "  if (typeof " + functionName + " !== 'undefined') return " + functionName + ";\\n";
              fnCode += "  if (module && module.exports && module.exports['" + functionName + "']) return module.exports['" + functionName + "'];\\n";
              fnCode += "  if (exports && exports['" + functionName + "']) return exports['" + functionName + "'];\\n";
              fnCode += "  return null;\\n";
            } else {
              fnCode += "  if (module && module.exports) return module.exports.default || module.exports;\\n";
              fnCode += "  if (exports) return exports.default || exports;\\n";
              fnCode += "  return null;\\n";
            }
            fnCode += "})();";
            
            const runner = new Function("exports", "module", "fnHolder", fnCode);
            runner(exports, module, fnHolder);

            const userFunction = fnHolder.fn;

            if (typeof userFunction !== "function") {
              throw new Error(
                functionName
                  ? "Expected function '" + functionName + "' but did not find one. Ensure you define or export it."
                  : "No exported function found. Please export a function to test."
              );
            }
            
            // Run each test case
            for (const testCase of testCases) {
              try {
                const args = Array.isArray(testCase.args) ? testCase.args : [];
                const result = userFunction(...args);
                results.push({
                  name: testCase.name,
                  passed: JSON.stringify(result) === JSON.stringify(testCase.expected),
                  output: JSON.stringify(result),
                });
              } catch (error) {
                results.push({
                  name: testCase.name,
                  passed: false,
                  error: error.message,
                });
              }
            }
          } catch (error) {
            results.push({
              name: "Syntax Error",
              passed: false,
              error: error.message,
            });
          }
          
          self.postMessage(results);
        };
      `,
        ],
        { type: "application/javascript" },
      );

      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      worker.onmessage = (event) => {
        setResults(event.data);
        setIsRunning(false);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };

      worker.onerror = (error) => {
        setResults([
          {
            name: "Worker Error",
            passed: false,
            error: error.message,
          },
        ]);
        setIsRunning(false);
      };

      worker.postMessage({ userCode: code, testCases, functionName });
    } catch (error) {
      setResults([
        {
          name: "Error",
          passed: false,
          error: (error as Error).message,
        },
      ]);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(challenge.code[0].content);
    setResults([]);
  };

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div>
      <div className="space-x-2 mb-2 inline-flex items-center">
        <IconTestPipe size={14} />
        <span className="font-medium text-gray-500 text-sm ">
          Try It Yourself
        </span>
      </div>
      <div className="space-y-4 grid grid-cols-2 h-full">
        {/* Editor */}
        <Card className="overflow-hidden py-0 mb-0 gap-0">
          <div className="p-4 py-2 border-b bg-muted flex items-center justify-end">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleRunTests}
                disabled={isRunning}
                className="gap-2"
              >
                {isRunning && <IconLoader className="w-4 h-4 animate-spin" />}
                Run Tests
              </Button>
            </div>
          </div>

          <Editor
            height="400px"
            language={
              challenge.language === "tsx" ? "typescript" : challenge.language
            }
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 1.6,
              tabSize: 2,
            }}
          />
        </Card>

        {/* Test Results */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Test Results</h4>
              <div className="flex items-center gap-2">
                <Badge
                  variant={passedCount === totalCount ? "default" : "secondary"}
                >
                  {passedCount}/{totalCount} passed
                </Badge>
              </div>
            </div>
            {results.length > 0 ? (
              <div className="flex flex-col justify-between gap-2">
                <div className="space-y-2">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-background"
                    >
                      <div className="mt-1">
                        {result.passed ? (
                          <IconCheck className="w-5 h-5 text-green-500" />
                        ) : result.error ? (
                          <IconX className="w-5 h-5 text-red-500" />
                        ) : (
                          <IconAlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{result.name}</p>
                        {result.error && (
                          <p className="text-sm text-red-500 mt-1">
                            {result.error}
                          </p>
                        )}
                        {result.output && (
                          <p
                            className={`text-sm mt-1 tracking-wide ${
                              result.passed
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            Output: {result.output}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Comparison */}
                {results.length > 0 && passedCount === totalCount && (
                  <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <IconCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                          Excellent! All tests passed!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Compare your solution with the optimal approach in the
                          code above.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run the tests to see results here.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
