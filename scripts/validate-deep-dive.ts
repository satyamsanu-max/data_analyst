import { ALL_DEEP_DIVE, validateDeepDive, contentReport } from "../src/data/deep-dive";

/**
 * Content validation with no database involved, so it can run in CI or before a
 * commit without a provisioned DB.
 */
const { ok, errors, warnings } = validateDeepDive(ALL_DEEP_DIVE);
const rep = contentReport(ALL_DEEP_DIVE);

console.log(`Deep Dive: ${rep.total} items across ${Object.keys(rep.bySection).length} sections.`);

for (const w of warnings) console.warn("warning: " + w);

if (!ok) {
  console.error(`\n${errors.length} errors:`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log(`OK — no errors, ${warnings.length} warnings.`);
for (const [section, types] of Object.entries(rep.bySection).sort()) {
  const parts = Object.entries(types)
    .map(([t, n]) => `${n} ${t.toLowerCase()}`)
    .join(", ");
  console.log(`  ${section.padEnd(24)} ${parts}`);
}
