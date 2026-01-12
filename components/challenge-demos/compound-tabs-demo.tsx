"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function CompoundTabsDemo() {
  const [mode, setMode] = useState<"controlled" | "uncontrolled">(
    "uncontrolled"
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userNotifications, setUserNotifications] = useState(true);

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      description: "Manage your profile information",
    },
    {
      id: "settings",
      label: "Settings",
      description: "Adjust your preferences",
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Control notification settings",
    },
  ];

  const toggleMode = () => {
    setMode(mode === "controlled" ? "uncontrolled" : "controlled");
    setActiveTab("profile");
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Compound Tabs Demo</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Learn the Compound Component Pattern
          </p>
        </div>
        <Button onClick={toggleMode} size="sm" variant="outline">
          Switch to {mode === "controlled" ? "Uncontrolled" : "Controlled"} Mode
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Current Mode:</span>
        <Badge variant={mode === "controlled" ? "default" : "secondary"}>
          {mode === "controlled" ? "🎮 Controlled" : "🤖 Uncontrolled"}
        </Badge>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <Tabs
          value={mode === "controlled" ? activeTab : undefined}
          onValueChange={mode === "controlled" ? setActiveTab : undefined}
          defaultValue={mode === "uncontrolled" ? "profile" : undefined}
        >
          <TabsList className="grid w-full grid-cols-3">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="space-y-3 mt-4">
            <div className="bg-background rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                  JD
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Email: {userEmail}</p>
                <p>Member since: Jan 2024</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-3 mt-4">
            <div className="bg-background rounded p-3 space-y-2">
              <div className="space-y-2">
                <p className="text-xs font-medium">Theme Preference</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Light
                  </Button>
                  <Button size="sm" variant="default">
                    Dark
                  </Button>
                  <Button size="sm" variant="outline">
                    System
                  </Button>
                </div>
              </div>
              <div className="pt-2 border-t space-y-2">
                <p className="text-xs font-medium">Language</p>
                <select className="text-xs border rounded px-2 py-1 w-full bg-background">
                  <option>English</option>
                  <option>Vietnamese</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-3 mt-4">
            <div className="bg-background rounded p-3 space-y-2">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={userNotifications}
                  onChange={(e) => setUserNotifications(e.target.checked)}
                  className="rounded"
                />
                <span>Enable email notifications</span>
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>New comments on your posts</span>
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Weekly digest</span>
              </label>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {mode === "controlled" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <p className="font-medium mb-1">🎮 Controlled Mode</p>
          <p>Parent controls state: activeTab = &quot;{activeTab}&quot;</p>
          <p className="mt-1 text-blue-600">
            State is managed by the parent component, allowing external control
            and synchronization.
          </p>
        </div>
      )}

      {mode === "uncontrolled" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          <p className="font-medium mb-1">🤖 Uncontrolled Mode</p>
          <p>Component manages its own state (defaultValue)</p>
          <p className="mt-1 text-green-600">
            Each tab manages its own internal state. Parent doesn&apos;t need to
            know which tab is active.
          </p>
        </div>
      )}

      <div className="p-3 bg-muted rounded text-xs space-y-1">
        <p className="font-medium">💡 Key Concept: Compound Components</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Tab, TabList, TabPanel share context via Context API</li>
          <li>
            Each sub-component is independent but coordinated through context
          </li>
          <li>Avoids prop drilling by maintaining shared state internally</li>
          <li>
            Supports both controlled and uncontrolled usage patterns based on
            user needs
          </li>
        </ul>
      </div>
    </div>
  );
}
