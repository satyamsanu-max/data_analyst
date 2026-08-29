import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutes(n: number) {
  return `${n} min`;
}

export function pct(n: number) {
  return `${Math.round(n)}%`;
}

export const DIFFICULTY_CLASS: Record<string, string> = {
  Easy: "text-easy border-easy/30 bg-easy/10",
  Medium: "text-medium border-medium/30 bg-medium/10",
  Hard: "text-hard border-hard/30 bg-hard/10",
};

export const CATEGORY_CLASS: Record<string, string> = {
  DSA: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  SQL: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  Probability: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Statistics: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  ML: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Python: "bg-teal-500/15 text-teal-400 border-teal-500/25",
  Guesstimate: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

export function categorySlug(category: string) {
  return category.toLowerCase();
}

export const CATEGORY_FROM_SLUG: Record<string, string> = {
  dsa: "DSA",
  sql: "SQL",
  probability: "Probability",
  statistics: "Statistics",
  ml: "ML",
  python: "Python",
  guesstimate: "Guesstimate",
};

export function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const STATUS_LABEL: Record<string, string> = {
  not_started: "Not started",
  attempted: "Attempted",
  solved: "Solved",
  solved_quickly: "Solved quickly",
  solved_with_hint: "Solved with hint",
  failed: "Failed",
  needs_review: "Needs review",
  mastered: "Mastered",
};

// ---------------------------------------------------------------- Deep Dive
// Additive only: nothing above this line changes, so the Data Analyst pages
// that import CATEGORY_CLASS / STATUS_LABEL behave exactly as before.

export const DD_STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "Not started",
  ATTEMPTED: "Attempted",
  SOLVED: "Solved",
  NEEDS_REVIEW: "Needs review",
};

export const DD_STATUS_CLASS: Record<string, string> = {
  SOLVED: "border-easy/30 bg-easy/10 text-easy",
  NEEDS_REVIEW: "border-hard/30 bg-hard/10 text-hard",
  ATTEMPTED: "border-medium/30 bg-medium/10 text-medium",
};

/**
 * Colour carries the honesty distinction: anything a source ties to a real
 * interview reads green-ish, anything we wrote ourselves reads neutral. A user
 * should be able to tell the difference without reading the label.
 */
export const DD_SOURCE_CLASS: Record<string, string> = {
  REAL_INTERVIEW: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  INTERVIEW_EXPERIENCE: "border-teal-500/30 bg-teal-500/10 text-teal-400",
  CASEBOOK_INTERVIEW_CASE: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  COMMON_INTERVIEW_QUESTION: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  ADAPTED_PRACTICE: "border-border bg-secondary text-muted-foreground",
};

export const DD_TYPE_LABEL: Record<string, string> = {
  CONCEPT: "Concept",
  QUESTION: "Question",
  CASE: "Case",
  GUESSTIMATE: "Guesstimate",
  INDUSTRY_PRIMER: "Industry primer",
};

export const DD_DOMAIN_CLASS: Record<string, string> = {
  DATA: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  PRODUCT: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  CONSULTING: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};
