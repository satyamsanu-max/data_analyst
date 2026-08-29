import Link from "next/link";
import { requireUserPage } from "@/lib/auth";
import { domainSummaries } from "@/lib/deep-dive-service";
import { Badge, Card, CardContent, CardHeader, CardTitle, Meter } from "@/components/ui";
import { DOMAIN_BLURB, DOMAIN_LABEL } from "@/data/deep-dive/types";
import { DD_DOMAIN_CLASS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DeepDivePage() {
  const user = await requireUserPage("/deep-dive");
  const domains = await domainSummaries(user.id);

  const grand = domains.flatMap((d) => d.sections);
  const totalItems = grand.reduce((a, s) => a + s.total, 0);
  const totalDone = grand.reduce((a, s) => a + s.conceptDone + s.questionDone, 0);

  return (
    <div className="space-y-8">
      <div>
        <div className="stat-label">Library</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Deep Dive into Data &amp; Product
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Master the concepts. Then practice questions actually reported in interviews.
        </p>
        <div className="mt-4 flex max-w-md items-center gap-3">
          <Meter value={(totalDone / Math.max(1, totalItems)) * 100} className="flex-1" />
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {totalDone} / {totalItems}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-xs text-muted-foreground">
          Deep Dive is a separate library from your Daily Practice plan. Nothing you do here changes
          today&rsquo;s session, your streak, or your mastery scores.
        </p>
      </div>

      {domains.map(({ domain, sections }) => (
        <section key={domain} className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <Badge className={DD_DOMAIN_CLASS[domain]}>{DOMAIN_LABEL[domain].toUpperCase()}</Badge>
            <p className="text-xs text-muted-foreground">{DOMAIN_BLURB[domain]}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((s) => (
              <Card key={s.slug} className="flex flex-col">
                <CardHeader>
                  <CardTitle>
                    <Link href={`/deep-dive/${s.slug}`} className="hover:text-primary">
                      {s.name}
                    </Link>
                  </CardTitle>
                  <p className="text-xs leading-relaxed text-muted-foreground">{s.blurb}</p>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <Line
                    label="Concepts"
                    done={s.conceptDone}
                    total={s.conceptTotal}
                    href={`/deep-dive/${s.slug}/concepts`}
                  />
                  <Line
                    label={s.slug === "industry-primers" ? "Primers" : "Interview questions"}
                    done={s.questionDone}
                    total={s.questionTotal}
                    href={`/deep-dive/${s.slug}/questions`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Line({
  label,
  done,
  total,
  href,
}: {
  label: string;
  done: number;
  total: number;
  href: string;
}) {
  if (total === 0) {
    return (
      <div className="flex items-center justify-between text-xs text-muted-foreground/60">
        <span>{label}</span>
        <span>—</span>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <Link href={href} className="font-medium hover:text-primary hover:underline">
          {label}
        </Link>
        <span className="tabular-nums text-muted-foreground">
          {done} / {total}
        </span>
      </div>
      <Meter value={(done / Math.max(1, total)) * 100} className="mt-1 h-1.5" />
    </div>
  );
}
