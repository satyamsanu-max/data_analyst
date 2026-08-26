"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { recordPracticeAttemptAction } from "@/app/actions";
import { AnswerPanel } from "./answer-panel";
import { Button } from "./ui";
import { OUTCOME_LABELS, type Outcome } from "@/lib/mastery";
import { formatSeconds } from "@/lib/utils";

/**
 * The question page's workspace.
 *
 * Unlike the plain AnswerPanel, this one LOGS the attempt. Practising a
 * probability, statistics or guesstimate question here used to update nothing,
 * so mastery stayed at 0% and the status stayed "Not started" no matter how
 * many you got right.
 */
export function PracticePanel({
  questionId,
  verification,
  schema,
}: {
  questionId: string;
  verification: string;
  schema?: string;
}) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [graded, setGraded] = useState<{ correct: boolean; submission: string } | null>(null);
  const [saved, setSaved] = useState<{ mastery: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  // Time on the page is a fair proxy for time spent on the question here.
  useEffect(() => {
    tick.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, []);

  function log(outcome: Outcome) {
    setError(null);
    start(async () => {
      const r = await recordPracticeAttemptAction(
        questionId,
        outcome,
        elapsed,
        graded ? { verified: true, submission: graded.submission } : undefined,
      );
      if (r.ok) {
        setSaved({ mastery: r.data?.mastery ?? 0 });
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
        onGraded={(correct, submission) => {
          setGraded({ correct, submission });
          setSaved(null);
        }}
      />

      {saved ? (
        <p className="rounded-md border border-easy/40 bg-easy/10 px-3 py-2 text-sm text-easy">
          Attempt recorded — mastery for this question is now {saved.mastery}%.
        </p>
      ) : graded ? (
        <div className="rounded-md border border-border bg-secondary/40 p-3">
          <p className="text-sm font-medium">
            {graded.correct ? "Graded correct." : "Graded incorrect."} Log this attempt?
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Time on this question: {formatSeconds(elapsed)}. Tell it how the attempt actually went —
            the grade is objective, but whether you needed a hint is not.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(graded.correct
              ? (["independent", "minor_hint", "major_hint"] as Outcome[])
              : (["major_hint", "unsolved"] as Outcome[])
            ).map((o) => (
              <Button key={o} size="sm" variant="outline" disabled={pending} onClick={() => log(o)}>
                {OUTCOME_LABELS[o]}
              </Button>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Answering here records a real attempt against your progress, the same as doing it from
          today&rsquo;s plan.
        </p>
      )}
    </div>
  );
}
