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
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");
const envExamplePath = join(root, ".env.example");
const dbPath = join(root, "prisma", "dev.db");

// Resolve the platform-specific binary rather than using `shell: true`, which
// Node deprecates when arguments are passed alongside it.
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const run = (args) => execFileSync(npx, args, { cwd: root, stdio: "inherit" });

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
  run(["prisma", "generate"]);
  run(["prisma", "db", "push", "--skip-generate"]);
  run(["tsx", "prisma/seed.ts"]);
  didSomething = true;
} else if (didSomething) {
  // .env was just created but a database already existed: make sure the
  // generated client is present before the app boots.
  run(["prisma", "generate"]);
}

if (didSomething) console.log("Setup complete.\n");
