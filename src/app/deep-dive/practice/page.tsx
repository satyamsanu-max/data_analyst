import Link from "next/link";
import { requireUserPage } from "@/lib/auth";
import { listContent, sectionFacets, sectionSummaries } from "@/lib/deep-dive-service";
import { Badge, Meter } from "@/components/ui";
import { ContentList, FilterChips } from "@/components/deep-dive/content-list";
import { ModeTabs, TopicRail } from "@/components/deep-dive/topic-rail";
import {
  SECTION_BY_SLUG,
  DOMAIN_LABEL,
  DOMAINS,
  SOURCE_TYPE_LABEL,
  type Domain,
  type SourceType,
} from "@/data/deep-dive/types";
import { DD_DOMAIN_CLASS, DD_STATUS_LABEL } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Practice — every topic's interview questions, with the same side-by-side
 * layout as Learn so switching topic never costs a page load of its own.
 */
export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const user = await requireUserPage("/deep-dive/practice");
  const sections = await sectionSummaries(user.id);

  // A sidebar entry scopes the page to one stream (Product Management,
  // Consulting or Data); without one we show everything, as before.
  const domain = DOMAINS.includes(sp.domain as Domain) ? (sp.domain as Domain) : undefined;

  const withQuestions = sections.filter(
    (s) => s.questionTotal > 0 && (!domain || s.domain === domain),
  );
  const topic =
    sp.topic && SECTION_BY_SLUG[sp.topic] && withQuestions.some((s) => s.slug === sp.topic)
      ? sp.topic
      : withQuestions[0].slug;

  const def = SECTION_BY_SLUG[topic];
  const current = sections.find((s) => s.slug === topic)!;

  const [rows, facets] = await Promise.all([
    listContent(user.id, topic, "questions", {
      category: sp.category,
      difficulty: sp.difficulty,
      sourceType: sp.sourceType,
      company: sp.company,
      status: sp.status,
    }),
    sectionFacets(topic),
  ]);

  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, topic, domain, ...patch })) if (v) p.set(k, v);
    return `/deep-dive/practice?${p.toString()}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="stat-label">{domain ? DOMAIN_LABEL[domain] : "Deep Dive"}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Practice</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Questions reported in interviews. Attempt one before you reveal it — the gap between what
          you said and what you read is the part worth studying.
        </p>
      </div>

      <ModeTabs mode="practice" topic={topic} domain={domain} />

      <div className="grid gap-5 lg:grid-cols-[15rem_1fr]">
        <TopicRail sections={sections} active={topic} mode="practice" domain={domain} />

        <div className="min-w-0 space-y-4">
          <div className="surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={DD_DOMAIN_CLASS[def.domain]}>{DOMAIN_LABEL[def.domain]}</Badge>
              <h2 className="text-lg font-semibold tracking-tight">{def.name}</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{def.blurb}</p>
            <div className="mt-3 flex items-center gap-3">
              <Meter
                value={(current.questionDone / Math.max(1, current.questionTotal)) * 100}
                className="h-1.5 max-w-xs flex-1"
              />
              <span className="text-xs tabular-nums text-muted-foreground">
                {current.questionDone} / {current.questionTotal} solved
              </span>
              {current.conceptTotal > 0 && (
                <Link
                  href={`/deep-dive/learn?topic=${topic}${domain ? `&domain=${domain}` : ""}`}
                  className="text-xs text-primary hover:underline"
                >
                  {current.conceptTotal} concepts →
                </Link>
              )}
            </div>
          </div>

          <div className="surface space-y-2 p-4">
            <FilterChips
              label="Topic"
              all={link({ category: undefined })}
              allActive={!sp.category}
              options={facets.categories.map((c) => ({
                label: c,
                href: link({ category: c }),
                active: sp.category === c,
              }))}
            />
            <FilterChips
              label="Level"
              all={link({ difficulty: undefined })}
              allActive={!sp.difficulty}
              options={facets.difficulties.map((d) => ({
                label: d,
                href: link({ difficulty: d }),
                active: sp.difficulty === d,
              }))}
            />
            {facets.sourceTypes.length > 1 && (
              <FilterChips
                label="Source"
                all={link({ sourceType: undefined })}
                allActive={!sp.sourceType}
                options={facets.sourceTypes.map((s) => ({
                  label: SOURCE_TYPE_LABEL[s as SourceType] ?? s,
                  href: link({ sourceType: s }),
                  active: sp.sourceType === s,
                }))}
              />
            )}
            {facets.companies.length > 0 && (
              <FilterChips
                label="Company"
                all={link({ company: undefined })}
                allActive={!sp.company}
                options={facets.companies.map((c) => ({
                  label: c,
                  href: link({ company: c }),
                  active: sp.company === c,
                }))}
              />
            )}
            <FilterChips
              label="Status"
              all={link({ status: undefined })}
              allActive={!sp.status}
              options={["NOT_STARTED", "ATTEMPTED", "SOLVED", "NEEDS_REVIEW"].map((s) => ({
                label: DD_STATUS_LABEL[s],
                href: link({ status: s }),
                active: sp.status === s,
              }))}
            />
          </div>

          <ContentList rows={rows} showSource />
        </div>
      </div>
    </div>
  );
}
