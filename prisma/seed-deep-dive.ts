import { PrismaClient } from "@prisma/client";
import { ALL_DEEP_DIVE, validateDeepDive, contentReport } from "../src/data/deep-dive";
import { SOURCE_TYPE_LABEL } from "../src/data/deep-dive/types";

const prisma = new PrismaClient();

/**
 * Deep Dive seeder.
 *
 * Additive and idempotent by design (spec section 51):
 *   - upserts by stable id, so re-running updates rather than duplicating;
 *   - never deletes a `Question`, a `UserProgress` row, or a plan;
 *   - only ever removes DeepDiveSource rows belonging to a content id it is
 *     currently rewriting, so citations do not accumulate on re-runs.
 *
 * It also asserts, before and after, that it changed nothing about the Daily
 * Practice tables. That check is cheap and it is the guarantee that matters.
 */
async function main() {
  console.log("Validating Deep Dive content...");
  const { ok, errors, warnings } = validateDeepDive(ALL_DEEP_DIVE);
  for (const w of warnings) console.warn("  warning: " + w);
  if (!ok) {
    console.error(`Deep Dive content failed validation (${errors.length} errors):`);
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  console.log(`Content OK: ${ALL_DEEP_DIVE.length} items, ${warnings.length} warnings.`);

  // Baseline: prove we did not touch Daily Practice.
  const before = {
    questions: await prisma.question.count(),
    progress: await prisma.userProgress.count(),
    plans: await prisma.dailyPlan.count(),
    tasks: await prisma.dailyTask.count(),
    attempts: await prisma.attempt.count(),
  };

  console.log("\nSeeding Deep Dive content...");
  let created = 0;
  let updated = 0;

  for (const item of ALL_DEEP_DIVE) {
    const data = {
      domain: item.domain,
      section: item.section,
      contentType: item.contentType,
      category: item.category,
      title: item.title,
      difficulty: item.difficulty ?? "Medium",
      question: item.question ?? null,
      hint: item.hint ?? null,
      interviewAnswer: item.interviewAnswer ?? null,
      detailedExplanation: item.detailedExplanation ?? null,
      explanation: item.explanation ?? null,
      example: item.example ?? null,
      codeBlocks: JSON.stringify(item.code ?? []),
      framework: item.framework ?? null,
      commonMistakes: JSON.stringify(item.commonMistakes ?? []),
      followUps: JSON.stringify(item.followUps ?? []),
      relatedIds: JSON.stringify(item.related ?? []),
      tags: JSON.stringify(item.tags ?? []),
      company: item.company ?? null,
      role: item.role ?? null,
      year: item.year ?? null,
      sourceType: item.sourceType,
      confidence: item.confidence ?? "medium",
      existingQuestionId: item.existingQuestionId ?? null,
      // Belt and braces. The defaults already say this; stating it on every
      // write means no future edit can quietly flip a row into Daily Practice.
      isDeepDive: true,
      isDailyPracticeEligible: false,
    };

    const existing = await prisma.deepDiveContent.findUnique({
      where: { id: item.id },
      select: { id: true },
    });

    await prisma.deepDiveContent.upsert({
      where: { id: item.id },
      create: { id: item.id, ...data },
      update: data,
    });
    existing ? updated++ : created++;

    // Replace this item's citations only.
    await prisma.deepDiveSource.deleteMany({ where: { contentId: item.id } });
    for (const s of item.sources) {
      await prisma.deepDiveSource.create({
        data: {
          contentId: item.id,
          sourceType: s.kind,
          name: s.name,
          title: s.title ?? null,
          url: s.url ?? null,
          page: s.page ?? null,
          evidence: s.evidence ?? null,
        },
      });
    }
  }

  const after = {
    questions: await prisma.question.count(),
    progress: await prisma.userProgress.count(),
    plans: await prisma.dailyPlan.count(),
    tasks: await prisma.dailyTask.count(),
    attempts: await prisma.attempt.count(),
  };

  const drift = Object.keys(before).filter(
    (k) => before[k as keyof typeof before] !== after[k as keyof typeof after],
  );
  if (drift.length) {
    console.error(`\nFAILED: the Deep Dive seed changed Daily Practice tables: ${drift.join(", ")}`);
    console.error("before:", before, "\nafter: ", after);
    process.exit(1);
  }

  // ------------------------------------------------------------- the report
  const rep = contentReport(ALL_DEEP_DIVE);
  console.log(`\n${created} created, ${updated} updated.\n`);
  console.log("CONTENT REPORT");
  console.log("=".repeat(62));
  for (const [section, types] of Object.entries(rep.bySection).sort()) {
    const parts = Object.entries(types)
      .map(([t, n]) => `${n} ${t.toLowerCase().replace("_", " ")}`)
      .join(", ");
    console.log(`  ${section.padEnd(24)} ${parts}`);
  }
  console.log("\nBY SOURCE LABEL");
  for (const [k, n] of Object.entries(rep.bySourceType).sort((a, b) => b[1] - a[1])) {
    console.log(
      `  ${(SOURCE_TYPE_LABEL[k as keyof typeof SOURCE_TYPE_LABEL] ?? k).padEnd(28)} ${String(n).padStart(4)}`,
    );
  }
  console.log("\nBY CITATION KIND");
  for (const [k, n] of Object.entries(rep.byCitation).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(28)} ${String(n).padStart(4)}`);
  }
  console.log(`\n  Total items                  ${String(rep.total).padStart(4)}`);
  console.log(`  Questions with 2+ sources    ${String(rep.multiSource).padStart(4)}`);
  console.log(`  Without company attribution  ${String(rep.noCompany).padStart(4)}`);
  console.log(`  Without a year               ${String(rep.noYear).padStart(4)}`);
  console.log("\nDaily Practice tables unchanged:", before);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
