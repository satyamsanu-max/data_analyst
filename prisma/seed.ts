import { PrismaClient } from "@prisma/client";
import { ALL_QUESTIONS, COMPANIES, SOURCES, TOPICS, validateBank, CATEGORY_CAPS } from "../src/data";
import { ANSWER_KEYS } from "../src/data/answers";
import { runUserQuery } from "../src/lib/practice-db";

const prisma = new PrismaClient();

async function main() {
  console.log("Validating question bank...");
  const { ok, errors, counts } = validateBank();
  if (!ok) {
    console.error("Question bank failed validation:");
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }

  console.log("Bank OK. Counts against caps:");
  for (const [cat, cap] of Object.entries(CATEGORY_CAPS)) {
    console.log(`  ${cat.padEnd(12)} ${String(counts[cat] ?? 0).padStart(3)} / ${cap}`);
  }
  console.log(`  ${"TOTAL".padEnd(12)} ${String(ALL_QUESTIONS.length).padStart(3)}`);

  console.log("\nSeeding reference data...");
  for (const s of SOURCES) {
    await prisma.source.upsert({
      where: { name: s.name },
      create: { name: s.name, homepage: s.homepage, kind: s.kind, notes: s.notes },
      update: { homepage: s.homepage, kind: s.kind, notes: s.notes },
    });
  }
  for (const c of COMPANIES) {
    await prisma.company.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, bucket: c.bucket },
    });
  }
  for (const t of TOPICS) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      create: t,
      update: { name: t.name, category: t.category, weight: t.weight },
    });
  }

  const topicIds = new Map((await prisma.topic.findMany()).map((t) => [t.slug, t.id]));
  const companyIds = new Map((await prisma.company.findMany()).map((c) => [c.slug, c.id]));
  const sourceIds = new Map((await prisma.source.findMany()).map((s) => [s.name, s.id]));

  // Decide how each question is graded. For SQL we PROVE verifiability by
  // executing the stored reference against the practice database — a flag that
  // could drift out of sync would be worse than no flag at all.
  console.log("\nDetermining grading mode per question...");
  const verification = new Map<string, string>();
  let sqlVerifiable = 0;
  for (const q of ALL_QUESTIONS) {
    if (ANSWER_KEYS[q.id]) {
      verification.set(q.id, "numeric");
      continue;
    }
    if (q.category === "SQL" && q.solution) {
      const res = await runUserQuery(q.solution);
      if (res.ok && res.rowCount > 0) {
        verification.set(q.id, "sql");
        sqlVerifiable++;
        continue;
      }
    }
    verification.set(q.id, "self");
  }
  const numericCount = [...verification.values()].filter((v) => v === "numeric").length;
  console.log(`  sql-graded:     ${sqlVerifiable}`);
  console.log(`  numeric-graded: ${numericCount}`);
  console.log(`  self-graded:    ${ALL_QUESTIONS.length - sqlVerifiable - numericCount}`);

  console.log(`\nSeeding ${ALL_QUESTIONS.length} questions...`);
  let n = 0;
  for (const q of ALL_QUESTIONS) {
    const spec = ANSWER_KEYS[q.id];
    const data = {
      verification: verification.get(q.id) ?? "self",
      answerSpec: spec ? JSON.stringify(spec) : null,
      category: q.category,
      title: q.title,
      topicId: topicIds.get(q.topic)!,
      pattern: q.pattern ?? null,
      difficulty: q.difficulty,
      estimatedMinutes: q.estimatedMinutes,
      sourceId: q.source ? (sourceIds.get(q.source) ?? null) : null,
      sourceUrl: q.sourceUrl ?? null,
      sourceNote: q.sourceNote ?? null,
      frequencyScore: q.frequencyScore,
      patternValue: q.patternValue,
      conceptCoverage: q.conceptCoverage ?? Math.round((q.frequencyScore + q.patternValue) / 2),
      concepts: JSON.stringify(q.concepts ?? []),
      prerequisites: JSON.stringify(q.prerequisites ?? []),
      skillsTested: JSON.stringify(q.skillsTested ?? []),
      prompt: q.prompt ?? null,
      hint: q.hint ?? null,
      solution: q.solution ?? null,
      explanation: q.explanation ?? null,
      framework: q.framework ?? null,
      assumptions: q.assumptions ?? null,
      industry: q.industry ?? null,
      year: q.year ?? null,
    };

    await prisma.question.upsert({ where: { id: q.id }, create: { id: q.id, ...data }, update: data });

    await prisma.questionCompany.deleteMany({ where: { questionId: q.id } });
    for (const slug of q.companyTags ?? []) {
      const companyId = companyIds.get(slug);
      if (companyId) {
        await prisma.questionCompany.create({ data: { questionId: q.id, companyId } });
      }
    }

    if (++n % 100 === 0) console.log(`  ${n}/${ALL_QUESTIONS.length}`);
  }

  // Settings are created per account on first sign-in, so the seeder no longer
  // creates a singleton row.

  console.log("\nSeed complete.");
  const total = await prisma.question.count();
  console.log(`Database now holds ${total} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
