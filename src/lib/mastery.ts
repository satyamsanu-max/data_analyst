/**
 * Mastery scoring and spaced repetition.
 *
 * Pure functions — the API routes call these and persist the result.
 */

export type Outcome = "independent" | "minor_hint" | "major_hint" | "unsolved";

export const OUTCOME_LABELS: Record<Outcome, string> = {
  independent: "Solved independently",
  minor_hint: "Solved with a minor hint",
  major_hint: "Needed a major hint",
  unsolved: "Could not solve",
};

export type ProgressState = {
  status: string;
  attemptCount: number;
  failedCount: number;
  hintUsedCount: number;
  masteryScore: number;
  lastSolveSeconds: number | null;
  totalSeconds: number;
  timesOverrun: number;
  lastAttemptDate: Date;
  nextReviewDate: Date;
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** How much mastery an attempt is worth, before the speed adjustment. */
const BASE_DELTA: Record<Outcome, number> = {
  independent: 26,
  minor_hint: 13,
  major_hint: 3,
  unsolved: -16,
};

/**
 * Review interval in days as a function of mastery.
 * Weak material comes back tomorrow; mastered material goes to the back of the queue.
 */
export function reviewIntervalDays(mastery: number, failedCount: number): number {
  const base =
    mastery >= 95 ? 90 : mastery >= 80 ? 35 : mastery >= 60 ? 16 : mastery >= 40 ? 7 : mastery >= 20 ? 3 : 1;
  // Repeated failures pull the interval back in.
  const penalty = Math.min(0.7, failedCount * 0.2);
  return Math.max(1, Math.round(base * (1 - penalty)));
}

export function statusFor(mastery: number, outcome: Outcome, attemptCount: number): string {
  if (outcome === "unsolved") return attemptCount >= 2 ? "needs_review" : "failed";
  if (mastery >= 90) return "mastered";
  if (outcome === "independent") return "solved";
  return "solved_with_hint";
}

export type AttemptInput = {
  outcome: Outcome;
  seconds: number;
  estimatedMinutes: number;
  /**
   * True when the app graded the attempt objectively (SQL result set matched, or
   * the numeric answer was right) rather than taking the user's word for it.
   */
  verified?: boolean;
  /**
   * Whether `seconds` came from a real start/stop clock. Practice from a
   * question page is untimed: the app only knows how long the tab was open,
   * which is not the same as how long you worked.
   */
  timed?: boolean;
  now?: Date;
};

export type PriorProgress = {
  status: string;
  attemptCount: number;
  failedCount: number;
  hintUsedCount: number;
  masteryScore: number;
  totalSeconds: number;
  timesOverrun: number;
};

export const EMPTY_PROGRESS: PriorProgress = {
  status: "not_started",
  attemptCount: 0,
  failedCount: 0,
  hintUsedCount: 0,
  masteryScore: 0,
  totalSeconds: 0,
  timesOverrun: 0,
};

/** Apply one attempt and return the new persisted progress state. */
export function applyAttempt(prior: PriorProgress, input: AttemptInput): ProgressState {
  const now = input.now ?? new Date();
  const estimatedSeconds = input.estimatedMinutes * 60;
  // Only a real clock earns a speed judgement. Scoring an untimed attempt on
  // duration would reward answering fast from a page that was already open and
  // punish thinking with the tab left up — neither reflects effort.
  const timed = input.timed ?? true;
  const overran = timed && input.seconds > estimatedSeconds * 1.5;

  let delta = BASE_DELTA[input.outcome];

  // Solving comfortably inside the estimate is worth more than scraping through.
  if (timed && input.outcome === "independent") {
    if (input.seconds <= estimatedSeconds * 0.6) delta += 8; // "solved quickly"
    else if (overran) delta -= 8;
  } else if (timed && input.outcome !== "unsolved" && overran) {
    delta -= 4;
  }

  // Objective evidence counts for more than self-assessment. A machine-checked
  // solve earns a little extra; a machine-checked failure costs a little extra,
  // because neither reading depends on the user judging their own work.
  if (input.verified) {
    delta += input.outcome === "unsolved" ? -4 : 5;
  }

  // Diminishing returns: the fifth clean solve teaches less than the first.
  const repeatDamping = input.outcome === "unsolved" ? 1 : Math.max(0.45, 1 - prior.attemptCount * 0.12);
  const masteryScore = clamp(Math.round(prior.masteryScore + delta * repeatDamping));

  const attemptCount = prior.attemptCount + 1;
  const failedCount = prior.failedCount + (input.outcome === "unsolved" ? 1 : 0);
  const hintUsedCount =
    prior.hintUsedCount + (input.outcome === "minor_hint" || input.outcome === "major_hint" ? 1 : 0);

  const status =
    timed &&
    input.outcome === "independent" &&
    input.seconds <= estimatedSeconds * 0.6 &&
    masteryScore < 90
      ? "solved_quickly"
      : statusFor(masteryScore, input.outcome, attemptCount);

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + reviewIntervalDays(masteryScore, failedCount));

  return {
    status,
    attemptCount,
    failedCount,
    hintUsedCount,
    masteryScore,
    lastSolveSeconds: input.seconds,
    totalSeconds: prior.totalSeconds + input.seconds,
    timesOverrun: prior.timesOverrun + (overran ? 1 : 0),
    lastAttemptDate: now,
    nextReviewDate,
  };
}

// --------------------------------------------------------------------------
// Aggregate mastery
// --------------------------------------------------------------------------

export type MasteryRow = { key: string; label: string; mastery: number; attempted: number; total: number };

/**
 * Roll per-question mastery up to a grouping key (pattern, topic, category).
 *
 * Unattempted questions count as zero, so this measures coverage AND depth in
 * a single number — which is exactly what the scheduler should react to.
 */
export function rollUpMastery(
  rows: { key: string; label: string; mastery: number; attempted: boolean }[],
): MasteryRow[] {
  const map = new Map<string, MasteryRow>();
  for (const r of rows) {
    const e = map.get(r.key) ?? { key: r.key, label: r.label, mastery: 0, attempted: 0, total: 0 };
    e.mastery += r.mastery;
    e.attempted += r.attempted ? 1 : 0;
    e.total += 1;
    map.set(r.key, e);
  }
  return [...map.values()]
    .map((e) => ({ ...e, mastery: e.total ? Math.round(e.mastery / e.total) : 0 }))
    .sort((a, b) => a.mastery - b.mastery);
}

/** Coverage: what share of the material in this group has been attempted at all. */
export function coveragePct(row: MasteryRow): number {
  return row.total ? Math.round((row.attempted / row.total) * 100) : 0;
}

/**
 * Interview readiness, 0-100.
 * Weighted blend of mastery across the categories that matter for the role,
 * penalised for having large blind spots rather than rewarding raw volume.
 */
export function readinessScore(
  categoryMastery: Record<string, number>,
  weakestPatterns: number[],
): number {
  const weights: Record<string, number> = {
    DSA: 0.25,
    SQL: 0.25,
    Statistics: 0.15,
    Probability: 0.1,
    ML: 0.1,
    Python: 0.1,
    Guesstimate: 0.05,
  };

  let score = 0;
  let used = 0;
  for (const [cat, w] of Object.entries(weights)) {
    if (categoryMastery[cat] == null) continue;
    score += categoryMastery[cat] * w;
    used += w;
  }
  const base = used > 0 ? score / used : 0;

  // Blind-spot penalty: being strong overall does not help if a whole pattern is at zero.
  const blindSpots = weakestPatterns.filter((m) => m < 15).length;
  const penalty = Math.min(20, blindSpots * 2.5);

  return clamp(Math.round(base - penalty));
}
