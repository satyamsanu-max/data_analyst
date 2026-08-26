import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Settings for one account, created on first read.
 *
 * Every caller must pass a userId. There is deliberately no default — a missing
 * argument is a type error rather than a silent read of somebody else's row.
 */
export async function getSettings(userId: string) {
  const existing = await prisma.userSettings.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.userSettings.create({ data: { userId } });
}

/** Progress rows are keyed by (userId, questionId). */
export const progressKey = (userId: string, questionId: string) => ({
  userId_questionId: { userId, questionId },
});
