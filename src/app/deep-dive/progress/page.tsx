import Link from "next/link";
import { requireUserPage } from "@/lib/auth";
import { bookmarks, deepDiveOverview, weakCategories } from "@/lib/deep-dive-service";
import { Badge, Card, CardContent, CardHeader, CardTitle, Meter, Stat } from "@/components/ui";
import { DOMAIN_LABEL, type Domain } from "@/data/deep-dive/types";
import {
  DD_DOMAIN_CLASS,
  DD_STATUS_CLASS,
  DD_STATUS_LABEL,
  DD_TYPE_LABEL,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Deep Dive progress.
 *
 * Deliberately separate from /progress, which reports Daily Practice mastery,
 * streaks and solve times. Nothing on this page reads those tables, and nothing
 * here contributes to them.
 */
export default async function DeepDiveProgressPage() {
  const user = await requireUserPage("/deep-dive/progress");
  const [overview, weak, marks] = await Promise.all([
    deepDiveOverview(user.id),
    weakCategories(user.id),
    bookmarks(user.id),
  ]);

  const pct = Math.round((overview.done / Math.max(1, overview.total)) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="stat-label">Deep Dive</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Your progress through the Deep Dive library. Tracked separately from Daily Practice —
          nothing here affects your streak, your mastery scores, or today&rsquo;s plan.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Completed" value={`${pct}%`} hint={`${overview.done} of ${overview.total}`} />
        <Stat
          label="Solved"
          value={overview.statusCounts.SOLVED ?? 0}
          hint="marked done"
        />
        <Stat
          label="Needs review"
          value={overview.statusCounts.NEEDS_REVIEW ?? 0}
          hint="flagged to revisit"
        />
        <Stat label="Bookmarked" value={overview.bookmarked} hint="saved for later" />
      </div>

      {/* ---------------------------------------------------------- by domain */}
      {overview.byDomain.map((d) => (
        <Card key={d.domain}>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={DD_DOMAIN_CLASS[d.domain as Domain]}>
                {DOMAIN_LABEL[d.domain as Domain]}
              </Badge>
              <CardTitle>
                {d.done} / {d.total}
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              {d.conceptDone}/{d.conceptTotal} concepts · {d.questionDone}/{d.questionTotal}{" "}
              questions
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {d.sections.map((s) => (
              <div key={s.slug}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="flex items-center gap-3 text-xs text-muted-foreground">
                    {s.conceptTotal > 0 && (
                      <Link
                        href={`/deep-dive/learn?topic=${s.slug}`}
                        className="hover:text-primary hover:underline"
                      >
                        Learn {s.conceptDone}/{s.conceptTotal}
                      </Link>
                    )}
                    {s.questionTotal > 0 && (
                      <Link
                        href={`/deep-dive/practice?topic=${s.slug}`}
                        className="hover:text-primary hover:underline"
                      >
                        Practice {s.questionDone}/{s.questionTotal}
                      </Link>
                    )}
                  </span>
                </div>
                <Meter
                  value={
                    ((s.conceptDone + s.questionDone) /
                      Math.max(1, s.conceptTotal + s.questionTotal)) *
                    100
                  }
                  className="mt-1 h-1.5"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ------------------------------------------------------ weak areas */}
        <Card>
          <CardHeader>
            <CardTitle>Where you are weakest</CardTitle>
            <p className="text-xs text-muted-foreground">
              Share of what you have started in each category that you have marked solved. Only
              categories with at least two attempted items appear.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {weak.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Attempt a few questions and the weak areas will appear here.
              </p>
            ) : (
              weak.map((w) => (
                <div key={`${w.section}-${w.category}`}>
                  <div className="flex items-center justify-between text-sm">
                    <Link
                      href={`/deep-dive/practice?topic=${w.section}&category=${encodeURIComponent(w.category)}`}
                      className="hover:text-primary hover:underline"
                    >
                      {w.category}
                    </Link>
                    <span className="tabular-nums text-muted-foreground">
                      {w.pct}% · {w.solved}/{w.total}
                    </span>
                  </div>
                  <Meter
                    value={w.pct}
                    className="mt-1 h-1.5"
                    barClassName={w.pct < 40 ? "bg-hard" : w.pct < 70 ? "bg-medium" : "bg-easy"}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* -------------------------------------------------------- bookmarks */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Bookmarked</CardTitle>
            {marks.length > 0 && (
              <Link href="/deep-dive/bookmarks" className="text-xs text-primary hover:underline">
                See all
              </Link>
            )}
          </CardHeader>
          <CardContent className="space-y-1.5">
            {marks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Star anything you want to come back to.
              </p>
            ) : (
              marks.slice(0, 8).map((m) => (
                <Link
                  key={m.id}
                  href={`/deep-dive/content/${m.id}`}
                  className="flex items-center justify-between gap-2 text-xs hover:text-primary"
                >
                  <span className="min-w-0 flex-1 truncate">{m.title}</span>
                  <span className="shrink-0 text-muted-foreground">{m.sectionName}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------ recent */}
      <Card>
        <CardHeader>
          <CardTitle>Recently worked on</CardTitle>
        </CardHeader>
        <CardContent>
          {overview.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing yet. Open{" "}
              <Link href="/deep-dive/learn" className="text-primary hover:underline">
                Learn
              </Link>{" "}
              or{" "}
              <Link href="/deep-dive/practice" className="text-primary hover:underline">
                Practice
              </Link>{" "}
              to begin.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {overview.recent.map((r) => (
                <Link
                  key={r.id}
                  href={`/deep-dive/content/${r.id}`}
                  className="flex flex-wrap items-center gap-3 py-2 text-sm hover:text-primary"
                >
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">
                    {r.updatedAt.toLocaleDateString()}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{r.title}</span>
                  <Badge>{DD_TYPE_LABEL[r.contentType]}</Badge>
                  <Badge className={DD_STATUS_CLASS[r.status]}>{DD_STATUS_LABEL[r.status]}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
