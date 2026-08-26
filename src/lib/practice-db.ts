/**
 * Runs candidate SQL against the practice dataset.
 *
 * Two drivers, one behaviour:
 *
 *  - **Local dev**: PGlite, a WASM Postgres created in-process. Zero setup, so
 *    `npm install && npm run dev` still works with no database to provision.
 *  - **Hosted**: a `practice` schema inside the app's own Postgres, queried
 *    through a SEPARATE read-only role.
 *
 * The hosted path exists because PGlite costs ~520 MB of RSS and ~3.7 s to boot
 * and seed, which a long-running container absorbs happily but a serverless
 * function does not — it would pay that on every cold start.
 *
 * Safety on the hosted path is layered, and the layers are not redundant:
 *
 *  1. A read-only transaction stops writes.
 *  2. `statement_timeout` stops a runaway query.
 *  3. A dedicated role with no rights on `public` stops a submitted query from
 *     reading application tables. This one is essential — a read-only
 *     transaction alone would happily run `SELECT * FROM public."User"` and
 *     hand back password hashes.
 */

import { PRACTICE_DDL, buildSeedSql } from "./practice-schema";

export { PRACTICE_DDL, PRACTICE_EPOCH, buildSeedSql } from "./practice-schema";

export type QueryResult = {
  ok: true;
  columns: string[];
  /** Truncated for display. */
  rows: unknown[][];
  /**
   * The COMPLETE result set. Grading must use this — comparing the truncated
   * `rows` would wrongly fail any correct query returning more than MAX_ROWS
   * rows in a different order.
   */
  allRows: unknown[][];
  rowCount: number;
  truncated: boolean;
};
export type QueryFailure = { ok: false; error: string };

const MAX_ROWS = 200;
const STATEMENT_TIMEOUT = "5s";

/** The schema the practice tables live in when hosted on real Postgres. */
export const PRACTICE_SCHEMA_NAME = "practice";

type Driver = {
  /** Run one read-only statement and return column names plus row arrays. */
  run(sql: string): Promise<{ columns: string[]; rows: unknown[][] }>;
};

// --------------------------------------------------------------- PGlite
let pgliteDriver: Promise<Driver> | null = null;

function makePgliteDriver(): Promise<Driver> {
  if (!pgliteDriver) {
    pgliteDriver = (async () => {
      const { PGlite } = await import("@electric-sql/pglite");
      const db = new PGlite();
      await db.exec(PRACTICE_DDL);
      await db.exec(buildSeedSql());

      return {
        async run(sql: string) {
          try {
            await db.exec(`BEGIN TRANSACTION READ ONLY; SET LOCAL statement_timeout = '${STATEMENT_TIMEOUT}';`);
            const res = (await db.query(sql)) as {
              rows: Record<string, unknown>[];
              fields?: { name: string }[];
            };
            const columns = res.fields?.map((f) => f.name) ?? Object.keys(res.rows[0] ?? {});
            return { columns, rows: res.rows.map((r) => columns.map((c) => r[c])) };
          } finally {
            await db.exec("ROLLBACK;").catch(() => {});
          }
        },
      };
    })();
  }
  return pgliteDriver;
}

// -------------------------------------------------------------- Postgres
let pgDriver: Driver | null = null;

function makePgDriver(connectionString: string): Driver {
  if (pgDriver) return pgDriver;

  // Imported lazily so the local path never loads pg at all.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg") as typeof import("pg");

  const pool = new Pool({
    connectionString,
    max: 4,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Neon and most managed providers require TLS.
    ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: true },
  });

  pgDriver = {
    async run(sql: string) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN TRANSACTION READ ONLY");
        await client.query(`SET LOCAL statement_timeout = '${STATEMENT_TIMEOUT}'`);
        // Unqualified names resolve inside the practice schema. The role has no
        // rights on `public`, so a fully-qualified reference fails too.
        await client.query(`SET LOCAL search_path = ${PRACTICE_SCHEMA_NAME}`);
        const res = await client.query(sql);
        const columns = res.fields.map((f) => f.name);
        return {
          columns,
          rows: res.rows.map((r: Record<string, unknown>) => columns.map((c) => r[c])),
        };
      } finally {
        await client.query("ROLLBACK").catch(() => {});
        client.release();
      }
    },
  };
  return pgDriver;
}

/**
 * Hosted when PRACTICE_DATABASE_URL is set, otherwise in-process PGlite.
 * The URL must belong to the read-only role, never the application role.
 */
export function practiceDriver(): Promise<Driver> {
  const url = process.env.PRACTICE_DATABASE_URL;
  return url ? Promise.resolve(makePgDriver(url)) : makePgliteDriver();
}

export const isHostedPractice = () => Boolean(process.env.PRACTICE_DATABASE_URL);

/** Warm the local driver. Only meaningful for PGlite. */
export async function getPracticeDb() {
  return practiceDriver();
}

/**
 * Run a user-submitted query. Read-only, time-limited, and — when hosted —
 * confined to the practice schema by role permissions.
 */
export async function runUserQuery(sql: string): Promise<QueryResult | QueryFailure> {
  const trimmed = sql.trim().replace(/;\s*$/, "");
  if (!trimmed) return { ok: false, error: "Write a query first." };

  try {
    const driver = await practiceDriver();
    const { columns, rows } = await driver.run(trimmed);
    return {
      ok: true,
      columns,
      rows: rows.slice(0, MAX_ROWS),
      allRows: rows,
      rowCount: rows.length,
      truncated: rows.length > MAX_ROWS,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
