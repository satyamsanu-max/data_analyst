import Link from "next/link";
import { prisma, getSettings } from "@/lib/db";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CATEGORY_CLASS, DIFFICULTY_CLASS, cn } from "@/lib/utils";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company: selected } = await searchParams;
  const user = await requireUser();
  const [companies, settings] = await Promise.all([
    prisma.company.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { questions: true } } },
    }),
    getSettings(user.id),
  ]);

  const targets: string[] = JSON.parse(settings.targetCompanies || "[]");

  const questions = selected
    ? await prisma.question.findMany({
        where: { companies: { some: { company: { slug: selected } } } },
        include: { topic: true },
        orderBy: [{ frequencyScore: "desc" }],
        take: 120,
      })
    : [];

  const buckets = ["tech", "product", "finance", "consulting", "other"] as const;

  return (
    <div className="space-y-6">
      <div>
        <div className="stat-label">Company mode</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Companies</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Selecting target companies in{" "}
          <Link href="/settings" className="text-primary hover:underline">
            Settings
          </Link>{" "}
          raises the priority of questions tagged for them. Tags are directional signals drawn from
          publicly shared interview experiences — they are not a guarantee that a company asks a
          specific question.
        </p>
      </div>

      {targets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your targets</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {targets.map((t) => {
              const c = companies.find((x) => x.slug === t);
              return (
                <Badge key={t} className="border-primary/30 bg-primary/10 text-primary">
                  {c?.name ?? t}
                </Badge>
              );
            })}
          </CardContent>
        </Card>
      )}

      {buckets.map((bucket) => {
        const list = companies.filter((c) => c.bucket === bucket);
        if (list.length === 0) return null;
        return (
          <Card key={bucket}>
            <CardHeader>
              <CardTitle className="capitalize">{bucket}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {list.map((c) => (
                <Link
                  key={c.slug}
                  href={selected === c.slug ? "/companies" : `/companies?company=${c.slug}`}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    selected === c.slug
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-accent",
                    targets.includes(c.slug) && selected !== c.slug && "border-primary/40",
                  )}
                >
                  {c.name}
                  <span className="ml-2 text-xs text-muted-foreground">{c._count.questions}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>
              Questions tagged {companies.find((c) => c.slug === selected)?.name} ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {questions.map((q) => (
              <Link
                key={q.id}
                href={`/question/${q.id}`}
                className="flex flex-wrap items-center gap-3 px-5 py-2.5 transition-colors hover:bg-accent"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{q.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {q.topic.name}
                    {q.pattern ? ` · ${q.pattern}` : ""} · freq {q.frequencyScore}
                  </div>
                </div>
                <Badge className={CATEGORY_CLASS[q.category]}>{q.category}</Badge>
                <Badge className={DIFFICULTY_CLASS[q.difficulty]}>{q.difficulty}</Badge>
                <Badge>{q.estimatedMinutes}m</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
