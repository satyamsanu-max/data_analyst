"use server";

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

export type AuthState = { error?: string } | undefined;

/**
 * Deliberately vague on failure. Saying "no account with that email" would let
 * anyone enumerate which addresses are registered.
 */
const BAD_CREDENTIALS = "Email or password is incorrect.";

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normaliseEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;

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

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normaliseEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: BAD_CREDENTIALS };

  const user = await prisma.user.findUnique({ where: { email } });

  // Hash even when the account is missing, so a wrong email and a wrong
  // password take the same amount of time.
  const hash = user?.passwordHash ?? "scrypt$00$00";
  const ok = await verifyPassword(password, hash);
  if (!user || !ok) return { error: BAD_CREDENTIALS };

  // Self-heal accounts created before settings were guaranteed.
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });

  await createSession(user.id);
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/signin");
}
