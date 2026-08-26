"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  emailProblem,
  hashPassword,
  normaliseEmail,
  passwordProblem,
  verifyPassword,
} from "@/lib/auth";
import {
  describeWait,
  hit,
  peek,
  reset as clearLimit,
  RESET_REQUEST,
  SIGNIN_EMAIL,
  SIGNIN_IP,
  SIGNUP_IP,
} from "@/lib/rate-limit";
import {
  checkResetToken,
  consumeResetToken,
  createResetToken,
  sendResetEmail,
} from "@/lib/reset";

export type AuthState = { error?: string; notice?: string } | undefined;

/**
 * Deliberately vague on failure. Saying "no account with that email" would let
 * anyone enumerate which addresses are registered.
 */
const BAD_CREDENTIALS = "Email or password is incorrect.";

/** Best-effort client IP. Spoofable, so it supplements the per-email limit rather than replacing it. */
async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normaliseEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;

  const ip = await clientIp();
  const ipLimit = await hit(`signup-ip:${ip}`, SIGNUP_IP);
  if (!ipLimit.allowed) {
    return { error: `Too many accounts created from here. Try again in ${describeWait(ipLimit.retryAfter)}.` };
  }

  const emailErr = emailProblem(email);
  if (emailErr) return { error: emailErr };
  const pwErr = passwordProblem(password);
  if (pwErr) return { error: pwErr };
  if (name && name.length > 80) return { error: "That name is too long." };

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { error: "An account with that email already exists. Try signing in." };

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      // Give every new account its own settings row immediately, so nothing
      // downstream has to cope with a half-initialised user.
      settings: { create: {} },
    },
  });

  await createSession(user.id);
  redirect("/");
}

/** Only same-site paths, so `next` cannot be used as an open redirect. */
function safeNext(raw: unknown): string {
  const s = String(raw ?? "");
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normaliseEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (!email || !password) return { error: BAD_CREDENTIALS };

  const ip = await clientIp();
  const emailKey = `signin:${email}`;
  const ipKey = `signin-ip:${ip}`;

  // Check before spending a scrypt hash, so a locked-out attacker cannot use
  // this endpoint as a CPU sink.
  const [emailState, ipState] = await Promise.all([peek(emailKey, SIGNIN_EMAIL), peek(ipKey, SIGNIN_IP)]);
  if (!emailState.allowed || !ipState.allowed) {
    const wait = Math.max(emailState.retryAfter, ipState.retryAfter);
    return { error: `Too many failed attempts. Try again in ${describeWait(wait)}.` };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Hash even when the account is missing, so a wrong email and a wrong
  // password take the same amount of time.
  const hash = user?.passwordHash ?? "scrypt$00$00";
  const ok = await verifyPassword(password, hash);

  if (!user || !ok) {
    // Only FAILURES consume budget, so ordinary use never nears the limit.
    const [afterEmail] = await Promise.all([hit(emailKey, SIGNIN_EMAIL), hit(ipKey, SIGNIN_IP)]);
    if (!afterEmail.allowed) {
      return { error: `Too many failed attempts. Try again in ${describeWait(afterEmail.retryAfter)}.` };
    }
    return { error: BAD_CREDENTIALS };
  }

  await Promise.all([clearLimit(emailKey), clearLimit(ipKey)]);

  // Self-heal accounts created before settings were guaranteed.
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });

  await createSession(user.id);
  redirect(next);
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/signin");
}

// ------------------------------------------------------------ password reset

/**
 * Always reports success, whether or not the address exists. Anything else
 * turns this form into an account-enumeration oracle.
 */
export async function requestResetAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normaliseEmail(String(formData.get("email") ?? ""));
  const SENT = {
    notice: "If an account exists for that address, a reset link is on its way. It expires in an hour.",
  };

  if (emailProblem(email)) return { error: "That does not look like an email address." };

  const ip = await clientIp();
  const limit = await hit(`reset:${email}|${ip}`, RESET_REQUEST);
  if (!limit.allowed) {
    return { error: `Too many reset requests. Try again in ${describeWait(limit.retryAfter)}.` };
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
  if (user) {
    const token = await createResetToken(user.id);
    await sendResetEmail(user.email, token);
  }

  return SENT;
}

export async function completeResetAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const pwErr = passwordProblem(password);
  if (pwErr) return { error: pwErr };
  if (password !== confirm) return { error: "Those passwords do not match." };

  const check = await checkResetToken(token);
  if (!check.valid) return { error: check.reason };

  await consumeResetToken(check.tokenId, check.userId, await hashPassword(password));

  // Signing them in here would be convenient but wrong: proving control of the
  // inbox is not the same as proving they know the new password.
  redirect("/signin?reset=1");
}
