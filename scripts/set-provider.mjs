/**
 * Keep prisma/schema.prisma's datasource block in step with DATABASE_URL.
 *
 * Prisma does not accept env() for `provider`, so the value is baked into the
 * file. That meant deploying required hand-editing the schema to "postgresql"
 * and remembering to put it back before working locally — a step that is easy
 * to forget and confusing when you do.
 *
 * This derives it from the connection string instead: a postgres:// URL means
 * postgresql, anything else means sqlite. Committed default stays sqlite so a
 * clone runs with no database to install.
 *
 * `directUrl` is managed the same way, and for the same reason. It only makes
 * sense against a pooled Postgres connection (Neon's direct, non-pooled URL,
 * used for migrations) — SQLite has no such concept. But `env("DIRECT_URL")`
 * throws if that variable is merely *absent*, regardless of which provider is
 * active, so a schema committed with the line present breaks every fresh
 * clone's SQLite setup even though nothing SQLite does touches it. This keeps
 * the line's presence tied to the provider, exactly like the provider value
 * itself, so `.env.example` never needs to define DIRECT_URL for local dev.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(root, "prisma", "schema.prisma");

export function providerFor(url = process.env.DATABASE_URL ?? "") {
  return /^postgres(ql)?:\/\//i.test(url) ? "postgresql" : "sqlite";
}

const DATASOURCE_RE = /datasource\s+db\s*\{[^}]*\}/s;
const DIRECT_URL_LINE_RE = /\n\s*directUrl\s*=\s*env\("DIRECT_URL"\)/;

export function syncProvider({ quiet = false } = {}) {
  const wanted = providerFor();
  const schema = readFileSync(schemaPath, "utf8");

  const block = schema.match(DATASOURCE_RE)?.[0];
  if (!block) throw new Error("Could not find the datasource block in schema.prisma");

  const current = block.match(/provider\s*=\s*"([^"]+)"/)?.[1];
  if (!current) throw new Error("Could not find the datasource provider in schema.prisma");

  const hasDirectUrl = DIRECT_URL_LINE_RE.test(block);
  const wantsDirectUrl = wanted === "postgresql";

  if (current === wanted && hasDirectUrl === wantsDirectUrl) {
    return { changed: false, provider: wanted };
  }

  let updatedBlock = block.replace(/(provider\s*=\s*")[^"]+(")/, `$1${wanted}$2`);

  if (wantsDirectUrl && !hasDirectUrl) {
    updatedBlock = updatedBlock.replace(
      /(url\s*=\s*env\("DATABASE_URL"\))/,
      `$1\n  directUrl = env("DIRECT_URL")`,
    );
  } else if (!wantsDirectUrl && hasDirectUrl) {
    updatedBlock = updatedBlock.replace(DIRECT_URL_LINE_RE, "");
  }

  writeFileSync(schemaPath, schema.replace(DATASOURCE_RE, updatedBlock));

  if (!quiet) {
    const parts = [`provider: ${current} -> ${wanted}`];
    if (wantsDirectUrl !== hasDirectUrl) {
      parts.push(wantsDirectUrl ? "added directUrl" : "removed directUrl");
    }
    console.log(`Prisma datasource: ${parts.join(", ")} (from DATABASE_URL)`);
  }
  return { changed: true, provider: wanted };
}

if (process.argv[1] && process.argv[1].includes("set-provider")) {
  const { provider } = syncProvider();
  console.log(`Provider is ${provider}.`);
}
