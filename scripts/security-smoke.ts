/**
 * Exercises the auth hardening against the real database.
 *
 * Rate limiting and reset tokens are the kind of thing that looks right and is
 * wrong, so this checks the actual behaviour rather than the intent.
 */
import { prisma } from "../src/lib/db";
import { hashPassword, verifyPassword } from "../src/lib/password";
import { hit, peek, reset as clearLimit, SIGNIN_EMAIL } from "../src/lib/rate-limit";
import { checkResetToken, consumeResetToken, createResetToken } from "../src/lib/reset";

const EMAIL = "sec-smoke@example.com";

function check(label: string, ok: boolean) {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) throw new Error(label);
}

(async () => {
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      name: "Sec Smoke",
      passwordHash: await hashPassword("original-pass-1"),
      settings: { create: {} },
    },
  });

  // ---------------------------------------------------------- rate limiting
  console.log("Rate limiting:");
  const key = `test-signin:${EMAIL}`;
  await clearLimit(key);

  let lastAllowed = true;
  for (let i = 0; i < SIGNIN_EMAIL.limit; i++) {
    lastAllowed = (await hit(key, SIGNIN_EMAIL)).allowed;
  }
  check(`first ${SIGNIN_EMAIL.limit} failures are allowed`, lastAllowed);

  const over = await hit(key, SIGNIN_EMAIL);
  check("the next failure is blocked", !over.allowed);
  check("a retry-after is reported", over.retryAfter > 0);

  const peeked = await peek(key, SIGNIN_EMAIL);
  check("peek agrees it is blocked", !peeked.allowed);
  check("peek does not consume budget", (await peek(key, SIGNIN_EMAIL)).remaining === peeked.remaining);

  await clearLimit(key);
  check("a successful sign-in clears the counter", (await peek(key, SIGNIN_EMAIL)).allowed);

  // Windows must be per-key, or one user locks out everyone.
  const otherKey = `test-signin:someone-else@example.com`;
  await clearLimit(otherKey);
  for (let i = 0; i < SIGNIN_EMAIL.limit + 2; i++) await hit(otherKey, SIGNIN_EMAIL);
  check("locking one account does not lock another", (await peek(key, SIGNIN_EMAIL)).allowed);
  await clearLimit(otherKey);

  // ---------------------------------------------------------- reset tokens
  console.log("\nPassword reset:");
  const token = await createResetToken(user.id);

  const stored = await prisma.passwordResetToken.findFirst({ where: { userId: user.id } });
  check("the raw token is not stored", stored?.tokenHash !== token && !!stored);

  check("a valid token verifies", (await checkResetToken(token)).valid);
  check("a wrong token is rejected", !(await checkResetToken("not-a-real-token")).valid);
  check("an empty token is rejected", !(await checkResetToken("")).valid);

  // Requesting a second link must retire the first.
  const token2 = await createResetToken(user.id);
  check("issuing a new token invalidates the old one", !(await checkResetToken(token)).valid);
  check("the new token is valid", (await checkResetToken(token2)).valid);

  // A live session should not survive a reset.
  await prisma.session.create({
    data: { tokenHash: "sess-" + Math.random(), userId: user.id, expiresAt: new Date(Date.now() + 8.64e7) },
  });
  check("session exists before reset", (await prisma.session.count({ where: { userId: user.id } })) === 1);

  const check2 = await checkResetToken(token2);
  if (!check2.valid) throw new Error("token2 unexpectedly invalid");
  await consumeResetToken(check2.tokenId, user.id, await hashPassword("brand-new-pass-2"));

  const after = await prisma.user.findUnique({ where: { id: user.id } });
  check("the password actually changed", await verifyPassword("brand-new-pass-2", after!.passwordHash));
  check("the old password no longer works", !(await verifyPassword("original-pass-1", after!.passwordHash)));
  check("every session was destroyed", (await prisma.session.count({ where: { userId: user.id } })) === 0);
  check("the token cannot be reused", !(await checkResetToken(token2)).valid);

  // ---------------------------------------------------------- expiry
  console.log("\nExpiry:");
  const expiring = await createResetToken(user.id);
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { expiresAt: new Date(Date.now() - 1000) },
  });
  check("an expired token is rejected", !(await checkResetToken(expiring)).valid);

  await prisma.user.deleteMany({ where: { email: EMAIL } });
  await prisma.rateLimit.deleteMany({ where: { key: { startsWith: "test-signin:" } } });
  console.log("\nSecurity smoke test passed.");
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("\nFAILED:", e.message);
  await prisma.user.deleteMany({ where: { email: EMAIL } }).catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
