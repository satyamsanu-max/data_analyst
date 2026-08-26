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
import { createRequire } from "node:module";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");
const envExamplePath = join(root, ".env.example");
const dbPath = join(root, "prisma", "dev.db");

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

/**
 * Hosted builds bring their own database and run migrations deliberately, so
 * this first-run helper must not fire there. Without the guard, a Vercel build
 * would try to create a local SQLite file and seed it.
 */
const hosted =
  process.env.VERCEL === "1" ||
  process.env.CI === "true" ||
  (process.env.DATABASE_URL ?? "").startsWith("postgres");

if (hosted) {
  console.log("Hosted environment detected - skipping local first-run setup.");
  process.exit(0);
}

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

/**
 * Is the database actually usable, or merely present?
 *
 * Checking only that the file exists is not enough. Prisma creates an empty
 * SQLite file the moment anything connects, so a run that failed before
 * `db push` leaves a file behind that looks fine and then fails at request time
 * with "The table `main.Question` does not exist". Verify the schema is applied
 * AND the bank is seeded.
 */
function databaseState() {
  if (!existsSync(dbPath)) return "missing";
  try {
    const { DatabaseSync } = require("node:sqlite");
    const db = new DatabaseSync(dbPath, { readOnly: true });
    try {
      const hasTable = db
        .prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name='Question'")
        .get().n;
      if (!hasTable) return "no-schema";
      const rows = db.prepare("SELECT COUNT(*) AS n FROM Question").get().n;
      return rows > 0 ? "ready" : "empty";
    } finally {
      db.close();
    }
  } catch {
    // Cannot introspect (older Node, locked file). Treat as unknown and let
    // Prisma decide — `db push` and the seeder are both idempotent.
    return "unknown";
  }
}

// 2. Database + seeded question bank
const state = databaseState();
if (state !== "ready") {
  const why = {
    missing: "No local database found",
    "no-schema": "The database exists but has no tables",
    empty: "The database has no questions",
    unknown: "Could not inspect the database",
  }[state];
  console.log(`${why} — creating and seeding it...`);
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
