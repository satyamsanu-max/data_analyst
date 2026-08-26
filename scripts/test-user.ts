import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

/** A stable account the smoke scripts can operate as. */
export async function ensureTestUser(email = "smoke@example.com") {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.userSettings.upsert({
      where: { userId: existing.id },
      create: { userId: existing.id },
      update: {},
    });
    return existing;
  }
  return prisma.user.create({
    data: {
      email,
      name: "Smoke Test",
      passwordHash: await hashPassword("smoke-test-1"),
      settings: { create: {} },
    },
  });
}
