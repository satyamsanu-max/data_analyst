/**
 * Proves the property that actually matters for multi-user: two accounts
 * cannot see or damage each other's data.
 *
 * Runs against the real database, then cleans up after itself.
 */
import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";
import {
  applySwap,
  completeTask,
  getOrCreateTodayPlan,
  getSwapOptions,
  loadSchedulerQuestions,
  recordPracticeAttempt,
  startTask,
} from "../src/lib/plan-service";
import { overview } from "../src/lib/stats";

const EMAILS = ["iso-a@example.com", "iso-b@example.com"];

async function freshUser(email: string, name: string) {
  await prisma.user.deleteMany({ where: { email } }); // cascades everything
  return prisma.user.create({
    data: { email, name, passwordHash: await hashPassword("isolation-1"), settings: { create: {} } },
  });
}

function check(label: string, condition: boolean) {
  console.log(`  ${condition ? "PASS" : "FAIL"}  ${label}`);
  if (!condition) throw new Error(label);
}

(async () => {
  const alice = await freshUser(EMAILS[0], "Alice");
  const bob = await freshUser(EMAILS[1], "Bob");
  console.log(`Two accounts created.\n`);

  // --- each gets an independent plan
  const planA = await getOrCreateTodayPlan(alice.id);
  const planB = await getOrCreateTodayPlan(bob.id);
  console.log("Independent plans:");
  check("Alice and Bob get different plan rows", planA.id !== planB.id);
  check("both plans respect the budget", planA.plannedMinutes <= planA.targetMinutes && planB.plannedMinutes <= planB.targetMinutes);
  check("both start at Day 1", planA.dayNumber === 1 && planB.dayNumber === 1);

  // --- Alice does some work
  console.log("\nAlice completes a task and practises a question:");
  const taskA = planA.tasks[0];
  await startTask(alice.id, taskA.id);
  await prisma.dailyTask.update({
    where: { id: taskA.id },
    data: { startedAt: new Date(Date.now() - 120_000) },
  });
  await completeTask(alice.id, taskA.id, "independent");

  const someQuestion = await prisma.question.findFirst({ where: { verification: "numeric" } });
  await recordPracticeAttempt(alice.id, someQuestion!.id, "independent", 200, {
    verified: true,
    submission: "0.5",
  });

  const statsA = await overview(alice.id);
  const statsB = await overview(bob.id);
  check("Alice has 2 attempts", statsA.attempts === 2);
  check("Bob still has 0 attempts", statsB.attempts === 0);
  check("Alice has study time recorded", statsA.totalSeconds > 0);
  check("Bob has no study time", statsB.totalSeconds === 0);
  check("Alice has a streak", statsA.streak.current === 1);
  check("Bob has no streak", statsB.streak.current === 0);

  // --- the scheduler must not see the other user's progress
  const qsForBob = await loadSchedulerQuestions(bob.id);
  const bobsViewOfAlicesQuestion = qsForBob.find((q) => q.id === someQuestion!.id)!;
  check("Bob sees that question as untouched", bobsViewOfAlicesQuestion.attemptCount === 0);
  const qsForAlice = await loadSchedulerQuestions(alice.id);
  const alicesView = qsForAlice.find((q) => q.id === someQuestion!.id)!;
  check("Alice sees her own attempt on it", alicesView.attemptCount === 1);

  // --- cross-account access must be refused, not silently allowed
  console.log("\nCross-account access:");
  let refused = false;
  try {
    await startTask(bob.id, taskA.id); // Bob touching Alice's task
  } catch {
    refused = true;
  }
  check("Bob cannot start Alice's task", refused);

  refused = false;
  try {
    await completeTask(bob.id, taskA.id, "independent");
  } catch {
    refused = true;
  }
  check("Bob cannot complete Alice's task", refused);

  refused = false;
  try {
    await getSwapOptions(bob.id, planA.id, taskA.id);
  } catch {
    refused = true;
  }
  check("Bob cannot read swap options for Alice's plan", refused);

  refused = false;
  try {
    const q = await prisma.question.findFirst({ where: { category: "DSA" } });
    await applySwap(bob.id, planA.id, planA.tasks[1].id, q!.id);
  } catch {
    refused = true;
  }
  check("Bob cannot swap a task in Alice's plan", refused);

  // --- Alice's data is untouched by all that
  const stillA = await overview(alice.id);
  check("Alice's attempts are intact", stillA.attempts === 2);

  console.log("\nIsolation smoke test passed.");
  await prisma.user.deleteMany({ where: { email: { in: EMAILS } } });
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("\nFAILED:", e.message);
  await prisma.user.deleteMany({ where: { email: { in: EMAILS } } }).catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
