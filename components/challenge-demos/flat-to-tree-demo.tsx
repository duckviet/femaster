"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconChevronDown,
  IconChevronRight,
  IconX,
  IconPlus,
} from "@tabler/icons-react";

interface TreeNode {
  id: string;
  parentId: string | null;
  name: string;
  children?: TreeNode[];
}

interface FlatNode {
  id: string;
  parentId: string | null;
  name: string;
}

const defaultFlatData: FlatNode[] = [
  { id: "1", parentId: null, name: "Root" },
  { id: "2", parentId: "1", name: "Child 1" },
  { id: "3", parentId: "1", name: "Child 2" },
  { id: "4", parentId: "2", name: "Grandchild 1" },
  { id: "5", parentId: "3", name: "Grandchild 2" },
  { id: "6", parentId: "4", name: "Great-grandchild" },
];

function flatToTree(flatData: FlatNode[]): {
  tree: TreeNode[];
  orphans: FlatNode[];
} {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];
  const orphans: FlatNode[] = [];

  // First pass: create all nodes
  for (const item of flatData) {
    map.set(item.id, {
      id: item.id,
      parentId: item.parentId,
      name: item.name,
      children: [],
    });
  }

  // Second pass: build hierarchy
  for (const item of flatData) {
    const node = map.get(item.id)!;

    if (item.parentId === null) {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children!.push(node);
      } else {
        orphans.push(item);
      }
    }
  }

  return { tree: roots, orphans };
}

function TreeNodeComponent({
  node,
  depth = 0,
}: {
  node: TreeNode;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <div className="font-mono text-xs">
      <div
        style={{ marginLeft: `${depth * 20}px` }}
        className="flex items-center gap-1 py-1 hover:bg-muted rounded px-2"
      >
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0 hover:bg-muted-foreground/20 rounded"
          >
            {expanded ? (
              <IconChevronDown className="size-3" />
            ) : (
              <IconChevronRight className="size-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <span className="text-blue-600 font-medium">{node.id}</span>
        <span className="text-muted-foreground">:</span>
        <span>{node.name}</span>
      </div>
      {expanded &&
        node.children?.map((child) => (
          <TreeNodeComponent key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export function FlatToTreeDemo() {
  const [flatData, setFlatData] = useState<FlatNode[]>(defaultFlatData);
  const [newId, setNewId] = useState("");
  const [newParentId, setNewParentId] = useState("");
  const [newName, setNewName] = useState("");

  const { tree, orphans } = useMemo(() => flatToTree(flatData), [flatData]);

  const countTreeNodes = (nodes: TreeNode[]): number => {
    return nodes.reduce(
      (acc, node) =>
        1 + (node.children?.length ?? 0) + countTreeNodes(node.children ?? []),
      0
    );
  };

  const addNode = () => {
    if (!newId || !newName) return;

    setFlatData([
      ...flatData,
      {
        id: newId,
        parentId: newParentId || null,
        name: newName,
      },
    ]);

    setNewId("");
    setNewParentId("");
    setNewName("");
  };

  const removeNode = (id: string) => {
    setFlatData(flatData.filter((node) => node.id !== id));
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            Flat Array → Tree Conversion
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Transform flat array with parentId references to hierarchical tree
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left: Input Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold">Flat Array Input</h4>
          <div className="border rounded-lg overflow-auto max-h-64 bg-background">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted border-b">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Parent ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {flatData.map((node) => (
                  <tr
                    key={node.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-2 font-mono text-blue-600">{node.id}</td>
                    <td className="p-2 font-mono text-amber-600">
                      {node.parentId ?? "-"}
                    </td>
                    <td className="p-2">{node.name}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeNode(node.id)}
                        className="text-destructive hover:bg-destructive/10 rounded p-1 transition-colors"
                      >
                        <IconX className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Node Form */}
          <div className="space-y-2 p-2 border rounded-lg bg-muted/30">
            <p className="text-xs font-medium">Add Node</p>
            <Input
              placeholder="ID"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="h-7 text-xs"
            />
            <Input
              placeholder="Parent ID (optional)"
              value={newParentId}
              onChange={(e) => setNewParentId(e.target.value)}
              className="h-7 text-xs"
            />
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-7 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") addNode();
              }}
            />
            <Button
              onClick={addNode}
              size="sm"
              className="w-full h-7 text-xs"
              disabled={!newId || !newName}
            >
              <IconPlus className="size-3" />
              Add Node
            </Button>
          </div>
        </div>

        {/* Right: Tree Output */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold">Tree Output</h4>
          <div className="border rounded-lg p-3 bg-background max-h-64 overflow-auto">
            {tree.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No root nodes found
              </p>
            ) : (
              tree.map((node) => (
                <TreeNodeComponent key={node.id} node={node} />
              ))
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-muted rounded text-center">
              <div className="text-xs text-muted-foreground">Flat Nodes</div>
              <div className="font-bold">{flatData.length}</div>
            </div>
            <div className="p-2 bg-muted rounded text-center">
              <div className="text-xs text-muted-foreground">Tree Nodes</div>
              <div className="font-bold">{countTreeNodes(tree)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orphaned Nodes Warning */}
      {orphans.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          <p className="font-medium mb-1">
            ⚠️ Orphaned Nodes: {orphans.length}
          </p>
          <p className="mb-1">
            These nodes reference non-existent parents and won&apos;t appear in
            the tree:
          </p>
          <div className="flex flex-wrap gap-1">
            {orphans.map((node) => (
              <Badge
                key={node.id}
                variant="outline"
                className="text-amber-700 border-amber-300"
              >
                {node.id} → {node.parentId}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 space-y-1">
        <p className="font-medium">💡 Algorithm: Flat Array to Tree</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Pass 1:</strong> Create Map{"{id → node}"} from all flat
            items
          </li>
          <li>
            <strong>Pass 2:</strong> Link children to parents using Map lookup
          </li>
          <li>
            <strong>Roots:</strong> Nodes with parentId = null
          </li>
          <li>
            <strong>Orphans:</strong> Nodes whose parent doesn&apos;t exist
          </li>
          <li>
            <strong>Time:</strong> O(n) where n = number of nodes
          </li>
        </ul>
      </div>
    </div>
  );
}
