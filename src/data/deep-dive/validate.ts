import {
  ATTRIBUTABLE,
  CONTENT_TYPES,
  CITATION_KINDS,
  DOMAINS,
  SECTION_BY_SLUG,
  SOURCE_TYPES,
  type DeepDiveItem,
} from "./types";

/**
 * Content integrity checks (spec section 52).
 *
 * These run in the seeder AND in the test suite, so a bad record cannot reach
 * the database and cannot be committed. The rules that matter most are the
 * honesty ones: no company attribution without a source that names it, and no
 * question presented as a real interview unless a source says it was.
 */
export function validateDeepDive(items: DeepDiveItem[]): {
  ok: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const seenIds = new Set<string>();
  const seenQuestions = new Map<string, string>();

  for (const it of items) {
    const at = `${it.id}`;

    if (seenIds.has(it.id)) errors.push(`${at}: duplicate id`);
    seenIds.add(it.id);

    if (!DOMAINS.includes(it.domain)) errors.push(`${at}: unknown domain "${it.domain}"`);
    if (!CONTENT_TYPES.includes(it.contentType))
      errors.push(`${at}: unknown contentType "${it.contentType}"`);
    if (!SOURCE_TYPES.includes(it.sourceType))
      errors.push(`${at}: unknown sourceType "${it.sourceType}"`);

    const section = SECTION_BY_SLUG[it.section];
    if (!section) errors.push(`${at}: unknown section "${it.section}"`);
    else if (section.domain !== it.domain)
      errors.push(`${at}: section "${it.section}" belongs to ${section.domain}, not ${it.domain}`);

    if (!it.title?.trim()) errors.push(`${at}: missing title`);
    if (!it.category?.trim()) errors.push(`${at}: missing category`);
    if (it.difficulty && !["Easy", "Medium", "Hard"].includes(it.difficulty))
      errors.push(`${at}: invalid difficulty "${it.difficulty}"`);

    // Every answerable item needs the full teaching triple (spec section 34).
    if (it.contentType !== "CONCEPT" && it.contentType !== "INDUSTRY_PRIMER") {
      if (!it.question?.trim()) errors.push(`${at}: missing question`);
      if (!it.hint?.trim()) errors.push(`${at}: missing hint`);
      if (!it.interviewAnswer?.trim()) errors.push(`${at}: missing interviewAnswer`);
      if (!it.detailedExplanation?.trim()) errors.push(`${at}: missing detailedExplanation`);

      const key = normalise(it.question ?? it.title);
      const prior = seenQuestions.get(key);
      if (prior) errors.push(`${at}: duplicates ${prior} — merge into one record with both sources`);
      else seenQuestions.set(key, it.id);
    } else if (!it.explanation?.trim()) {
      errors.push(`${at}: concept has no explanation`);
    }

    // Sourcing.
    if (!it.sources?.length) errors.push(`${at}: no sources`);
    for (const s of it.sources ?? []) {
      if (!CITATION_KINDS.includes(s.kind)) errors.push(`${at}: unknown citation kind "${s.kind}"`);
      if (!s.name?.trim()) errors.push(`${at}: citation with no name`);
      if (s.url && !/^https?:\/\//.test(s.url)) errors.push(`${at}: malformed url "${s.url}"`);
      if (s.kind === "CASEBOOK" && s.page === undefined)
        warnings.push(`${at}: casebook citation without a page reference`);
    }

    // The honesty rules.
    if (it.company && !ATTRIBUTABLE.includes(it.sourceType))
      errors.push(
        `${at}: company "${it.company}" attributed on a ${it.sourceType} record — only a sourced interview may name a company`,
      );
    if (it.role && !ATTRIBUTABLE.includes(it.sourceType))
      errors.push(`${at}: role attributed on a ${it.sourceType} record`);
    if (it.sourceType === "REAL_INTERVIEW") {
      const backed = it.sources?.some((s) =>
        ["GLASSDOOR", "INTERVIEW_REPORT", "GITHUB", "PUBLIC_ASSESSMENT"].includes(s.kind),
      );
      if (!backed)
        errors.push(`${at}: labelled REAL_INTERVIEW with no interview-report source to back it`);
    }
    if (it.sourceType === "CASEBOOK_INTERVIEW_CASE" && !it.sources?.some((s) => s.kind === "CASEBOOK"))
      errors.push(`${at}: labelled a casebook case but cites no casebook`);
    if (it.sourceType === "ADAPTED_PRACTICE" && it.sources?.some((s) => s.kind === "GLASSDOOR"))
      warnings.push(`${at}: adapted practice citing an interview report — should this be higher?`);
  }

  // Related ids must resolve, or the concept/question links render as dead ends.
  for (const it of items) {
    for (const r of it.related ?? []) {
      if (!seenIds.has(r)) errors.push(`${it.id}: related id "${r}" does not exist`);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Counts for the content report (spec section 53). */
export function contentReport(items: DeepDiveItem[]) {
  const bySection: Record<string, Record<string, number>> = {};
  const bySourceType: Record<string, number> = {};
  const byCitation: Record<string, number> = {};
  let multiSource = 0;
  let noCompany = 0;
  let noYear = 0;

  for (const it of items) {
    (bySection[it.section] ??= {})[it.contentType] =
      ((bySection[it.section] ??= {})[it.contentType] ?? 0) + 1;
    bySourceType[it.sourceType] = (bySourceType[it.sourceType] ?? 0) + 1;
    for (const s of it.sources ?? []) byCitation[s.kind] = (byCitation[s.kind] ?? 0) + 1;
    if ((it.sources?.length ?? 0) > 1) multiSource++;
    if (!it.company) noCompany++;
    if (!it.year) noYear++;
  }

  return { total: items.length, bySection, bySourceType, byCitation, multiSource, noCompany, noYear };
}
