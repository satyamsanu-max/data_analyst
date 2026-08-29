import Link from "next/link";
import { requireUserPage } from "@/lib/auth";
import { deepDiveOverview } from "@/lib/deep-dive-service";
import { Badge, Meter } from "@/components/ui";
import { DOMAIN_BLURB, DOMAIN_LABEL, type Domain } from "@/data/deep-dive/types";
import { DD_DOMAIN_CLASS } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * The Deep Dive hub.
 *
 * Two doors — Learn and Practice — and nothing else above them. Everything a
 * topic used to need its own page for now lives inside those two, so reaching
 * any single item is two clicks from here.
 */
export default async function DeepDivePage() {
  const user = await requireUserPage("/deep-dive");
  const overview = await deepDiveOverview(user.id);
  const pct = (overview.done / Math.max(1, overview.total)) * 100;

  const concepts = overview.byDomain.reduce((a, d) => a + d.conceptTotal, 0);
  const questions = overview.byDomain.reduce((a, d) => a + d.questionTotal, 0);

  return (
    <div className="space-y-7">
      <div>
        <div className="stat-label">Library</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Deep Dive into Data &amp; Product
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Master the concepts. Then practice questions actually reported in interviews.
        </p>
        <div className="mt-4 flex max-w-md items-center gap-3">
          <Meter value={pct} className="flex-1" />
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {overview.done} / {overview.total}
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------- the two doors */}
      <div className="grid gap-4 md:grid-cols-2">
        <Door
          href="/deep-dive/learn"
          eyebrow="Part 1"
          title="Learn"
          body="Excel, Power BI, Tableau, Root Cause Analysis, Product and Consulting — the concept behind each, with worked examples and the mistakes people make."
          count={`${concepts} concepts`}
          done={overview.byDomain.reduce((a, d) => a + d.conceptDone, 0)}
          total={concepts}
        />
        <Door
          href="/deep-dive/practice"
          eyebrow="Part 2"
          title="Practice"
          body="Interview questions and cases across the same topics. Attempt, take a hint, then compare against a full answer with the sources it came from."
          count={`${questions} questions & cases`}
          done={overview.byDomain.reduce((a, d) => a + d.questionDone, 0)}
          total={questions}
        />
      </div>

      {/* ------------------------------------------------------ what is inside */}
      <div className="grid gap-3 md:grid-cols-3">
        {overview.byDomain.map((d) => (
          <div key={d.domain} className="surface p-4">
            <div className="flex items-center justify-between gap-2">
              <Badge className={DD_DOMAIN_CLASS[d.domain as Domain]}>
                {DOMAIN_LABEL[d.domain as Domain]}
              </Badge>
              <span className="text-xs tabular-nums text-muted-foreground">
                {d.done} / {d.total}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {DOMAIN_BLURB[d.domain as Domain]}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.sections.map((s) => (
                <Link
                  key={s.slug}
                  href={
                    s.conceptTotal > 0
                      ? `/deep-dive/learn?topic=${s.slug}`
                      : `/deep-dive/practice?topic=${s.slug}`
                  }
                >
                  <Badge className="hover:border-primary hover:text-primary">{s.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <Link href="/deep-dive/progress" className="text-primary hover:underline">
          Deep Dive progress →
        </Link>
        <Link href="/deep-dive/search" className="text-primary hover:underline">
          Search the library →
        </Link>
        <span>
          Separate from your Daily Practice plan — nothing here changes today&rsquo;s session, your
          streak, or your mastery scores.
        </span>
      </div>
    </div>
  );
}

function Door({
  href,
  eyebrow,
  title,
  body,
  count,
  done,
  total,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  count: string;
  done: number;
  total: number;
}) {
  return (
    <Link
      href={href}
      className="surface group flex flex-col p-6 transition-colors hover:border-primary/40"
    >
      <div className="stat-label">{eyebrow}</div>
      <h2 className="mt-1 text-xl font-semibold tracking-tight group-hover:text-primary">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-4 flex items-center gap-3">
        <Meter value={(done / Math.max(1, total)) * 100} className="h-1.5 flex-1" />
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{count}</span>
      </div>
    </Link>
  );
}
