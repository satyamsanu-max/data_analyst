"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetProgressAction, saveSettingsAction } from "@/app/actions";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "./ui";
import { cn } from "@/lib/utils";

const MINUTES = [90, 120, 150, 180];
const MODES = [
  { value: "balanced", label: "Balanced", hint: "Aims just above your current level in each topic." },
  { value: "easy-first", label: "Easy first", hint: "Builds confidence and coverage before difficulty." },
  { value: "interview-hard", label: "Interview hard", hint: "Weights Medium and Hard heavily." },
];
const ROLES = ["Data Analyst", "Data Scientist", "Product Analyst", "Quant / Data-heavy Analyst"];

export function SettingsForm({
  initial,
  companies,
}: {
  initial: {
    dailyMinutes: number;
    difficultyMode: string;
    targetRole: string;
    targetCompanies: string[];
  };
  companies: { slug: string; name: string; bucket: string }[];
}) {
  const router = useRouter();
  const [dailyMinutes, setDailyMinutes] = useState(initial.dailyMinutes);
  const [difficultyMode, setDifficultyMode] = useState(initial.difficultyMode);
  const [targetRole, setTargetRole] = useState(initial.targetRole);
  const [targets, setTargets] = useState<string[]>(initial.targetCompanies);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, start] = useTransition();

  function toggle(slug: string) {
    setTargets((t) => (t.includes(slug) ? t.filter((x) => x !== slug) : [...t, slug]));
  }

  function save() {
    setMessage(null);
    setError(null);
    start(async () => {
      const r = await saveSettingsAction({
        dailyMinutes,
        difficultyMode,
        targetRole,
        targetCompanies: targets,
      });
      if (r.ok) {
        setMessage("Saved. Regenerate today's plan to apply the new budget and weighting.");
        router.refresh();
      } else setError(r.error);
    });
  }

  const buckets = [...new Set(companies.map((c) => c.bucket))];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Daily study time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MINUTES.map((m) => (
              <button
                key={m}
                onClick={() => setDailyMinutes(m)}
                className={cn(
                  "rounded-md border px-4 py-2 text-sm transition-colors",
                  dailyMinutes === m
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-border hover:bg-accent",
                )}
              >
                {m} min
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This is a hard ceiling. The scheduler will never plan a day above it, and swaps are
            rejected if they would push you over.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setDifficultyMode(m.value)}
              className={cn(
                "flex w-full flex-col items-start rounded-md border px-4 py-2.5 text-left transition-colors",
                difficultyMode === m.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-accent",
              )}
            >
              <span className="text-sm font-medium">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.hint}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setTargetRole(r)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                targetRole === r
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border hover:bg-accent",
              )}
            >
              {r}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target companies ({targets.length} selected)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {buckets.map((b) => (
            <div key={b}>
              <div className="stat-label mb-1.5 capitalize">{b}</div>
              <div className="flex flex-wrap gap-1.5">
                {companies
                  .filter((c) => c.bucket === b)
                  .map((c) => (
                    <button key={c.slug} onClick={() => toggle(c.slug)}>
                      <Badge
                        className={cn(
                          "cursor-pointer transition-colors",
                          targets.includes(c.slug)
                            ? "border-primary bg-primary/15 text-primary"
                            : "hover:border-primary/50",
                        )}
                      >
                        {c.name}
                      </Badge>
                    </button>
                  ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Company relevance is 15% of the priority score. With no targets set every question is
            treated neutrally.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
        {message && <span className="text-sm text-easy">{message}</span>}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Reset progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Deletes every attempt, mastery score, and daily plan. The question bank itself is
            untouched.
          </p>
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">This cannot be undone. Are you sure?</span>
              <Button
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const r = await resetProgressAction();
                    if (r.ok) {
                      setMessage("Progress reset.");
                      setConfirmReset(false);
                      router.refresh();
                    } else setError(r.error);
                  })
                }
              >
                Yes, delete everything
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)}>
              Reset all progress
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
