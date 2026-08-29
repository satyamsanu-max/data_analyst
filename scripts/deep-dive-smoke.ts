import { prisma } from "../src/lib/db";
import { ensureTestUser } from "./test-user";
import {
  sectionSummaries,
  listContent,
  getContent,
  searchDeepDive,
  bookmarks,
  weakCategories,
} from "../src/lib/deep-dive-service";

/**
 * End-to-end smoke test for Deep Dive.
 *
 * Exercises the query layer and the progress writes, and asserts — before and
 * after — that the Daily Practice tables are untouched. That last assertion is
 * the point: it is the guarantee the whole design rests on.
 */
function check(label: string, ok: boolean, detail?: string) {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) process.exitCode = 1;
}

async function dailyPracticeSnapshot() {
  return {
    questions: await prisma.question.count(),
    progress: await prisma.userProgress.count(),
    plans: await prisma.dailyPlan.count(),
    tasks: await prisma.dailyTask.count(),
    attempts: await prisma.attempt.count(),
  };
}

async function main() {
  const user = await ensureTestUser();
  const before = await dailyPracticeSnapshot();

  console.log("\nQueries");
  const sections = await sectionSummaries(user.id);
  check("sectionSummaries returns all 14 sections", sections.length === 14, `${sections.length}`);
  check(
    "every section has content",
    sections.every((s) => s.total > 0),
    sections.filter((s) => s.total === 0).map((s) => s.slug).join(",") || "all populated",
  );

  const excelQ = await listContent(user.id, "excel", "questions");
  check("Excel questions list", excelQ.length > 50, `${excelQ.length} questions`);
  const excelC = await listContent(user.id, "excel", "concepts");
  check("Excel concepts list", excelC.length > 10, `${excelC.length} concepts`);

  const filtered = await listContent(user.id, "excel", "questions", { category: "Lookup" });
  check("category filter narrows the list", filtered.length > 0 && filtered.length < excelQ.length,
    `${filtered.length} of ${excelQ.length}`);

  const item = await getContent(user.id, "xl-q-vlookup");
  check("getContent returns the item", item?.title.includes("VLOOKUP") ?? false);
  check("item has hint, answer and explanation",
    Boolean(item?.hint && item?.interviewAnswer && item?.detailedExplanation));
  check("item has sources", (item?.sources.length ?? 0) > 0, `${item?.sources.length} sources`);
  check("item resolves related items", (item?.related.length ?? 0) > 0, `${item?.related.length} related`);

  const results = await searchDeepDive(user.id, "LOD");
  check("search finds LOD content", results.length > 0, `${results.length} results`);
  const rca = await searchDeepDive(user.id, "revenue decline");
  check("search finds RCA content", rca.length > 0, `${rca.length} results`);

  console.log("\nProgress writes");
  await prisma.deepDiveProgress.deleteMany({ where: { userId: user.id } });

  await prisma.deepDiveProgress.upsert({
    where: { userId_contentId: { userId: user.id, contentId: "xl-q-vlookup" } },
    create: { userId: user.id, contentId: "xl-q-vlookup", status: "SOLVED", attempts: 1, solvedAt: new Date() },
    update: { status: "SOLVED" },
  });
  const after1 = await getContent(user.id, "xl-q-vlookup");
  check("marking solved persists", after1?.progress?.status === "SOLVED");

  const solvedList = await listContent(user.id, "excel", "questions", { status: "SOLVED" });
  check("status filter finds it", solvedList.length === 1, `${solvedList.length}`);

  const summariesAfter = await sectionSummaries(user.id);
  const excel = summariesAfter.find((s) => s.slug === "excel")!;
  check("section progress counts it", excel.questionDone === 1, `${excel.questionDone} done`);

  await prisma.deepDiveProgress.update({
    where: { userId_contentId: { userId: user.id, contentId: "xl-q-vlookup" } },
    data: { bookmarked: true },
  });
  const marks = await bookmarks(user.id);
  check("bookmark appears", marks.length === 1, `${marks.length}`);

  await prisma.deepDiveProgress.createMany({
    data: [
      { userId: user.id, contentId: "xl-q-index-match", status: "ATTEMPTED", attempts: 1 },
      { userId: user.id, contentId: "xl-q-xlookup", status: "NEEDS_REVIEW", attempts: 1 },
    ],
  });
  const weak = await weakCategories(user.id, "excel");
  check("weak categories computed", weak.length > 0, weak.map((w) => `${w.category} ${w.pct}%`).join(", "));

  console.log("\nIsolation");
  const after = await dailyPracticeSnapshot();
  for (const k of Object.keys(before) as (keyof typeof before)[]) {
    check(`${k} unchanged`, before[k] === after[k], `${before[k]} → ${after[k]}`);
  }

  const ddInQuestions = await prisma.question.count({ where: { id: { startsWith: "xl-" } } });
  check("no Deep Dive rows in the Question table", ddInQuestions === 0);

  // Clean up the smoke user's Deep Dive progress so repeated runs start clean.
  await prisma.deepDiveProgress.deleteMany({ where: { userId: user.id } });

  console.log(
    process.exitCode === 1 ? "\nFAILED\n" : "\nAll Deep Dive smoke checks passed.\n",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
