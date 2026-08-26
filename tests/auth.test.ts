import { describe, expect, it } from "vitest";
import {
  emailProblem,
  hashPassword,
  normaliseEmail,
  passwordProblem,
  verifyPassword,
} from "../src/lib/password";

describe("password hashing", () => {
  it("never stores the password itself", async () => {
    const hash = await hashPassword("correct horse battery 1");
    expect(hash).not.toContain("correct horse battery 1");
    expect(hash.startsWith("scrypt$")).toBe(true);
  });

  it("accepts the right password and rejects the wrong one", async () => {
    const hash = await hashPassword("hunter2andmore");
    expect(await verifyPassword("hunter2andmore", hash)).toBe(true);
    expect(await verifyPassword("hunter2andmor", hash)).toBe(false);
    expect(await verifyPassword("", hash)).toBe(false);
  });

  it("salts, so identical passwords hash differently", async () => {
    const a = await hashPassword("samepassword1");
    const b = await hashPassword("samepassword1");
    expect(a).not.toBe(b);
    // Both still verify.
    expect(await verifyPassword("samepassword1", a)).toBe(true);
    expect(await verifyPassword("samepassword1", b)).toBe(true);
  });

  it("does not throw on a malformed stored hash", async () => {
    for (const bad of ["", "garbage", "scrypt$only-one-part", "bcrypt$aa$bb"]) {
      expect(await verifyPassword("whatever1", bad)).toBe(false);
    }
  });

  it("treats unicode-equivalent passwords as equal", async () => {
    // Composed vs decomposed form of the same string.
    const composed = "café-pass1";
    const decomposed = "café-pass1";
    const hash = await hashPassword(composed);
    expect(await verifyPassword(decomposed, hash)).toBe(true);
  });
});

describe("credential validation", () => {
  it("requires a reasonable password", () => {
    expect(passwordProblem("short1")).toMatch(/8 characters/);
    expect(passwordProblem("alllettersnodigits")).toMatch(/letter and one number/);
    expect(passwordProblem("12345678")).toMatch(/letter and one number/);
    expect(passwordProblem("goodpassword1")).toBeNull();
  });

  it("validates and normalises email", () => {
    expect(emailProblem("")).toMatch(/required/);
    expect(emailProblem("not-an-email")).toMatch(/does not look like/);
    expect(emailProblem("a@b.co")).toBeNull();
    expect(normaliseEmail("  Foo@Example.COM ")).toBe("foo@example.com");
  });

  it("normalises email so case cannot create duplicate accounts", () => {
    expect(normaliseEmail("USER@site.com")).toBe(normaliseEmail("user@SITE.com"));
  });
});
