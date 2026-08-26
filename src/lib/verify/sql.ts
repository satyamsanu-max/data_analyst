/**
 * SQL grading.
 *
 * Runs the candidate query and the reference solution against the same practice
 * database and compares result sets. This is real verification — not a string
 * match against the reference, so any correct query passes regardless of how it
 * is written.
 */

import { runUserQuery, type QueryFailure, type QueryResult } from "../practice-db";

export type SqlGrade = {
  correct: boolean;
  /** Human-readable reason, shown to the user. */
  feedback: string;
  user?: QueryResult;
  expected?: QueryResult;
  /** True when the mismatch is only row/column ordering, not the data itself. */
  nearMiss?: boolean;
};

/** Does the outermost query specify an order? If so, row order is graded. */
export function ordersMatter(sql: string): boolean {
  // Strip string literals so an ORDER BY inside quotes does not count.
  const bare = sql.replace(/'[^']*'/g, "''");
  const lastOrderBy = bare.toUpperCase().lastIndexOf("ORDER BY");
  if (lastOrderBy === -1) return false;
  // An ORDER BY belonging to a window function is closed by a paren before any
  // further clause; a top-level one is not.
  const after = bare.slice(lastOrderBy);
  const openParens = (after.match(/\(/g) ?? []).length;
  const closeParens = (after.match(/\)/g) ?? []).length;
  return closeParens <= openParens;
}

const NUM_EPS = 1e-6;

function canon(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (v instanceof Date) return v.toISOString();

  // Postgres returns NUMERIC as a string to preserve precision; compare numerically.
  const asNum = typeof v === "number" ? v : Number(v);
  if (typeof v !== "object" && !Number.isNaN(asNum) && String(v).trim() !== "") {
    // Round to absorb float noise between equivalent formulations.
    return String(Math.round(asNum / NUM_EPS) * NUM_EPS);
  }
  return String(v).trim();
}

const rowKey = (row: unknown[]) => row.map(canon).join("");

function multisetEqual(a: unknown[][], b: unknown[][]): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<string, number>();
  for (const r of a) {
    const k = rowKey(r);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  for (const r of b) {
    const k = rowKey(r);
    const n = counts.get(k);
    if (!n) return false;
    counts.set(k, n - 1);
  }
  return [...counts.values()].every((n) => n === 0);
}

function orderedEqual(a: unknown[][], b: unknown[][]): boolean {
  if (a.length !== b.length) return false;
  return a.every((row, i) => rowKey(row) === rowKey(b[i]));
}

/** Same values, but the columns come back in a different order. */
function sameColumnsReordered(user: QueryResult, expected: QueryResult): boolean {
  if (user.columns.length !== expected.columns.length) return false;
  const transpose = (r: QueryResult) =>
    r.columns.map((_, i) => r.allRows.map((row) => canon(row[i])).join(""));
  const a = transpose(user).sort();
  const b = transpose(expected).sort();
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export async function gradeSql(userSql: string, referenceSql: string): Promise<SqlGrade> {
  const user = await runUserQuery(userSql);
  if (!user.ok) {
    return { correct: false, feedback: sqlErrorHint((user as QueryFailure).error) };
  }

  const expected = await runUserQuery(referenceSql);
  if (!expected.ok) {
    // Our own reference failed — never blame the candidate for that.
    return {
      correct: false,
      feedback:
        "This question could not be graded automatically (the stored reference query failed to run). Grade yourself with the review buttons.",
      user,
    };
  }

  if (user.columns.length !== expected.columns.length) {
    return {
      correct: false,
      feedback: `Expected ${expected.columns.length} column${expected.columns.length === 1 ? "" : "s"} (${expected.columns.join(", ")}) but your query returned ${user.columns.length}.`,
      user,
      expected,
    };
  }

  if (user.rowCount !== expected.rowCount) {
    return {
      correct: false,
      feedback: `Expected ${expected.rowCount} row${expected.rowCount === 1 ? "" : "s"}, your query returned ${user.rowCount}.`,
      user,
      expected,
    };
  }

  // Compare the COMPLETE result sets. Using the display-truncated `rows` would
  // wrongly fail any correct query returning more rows than the display cap.
  const ordered = ordersMatter(referenceSql);
  const match = ordered
    ? orderedEqual(user.allRows, expected.allRows)
    : multisetEqual(user.allRows, expected.allRows);

  if (match) {
    return {
      correct: true,
      feedback: ordered
        ? "Correct — rows match the expected result in the required order."
        : "Correct — result set matches.",
      user,
      expected,
    };
  }

  if (ordered && multisetEqual(user.allRows, expected.allRows)) {
    return {
      correct: false,
      nearMiss: true,
      feedback: "Right rows, wrong order — this question needs an explicit ORDER BY to match.",
      user,
      expected,
    };
  }

  if (sameColumnsReordered(user, expected)) {
    return {
      correct: false,
      nearMiss: true,
      feedback: "All the right values, but your columns come back in a different order than expected.",
      user,
      expected,
    };
  }

  return {
    correct: false,
    feedback:
      "Row count matches but the values differ. Compare your output against the expected result below.",
    user,
    expected,
  };
}

/** Turn raw Postgres errors into something actionable. */
export function sqlErrorHint(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("read-only") || m.includes("read only")) {
    return "The practice database is read-only — only SELECT queries can run here.";
  }
  if (m.includes("statement timeout") || m.includes("canceling statement")) {
    return "Query timed out after 5 seconds. Check for an accidental cross join.";
  }
  if (m.includes("does not exist") && m.includes("column")) {
    return `${message}\n\nCheck the schema panel — column names must match exactly.`;
  }
  if (m.includes("does not exist") && m.includes("relation")) {
    return `${message}\n\nThat table is not in the practice database. See the schema panel for what is available.`;
  }
  if (m.includes("syntax error")) {
    return `${message}\n\nThis is a real Postgres instance, so Postgres syntax applies.`;
  }
  if (m.includes("must appear in the group by")) {
    return `${message}\n\nEvery selected column must either be aggregated or listed in GROUP BY.`;
  }
  return message;
}
