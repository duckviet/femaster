"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconTrash,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

interface TreeNodeProps {
  item: FileItem;
  level: number;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TreeNode = ({
  item,
  level,
  expanded,
  onToggle,
  onDelete,
}: TreeNodeProps) => {
  const isFolder = item.type === "folder";
  const isExpanded = expanded[item.id] ?? false;
  const hasChildren = isFolder && item.children && item.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-muted rounded cursor-pointer group"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {isFolder && (
          <button onClick={() => onToggle(item.id)} className="p-0 w-5">
            {isExpanded ? (
              <IconChevronDown className="size-4" />
            ) : (
              <IconChevronRight className="size-4" />
            )}
          </button>
        )}
        {!isFolder && <div className="w-5" />}

        <span className="text-lg">{isFolder ? "📁" : "📄"}</span>

        <span className="text-sm flex-1">{item.name}</span>

        <button
          onClick={() => onDelete(item.id)}
          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 rounded"
        >
          <IconTrash className="size-3 text-destructive" />
        </button>
      </div>

      {isFolder && isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function FileExplorerDemo() {
  const initialData: FileItem = {
    id: "root",
    name: "my-project",
    type: "folder",
    children: [
      {
        id: "src",
        name: "src",
        type: "folder",
        children: [
          { id: "app.tsx", name: "app.tsx", type: "file" },
          { id: "index.ts", name: "index.ts", type: "file" },
          {
            id: "components",
            name: "components",
            type: "folder",
            children: [
              { id: "button.tsx", name: "Button.tsx", type: "file" },
              { id: "card.tsx", name: "Card.tsx", type: "file" },
            ],
          },
        ],
      },
      { id: "package.json", name: "package.json", type: "file" },
      { id: "tsconfig.json", name: "tsconfig.json", type: "file" },
      {
        id: "public",
        name: "public",
        type: "folder",
        children: [{ id: "favicon.ico", name: "favicon.ico", type: "file" }],
      },
    ],
  };

  const [data, setData] = useState<FileItem>(initialData);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
    src: true,
    components: false,
  });

  const handleToggle = useCallback((id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (id === "root") return; // Prevent deleting root

      const deleteRecursive = (item: FileItem): FileItem => ({
        ...item,
        children: item.children
          ?.filter((child) => child.id !== id)
          .map(deleteRecursive),
      });

      setData(deleteRecursive(data));
    },
    [data]
  );

  const stats = useMemo(() => {
    let fileCount = 0;
    let folderCount = 0;

    const count = (item: FileItem) => {
      if (item.type === "file") fileCount++;
      else folderCount++;

      item.children?.forEach(count);
    };

    count(data);
    return { fileCount, folderCount };
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-sm font-semibold">File Explorer</h3>
        <p className="text-xs text-muted-foreground">
          Click arrows to expand/collapse folders. Click trash to delete items.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-blue-50 rounded">
          <div className="text-muted-foreground">Folders</div>
          <div className="text-lg font-semibold text-blue-600">
            {stats.folderCount}
          </div>
        </div>
        <div className="p-2 bg-green-50 rounded">
          <div className="text-muted-foreground">Files</div>
          <div className="text-lg font-semibold text-green-600">
            {stats.fileCount}
          </div>
        </div>
      </div>

      {/* Tree */}
      <div className="border rounded-lg p-3 bg-card/50 max-h-80 overflow-auto font-mono text-sm">
        <TreeNode
          item={data}
          level={0}
          expanded={expanded}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground border-t pt-2">
        <p>
          <strong>How it works:</strong> This demonstrates recursive React
          components. Each TreeNode renders itself for children. State is lifted
          up to prevent unnecessary re-renders. Try expanding folders and
          deleting items.
        </p>
      </div>
    </div>
  );
}
