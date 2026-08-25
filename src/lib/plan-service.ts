import { prisma, getSettings } from "./db";
import {
  findSwapCandidates,
  generatePlan,
  swapKeepsBudget,
  type SchedulerOptions,
  type SchedulerQuestion,
  type SwapRequest,
} from "./scheduler";
import { applyAttempt, EMPTY_PROGRESS, rollUpMastery, type Outcome } from "./mastery";

export function dateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseJson<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

/** Load the whole bank plus the user's progress, shaped for the scheduler. */
export async function loadSchedulerQuestions(): Promise<SchedulerQuestion[]> {
  const rows = await prisma.question.findMany({
    include: {
      topic: true,
      progress: true,
      companies: { include: { company: true } },
    },
  });

  return rows.map((q) => ({
    id: q.id,
    category: q.category,
    topic: q.topic.slug,
    topicWeight: q.topic.weight,
    pattern: q.pattern,
    difficulty: q.difficulty as SchedulerQuestion["difficulty"],
    estimatedMinutes: q.estimatedMinutes,
    frequencyScore: q.frequencyScore,
    patternValue: q.patternValue,
    conceptCoverage: q.conceptCoverage,
    companies: q.companies.map((c) => c.company.slug),
    status: q.progress?.status ?? "not_started",
    masteryScore: q.progress?.masteryScore ?? 0,
    attemptCount: q.progress?.attemptCount ?? 0,
    failedCount: q.progress?.failedCount ?? 0,
    timesOverrun: q.progress?.timesOverrun ?? 0,
    lastAttemptAt: q.progress?.lastAttemptDate ?? null,
    nextReviewAt: q.progress?.nextReviewDate ?? null,
  }));
}

/** Mastery rolled up by pattern and by topic, for the scheduler and the dashboard. */
export async function loadMasteryMaps() {
  const rows = await prisma.question.findMany({
    select: {
      pattern: true,
      topicId: true,
      topic: { select: { slug: true, name: true, category: true } },
      progress: { select: { masteryScore: true, attemptCount: true } },
    },
  });

  const patternRows = rows
    .filter((r) => r.pattern)
    .map((r) => ({
      key: r.pattern!,
      label: r.pattern!,
      mastery: r.progress?.masteryScore ?? 0,
      attempted: (r.progress?.attemptCount ?? 0) > 0,
    }));

  const topicRows = rows.map((r) => ({
    key: r.topic.slug,
    label: r.topic.name,
    mastery: r.progress?.masteryScore ?? 0,
    attempted: (r.progress?.attemptCount ?? 0) > 0,
  }));

  const patterns = rollUpMastery(patternRows);
  const topics = rollUpMastery(topicRows);

  const patternMastery: Record<string, number> = {};
  for (const p of patterns) patternMastery[p.key] = p.mastery;
  const topicMastery: Record<string, number> = {};
  for (const t of topics) topicMastery[t.key] = t.mastery;

  return { patterns, topics, patternMastery, topicMastery };
}

export async function schedulerOptions(overrides: Partial<SchedulerOptions> = {}): Promise<SchedulerOptions> {
  const settings = await getSettings();
  const { patternMastery, topicMastery } = await loadMasteryMaps();
  return {
    dailyMinutes: settings.dailyMinutes,
    difficultyMode: settings.difficultyMode as SchedulerOptions["difficultyMode"],
    targetCompanies: parseJson<string[]>(settings.targetCompanies, []),
    today: new Date(),
    patternMastery,
    topicMastery,
    ...overrides,
  };
}

export async function dayNumberFor(date = new Date()): Promise<number> {
  const settings = await getSettings();
  const start = new Date(settings.startDate);
  start.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((d.getTime() - start.getTime()) / 86_400_000) + 1);
}

const planInclude = {
  tasks: {
    orderBy: { position: "asc" },
    include: {
      question: {
        include: { topic: true, source: true, companies: { include: { company: true } }, progress: true },
      },
    },
  },
} as const;

export type FullPlan = NonNullable<Awaited<ReturnType<typeof findPlan>>>;

export async function findPlan(date: string) {
  return prisma.dailyPlan.findUnique({ where: { date }, include: planInclude });
}

/** Today's plan, generating it on first visit of the day. */
export async function getOrCreateTodayPlan(force = false) {
  const date = dateKey();
  const existing = await findPlan(date);
  if (existing && !force) return existing;

  const [questions, opts, dayNumber] = await Promise.all([
    loadSchedulerQuestions(),
    schedulerOptions(),
    dayNumberFor(),
  ]);

  const generated = generatePlan(questions, opts);

  if (existing) {
    await prisma.dailyPlan.delete({ where: { id: existing.id } });
  }

  await prisma.dailyPlan.create({
    data: {
      dayNumber,
      date,
      targetMinutes: opts.dailyMinutes,
      plannedMinutes: generated.totalMinutes,
      tasks: {
        create: generated.tasks.map((t, i) => ({
          questionId: t.question.id,
          position: i,
          plannedMinutes: t.plannedMinutes,
        })),
      },
    },
  });

  return (await findPlan(date))!;
}

/** Recompute the plan for today from scratch, discarding untouched tasks. */
export async function regenerateTodayPlan() {
  return getOrCreateTodayPlan(true);
}

export async function getSwapOptions(
  planId: string,
  taskId: string,
  targetCategories?: string[],
  mode?: SwapRequest["mode"],
) {
  const plan = await prisma.dailyPlan.findUnique({
    where: { id: planId },
    include: { tasks: true },
  });
  if (!plan) throw new Error("Plan not found");
  const task = plan.tasks.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found");

  const [questions, opts] = await Promise.all([loadSchedulerQuestions(), schedulerOptions()]);

  const current = plan.tasks.map((t) => ({
    questionId: t.questionId,
    plannedMinutes: t.plannedMinutes,
  }));

  const candidates = findSwapCandidates(
    questions,
    { current, replaceQuestionId: task.questionId, targetCategories, mode },
    { ...opts, dailyMinutes: plan.targetMinutes },
    10,
  );

  const otherMinutes = current
    .filter((c) => c.questionId !== task.questionId)
    .reduce((s, c) => s + c.plannedMinutes, 0);

  return {
    candidates,
    headroomMinutes: plan.targetMinutes - otherMinutes,
    outgoingQuestionId: task.questionId,
  };
}

export async function applySwap(planId: string, taskId: string, newQuestionId: string) {
  const plan = await prisma.dailyPlan.findUnique({ where: { id: planId }, include: { tasks: true } });
  if (!plan) throw new Error("Plan not found");
  const task = plan.tasks.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found");
  if (task.status === "done") throw new Error("That task is already complete");

  if (plan.tasks.some((t) => t.questionId === newQuestionId)) {
    throw new Error("That question is already in today's plan");
  }

  const incoming = await prisma.question.findUnique({ where: { id: newQuestionId } });
  if (!incoming) throw new Error("Question not found");

  const current = plan.tasks.map((t) => ({
    questionId: t.questionId,
    plannedMinutes: t.plannedMinutes,
  }));

  // The budget guarantee is enforced here, not just in the UI.
  if (!swapKeepsBudget(current, task.questionId, incoming.estimatedMinutes, plan.targetMinutes)) {
    throw new Error(
      `That swap would push the day to over ${plan.targetMinutes} minutes. Pick a shorter alternative.`,
    );
  }

  await prisma.dailyTask.update({
    where: { id: taskId },
    data: {
      questionId: newQuestionId,
      plannedMinutes: incoming.estimatedMinutes,
      swapped: true,
      status: "pending",
      elapsedSeconds: 0,
      startedAt: null,
    },
  });

  const newTotal = current.reduce(
    (s, t) => s + (t.questionId === task.questionId ? incoming.estimatedMinutes : t.plannedMinutes),
    0,
  );
  await prisma.dailyPlan.update({ where: { id: planId }, data: { plannedMinutes: newTotal } });

  return findPlan(plan.date);
}

/** Record an attempt, update mastery and spaced repetition, close out the task. */
export async function completeTask(
  taskId: string,
  outcome: Outcome,
  seconds: number,
) {
  const task = await prisma.dailyTask.findUnique({
    where: { id: taskId },
    include: { question: true, plan: true },
  });
  if (!task) throw new Error("Task not found");

  const prior = (await prisma.userProgress.findUnique({ where: { questionId: task.questionId } })) ?? {
    ...EMPTY_PROGRESS,
    questionId: task.questionId,
  };

  const next = applyAttempt(
    {
      status: prior.status,
      attemptCount: prior.attemptCount,
      failedCount: prior.failedCount,
      hintUsedCount: prior.hintUsedCount,
      masteryScore: prior.masteryScore,
      totalSeconds: prior.totalSeconds,
      timesOverrun: prior.timesOverrun,
    },
    { outcome, seconds, estimatedMinutes: task.question.estimatedMinutes },
  );

  const overran = seconds > task.question.estimatedMinutes * 60 * 1.5;

  await prisma.$transaction([
    prisma.userProgress.upsert({
      where: { questionId: task.questionId },
      create: { questionId: task.questionId, ...next },
      update: next,
    }),
    prisma.attempt.create({
      data: {
        questionId: task.questionId,
        planId: task.planId,
        seconds,
        outcome,
        hintUsed: outcome === "minor_hint" || outcome === "major_hint",
        overrun: overran,
      },
    }),
    prisma.dailyTask.update({
      where: { id: taskId },
      data: {
        status: "done",
        outcome,
        elapsedSeconds: seconds,
        completedAt: new Date(),
      },
    }),
  ]);

  // Mark the whole plan complete once every task is done.
  const remaining = await prisma.dailyTask.count({
    where: { planId: task.planId, status: { not: "done" } },
  });
  if (remaining === 0) {
    await prisma.dailyPlan.update({ where: { id: task.planId }, data: { status: "completed" } });
  }

  return { progress: next, overran };
}

export async function startTask(taskId: string) {
  return prisma.dailyTask.update({
    where: { id: taskId },
    data: { status: "in_progress", startedAt: new Date() },
  });
}

export async function skipTask(taskId: string) {
  return prisma.dailyTask.update({ where: { id: taskId }, data: { status: "skipped" } });
}
