import { prisma } from "./db";
import { CATEGORY_CAPS, type Category } from "@/data/types";
import { coveragePct, readinessScore, rollUpMastery } from "./mastery";
import { dateKey, loadMasteryMaps } from "./plan-service";

export type CategoryProgress = {
  category: string;
  solved: number;
  total: number;
  cap: number;
  mastery: number;
  attempted: number;
};

export async function categoryProgress(userId: string): Promise<CategoryProgress[]> {
  const rows = await prisma.question.findMany({
    select: {
      category: true,
      progress: {
        where: { userId },
        select: { attemptCount: true, masteryScore: true, status: true },
      },
    },
  });

  const map = new Map<string, CategoryProgress & { masterySum: number }>();
  for (const r of rows) {
    const e =
      map.get(r.category) ??
      ({
        category: r.category,
        solved: 0,
        total: 0,
        cap: CATEGORY_CAPS[r.category as Category] ?? 0,
        mastery: 0,
        attempted: 0,
        masterySum: 0,
      } as CategoryProgress & { masterySum: number });

    e.total += 1;
    e.masterySum += r.progress[0]?.masteryScore ?? 0;
    if ((r.progress[0]?.attemptCount ?? 0) > 0) e.attempted += 1;
    const st = r.progress[0]?.status ?? "not_started";
    if (st === "solved" || st === "solved_quickly" || st === "solved_with_hint" || st === "mastered") {
      e.solved += 1;
    }
    map.set(r.category, e);
  }

  const order = ["DSA", "SQL", "Probability", "Statistics", "ML", "Python", "Guesstimate"];
  return [...map.values()]
    .map(({ masterySum, ...e }) => ({ ...e, mastery: e.total ? Math.round(masterySum / e.total) : 0 }))
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
}

/** Consecutive days, ending today or yesterday, on which at least one attempt was logged. */
export async function currentStreak(
  userId: string,
): Promise<{ current: number; longest: number; lastActive: string | null }> {
  const attempts = await prisma.attempt.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  if (attempts.length === 0) return { current: 0, longest: 0, lastActive: null };

  const days = [...new Set(attempts.map((a) => dateKey(a.createdAt)))].sort().reverse();
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 86_400_000));

  let current = 0;
  if (days[0] === today || days[0] === yesterday) {
    current = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1] + "T00:00:00");
      const cur = new Date(days[i] + "T00:00:00");
      if ((prev.getTime() - cur.getTime()) / 86_400_000 === 1) current++;
      else break;
    }
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + "T00:00:00");
    const cur = new Date(days[i] + "T00:00:00");
    if ((prev.getTime() - cur.getTime()) / 86_400_000 === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
  }

  return { current, longest, lastActive: days[0] };
}

export type Overview = {
  categories: CategoryProgress[];
  totalSolved: number;
  totalQuestions: number;
  totalSeconds: number;
  attempts: number;
  avgSolveSeconds: number;
  overruns: number;
  streak: { current: number; longest: number; lastActive: string | null };
  readiness: number;
  weakestTopics: { key: string; label: string; mastery: number; coverage: number }[];
  patterns: { key: string; label: string; mastery: number; coverage: number; total: number; attempted: number }[];
};

export async function overview(userId: string): Promise<Overview> {
  const [categories, streak, mastery, attemptAgg, attemptCount, overrunCount] = await Promise.all([
    categoryProgress(userId),
    currentStreak(userId),
    loadMasteryMaps(userId),
    prisma.attempt.aggregate({ where: { userId }, _sum: { seconds: true }, _avg: { seconds: true } }),
    prisma.attempt.count({ where: { userId } }),
    prisma.attempt.count({ where: { userId, overrun: true } }),
  ]);

  const categoryMastery: Record<string, number> = {};
  for (const c of categories) categoryMastery[c.category] = c.mastery;

  const patterns = mastery.patterns.map((p) => ({
    key: p.key,
    label: p.label,
    mastery: p.mastery,
    coverage: coveragePct(p),
    total: p.total,
    attempted: p.attempted,
  }));

  return {
    categories,
    totalSolved: categories.reduce((s, c) => s + c.solved, 0),
    totalQuestions: categories.reduce((s, c) => s + c.total, 0),
    totalSeconds: attemptAgg._sum.seconds ?? 0,
    attempts: attemptCount,
    avgSolveSeconds: Math.round(attemptAgg._avg.seconds ?? 0),
    overruns: overrunCount,
    streak,
    readiness: readinessScore(
      categoryMastery,
      mastery.patterns.map((p) => p.mastery),
    ),
    weakestTopics: mastery.topics
      .slice(0, 8)
      .map((t) => ({ key: t.key, label: t.label, mastery: t.mastery, coverage: coveragePct(t) })),
    patterns,
  };
}

export type WeeklyReview = {
  weekStart: string;
  weekEnd: string;
  totalSeconds: number;
  byCategory: { category: string; count: number }[];
  outcomes: Record<string, number>;
  weakestAreas: { label: string; mastery: number }[];
  daysActive: number;
  planned: number;
  completed: number;
};

/** Rolling 7-day review, used to seed next week's emphasis. */
export async function weeklyReview(userId: string, weeksAgo = 0): Promise<WeeklyReview> {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() - weeksAgo * 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const attempts = await prisma.attempt.findMany({
    where: { userId, createdAt: { gte: start, lte: end } },
    include: { question: { include: { topic: true } } },
  });

  const byCategory = new Map<string, number>();
  const outcomes: Record<string, number> = {};
  let totalSeconds = 0;
  const days = new Set<string>();

  for (const a of attempts) {
    byCategory.set(a.question.category, (byCategory.get(a.question.category) ?? 0) + 1);
    outcomes[a.outcome] = (outcomes[a.outcome] ?? 0) + 1;
    totalSeconds += a.seconds;
    days.add(dateKey(a.createdAt));
  }

  // Weakest areas are computed over the topics actually touched this week,
  // falling back to the global weakest when the week was quiet.
  const touched = new Set(attempts.map((a) => a.question.topic.slug));
  const all = await loadMasteryMaps(userId);
  const pool = touched.size > 0 ? all.topics.filter((t) => touched.has(t.key)) : all.topics;

  const plans = await prisma.dailyPlan.findMany({
    where: { userId, date: { gte: dateKey(start), lte: dateKey(end) } },
    include: { tasks: true },
  });

  return {
    weekStart: dateKey(start),
    weekEnd: dateKey(end),
    totalSeconds,
    byCategory: [...byCategory.entries()]
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
    outcomes,
    weakestAreas: pool.slice(0, 5).map((t) => ({ label: t.label, mastery: t.mastery })),
    daysActive: days.size,
    planned: plans.reduce((s, p) => s + p.tasks.length, 0),
    completed: plans.reduce((s, p) => s + p.tasks.filter((t) => t.status === "done").length, 0),
  };
}

/** Per-pattern coverage table for the DSA pattern dashboard. */
export async function patternCoverage(userId: string) {
  const rows = await prisma.question.findMany({
    where: { category: "DSA", pattern: { not: null } },
    select: {
      pattern: true,
      topic: { select: { slug: true, name: true } },
      progress: { where: { userId }, select: { masteryScore: true, attemptCount: true } },
    },
  });

  const byTopic = rollUpMastery(
    rows.map((r) => ({
      key: r.topic.slug,
      label: r.topic.name,
      mastery: r.progress[0]?.masteryScore ?? 0,
      attempted: (r.progress[0]?.attemptCount ?? 0) > 0,
    })),
  );

  const byPattern = rollUpMastery(
    rows.map((r) => ({
      key: r.pattern!,
      label: r.pattern!,
      mastery: r.progress[0]?.masteryScore ?? 0,
      attempted: (r.progress[0]?.attemptCount ?? 0) > 0,
    })),
  );

  return {
    topics: byTopic.map((t) => ({ ...t, coverage: coveragePct(t) })),
    patterns: byPattern.map((p) => ({ ...p, coverage: coveragePct(p) })),
  };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
