/**
 * The SQL practice database.
 *
 * A real Postgres instance (PGlite / WASM) seeded with deterministic fake data,
 * so SQL questions can be genuinely graded instead of self-reported: we run your
 * query AND the reference solution against the same data and compare result sets.
 *
 * Determinism matters — a seeded PRNG means the expected output of a reference
 * solution never changes between runs, so grading is stable.
 *
 * User queries run inside a READ ONLY transaction with a statement timeout, so a
 * submitted query cannot mutate or wedge the shared instance.
 */

import { PGlite } from "@electric-sql/pglite";

// ---------------------------------------------------------------- PRNG
/** Mulberry32 — small, fast, deterministic. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, arr: T[]): T => arr[Math.floor(r() * arr.length)];
const int = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
const money = (r: () => number, lo: number, hi: number) => Math.round((lo + r() * (hi - lo)) * 100) / 100;

const day = (base: string, offset: number) => {
  const d = new Date(base + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
};
const ts = (base: string, offsetDays: number, hour: number, min: number) => {
  const d = new Date(base + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(hour, min, 0, 0);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const q = (s: string) => "'" + s.replace(/'/g, "''") + "'";

export const PRACTICE_DDL = `
CREATE TABLE users (
  user_id     INT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  country     TEXT NOT NULL,
  signup_date DATE NOT NULL,
  plan        TEXT NOT NULL
);
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL,
  cost       NUMERIC(10,2) NOT NULL,
  list_price NUMERIC(10,2) NOT NULL
);
CREATE TABLE orders (
  order_id     INT PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(user_id),
  order_date   DATE NOT NULL,
  amount       NUMERIC(10,2),
  status       TEXT NOT NULL,
  delivered_at DATE
);
CREATE TABLE order_items (
  order_item_id INT PRIMARY KEY,
  order_id      INT NOT NULL REFERENCES orders(order_id),
  product_id    INT NOT NULL REFERENCES products(product_id),
  quantity      INT NOT NULL,
  unit_price    NUMERIC(10,2) NOT NULL
);
CREATE TABLE payments (
  payment_id INT PRIMARY KEY,
  order_id   INT NOT NULL REFERENCES orders(order_id),
  paid_at    TIMESTAMP NOT NULL,
  amount     NUMERIC(10,2) NOT NULL,
  method     TEXT NOT NULL
);
CREATE TABLE sessions (
  session_id INT PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(user_id),
  started_at TIMESTAMP NOT NULL,
  ended_at   TIMESTAMP,
  platform   TEXT NOT NULL
);
CREATE TABLE events (
  event_id   INT PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(user_id),
  event_name TEXT NOT NULL,
  event_time TIMESTAMP NOT NULL,
  device     TEXT NOT NULL,
  session_id INT
);
CREATE TABLE employees (
  emp_id     INT PRIMARY KEY,
  name       TEXT NOT NULL,
  manager_id INT,
  department TEXT NOT NULL,
  salary     NUMERIC(10,2) NOT NULL,
  hire_date  DATE NOT NULL
);
CREATE TABLE subscriptions (
  sub_id     INT PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(user_id),
  started_on DATE NOT NULL,
  ended_on   DATE,
  mrr        NUMERIC(10,2) NOT NULL,
  tier       TEXT NOT NULL
);
CREATE TABLE campaigns (
  campaign_id INT PRIMARY KEY,
  name        TEXT NOT NULL,
  channel     TEXT NOT NULL,
  spend       NUMERIC(10,2) NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL
);
CREATE TABLE refunds (
  refund_id   INT PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(user_id),
  order_id    INT NOT NULL REFERENCES orders(order_id),
  amount      NUMERIC(10,2) NOT NULL,
  refunded_at DATE NOT NULL
);
CREATE TABLE user_profiles (
  profile_id INT PRIMARY KEY,
  user_id    INT NOT NULL,
  name       TEXT NOT NULL,
  city       TEXT,
  updated_at TIMESTAMP NOT NULL
);
CREATE TABLE orders_archive (
  order_id   INT PRIMARY KEY,
  user_id    INT NOT NULL,
  order_date DATE NOT NULL,
  amount     NUMERIC(10,2),
  status     TEXT NOT NULL
);
CREATE TABLE warehouse_users (user_id INT PRIMARY KEY);
CREATE TABLE source_users    (user_id INT PRIMARY KEY);
CREATE TABLE experiment_assignments (
  user_id   INT PRIMARY KEY,
  variant   TEXT NOT NULL,
  converted BOOLEAN NOT NULL
);
CREATE TABLE inventory (
  product_id INT PRIMARY KEY REFERENCES products(product_id),
  on_hand    INT NOT NULL
);
`;

const COUNTRIES = ["India", "United States", "United Kingdom", "Germany", "Australia", "Canada"];
const PLANS = ["free", "basic", "pro", "enterprise"];
const CATEGORIES = ["Electronics", "Home", "Grocery", "Apparel", "Beauty", "Sports"];
const STATUSES = ["placed", "shipped", "delivered", "cancelled", "returned"];
const METHODS = ["card", "upi", "netbanking", "wallet"];
const DEVICES = ["ios", "android", "web", "email", "social", "search"];
const DEPARTMENTS = ["Analytics", "Engineering", "Marketing", "Sales", "Support"];
const TIERS = ["basic", "pro", "enterprise"];
const EVENTS = ["product_view", "add_to_cart", "checkout", "purchase", "campaign_click", "login"];
const FIRST = ["Aarav", "Diya", "Ishaan", "Meera", "Rohan", "Sara", "Kabir", "Anika", "Vivaan", "Riya", "Arjun", "Nisha", "Dev", "Tara", "Karan", "Priya"];
const LAST = ["Sharma", "Patel", "Reddy", "Iyer", "Khan", "Bose", "Nair", "Gupta", "Mehta", "Singh"];

/** Activity starts here and runs to the present day. */
export const PRACTICE_EPOCH = "2024-01-01";

/**
 * Days from the epoch to today. Activity is spread across the whole span so
 * that BOTH styles of question have data: those pinned to calendar 2024, and
 * those using rolling CURRENT_DATE windows.
 */
export const PRACTICE_SPAN_DAYS = Math.max(
  400,
  Math.floor((Date.now() - new Date(PRACTICE_EPOCH + "T00:00:00Z").getTime()) / 86_400_000),
);

export function buildSeedSql(): string {
  const r = rng(20260826);
  const out: string[] = [];

  // ---- users
  const NUSERS = 300;
  for (let i = 1; i <= NUSERS; i++) {
    const name = `${pick(r, FIRST)} ${pick(r, LAST)}`;
    const email = `user${i}@${pick(r, ["gmail.com", "outlook.com", "company.co", "yahoo.com"])}`;
    out.push(
      `INSERT INTO users VALUES (${i}, ${q(name)}, ${q(email)}, ${q(pick(r, COUNTRIES))}, ${q(day(PRACTICE_EPOCH, int(r, 0, PRACTICE_SPAN_DAYS)))}, ${q(pick(r, PLANS))});`,
    );
  }

  // ---- products
  // A handful of names carry "Pro"/"Prime" so string-matching questions have hits,
  // and the last few products are never ordered so anti-join questions have rows.
  const NPROD = 60;
  const ORDERABLE = 54;
  const SUFFIX = ["Pro", "Lite", "Max", "Prime", "Mini", "Plus"];
  for (let i = 1; i <= NPROD; i++) {
    const cost = money(r, 50, 900);
    const list = Math.round(cost * (1.2 + r() * 0.9) * 100) / 100;
    const cat = pick(r, CATEGORIES);
    const name = `${cat} ${pick(r, SUFFIX)} ${i}`;
    out.push(`INSERT INTO products VALUES (${i}, ${q(name)}, ${q(cat)}, ${cost}, ${list});`);
    out.push(`INSERT INTO inventory VALUES (${i}, ${int(r, 0, 900)});`);
  }

  // ---- orders + items + payments + refunds
  const NORD = 2000;
  let itemId = 1;
  let payId = 1;
  let refundId = 1;
  for (let i = 1; i <= NORD; i++) {
    const uid = int(r, 1, NUSERS);
    const offset = int(r, 0, PRACTICE_SPAN_DAYS);
    const odate = day(PRACTICE_EPOCH, offset);
    const status = pick(r, STATUSES);
    const nItems = int(r, 1, 4);
    let total = 0;
    const lines: string[] = [];
    for (let k = 0; k < nItems; k++) {
      const pid = int(r, 1, ORDERABLE);
      const qty = int(r, 1, 3);
      const price = money(r, 60, 1500);
      total += qty * price;
      lines.push(`INSERT INTO order_items VALUES (${itemId++}, ${i}, ${pid}, ${qty}, ${price});`);
    }
    total = Math.round(total * 100) / 100;
    // A few orders legitimately have a NULL amount, so NULL-handling questions bite.
    const amount = r() < 0.02 ? "NULL" : String(total);
    const delivered = status === "delivered" ? q(day(PRACTICE_EPOCH, offset + int(r, 1, 9))) : "NULL";
    out.push(
      `INSERT INTO orders VALUES (${i}, ${uid}, ${q(odate)}, ${amount}, ${q(status)}, ${delivered});`,
    );
    out.push(...lines);
    if (status !== "cancelled" && amount !== "NULL") {
      out.push(
        `INSERT INTO payments VALUES (${payId++}, ${i}, ${q(ts(PRACTICE_EPOCH, offset, int(r, 8, 22), int(r, 0, 59)))}, ${total}, ${q(pick(r, METHODS))});`,
      );
    }
    if (status === "returned") {
      out.push(
        `INSERT INTO refunds VALUES (${refundId++}, ${uid}, ${i}, ${Math.round(total * 100) / 100}, ${q(day(PRACTICE_EPOCH, offset + int(r, 2, 20)))});`,
      );
    }
  }

  // Duplicate orders on purpose, so duplicate-detection questions have something to find.
  for (let d = 0; d < 6; d++) {
    const src = int(r, 1, NORD);
    out.push(
      `INSERT INTO orders SELECT ${NORD + d + 1}, user_id, order_date, amount, status, delivered_at FROM orders WHERE order_id = ${src};`,
    );
  }

  // ---- sessions + events
  const NSESS = 1500;
  let eventId = 1;
  for (let s = 1; s <= NSESS; s++) {
    const uid = int(r, 1, NUSERS);
    const offset = int(r, 0, PRACTICE_SPAN_DAYS);
    const hour = int(r, 6, 23);
    const startMin = int(r, 0, 40);
    out.push(
      `INSERT INTO sessions VALUES (${s}, ${uid}, ${q(ts(PRACTICE_EPOCH, offset, hour, startMin))}, ${q(ts(PRACTICE_EPOCH, offset, hour, startMin + int(r, 2, 19)))}, ${q(pick(r, ["ios", "android", "web"]))});`,
    );
    // Funnel-shaped event sequence so funnel/sessionisation questions behave sensibly.
    const depth = r();
    const steps = depth < 0.5 ? 1 : depth < 0.75 ? 2 : depth < 0.9 ? 3 : 4;
    for (let k = 0; k < steps; k++) {
      out.push(
        `INSERT INTO events VALUES (${eventId++}, ${uid}, ${q(EVENTS[k])}, ${q(ts(PRACTICE_EPOCH, offset, hour, startMin + k * 3))}, ${q(pick(r, DEVICES))}, ${s});`,
      );
    }
    if (r() < 0.25) {
      out.push(
        `INSERT INTO events VALUES (${eventId++}, ${uid}, 'campaign_click', ${q(ts(PRACTICE_EPOCH, offset, hour, startMin - 1))}, ${q(pick(r, DEVICES))}, ${s});`,
      );
    }
  }

  // ---- employees (with a real manager hierarchy)
  const NEMP = 60;
  for (let i = 1; i <= NEMP; i++) {
    const managerId = i <= 3 ? "NULL" : String(int(r, 1, Math.max(3, Math.floor(i / 3))));
    out.push(
      `INSERT INTO employees VALUES (${i}, ${q(pick(r, FIRST) + " " + pick(r, LAST))}, ${managerId}, ${q(pick(r, DEPARTMENTS))}, ${money(r, 40000, 220000)}, ${q(day(PRACTICE_EPOCH, -int(r, 0, 2000)))});`,
    );
  }

  // ---- subscriptions
  for (let i = 1; i <= 200; i++) {
    const start = int(r, 0, PRACTICE_SPAN_DAYS);
    const churned = r() < 0.45;
    out.push(
      `INSERT INTO subscriptions VALUES (${i}, ${int(r, 1, NUSERS)}, ${q(day(PRACTICE_EPOCH, start))}, ${churned ? q(day(PRACTICE_EPOCH, start + int(r, 30, 300))) : "NULL"}, ${money(r, 9, 499)}, ${q(pick(r, TIERS))});`,
    );
  }

  // ---- campaigns
  const CHANNELS = ["search", "social", "email", "affiliate"];
  for (let i = 1; i <= 12; i++) {
    const start = int(r, 0, PRACTICE_SPAN_DAYS);
    out.push(
      `INSERT INTO campaigns VALUES (${i}, ${q("Campaign " + i)}, ${q(CHANNELS[i % CHANNELS.length])}, ${money(r, 5000, 90000)}, ${q(day(PRACTICE_EPOCH, start))}, ${q(day(PRACTICE_EPOCH, start + int(r, 10, 45)))});`,
    );
  }

  // ---- user_profiles (deliberately multi-row per user, for dedup questions)
  let profileId = 1;
  for (let u = 1; u <= 120; u++) {
    const copies = int(r, 1, 3);
    for (let c = 0; c < copies; c++) {
      out.push(
        `INSERT INTO user_profiles VALUES (${profileId++}, ${u}, ${q(pick(r, FIRST) + " " + pick(r, LAST))}, ${q(pick(r, ["mumbai", "Mumbai", "MUMBAI", "Bombay", "Delhi", " Pune "]))}, ${q(ts(PRACTICE_EPOCH, int(r, 0, PRACTICE_SPAN_DAYS), int(r, 0, 23), int(r, 0, 59)))});`,
      );
    }
  }

  // ---- orders_archive
  out.push(
    `INSERT INTO orders_archive SELECT order_id + 100000, user_id, order_date, amount, status FROM orders WHERE order_date < DATE '2024-04-01';`,
  );

  // ---- reconciliation tables (deliberately mismatched)
  out.push(`INSERT INTO warehouse_users SELECT user_id FROM users;`);
  out.push(`INSERT INTO source_users SELECT user_id FROM users WHERE user_id % 17 <> 0;`);

  // ---- experiment
  for (let u = 1; u <= NUSERS; u++) {
    const variant = u % 2 === 0 ? "treatment" : "control";
    const base = variant === "treatment" ? 0.056 : 0.05;
    out.push(
      `INSERT INTO experiment_assignments VALUES (${u}, ${q(variant)}, ${r() < base * 3 ? "TRUE" : "FALSE"});`,
    );
  }

  return out.join("\n");
}

// ---------------------------------------------------------------- runtime
let dbPromise: Promise<PGlite> | null = null;

export function getPracticeDb(): Promise<PGlite> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = new PGlite();
      await db.exec(PRACTICE_DDL);
      await db.exec(buildSeedSql());
      return db;
    })();
  }
  return dbPromise;
}

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

function normaliseRows(res: { rows: Record<string, unknown>[]; fields?: { name: string }[] }) {
  const columns = res.fields?.map((f) => f.name) ?? Object.keys(res.rows[0] ?? {});
  const rows = res.rows.map((row) => columns.map((c) => (row as Record<string, unknown>)[c]));
  return { columns, rows };
}

/**
 * Run a user-submitted query. Read-only transaction + statement timeout, so a
 * submission can neither mutate the practice data nor hang the shared instance.
 */
export async function runUserQuery(sql: string): Promise<QueryResult | QueryFailure> {
  const trimmed = sql.trim().replace(/;\s*$/, "");
  if (!trimmed) return { ok: false, error: "Write a query first." };

  const db = await getPracticeDb();
  try {
    await db.exec("BEGIN TRANSACTION READ ONLY; SET LOCAL statement_timeout = '5s';");
    const res = await db.query(trimmed);
    const { columns, rows } = normaliseRows(res as never);
    return {
      ok: true,
      columns,
      rows: rows.slice(0, MAX_ROWS),
      allRows: rows,
      rowCount: rows.length,
      truncated: rows.length > MAX_ROWS,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  } finally {
    try {
      await db.exec("ROLLBACK;");
    } catch {
      /* transaction already aborted */
    }
  }
}
