import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
} from "shiki";

let highlighter: Highlighter | null = null;

const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "html",
  "css",
];

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: SUPPORTED_LANGUAGES,
    });
  }
  return highlighter;
}

export interface HighlightOptions {
  code: string;
  lang?: BundledLanguage;
  theme?: "github-dark" | "github-light";
}

export async function highlightCode({
  code,
  lang = "typescript",
  theme = "github-dark",
}: HighlightOptions): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme,
  });
}

// For use in React Server Components
export async function getHighlightedCode(
  code: string,
  lang: BundledLanguage = "typescript"
): Promise<{ dark: string; light: string }> {
  const hl = await getHighlighter();
  return {
    dark: hl.codeToHtml(code, { lang, theme: "github-dark" }),
    light: hl.codeToHtml(code, { lang, theme: "github-light" }),
  };
}
