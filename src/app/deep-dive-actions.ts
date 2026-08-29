"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

/**
 * Deep Dive progress actions.
 *
 * These write ONLY to `DeepDiveProgress`. They never touch `UserProgress`,
 * `Attempt`, `DailyTask` or `DailyPlan`, so nothing done here can move a
 * mastery score, a streak, or the composition of a daily plan.
 */

type Status = "NOT_STARTED" | "ATTEMPTED" | "SOLVED" | "NEEDS_REVIEW";
const VALID: Status[] = ["NOT_STARTED", "ATTEMPTED", "SOLVED", "NEEDS_REVIEW"];

async function ownedContent(id: string) {
  const exists = await prisma.deepDiveContent.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new Error("Unknown Deep Dive item");
  return exists.id;
}

export async function setDeepDiveStatus(contentId: string, status: string) {
  const user = await requireUser();
  if (!VALID.includes(status as Status)) throw new Error(`Invalid status: ${status}`);
  await ownedContent(contentId);

  const now = new Date();
  const isSolved = status === "SOLVED";

  await prisma.deepDiveProgress.upsert({
    where: { userId_contentId: { userId: user.id, contentId } },
    create: {
      userId: user.id,
      contentId,
      status,
      attempts: status === "NOT_STARTED" ? 0 : 1,
      lastAttemptedAt: status === "NOT_STARTED" ? null : now,
      solvedAt: isSolved ? now : null,
    },
    update: {
      status,
      // Re-marking the same status should not inflate the attempt count, but
      // moving to a new one is a genuine new attempt.
      attempts: status === "NOT_STARTED" ? 0 : { increment: 1 },
      lastAttemptedAt: status === "NOT_STARTED" ? null : now,
      // Keep the original solve date if it was already solved.
      ...(isSolved ? {} : { solvedAt: null }),
      ...(isSolved ? { solvedAt: now } : {}),
    },
  });

  revalidatePath(`/deep-dive/content/${contentId}`);
  revalidatePath("/deep-dive");
}

export async function toggleDeepDiveBookmark(contentId: string) {
  const user = await requireUser();
  await ownedContent(contentId);

  const existing = await prisma.deepDiveProgress.findUnique({
    where: { userId_contentId: { userId: user.id, contentId } },
    select: { bookmarked: true },
  });

  await prisma.deepDiveProgress.upsert({
    where: { userId_contentId: { userId: user.id, contentId } },
    create: { userId: user.id, contentId, bookmarked: true },
    update: { bookmarked: !existing?.bookmarked },
  });

  revalidatePath(`/deep-dive/content/${contentId}`);
  revalidatePath("/deep-dive/bookmarks");
}

/**
 * Record that the answer was revealed.
 *
 * Kept separate from status so the UI can show "you have seen this one" without
 * claiming you solved it — revealing is not solving.
 */
export async function markDeepDiveRevealed(contentId: string) {
  const user = await requireUser();
  await ownedContent(contentId);

  await prisma.deepDiveProgress.upsert({
    where: { userId_contentId: { userId: user.id, contentId } },
    create: {
      userId: user.id,
      contentId,
      revealed: true,
      status: "ATTEMPTED",
      attempts: 1,
      lastAttemptedAt: new Date(),
    },
    update: { revealed: true },
  });
}
