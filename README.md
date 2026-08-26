# Interview Prep — Data Analyst / Data Science

A LeetCode-style daily practice system built around one constraint:

> **Maximum interview preparation value per 150 minutes.**

The app is not trying to make you do more questions. It is trying to spend a fixed
daily time budget on the highest-value questions available to you *right now* —
weighted by interview frequency, reusable pattern value, your measured weak spots,
and the companies you are targeting.

---

## Quick start

```bash
npm install && npm run dev
```

Then open <http://localhost:3000>.

That is genuinely all. On first run the app creates its own `.env`, creates
`prisma/dev.db`, and seeds all 588 questions before the dev server starts — it
prints what it is doing and takes a few seconds. Subsequent runs skip straight to
the server. No cloud account, no API keys.

Then create an account at `/signup`. Every account gets its own plan, streak,
mastery and settings.

`.env` is gitignored (it is machine-local config, not source), which is why the
first-run guard exists: a fresh clone has no `.env`, and without one Prisma fails
with `Environment variable not found: DATABASE_URL`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app on port 3000, setting up first if needed |
| `npm run setup` | Run the first-run setup explicitly (safe to re-run; creates only what is missing) |
| `npm run db:seed` | Re-seed questions (idempotent upsert) |
| `npm run db:setup` | Force a full generate + push + seed |
| `npm run db:reset` | **Destructive** — drop the DB and re-seed from scratch |
| `npm test` | Scheduler, question-bank and grading test suites |
| `npm run smoke` | End-to-end plan/swap check against the real DB |
| `npm run smoke:verify` | End-to-end grading check (SQL judge, numeric, timer) |
| `npm run smoke:isolation` | Proves two accounts cannot see or damage each other's data |
| `npm run build` | Production build |

---

## What is in the box

### The question bank — 588 curated questions

Selection rule throughout: **the smallest set that covers the most interview
surface**, not the largest pile of problems.

| Category | Seeded | Cap | Notes |
| --- | ---: | ---: | --- |
| DSA | 230 | 300 | Every pattern in the brief, one canonical problem per technique |
| SQL | 77 | 100 | Original problems against a shared practice schema, with solutions |
| Probability | 62 | 100 | Classic interview problems, restated, with worked answers |
| Statistics | 61 | 100 | Practical analyst statistics, heavy on A/B testing |
| ML | 62 | 120 | Concept questions with the answer an interviewer is listening for |
| Python | 61 | 120 | pandas-first, plus core Python and coding problems |
| Guesstimate | 35 | 50 | Market sizing, volume, revenue, ops, and business cases |

Caps are enforced by `validateBank()` in `src/data/index.ts`, which the seeder runs
before it writes a single row, and which `npm test` asserts independently.

### Sourcing and attribution

Every question stores a source name, a source URL, and a note explaining the
relationship to that source. The rules applied while building the bank:

- **DSA** — titles and links point at the canonical hosted problem (LeetCode),
  cross-referenced against the NeetCode roadmap and Striver A2Z sheet for pattern
  coverage. The stored `prompt` is our own **one-line restatement**; the copyrighted
  problem statement is never copied. The question page says so explicitly and sends
  you to the source for the full statement, constraints, and tests.
- **SQL** — every problem is written from scratch against the practice schema shown
  on each SQL question page. Where a published problem inspired the concept (e.g.
  the LeetCode SQL 50 study plan), it is cited and linked.
- **Probability / Statistics / ML / Python** — classic interview concepts, restated
  in original wording with original worked answers.
- **Guesstimates** — well-known archetypes from consulting and analytics interview
  prep. The bank deliberately does **not** claim "Company X asked this in 2023",
  because that is not verifiable from public sources. Company tags mark the *kind of
  firm* that reliably asks this style of question.
- **Company tags generally** are directional signals aggregated from publicly shared
  interview experiences. They are not guarantees, and the Companies page says so.

No site was scraped to build this bank.

---

## The scheduler

`src/lib/scheduler.ts` is a pure module — no database, no I/O — so the core
guarantee can be property-tested directly.

### The hard constraint

The planned total **never exceeds the daily budget**. This is enforced in three
independent places:

1. Slot filling reserves the cheapest remaining option for every slot still to be
   filled, so it can never paint itself into a corner.
2. `generatePlan` throws if the final total somehow exceeds the budget — a bug would
   fail loudly rather than silently overbook your day.
3. `applySwap` re-checks the whole plan server-side and rejects the swap with an
   explanatory error. The UI check is a convenience, not the enforcement.

The test suite asserts this across every budget from 30 to 300 minutes, across 400
randomised user states, and across 60 consecutive random swaps.

### The priority score

Normalised to 0–100, exactly as specified:

```
priority = 0.25 · interview_frequency
         + 0.20 · pattern_value
         + 0.20 · user_weakness
         + 0.15 · company_relevance
         + 0.10 · concept_coverage
         + 0.10 · difficulty_fit
```

On top of that, the scheduler applies:

- **a review boost** for anything past its spaced-repetition due date (up to +30),
- **a repeat penalty** for anything solved in the last 21 days and not yet due,
- **a diversity penalty** for repeating a pattern already covered today,
- **a budget-fit nudge** so slots claim their fair share of time instead of
  quietly filling the day with the shortest questions available.

### How a day gets built

1. **Resolve slots.** Default is DSA ×2, SQL ×1, Probability/Statistics ×1,
   ML/Python ×1, Guesstimate ×1. If one area is much weaker than another, the
   scheduler moves a slot across and tells you it did so.
2. **Fill each slot** with the highest-scoring affordable question, reserving time
   for the slots still to come.
3. **Mop up leftover minutes** with at most two bonus questions, and only if they
   clear a real quality bar — the plan is never padded for its own sake.
4. **Order for the session**: warm up easy, ramp to hard, and never stack two Hard
   questions back to back while an easier one is available to sit between them.

### Swapping

Each card offers **Swap**, with two independent controls:

- **Category** — deliberately trade an ML question for a Probability one, a
  Probability one for another DSA, and so on.
- **Preference** — *similar*, *easier*, *harder*, or *shorter*. These filter rather
  than nudge, because they are explicit user intent.

Alternatives are ranked by a blend of priority and similarity, and **only options
that keep the whole day inside the budget are shown**. Because the check is against
the whole plan rather than the outgoing question alone, a *longer* replacement is
allowed whenever the rest of the day leaves room. The modal shows exactly how many
minutes are available for that slot.

---

## How an attempt is graded

This is the part that separates the app from a checklist. **152 of the 588
questions are graded objectively by the app** — it does not take your word for it.

| Category | Questions | How it is graded |
| --- | ---: | --- |
| SQL | 76 | You write a query, it runs against a real Postgres instance, and the **result set** is compared against the reference. Any correct query passes, however you write it. |
| Guesstimates | 26 | Your final estimate is checked against an order-of-magnitude band (within 3x), which is how interviewers actually grade these. |
| Probability | 43 | Exact numeric answer, with a tolerance. |
| Statistics / ML | 7 | Exact numeric answer, where the question has one. |
| Everything else | 436 | Self-graded — see below. |

### The SQL judge

`src/lib/practice-db.ts` boots a real Postgres (PGlite compiled to WASM) and
seeds it from a fixed PRNG, so results are deterministic. Your query and the
reference solution run against the **same instance in the same request**, and the
grader compares result sets:

- Row order is only enforced when the reference itself has a top-level `ORDER BY`.
- `NUMERIC` values are compared numerically, so float noise between equivalent
  formulations does not cause spurious failures.
- Near-misses are named specifically: wrong column count, right rows in the wrong
  order, right values with reordered columns.
- Queries run in a `READ ONLY` transaction with a 5-second statement timeout, so
  a submission can neither mutate the data nor wedge the shared instance.

Verifiability is **proved, not declared**: the seeder executes every stored SQL
reference and marks the question `sql`-graded only if it actually runs and
returns rows. A flag that could drift out of sync would be worse than none.

### Answer keys are keyed by title, not id

`src/data/answers.ts` maps question **title** to expected value. That is not
cosmetic: the first version keyed by question id, and because ids are assigned by
array position, hand-counting them drifted — **39 of 70 keys ended up attached to
the wrong question**, so correct answers were marked wrong and some questions were
unanswerable. Titles are stable and self-describing, an unknown title aborts the
seed, and `npm test` asserts that every expected value actually appears in that
question's own stored solution.

Each key also carries an `ask` string naming the exact quantity wanted — shown
above the input. Without it, a prompt phrased as a decision ("Should you switch?")
gives no clue that the grader expects `2/3`. Questions with no single number, like
"Why might this survey overstate satisfaction?", carry no key and stay self-graded.

Grading records the attempt immediately. The verdict is objective and a single
"I looked at a hint" checkbox covers the rest, so there is no second prompt.

### What cannot be graded, and why

ML questions ("explain the bias-variance tradeoff") and conceptual statistics
questions ("define a p-value") are *spoken-answer* interview questions. There is
no answer key that a machine can check, so they stay self-graded. That is a
property of the material, not a gap in the build — and it is why the review step
still exists for every question.

DSA links out to LeetCode, which hosts the statement, constraints and test cases.
The app records your time and your self-assessment; it does not run your code.

## Mastery and spaced repetition

Completing a question asks one question: *how did this go?* — solved
independently, minor hint, major hint, or could not solve. From that, the
recorded time, and whether the app graded the attempt objectively,
`src/lib/mastery.ts` updates:

- **mastery score** (0–100), with a bonus for solving well inside the estimate, a
  penalty for overrunning, diminishing returns on repeat solves, and extra weight
  when the result was machine-verified rather than self-reported;
- **status** — `not_started`, `attempted`, `solved`, `solved_quickly`,
  `solved_with_hint`, `failed`, `needs_review`, `mastered`;
- **next review date** — 1 day at low mastery out to 90 days at mastered, pulled
  back in proportion to how many times you have failed the question;
- **time overrun** flag when you take more than 1.5x the estimate, which feeds
  back into future scheduling.

Topic and pattern mastery roll up from question mastery, counting unattempted
questions as zero — so a single number captures both *coverage* and *depth*.

### The session timer

The clock is **server-side truth**, not browser state. `DailyTask.elapsedSeconds`
holds accumulated time from finished segments and `startedAt` marks the open one,
so the live value is `elapsedSeconds + (now - startedAt)`. Reloading the page,
closing the tab, or navigating away mid-question no longer loses your time —
which matters, because the intended workflow for DSA is "leave this page and go
solve on LeetCode". Solve time is read from that clock when you complete a task,
so the browser cannot lose it or fake it.

## Accounts

The app is multi-user. It is built for a small group — on the order of 100–200
people — so it uses server-side sessions and a single shared question bank rather
than anything more elaborate.

**Credentials.** Passwords are hashed with scrypt (Node's own implementation) using
a random 16-byte salt per password, and compared in constant time. The plaintext
is never stored or logged. Password rules are enforced server-side, not just in
the form.

**Sessions.** Signing in creates a row in `Session` and sets an httpOnly,
sameSite=lax cookie holding a 32-byte random token. The database stores only the
SHA-256 of that token, so a database leak does not hand over live sessions. Sessions
expire after 30 days and can be revoked by deleting the row — which a self-contained
JWT could not offer.

**Isolation.** Every user-owned table carries a `userId`: `UserSettings`,
`UserProgress` (keyed `[userId, questionId]`), `DailyPlan` (unique per
`[userId, date]`), and `Attempt`. Reads are scoped at the query, and writes go
through `ownedPlan`/`ownedTask` helpers that match on id **and** owner — so a
guessed id from another account resolves to nothing rather than to somebody
else's row.

`requireUser()` throws rather than returning null, so a forgotten check fails
loudly instead of silently leaking. The middleware redirect is only a convenience
to avoid rendering an app shell for a signed-out visitor; it is not the security
boundary, because the edge runtime cannot reach the database to validate a token.

`npm run smoke:isolation` creates two accounts, has one do work, and asserts the
other sees nothing — including that cross-account start/complete/swap attempts are
all refused.

**What is deliberately not here:** email verification, password reset, rate
limiting on sign-in, and OAuth. For a private group of 100–200 these are
reasonable omissions; for a public deployment, rate limiting and password reset
are the first two to add.

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Day counter, readiness, streak, today's plan, weakest areas, bank coverage |
| `/today` | The session itself: timers, hints, review, swap, regenerate |
| `/bank/[category]` | Filterable bank by topic, difficulty, and status |
| `/question/[id]` | Full question, hidden-until-asked solution, progress, attribution |
| `/progress` | Coverage, weakest topics, question states, recent attempts |
| `/patterns` | Pattern coverage bars — the DSA blind-spot detector |
| `/review` | Rolling 7-day review and next week's emphasis |
| `/companies` | Browse by company; see what your targets are weighted toward |
| `/settings` | Daily minutes, difficulty mode, target role, target companies |
| `/signin`, `/signup` | Account creation and sign-in |

The session timer records real solve time per question. Start, pause, resume,
complete, hint, give up — all of it is logged and all of it feeds the scheduler.

---

## Architecture

```
src/
  data/          Question bank as typed TS + validation (the source of truth)
  lib/
    scheduler.ts Pure scheduling + swapping. No I/O. Property-tested.
    mastery.ts   Pure mastery scoring + spaced repetition.
    plan-service.ts  DB ↔ scheduler bridge; plan lifecycle; swap enforcement.
    stats.ts     Progress, streaks, readiness, weekly review, pattern coverage.
  app/           Next.js App Router pages + server actions
  components/    UI primitives, task card, settings form
prisma/          Schema + seeder
tests/           Scheduler and bank test suites
scripts/         smoke.ts — end-to-end run against the real DB
```

**Stack:** Next.js 16 (App Router, server actions), TypeScript, Tailwind CSS,
Prisma 6, SQLite.

### Dependency security

`npm audit` reports 3 high-severity advisories, all in the same chain:
`deepmerge-ts` → `@prisma/config` → `prisma`. These are **build-tooling only** —
the Prisma CLI's own config parser, never shipped in the app runtime — and the
advisory is stack exhaustion when merging a deeply recursive config file that you
would have to have written yourself.

Clearing them requires Prisma 7, which removes `url` from the datasource block and
mandates `prisma.config.ts` plus a driver adapter. That is a real refactor for no
practical security gain here, so it has been deliberately deferred rather than
taken on. Everything else — including the critical Vitest UI advisory and the
Next.js/PostCSS advisories — is resolved on the current versions.

### Designed to grow

- **PostgreSQL** — change `provider` in `prisma/schema.prisma` and the `DATABASE_URL`.
  No model changes are needed; nothing depends on SQLite specifics.
- **Authentication and multi-user** — user-owned rows are already isolated behind a
  single `UserSettings` row with id `"default"` and per-question `UserProgress`.
  Adding a `userId` column and a session lookup is the whole migration.
- **Cloud sync / analytics / mobile** — all business logic lives in pure modules
  (`scheduler.ts`, `mastery.ts`) with no framework or database imports, so it can be
  lifted into an API or a React Native app unchanged.

---

## Verification

```bash
npm test              # 84 tests: scheduler, bank integrity, grading, credentials, answer keys
npm run smoke         # regenerate -> attempt -> swap -> over-budget rejection
npm run smoke:verify  # SQL judge, numeric grading, verified attempts, timer persistence
```

`smoke` prints the generated plan, exercises a completion, a same-category swap, a
cross-category swap, and confirms an over-budget swap is refused.

`smoke:isolation` proves two accounts stay separate.

`smoke:verify` submits a correct query, a wrong query and a `DELETE` to the SQL
judge, checks numeric grading both ways, and proves the timer survives a reload
by reconstructing elapsed time from the server clock.

Notably, one test grades **every** SQL-verified question against its own stored
reference, so a broken reference solution fails CI rather than silently marking
your correct answer wrong.

---

## A note on what this app does not do

It does not host copyrighted problem statements, and it does not pretend a specific
company asked a specific question when that cannot be verified. Where a question
came from somewhere, the source is named and linked; where the wording is ours, it
says so. That is a deliberate constraint, not an oversight.
