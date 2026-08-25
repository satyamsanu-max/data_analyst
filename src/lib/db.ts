import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const SETTINGS_ID = "default";

export async function getSettings() {
  const existing = await prisma.userSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (existing) return existing;
  return prisma.userSettings.create({ data: { id: SETTINGS_ID } });
}
