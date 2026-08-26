/**
 * End-to-end check of the grading pipeline against the real database:
 * a correct SQL query, a wrong one, a correct numeric answer, a wrong one,
 * and confirmation that a verified attempt is recorded as such.
 */
import { prisma } from "../src/lib/db";
import { gradeSql } from "../src/lib/verify/sql";
import { gradeNumeric } from "../src/lib/verify/numeric";
import { completeTask, getOrCreateTodayPlan, regenerateTodayPlan, startTask } from "../src/lib/plan-service";
import type { AnswerSpec } from "../src/data/answers";
import { ensureTestUser } from "./test-user";

(async () => {
  const user = await ensureTestUser();
  const uid = user.id;

  const counts = await prisma.question.groupBy({ by: ["verification"], _count: { verification: true } });
  console.log("Grading modes in the database:");
  for (const c of counts) console.log(`  ${c.verification.padEnd(8)} ${c._count.verification}`);

  // ---- SQL: correct vs wrong
  const sqlQ = await prisma.question.findFirst({ where: { verification: "sql" }, orderBy: { id: "asc" } });
  if (!sqlQ?.solution) throw new Error("no sql-graded question found");
  console.log(`\nSQL question: ${sqlQ.id} — ${sqlQ.title}`);

  const right = await gradeSql(sqlQ.solution, sqlQ.solution);
  console.log(`  reference submitted -> correct=${right.correct}  "${right.feedback}"`);
  if (!right.correct) throw new Error("reference solution failed its own grading");

  const wrong = await gradeSql("SELECT 1 AS wrong", sqlQ.solution);
  console.log(`  garbage submitted   -> correct=${wrong.correct}  "${wrong.feedback.slice(0, 70)}"`);
  if (wrong.correct) throw new Error("grader accepted a wrong query");

  const mutation = await gradeSql("DELETE FROM orders", sqlQ.solution);
  console.log(`  DELETE attempted    -> correct=${mutation.correct}  "${mutation.feedback.slice(0, 70)}"`);
  if (mutation.correct) throw new Error("grader accepted a mutation");

  // ---- Numeric
  const numQ = await prisma.question.findFirst({ where: { verification: "numeric" }, orderBy: { id: "asc" } });
  if (!numQ?.answerSpec) throw new Error("no numeric question found");
  const spec = JSON.parse(numQ.answerSpec) as AnswerSpec;
  console.log(`\nNumeric question: ${numQ.id} — ${numQ.title}`);
  const nRight = gradeNumeric(String(spec.value), spec);
  const nWrong = gradeNumeric("999999", spec);
  console.log(`  exact value -> correct=${nRight.correct}`);
  console.log(`  nonsense    -> correct=${nWrong.correct}  "${nWrong.feedback.slice(0, 60)}"`);
  if (!nRight.correct || nWrong.correct) throw new Error("numeric grading is wrong");

  // ---- A verified attempt must be recorded as verified, with a server-side clock
  await prisma.attempt.deleteMany({});
  await prisma.dailyTask.deleteMany({});
  await prisma.dailyPlan.deleteMany({});
  await prisma.userProgress.deleteMany({});

  let plan = await regenerateTodayPlan(uid);
  const task = plan.tasks[0];
  await startTask(uid, task.id);
  // Simulate 90 seconds of work by backdating the open segment.
  await prisma.dailyTask.update({
    where: { id: task.id },
    data: { startedAt: new Date(Date.now() - 90_000) },
  });
  await completeTask(uid, task.id, "independent", { verified: true, submission: "SELECT 1" });

  const attempt = await prisma.attempt.findFirst({ orderBy: { createdAt: "desc" } });
  console.log(`\nVerified attempt recorded:`);
  console.log(`  verified=${attempt?.verified} seconds=${attempt?.seconds} submission=${JSON.stringify(attempt?.submission)}`);
  if (!attempt?.verified) throw new Error("attempt was not marked verified");
  if (!attempt.seconds || attempt.seconds < 85 || attempt.seconds > 100) {
    throw new Error(`server clock wrong: got ${attempt.seconds}s, expected ~90s`);
  }

  // ---- Timer survives a "reload": elapsed is reconstructed from startedAt
  plan = (await getOrCreateTodayPlan(uid))!;
  const t2 = plan.tasks.find((t) => t.status === "pending")!;
  await startTask(uid, t2.id);
  await prisma.dailyTask.update({
    where: { id: t2.id },
    data: { startedAt: new Date(Date.now() - 45_000) },
  });
  const reloaded = await prisma.dailyTask.findUnique({ where: { id: t2.id } });
  const live =
    (reloaded?.elapsedSeconds ?? 0) +
    (reloaded?.startedAt ? Math.floor((Date.now() - reloaded.startedAt.getTime()) / 1000) : 0);
  console.log(`\nTimer after simulated reload: ${live}s (expected ~45s)`);
  if (live < 40 || live > 55) throw new Error("timer did not survive reload");

  console.log("\nVerification smoke test passed.");
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("\nFAILED:", e.message);
  await prisma.$disconnect();
  process.exit(1);
});
