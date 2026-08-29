import { prisma } from "./db";
import { SECTION_BY_SLUG, SECTIONS, type Domain } from "@/data/deep-dive/types";

/**
 * Deep Dive queries.
 *
 * Every function takes `userId` first and scopes progress to that user, exactly
 * as `plan-service.ts` does. Nothing here reads or writes `Question`,
 * `UserProgress`, `DailyPlan`, `DailyTask` or `Attempt` — the Daily Practice
 * tables are untouched by this module by construction.
 *
 * Like `plan-service.ts`, and unlike `auth.ts`, this module deliberately omits
 * the `server-only` marker. It touches no cookies and no Next-specific API, so
 * the marker would buy nothing while preventing the smoke script from
 * exercising these queries outside a request. Callers are all server
 * components and server actions.
 */

export type ProgressStatus = "NOT_STARTED" | "ATTEMPTED" | "SOLVED" | "NEEDS_REVIEW";

/** Statuses that count as "done" in a progress bar. */
const DONE: ProgressStatus[] = ["SOLVED"];

function parseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function parseCode(s: string | null | undefined): { lang: string; label?: string; code: string }[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Counts per section, for the landing page and the progress rail. */
export async function sectionSummaries(userId: string) {
  const [totals, solved] = await Promise.all([
    prisma.deepDiveContent.groupBy({
      by: ["section", "contentType"],
      _count: { _all: true },
    }),
    prisma.deepDiveProgress.findMany({
      where: { userId, status: { in: DONE } },
      select: { content: { select: { section: true, contentType: true } } },
    }),
  ]);

  const solvedCount = new Map<string, number>();
  for (const row of solved) {
    const key = `${row.content.section}|${row.content.contentType}`;
    solvedCount.set(key, (solvedCount.get(key) ?? 0) + 1);
  }

  return SECTIONS.map((s) => {
    const rows = totals.filter((t) => t.section === s.slug);
    const conceptTotal = rows
      .filter((r) => r.contentType === "CONCEPT" || r.contentType === "INDUSTRY_PRIMER")
      .reduce((a, r) => a + r._count._all, 0);
    const questionTotal = rows
      .filter((r) => r.contentType !== "CONCEPT" && r.contentType !== "INDUSTRY_PRIMER")
      .reduce((a, r) => a + r._count._all, 0);

    const conceptDone =
      (solvedCount.get(`${s.slug}|CONCEPT`) ?? 0) +
      (solvedCount.get(`${s.slug}|INDUSTRY_PRIMER`) ?? 0);
    const questionDone =
      (solvedCount.get(`${s.slug}|QUESTION`) ?? 0) +
      (solvedCount.get(`${s.slug}|CASE`) ?? 0) +
      (solvedCount.get(`${s.slug}|GUESSTIMATE`) ?? 0);

    return {
      ...s,
      conceptTotal,
      questionTotal,
      conceptDone,
      questionDone,
      total: conceptTotal + questionTotal,
    };
  });
}

export async function domainSummaries(userId: string) {
  const sections = await sectionSummaries(userId);
  const domains: Domain[] = ["DATA", "PRODUCT", "CONSULTING"];
  return domains.map((d) => ({
    domain: d,
    sections: sections.filter((s) => s.domain === d),
  }));
}

export type ListFilters = {
  category?: string;
  difficulty?: string;
  sourceType?: string;
  company?: string;
  status?: string;
  q?: string;
};

/** The list behind a Concepts or Questions page. */
export async function listContent(
  userId: string,
  section: string,
  kind: "concepts" | "questions",
  filters: ListFilters = {},
) {
  const types =
    kind === "concepts" ? ["CONCEPT", "INDUSTRY_PRIMER"] : ["QUESTION", "CASE", "GUESSTIMATE"];

  const rows = await prisma.deepDiveContent.findMany({
    where: {
      section,
      contentType: { in: types },
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
      ...(filters.sourceType ? { sourceType: filters.sourceType } : {}),
      ...(filters.company ? { company: filters.company } : {}),
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q } },
              { question: { contains: filters.q } },
              { tags: { contains: filters.q } },
            ],
          }
        : {}),
    },
    include: {
      progress: { where: { userId } },
      sources: true,
    },
    orderBy: [{ category: "asc" }, { difficulty: "asc" }, { title: "asc" }],
  });

  const shaped = rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    difficulty: r.difficulty,
    contentType: r.contentType,
    sourceType: r.sourceType,
    company: r.company,
    role: r.role,
    question: r.question,
    tags: parseArr(r.tags),
    sourceCount: r.sources.length,
    status: (r.progress[0]?.status ?? "NOT_STARTED") as ProgressStatus,
    bookmarked: r.progress[0]?.bookmarked ?? false,
  }));

  return filters.status ? shaped.filter((s) => s.status === filters.status) : shaped;
}

/** Distinct filter values actually present in a section, so no chip is a dead end. */
export async function sectionFacets(section: string) {
  const rows = await prisma.deepDiveContent.findMany({
    where: { section },
    select: { category: true, difficulty: true, sourceType: true, company: true },
  });
  const uniq = (xs: (string | null)[]) =>
    [...new Set(xs.filter((x): x is string => Boolean(x)))].sort();
  return {
    categories: uniq(rows.map((r) => r.category)),
    difficulties: ["Easy", "Medium", "Hard"].filter((d) => rows.some((r) => r.difficulty === d)),
    sourceTypes: uniq(rows.map((r) => r.sourceType)),
    companies: uniq(rows.map((r) => r.company)),
  };
}

/** One content page, with its sources, progress and resolved related items. */
export async function getContent(userId: string, id: string) {
  const row = await prisma.deepDiveContent.findUnique({
    where: { id },
    include: { sources: true, progress: { where: { userId } } },
  });
  if (!row) return null;

  const relatedIds = parseArr(row.relatedIds);
  const related = relatedIds.length
    ? await prisma.deepDiveContent.findMany({
        where: { id: { in: relatedIds } },
        select: { id: true, title: true, contentType: true, section: true, difficulty: true },
      })
    : [];

  // Everything that points back at this item, so a concept lists its questions
  // even when only the question declared the link.
  const inbound = await prisma.deepDiveContent.findMany({
    where: { relatedIds: { contains: `"${id}"` }, id: { not: id } },
    select: { id: true, title: true, contentType: true, section: true, difficulty: true },
    take: 40,
  });

  const seen = new Set(related.map((r) => r.id));
  for (const r of inbound) if (!seen.has(r.id)) related.push(r);

  return {
    ...row,
    tags: parseArr(row.tags),
    commonMistakes: parseArr(row.commonMistakes),
    followUps: parseArr(row.followUps),
    code: parseCode(row.codeBlocks),
    related,
    progress: row.progress[0] ?? null,
    section: row.section,
    sectionDef: SECTION_BY_SLUG[row.section],
  };
}

/** Global Deep Dive search across every section. */
export async function searchDeepDive(userId: string, term: string) {
  if (!term.trim()) return [];
  const rows = await prisma.deepDiveContent.findMany({
    where: {
      OR: [
        { title: { contains: term } },
        { question: { contains: term } },
        { tags: { contains: term } },
        { category: { contains: term } },
      ],
    },
    include: { progress: { where: { userId } } },
    take: 80,
    orderBy: [{ contentType: "asc" }, { title: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    section: r.section,
    sectionName: SECTION_BY_SLUG[r.section]?.name ?? r.section,
    domain: r.domain,
    contentType: r.contentType,
    category: r.category,
    difficulty: r.difficulty,
    sourceType: r.sourceType,
    company: r.company,
    status: (r.progress[0]?.status ?? "NOT_STARTED") as ProgressStatus,
  }));
}

/** Everything the user has bookmarked, across sections. */
export async function bookmarks(userId: string) {
  const rows = await prisma.deepDiveProgress.findMany({
    where: { userId, bookmarked: true },
    include: { content: true },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
  return rows.map((r) => ({
    id: r.contentId,
    title: r.content.title,
    section: r.content.section,
    sectionName: SECTION_BY_SLUG[r.content.section]?.name ?? r.content.section,
    contentType: r.content.contentType,
    difficulty: r.content.difficulty,
    status: r.status as ProgressStatus,
  }));
}

/**
 * Weak categories within a section (spec section 48).
 *
 * "Weak" here means low completion of what has been started, which is the only
 * honest signal available: Deep Dive questions are self-assessed, so there is
 * no graded score to average. Reported as a percentage of attempted-or-solved
 * items that reached SOLVED.
 */
export async function weakCategories(userId: string, section?: string) {
  const rows = await prisma.deepDiveProgress.findMany({
    where: {
      userId,
      status: { in: ["ATTEMPTED", "SOLVED", "NEEDS_REVIEW"] },
      ...(section ? { content: { section } } : {}),
    },
    select: { status: true, content: { select: { category: true, section: true } } },
  });

  const agg = new Map<string, { section: string; category: string; solved: number; total: number }>();
  for (const r of rows) {
    const key = `${r.content.section}|${r.content.category}`;
    const cur = agg.get(key) ?? {
      section: r.content.section,
      category: r.content.category,
      solved: 0,
      total: 0,
    };
    cur.total++;
    if (r.status === "SOLVED") cur.solved++;
    agg.set(key, cur);
  }

  return [...agg.values()]
    .filter((a) => a.total >= 2)
    .map((a) => ({ ...a, pct: Math.round((a.solved / a.total) * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 8);
}
