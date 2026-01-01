"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  text: string;
  author: string;
  replies?: Comment[];
}

const sampleData: Comment[] = [
  {
    id: "1",
    text: "This is a great article! Really helped me understand React patterns.",
    author: "Alice",
    replies: [
      {
        id: "1-1",
        text: "I agree! The examples are very clear.",
        author: "Bob",
        replies: [
          {
            id: "1-1-1",
            text: "Especially the part about Context API.",
            author: "Charlie",
          },
        ],
      },
      {
        id: "1-2",
        text: "Thanks for sharing this resource.",
        author: "Diana",
      },
    ],
  },
  {
    id: "2",
    text: "Could you explain more about the performance implications?",
    author: "Eve",
    replies: [
      {
        id: "2-1",
        text: "Good question! Re-renders can be optimized with useMemo.",
        author: "Frank",
      },
    ],
  },
];

const CommentItem = ({
  comment,
  depth = 0,
}: {
  comment: Comment;
  depth?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`border-l-2 border-muted pl-4 ${depth > 0 ? "ml-4" : ""}`}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
            {comment.author[0]}
          </div>
          <span className="text-sm font-medium">{comment.author}</span>
        </div>
        <p className="text-sm text-foreground/80 mb-2">{comment.text}</p>
        {hasReplies && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 text-xs"
          >
            {isExpanded
              ? "Hide Replies"
              : `Show ${comment.replies?.length} replies`}
          </Button>
        )}
      </div>
      {isExpanded && hasReplies && (
        <div>
          {comment.replies!.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export function NestedCommentsDemo() {
  return (
    <div className="p-4 bg-card rounded-lg border max-h-[400px] overflow-auto">
      <h3 className="text-sm font-semibold mb-4">
        Comments ({sampleData.length})
      </h3>
      <div className="space-y-2">
        {sampleData.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
