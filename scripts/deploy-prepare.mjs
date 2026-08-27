/**
 * One command to make a hosted database ready.
 *
 * Replaces four manual steps that had to run in the right order with the right
 * environment: switch the Prisma provider, create the tables, seed the question
 * bank, then build the practice schema and its read-only role.
 *
 *   DATABASE_URL="postgresql://..." npm run deploy:prepare
 *
 * Ends by printing exactly what to paste into Vercel.
 */

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syncProvider } from "./set-provider.mjs";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const url = process.env.DATABASE_URL ?? "";
if (!/^postgres(ql)?:\/\//i.test(url)) {
  console.error(
    "\nDATABASE_URL must be a postgres:// connection string.\n\n" +
      'Example:\n  DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npm run deploy:prepare\n\n' +
      "Get one free at https://neon.tech — create a project and copy the connection string.\n",
  );
  process.exit(1);
}

function binScript(pkg) {
  const pkgJsonPath = require.resolve(`${pkg}/package.json`, { paths: [root] });
  const { bin } = require(pkgJsonPath);
  const rel = typeof bin === "string" ? bin : bin[pkg];
  return join(dirname(pkgJsonPath), rel);
}
const run = (pkg, args) =>
  execFileSync(process.execPath, [binScript(pkg), ...args], { cwd: root, stdio: "inherit" });

const step = (n, label) => console.log(`\n[${n}/4] ${label}\n${"-".repeat(60)}`);

step(1, "Pointing Prisma at Postgres");
syncProvider();
run("prisma", ["generate"]);

step(2, "Creating the tables");
run("prisma", ["db", "push", "--skip-generate"]);

step(3, "Loading the question bank");
run("tsx", ["prisma/seed.ts"]);

step(4, "Building the practice schema and its read-only role");
run("tsx", ["scripts/provision-practice.ts"]);

console.log(`
${"=".repeat(60)}
Database is ready.

Set these in Vercel (Project Settings -> Environment Variables), then redeploy:

  DATABASE_URL           the connection string you just used
  PRACTICE_DATABASE_URL  printed by step 4, just above
  APP_URL                https://your-app.vercel.app

Optional, for password-reset emails:
  RESEND_API_KEY         from https://resend.com (free tier)

Note: your local schema.prisma now says postgresql. Running any local command
without DATABASE_URL set switches it back to sqlite automatically.
${"=".repeat(60)}
`);
