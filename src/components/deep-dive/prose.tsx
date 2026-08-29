import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A small, deliberate Markdown subset renderer.
 *
 * Deep Dive explanations need headings, lists, tables, inline code and bold —
 * and nothing else. Pulling in a full Markdown pipeline plus a sanitiser for
 * that would be a lot of dependency for a fixed, in-repo content set, so this
 * renders the subset directly into React elements. Because it never produces
 * raw HTML, there is no injection surface to sanitise.
 *
 * Supported: `## heading`, `**bold**`, `` `code` ``, `- bullet`, `1. numbered`,
 * GitHub-style pipe tables, and blank-line-separated paragraphs.
 */

type Props = { children?: string | null; className?: string };

export function Prose({ children, className }: Props) {
  if (!children?.trim()) return null;
  return (
    <div className={cn("space-y-3 text-sm leading-relaxed", className)}>
      {renderBlocks(children)}
    </div>
  );
}

function renderBlocks(src: string): React.ReactNode[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Table: a header row followed by a separator row of dashes and pipes.
    if (line.trim().startsWith("|") && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? "")) {
      const header = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      out.push(
        <div key={key++} className="overflow-x-auto">
          <table className="w-full min-w-[22rem] border-collapse text-xs">
            <thead>
              <tr className="border-b border-border">
                {header.map((h, n) => (
                  <th key={n} className="px-2 py-1.5 text-left font-semibold">
                    {inline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, n) => (
                <tr key={n} className="border-b border-border/60 last:border-0">
                  {r.map((cell, m) => (
                    <td key={m} className="px-2 py-1.5 align-top text-muted-foreground">
                      {inline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Headings.
    const h = /^(#{2,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      out.push(
        <p
          key={key++}
          className={cn(
            "font-semibold text-foreground",
            level === 2 ? "mt-4 text-sm" : "mt-3 text-[13px]",
          )}
        >
          {inline(h[2])}
        </p>,
      );
      i++;
      continue;
    }

    // A bold-only line reads as a sub-heading in our content.
    const boldOnly = /^\*\*(.+)\*\*$/.exec(line.trim());
    if (boldOnly) {
      out.push(
        <p key={key++} className="mt-4 text-[13px] font-semibold text-foreground">
          {boldOnly[1]}
        </p>,
      );
      i++;
      continue;
    }

    // Bullet list.
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      out.push(
        <ul key={key++} className="ml-4 list-disc space-y-1.5 text-muted-foreground marker:text-border">
          {items.map((t, n) => (
            <li key={n}>{inline(t)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <ol key={key++} className="ml-4 list-decimal space-y-1.5 text-muted-foreground marker:text-border">
          {items.map((t, n) => (
            <li key={n}>{inline(t)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph: consume until a blank line or a block start.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^#{2,4}\s/.test(lines[i]) &&
      !lines[i].trim().startsWith("|")
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      <p key={key++} className="text-muted-foreground">
        {inline(para.join(" "))}
      </p>,
    );
  }

  return out;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/** Inline `code` and **bold**, applied in one pass so they can coexist. */
function inline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="rounded border border-border bg-secondary/60 px-1 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** A labelled formula / DAX / calculation block. */
export function CodeBlock({
  lang,
  label,
  code,
}: {
  lang: string;
  label?: string;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-1.5">
        <span className="text-[11px] font-medium text-muted-foreground">{label ?? lang}</span>
        <span className="stat-label shrink-0">{lang}</span>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
