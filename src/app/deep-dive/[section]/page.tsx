import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUserPage } from "@/lib/auth";
import { sectionSummaries, weakCategories } from "@/lib/deep-dive-service";
import { Badge, Card, CardContent, CardHeader, CardTitle, Meter } from "@/components/ui";
import { SECTION_BY_SLUG, DOMAIN_LABEL } from "@/data/deep-dive/types";
import { DD_DOMAIN_CLASS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const def = SECTION_BY_SLUG[section];
  if (!def) notFound();

  const user = await requireUserPage(`/deep-dive/${section}`);
  const [summaries, weak] = await Promise.all([
    sectionSummaries(user.id),
    weakCategories(user.id, section),
  ]);
  const s = summaries.find((x) => x.slug === section)!;

  const isPrimer = section === "industry-primers";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/deep-dive" className="text-xs text-muted-foreground hover:text-foreground">
          ← Deep Dive
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className={DD_DOMAIN_CLASS[def.domain]}>{DOMAIN_LABEL[def.domain]}</Badge>
          <Badge>{s.total} items</Badge>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{def.name}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{def.blurb}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PartCard
          part="Part 1"
          title="Concepts"
          body="Learn the idea first: what it is, how it works, when to use it, and the mistake people make."
          done={s.conceptDone}
          total={s.conceptTotal}
          href={`/deep-dive/${section}/concepts`}
        />
        <PartCard
          part="Part 2"
          title={isPrimer ? "Reference" : "Real interview questions"}
          body={
            isPrimer
              ? "Industry knowledge you can be asked to bring into a case."
              : "Practise the question, take a hint if you need one, then compare against a full answer."
          }
          done={s.questionDone}
          total={s.questionTotal}
          href={`/deep-dive/${section}/questions`}
        />
      </div>

      {weak.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Where you are weakest here</CardTitle>
            <p className="text-xs text-muted-foreground">
              Share of what you have started in each category that you have marked solved. Only
              categories with at least two attempted items are shown.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {weak.map((w) => (
              <div key={w.category}>
                <div className="flex items-center justify-between text-sm">
                  <Link
                    href={`/deep-dive/${section}/questions?category=${encodeURIComponent(w.category)}`}
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
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PartCard({
  part,
  title,
  body,
  done,
  total,
  href,
}: {
  part: string;
  title: string;
  body: string;
  done: number;
  total: number;
  href: string;
}) {
  return (
    <Link href={href} className="surface block p-5 transition-colors hover:border-primary/40">
      <div className="stat-label">{part}</div>
      <h2 className="mt-1 text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-4 flex items-center gap-3">
        <Meter value={(done / Math.max(1, total)) * 100} className="h-1.5 flex-1" />
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {done} / {total}
        </span>
      </div>
    </Link>
  );
}
