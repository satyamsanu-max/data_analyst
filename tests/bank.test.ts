import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS, CATEGORY_CAPS, TOPICS, validateBank, type Category } from "../src/data";

describe("question bank integrity", () => {
  const { ok, errors, counts } = validateBank();

  it("passes structural validation", () => {
    expect(errors).toEqual([]);
    expect(ok).toBe(true);
  });

  it("respects every category cap", () => {
    for (const [cat, cap] of Object.entries(CATEGORY_CAPS) as [Category, number][]) {
      expect(counts[cat] ?? 0, `${cat}`).toBeLessThanOrEqual(cap);
    }
  });

  it("has unique ids", () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every question a source and a citation", () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.source, q.id).toBeTruthy();
      expect(q.sourceUrl, q.id).toBeTruthy();
      expect(q.sourceNote, q.id).toBeTruthy();
    }
  });

  it("gives every question a usable prompt", () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.prompt, q.id).toBeTruthy();
      expect((q.prompt ?? "").length, q.id).toBeGreaterThan(20);
    }
  });

  it("provides a worked answer for every non-DSA question", () => {
    // DSA links out to the host platform for the full statement and tests;
    // everything else has to stand on its own inside this app.
    for (const q of ALL_QUESTIONS.filter((x) => x.category !== "DSA")) {
      expect(q.solution, q.id).toBeTruthy();
      expect(q.explanation, q.id).toBeTruthy();
    }
  });

  it("keeps estimated times inside the sane range", () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.estimatedMinutes, q.id).toBeGreaterThanOrEqual(10);
      expect(q.estimatedMinutes, q.id).toBeLessThanOrEqual(40);
    }
  });

  it("keeps every score normalised to 0-100", () => {
    for (const q of ALL_QUESTIONS) {
      for (const [name, v] of [
        ["frequencyScore", q.frequencyScore],
        ["patternValue", q.patternValue],
        ["conceptCoverage", q.conceptCoverage ?? 50],
      ] as const) {
        expect(v, `${q.id}.${name}`).toBeGreaterThanOrEqual(0);
        expect(v, `${q.id}.${name}`).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("DSA pattern coverage", () => {
  const dsa = ALL_QUESTIONS.filter((q) => q.category === "DSA");

  it("covers every required DSA topic", () => {
    const required = TOPICS.filter((t) => t.category === "DSA").map((t) => t.slug);
    const present = new Set(dsa.map((q) => q.topic));
    for (const slug of required) {
      expect(present.has(slug), `no questions for DSA topic "${slug}"`).toBe(true);
    }
  });

  it("gives every DSA question a named pattern", () => {
    for (const q of dsa) expect(q.pattern, q.id).toBeTruthy();
  });

  it("covers the patterns the brief calls out by name", () => {
    const patterns = new Set(dsa.map((q) => q.pattern));
    const mustHave = [
      "Kadane",
      "Prefix Sum",
      "Monotonic Stack",
      "Monotonic Deque",
      "Variable Window",
      "Fixed Window",
      "Answer-Space Binary Search",
      "Topological Sort",
      "Union Find",
      "Dijkstra",
      "Two Heaps",
      "Fast and Slow Pointers",
      "0/1 Knapsack",
      "Grid DP",
      "Trie Construction",
      "XOR Cancellation",
    ];
    for (const p of mustHave) {
      const found = [...patterns].some((x) => x?.includes(p));
      expect(found, `missing pattern "${p}"`).toBe(true);
    }
  });

  it("spreads difficulty rather than clustering on one level", () => {
    const byDiff = { Easy: 0, Medium: 0, Hard: 0 };
    for (const q of dsa) byDiff[q.difficulty]++;
    expect(byDiff.Easy).toBeGreaterThan(20);
    expect(byDiff.Medium).toBeGreaterThan(60);
    expect(byDiff.Hard).toBeGreaterThan(10);
  });
});

describe("SQL coverage", () => {
  const sql = ALL_QUESTIONS.filter((q) => q.category === "SQL");

  it("covers every SQL topic in the brief", () => {
    const required = TOPICS.filter((t) => t.category === "SQL").map((t) => t.slug);
    const present = new Set(sql.map((q) => q.topic));
    for (const slug of required) {
      expect(present.has(slug), `no SQL questions for "${slug}"`).toBe(true);
    }
  });

  it("includes the business-analytics workhorses", () => {
    const titles = sql.map((q) => q.title.toLowerCase()).join(" | ");
    for (const kw of ["retention", "funnel", "churn", "dau", "duplicate", "cohort", "lifetime value"]) {
      expect(titles.includes(kw), `missing SQL question about "${kw}"`).toBe(true);
    }
  });
});
