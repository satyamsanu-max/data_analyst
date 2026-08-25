/**
 * First-run guard.
 *
 * A fresh clone has no `.env` (it is gitignored) and no `prisma/dev.db`, so
 * Prisma fails with "Environment variable not found: DATABASE_URL" the moment
 * any page touches the database. This script makes `npm run dev` work straight
 * out of a clone by creating whatever is missing — and does nothing at all once
 * the project is already set up.
 *
 * It only ever CREATES. It never resets or drops an existing database.
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");
const envExamplePath = join(root, ".env.example");
const dbPath = join(root, "prisma", "dev.db");

const require = createRequire(import.meta.url);

/**
 * Resolve a dependency's CLI entry script from its package.json `bin` field.
 *
 * We deliberately do NOT shell out to `npx`: on Windows that means spawning
 * `npx.cmd`, which Node refuses to run without `shell: true` (EINVAL), and
 * `shell: true` alongside arguments is itself deprecated. Running the resolved
 * .js entry point with the current Node binary sidesteps both problems and is
 * faster, since it skips npx's own resolution step.
 */
function binScript(pkg) {
  const pkgJsonPath = require.resolve(`${pkg}/package.json`, { paths: [root] });
  const { bin } = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const rel = typeof bin === "string" ? bin : bin[pkg];
  if (!rel) throw new Error(`Could not find a CLI entry point for "${pkg}"`);
  return join(dirname(pkgJsonPath), rel);
}

const run = (pkg, args) =>
  execFileSync(process.execPath, [binScript(pkg), ...args], { cwd: root, stdio: "inherit" });

let didSomething = false;

// 1. Environment file
if (!existsSync(envPath)) {
  if (!existsSync(envExamplePath)) {
    console.error("Missing both .env and .env.example — cannot determine DATABASE_URL.");
    process.exit(1);
  }
  copyFileSync(envExamplePath, envPath);
  console.log("Created .env from .env.example");
  didSomething = true;
}

// Guard against an .env that exists but has no DATABASE_URL in it.
if (!/^\s*DATABASE_URL\s*=/m.test(readFileSync(envPath, "utf8"))) {
  console.error(
    'Your .env exists but does not define DATABASE_URL.\nAdd this line to it:\n\n  DATABASE_URL="file:./dev.db"\n',
  );
  process.exit(1);
}

// 2. Database + seeded question bank
if (!existsSync(dbPath)) {
  console.log("No local database found — creating and seeding it (first run only)...");
  run("prisma", ["generate"]);
  run("prisma", ["db", "push", "--skip-generate"]);
  run("tsx", ["prisma/seed.ts"]);
  didSomething = true;
} else if (didSomething) {
  // .env was just created but a database already existed: make sure the
  // generated client is present before the app boots.
  run("prisma", ["generate"]);
}

if (didSomething) console.log("Setup complete.\n");
