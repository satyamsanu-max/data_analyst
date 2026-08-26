import { formatDuration, weeklyReview } from "@/lib/stats";
import { Card, CardContent, CardHeader, CardTitle, Meter, Stat } from "@/components/ui";
import { OUTCOME_LABELS, type Outcome } from "@/lib/mastery";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const user = await requireUser();
  const [thisWeek, lastWeek] = await Promise.all([
    weeklyReview(user.id, 0),
    weeklyReview(user.id, 1),
  ]);

  const delta = thisWeek.totalSeconds - lastWeek.totalSeconds;
  const completionPct = thisWeek.planned
    ? Math.round((thisWeek.completed / thisWeek.planned) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="stat-label">Insight</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Weekly Review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {thisWeek.weekStart} → {thisWeek.weekEnd}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Study time"
          value={formatDuration(thisWeek.totalSeconds)}
          hint={
            lastWeek.totalSeconds
              ? `${delta >= 0 ? "+" : ""}${formatDuration(Math.abs(delta))} vs last week`
              : "no prior week"
          }
        />
        <Stat label="Days active" value={`${thisWeek.daysActive} / 7`} />
        <Stat
          label="Tasks completed"
          value={`${thisWeek.completed} / ${thisWeek.planned}`}
          hint={`${completionPct}% of what was planned`}
        />
        <Stat
          label="Questions attempted"
          value={thisWeek.byCategory.reduce((s, c) => s + c.count, 0)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>By category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {thisWeek.byCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing logged this week yet.</p>
            ) : (
              thisWeek.byCategory.map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm">{c.category}</span>
                  <Meter
                    value={
                      (c.count /
                        Math.max(1, Math.max(...thisWeek.byCategory.map((x) => x.count)))) *
                      100
                    }
                    className="h-1.5 flex-1"
                  />
                  <span className="w-8 shrink-0 text-right text-sm tabular-nums">{c.count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How it went</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(thisWeek.outcomes).length === 0 ? (
              <p className="text-sm text-muted-foreground">No attempts recorded this week.</p>
            ) : (
              (Object.keys(OUTCOME_LABELS) as Outcome[]).map((o) => (
                <div key={o} className="flex items-center justify-between text-sm">
                  <span>{OUTCOME_LABELS[o]}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {thisWeek.outcomes[o] ?? 0}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weakest areas — next week&rsquo;s emphasis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thisWeek.weakestAreas.map((w, i) => (
            <div key={w.label}>
              <div className="flex items-center justify-between text-sm">
                <span>
                  <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                  {w.label}
                </span>
                <span className="tabular-nums text-muted-foreground">{w.mastery}% mastery</span>
              </div>
              <Meter
                value={w.mastery}
                className="mt-1 h-1.5"
                barClassName={w.mastery < 30 ? "bg-hard" : w.mastery < 60 ? "bg-medium" : "bg-easy"}
              />
            </div>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">
            These feed straight back into the scheduler — the daily plan already weights weakness at
            20% of the priority score, and shifts a whole slot when the gap between your strongest and
            weakest area gets large.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
