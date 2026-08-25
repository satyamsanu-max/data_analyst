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
