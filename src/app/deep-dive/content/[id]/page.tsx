import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUserPage } from "@/lib/auth";
import { getContent } from "@/lib/deep-dive-service";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Prose, CodeBlock } from "@/components/deep-dive/prose";
import { ProgressiveReveal } from "@/components/deep-dive/progressive-reveal";
import { ProgressButtons } from "@/components/deep-dive/progress-buttons";
import {
  SOURCE_TYPE_HELP,
  SOURCE_TYPE_LABEL,
  DOMAIN_LABEL,
  type SourceType,
} from "@/data/deep-dive/types";
import { DD_DOMAIN_CLASS, DD_SOURCE_CLASS, DD_TYPE_LABEL, DIFFICULTY_CLASS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUserPage(`/deep-dive/content/${id}`);
  const item = await getContent(user.id, id);
  if (!item) notFound();

  const isConcept = item.contentType === "CONCEPT" || item.contentType === "INDUSTRY_PRIMER";
  const listKind = isConcept ? "concepts" : "questions";

  // If no source supplied an official answer, ours has to be labelled as ours.
  const answerIsOurs = !item.sources.some((s) => s.sourceType === "CASEBOOK");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/deep-dive/${item.section}/${listKind}`}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {item.sectionDef?.name ?? item.section}
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className={DD_DOMAIN_CLASS[item.domain]}>{DOMAIN_LABEL[item.domain as "DATA"]}</Badge>
          <Badge>{item.category}</Badge>
          <Badge className={DIFFICULTY_CLASS[item.difficulty]}>{item.difficulty}</Badge>
          {!isConcept && (
            <Badge className={DD_SOURCE_CLASS[item.sourceType]}>
              {SOURCE_TYPE_LABEL[item.sourceType as SourceType] ?? item.sourceType}
            </Badge>
          )}
          {item.contentType !== "QUESTION" && item.contentType !== "CONCEPT" && (
            <Badge>{DD_TYPE_LABEL[item.contentType]}</Badge>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h1>

        {(item.company || item.role || item.year || item.framework) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {item.company && <span>Company: {item.company}</span>}
            {item.role && <span>Role: {item.role}</span>}
            {item.year && <span>Year: {item.year}</span>}
            {item.framework && <span>Framework: {item.framework}</span>}
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {item.question && (
            <Card>
              <CardHeader>
                <CardTitle>{item.contentType === "CASE" ? "Case prompt" : "Question"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{item.question}</p>
              </CardContent>
            </Card>
          )}

          {isConcept ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{item.contentType === "INDUSTRY_PRIMER" ? "Primer" : "Concept"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Prose>{item.explanation}</Prose>
                </CardContent>
              </Card>

              {item.example && (
                <Card>
                  <CardHeader>
                    <CardTitle>Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Prose>{item.example}</Prose>
                  </CardContent>
                </Card>
              )}

              {item.code.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Formulas &amp; calculations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.code.map((c, i) => (
                      <CodeBlock key={i} lang={c.lang} label={c.label} code={c.code} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <ProgressiveReveal
              contentId={item.id}
              hint={item.hint}
              interviewAnswer={item.interviewAnswer}
              detailedExplanation={item.detailedExplanation}
              code={item.code}
              alreadyRevealed={item.progress?.revealed ?? false}
              answerIsOurs={answerIsOurs}
            />
          )}

          {item.commonMistakes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>⚠ Common mistakes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="ml-4 list-disc space-y-1.5 text-sm text-muted-foreground marker:text-border">
                  {item.commonMistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {item.followUps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Likely follow-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="ml-4 list-disc space-y-1.5 text-sm text-muted-foreground marker:text-border">
                  {item.followUps.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressButtons
                contentId={item.id}
                status={(item.progress?.status ?? "NOT_STARTED") as "NOT_STARTED"}
                bookmarked={item.progress?.bookmarked ?? false}
              />
              <p className="mt-3 text-xs text-muted-foreground">
                Deep Dive progress is tracked separately from Daily Practice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📚 Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!isConcept && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {SOURCE_TYPE_HELP[item.sourceType as SourceType]}
                </p>
              )}
              {item.sources.map((s) => (
                <div key={s.id} className="border-t border-border pt-2 first:border-0 first:pt-0">
                  <div className="text-xs font-medium">
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-primary hover:underline"
                      >
                        {s.name} ↗
                      </a>
                    ) : (
                      s.name
                    )}
                  </div>
                  {s.title && <div className="text-xs text-muted-foreground">{s.title}</div>}
                  {s.page !== null && s.page !== undefined && (
                    <div className="text-xs text-muted-foreground">Page {s.page}</div>
                  )}
                  {s.evidence && (
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {s.evidence}
                    </p>
                  )}
                </div>
              ))}
              {!item.company && !isConcept && (
                <p className="border-t border-border pt-2 text-[11px] text-muted-foreground">
                  No company is attributed, because no source names one. We do not guess.
                </p>
              )}
            </CardContent>
          </Card>

          {item.existingQuestionId && (
            <Card>
              <CardHeader>
                <CardTitle>Also in your question bank</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <Link
                  href={`/question/${item.existingQuestionId}`}
                  className="text-primary hover:underline"
                >
                  Open the practice version →
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  Same material, tracked under Daily Practice progress.
                </p>
              </CardContent>
            </Card>
          )}

          {item.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>🔗 Concepts tested</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <Link key={t} href={`/deep-dive/search?q=${encodeURIComponent(t)}`}>
                    <Badge className="hover:border-primary hover:text-primary">{t}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {item.related.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {item.related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/deep-dive/content/${r.id}`}
                    className="flex items-start justify-between gap-2 text-xs hover:text-primary"
                  >
                    <span className="min-w-0 flex-1">{r.title}</span>
                    <Badge className="shrink-0">{DD_TYPE_LABEL[r.contentType]}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
