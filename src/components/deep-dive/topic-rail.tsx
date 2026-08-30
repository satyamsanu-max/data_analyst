import Link from "next/link";
import { Meter } from "@/components/ui";
import { DOMAIN_LABEL, type Domain } from "@/data/deep-dive/types";
import { cn } from "@/lib/utils";

export type RailSection = {
  slug: string;
  name: string;
  domain: Domain;
  conceptTotal: number;
  questionTotal: number;
  conceptDone: number;
  questionDone: number;
};

/** Preserve the domain across Learn/Practice/topic links, when one is scoped. */
function href(mode: "learn" | "practice", topic: string, domain?: Domain) {
  const q = new URLSearchParams({ topic });
  if (domain) q.set("domain", domain);
  return `/deep-dive/${mode}?${q.toString()}`;
}

/**
 * The topic switcher that sits beside the Learn and Practice lists.
 *
 * The whole point of this layout is that choosing a topic does not cost a page
 * of its own: the rail and the content sit side by side, so reaching an item is
 * two clicks from the sidebar rather than four.
 *
 * When `domain` is set the rail shows only that stream's topics, because the
 * sidebar now enters Product Management, Consulting and Data separately — a
 * consultant should not have to scroll past Power BI to find market entry.
 */
export function TopicRail({
  sections,
  active,
  mode,
  domain,
}: {
  sections: RailSection[];
  active: string;
  mode: "learn" | "practice";
  domain?: Domain;
}) {
  const domains: Domain[] = domain ? [domain] : ["DATA", "PRODUCT", "CONSULTING"];
  const relevant = sections.filter((s) =>
    mode === "learn" ? s.conceptTotal > 0 : s.questionTotal > 0,
  );

  return (
    <nav className="surface divide-y divide-border lg:sticky lg:top-4">
      {domains.map((d) => {
        const rows = relevant.filter((s) => s.domain === d);
        if (rows.length === 0) return null;
        return (
          <div key={d} className="p-2">
            <div className="stat-label px-2 pb-1 pt-1">{DOMAIN_LABEL[d]}</div>
            {rows.map((s) => {
              const total = mode === "learn" ? s.conceptTotal : s.questionTotal;
              const done = mode === "learn" ? s.conceptDone : s.questionDone;
              const isActive = s.slug === active;
              return (
                <Link
                  key={s.slug}
                  href={href(mode, s.slug, domain)}
                  className={cn(
                    "block rounded-md px-2 py-1.5 transition-colors",
                    isActive ? "bg-secondary" : "hover:bg-accent",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        isActive ? "font-medium text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.name}
                    </span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {done}/{total}
                    </span>
                  </div>
                  {done > 0 && (
                    <Meter value={(done / Math.max(1, total)) * 100} className="mt-1 h-1" />
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

/** The Learn / Practice switch, shown above the content on both pages. */
export function ModeTabs({
  mode,
  topic,
  domain,
}: {
  mode: "learn" | "practice";
  topic: string;
  domain?: Domain;
}) {
  const tabs = [
    { key: "learn" as const, label: "Learn", blurb: "Concepts" },
    { key: "practice" as const, label: "Practice", blurb: "Interview questions" },
  ];
  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={href(t.key, topic, domain)}
          className={cn(
            "flex-1 rounded-md border px-4 py-2.5 transition-colors",
            mode === t.key
              ? "border-primary bg-primary/10"
              : "border-border hover:bg-accent",
          )}
        >
          <div
            className={cn(
              "text-sm font-medium",
              mode === t.key ? "text-primary" : "text-foreground",
            )}
          >
            {t.label}
          </div>
          <div className="text-[11px] text-muted-foreground">{t.blurb}</div>
        </Link>
      ))}
    </div>
  );
}
