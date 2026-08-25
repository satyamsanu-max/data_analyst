import Link from "next/link";
import { formatDuration, overview } from "@/lib/stats";
import { prisma } from "@/lib/db";
import { Badge, Card, CardContent, CardHeader, CardTitle, Meter, Stat } from "@/components/ui";
import { STATUS_LABEL, categorySlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const [stats, statusCounts, recent] = await Promise.all([
    overview(),
    prisma.userProgress.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.attempt.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { question: { include: { topic: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="stat-label">Insight</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Progress</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Interview readiness" value={`${stats.readiness}%`} hint="mastery, minus blind spots" />
        <Stat label="Current streak" value={stats.streak.current} hint={`longest ${stats.streak.longest}`} />
        <Stat label="Total study time" value={formatDuration(stats.totalSeconds)} hint={`${stats.attempts} attempts`} />
        <Stat
          label="Avg solve time"
          value={stats.avgSolveSeconds ? formatDuration(stats.avgSolveSeconds) : "—"}
          hint={`${stats.overruns} overruns`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.categories.map((c) => (
            <div key={c.category}>
              <div className="flex items-center justify-between text-sm">
                <Link
                  href={`/bank/${categorySlug(c.category)}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {c.category}
                </Link>
                <span className="tabular-nums text-muted-foreground">
                  {c.solved} / {c.total}
                  <span className="ml-2 text-xs">(cap {c.cap})</span>
                </span>
              </div>
              <div className="relative mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/30"
                  style={{ width: `${(c.attempted / Math.max(1, c.total)) * 100}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${(c.solved / Math.max(1, c.total)) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {c.attempted} attempted · mastery {c.mastery}%
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weakest topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.weakestTopics.map((t) => (
              <div key={t.key}>
                <div className="flex items-center justify-between text-sm">
                  <span>{t.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {t.mastery}% mastery · {t.coverage}% covered
                  </span>
                </div>
                <Meter
                  value={t.mastery}
                  className="mt-1 h-1.5"
                  barClassName={t.mastery < 30 ? "bg-hard" : t.mastery < 60 ? "bg-medium" : "bg-easy"}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question states</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {statusCounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing attempted yet. Start today&rsquo;s session to begin tracking.
              </p>
            ) : (
              statusCounts
                .sort((a, b) => b._count.status - a._count.status)
                .map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-sm">
                    <span>{STATUS_LABEL[s.status] ?? s.status}</span>
                    <span className="tabular-nums text-muted-foreground">{s._count.status}</span>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attempts logged yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recent.map((a) => (
                <div key={a.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">
                    {a.createdAt.toLocaleDateString()}
                  </span>
                  <Link
                    href={`/question/${a.questionId}`}
                    className="min-w-0 flex-1 truncate hover:text-primary hover:underline"
                  >
                    {a.question.title}
                  </Link>
                  <Badge>{a.question.topic.name}</Badge>
                  <span className="w-32 shrink-0 text-right text-xs text-muted-foreground">
                    {a.outcome.replace(/_/g, " ")}
                    {a.overrun && <span className="ml-1 text-hard">overrun</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
