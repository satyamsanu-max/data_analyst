"use client";

import { useState, useTransition } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { markDeepDiveRevealed } from "@/app/deep-dive-actions";
import { Prose, CodeBlock } from "./prose";
import type { CodeBlock as CodeBlockType } from "@/data/deep-dive/types";

/**
 * Question → Hint → Interview Answer → Detailed Explanation.
 *
 * The staging is the point: reading the answer before you have tried to
 * structure one yourself is the fastest way to feel prepared without being
 * prepared. Nothing below the hint renders until it is asked for.
 */
export function ProgressiveReveal({
  contentId,
  hint,
  interviewAnswer,
  detailedExplanation,
  code,
  alreadyRevealed,
  answerIsOurs,
}: {
  contentId: string;
  hint?: string | null;
  interviewAnswer?: string | null;
  detailedExplanation?: string | null;
  code: CodeBlockType[];
  alreadyRevealed: boolean;
  /** True when no source supplied an official answer, so ours must be labelled. */
  answerIsOurs: boolean;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(alreadyRevealed);
  const [, startTransition] = useTransition();

  function reveal() {
    setShowAnswer(true);
    // Fire and forget: the reveal flag is a convenience, not something worth
    // blocking the UI on.
    startTransition(() => {
      void markDeepDiveRevealed(contentId);
    });
  }

  return (
    <div className="space-y-4">
      {hint && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>💡 Hint</CardTitle>
            {!showHint && (
              <Button size="sm" variant="outline" onClick={() => setShowHint(true)}>
                Show hint
              </Button>
            )}
          </CardHeader>
          {showHint && (
            <CardContent>
              <p className="animate-fade-in text-sm leading-relaxed text-muted-foreground">{hint}</p>
            </CardContent>
          )}
        </Card>
      )}

      {!showAnswer && (interviewAnswer || detailedExplanation) && (
        <div className="surface flex flex-col items-center gap-3 p-6 text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            Try structuring an answer out loud before you reveal this one. The gap between what you
            said and what you read is the part worth studying.
          </p>
          <Button onClick={reveal}>Reveal answer</Button>
        </div>
      )}

      {showAnswer && (
        <div className="animate-fade-in space-y-4">
          {interviewAnswer && (
            <Card>
              <CardHeader>
                <CardTitle>✅ Interview answer</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {answerIsOurs
                    ? "Recommended preparation solution — written by us, not an official answer from the source."
                    : "What you could say out loud, in about a minute."}
                </p>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{interviewAnswer}</p>
              </CardContent>
            </Card>
          )}

          {code.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Formulas &amp; calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {code.map((c, i) => (
                  <CodeBlock key={i} lang={c.lang} label={c.label} code={c.code} />
                ))}
              </CardContent>
            </Card>
          )}

          {detailedExplanation && (
            <Card>
              <CardHeader>
                <CardTitle>📖 Detailed explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <Prose>{detailedExplanation}</Prose>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
