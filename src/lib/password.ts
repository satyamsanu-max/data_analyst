/**
 * Password and credential helpers.
 *
 * Deliberately free of `server-only` and of any Next import, so the same code
 * can be exercised directly by the test suite and by CLI scripts.
 */

import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const KEY_LEN = 64;

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

export { SESSION_COOKIE } from "./auth-shared";
import { SESSION_COOKIE } from "./auth-shared";
const SESSION_DAYS = 30;

// --------------------------------------------------------------- passwords

/**
 * scrypt with a per-password random salt. Node ships it, so there is no native
 * build step and no third-party dependency in the credential path.
 * Format: scrypt$<saltHex>$<hashHex>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password.normalize("NFKC"), salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const derived = await scrypt(password.normalize("NFKC"), Buffer.from(saltHex, "hex"), expected.length);
  // Constant-time compare so a wrong password cannot be found by timing.
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/** Password rules, returned as a message so the form can show it. */
export function passwordProblem(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 200) return "Password must be under 200 characters.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailProblem(email: string): string | null {
  const e = normaliseEmail(email);
  if (!e) return "Email is required.";
  if (e.length > 254) return "That email is too long.";
  // Deliberately permissive: the only real test of an address is using it.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "That does not look like an email address.";
  return null;
}
