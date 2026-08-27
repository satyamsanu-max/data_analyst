/**
 * Keep prisma/schema.prisma's datasource provider in step with DATABASE_URL.
 *
 * Prisma does not accept env() for `provider`, so the value is baked into the
 * file. That meant deploying required hand-editing the schema to "postgresql"
 * and remembering to put it back before working locally — a step that is easy
 * to forget and confusing when you do.
 *
 * This derives it from the connection string instead: a postgres:// URL means
 * postgresql, anything else means sqlite. Committed default stays sqlite so a
 * clone runs with no database to install.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(root, "prisma", "schema.prisma");

export function providerFor(url = process.env.DATABASE_URL ?? "") {
  return /^postgres(ql)?:\/\//i.test(url) ? "postgresql" : "sqlite";
}

export function syncProvider({ quiet = false } = {}) {
  const wanted = providerFor();
  const schema = readFileSync(schemaPath, "utf8");
  const current = schema.match(/datasource\s+db\s*\{[^}]*?provider\s*=\s*"([^"]+)"/s)?.[1];

  if (!current) throw new Error("Could not find the datasource provider in schema.prisma");
  if (current === wanted) return { changed: false, provider: wanted };

  const updated = schema.replace(
    /(datasource\s+db\s*\{[^}]*?provider\s*=\s*")[^"]+(")/s,
    `$1${wanted}$2`,
  );
  writeFileSync(schemaPath, updated);
  if (!quiet) console.log(`Prisma provider: ${current} -> ${wanted} (from DATABASE_URL)`);
  return { changed: true, provider: wanted };
}

if (process.argv[1] && process.argv[1].includes("set-provider")) {
  const { provider } = syncProvider();
  console.log(`Provider is ${provider}.`);
}
