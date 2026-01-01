"use client";

import { useEffect, useState } from "react";
import { highlightCode } from "@/lib/shiki";
import type { BundledLanguage } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: BundledLanguage;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
  className = "",
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        const highlighted = await highlightCode({
          code,
          lang: language,
          theme: "github-dark",
        });
        if (mounted) {
          setHtml(highlighted);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to highlight code:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      mounted = false;
    };
  }, [code, language]);

  if (isLoading) {
    return (
      <div className={`rounded-lg bg-[#24292e] p-4 ${className}`}>
        <pre className="overflow-x-auto">
          <code className="text-sm text-gray-300">{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`shiki-wrapper rounded-lg overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Server Component version for RSC
interface ServerCodeBlockProps {
  html: string;
  className?: string;
}

export function ServerCodeBlock({
  html,
  className = "",
}: ServerCodeBlockProps) {
  return (
    <div
      className={`shiki-wrapper rounded-lg overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
