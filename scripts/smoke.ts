/**
 * End-to-end smoke test against the real database:
 * regenerate the plan, complete a task, swap a task, and re-check the budget.
 */
import { prisma } from "../src/lib/db";
import {
  applySwap,
  completeTask,
  getOrCreateTodayPlan,
  getSwapOptions,
  regenerateTodayPlan,
} from "../src/lib/plan-service";

function show(plan: Awaited<ReturnType<typeof getOrCreateTodayPlan>>, label: string) {
  const total = plan.tasks.reduce((s, t) => s + t.plannedMinutes, 0);
  console.log(`\n=== ${label} — Day ${plan.dayNumber} — ${total}/${plan.targetMinutes} min, ${plan.tasks.length} questions`);
  const byCat = new Map<string, number>();
  for (const t of plan.tasks) {
    byCat.set(t.question.category, (byCat.get(t.question.category) ?? 0) + t.plannedMinutes);
    console.log(
      `  ${String(t.position).padStart(2)}. [${t.question.category.padEnd(11)}] ${t.question.difficulty.padEnd(6)} ${String(t.plannedMinutes).padStart(2)}m  ${t.question.title}`,
    );
  }
  console.log("  minutes by category:", Object.fromEntries(byCat));
  if (total > plan.targetMinutes) throw new Error("BUDGET EXCEEDED");
  return total;
}

async function main() {
  await prisma.attempt.deleteMany({});
  await prisma.dailyTask.deleteMany({});
  await prisma.dailyPlan.deleteMany({});
  await prisma.userProgress.deleteMany({});

  let plan = await regenerateTodayPlan();
  show(plan, "Fresh plan");

  // --- complete the first two tasks with different outcomes.
  // Solve time now comes from the task's own clock, so seed it the way the timer
  // would have: one solved in half the estimate, one dragging on to double it.
  const setElapsed = (id: string, seconds: number) =>
    prisma.dailyTask.update({
      where: { id },
      data: { elapsedSeconds: Math.round(seconds), startedAt: null },
    });

  await setElapsed(plan.tasks[0].id, plan.tasks[0].plannedMinutes * 60 * 0.5);
  await setElapsed(plan.tasks[1].id, plan.tasks[1].plannedMinutes * 60 * 2);
  await completeTask(plan.tasks[0].id, "independent");
  await completeTask(plan.tasks[1].id, "unsolved");
  const p0 = await prisma.userProgress.findUnique({ where: { questionId: plan.tasks[0].questionId } });
  const p1 = await prisma.userProgress.findUnique({ where: { questionId: plan.tasks[1].questionId } });
  console.log("\nAfter attempts:");
  console.log(`  solved fast -> status=${p0?.status} mastery=${p0?.masteryScore} nextReview=${p0?.nextReviewDate?.toISOString().slice(0, 10)}`);
  console.log(`  failed slow -> status=${p1?.status} mastery=${p1?.masteryScore} overruns=${p1?.timesOverrun} nextReview=${p1?.nextReviewDate?.toISOString().slice(0, 10)}`);

  // --- swap the last pending task
  plan = (await getOrCreateTodayPlan())!;
  const pending = plan.tasks.find((t) => t.status === "pending")!;
  const opts = await getSwapOptions(plan.id, pending.id);
  console.log(`\nSwap options for "${pending.question.title}" (headroom ${opts.headroomMinutes} min):`);
  for (const c of opts.candidates.slice(0, 5)) {
    console.log(`  ${c.question.estimatedMinutes}m  ${c.question.category.padEnd(11)} ${c.question.difficulty.padEnd(6)} prio ${c.priority} match ${c.similarity}%  ${c.question.id}`);
  }
  const over = opts.candidates.filter((c) => c.question.estimatedMinutes > opts.headroomMinutes);
  console.log(`  candidates exceeding headroom: ${over.length} (must be 0)`);
  if (over.length) throw new Error("SWAP OFFERED AN ILLEGAL OPTION");

  await applySwap(plan.id, pending.id, opts.candidates[0].question.id);
  plan = (await getOrCreateTodayPlan())!;
  show(plan, "After swap");

  // --- cross-category swap
  const target = plan.tasks.find((t) => t.status === "pending")!;
  const cross = await getSwapOptions(plan.id, target.id, ["Guesstimate"]);
  console.log(`\nCross-category swap to Guesstimate: ${cross.candidates.length} options, headroom ${cross.headroomMinutes} min`);
  if (cross.candidates.length) {
    await applySwap(plan.id, target.id, cross.candidates[0].question.id);
    plan = (await getOrCreateTodayPlan())!;
    show(plan, "After cross-category swap");
  }

  // --- a rejected swap must actually be rejected
  const anyPending = plan.tasks.find((t) => t.status === "pending")!;
  const otherMinutes = plan.tasks
    .filter((t) => t.id !== anyPending.id)
    .reduce((s, t) => s + t.plannedMinutes, 0);
  const tooBig = await prisma.question.findFirst({
    where: { estimatedMinutes: { gt: plan.targetMinutes - otherMinutes } },
  });
  if (tooBig) {
    try {
      await applySwap(plan.id, anyPending.id, tooBig.id);
      throw new Error("EXPECTED REJECTION BUT SWAP SUCCEEDED");
    } catch (e) {
      console.log(`\nOver-budget swap correctly rejected: ${(e as Error).message}`);
    }
  } else {
    console.log("\n(no question large enough to test rejection at this headroom)");
  }

  console.log("\nSmoke test passed.");
}

main()
  .catch((e) => {
    console.error("\nFAILED:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
