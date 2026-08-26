import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "./db";
import { SESSION_COOKIE } from "./auth-shared";

export { SESSION_COOKIE } from "./auth-shared";
export {
  hashPassword,
  verifyPassword,
  passwordProblem,
  emailProblem,
  normaliseEmail,
} from "./password";

const SESSION_DAYS = 30;

// ---------------------------------------------------------------- sessions

/** The cookie holds a random token; the database stores only its SHA-256. */
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await prisma.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  store.delete(SESSION_COOKIE);
}

export type SessionUser = { id: string; email: string; name: string | null };

/**
 * Resolve the signed-in user, or null.
 * `cache` dedupes this across a single render pass so a page with several
 * server components does not hit the database once per component.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
});

/**
 * For anything that must not run anonymously. Throws rather than returning
 * null so a missed check fails loudly instead of silently leaking another
 * user's data.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  return user;
}

/**
 * For PAGES. Sends an unauthenticated visitor to sign in instead of throwing.
 *
 * It routes via /signed-out rather than straight to /signin because the visitor
 * may be carrying a cookie that no longer resolves to a session — from a
 * password reset, an expired session, or a rebuilt database. Middleware sees
 * that cookie and bounces anyone with one away from /signin, so without the
 * cookie-clearing hop the user would ping-pong between a redirect and a crash.
 */
export async function requireUserPage(currentPath?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (user) return user;
  const q = currentPath ? `?next=${encodeURIComponent(currentPath)}` : "";
  redirect(`/signed-out${q}`);
}

/** Housekeeping: drop sessions that have already expired. */
export async function purgeExpiredSessions(): Promise<number> {
  const { count } = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
}
