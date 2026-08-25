"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "./ui";

/**
 * Answers stay hidden until asked for — seeing the solution before attempting
 * the question is the fastest way to learn nothing.
 */
export function SolutionReveal({
  label,
  body,
  mono,
}: {
  label: string;
  body: string;
  mono?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{label}</CardTitle>
        <Button size="sm" variant={open ? "ghost" : "outline"} onClick={() => setOpen((o) => !o)}>
          {open ? "Hide" : `Show ${label.toLowerCase()}`}
        </Button>
      </CardHeader>
      {open && (
        <CardContent>
          {mono ? (
            <pre className="animate-fade-in overflow-x-auto rounded-md border border-border bg-secondary/40 p-3 text-xs leading-relaxed">
              {body}
            </pre>
          ) : (
            <p className="animate-fade-in whitespace-pre-wrap text-sm leading-relaxed">{body}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
