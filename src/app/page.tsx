import Link from "next/link";
import { getOrCreateTodayPlan } from "@/lib/plan-service";
import { slotBreakdown, toTaskCards } from "@/lib/serialize";
import { formatDuration, overview } from "@/lib/stats";
import { getSettings } from "@/lib/db";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Meter, Stat } from "@/components/ui";
import { CATEGORY_CLASS, DIFFICULTY_CLASS } from "@/lib/utils";
import { requireUserPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUserPage("/");
  const [plan, stats, settings] = await Promise.all([
    getOrCreateTodayPlan(user.id),
    overview(user.id),
    getSettings(user.id),
  ]);

  const cards = toTaskCards(plan);
  const breakdown = slotBreakdown(cards);
  const planned = cards.reduce((s, c) => s + c.plannedMinutes, 0);
  const doneCount = cards.filter((c) => c.status === "done").length;
  const completionPct = cards.length ? Math.round((doneCount / cards.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="surface overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-6 p-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl font-semibold tracking-tight">Day {plan.dayNumber}</span>
              <Badge className="ml-1">{settings.targetRole}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A {settings.dailyMinutes}-minute plan built for maximum interview value per minute —
              not for maximum question count.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/today">
                <Button size="lg">
                  {doneCount === 0 ? "Start today's session" : "Continue session"}
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {planned} / {settings.dailyMinutes} min · {cards.length} questions
              </span>
            </div>
          </div>

          <div className="w-full max-w-xs shrink-0 space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Today&rsquo;s progress</span>
                <span className="font-medium tabular-nums">{completionPct}%</span>
              </div>
              <Meter value={completionPct} />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Interview readiness</span>
                <span className="font-medium tabular-nums">{stats.readiness}%</span>
              </div>
              <Meter value={stats.readiness} barClassName="bg-easy" />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="text-muted-foreground">Streak</span>
              <span className="font-semibold tabular-nums">
                {stats.streak.current} day{stats.streak.current === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Questions solved" value={stats.totalSolved} hint={`of ${stats.totalQuestions} in the bank`} />
        <Stat label="Total study time" value={formatDuration(stats.totalSeconds)} hint={`${stats.attempts} attempts logged`} />
        <Stat
          label="Avg solve time"
          value={stats.avgSolveSeconds ? formatDuration(stats.avgSolveSeconds) : "—"}
          hint={`${stats.overruns} time overruns`}
        />
        <Stat label="Longest streak" value={stats.streak.longest} hint="consecutive active days" />
      </div>

      {/* Today's plan breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Today&rsquo;s plan</CardTitle>
            <Link href="/today" className="text-xs text-primary hover:underline">
              Open session →
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.slot} className="flex items-center gap-3">
                <span className="w-44 shrink-0 truncate text-sm">{b.slot}</span>
                <Meter value={(b.minutes / Math.max(1, planned)) * 100} className="h-1.5 flex-1" />
                <span className="w-16 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                  {b.minutes} min
                </span>
              </div>
            ))}
            <div className="mt-4 space-y-2 border-t border-border pt-3">
              {cards.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href="/today"
                  className="flex items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-accent"
                >
                  <Badge className={CATEGORY_CLASS[c.question.category]}>{c.question.category}</Badge>
                  <Badge className={DIFFICULTY_CLASS[c.question.difficulty]}>
                    {c.question.difficulty}
                  </Badge>
                  <span className="min-w-0 flex-1 truncate">{c.question.title}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {c.plannedMinutes}m
                  </span>
                  {c.status === "done" && <span className="text-easy">✓</span>}
                </Link>
              ))}
              {cards.length > 4 && (
                <p className="px-1 text-xs text-muted-foreground">
                  +{cards.length - 4} more in today&rsquo;s session
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weakest areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.weakestTopics.map((t) => (
              <div key={t.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{t.label}</span>
                  <span className="tabular-nums text-muted-foreground">{t.mastery}%</span>
                </div>
                <Meter
                  value={t.mastery}
                  className="mt-1 h-1.5"
                  barClassName={t.mastery < 30 ? "bg-hard" : t.mastery < 60 ? "bg-medium" : "bg-easy"}
                />
              </div>
            ))}
            <Link href="/patterns" className="block pt-1 text-xs text-primary hover:underline">
              See full pattern coverage →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Bank progress */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Overall progress</CardTitle>
          <Link href="/progress" className="text-xs text-primary hover:underline">
            Details →
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.categories.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-sm">
                  <span>{c.category}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {c.solved} / {c.total}
                  </span>
                </div>
                <Meter value={(c.solved / Math.max(1, c.total)) * 100} className="mt-1.5 h-1.5" />
                <div className="mt-1 text-[11px] text-muted-foreground">
                  mastery {c.mastery}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
