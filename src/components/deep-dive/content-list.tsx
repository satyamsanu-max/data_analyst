import Link from "next/link";
import { Badge, EmptyState } from "@/components/ui";
import { SOURCE_TYPE_LABEL, type SourceType } from "@/data/deep-dive/types";
import {
  DD_SOURCE_CLASS,
  DD_STATUS_CLASS,
  DD_STATUS_LABEL,
  DD_TYPE_LABEL,
  DIFFICULTY_CLASS,
  cn,
} from "@/lib/utils";

export type ListRow = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  contentType: string;
  sourceType: string;
  company: string | null;
  role: string | null;
  sourceCount: number;
  status: string;
  bookmarked: boolean;
};

/**
 * The list of items under a topic, grouped by category so a long section is
 * scannable rather than a wall of two hundred rows.
 */
export function ContentList({ rows, showSource }: { rows: ListRow[]; showSource: boolean }) {
  if (rows.length === 0) {
    return (
      <div className="surface p-8">
        <EmptyState title="Nothing matches those filters" body="Try clearing one of them." />
      </div>
    );
  }

  const groups = new Map<string, ListRow[]>();
  for (const r of rows) {
    const list = groups.get(r.category) ?? [];
    list.push(r);
    groups.set(r.category, list);
  }

  return (
    <div className="space-y-4">
      {[...groups.entries()].map(([category, items]) => (
        <div key={category}>
          <div className="flex items-baseline justify-between px-1 pb-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </h3>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {items.filter((i) => i.status === "SOLVED").length}/{items.length}
            </span>
          </div>
          <div className="surface divide-y divide-border">
            {items.map((r) => (
              <Link
                key={r.id}
                href={`/deep-dive/content/${r.id}`}
                className="flex flex-wrap items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-accent"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    r.status === "SOLVED"
                      ? "bg-easy"
                      : r.status === "NEEDS_REVIEW"
                        ? "bg-hard"
                        : r.status === "ATTEMPTED"
                          ? "bg-medium"
                          : "bg-border",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm">{r.title}</span>
                    {r.bookmarked && <span className="text-xs text-medium">★</span>}
                    {r.status !== "NOT_STARTED" && (
                      <Badge className={DD_STATUS_CLASS[r.status]}>{DD_STATUS_LABEL[r.status]}</Badge>
                    )}
                  </div>
                  {(r.company || r.role || r.sourceCount > 1) && (
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 text-[11px] text-muted-foreground">
                      {r.company && <span>{r.company}</span>}
                      {r.role && <span>· {r.role}</span>}
                      {r.sourceCount > 1 && <span>· {r.sourceCount} sources</span>}
                    </div>
                  )}
                </div>
                {showSource && (
                  <Badge className={DD_SOURCE_CLASS[r.sourceType]}>
                    {SOURCE_TYPE_LABEL[r.sourceType as SourceType] ?? r.sourceType}
                  </Badge>
                )}
                {r.contentType !== "QUESTION" && r.contentType !== "CONCEPT" && (
                  <Badge>{DD_TYPE_LABEL[r.contentType]}</Badge>
                )}
                <Badge className={DIFFICULTY_CLASS[r.difficulty]}>{r.difficulty}</Badge>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Filter chips shared by the Learn and Practice pages. */
export function FilterChips({
  label,
  all,
  allActive,
  options,
}: {
  label: string;
  all: string;
  allActive: boolean;
  options: { label: string; href: string; active: boolean }[];
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="stat-label mr-1 w-14 shrink-0">{label}</span>
      <Chip href={all} active={allActive}>
        All
      </Chip>
      {options.map((o) => (
        <Chip key={o.href} href={o.href} active={o.active}>
          {o.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border px-2 py-0.5 text-[11px] transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
