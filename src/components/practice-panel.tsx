"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { recordPracticeAttemptAction } from "@/app/actions";
import { AnswerPanel } from "./answer-panel";
import { OUTCOME_LABELS, type Outcome } from "@/lib/mastery";

/**
 * The question page's workspace.
 *
 * Unlike the plain AnswerPanel, this one LOGS the attempt, the moment the answer
 * is graded and with no second click. The outcome comes from the objective grade
 * plus the "I looked at a hint" checkbox, so there is nothing left to ask.
 *
 * It records no duration. There is no start/stop here, so the only number the
 * app could measure is how long the tab was open — which would hand out speed
 * bonuses for answering from an already-open page and overrun penalties for
 * thinking. Timing belongs to the scheduled session, which has a real clock.
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
  const [result, setResult] = useState<{ mastery: number; outcome: Outcome } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  function handleGraded(correct: boolean, submission: string, hintUsed: boolean) {
    const outcome: Outcome = correct ? (hintUsed ? "minor_hint" : "independent") : "unsolved";
    setError(null);
    start(async () => {
      const r = await recordPracticeAttemptAction(questionId, outcome, {
        verified: true,
        submission,
      });
      if (r.ok) {
        setResult({ mastery: r.data?.mastery ?? 0, outcome });
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
        <div className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm">
          <span className="font-medium">Attempt recorded</span> — logged as &ldquo;
          {OUTCOME_LABELS[result.outcome]}&rdquo;. Mastery for this question is now {result.mastery}%.
          <p className="mt-1 text-xs text-muted-foreground">
            Not timed. Start this question from{" "}
            <Link href="/today" className="text-primary hover:underline">
              today&rsquo;s plan
            </Link>{" "}
            if you want the solve time to count.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!result && (
        <p className="text-xs text-muted-foreground">
          Answering here records a real attempt against your progress. It is not timed — solve time
          only counts in a scheduled session.
        </p>
      )}
    </div>
  );
}
