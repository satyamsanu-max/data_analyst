import { prisma, getSettings, progressKey } from "./db";
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
export async function loadSchedulerQuestions(userId: string): Promise<SchedulerQuestion[]> {
  const rows = await prisma.question.findMany({
    include: {
      topic: true,
      // Only THIS user's progress row, so one account can never see another's.
      progress: { where: { userId } },
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
    status: q.progress[0]?.status ?? "not_started",
    masteryScore: q.progress[0]?.masteryScore ?? 0,
    attemptCount: q.progress[0]?.attemptCount ?? 0,
    failedCount: q.progress[0]?.failedCount ?? 0,
    timesOverrun: q.progress[0]?.timesOverrun ?? 0,
    lastAttemptAt: q.progress[0]?.lastAttemptDate ?? null,
    nextReviewAt: q.progress[0]?.nextReviewDate ?? null,
  }));
}

/** Mastery rolled up by pattern and by topic, for the scheduler and the dashboard. */
export async function loadMasteryMaps(userId: string) {
  const rows = await prisma.question.findMany({
    select: {
      pattern: true,
      topicId: true,
      topic: { select: { slug: true, name: true, category: true } },
      progress: { where: { userId }, select: { masteryScore: true, attemptCount: true } },
    },
  });

  const patternRows = rows
    .filter((r) => r.pattern)
    .map((r) => ({
      key: r.pattern!,
      label: r.pattern!,
      mastery: r.progress[0]?.masteryScore ?? 0,
      attempted: (r.progress[0]?.attemptCount ?? 0) > 0,
    }));

  const topicRows = rows.map((r) => ({
    key: r.topic.slug,
    label: r.topic.name,
    mastery: r.progress[0]?.masteryScore ?? 0,
    attempted: (r.progress[0]?.attemptCount ?? 0) > 0,
  }));

  const patterns = rollUpMastery(patternRows);
  const topics = rollUpMastery(topicRows);

  const patternMastery: Record<string, number> = {};
  for (const p of patterns) patternMastery[p.key] = p.mastery;
  const topicMastery: Record<string, number> = {};
  for (const t of topics) topicMastery[t.key] = t.mastery;

  return { patterns, topics, patternMastery, topicMastery };
}

export async function schedulerOptions(
  userId: string,
  overrides: Partial<SchedulerOptions> = {},
): Promise<SchedulerOptions> {
  const settings = await getSettings(userId);
  const { patternMastery, topicMastery } = await loadMasteryMaps(userId);
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

export async function dayNumberFor(userId: string, date = new Date()): Promise<number> {
  const settings = await getSettings(userId);
  const start = new Date(settings.startDate);
  start.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((d.getTime() - start.getTime()) / 86_400_000) + 1);
}

const planIncludeFor = (userId: string) =>
  ({
    tasks: {
      orderBy: { position: "asc" as const },
      include: {
        question: {
          include: {
            topic: true,
            source: true,
            companies: { include: { company: true } },
            progress: { where: { userId } },
          },
        },
      },
    },
  }) satisfies Parameters<typeof prisma.dailyPlan.findUnique>[0]["include"];

export type FullPlan = NonNullable<Awaited<ReturnType<typeof findPlan>>>;

export async function findPlan(userId: string, date: string) {
  return prisma.dailyPlan.findUnique({
    where: { userId_date: { userId, date } },
    include: planIncludeFor(userId),
  });
}

/** Today's plan, generating it on first visit of the day. */
export async function getOrCreateTodayPlan(userId: string, force = false) {
  const date = dateKey();
  const existing = await findPlan(userId, date);
  if (existing && !force) return existing;

  const [questions, opts, dayNumber] = await Promise.all([
    loadSchedulerQuestions(userId),
    schedulerOptions(userId),
    dayNumberFor(userId),
  ]);

  const generated = generatePlan(questions, opts);

  if (existing) {
    await prisma.dailyPlan.delete({ where: { id: existing.id } });
  }

  await prisma.dailyPlan.create({
    data: {
      userId,
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

  return (await findPlan(userId, date))!;
}

/** Recompute the plan for today from scratch, discarding untouched tasks. */
export async function regenerateTodayPlan(userId: string) {
  return getOrCreateTodayPlan(userId, true);
}

/**
 * Load a plan the caller actually owns.
 * Scoping by id AND userId means a guessed id from another account resolves to
 * nothing rather than to somebody else's data.
 */
async function ownedPlan(userId: string, planId: string) {
  const plan = await prisma.dailyPlan.findFirst({
    where: { id: planId, userId },
    include: { tasks: true },
  });
  if (!plan) throw new Error("Plan not found");
  return plan;
}

/** Load a task the caller actually owns, via its parent plan. */
async function ownedTask(userId: string, taskId: string) {
  const task = await prisma.dailyTask.findFirst({
    where: { id: taskId, plan: { userId } },
    include: { question: true, plan: true },
  });
  if (!task) throw new Error("Task not found");
  return task;
}

export async function getSwapOptions(
  userId: string,
  planId: string,
  taskId: string,
  targetCategories?: string[],
  mode?: SwapRequest["mode"],
) {
  const plan = await ownedPlan(userId, planId);
  const task = plan.tasks.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found");

  const [questions, opts] = await Promise.all([
    loadSchedulerQuestions(userId),
    schedulerOptions(userId),
  ]);

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

export async function applySwap(
  userId: string,
  planId: string,
  taskId: string,
  newQuestionId: string,
) {
  const plan = await ownedPlan(userId, planId);
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

  return findPlan(userId, plan.date);
}

/** Record an attempt, update mastery and spaced repetition, close out the task. */
export async function completeTask(
  userId: string,
  taskId: string,
  outcome: Outcome,
  graded?: { verified: boolean; submission?: string },
) {
  const task = await ownedTask(userId, taskId);

  // Solve time comes from the server-side clock, not from whatever the browser
  // reports, so a reload or a closed tab cannot lose or fabricate it.
  const seconds = liveElapsedSeconds(task);

  const prior = (await prisma.userProgress.findUnique({
    where: progressKey(userId, task.questionId),
  })) ?? {
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
    {
      outcome,
      seconds,
      estimatedMinutes: task.question.estimatedMinutes,
      verified: graded?.verified ?? false,
    },
  );

  const overran = seconds > task.question.estimatedMinutes * 60 * 1.5;

  await prisma.$transaction([
    prisma.userProgress.upsert({
      where: progressKey(userId, task.questionId),
      create: { userId, questionId: task.questionId, ...next },
      update: next,
    }),
    prisma.attempt.create({
      data: {
        userId,
        questionId: task.questionId,
        planId: task.planId,
        seconds,
        outcome,
        hintUsed: outcome === "minor_hint" || outcome === "major_hint",
        overrun: overran,
        verified: graded?.verified ?? false,
        submission: graded?.submission ?? null,
      },
    }),
    prisma.dailyTask.update({
      where: { id: taskId },
      data: {
        status: "done",
        outcome,
        elapsedSeconds: seconds,
        startedAt: null,
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

  return { progress: next, overran: false };
}

/**
 * Timer model.
 *
 * `elapsedSeconds` holds accumulated time from finished run segments.
 * `startedAt` is when the CURRENT segment began, or null while paused.
 * So the live value is always:  elapsedSeconds + (startedAt ? now - startedAt : 0)
 *
 * Keeping the clock in the database rather than in React state means a reload,
 * a tab close, or navigating away mid-question no longer loses the time — which
 * matters, because the whole workflow is "leave this page and go solve".
 */
export function liveElapsedSeconds(task: { elapsedSeconds: number; startedAt: Date | null }): number {
  const running = task.startedAt ? Math.floor((Date.now() - task.startedAt.getTime()) / 1000) : 0;
  return task.elapsedSeconds + Math.max(0, running);
}

export async function startTask(userId: string, taskId: string) {
  const task = await ownedTask(userId, taskId);
  if (task.startedAt) return task; // already running; do not restart the segment

  return prisma.dailyTask.update({
    where: { id: taskId },
    data: { status: "in_progress", startedAt: new Date() },
  });
}

/** Close the current run segment, folding its time into the accumulated total. */
export async function pauseTask(userId: string, taskId: string) {
  const task = await ownedTask(userId, taskId);
  if (!task.startedAt) return task; // already paused

  return prisma.dailyTask.update({
    where: { id: taskId },
    data: { elapsedSeconds: liveElapsedSeconds(task), startedAt: null },
  });
}

export async function skipTask(userId: string, taskId: string) {
  await ownedTask(userId, taskId);
  return prisma.dailyTask.update({
    where: { id: taskId },
    data: { status: "skipped", startedAt: null },
  });
}

/**
 * Record an attempt made OUTSIDE the daily plan — i.e. answering a question
 * directly from its own page.
 *
 * Previously this path recorded nothing, so solving a probability, statistics
 * or guesstimate question there left mastery at 0% and the status at "Not
 * started". Practice you actually did should always count.
 */
export async function recordPracticeAttempt(
  userId: string,
  questionId: string,
  outcome: Outcome,
  graded?: { verified: boolean; submission?: string },
) {
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw new Error("Question not found");

  const prior = (await prisma.userProgress.findUnique({
    where: progressKey(userId, questionId),
  })) ?? { ...EMPTY_PROGRESS, userId, questionId };

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
    {
      outcome,
      // Untimed: the question page has no start/stop clock, so there is no
      // honest duration to record. Reporting "time since the tab opened" would
      // hand out speed bonuses and overrun penalties that mean nothing.
      seconds: 0,
      timed: false,
      estimatedMinutes: question.estimatedMinutes,
      verified: graded?.verified ?? false,
    },
  );

  await prisma.$transaction([
    prisma.userProgress.upsert({
      where: progressKey(userId, questionId),
      create: { userId, questionId, ...next },
      update: next,
    }),
    prisma.attempt.create({
      data: {
        userId,
        questionId,
        seconds: 0,
        timed: false,
        outcome,
        hintUsed: outcome === "minor_hint" || outcome === "major_hint",
        overrun: false,
        verified: graded?.verified ?? false,
        submission: graded?.submission ?? null,
      },
    }),
  ]);

  return { progress: next, overran: false };
}
