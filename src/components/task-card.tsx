"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  applySwapAction,
  completeTaskAction,
  pauseTaskAction,
  skipTaskAction,
  startTaskAction,
  swapOptionsDetailedAction,
} from "@/app/actions";
import { Badge, Button, Meter, Modal } from "./ui";
import {
  CATEGORY_CLASS,
  DIFFICULTY_CLASS,
  cn,
  formatSeconds,
} from "@/lib/utils";
import { OUTCOME_LABELS, type Outcome } from "@/lib/mastery";
import { AnswerPanel, VerificationBadge } from "./answer-panel";

export type TaskCardData = {
  id: string;
  planId: string;
  position: number;
  plannedMinutes: number;
  status: string;
  outcome: string | null;
  /** Accumulated time from finished run segments. */
  elapsedSeconds: number;
  /** ISO timestamp of the current running segment, or null while paused. */
  startedAt: string | null;
  swapped: boolean;
  slotLabel: string;
  question: {
    id: string;
    title: string;
    category: string;
    topicName: string;
    pattern: string | null;
    difficulty: string;
    estimatedMinutes: number;
    frequencyScore: number;
    patternValue: number;
    sourceName: string | null;
    sourceUrl: string | null;
    sourceNote: string | null;
    companies: string[];
    prompt: string | null;
    hint: string | null;
    masteryScore: number;
    status: string;
    attemptCount: number;
    verification: string;
    practiceSchema?: string;
  };
};

const CATEGORY_OPTIONS = [
  "DSA",
  "SQL",
  "Probability",
  "Statistics",
  "ML",
  "Python",
  "Guesstimate",
] as const;

type Candidate = {
  id: string;
  title: string;
  category: string;
  topicName: string;
  pattern: string | null;
  difficulty: string;
  estimatedMinutes: number;
  sourceName: string | null;
  companies: string[];
  priority: number;
  similarity: number;
  reason: string;
};

export function TaskCard({ task }: { task: TaskCardData }) {
  const q = task.question;
  const done = task.status === "done";
  const skipped = task.status === "skipped";

  // The clock lives on the server: accumulated seconds plus the open segment.
  // Reloading the page or closing the tab therefore cannot lose the time.
  const liveElapsed = (base: number, startedAt: string | null) =>
    base + (startedAt ? Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)) : 0);

  const [running, setRunning] = useState(task.startedAt !== null && task.status !== "done");
  const [elapsed, setElapsed] = useState(() => liveElapsed(task.elapsedSeconds, task.startedAt));
  const [showHint, setShowHint] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graded, setGraded] = useState<{ correct: boolean; submission: string } | null>(null);
  const [workOpen, setWorkOpen] = useState(false);
  const [, startTransition] = useTransition();
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      tick.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (tick.current) {
      clearInterval(tick.current);
      tick.current = null;
    }
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  const estimatedSeconds = q.estimatedMinutes * 60;
  const overrun = elapsed > estimatedSeconds;
  const progressPct = Math.min(100, (elapsed / estimatedSeconds) * 100);

  function handleStart() {
    setRunning(true);
    setWorkOpen(q.verification !== "self");
    startTransition(async () => {
      const r = await startTaskAction(task.id);
      if (!r.ok) setError(r.error);
    });
  }

  function handlePause() {
    setRunning(false);
    startTransition(async () => {
      const r = await pauseTaskAction(task.id);
      if (!r.ok) setError(r.error);
    });
  }

  function handleComplete(outcome: Outcome) {
    setRunning(false);
    startTransition(async () => {
      await pauseTaskAction(task.id); // close the open segment before reading the clock
      const r = await completeTaskAction(
        task.id,
        outcome,
        graded ? { verified: true, submission: graded.submission } : undefined,
      );
      if (!r.ok) setError(r.error);
      else setReviewOpen(false);
    });
  }

  function handleSkip() {
    setRunning(false);
    startTransition(async () => {
      const r = await skipTaskAction(task.id);
      if (!r.ok) setError(r.error);
    });
  }

  return (
    <div
      className={cn(
        "surface overflow-hidden transition-opacity",
        done && "opacity-60",
        skipped && "opacity-40",
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/30 px-4 py-2">
        <Badge className={CATEGORY_CLASS[q.category]}>{q.category}</Badge>
        <Badge className={DIFFICULTY_CLASS[q.difficulty]}>{q.difficulty}</Badge>
        <Badge>{q.estimatedMinutes} min</Badge>
        {task.swapped && <Badge className="border-primary/30 bg-primary/10 text-primary">swapped</Badge>}
        <VerificationBadge verification={q.verification} />
        {done && (
          <Badge className="border-easy/30 bg-easy/10 text-easy">
            done · {task.outcome ? OUTCOME_LABELS[task.outcome as Outcome] : ""}
          </Badge>
        )}
        {skipped && <Badge>skipped</Badge>}
        <span className="ml-auto text-xs text-muted-foreground">{task.slotLabel}</span>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/question/${q.id}`}
              className="text-base font-semibold leading-tight hover:text-primary hover:underline"
            >
              {q.title}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Topic: {q.topicName}</span>
              {q.pattern && <span>Pattern: {q.pattern}</span>}
              <span>Frequency: {q.frequencyScore}</span>
              {q.attemptCount > 0 && <span>Mastery: {q.masteryScore}%</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="stat-label">Est.</div>
            <div className="text-lg font-semibold tabular-nums">{q.estimatedMinutes}m</div>
          </div>
        </div>

        {q.prompt && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.prompt}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {q.sourceUrl ? (
            <a
              href={q.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary hover:underline"
            >
              Source: {q.sourceName ?? "link"} ↗
            </a>
          ) : (
            q.sourceName && <span className="text-muted-foreground">Source: {q.sourceName}</span>
          )}
          {q.companies.slice(0, 5).map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
          {q.companies.length > 5 && <span className="text-muted-foreground">+{q.companies.length - 5}</span>}
        </div>

        {(running || elapsed > 0) && !done && (
          <div className="mt-4 rounded-md border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between">
              <span className={cn("font-mono text-xl tabular-nums", overrun && "text-hard")}>
                {formatSeconds(elapsed)}
              </span>
              <span className="text-xs text-muted-foreground">
                of {q.estimatedMinutes}:00
                {overrun && <span className="ml-2 font-medium text-hard">Time overrun</span>}
              </span>
            </div>
            <Meter
              value={progressPct}
              className="mt-2"
              barClassName={overrun ? "bg-hard" : "bg-primary"}
            />
          </div>
        )}

        {workOpen && !done && q.verification !== "self" && (
          <div className="mt-4 rounded-md border border-border p-3">
            <AnswerPanel
              questionId={q.id}
              verification={q.verification}
              schema={q.practiceSchema}
              onGraded={(correct, submission) => {
                setGraded({ correct, submission });
                if (correct) setReviewOpen(true);
              }}
            />
            {graded && (
              <p className="mt-3 text-xs text-muted-foreground">
                {graded.correct
                  ? "Graded correct — this will be recorded as a verified solve."
                  : "Graded incorrect so far. Keep going, or mark how it went."}
              </p>
            )}
          </div>
        )}

        {showHint && q.hint && (
          <p className="mt-3 rounded-md border border-border bg-secondary/40 p-3 text-sm">{q.hint}</p>
        )}

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        {!done && !skipped && (
          <div className="mt-4 flex flex-wrap gap-2">
            {!running && elapsed === 0 && (
              <Button size="sm" onClick={handleStart}>
                Start
              </Button>
            )}
            {running && (
              <Button size="sm" variant="secondary" onClick={handlePause}>
                Pause
              </Button>
            )}
            {!running && elapsed > 0 && (
              <Button size="sm" onClick={handleStart}>
                Resume
              </Button>
            )}
            {elapsed > 0 && (
              <Button size="sm" variant="outline" onClick={() => setReviewOpen(true)}>
                Complete
              </Button>
            )}
            {q.verification !== "self" && (
              <Button size="sm" variant="outline" onClick={() => setWorkOpen((w) => !w)}>
                {workOpen ? "Hide workspace" : "Solve here"}
              </Button>
            )}
            {q.hint && (
              <Button size="sm" variant="ghost" onClick={() => setShowHint((h) => !h)}>
                {showHint ? "Hide hint" : "Hint"}
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setSwapOpen(true)}>
              Swap
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSkip} className="text-muted-foreground">
              Give up
            </Button>
            <Link href={`/question/${q.id}`} className="ml-auto">
              <Button size="sm" variant="link">
                Open question →
              </Button>
            </Link>
          </div>
        )}

        {done && (
          <div className="mt-3 text-xs text-muted-foreground">
            Logged {formatSeconds(task.elapsedSeconds)} · mastery now {q.masteryScore}%
          </div>
        )}
      </div>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title={q.title}
        elapsed={elapsed}
        estimatedSeconds={estimatedSeconds}
        onSelect={handleComplete}
      />

      <SwapModal
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        task={task}
        onError={setError}
      />
    </div>
  );
}

// ------------------------------------------------------------------ Review
function ReviewModal({
  open,
  onClose,
  title,
  elapsed,
  estimatedSeconds,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  elapsed: number;
  estimatedSeconds: number;
  onSelect: (o: Outcome) => void;
}) {
  const overrun = elapsed > estimatedSeconds * 1.5;
  return (
    <Modal open={open} onClose={onClose} title="How did this go?" description={title}>
      <div className="space-y-2">
        {(Object.keys(OUTCOME_LABELS) as Outcome[]).map((o) => (
          <button
            key={o}
            onClick={() => onSelect(o)}
            className="flex w-full items-center gap-3 rounded-md border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-accent"
          >
            <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground" />
            {OUTCOME_LABELS[o]}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Recorded time: {formatSeconds(elapsed)}
        {overrun && " — flagged as a time overrun, which will pull this question back sooner."}
      </p>
    </Modal>
  );
}

// -------------------------------------------------------------------- Swap
function SwapModal({
  open,
  onClose,
  task,
  onError,
}: {
  open: boolean;
  onClose: () => void;
  task: TaskCardData;
  onError: (s: string | null) => void;
}) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [headroom, setHeadroom] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>(task.question.category);
  const [mode, setMode] = useState<"similar" | "easier" | "harder" | "shorter">("similar");
  const [localError, setLocalError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setLocalError(null);
    swapOptionsDetailedAction(
      task.planId,
      task.id,
      category === task.question.category ? undefined : [category],
      mode,
    ).then((r) => {
      setLoading(false);
      if (r.ok) {
        setCandidates(r.data.candidates);
        setHeadroom(r.data.headroomMinutes);
      } else {
        setLocalError(r.error);
      }
    });
  }, [open, category, mode, task.planId, task.id, task.question.category]);

  function choose(id: string) {
    startTransition(async () => {
      const r = await applySwapAction(task.planId, task.id, id);
      if (r.ok) {
        onError(null);
        onClose();
      } else {
        setLocalError(r.error);
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title="Swap this question"
      description={`Replacing "${task.question.title}". Only alternatives that keep the day inside your budget are shown.`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div>
          <label className="stat-label mb-1 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 rounded-md border border-border bg-background px-2 text-sm"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="stat-label mb-1 block">Preference</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="h-8 rounded-md border border-border bg-background px-2 text-sm"
          >
            <option value="similar">Similar</option>
            <option value="easier">Easier</option>
            <option value="harder">Harder</option>
            <option value="shorter">Shorter</option>
          </select>
        </div>
        {headroom != null && (
          <div className="ml-auto text-xs text-muted-foreground">
            Time available for this slot: <span className="font-semibold text-foreground">{headroom} min</span>
          </div>
        )}
      </div>

      {localError && <p className="mb-3 text-sm text-destructive">{localError}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Finding alternatives…</p>
      ) : candidates.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No alternative fits in {headroom ?? 0} minutes. Try the &ldquo;Shorter&rdquo; preference, or
          swap a different question first.
        </p>
      ) : (
        <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {candidates.map((c) => (
            <button
              key={c.id}
              onClick={() => choose(c.id)}
              className="w-full rounded-md border border-border p-3 text-left transition-colors hover:border-primary hover:bg-accent"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={CATEGORY_CLASS[c.category]}>{c.category}</Badge>
                <Badge className={DIFFICULTY_CLASS[c.difficulty]}>{c.difficulty}</Badge>
                <Badge>{c.estimatedMinutes} min</Badge>
                <span className="ml-auto text-xs text-muted-foreground">
                  priority {c.priority} · match {c.similarity}%
                </span>
              </div>
              <div className="mt-1.5 text-sm font-medium">{c.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {c.topicName}
                {c.pattern ? ` · ${c.pattern}` : ""} · {c.reason}
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
