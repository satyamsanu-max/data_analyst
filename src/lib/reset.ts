import { createHash, randomBytes } from "node:crypto";
import { prisma } from "./db";

/**
 * Password reset tokens.
 *
 * Same discipline as sessions: the link carries a random token, the database
 * keeps only its SHA-256. A database leak therefore does not let an attacker
 * reset anyone's password.
 *
 * Tokens are single-use and short-lived, and requesting one invalidates any
 * outstanding token for that account.
 */

const TOKEN_TTL_MINUTES = 60;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createResetToken(userId: string): Promise<string> {
  // A new request supersedes any earlier one, so an old email cannot be replayed.
  await prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } });

  const token = randomBytes(32).toString("base64url");
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000),
    },
  });
  return token;
}

export type ResetTokenCheck =
  | { valid: true; userId: string; tokenId: string }
  | { valid: false; reason: string };

export async function checkResetToken(token: string): Promise<ResetTokenCheck> {
  if (!token) return { valid: false, reason: "That reset link is missing its token." };

  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!row) return { valid: false, reason: "That reset link is not valid." };
  if (row.usedAt) return { valid: false, reason: "That reset link has already been used." };
  if (row.expiresAt.getTime() < Date.now()) {
    return { valid: false, reason: "That reset link has expired. Request a new one." };
  }
  return { valid: true, userId: row.userId, tokenId: row.id };
}

/**
 * Consume the token and set the new password.
 *
 * Every existing session for the account is destroyed: if the reset was
 * prompted by a compromise, leaving the attacker signed in would defeat it.
 */
export async function consumeResetToken(tokenId: string, userId: string, passwordHash: string) {
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
    prisma.session.deleteMany({ where: { userId } }),
  ]);
}

export async function purgeExpiredResetTokens(): Promise<number> {
  const { count } = await prisma.passwordResetToken.deleteMany({
    where: { OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }] },
  });
  return count;
}

// ------------------------------------------------------------------ email

export function resetUrl(token: string): string {
  const base =
    process.env.APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${base.replace(/\/$/, "")}/reset?token=${encodeURIComponent(token)}`;
}

/**
 * Send the reset link.
 *
 * With RESEND_API_KEY set, this emails the user. Without it — local dev, or a
 * deployment that has not configured mail yet — the link is logged to the
 * server console instead of failing, so the flow stays testable. It never
 * returns the link to the browser, which would let anyone reset any account.
 */
export async function sendResetEmail(email: string, token: string): Promise<void> {
  const url = resetUrl(token);
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESET_EMAIL_FROM ?? "LYFF <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      `[reset] RESEND_API_KEY is not set, so no email was sent.\n[reset] Link for ${email}: ${url}`,
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your LYFF password",
      text: [
        "Someone asked to reset the password for this account.",
        "",
        `Open this link within ${TOKEN_TTL_MINUTES} minutes to choose a new one:`,
        url,
        "",
        "If that was not you, ignore this email — nothing has changed.",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    // Log the provider's reason, but never surface it to the caller: the
    // response must look identical whether or not the address exists.
    console.error(`[reset] Resend rejected the send: ${res.status} ${await res.text()}`);
  }
}
