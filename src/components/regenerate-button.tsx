"use client";

import { useState, useTransition } from "react";
import { regeneratePlanAction } from "@/app/actions";
import { Button } from "./ui";

export function RegenerateButton() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Discard today&rsquo;s untouched tasks?</span>
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await regeneratePlanAction();
              if (!r.ok) setError(r.error);
              setConfirming(false);
            })
          }
        >
          {pending ? "Working…" : "Yes, regenerate"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-destructive">{error}</span>}
      <Button size="sm" variant="outline" onClick={() => setConfirming(true)}>
        Regenerate plan
      </Button>
    </div>
  );
}
