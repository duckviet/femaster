"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Example component that will be wrapped
function UserCard({
  user,
  isAuthenticated,
}: {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-700">
          Please log in to view user info
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h4 className="font-semibold text-green-900">{user?.name}</h4>
      <p className="text-sm text-green-700">{user?.email}</p>
    </div>
  );
}

// HOC: withAuthentication
function withAuthentication<P extends object>(
  Component: React.ComponentType<P & { isAuthenticated: boolean }>
) {
  return function AuthenticatedComponent(
    props: Omit<P, "isAuthenticated"> & { isAuthenticated?: boolean }
  ) {
    const isAuthenticated = props.isAuthenticated ?? false;
    return <Component {...(props as P)} isAuthenticated={isAuthenticated} />;
  };
}

// HOC: withLogger
function withLogger<P extends object>(Component: React.ComponentType<P>) {
  return function LoggedComponent(
    props: P & { onLog?: (msg: string) => void }
  ) {
    const { onLog, ...rest } = props;
    React.useEffect(() => {
      onLog?.(`Component mounted: ${Component.displayName || "Unknown"}`);
      return () => {
        onLog?.(`Component unmounted: ${Component.displayName || "Unknown"}`);
      };
    }, [onLog]);

    return <Component {...(rest as P)} />;
  };
}

// Apply multiple HOCs
const EnhancedUserCard = withLogger(
  withAuthentication(UserCard as React.ComponentType<any>)
);

export function HOCPatternDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showMultiple, setShowMultiple] = useState(false);

  const user = {
    name: "John Doe",
    email: "john@example.com",
  };

  const handleLog = useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 10));
  }, []);

  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div>
        <h3 className="text-sm font-semibold">HOC Pattern Demo</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Enhance components with Higher-Order Components
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={toggleAuth} size="sm">
          {isAuthenticated ? "Logout" : "Login"}
        </Button>
        <Button
          onClick={() => setShowMultiple(!showMultiple)}
          size="sm"
          variant="outline"
        >
          {showMultiple ? "Show Single HOC" : "Show Multiple HOCs"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium mb-2">Without HOC</p>
          <div className="p-4 bg-gray-50 border rounded-lg">
            <UserCard user={user} isAuthenticated={isAuthenticated} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-2">
            With {showMultiple ? "Multiple" : "Single"} HOC(s)
          </p>
          <div className="p-4 bg-blue-50 border rounded-lg">
            <EnhancedUserCard
              user={user}
              isAuthenticated={isAuthenticated}
              onLog={handleLog}
            />
          </div>
        </div>
      </div>

      {showMultiple && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-xs font-medium text-indigo-900 mb-2">
            HOCs Applied (bottom to top):
          </p>
          <div className="space-y-1">
            <div className="text-xs text-indigo-700">
              1. <Badge variant="outline">withAuthentication</Badge> - Injects
              isAuthenticated prop
            </div>
            <div className="text-xs text-indigo-700">
              2. <Badge variant="outline">withLogger</Badge> - Tracks lifecycle
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium mb-2">Activity Logs</p>
        <div className="space-y-1 max-h-24 overflow-auto bg-muted rounded-lg p-2">
          {logs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No logs yet...</p>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                className="text-xs font-mono text-muted-foreground"
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
