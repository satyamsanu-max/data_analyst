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
the server. No login, no cloud account, no API keys.

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
| `npm test` | Scheduler + question-bank test suites |
| `npm run smoke` | End-to-end check against the real DB |
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

## Mastery and spaced repetition

Completing a question asks one question: *how did this go?* — solved independently,
minor hint, major hint, or could not solve. From that plus the recorded time,
`src/lib/mastery.ts` updates:

- **mastery score** (0–100), with a bonus for solving well inside the estimate, a
  penalty for overrunning, and diminishing returns on repeat solves;
- **status** — `not_started`, `attempted`, `solved`, `solved_quickly`,
  `solved_with_hint`, `failed`, `needs_review`, `mastered`;
- **next review date** — 1 day at low mastery out to 90 days at mastered, pulled
  back in proportion to how many times you have failed the question;
- **time overrun** flag when you take more than 1.5× the estimate, which feeds back
  into future scheduling.

Topic and pattern mastery roll up from question mastery, counting unattempted
questions as zero — so a single number captures both *coverage* and *depth*, which
is exactly what the scheduler should react to.

---

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
npm test        # 36 tests: scheduler constraints + bank integrity
npm run smoke   # regenerate → attempt → swap → over-budget rejection, against the real DB
```

The smoke script prints the generated plan, exercises a completion, a same-category
swap, a cross-category swap, and confirms that an over-budget swap is refused.

---

## A note on what this app does not do

It does not host copyrighted problem statements, and it does not pretend a specific
company asked a specific question when that cannot be verified. Where a question
came from somewhere, the source is named and linked; where the wording is ours, it
says so. That is a deliberate constraint, not an oversight.
