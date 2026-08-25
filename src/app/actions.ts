"use server";

import { revalidatePath } from "next/cache";
import { prisma, SETTINGS_ID } from "@/lib/db";
import {
  applySwap,
  completeTask,
  getSwapOptions,
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
    await regenerateTodayPlan();
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
    const result = await getSwapOptions(planId, taskId, targetCategories, mode);
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
    await applySwap(planId, taskId, questionId);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Swap failed" };
  }
}

export async function startTaskAction(taskId: string): Promise<ActionResult> {
  try {
    await startTask(taskId);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not start the task" };
  }
}

export async function completeTaskAction(
  taskId: string,
  outcome: Outcome,
  seconds: number,
): Promise<ActionResult<{ mastery: number; overran: boolean }>> {
  try {
    const { progress, overran } = await completeTask(taskId, outcome, Math.max(0, Math.round(seconds)));
    refresh();
    return { ok: true, data: { mastery: progress.masteryScore, overran } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not record the attempt" };
  }
}

export async function skipTaskAction(taskId: string): Promise<ActionResult> {
  try {
    await skipTask(taskId);
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
    await prisma.userSettings.update({
      where: { id: SETTINGS_ID },
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
    await prisma.$transaction([
      prisma.attempt.deleteMany({}),
      prisma.dailyTask.deleteMany({}),
      prisma.dailyPlan.deleteMany({}),
      prisma.userProgress.deleteMany({}),
    ]);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not reset progress" };
  }
}
