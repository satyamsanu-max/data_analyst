import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUserPage } from "@/lib/auth";
import { Badge, Card, CardContent, CardHeader, CardTitle, Meter } from "@/components/ui";
import { SolutionReveal } from "@/components/solution-reveal";
import { VerificationBadge } from "@/components/answer-panel";
import { PracticePanel } from "@/components/practice-panel";
import { PRACTICE_DDL } from "@/lib/practice-db";
import {
  CATEGORY_CLASS,
  DIFFICULTY_CLASS,
  STATUS_LABEL,
  categorySlug,
  formatSeconds,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

function parseArr(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUserPage(`/question/${id}`);
  const q = await prisma.question.findUnique({
    where: { id },
    include: {
      topic: true,
      source: true,
      progress: { where: { userId: user.id } },
      companies: { include: { company: true } },
      attempts: { where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
  if (!q) notFound();

  const concepts = parseArr(q.concepts);
  const skills = parseArr(q.skillsTested);
  const progress = q.progress[0] ?? null;

  // What quantity a numeric question wants, e.g. "Probability of winning if you
  // switch". Without it, a prompt phrased as a decision gives no clue that the
  // grader expects a number.
  let ask: string | undefined;
  if (q.answerSpec) {
    try {
      ask = (JSON.parse(q.answerSpec) as { ask?: string }).ask;
    } catch {
      ask = undefined;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/bank/${categorySlug(q.category)}`}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {q.category} bank
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className={CATEGORY_CLASS[q.category]}>{q.category}</Badge>
          <Badge className={DIFFICULTY_CLASS[q.difficulty]}>{q.difficulty}</Badge>
          <Badge>{q.estimatedMinutes} min</Badge>
          <Badge>freq {q.frequencyScore}</Badge>
          <Badge>pattern value {q.patternValue}</Badge>
          {progress && progress.attemptCount > 0 && (
            <Badge className="border-primary/30 bg-primary/10 text-primary">
              {STATUS_LABEL[progress.status]}
            </Badge>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{q.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>Topic: {q.topic.name}</span>
          {q.pattern && <span>Pattern: {q.pattern}</span>}
          {q.industry && <span>Industry: {q.industry}</span>}
          {q.framework && <span>Framework: {q.framework}</span>}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {q.prompt && (
            <Card>
              <CardHeader>
                <CardTitle>Question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{q.prompt}</p>
                {q.category === "DSA" && q.sourceUrl && (
                  <p className="mt-4 rounded-md border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
                    This is our own one-line restatement. Solve the full problem on{" "}
                    <a
                      href={q.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary hover:underline"
                    >
                      {q.source?.name ?? "the source site"} ↗
                    </a>
                    , which hosts the official statement, constraints, and test cases.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {q.assumptions && (
            <Card>
              <CardHeader>
                <CardTitle>Assumptions to state</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{q.assumptions}</p>
              </CardContent>
            </Card>
          )}

          {q.verification !== "self" && (
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>
                  {q.verification === "sql" ? "Write your query" : "Your answer"}
                </CardTitle>
                <VerificationBadge verification={q.verification} />
              </CardHeader>
              <CardContent>
                <PracticePanel
                  questionId={q.id}
                  verification={q.verification}
                  schema={q.category === "SQL" ? PRACTICE_DDL.trim() : undefined}
                  ask={ask}
                />
              </CardContent>
            </Card>
          )}

          {q.hint && (
            <SolutionReveal label="Hint" body={q.hint} />
          )}

          {q.solution && <SolutionReveal label="Solution" body={q.solution} mono />}

          {q.explanation && (
            <SolutionReveal label="Why this matters in an interview" body={q.explanation} />
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mastery</span>
                  <span className="font-semibold tabular-nums">{progress?.masteryScore ?? 0}%</span>
                </div>
                <Meter value={progress?.masteryScore ?? 0} className="mt-1.5 h-1.5" />
              </div>
              <Row label="Status" value={STATUS_LABEL[progress?.status ?? "not_started"]} />
              <Row label="Attempts" value={progress?.attemptCount ?? 0} />
              <Row label="Failures" value={progress?.failedCount ?? 0} />
              <Row label="Hints used" value={progress?.hintUsedCount ?? 0} />
              <Row label="Time overruns" value={progress?.timesOverrun ?? 0} />
              <Row
                label="Last attempt"
                value={progress?.lastAttemptDate ? progress.lastAttemptDate.toLocaleDateString() : "—"}
              />
              <Row
                label="Next review"
                value={progress?.nextReviewDate ? progress.nextReviewDate.toLocaleDateString() : "—"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source &amp; attribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {q.source && (
                <div>
                  <span className="text-muted-foreground">Reference: </span>
                  {q.sourceUrl ? (
                    <a
                      href={q.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary hover:underline"
                    >
                      {q.source.name} ↗
                    </a>
                  ) : (
                    q.source.name
                  )}
                </div>
              )}
              {q.sourceNote && <p className="text-xs text-muted-foreground">{q.sourceNote}</p>}
              {q.source?.notes && <p className="text-xs text-muted-foreground">{q.source.notes}</p>}
            </CardContent>
          </Card>

          {q.companies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Company tags</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {q.companies.map((c) => (
                  <Link key={c.companyId} href={`/companies?company=${c.company.slug}`}>
                    <Badge className="hover:border-primary hover:text-primary">{c.company.name}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {(concepts.length > 0 || skills.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Concepts tested</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {[...new Set([...concepts, ...skills])].map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {q.attempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attempt history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-xs">
                {q.attempts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {a.createdAt.toLocaleDateString()}
                    </span>
                    <span>{a.outcome.replace("_", " ")}</span>
                    <span className="tabular-nums">
                      {formatSeconds(a.seconds)}
                      {a.overrun && <span className="ml-1 text-hard">!</span>}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
