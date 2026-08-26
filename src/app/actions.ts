"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  applySwap,
  completeTask,
  getSwapOptions,
  pauseTask,
  recordPracticeAttempt,
  regenerateTodayPlan,
  skipTask,
  startTask,
} from "@/lib/plan-service";
import type { Outcome } from "@/lib/mastery";

function refresh() {
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/progress");
  revalidatePath("/patterns");
  revalidatePath("/review");
}

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export async function regeneratePlanAction(): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await regenerateTodayPlan(user.id);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not regenerate the plan" };
  }
}

/** Swap alternatives, hydrated with titles and topic names for display. */
export async function swapOptionsDetailedAction(
  planId: string,
  taskId: string,
  targetCategories?: string[],
  mode?: "similar" | "easier" | "harder" | "shorter",
) {
  try {
    const user = await requireUser();
    const result = await getSwapOptions(user.id, planId, taskId, targetCategories, mode);
    const ids = result.candidates.map((c) => c.question.id);
    const details = await prisma.question.findMany({
      where: { id: { in: ids } },
      include: { topic: true, source: true, companies: { include: { company: true } } },
    });
    const byId = new Map(details.map((d) => [d.id, d]));

    return {
      ok: true as const,
      data: {
        headroomMinutes: result.headroomMinutes,
        candidates: result.candidates.map((c) => {
          const d = byId.get(c.question.id);
          return {
            id: c.question.id,
            title: d?.title ?? c.question.id,
            category: c.question.category,
            topicName: d?.topic.name ?? c.question.topic,
            pattern: c.question.pattern,
            difficulty: c.question.difficulty,
            estimatedMinutes: c.question.estimatedMinutes,
            sourceName: d?.source?.name ?? null,
            companies: d?.companies.map((x) => x.company.name) ?? [],
            priority: c.priority,
            similarity: c.similarity,
            reason: c.reason,
          };
        }),
      },
    };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Could not load alternatives" };
  }
}

export async function applySwapAction(
  planId: string,
  taskId: string,
  questionId: string,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await applySwap(user.id, planId, taskId, questionId);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Swap failed" };
  }
}

export async function startTaskAction(taskId: string): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await startTask(user.id, taskId);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not start the task" };
  }
}

/**
 * Solve time is read from the server-side clock inside completeTask, not passed
 * in from the browser — so a reload cannot lose it and a client cannot fake it.
 */
export async function completeTaskAction(
  taskId: string,
  outcome: Outcome,
  graded?: { verified: boolean; submission?: string },
): Promise<ActionResult<{ mastery: number; overran: boolean }>> {
  try {
    const user = await requireUser();
    const { progress, overran } = await completeTask(user.id, taskId, outcome, graded);
    refresh();
    return { ok: true, data: { mastery: progress.masteryScore, overran } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not record the attempt" };
  }
}

export async function pauseTaskAction(taskId: string): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await pauseTask(user.id, taskId);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not pause the timer" };
  }
}

export async function skipTaskAction(taskId: string): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await skipTask(user.id, taskId);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not skip the task" };
  }
}

export type SettingsInput = {
  dailyMinutes: number;
  difficultyMode: string;
  targetRole: string;
  targetCompanies: string[];
};

export async function saveSettingsAction(input: SettingsInput): Promise<ActionResult> {
  try {
    const allowedMinutes = [90, 120, 150, 180];
    if (!allowedMinutes.includes(input.dailyMinutes)) {
      return { ok: false, error: "Daily study time must be 90, 120, 150 or 180 minutes." };
    }
    const user = await requireUser();
    await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        dailyMinutes: input.dailyMinutes,
        difficultyMode: input.difficultyMode,
        targetRole: input.targetRole,
        targetCompanies: JSON.stringify(input.targetCompanies),
      },
    });
    revalidatePath("/settings");
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save settings" };
  }
}

export async function resetProgressAction(): Promise<ActionResult> {
  try {
    const user = await requireUser();
    // Scoped to the caller: resetting your own progress must never touch anyone else's.
    await prisma.$transaction([
      prisma.attempt.deleteMany({ where: { userId: user.id } }),
      prisma.dailyTask.deleteMany({ where: { plan: { userId: user.id } } }),
      prisma.dailyPlan.deleteMany({ where: { userId: user.id } }),
      prisma.userProgress.deleteMany({ where: { userId: user.id } }),
    ]);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not reset progress" };
  }
}

/**
 * Log an attempt made from a question's own page, outside the daily plan.
 * This is what makes practising a probability/statistics/guesstimate question
 * actually move mastery instead of silently doing nothing.
 */
export async function recordPracticeAttemptAction(
  questionId: string,
  outcome: Outcome,
  seconds: number,
  graded?: { verified: boolean; submission?: string },
): Promise<ActionResult<{ mastery: number }>> {
  try {
    const user = await requireUser();
    const { progress } = await recordPracticeAttempt(user.id, questionId, outcome, seconds, graded);
    refresh();
    revalidatePath(`/question/${questionId}`);
    return { ok: true, data: { mastery: progress.masteryScore } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not record the attempt" };
  }
}
