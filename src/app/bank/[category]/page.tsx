import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Badge, Card, CardContent, CardHeader, CardTitle, Meter } from "@/components/ui";
import { CATEGORY_CLASS, CATEGORY_FROM_SLUG, DIFFICULTY_CLASS, STATUS_LABEL, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Every status that counts as "you have solved this". */
const SOLVED_STATUSES = new Set(["solved", "solved_quickly", "solved_with_hint", "mastered"]);

/**
 * The "Solved" chip must mean the same thing as the solved COUNT above it.
 * Matching the literal string alone made the header say "1 solved" while the
 * filter returned nothing, because the row was actually "solved_quickly".
 */
function matchesStatus(status: string, filter: string): boolean {
  if (filter === "solved") return SOLVED_STATUSES.has(status) && status !== "mastered";
  return status === filter;
}

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ topic?: string; difficulty?: string; status?: string; q?: string }>;
};

export default async function BankPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const filters = await searchParams;
  const category = CATEGORY_FROM_SLUG[slug];
  if (!category) notFound();
  const user = await requireUser();

  const where = {
    category,
    ...(filters.topic ? { topic: { slug: filters.topic } } : {}),
    ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
    ...(filters.q ? { title: { contains: filters.q } } : {}),
  };

  const [questions, topics, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: {
        topic: true,
        source: true,
        progress: { where: { userId: user.id } },
        companies: { include: { company: true } },
      },
      orderBy: [{ frequencyScore: "desc" }, { title: "asc" }],
      take: 400,
    }),
    prisma.topic.findMany({ where: { category }, orderBy: { weight: "desc" } }),
    prisma.question.count({ where: { category } }),
  ]);

  const filtered = filters.status
    ? questions.filter((q) => matchesStatus(q.progress[0]?.status ?? "not_started", filters.status!))
    : questions;

  const solved = questions.filter((q) => SOLVED_STATUSES.has(q.progress[0]?.status ?? "")).length;

  const linkFor = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { ...filters, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const qs = p.toString();
    return `/bank/${slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="stat-label">Question bank</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{category}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} curated questions · {solved} solved
        </p>
        <Meter value={(solved / Math.max(1, total)) * 100} className="mt-3 max-w-md" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip href={linkFor({ topic: undefined })} active={!filters.topic}>
              All topics
            </FilterChip>
            {topics.map((t) => (
              <FilterChip key={t.slug} href={linkFor({ topic: t.slug })} active={filters.topic === t.slug}>
                {t.name}
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip href={linkFor({ difficulty: undefined })} active={!filters.difficulty}>
              Any difficulty
            </FilterChip>
            {["Easy", "Medium", "Hard"].map((d) => (
              <FilterChip key={d} href={linkFor({ difficulty: d })} active={filters.difficulty === d}>
                {d}
              </FilterChip>
            ))}
            <span className="mx-2 w-px bg-border" />
            <FilterChip href={linkFor({ status: undefined })} active={!filters.status}>
              Any status
            </FilterChip>
            {["not_started", "needs_review", "solved", "mastered"].map((s) => (
              <FilterChip key={s} href={linkFor({ status: s })} active={filters.status === s}>
                {STATUS_LABEL[s]}
              </FilterChip>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="surface divide-y divide-border">
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Nothing matches those filters.
          </p>
        )}
        {filtered.map((q) => {
          const status = q.progress[0]?.status ?? "not_started";
          const mastery = q.progress[0]?.masteryScore ?? 0;
          return (
            <Link
              key={q.id}
              href={`/question/${q.id}`}
              className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium">{q.title}</span>
                  {status !== "not_started" && (
                    <Badge
                      className={cn(
                        status === "mastered" && "border-easy/30 bg-easy/10 text-easy",
                        status === "needs_review" && "border-hard/30 bg-hard/10 text-hard",
                      )}
                    >
                      {STATUS_LABEL[status]}
                    </Badge>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                  <span>{q.topic.name}</span>
                  {q.pattern && <span>· {q.pattern}</span>}
                  <span>· freq {q.frequencyScore}</span>
                  {(q.progress[0]?.attemptCount ?? 0) > 0 && <span>· mastery {mastery}%</span>}
                </div>
              </div>
              <Badge className={DIFFICULTY_CLASS[q.difficulty]}>{q.difficulty}</Badge>
              <Badge className={CATEGORY_CLASS[q.category]}>{q.estimatedMinutes} min</Badge>
            </Link>
          );
        })}
      </div>
      {questions.length >= 400 && (
        <p className="text-xs text-muted-foreground">Showing the first 400 matches. Narrow the filters to see more.</p>
      )}
    </div>
  );
}

function FilterChip({
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
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
