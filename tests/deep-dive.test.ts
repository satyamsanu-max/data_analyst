import { describe, it, expect } from "vitest";
import { ALL_DEEP_DIVE, validateDeepDive, contentReport } from "../src/data/deep-dive";
import { ATTRIBUTABLE, SECTION_BY_SLUG, SECTIONS } from "../src/data/deep-dive/types";
import { ALL_QUESTIONS, validateBank } from "../src/data";
import { CATEGORIES, CATEGORY_CAPS } from "../src/data/types";

/**
 * These tests do two jobs.
 *
 * The first half asserts the content is honest and complete — every question
 * has a hint, an answer and an explanation, no company is attributed without a
 * source that could name one, and nothing claims to be a real interview without
 * evidence.
 *
 * The second half is the regression guarantee: it asserts that adding Deep Dive
 * changed nothing about the Data Analyst bank that feeds Daily Practice. That
 * is the promise the whole design rests on, so it is worth testing directly
 * rather than trusting that separate tables are enough.
 */

describe("Deep Dive content integrity", () => {
  it("passes its own validator with no errors", () => {
    const { ok, errors } = validateDeepDive(ALL_DEEP_DIVE);
    expect(errors).toEqual([]);
    expect(ok).toBe(true);
  });

  it("gives every answerable item a hint, an interview answer and a detailed explanation", () => {
    const answerable = ALL_DEEP_DIVE.filter(
      (i) => i.contentType !== "CONCEPT" && i.contentType !== "INDUSTRY_PRIMER",
    );
    expect(answerable.length).toBeGreaterThan(100);
    for (const i of answerable) {
      expect(i.question?.trim(), `${i.id} question`).toBeTruthy();
      expect(i.hint?.trim(), `${i.id} hint`).toBeTruthy();
      expect(i.interviewAnswer?.trim(), `${i.id} interviewAnswer`).toBeTruthy();
      expect(i.detailedExplanation?.trim(), `${i.id} detailedExplanation`).toBeTruthy();
    }
  });

  it("gives every concept an explanation", () => {
    const concepts = ALL_DEEP_DIVE.filter(
      (i) => i.contentType === "CONCEPT" || i.contentType === "INDUSTRY_PRIMER",
    );
    for (const i of concepts) {
      expect(i.explanation?.trim(), `${i.id} explanation`).toBeTruthy();
    }
  });

  it("cites at least one source for every item", () => {
    for (const i of ALL_DEEP_DIVE) {
      expect(i.sources.length, `${i.id} sources`).toBeGreaterThan(0);
    }
  });

  // ---------------------------------------------------------------- honesty
  it("never attributes a company on a record that cannot support one", () => {
    for (const i of ALL_DEEP_DIVE) {
      if (i.company || i.role) {
        expect(
          ATTRIBUTABLE.includes(i.sourceType),
          `${i.id} attributes "${i.company ?? i.role}" on a ${i.sourceType} record`,
        ).toBe(true);
      }
    }
  });

  it("never labels something a real interview without an interview-report source", () => {
    const real = ALL_DEEP_DIVE.filter((i) => i.sourceType === "REAL_INTERVIEW");
    for (const i of real) {
      const backed = i.sources.some((s) =>
        ["GLASSDOOR", "INTERVIEW_REPORT", "GITHUB", "PUBLIC_ASSESSMENT"].includes(s.kind),
      );
      expect(backed, `${i.id} claims REAL_INTERVIEW with no report behind it`).toBe(true);
    }
  });

  it("backs every casebook case with an actual casebook citation carrying a page", () => {
    const cases = ALL_DEEP_DIVE.filter((i) => i.sourceType === "CASEBOOK_INTERVIEW_CASE");
    expect(cases.length).toBeGreaterThan(20);
    for (const i of cases) {
      const cb = i.sources.find((s) => s.kind === "CASEBOOK");
      expect(cb, `${i.id} has no casebook citation`).toBeTruthy();
      expect(typeof cb!.page, `${i.id} casebook citation has no page`).toBe("number");
    }
  });

  it("has no duplicate ids and no duplicate questions", () => {
    const ids = ALL_DEEP_DIVE.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);

    const normalise = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
    const questions = ALL_DEEP_DIVE.filter((i) => i.question).map((i) => normalise(i.question!));
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("resolves every related id and every section slug", () => {
    const ids = new Set(ALL_DEEP_DIVE.map((i) => i.id));
    for (const i of ALL_DEEP_DIVE) {
      for (const r of i.related ?? []) {
        expect(ids.has(r), `${i.id} → ${r}`).toBe(true);
      }
      expect(SECTION_BY_SLUG[i.section], `${i.id} section ${i.section}`).toBeTruthy();
      expect(SECTION_BY_SLUG[i.section].domain).toBe(i.domain);
    }
  });

  it("covers every declared section with content", () => {
    const bySection = new Set(ALL_DEEP_DIVE.map((i) => i.section));
    for (const s of SECTIONS) {
      expect(bySection.has(s.slug), `section "${s.slug}" has no content`).toBe(true);
    }
  });

  it("gives every Data section both concepts and questions", () => {
    for (const slug of ["excel", "power-bi", "tableau", "root-cause"]) {
      const items = ALL_DEEP_DIVE.filter((i) => i.section === slug);
      const concepts = items.filter((i) => i.contentType === "CONCEPT");
      const questions = items.filter((i) => i.contentType === "QUESTION");
      expect(concepts.length, `${slug} concepts`).toBeGreaterThan(5);
      expect(questions.length, `${slug} questions`).toBeGreaterThan(10);
    }
  });

  it("reports counts that match the item list", () => {
    const rep = contentReport(ALL_DEEP_DIVE);
    expect(rep.total).toBe(ALL_DEEP_DIVE.length);
    const summed = Object.values(rep.bySourceType).reduce((a, b) => a + b, 0);
    expect(summed).toBe(ALL_DEEP_DIVE.length);
  });
});

/**
 * The isolation guarantee.
 *
 * Deep Dive lives in its own tables specifically because
 * `loadSchedulerQuestions()` reads the entire `Question` table with no WHERE
 * clause — anything added there would become a Daily Practice candidate. These
 * tests assert the separation at the data layer, where it can be checked
 * without a database.
 */
describe("Deep Dive is isolated from Daily Practice", () => {
  it("declares every item as Deep Dive and never as Daily Practice eligible", () => {
    for (const i of ALL_DEEP_DIVE) {
      // The seeder writes isDeepDive: true / isDailyPracticeEligible: false for
      // every row. Nothing in the content set may carry an opposing intent.
      expect((i as { isDailyPracticeEligible?: boolean }).isDailyPracticeEligible ?? false).toBe(
        false,
      );
    }
  });

  it("shares no ids with the Data Analyst question bank", () => {
    const bankIds = new Set(ALL_QUESTIONS.map((q) => q.id));
    for (const i of ALL_DEEP_DIVE) {
      expect(bankIds.has(i.id), `${i.id} collides with a Data Analyst question id`).toBe(false);
    }
  });

  it("leaves the Data Analyst bank unchanged in size and composition", () => {
    // If a Deep Dive change ever leaked into src/data/*, these numbers move.
    expect(ALL_QUESTIONS.length).toBe(588);
    const { ok, counts } = validateBank();
    expect(ok).toBe(true);
    for (const cat of CATEGORIES) {
      expect(counts[cat] ?? 0).toBeLessThanOrEqual(CATEGORY_CAPS[cat]);
    }
  });

  it("does not add any category to the Daily Practice category list", () => {
    // The scheduler's slot composition is driven by CATEGORIES. Deep Dive
    // domains must never appear here.
    expect([...CATEGORIES]).toEqual([
      "DSA",
      "SQL",
      "Probability",
      "Statistics",
      "ML",
      "Python",
      "Guesstimate",
    ]);
  });

  it("only cross-references the bank through existingQuestionId, never by copying", () => {
    const bankIds = new Set(ALL_QUESTIONS.map((q) => q.id));
    for (const i of ALL_DEEP_DIVE) {
      if (i.existingQuestionId) {
        expect(
          bankIds.has(i.existingQuestionId),
          `${i.id} points at unknown question ${i.existingQuestionId}`,
        ).toBe(true);
      }
    }
  });
});
