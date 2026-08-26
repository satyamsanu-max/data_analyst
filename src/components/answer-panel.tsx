"use client";

import { useState, useTransition } from "react";
import { gradeNumericAction, gradeSqlAction, runSqlAction, type SqlRunResult } from "@/app/verify-actions";
import { Badge, Button } from "./ui";
import { cn } from "@/lib/utils";

type Grid = { columns: string[]; rows: unknown[][]; rowCount: number; truncated: boolean };

export type AnswerPanelProps = {
  questionId: string;
  verification: string; // "sql" | "numeric" | "self"
  /** Called when the app grades the attempt objectively. */
  onGraded?: (correct: boolean, submission: string, hintUsed: boolean) => void;
  schema?: string;
  /**
   * The exact quantity wanted, e.g. "Probability of winning if you switch".
   * Without this a question like "Should you switch?" gives no clue that the
   * grader is expecting 2/3.
   */
  ask?: string;
};

function ResultGrid({ grid, label }: { grid: Grid; label: string }) {
  if (grid.columns.length === 0) {
    return <p className="text-xs text-muted-foreground">{label}: no columns returned.</p>;
  }
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="stat-label">{label}</span>
        <span className="text-[11px] text-muted-foreground">
          {grid.rowCount} row{grid.rowCount === 1 ? "" : "s"}
          {grid.truncated && " (showing first few)"}
        </span>
      </div>
      <div className="max-h-64 overflow-auto rounded-md border border-border">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 bg-secondary">
            <tr>
              {grid.columns.map((c) => (
                <th key={c} className="whitespace-nowrap px-2 py-1.5 text-left font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map((row, i) => (
              <tr key={i} className="border-t border-border">
                {row.map((cell, j) => (
                  <td key={j} className="whitespace-nowrap px-2 py-1 tabular-nums">
                    {cell === null || cell === undefined ? (
                      <span className="text-muted-foreground">NULL</span>
                    ) : cell instanceof Date ? (
                      cell.toISOString().slice(0, 10)
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Verdict({ correct, children }: { correct: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-md border p-3 text-sm",
        correct ? "border-easy/40 bg-easy/10 text-easy" : "border-medium/40 bg-medium/10 text-medium",
      )}
    >
      <span className="mr-2 font-semibold">{correct ? "✓ Correct" : "✗ Not yet"}</span>
      <span className="text-foreground/90">{children}</span>
    </div>
  );
}

// ------------------------------------------------------------------ SQL
function SqlWorkspace({ questionId, onGraded, schema }: AnswerPanelProps) {
  const [sql, setSql] = useState("");
  const [run, setRun] = useState<SqlRunResult | null>(null);
  const [grade, setGrade] = useState<Awaited<ReturnType<typeof gradeSqlAction>> | null>(null);
  const [showSchema, setShowSchema] = useState(false);
  const [pending, start] = useTransition();

  const doRun = () =>
    start(async () => {
      setGrade(null);
      setRun(await runSqlAction(sql));
    });

  const doSubmit = () =>
    start(async () => {
      setRun(null);
      const g = await gradeSqlAction(questionId, sql);
      setGrade(g);
      if (g.graded) onGraded?.(g.correct, sql, false);
    });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="stat-label">Your query</span>
        {schema && (
          <button
            onClick={() => setShowSchema((s) => !s)}
            className="text-xs text-primary hover:underline"
          >
            {showSchema ? "Hide schema" : "Show schema"}
          </button>
        )}
      </div>

      {showSchema && schema && (
        <pre className="max-h-56 overflow-auto rounded-md border border-border bg-secondary/40 p-3 text-[11px] leading-relaxed">
          {schema}
        </pre>
      )}

      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        spellCheck={false}
        rows={9}
        placeholder="SELECT ..."
        className="w-full resize-y rounded-md border border-border bg-background p-3 font-mono text-xs leading-relaxed focus:border-primary focus:outline-none"
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            doRun();
          }
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={doRun} disabled={pending || !sql.trim()}>
          {pending ? "Running…" : "Run"}
        </Button>
        <Button size="sm" onClick={doSubmit} disabled={pending || !sql.trim()}>
          Submit for grading
        </Button>
        <span className="text-[11px] text-muted-foreground">
          Runs against a real Postgres instance. Ctrl+Enter to run.
        </span>
      </div>

      {run && !run.ok && (
        <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {run.error}
        </pre>
      )}
      {run && run.ok && <ResultGrid grid={run} label="Your result" />}

      {grade && !grade.graded && (
        <p className="text-sm text-muted-foreground">{grade.error}</p>
      )}
      {grade && grade.graded && (
        <div className="space-y-3">
          <Verdict correct={grade.correct}>{grade.feedback}</Verdict>
          {grade.user && <ResultGrid grid={grade.user} label="Your result" />}
          {!grade.correct && grade.expected && (
            <ResultGrid grid={grade.expected} label="Expected result" />
          )}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------- Numeric
function NumericWorkspace({ questionId, onGraded, ask }: AnswerPanelProps) {
  const [value, setValue] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [grade, setGrade] = useState<Awaited<ReturnType<typeof gradeNumericAction>> | null>(null);
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      const g = await gradeNumericAction(questionId, value);
      setGrade(g);
      if (g.graded) onGraded?.(g.correct, value, hintUsed);
    });

  return (
    <div className="space-y-3">
      <div>
        <span className="stat-label">Your answer</span>
        {ask && <p className="mt-0.5 text-sm font-medium text-foreground">{ask}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && submit()}
          placeholder="e.g. 1/6, 0.167, 16.7%, 2.5 million"
          className="h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
        />
        <Button size="sm" onClick={submit} disabled={pending || !value.trim()}>
          {pending ? "Checking…" : "Check answer"}
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          Fractions, decimals, percentages and shorthand like &ldquo;2.5m&rdquo; or &ldquo;80 crore&rdquo; are accepted.
        </p>
        <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
          <input
            type="checkbox"
            checked={hintUsed}
            onChange={(e) => setHintUsed(e.target.checked)}
            className="h-3.5 w-3.5 accent-current"
          />
          I looked at a hint or the solution
        </label>
      </div>

      {grade && !grade.graded && <p className="text-sm text-muted-foreground">{grade.error}</p>}
      {grade && grade.graded && (
        <div className="space-y-2">
          <Verdict correct={grade.correct}>{grade.feedback}</Verdict>
          {grade.note && <p className="text-xs text-muted-foreground">{grade.note}</p>}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------- entry
export function AnswerPanel(props: AnswerPanelProps) {
  if (props.verification === "sql") return <SqlWorkspace {...props} />;
  if (props.verification === "numeric") return <NumericWorkspace {...props} />;
  return null;
}

/** Small label showing how a question is graded. */
export function VerificationBadge({ verification }: { verification: string }) {
  if (verification === "sql") {
    return <Badge className="border-easy/30 bg-easy/10 text-easy">auto-graded · SQL</Badge>;
  }
  if (verification === "numeric") {
    return <Badge className="border-easy/30 bg-easy/10 text-easy">auto-graded · answer</Badge>;
  }
  return <Badge>self-graded</Badge>;
}
