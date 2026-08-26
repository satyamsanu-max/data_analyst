import { prisma } from "./db";

/**
 * Database-backed fixed-window rate limiting.
 *
 * In-memory counters are useless here: a serverless deployment runs many
 * instances, each with its own memory, so an attacker gets N times the budget
 * and every cold start wipes the count.
 *
 * Fixed windows can allow up to 2x the limit across a boundary. That is an
 * acceptable trade for password guessing, where the goal is to turn thousands
 * of attempts per minute into a handful.
 */

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

export type LimitRule = { limit: number; windowSeconds: number };

/** Failed sign-ins for one email address. */
export const SIGNIN_EMAIL: LimitRule = { limit: 8, windowSeconds: 15 * 60 };
/** Failed sign-ins from one IP, to catch spraying across many addresses. */
export const SIGNIN_IP: LimitRule = { limit: 30, windowSeconds: 15 * 60 };
/** Password reset requests, which cost an email send. */
export const RESET_REQUEST: LimitRule = { limit: 5, windowSeconds: 60 * 60 };
/** Sign-ups from one IP. */
export const SIGNUP_IP: LimitRule = { limit: 10, windowSeconds: 60 * 60 };

/**
 * Count one event against `key`. Returns whether it is allowed.
 *
 * Call this only for events worth limiting — a FAILED sign-in, not every
 * sign-in, so normal use never approaches the limit.
 */
export async function hit(key: string, rule: LimitRule): Promise<RateLimitResult> {
  const now = new Date();
  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || existing.windowEnd <= now) {
    const windowEnd = new Date(now.getTime() + rule.windowSeconds * 1000);
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowEnd },
      update: { count: 1, windowEnd },
    });
    return { allowed: true, remaining: rule.limit - 1, retryAfter: rule.windowSeconds };
  }

  const count = existing.count + 1;
  await prisma.rateLimit.update({ where: { key }, data: { count } });

  const retryAfter = Math.max(1, Math.ceil((existing.windowEnd.getTime() - now.getTime()) / 1000));
  return { allowed: count <= rule.limit, remaining: Math.max(0, rule.limit - count), retryAfter };
}

/** Check without consuming budget. */
export async function peek(key: string, rule: LimitRule): Promise<RateLimitResult> {
  const now = new Date();
  const existing = await prisma.rateLimit.findUnique({ where: { key } });
  if (!existing || existing.windowEnd <= now) {
    return { allowed: true, remaining: rule.limit, retryAfter: 0 };
  }
  const retryAfter = Math.max(1, Math.ceil((existing.windowEnd.getTime() - now.getTime()) / 1000));
  return {
    allowed: existing.count < rule.limit,
    remaining: Math.max(0, rule.limit - existing.count),
    retryAfter,
  };
}

/** Clear a key — called after a successful sign-in so one bad day is not punished. */
export async function reset(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}

/** Housekeeping: drop windows that have already elapsed. */
export async function purgeExpiredLimits(): Promise<number> {
  const { count } = await prisma.rateLimit.deleteMany({
    where: { windowEnd: { lt: new Date() } },
  });
  return count;
}

export function describeWait(seconds: number): string {
  if (seconds < 90) return `${seconds} seconds`;
  return `${Math.ceil(seconds / 60)} minutes`;
}
