import { describe, expect, it } from "vitest";
import { gradeSql, ordersMatter } from "../src/lib/verify/sql";
import { applyAttempt, EMPTY_PROGRESS } from "../src/lib/mastery";
import { gradeNumeric, parseAnswer } from "../src/lib/verify/numeric";
import { runUserQuery } from "../src/lib/practice-db";
import { resolveAnswerKeys, type AnswerSpec } from "../src/data/answers";
import { ALL_QUESTIONS } from "../src/data";
import { auditAnswerKeys } from "../scripts/audit-answers";

const ANSWER_KEYS = resolveAnswerKeys(ALL_QUESTIONS).byId as Record<string, AnswerSpec>;
import { SQL_QUESTIONS } from "../src/data/sql";

describe("practice database", () => {
  it("has data in every core table", async () => {
    for (const t of ["users", "orders", "order_items", "products", "events", "employees", "subscriptions"]) {
      const res = await runUserQuery(`SELECT COUNT(*) AS n FROM ${t}`);
      expect(res.ok, t).toBe(true);
      if (res.ok) expect(Number(res.rows[0][0]), `${t} is empty`).toBeGreaterThan(0);
    }
  }, 60_000); // first call boots and seeds a WASM Postgres

  it("refuses to mutate", async () => {
    const res = await runUserQuery("DELETE FROM orders");
    expect(res.ok).toBe(false);
  });

  it("refuses DDL", async () => {
    const res = await runUserQuery("DROP TABLE orders");
    expect(res.ok).toBe(false);
  });

  it("survives a failed query and keeps working", async () => {
    await runUserQuery("SELECT * FROM does_not_exist");
    const res = await runUserQuery("SELECT COUNT(*) FROM users");
    expect(res.ok).toBe(true);
  });
});

describe("SQL grading", () => {
  it("accepts a query written differently from the reference", async () => {
    // Reference uses NOT EXISTS; candidate uses a LEFT JOIN anti-join.
    const reference = `SELECT p.product_id FROM products p
       WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id)`;
    const candidate = `SELECT p.product_id FROM products p
       LEFT JOIN order_items oi ON oi.product_id = p.product_id
       WHERE oi.order_item_id IS NULL`;
    const grade = await gradeSql(candidate, reference);
    expect(grade.correct).toBe(true);
  });

  it("rejects a query returning the wrong rows", async () => {
    const reference = "SELECT user_id FROM users WHERE country = 'India'";
    const candidate = "SELECT user_id FROM users WHERE country = 'Germany'";
    const grade = await gradeSql(candidate, reference);
    expect(grade.correct).toBe(false);
  });

  it("reports a column-count mismatch specifically", async () => {
    const grade = await gradeSql(
      "SELECT user_id, name FROM users LIMIT 5",
      "SELECT user_id FROM users LIMIT 5",
    );
    expect(grade.correct).toBe(false);
    expect(grade.feedback).toMatch(/column/i);
  });

  it("flags right-rows-wrong-order when the reference is ordered", async () => {
    const reference = "SELECT user_id FROM users ORDER BY user_id ASC LIMIT 20";
    const candidate = "SELECT user_id FROM users ORDER BY user_id DESC LIMIT 20";
    const grade = await gradeSql(candidate, reference);
    // Different rows entirely (top 20 asc vs desc), so this must simply fail.
    expect(grade.correct).toBe(false);
  });

  it("ignores row order when the reference has none", async () => {
    const reference = "SELECT country FROM users";
    const candidate = "SELECT country FROM users ORDER BY country";
    const grade = await gradeSql(candidate, reference);
    expect(grade.correct).toBe(true);
  });

  it("surfaces a syntax error as feedback, not a crash", async () => {
    const grade = await gradeSql("SELCT 1", "SELECT 1");
    expect(grade.correct).toBe(false);
    expect(grade.feedback.length).toBeGreaterThan(0);
  });

  it("detects a top-level ORDER BY but not a windowed one", () => {
    expect(ordersMatter("SELECT a FROM t ORDER BY a")).toBe(true);
    expect(ordersMatter("SELECT ROW_NUMBER() OVER (ORDER BY a) FROM t")).toBe(false);
  });

  it("grades every sql-verified question as correct against its own reference", async () => {
    const graded = SQL_QUESTIONS.filter((q) => q.solution);
    let checked = 0;
    for (const q of graded) {
      const res = await runUserQuery(q.solution!);
      if (!res.ok || res.rowCount === 0) continue; // not an sql-graded question
      const grade = await gradeSql(q.solution!, q.solution!);
      expect(grade.correct, `${q.id} ${q.title}`).toBe(true);
      checked++;
    }
    expect(checked).toBeGreaterThan(70);
  }, 120_000);
});

describe("numeric answer parsing", () => {
  const cases: [string, number | null][] = [
    ["0.167", 0.167],
    ["1/6", 1 / 6],
    ["16.7%", 0.167],
    ["  2.5 million ", 2.5e6],
    ["2.5m", 2.5e6],
    ["5,040", 5040],
    ["$51.25", 51.25],
    ["80 crore", 80e7],
    ["3 lakh", 3e5],
    ["5 x 10^9", 5e9],
    ["5e9", 5e9],
    ["e^-2", Math.exp(-2)],
    ["-3/4", -0.75],
    ["", null],
    ["not a number at all here", null],
  ];

  for (const [input, expected] of cases) {
    it(`parses ${JSON.stringify(input)}`, () => {
      const got = parseAnswer(input);
      if (expected === null) expect(got).toBeNull();
      else expect(got).toBeCloseTo(expected, 6);
    });
  }
});

describe("numeric grading", () => {
  const sixth = ANSWER_KEYS["prob-001"];

  it("accepts equivalent forms of the same value", () => {
    for (const form of ["1/6", "0.1667", "16.67%", "0.166666"]) {
      expect(gradeNumeric(form, sixth).correct, form).toBe(true);
    }
  });

  it("rejects a wrong value", () => {
    expect(gradeNumeric("0.5", sixth).correct).toBe(false);
  });

  it("calls out a proportion/percentage scale error", () => {
    const g = gradeNumeric("16.7", sixth); // meant 16.7%, typed as a bare number
    expect(g.correct).toBe(false);
    expect(g.feedback).toMatch(/scale/i);
  });

  it("grades guesstimates on order of magnitude", () => {
    const coffee = ANSWER_KEYS["gs-007"]; // 2.5M cups
    expect(gradeNumeric("2.5 million", coffee).correct).toBe(true);
    expect(gradeNumeric("1.5 million", coffee).correct).toBe(true); // within 3x
    expect(gradeNumeric("6 million", coffee).correct).toBe(true);
    expect(gradeNumeric("50 million", coffee).correct).toBe(false); // 20x too high
  });

  it("rejects guesstimates that are far too SMALL", () => {
    // Regression: a relative tolerance saturates at 1 for under-estimates, so
    // any tolerance >= 1 silently accepted answers approaching zero.
    for (const [id, tiny] of [
      ["gs-001", "999999"], // key is 5 billion
      ["gs-007", "100"], // key is 2.5 million
      ["gs-018", "5"], // key is 1.3 billion
    ] as const) {
      const g = gradeNumeric(tiny, ANSWER_KEYS[id]);
      expect(g.correct, `${id} accepted ${tiny}`).toBe(false);
    }
  });

  it("accepts the edges of the order-of-magnitude band and rejects just outside", () => {
    const spec = ANSWER_KEYS["gs-007"]; // 2.5M, factor 3
    expect(gradeNumeric(String(2.5e6 * 2.9), spec).correct).toBe(true);
    expect(gradeNumeric(String(2.5e6 / 2.9), spec).correct).toBe(true);
    expect(gradeNumeric(String(2.5e6 * 3.2), spec).correct).toBe(false);
    expect(gradeNumeric(String(2.5e6 / 3.2), spec).correct).toBe(false);
  });

  it("never reveals the expected value when the input is unparseable", () => {
    const g = gradeNumeric("no idea", sixth);
    expect(g.expected).toBeUndefined();
  });

  it("has a sane answer key: every entry parses to itself", () => {
    for (const [id, spec] of Object.entries(ANSWER_KEYS) as [string, AnswerSpec][]) {
      const g = gradeNumeric(String(spec.value), spec);
      expect(g.correct, `${id} does not accept its own value`).toBe(true);
    }
  });
});

describe("guesstimate feedback quality", () => {
  it("does not blame a percent/proportion mix-up on order-of-magnitude questions", () => {
    // 12 crore against a 5 billion key is simply 40x too small, not a scale error.
    const g = gradeNumeric("12 crore", ANSWER_KEYS["gs-001"]);
    expect(g.correct).toBe(false);
    expect(g.feedback).not.toMatch(/percentage|proportion/i);
    expect(g.feedback).toMatch(/off by about/i);
  });

  it("still diagnoses percent/proportion confusion on exact questions", () => {
    const g = gradeNumeric("16.7", ANSWER_KEYS["prob-001"]);
    expect(g.feedback).toMatch(/scale/i);
  });
});


describe("answer keys point at the right questions", () => {
  const audit = auditAnswerKeys();

  it("every key title resolves to exactly one question", () => {
    expect(audit.unmatched).toEqual([]);
  });

  it("every expected value appears in that question's own solution", () => {
    // Regression: the first version of answers.ts was keyed by question id and
    // 39 of 70 keys landed on the wrong question, so correct answers were
    // marked wrong and some questions became unanswerable.
    const detail = audit.misaligned
      .map((m) => `${m.id} "${m.title}" expects ${m.expected}`)
      .join("; ");
    expect(detail).toBe("");
    expect(audit.aligned).toBe(audit.total);
  });

  it("every key states what quantity to enter", () => {
    for (const [id, spec] of Object.entries(ANSWER_KEYS) as [string, AnswerSpec][]) {
      expect(spec.ask, `${id} has no ask label`).toBeTruthy();
      expect(spec.ask.trim().length, `${id} ask label is too short`).toBeGreaterThanOrEqual(5);
    }
  });
});

describe("untimed attempts are not scored on speed", () => {
  // Regression: practice from a question page recorded "time since the tab
  // opened" as solve time, which handed out a speed bonus for answering from an
  // already-open page and an overrun penalty for thinking with the tab up.
  const base = { outcome: "independent" as const, estimatedMinutes: 15, verified: true };

  it("gives no speed bonus to an untimed fast answer", () => {
    const timed = applyAttempt(EMPTY_PROGRESS, { ...base, seconds: 12 });
    const untimed = applyAttempt(EMPTY_PROGRESS, { ...base, seconds: 0, timed: false });
    expect(timed.masteryScore).toBeGreaterThan(untimed.masteryScore);
    expect(timed.status).toBe("solved_quickly");
    expect(untimed.status).toBe("solved");
  });

  it("gives no overrun penalty to an untimed slow answer", () => {
    const slow = applyAttempt(EMPTY_PROGRESS, { ...base, seconds: 60 * 60 });
    const untimed = applyAttempt(EMPTY_PROGRESS, { ...base, seconds: 0, timed: false });
    expect(slow.timesOverrun).toBe(1);
    expect(untimed.timesOverrun).toBe(0);
    expect(untimed.masteryScore).toBeGreaterThan(slow.masteryScore);
  });

  it("adds no study time for an untimed attempt", () => {
    const untimed = applyAttempt(EMPTY_PROGRESS, { ...base, seconds: 0, timed: false });
    expect(untimed.totalSeconds).toBe(0);
  });

  it("still scores a timed attempt on speed", () => {
    const fast = applyAttempt(EMPTY_PROGRESS, { ...base, seconds: 60 });
    const slow = applyAttempt(EMPTY_PROGRESS, { ...base, seconds: 14 * 60 });
    expect(fast.masteryScore).toBeGreaterThan(slow.masteryScore);
  });
});
