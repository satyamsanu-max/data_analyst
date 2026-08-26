import { patternCoverage } from "@/lib/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { requireUserPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

function barColor(v: number) {
  if (v >= 70) return "bg-easy";
  if (v >= 40) return "bg-medium";
  if (v >= 15) return "bg-primary";
  return "bg-hard";
}

function Bar({ label, value, right }: { label: string; value: number; right: string }) {
  const blocks = Math.round(value / 10);
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="w-40 shrink-0 truncate text-sm">{label}</span>
      <span className="hidden font-mono text-xs tracking-tight text-muted-foreground sm:inline">
        {"█".repeat(blocks)}
        {"░".repeat(10 - blocks)}
      </span>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary sm:hidden">
        <div className={cn("h-full rounded-full", barColor(value))} style={{ width: `${value}%` }} />
      </div>
      <span className="w-28 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{right}</span>
    </div>
  );
}

export default async function PatternsPage() {
  const user = await requireUserPage("/patterns");
  const { topics, patterns } = await patternCoverage(user.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="stat-label">Insight</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Pattern Coverage</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          The scheduler prioritises patterns you are weak at, not just problems that are popular. A
          topic sitting near zero here will keep surfacing until it moves.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>DSA topics — mastery</CardTitle>
        </CardHeader>
        <CardContent>
          {topics.map((t) => (
            <Bar
              key={t.key}
              label={t.label}
              value={t.mastery}
              right={`${t.mastery}% · ${t.attempted}/${t.total}`}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reusable patterns — weakest first</CardTitle>
        </CardHeader>
        <CardContent>
          {patterns.map((p) => (
            <Bar
              key={p.key}
              label={p.label}
              value={p.mastery}
              right={`${p.mastery}% · ${p.attempted}/${p.total}`}
            />
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Mastery counts unattempted questions as zero, so a low bar means either &ldquo;never
        touched&rdquo; or &ldquo;touched and struggled&rdquo;. The attempted/total figure separates the
        two.
      </p>
    </div>
  );
}
