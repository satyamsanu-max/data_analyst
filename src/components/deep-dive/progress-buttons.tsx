"use client";

import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui";
import { setDeepDiveStatus, toggleDeepDiveBookmark } from "@/app/deep-dive-actions";
import { cn } from "@/lib/utils";

type Status = "NOT_STARTED" | "ATTEMPTED" | "SOLVED" | "NEEDS_REVIEW";

/**
 * Mark solved / needs review / bookmark.
 *
 * Optimistic so the button responds immediately — the write is a single upsert
 * into `DeepDiveProgress` and effectively never fails, and if it does the
 * server render on the next navigation corrects the display.
 */
export function ProgressButtons({
  contentId,
  status,
  bookmarked,
}: {
  contentId: string;
  status: Status;
  bookmarked: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);
  const [optimisticMark, setOptimisticMark] = useOptimistic(bookmarked);

  function apply(next: Status) {
    // Clicking the active state clears it, so a mis-click is one click to undo.
    const target = optimisticStatus === next ? "NOT_STARTED" : next;
    startTransition(async () => {
      setOptimisticStatus(target);
      await setDeepDiveStatus(contentId, target);
    });
  }

  function bookmark() {
    startTransition(async () => {
      setOptimisticMark(!optimisticMark);
      await toggleDeepDiveBookmark(contentId);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant={optimisticStatus === "SOLVED" ? "default" : "outline"}
        disabled={pending}
        onClick={() => apply("SOLVED")}
        className={cn(optimisticStatus === "SOLVED" && "bg-easy text-background hover:bg-easy/90")}
      >
        {optimisticStatus === "SOLVED" ? "✓ Solved" : "Mark solved"}
      </Button>
      <Button
        size="sm"
        variant={optimisticStatus === "NEEDS_REVIEW" ? "default" : "outline"}
        disabled={pending}
        onClick={() => apply("NEEDS_REVIEW")}
        className={cn(
          optimisticStatus === "NEEDS_REVIEW" && "bg-hard text-background hover:bg-hard/90",
        )}
      >
        Needs review
      </Button>
      <Button
        size="sm"
        variant={optimisticStatus === "ATTEMPTED" ? "secondary" : "ghost"}
        disabled={pending}
        onClick={() => apply("ATTEMPTED")}
      >
        Attempted
      </Button>
      <Button size="sm" variant="ghost" disabled={pending} onClick={bookmark}>
        {optimisticMark ? "★ Bookmarked" : "☆ Bookmark"}
      </Button>
    </div>
  );
}
