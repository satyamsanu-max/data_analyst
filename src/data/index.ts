import { DSA_QUESTIONS } from "./dsa";
import { SQL_QUESTIONS } from "./sql";
import { PROBABILITY_QUESTIONS } from "./probability";
import { STATISTICS_QUESTIONS } from "./statistics";
import { ML_QUESTIONS } from "./ml";
import { PYTHON_QUESTIONS } from "./python";
import { GUESSTIMATE_QUESTIONS } from "./guesstimates";
import { CATEGORY_CAPS, type Category, type SeedQuestion } from "./types";
import { COMPANIES, SOURCES, TOPICS } from "./reference";

export { COMPANIES, SOURCES, TOPICS };
export * from "./types";
export { SQL_PRACTICE_SCHEMA } from "./sql";

export const ALL_QUESTIONS: SeedQuestion[] = [
  ...DSA_QUESTIONS,
  ...SQL_QUESTIONS,
  ...PROBABILITY_QUESTIONS,
  ...STATISTICS_QUESTIONS,
  ...ML_QUESTIONS,
  ...PYTHON_QUESTIONS,
  ...GUESSTIMATE_QUESTIONS,
];

export const QUESTIONS_BY_CATEGORY = ALL_QUESTIONS.reduce<Record<string, SeedQuestion[]>>(
  (acc, q) => {
    (acc[q.category] ??= []).push(q);
    return acc;
  },
  {},
);

/**
 * Validates the bank before it ever reaches the database:
 *  - per-category caps respected
 *  - unique ids
 *  - every topic / company / source reference resolves
 */
export function validateBank(): { ok: boolean; errors: string[]; counts: Record<string, number> } {
  const errors: string[] = [];
  const topicSlugs = new Set(TOPICS.map((t) => t.slug));
  const companySlugs = new Set(COMPANIES.map((c) => c.slug));
  const sourceNames = new Set(SOURCES.map((s) => s.name));
  const seenIds = new Set<string>();

  const counts: Record<string, number> = {};
  for (const q of ALL_QUESTIONS) {
    counts[q.category] = (counts[q.category] ?? 0) + 1;

    if (seenIds.has(q.id)) errors.push(`Duplicate question id: ${q.id}`);
    seenIds.add(q.id);

    if (!topicSlugs.has(q.topic)) errors.push(`${q.id}: unknown topic "${q.topic}"`);
    if (q.source && !sourceNames.has(q.source)) errors.push(`${q.id}: unknown source "${q.source}"`);
    for (const c of q.companyTags ?? []) {
      if (!companySlugs.has(c)) errors.push(`${q.id}: unknown company "${c}"`);
    }
    if (q.estimatedMinutes <= 0 || q.estimatedMinutes > 60) {
      errors.push(`${q.id}: implausible estimatedMinutes ${q.estimatedMinutes}`);
    }
  }

  for (const [cat, cap] of Object.entries(CATEGORY_CAPS) as [Category, number][]) {
    const n = counts[cat] ?? 0;
    if (n > cap) errors.push(`Category ${cat} exceeds cap: ${n} > ${cap}`);
  }

  return { ok: errors.length === 0, errors, counts };
}
