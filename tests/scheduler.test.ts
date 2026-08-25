import { describe, expect, it } from "vitest";
import {
  DEFAULT_SLOTS,
  findSwapCandidates,
  generatePlan,
  orderForSession,
  priorityScore,
  swapKeepsBudget,
  type SchedulerOptions,
  type SchedulerQuestion,
} from "../src/lib/scheduler";
import { ALL_QUESTIONS, TOPICS } from "../src/data";

const topicWeight = new Map(TOPICS.map((t) => [t.slug, t.weight]));

/** Build the scheduler's view of the real seeded bank, with a blank user. */
function bank(overrides: Partial<SchedulerQuestion> = {}): SchedulerQuestion[] {
  return ALL_QUESTIONS.map((q) => ({
    id: q.id,
    category: q.category,
    topic: q.topic,
    topicWeight: topicWeight.get(q.topic) ?? 50,
    pattern: q.pattern ?? null,
    difficulty: q.difficulty,
    estimatedMinutes: q.estimatedMinutes,
    frequencyScore: q.frequencyScore,
    patternValue: q.patternValue,
    conceptCoverage: q.conceptCoverage ?? 50,
    companies: q.companyTags ?? [],
    status: "not_started",
    masteryScore: 0,
    attemptCount: 0,
    failedCount: 0,
    timesOverrun: 0,
    lastAttemptAt: null,
    nextReviewAt: null,
    ...overrides,
  }));
}

function opts(over: Partial<SchedulerOptions> = {}): SchedulerOptions {
  return {
    dailyMinutes: 150,
    difficultyMode: "balanced",
    targetCompanies: [],
    today: new Date("2026-08-25T09:00:00Z"),
    patternMastery: {},
    topicMastery: {},
    ...over,
  };
}

// A tiny deterministic PRNG so the randomised tests are reproducible.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

describe("the 150-minute constraint", () => {
  it("never exceeds the budget on a fresh user", () => {
    const plan = generatePlan(bank(), opts());
    expect(plan.totalMinutes).toBeLessThanOrEqual(150);
    expect(plan.tasks.length).toBeGreaterThan(0);
  });

  it("holds for every budget from 30 to 300 minutes", () => {
    for (let budget = 30; budget <= 300; budget += 5) {
      const plan = generatePlan(bank(), opts({ dailyMinutes: budget }));
      expect(plan.totalMinutes, `budget ${budget}`).toBeLessThanOrEqual(budget);
    }
  });

  it("holds for the four supported study-time settings", () => {
    for (const budget of [90, 120, 150, 180]) {
      const plan = generatePlan(bank(), opts({ dailyMinutes: budget }));
      expect(plan.totalMinutes).toBeLessThanOrEqual(budget);
      // Should also be using the time reasonably well, not leaving half of it idle.
      expect(plan.totalMinutes).toBeGreaterThanOrEqual(budget * 0.6);
    }
  });

  it("holds across 400 randomised user states", () => {
    const rand = rng(20260825);
    for (let trial = 0; trial < 400; trial++) {
      const questions = bank().map((q) => {
        const attempted = rand() < 0.35;
        const mastery = attempted ? Math.floor(rand() * 100) : 0;
        const daysAgo = Math.floor(rand() * 60);
        return {
          ...q,
          status: attempted ? (mastery > 80 ? "mastered" : "solved") : "not_started",
          masteryScore: mastery,
          attemptCount: attempted ? 1 + Math.floor(rand() * 3) : 0,
          failedCount: rand() < 0.1 ? 1 + Math.floor(rand() * 2) : 0,
          lastAttemptAt: attempted
            ? new Date(Date.now() - daysAgo * 86_400_000)
            : null,
          nextReviewAt: attempted
            ? new Date(Date.now() + (rand() * 40 - 20) * 86_400_000)
            : null,
        };
      });

      const budget = [90, 120, 150, 180][Math.floor(rand() * 4)];
      const mode = (["balanced", "easy-first", "interview-hard"] as const)[Math.floor(rand() * 3)];
      const companies = rand() < 0.5 ? ["amazon", "meta"] : [];

      const plan = generatePlan(
        questions,
        opts({ dailyMinutes: budget, difficultyMode: mode, targetCompanies: companies }),
      );
      expect(plan.totalMinutes, `trial ${trial}`).toBeLessThanOrEqual(budget);
    }
  });

  it("degrades gracefully when the budget is smaller than any question", () => {
    const plan = generatePlan(bank(), opts({ dailyMinutes: 5 }));
    expect(plan.totalMinutes).toBe(0);
    expect(plan.tasks).toHaveLength(0);
  });

  it("handles an empty bank", () => {
    const plan = generatePlan([], opts());
    expect(plan.totalMinutes).toBe(0);
    expect(plan.tasks).toHaveLength(0);
  });
});

describe("plan composition", () => {
  it("covers the default category structure at 150 minutes", () => {
    const plan = generatePlan(bank(), opts());
    const labels = new Set(plan.slotSummary.map((s) => s.slot));
    for (const { slot } of DEFAULT_SLOTS) {
      expect(labels.has(slot.label), `missing slot ${slot.label}`).toBe(true);
    }
  });

  it("never repeats a question inside one plan", () => {
    const plan = generatePlan(bank(), opts());
    const ids = plan.tasks.map((t) => t.question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("avoids scheduling the same pattern twice in a day", () => {
    const plan = generatePlan(bank(), opts());
    const patterns = plan.tasks.map((t) => t.question.pattern).filter(Boolean);
    expect(new Set(patterns).size).toBe(patterns.length);
  });

  it("suppresses a question solved in the last few days", () => {
    const fresh = generatePlan(bank(), opts()).tasks.find((t) => t.question.category === "SQL");
    expect(fresh).toBeDefined();

    // Mark exactly the question it picked as solved two days ago, not yet due.
    const recent = bank().map((q) =>
      q.id === fresh!.question.id
        ? {
            ...q,
            status: "solved",
            masteryScore: 70,
            attemptCount: 1,
            lastAttemptAt: new Date(Date.now() - 2 * 86_400_000),
            nextReviewAt: new Date(Date.now() + 14 * 86_400_000),
          }
        : q,
    );

    const after = generatePlan(recent, opts());
    expect(after.tasks.some((t) => t.question.category === "SQL")).toBe(true);
    expect(after.tasks.map((t) => t.question.id)).not.toContain(fresh!.question.id);
  });

  it("prioritises questions that are due for review", () => {
    const due = bank().map((q, i) =>
      i % 50 === 0
        ? {
            ...q,
            status: "needs_review",
            masteryScore: 30,
            attemptCount: 2,
            failedCount: 1,
            lastAttemptAt: new Date(Date.now() - 30 * 86_400_000),
            nextReviewAt: new Date(Date.now() - 5 * 86_400_000),
          }
        : q,
    );
    const plan = generatePlan(due, opts());
    const hasDue = plan.tasks.some((t) => t.reason.includes("due for review"));
    expect(hasDue).toBe(true);
  });

  it("weights company-tagged questions up when a target is set", () => {
    const questions = bank();
    const amazonTagged = questions.find((q) => q.companies.includes("amazon"))!;
    const untagged = questions.find((q) => q.companies.length === 0 && q.category === amazonTagged.category);

    const withTarget = opts({ targetCompanies: ["amazon"] });
    const withoutTarget = opts();

    expect(priorityScore(amazonTagged, withTarget)).toBeGreaterThan(
      priorityScore(amazonTagged, withoutTarget),
    );
    if (untagged) {
      expect(priorityScore(untagged, withTarget)).toBeLessThan(priorityScore(untagged, withoutTarget));
    }
  });

  it("adapts the mix toward weak areas", () => {
    // Strong at DSA, blank everywhere else.
    const topicMastery: Record<string, number> = {};
    for (const t of TOPICS) topicMastery[t.slug] = t.category === "DSA" ? 95 : 0;

    const plan = generatePlan(bank(), opts({ topicMastery }));
    const dsaCount = plan.tasks.filter((t) => t.question.category === "DSA").length;
    const defaultPlan = generatePlan(bank(), opts());
    const defaultDsa = defaultPlan.tasks.filter((t) => t.question.category === "DSA").length;
    expect(dsaCount).toBeLessThanOrEqual(defaultDsa);
  });

  it("respects explicit quota overrides", () => {
    const plan = generatePlan(
      bank(),
      opts({ quotaOverrides: { DSA: 3, Guesstimate: 0, "ML/Python": 0 } }),
    );
    expect(plan.tasks.filter((t) => t.slot === "Guesstimate")).toHaveLength(0);
    expect(plan.tasks.filter((t) => t.slot === "DSA").length).toBeGreaterThanOrEqual(3);
    expect(plan.totalMinutes).toBeLessThanOrEqual(150);
  });
});

describe("difficulty progression", () => {
  it("starts no harder than it finishes", () => {
    const plan = generatePlan(bank(), opts());
    const rank = (d: string) => (d === "Easy" ? 0 : d === "Medium" ? 1 : 2);
    const first = rank(plan.tasks[0].question.difficulty);
    const last = rank(plan.tasks[plan.tasks.length - 1].question.difficulty);
    expect(first).toBeLessThanOrEqual(last);
  });

  it("does not stack two Hard questions back to back when an easier one exists", () => {
    const tasks = orderForSession([
      { question: { difficulty: "Hard", id: "a" }, plannedMinutes: 40, slot: "x", priority: 1, reason: "" },
      { question: { difficulty: "Hard", id: "b" }, plannedMinutes: 40, slot: "x", priority: 1, reason: "" },
      { question: { difficulty: "Easy", id: "c" }, plannedMinutes: 20, slot: "x", priority: 1, reason: "" },
      { question: { difficulty: "Medium", id: "d" }, plannedMinutes: 25, slot: "x", priority: 1, reason: "" },
    ] as never);

    const diffs = tasks.map((t) => t.question.difficulty);
    for (let i = 1; i < diffs.length; i++) {
      expect(diffs[i] === "Hard" && diffs[i - 1] === "Hard").toBe(false);
    }
  });
});

describe("swapping", () => {
  const plan = generatePlan(bank(), opts());
  const current = plan.tasks.map((t) => ({
    questionId: t.question.id,
    plannedMinutes: t.plannedMinutes,
  }));

  it("only offers alternatives that keep the plan inside the budget", () => {
    for (const task of plan.tasks) {
      const candidates = findSwapCandidates(
        bank(),
        { current, replaceQuestionId: task.question.id },
        opts(),
      );
      for (const c of candidates) {
        const ok = swapKeepsBudget(current, task.question.id, c.question.estimatedMinutes, 150);
        expect(ok, `${c.question.id} would overflow the budget`).toBe(true);
      }
    }
  });

  it("never offers a question already in the plan", () => {
    const inPlan = new Set(current.map((c) => c.questionId));
    for (const task of plan.tasks) {
      const candidates = findSwapCandidates(
        bank(),
        { current, replaceQuestionId: task.question.id },
        opts(),
      );
      for (const c of candidates) expect(inPlan.has(c.question.id)).toBe(false);
    }
  });

  it("keeps the same category by default", () => {
    const task = plan.tasks[0];
    const candidates = findSwapCandidates(
      bank(),
      { current, replaceQuestionId: task.question.id },
      opts(),
    );
    expect(candidates.length).toBeGreaterThan(0);
    for (const c of candidates) expect(c.question.category).toBe(task.question.category);
  });

  it("can deliberately change category and still fit the budget", () => {
    const mlTask = plan.tasks.find((t) => t.slot === "ML/Python");
    if (!mlTask) return;
    const candidates = findSwapCandidates(
      bank(),
      {
        current,
        replaceQuestionId: mlTask.question.id,
        targetCategories: ["Probability"],
      },
      opts(),
    );
    expect(candidates.length).toBeGreaterThan(0);
    for (const c of candidates) {
      expect(c.question.category).toBe("Probability");
      expect(swapKeepsBudget(current, mlTask.question.id, c.question.estimatedMinutes, 150)).toBe(true);
    }
  });

  it("honours the 'shorter' and 'easier' modes", () => {
    const target = plan.tasks.find((t) => t.question.difficulty !== "Easy");
    if (!target) return;

    const easier = findSwapCandidates(
      bank(),
      { current, replaceQuestionId: target.question.id, mode: "easier" },
      opts(),
      4,
    );
    // The top-ranked easier candidate should actually be easier.
    const rank = (d: string) => (d === "Easy" ? 0 : d === "Medium" ? 1 : 2);
    if (easier.length > 0) {
      expect(rank(easier[0].question.difficulty)).toBeLessThan(rank(target.question.difficulty));
    }
  });

  it("swapping repeatedly never drifts over budget", () => {
    let working = [...current];
    const rand = rng(7);
    for (let i = 0; i < 60; i++) {
      const victim = working[Math.floor(rand() * working.length)];
      const candidates = findSwapCandidates(
        bank(),
        { current: working, replaceQuestionId: victim.questionId },
        opts(),
      );
      if (candidates.length === 0) continue;
      const pick = candidates[Math.floor(rand() * candidates.length)];
      working = working.map((t) =>
        t.questionId === victim.questionId
          ? { questionId: pick.question.id, plannedMinutes: pick.question.estimatedMinutes }
          : t,
      );
      const total = working.reduce((s, t) => s + t.plannedMinutes, 0);
      expect(total, `after swap ${i}`).toBeLessThanOrEqual(150);
    }
  });
});
