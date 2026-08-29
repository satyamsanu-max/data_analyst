import Link from "next/link";
import { requireUserPage } from "@/lib/auth";
import { listContent, sectionFacets, sectionSummaries } from "@/lib/deep-dive-service";
import { Badge, Meter } from "@/components/ui";
import { ContentList, FilterChips } from "@/components/deep-dive/content-list";
import { ModeTabs, TopicRail } from "@/components/deep-dive/topic-rail";
import { SECTION_BY_SLUG, DOMAIN_LABEL } from "@/data/deep-dive/types";
import { DD_DOMAIN_CLASS } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Learn — every topic's concepts, with the topic switcher beside the content
 * rather than on a page of its own. Two clicks from the sidebar to reading
 * something, instead of four.
 */
export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; category?: string; difficulty?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUserPage("/deep-dive/learn");
  const sections = await sectionSummaries(user.id);

  const withConcepts = sections.filter((s) => s.conceptTotal > 0);
  const topic =
    sp.topic && SECTION_BY_SLUG[sp.topic] && withConcepts.some((s) => s.slug === sp.topic)
      ? sp.topic
      : withConcepts[0].slug;

  const def = SECTION_BY_SLUG[topic];
  const current = sections.find((s) => s.slug === topic)!;

  const [rows, facets] = await Promise.all([
    listContent(user.id, topic, "concepts", {
      category: sp.category,
      difficulty: sp.difficulty,
    }),
    sectionFacets(topic),
  ]);

  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, topic, ...patch })) if (v) p.set(k, v);
    return `/deep-dive/learn?${p.toString()}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="stat-label">Deep Dive</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Learn</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Understand the idea first — what it is, how it works, when to use it, and the mistake
          people make. Then switch to Practice for the questions built on it.
        </p>
      </div>

      <ModeTabs mode="learn" topic={topic} />

      <div className="grid gap-5 lg:grid-cols-[15rem_1fr]">
        <TopicRail sections={sections} active={topic} mode="learn" />

        <div className="min-w-0 space-y-4">
          <div className="surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={DD_DOMAIN_CLASS[def.domain]}>{DOMAIN_LABEL[def.domain]}</Badge>
              <h2 className="text-lg font-semibold tracking-tight">{def.name}</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{def.blurb}</p>
            <div className="mt-3 flex items-center gap-3">
              <Meter
                value={(current.conceptDone / Math.max(1, current.conceptTotal)) * 100}
                className="h-1.5 max-w-xs flex-1"
              />
              <span className="text-xs tabular-nums text-muted-foreground">
                {current.conceptDone} / {current.conceptTotal} read
              </span>
              {current.questionTotal > 0 && (
                <Link
                  href={`/deep-dive/practice?topic=${topic}`}
                  className="text-xs text-primary hover:underline"
                >
                  {current.questionTotal} questions →
                </Link>
              )}
            </div>
          </div>

          {(facets.categories.length > 1 || facets.difficulties.length > 1) && (
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
            </div>
          )}

          <ContentList rows={rows} showSource={false} />
        </div>
      </div>
    </div>
  );
}
