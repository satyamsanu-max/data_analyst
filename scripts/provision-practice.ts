/**
 * Provision the hosted practice database.
 *
 * Creates a `practice` schema in the app's Postgres, fills it from the same SQL
 * the local PGlite instance uses, and creates a read-only role that can see
 * that schema AND NOTHING ELSE.
 *
 * That last part is the point. Users submit arbitrary SQL to the grader. A
 * read-only transaction stops them writing, but only role permissions stop
 * `SELECT * FROM public."User"` from returning everyone's password hashes.
 *
 *   DATABASE_URL=postgres://...   npx tsx scripts/provision-practice.ts
 *
 * Prints the PRACTICE_DATABASE_URL to set in your deployment.
 */
import { randomBytes } from "node:crypto";
import { Client } from "pg";
import { PRACTICE_DDL, buildSeedSql } from "../src/lib/practice-schema";

const SCHEMA = "practice";
const ROLE = "practice_ro";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`${name} is not set.`);
    process.exit(1);
  }
  return v;
}

/** Rewrite unqualified CREATE TABLE statements into the practice schema. */
function scopeDdl(ddl: string): string {
  return ddl.replace(/CREATE TABLE (\w+)/g, `CREATE TABLE ${SCHEMA}.$1`).replace(
    /REFERENCES (\w+)\(/g,
    `REFERENCES ${SCHEMA}.$1(`,
  );
}

function scopeSeed(seed: string): string {
  return seed.replace(/INSERT INTO (\w+)/g, `INSERT INTO ${SCHEMA}.$1`).replace(
    /FROM (orders|users|products)\b/g,
    `FROM ${SCHEMA}.$1`,
  );
}

(async () => {
  const adminUrl = requireEnv("DATABASE_URL");
  const password = process.env.PRACTICE_ROLE_PASSWORD ?? randomBytes(18).toString("base64url");

  const client = new Client({
    connectionString: adminUrl,
    ssl: adminUrl.includes("localhost") ? undefined : { rejectUnauthorized: true },
  });
  await client.connect();

  console.log("Rebuilding the practice schema...");
  await client.query(`DROP SCHEMA IF EXISTS ${SCHEMA} CASCADE`);
  await client.query(`CREATE SCHEMA ${SCHEMA}`);
  await client.query(scopeDdl(PRACTICE_DDL));

  console.log("Seeding practice data...");
  await client.query(scopeSeed(buildSeedSql()));

  const counts = await client.query(
    `SELECT relname, n_live_tup FROM pg_stat_user_tables WHERE schemaname = $1 ORDER BY relname`,
    [SCHEMA],
  );
  // n_live_tup is an estimate that lags; count the important tables exactly.
  for (const t of ["users", "orders", "order_items", "products", "events"]) {
    const r = await client.query(`SELECT COUNT(*)::int AS n FROM ${SCHEMA}.${t}`);
    console.log(`  ${t.padEnd(12)} ${r.rows[0].n}`);
  }
  if (counts.rowCount === 0) console.warn("  (no tables reported by pg_stat_user_tables)");

  console.log(`\nCreating the read-only role "${ROLE}"...`);
  const exists = await client.query(`SELECT 1 FROM pg_roles WHERE rolname = $1`, [ROLE]);
  if (exists.rowCount) {
    await client.query(`ALTER ROLE ${ROLE} WITH LOGIN PASSWORD '${password.replace("'", "''")}'`);
    console.log("  role already existed; password rotated");
  } else {
    await client.query(`CREATE ROLE ${ROLE} WITH LOGIN PASSWORD '${password.replace("'", "''")}'`);
  }

  // Strip everything, then grant back only the practice schema.
  await client.query(`REVOKE ALL ON SCHEMA public FROM ${ROLE}`);
  await client.query(`REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ${ROLE}`);
  await client.query(`REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM ${ROLE}`);
  await client.query(`REVOKE ALL ON DATABASE ${JSON.stringify(await currentDb(client))} FROM ${ROLE}`).catch(() => {});
  await client.query(`GRANT CONNECT ON DATABASE ${await currentDbIdent(client)} TO ${ROLE}`);
  await client.query(`GRANT USAGE ON SCHEMA ${SCHEMA} TO ${ROLE}`);
  await client.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${SCHEMA} TO ${ROLE}`);
  await client.query(
    `ALTER DEFAULT PRIVILEGES IN SCHEMA ${SCHEMA} GRANT SELECT ON TABLES TO ${ROLE}`,
  );

  // Verify the lockdown rather than assuming it.
  console.log("\nVerifying isolation...");
  const url = new URL(adminUrl);
  url.username = ROLE;
  url.password = password;
  const practiceUrl = url.toString();

  const ro = new Client({
    connectionString: practiceUrl,
    ssl: practiceUrl.includes("localhost") ? undefined : { rejectUnauthorized: true },
  });
  await ro.connect();

  let leaked = false;
  try {
    const r = await ro.query(`SELECT COUNT(*) FROM ${SCHEMA}.users`);
    console.log(`  PASS  can read practice.users (${r.rows[0].count} rows)`);
  } catch (e) {
    console.log(`  FAIL  cannot read practice data: ${(e as Error).message}`);
    process.exitCode = 1;
  }
  for (const table of ['public."User"', 'public."Attempt"', 'public."Session"']) {
    try {
      await ro.query(`SELECT * FROM ${table} LIMIT 1`);
      console.log(`  FAIL  read ${table} — application data is EXPOSED`);
      leaked = true;
    } catch {
      console.log(`  PASS  blocked from ${table}`);
    }
  }
  try {
    await ro.query(`CREATE TABLE ${SCHEMA}.should_not_exist (x int)`);
    console.log("  FAIL  role can create tables");
    leaked = true;
  } catch {
    console.log("  PASS  blocked from writing");
  }
  await ro.end();
  await client.end();

  if (leaked) {
    console.error("\nIsolation check FAILED — do not deploy with this configuration.");
    process.exit(1);
  }

  console.log("\nDone. Set this in your deployment:\n");
  console.log(`PRACTICE_DATABASE_URL="${practiceUrl}"`);
  console.log("\nKeep it secret, but note it only grants SELECT on the practice schema.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function currentDb(c: Client): Promise<string> {
  const r = await c.query("SELECT current_database() AS db");
  return r.rows[0].db;
}
async function currentDbIdent(c: Client): Promise<string> {
  const db = await currentDb(c);
  return `"${db.replace(/"/g, '""')}"`;
}


