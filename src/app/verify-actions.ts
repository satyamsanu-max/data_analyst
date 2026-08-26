"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { gradeSql, sqlErrorHint } from "@/lib/verify/sql";
import { gradeNumeric } from "@/lib/verify/numeric";
import { runUserQuery } from "@/lib/practice-db";
import type { AnswerSpec } from "@/data/answers";

export type SqlRunResult =
  | { ok: true; columns: string[]; rows: unknown[][]; rowCount: number; truncated: boolean }
  | { ok: false; error: string };

/** Run a query without grading it — the "just let me look at the data" button. */
export async function runSqlAction(sql: string): Promise<SqlRunResult> {
  await requireUser(); // the practice DB is shared, but only for signed-in users
  const res = await runUserQuery(sql);
  if (res.ok) return res;
  return { ok: false, error: sqlErrorHint(res.error) };
}

export type SqlGradeResult = {
  graded: true;
  correct: boolean;
  feedback: string;
  nearMiss?: boolean;
  user?: { columns: string[]; rows: unknown[][]; rowCount: number; truncated: boolean };
  expected?: { columns: string[]; rows: unknown[][]; rowCount: number; truncated: boolean };
};

export async function gradeSqlAction(
  questionId: string,
  sql: string,
): Promise<SqlGradeResult | { graded: false; error: string }> {
  await requireUser();
  const q = await prisma.question.findUnique({ where: { id: questionId } });
  if (!q?.solution) return { graded: false, error: "No reference solution stored for this question." };
  if (q.verification !== "sql") {
    return { graded: false, error: "This question is not automatically graded." };
  }

  const grade = await gradeSql(sql, q.solution);
  return {
    graded: true,
    correct: grade.correct,
    feedback: grade.feedback,
    nearMiss: grade.nearMiss,
    user: grade.user
      ? { columns: grade.user.columns, rows: grade.user.rows, rowCount: grade.user.rowCount, truncated: grade.user.truncated }
      : undefined,
    // Only reveal the expected output once the attempt has been graded — it is
    // feedback on a submission, not a free peek at the answer.
    expected: grade.expected
      ? {
          columns: grade.expected.columns,
          rows: grade.expected.rows.slice(0, 10),
          rowCount: grade.expected.rowCount,
          truncated: grade.expected.rowCount > 10,
        }
      : undefined,
  };
}

export type NumericGradeResult = {
  graded: true;
  correct: boolean;
  feedback: string;
  expected?: number;
  note?: string;
};

export async function gradeNumericAction(
  questionId: string,
  input: string,
): Promise<NumericGradeResult | { graded: false; error: string }> {
  await requireUser();
  const q = await prisma.question.findUnique({ where: { id: questionId } });
  if (!q?.answerSpec) return { graded: false, error: "No answer key stored for this question." };

  let spec: AnswerSpec;
  try {
    spec = JSON.parse(q.answerSpec) as AnswerSpec;
  } catch {
    return { graded: false, error: "Stored answer key is unreadable." };
  }

  const grade = gradeNumeric(input, spec);
  return {
    graded: true,
    correct: grade.correct,
    feedback: grade.feedback,
    // Reveal the target only once they have committed to an answer.
    expected: grade.parsed !== null ? grade.expected : undefined,
    note: grade.parsed !== null ? grade.note : undefined,
  };
}

/** The practice schema, for the reference panel next to the editor. */
export async function practiceSchemaAction() {
  const { PRACTICE_DDL } = await import("@/lib/practice-db");
  return PRACTICE_DDL.trim();
}
