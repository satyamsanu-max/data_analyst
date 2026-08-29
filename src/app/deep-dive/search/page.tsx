import Link from "next/link";
import { requireUserPage } from "@/lib/auth";
import { searchDeepDive } from "@/lib/deep-dive-service";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@/components/ui";
import { SOURCE_TYPE_LABEL, type SourceType } from "@/data/deep-dive/types";
import {
  DD_DOMAIN_CLASS,
  DD_SOURCE_CLASS,
  DD_STATUS_CLASS,
  DD_STATUS_LABEL,
  DD_TYPE_LABEL,
  DIFFICULTY_CLASS,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const EXAMPLES = [
  "XLOOKUP",
  "CALCULATE",
  "LOD",
  "filter context",
  "revenue decline",
  "North Star Metric",
  "market entry",
  "pricing",
];

export default async function DeepDiveSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const user = await requireUserPage("/deep-dive/search");
  const results = q.trim() ? await searchDeepDive(user.id, q.trim()) : [];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/deep-dive" className="text-xs text-muted-foreground hover:text-foreground">
          ← Deep Dive
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Search Deep Dive</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Concepts, questions, cases, guesstimates and industry primers.
        </p>
      </div>

      <Card>
        <CardContent className="pt-5">
          <form action="/deep-dive/search" method="get" className="flex flex-wrap gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Try XLOOKUP, filter context, revenue decline..."
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Search
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {EXAMPLES.map((e) => (
              <Link key={e} href={`/deep-dive/search?q=${encodeURIComponent(e)}`}>
                <Badge className="hover:border-primary hover:text-primary">{e}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {q.trim() && (
        <Card>
          <CardHeader>
            <CardTitle>
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {results.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="Nothing found"
                  body="Try a shorter term, or the name of a function or metric."
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`/deep-dive/content/${r.id}`}
                    className="flex flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-accent"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{r.title}</span>
                        {r.status !== "NOT_STARTED" && (
                          <Badge className={DD_STATUS_CLASS[r.status]}>
                            {DD_STATUS_LABEL[r.status]}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                        <span>{r.sectionName}</span>
                        <span>· {r.category}</span>
                        {r.company && <span>· {r.company}</span>}
                      </div>
                    </div>
                    <Badge className={DD_DOMAIN_CLASS[r.domain]}>
                      {DD_TYPE_LABEL[r.contentType]}
                    </Badge>
                    {r.contentType !== "CONCEPT" && r.contentType !== "INDUSTRY_PRIMER" && (
                      <Badge className={DD_SOURCE_CLASS[r.sourceType]}>
                        {SOURCE_TYPE_LABEL[r.sourceType as SourceType] ?? r.sourceType}
                      </Badge>
                    )}
                    <Badge className={DIFFICULTY_CLASS[r.difficulty]}>{r.difficulty}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
