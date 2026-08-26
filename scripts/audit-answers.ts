/**
 * Verify each numeric answer key against the question it is attached to.
 *
 * The real test: does the expected value actually appear in that question's own
 * stored solution? If it does not, the key belongs to a different question.
 *
 * This exists because the first version of answers.ts was keyed by question id,
 * and 39 of 70 keys landed on the wrong question. `npm test` runs the same check
 * so it can never regress silently.
 */
import { resolveAnswerKeys, type AnswerSpec } from "../src/data/answers";
import { ALL_QUESTIONS } from "../src/data";
import { parseAnswer } from "../src/lib/verify/numeric";

/** Number, optionally followed by a magnitude suffix or a percent marker. */
const TOKEN =
  /-?\d[\d,]*(?:\.\d+)?\s*(?:\/\s*\d[\d,]*(?:\.\d+)?|%|percent|thousand|million|billion|trillion|crore|lakh|[kmbt])?/gi;

/** Every value a reader could reasonably extract from this text. */
export function candidateValues(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(TOKEN)) {
    const whole = parseAnswer(m[0]);
    if (whole !== null) out.push(whole);
    // Also consider the bare number and its percent reading, since a solution
    // may say "2.5 percent" where the key stores 0.025.
    const bare = Number(m[0].replace(/[^\d.-]/g, ""));
    if (Number.isFinite(bare)) out.push(bare, bare / 100);
  }
  if (/\b1\s*\/\s*e\b/i.test(text)) out.push(Math.exp(-1));
  return out.filter(Number.isFinite);
}

const close = (a: number, b: number) =>
  b === 0 ? Math.abs(a) < 1e-9 : Math.abs(a - b) / Math.abs(b) < 0.05;

export function auditAnswerKeys() {
  const questionById = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));
  const { byId: keys, unmatched } = resolveAnswerKeys(ALL_QUESTIONS);

  const misaligned: { id: string; title: string; expected: number; solution: string }[] = [];
  let aligned = 0;

  for (const [id, spec] of Object.entries(keys) as [string, AnswerSpec][]) {
    const q = questionById.get(id)!;
    const haystack = `${q.solution ?? ""} ${q.explanation ?? ""} ${spec.note ?? ""}`;
    if (candidateValues(haystack).some((n) => close(n, spec.value))) {
      aligned++;
    } else {
      misaligned.push({
        id,
        title: q.title,
        expected: spec.value,
        solution: (q.solution ?? "").replace(/\n/g, " ").slice(0, 150),
      });
    }
  }
  return { total: Object.keys(keys).length, aligned, misaligned, unmatched };
}

if (process.argv[1]?.includes("audit-answers")) {
  const r = auditAnswerKeys();
  console.log(`numeric keys:                ${r.total}`);
  console.log(`value found in its solution: ${r.aligned}`);
  if (r.unmatched.length) {
    console.log(`\n=== TITLES MATCHING NO QUESTION (${r.unmatched.length}) ===`);
    for (const t of r.unmatched) console.log("  - " + t);
  }
  console.log(`\n=== MISALIGNED (${r.misaligned.length}) ===`);
  for (const m of r.misaligned) {
    console.log(`  ${m.id}  ${m.title}\n     expects: ${m.expected}\n     solution: ${m.solution}\n`);
  }
}
