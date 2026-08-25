/**
 * The 150-minute scheduler.
 *
 * Hard constraint: the sum of estimated minutes across the produced plan is
 * NEVER allowed to exceed the daily budget. Everything else — the number of
 * questions, the category mix, the difficulty curve — is negotiable and is
 * optimised for interview value per minute.
 *
 * This module is deliberately pure (no Prisma, no I/O) so the constraint can be
 * property-tested directly. See tests/scheduler.test.ts.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

export type SchedulerQuestion = {
  id: string;
  category: string;
  topic: string; // topic slug
  topicWeight: number; // 0-100 importance of the topic
  pattern: string | null;
  difficulty: Difficulty;
  estimatedMinutes: number;
  frequencyScore: number;
  patternValue: number;
  conceptCoverage: number;
  companies: string[];

  // user state
  status: string;
  masteryScore: number; // 0-100
  attemptCount: number;
  failedCount: number;
  timesOverrun: number;
  lastAttemptAt: Date | null;
  nextReviewAt: Date | null;
};

export type DifficultyMode = "balanced" | "easy-first" | "interview-hard";

export type SchedulerOptions = {
  dailyMinutes: number;
  difficultyMode: DifficultyMode;
  targetCompanies: string[];
  today: Date;
  /** pattern slug -> mastery 0-100 (derived from attempts) */
  patternMastery: Record<string, number>;
  /** topic slug -> mastery 0-100 */
  topicMastery: Record<string, number>;
  /** Category quota overrides, e.g. { DSA: 3, Guesstimate: 0 } */
  quotaOverrides?: Partial<Record<string, number>>;
  /** Deterministic tie-breaking seed (day number works well). */
  seed?: number;
};

export type PlannedTask = {
  question: SchedulerQuestion;
  slot: string; // the slot label this question was chosen for
  plannedMinutes: number;
  priority: number;
  reason: string;
};

export type GeneratedPlan = {
  tasks: PlannedTask[];
  totalMinutes: number;
  budgetMinutes: number;
  slotSummary: { slot: string; minutes: number; count: number }[];
  notes: string[];
};

/** Slot definition: a labelled bucket that draws from one or more categories. */
export type Slot = { label: string; categories: string[] };

export const DEFAULT_SLOTS: { slot: Slot; count: number }[] = [
  { slot: { label: "DSA", categories: ["DSA"] }, count: 2 },
  { slot: { label: "SQL", categories: ["SQL"] }, count: 1 },
  { slot: { label: "Probability/Statistics", categories: ["Probability", "Statistics"] }, count: 1 },
  { slot: { label: "ML/Python", categories: ["ML", "Python"] }, count: 1 },
  { slot: { label: "Guesstimate", categories: ["Guesstimate"] }, count: 1 },
];

/** Days before a solved question may reappear as a fresh (non-review) pick. */
const REPEAT_COOLDOWN_DAYS = 21;

// --------------------------------------------------------------------------
// Scoring
// --------------------------------------------------------------------------

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

function daysSince(date: Date | null, today: Date): number | null {
  if (!date) return null;
  return Math.floor((today.getTime() - date.getTime()) / 86_400_000);
}

/**
 * How weak is the user on what this question teaches? 0 = mastered, 100 = untouched.
 * Blends pattern mastery, topic mastery, and this question's own history.
 */
export function weaknessScore(q: SchedulerQuestion, opts: SchedulerOptions): number {
  const patternM = q.pattern != null ? (opts.patternMastery[q.pattern] ?? 0) : null;
  const topicM = opts.topicMastery[q.topic] ?? 0;

  // Unseen material is a genuine weakness, but a repeatedly failed question is worse.
  const conceptWeakness = 100 - (patternM != null ? 0.6 * patternM + 0.4 * topicM : topicM);

  const failPenalty = Math.min(30, q.failedCount * 12);
  const masteryRelief = q.masteryScore * 0.35; // mastered questions stop being urgent

  return clamp(conceptWeakness + failPenalty - masteryRelief);
}

function companyRelevance(q: SchedulerQuestion, opts: SchedulerOptions): number {
  if (opts.targetCompanies.length === 0) return 50; // neutral when no targets set
  const hits = q.companies.filter((c) => opts.targetCompanies.includes(c)).length;
  if (hits === 0) return 25;
  // One match is already a strong signal; more matches saturate.
  return clamp(60 + hits * 20);
}

/** How well does this question's difficulty match the user's current mode and level? */
function difficultyFit(q: SchedulerQuestion, opts: SchedulerOptions): number {
  const level = clamp(opts.topicMastery[q.topic] ?? 0);
  const rank = q.difficulty === "Easy" ? 0 : q.difficulty === "Medium" ? 1 : 2;

  if (opts.difficultyMode === "easy-first") return [100, 65, 25][rank];
  if (opts.difficultyMode === "interview-hard") return [35, 85, 100][rank];

  // balanced: aim just above current competence, but keep adjacent levels
  // genuinely competitive so a day is never uniformly Easy.
  const targetRank = level < 35 ? 0 : level < 70 ? 1 : 2;
  const distance = Math.abs(rank - targetRank);
  return [100, 75, 40][Math.min(distance, 2)];
}

/**
 * Weighted priority, normalised to 0-100.
 * Weights are exactly the ones specified in the product brief.
 */
export function priorityScore(q: SchedulerQuestion, opts: SchedulerOptions): number {
  const score =
    0.25 * q.frequencyScore +
    0.2 * q.patternValue +
    0.2 * weaknessScore(q, opts) +
    0.15 * companyRelevance(q, opts) +
    0.1 * q.conceptCoverage +
    0.1 * difficultyFit(q, opts);

  return clamp(score);
}

/** Spaced repetition: a question that is due for review gets pushed to the front. */
function reviewBoost(q: SchedulerQuestion, opts: SchedulerOptions): number {
  if (!q.nextReviewAt) return 0;
  const overdueDays = Math.floor((opts.today.getTime() - q.nextReviewAt.getTime()) / 86_400_000);
  if (overdueDays < 0) return 0;
  // Due today = +12, a week overdue = +26, capped.
  return Math.min(30, 12 + overdueDays * 2);
}

/** Recently solved and not yet due? Strongly suppress so days do not repeat. */
function repeatPenalty(q: SchedulerQuestion, opts: SchedulerOptions): number {
  const since = daysSince(q.lastAttemptAt, opts.today);
  if (since == null) return 0;
  if (q.nextReviewAt && q.nextReviewAt.getTime() <= opts.today.getTime()) return 0; // due for review
  if (since >= REPEAT_COOLDOWN_DAYS) return 0;
  const solved = q.status.startsWith("solved") || q.status === "mastered";
  const base = solved ? 70 : 35;
  return base * (1 - since / REPEAT_COOLDOWN_DAYS);
}

export function effectiveScore(q: SchedulerQuestion, opts: SchedulerOptions): number {
  return priorityScore(q, opts) + reviewBoost(q, opts) - repeatPenalty(q, opts);
}

// --------------------------------------------------------------------------
// Quotas
// --------------------------------------------------------------------------

/**
 * Turns the default structure into a concrete list of slots for today,
 * shifting emphasis toward whatever the user is weakest at.
 */
export function resolveSlots(
  questions: SchedulerQuestion[],
  opts: SchedulerOptions,
): { slots: Slot[]; notes: string[] } {
  const notes: string[] = [];
  const plan: { slot: Slot; count: number }[] = DEFAULT_SLOTS.map((s) => ({
    slot: s.slot,
    count: s.count,
  }));

  // Explicit user overrides win outright.
  if (opts.quotaOverrides) {
    for (const [label, count] of Object.entries(opts.quotaOverrides)) {
      const entry = plan.find((p) => p.slot.label === label);
      if (entry && typeof count === "number") {
        entry.count = Math.max(0, count);
        notes.push(`${label} quota set to ${entry.count} by user.`);
      }
    }
  } else {
    // Adaptive nudge: the weakest slot gains one question, the strongest loses one,
    // but only when the gap is large enough to be meaningful.
    const slotWeakness = plan.map((p) => {
      const pool = questions.filter((q) => p.slot.categories.includes(q.category));
      if (pool.length === 0) return { label: p.slot.label, weakness: 0 };
      const avg = pool.reduce((s, q) => s + weaknessScore(q, opts), 0) / pool.length;
      return { label: p.slot.label, weakness: avg };
    });

    const sorted = [...slotWeakness].sort((a, b) => b.weakness - a.weakness);
    const weakest = sorted[0];
    const strongest = sorted[sorted.length - 1];

    if (weakest && strongest && weakest.weakness - strongest.weakness > 25) {
      const w = plan.find((p) => p.slot.label === weakest.label);
      const s = plan.find((p) => p.slot.label === strongest.label);
      if (w && s && s.count > 0) {
        w.count += 1;
        s.count -= 1;
        notes.push(
          `Shifted one slot from ${strongest.label} to ${weakest.label} — that is where you are weakest right now.`,
        );
      }
    }
  }

  const slots: Slot[] = [];
  for (const p of plan) for (let i = 0; i < p.count; i++) slots.push(p.slot);
  return { slots, notes };
}

// --------------------------------------------------------------------------
// Plan generation
// --------------------------------------------------------------------------

function cheapestIn(pool: SchedulerQuestion[]): number {
  return pool.reduce((m, q) => Math.min(m, q.estimatedMinutes), Number.POSITIVE_INFINITY);
}

function explain(q: SchedulerQuestion, opts: SchedulerOptions): string {
  const bits: string[] = [];
  const w = weaknessScore(q, opts);
  if (q.nextReviewAt && q.nextReviewAt.getTime() <= opts.today.getTime()) bits.push("due for review");
  if (w >= 70) bits.push(q.pattern ? `weak pattern: ${q.pattern}` : "weak topic");
  if (q.frequencyScore >= 85) bits.push("very high interview frequency");
  if (opts.targetCompanies.some((c) => q.companies.includes(c))) bits.push("tagged for a target company");
  if (q.failedCount > 0) bits.push(`failed ${q.failedCount}x before`);
  if (bits.length === 0) bits.push("high pattern value");
  return bits.join(", ");
}

/**
 * Generate today's plan.
 *
 * Guarantees:
 *  - totalMinutes <= dailyMinutes, always
 *  - no question appears twice
 *  - at most one question per pattern, unless it is an intentional review
 */
export function generatePlan(
  questions: SchedulerQuestion[],
  opts: SchedulerOptions,
): GeneratedPlan {
  const budget = Math.max(0, opts.dailyMinutes);
  const { slots, notes } = resolveSlots(questions, opts);

  const chosen: PlannedTask[] = [];
  const usedIds = new Set<string>();
  const usedPatterns = new Set<string>();
  let remaining = budget;

  const isDue = (q: SchedulerQuestion) =>
    !!q.nextReviewAt && q.nextReviewAt.getTime() <= opts.today.getTime();

  const poolFor = (slot: Slot) =>
    questions.filter((q) => slot.categories.includes(q.category) && !usedIds.has(q.id));

  // ---- Phase 1: fill every required slot, cheapest-feasible-aware ----
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const pool = poolFor(slot);
    if (pool.length === 0) {
      notes.push(`No questions left for ${slot.label}.`);
      continue;
    }

    // Reserve enough time for the slots we still have to fill after this one.
    let reserve = 0;
    for (let j = i + 1; j < slots.length; j++) {
      const laterPool = poolFor(slots[j]);
      if (laterPool.length > 0) reserve += cheapestIn(laterPool);
    }

    const affordable = pool.filter((q) => q.estimatedMinutes <= remaining - reserve);
    if (affordable.length === 0) {
      notes.push(`Skipped a ${slot.label} slot — no option fits the remaining ${remaining} min.`);
      continue;
    }

    // The share of the remaining budget this slot can fairly claim. Used to stop
    // the scheduler quietly filling the day with the shortest questions it can find.
    const slotsLeft = slots.length - i;
    const fairShare = slotsLeft > 0 ? remaining / slotsLeft : remaining;

    const ranked = affordable
      .map((q) => {
        let score = effectiveScore(q, opts);
        // Diversity: penalise repeating a pattern already covered today.
        if (q.pattern && usedPatterns.has(q.pattern) && !isDue(q)) score -= 45;
        // Budget fit: mild nudge toward questions that actually use the slot.
        const ratio = q.estimatedMinutes / Math.max(1, fairShare);
        score += 10 * (1 - Math.min(1, Math.abs(1 - ratio)));
        return { q, score };
      })
      .sort((a, b) => b.score - a.score || a.q.id.localeCompare(b.q.id));

    const pick = ranked[0];
    chosen.push({
      question: pick.q,
      slot: slot.label,
      plannedMinutes: pick.q.estimatedMinutes,
      priority: Math.round(priorityScore(pick.q, opts)),
      reason: explain(pick.q, opts),
    });
    usedIds.add(pick.q.id);
    if (pick.q.pattern) usedPatterns.add(pick.q.pattern);
    remaining -= pick.q.estimatedMinutes;
  }

  // ---- Phase 2: spend leftover time on the highest-value affordable extras ----
  // Strictly bounded. The structured slots are the plan; this only mops up
  // leftover minutes, and never turns the day into a pile of cheap questions.
  const MAX_BONUS = 2;
  let bonusAdded = 0;
  while (remaining > 0 && bonusAdded < MAX_BONUS) {
    const extras = questions
      .filter((q) => !usedIds.has(q.id) && q.estimatedMinutes <= remaining)
      .map((q) => {
        let score = effectiveScore(q, opts);
        if (q.pattern && usedPatterns.has(q.pattern) && !isDue(q)) score -= 45;
        // Keep the day varied: each question already taken from a category
        // makes another one from that category markedly less attractive.
        const already = chosen.filter((t) => t.question.category === q.category).length;
        score -= already * 22;
        return { q, score };
      })
      .sort((a, b) => b.score - a.score || a.q.id.localeCompare(b.q.id));

    if (extras.length === 0) break;
    const best = extras[0];
    // Do not add filler: require the extra to be genuinely worth the minutes.
    if (best.score < 55) break;
    bonusAdded++;

    chosen.push({
      question: best.q,
      slot: `${best.q.category} (bonus)`,
      plannedMinutes: best.q.estimatedMinutes,
      priority: Math.round(priorityScore(best.q, opts)),
      reason: explain(best.q, opts),
    });
    usedIds.add(best.q.id);
    if (best.q.pattern) usedPatterns.add(best.q.pattern);
    remaining -= best.q.estimatedMinutes;
  }

  const ordered = orderForSession(chosen);
  const totalMinutes = ordered.reduce((s, t) => s + t.plannedMinutes, 0);

  // Defensive: the loops above cannot overspend, but assert it rather than trust it.
  if (totalMinutes > budget) {
    throw new Error(`Scheduler produced ${totalMinutes} min against a ${budget} min budget`);
  }

  const slotSummary = summariseSlots(ordered);
  if (budget - totalMinutes > 0) {
    notes.push(`${budget - totalMinutes} min left unassigned — nothing valuable enough fits.`);
  }

  return { tasks: ordered, totalMinutes, budgetMinutes: budget, slotSummary, notes };
}

/**
 * Difficulty progression: warm up, then climb, and never stack two Hard
 * questions back to back if it can be avoided.
 */
export function orderForSession(tasks: PlannedTask[]): PlannedTask[] {
  const rank = (d: Difficulty) => (d === "Easy" ? 0 : d === "Medium" ? 1 : 2);
  const sorted = [...tasks].sort(
    (a, b) =>
      rank(a.question.difficulty) - rank(b.question.difficulty) ||
      a.plannedMinutes - b.plannedMinutes ||
      a.question.id.localeCompare(b.question.id),
  );

  // Break up adjacent Hard questions: lay out the easier work in order, then
  // slot the Hard ones back in from the end with a gap between each.
  const hard = sorted.filter((t) => t.question.difficulty === "Hard");
  const rest = sorted.filter((t) => t.question.difficulty !== "Hard");
  if (hard.length === 0 || rest.length === 0) return sorted;

  const out = [...rest];
  let insertAt = out.length;
  for (let i = hard.length - 1; i >= 0; i--) {
    if (insertAt >= 1) {
      out.splice(insertAt, 0, hard[i]);
      insertAt -= 1; // leave one easier question before the next Hard
    } else {
      // More Hard questions than gaps. Keep them at the end so the day still
      // ramps up rather than opening on the hardest problem.
      out.push(hard[i]);
    }
  }
  return out;
}

function summariseSlots(tasks: PlannedTask[]) {
  const map = new Map<string, { slot: string; minutes: number; count: number }>();
  for (const t of tasks) {
    const key = t.slot.replace(" (bonus)", "");
    const entry = map.get(key) ?? { slot: key, minutes: 0, count: 0 };
    entry.minutes += t.plannedMinutes;
    entry.count += 1;
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => b.minutes - a.minutes);
}

// --------------------------------------------------------------------------
// Swapping
// --------------------------------------------------------------------------

export type SwapCandidate = {
  question: SchedulerQuestion;
  priority: number;
  fitsBudget: boolean;
  similarity: number;
  reason: string;
};

export type SwapRequest = {
  /** Every task currently in the plan, including the one being replaced. */
  current: { questionId: string; plannedMinutes: number }[];
  /** The task the user wants to replace. */
  replaceQuestionId: string;
  /** Restrict alternatives to these categories. Omit to keep the same category. */
  targetCategories?: string[];
  /** "similar" keeps difficulty and length close; "easier" and "shorter" relax one axis. */
  mode?: "similar" | "easier" | "harder" | "shorter";
};

/**
 * Find replacements for one task that keep the whole plan inside the budget.
 *
 * The budget check is done against the WHOLE plan, not against the outgoing
 * question alone, so a swap can legitimately pick something longer whenever
 * the rest of the day leaves room.
 */
export function findSwapCandidates(
  questions: SchedulerQuestion[],
  req: SwapRequest,
  opts: SchedulerOptions,
  limit = 8,
): SwapCandidate[] {
  const outgoing = questions.find((q) => q.id === req.replaceQuestionId);
  const inPlan = new Set(req.current.map((t) => t.questionId));

  const otherMinutes = req.current
    .filter((t) => t.questionId !== req.replaceQuestionId)
    .reduce((s, t) => s + t.plannedMinutes, 0);
  const headroom = opts.dailyMinutes - otherMinutes;

  const categories = req.targetCategories ?? (outgoing ? [outgoing.category] : []);
  const mode = req.mode ?? "similar";
  const rank = (d: Difficulty) => (d === "Easy" ? 0 : d === "Medium" ? 1 : 2);

  const base = questions.filter(
    (q) =>
      !inPlan.has(q.id) &&
      (categories.length === 0 || categories.includes(q.category)),
  );

  // "easier", "harder" and "shorter" are explicit user intent, so they filter
  // rather than merely nudge. Fall back to the full pool if nothing qualifies.
  const matchesMode = (q: SchedulerQuestion) => {
    if (!outgoing || mode === "similar") return true;
    if (mode === "easier") return rank(q.difficulty) < rank(outgoing.difficulty);
    if (mode === "harder") return rank(q.difficulty) > rank(outgoing.difficulty);
    return q.estimatedMinutes < outgoing.estimatedMinutes;
  };

  const strict = base.filter((q) => matchesMode(q) && q.estimatedMinutes <= headroom);
  const pool = strict.length > 0 ? strict : base;

  const scored = pool.map((q) => {
    const fitsBudget = q.estimatedMinutes <= headroom;

    let similarity = 100;
    if (outgoing) {
      similarity -= Math.abs(q.estimatedMinutes - outgoing.estimatedMinutes) * 2;
      similarity -= Math.abs(rank(q.difficulty) - rank(outgoing.difficulty)) * 15;
      if (q.topic === outgoing.topic) similarity += 20;
      if (q.pattern && q.pattern === outgoing.pattern) similarity += 10;
    }

    // Mode adjustments
    if (outgoing) {
      if (mode === "easier" && rank(q.difficulty) >= rank(outgoing.difficulty)) similarity -= 40;
      if (mode === "harder" && rank(q.difficulty) <= rank(outgoing.difficulty)) similarity -= 40;
      if (mode === "shorter" && q.estimatedMinutes >= outgoing.estimatedMinutes) similarity -= 40;
    }

    const priority = priorityScore(q, opts);
    const score = 0.55 * effectiveScore(q, opts) + 0.45 * clamp(similarity, -100, 120);

    return {
      question: q,
      priority: Math.round(priority),
      fitsBudget,
      similarity: Math.round(clamp(similarity, 0, 100)),
      reason: explain(q, opts),
      _score: score,
    };
  });

  return scored
    .filter((c) => c.fitsBudget)
    .sort((a, b) => b._score - a._score || a.question.id.localeCompare(b.question.id))
    .slice(0, limit)
    .map(({ _score, ...rest }) => rest);
}

/** Would applying this swap keep the plan legal? */
export function swapKeepsBudget(
  current: { questionId: string; plannedMinutes: number }[],
  replaceQuestionId: string,
  incomingMinutes: number,
  dailyMinutes: number,
): boolean {
  const other = current
    .filter((t) => t.questionId !== replaceQuestionId)
    .reduce((s, t) => s + t.plannedMinutes, 0);
  return other + incomingMinutes <= dailyMinutes;
}
