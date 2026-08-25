import { getOrCreateTodayPlan } from "@/lib/plan-service";
import { slotBreakdown, toTaskCards } from "@/lib/serialize";
import { TaskCard } from "@/components/task-card";
import { RegenerateButton } from "@/components/regenerate-button";
import { Meter } from "@/components/ui";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const [plan, settings] = await Promise.all([getOrCreateTodayPlan(), getSettings()]);
  const cards = toTaskCards(plan);
  const breakdown = slotBreakdown(cards);

  const planned = cards.reduce((s, c) => s + c.plannedMinutes, 0);
  const doneMinutes = cards
    .filter((c) => c.status === "done")
    .reduce((s, c) => s + c.plannedMinutes, 0);
  const doneCount = cards.filter((c) => c.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="stat-label">Day {plan.dayNumber}</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Today&rsquo;s Plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {planned} / {settings.dailyMinutes} minutes planned · {cards.length} questions ·{" "}
            {doneCount} complete
          </p>
        </div>
        <RegenerateButton />
      </div>

      <div className="surface p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Time budget</span>
          <span className="tabular-nums text-muted-foreground">
            {doneMinutes} done · {planned - doneMinutes} remaining · {settings.dailyMinutes - planned}{" "}
            unallocated
          </span>
        </div>
        <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary/30"
            style={{ width: `${(planned / settings.dailyMinutes) * 100}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(doneMinutes / settings.dailyMinutes) * 100}%` }}
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {breakdown.map((b) => (
            <div key={b.slot} className="rounded-md border border-border p-3">
              <div className="stat-label truncate">{b.slot}</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-semibold tabular-nums">{b.minutes}</span>
                <span className="text-xs text-muted-foreground">min · {b.count}q</span>
              </div>
              <Meter
                value={(b.minutes / Math.max(1, planned)) * 100}
                className="mt-2 h-1.5"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="surface p-10 text-center text-sm text-muted-foreground">
            No plan could be generated. Check that the question bank is seeded.
          </div>
        ) : (
          cards.map((c) => <TaskCard key={c.id} task={c} />)
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        The scheduler orders the day easy to hard and never lets the total exceed your{" "}
        {settings.dailyMinutes}-minute budget. Swapping recalculates against the whole plan, so a longer
        replacement is allowed whenever the rest of the day leaves room.
      </p>
    </div>
  );
}
