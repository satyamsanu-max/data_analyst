/**
 * Runs every stored SQL reference solution against the practice database and
 * reports which ones execute. Anything that fails is either a genuinely
 * conceptual question or a solution that needs fixing.
 */
import { SQL_QUESTIONS } from "../src/data/sql";
import { runUserQuery } from "../src/lib/practice-db";

(async () => {
  const failures: { id: string; title: string; error: string }[] = [];
  const empty: { id: string; title: string }[] = [];
  let ok = 0;

  for (const q of SQL_QUESTIONS) {
    const sql = q.solution ?? "";
    const res = await runUserQuery(sql);
    if (res.ok) {
      ok++;
      if (res.rowCount === 0) empty.push({ id: q.id, title: q.title });
    } else {
      failures.push({ id: q.id, title: q.title, error: res.error.split("\n")[0].slice(0, 110) });
    }
  }

  console.log(`runnable: ${ok}/${SQL_QUESTIONS.length}`);
  console.log(`\n--- returned zero rows (${empty.length}) ---`);
  for (const e of empty) console.log(`  ${e.id}  ${e.title}`);
  console.log(`\n--- failed to run (${failures.length}) ---`);
  for (const f of failures) console.log(`  ${f.id}  ${f.title}\n        ${f.error}`);
  process.exit(0);
})();
