"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { recordPracticeAttemptAction } from "@/app/actions";
import { AnswerPanel } from "./answer-panel";
import { OUTCOME_LABELS, type Outcome } from "@/lib/mastery";
import { formatSeconds } from "@/lib/utils";

/**
 * The question page's workspace.
 *
 * Unlike the plain AnswerPanel, this one LOGS the attempt — and it does so the
 * moment the answer is graded, with no second click. The outcome is derived
 * from the objective grade plus the "I looked at a hint" checkbox, so there is
 * nothing left to ask afterwards.
 */
export function PracticePanel({
  questionId,
  verification,
  schema,
  ask,
}: {
  questionId: string;
  verification: string;
  schema?: string;
  ask?: string;
}) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<{ correct: boolean; mastery: number; outcome: Outcome } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  // Time on the page is a fair proxy for time spent on the question here.
  useEffect(() => {
    tick.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, []);

  function handleGraded(correct: boolean, submission: string, hintUsed: boolean) {
    const outcome: Outcome = correct ? (hintUsed ? "minor_hint" : "independent") : "unsolved";
    setError(null);
    start(async () => {
      const r = await recordPracticeAttemptAction(questionId, outcome, elapsedRef.current, {
        verified: true,
        submission,
      });
      if (r.ok) {
        setResult({ correct, mastery: r.data?.mastery ?? 0, outcome });
        router.refresh();
      } else {
        setError(r.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <AnswerPanel
        questionId={questionId}
        verification={verification}
        schema={schema}
        ask={ask}
        onGraded={handleGraded}
      />

      {result && (
        <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm">
          <span className="font-medium">Attempt recorded</span> — logged as &ldquo;
          {OUTCOME_LABELS[result.outcome]}&rdquo; after {formatSeconds(elapsed)}. Mastery for this
          question is now {result.mastery}%.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!result && (
        <p className="text-xs text-muted-foreground">
          Answering here records a real attempt against your progress, the same as doing it from
          today&rsquo;s plan.
        </p>
      )}
    </div>
  );
}
