# Deploying to Vercel + Neon

The app is a single Next.js deployment — there is no separate backend. Server
components and server actions run server-side in the same process that serves
the UI, so "frontend" and "backend" are one thing to host.

You need two accounts, both free: **Vercel** (the app) and **Neon** (Postgres).

---

## Why the practice database is separate

The SQL judge runs candidate queries against a `practice` schema through a
**dedicated read-only role**, not through the application's database user.

This is not belt-and-braces. Users submit arbitrary SQL. A read-only transaction
stops them writing, but it would happily run:

```sql
SELECT email, "passwordHash" FROM public."User";
```

Only role permissions prevent that. `scripts/provision-practice.ts` creates the
role, strips its rights on `public`, and then **verifies the lockdown by trying
the attack itself** — it exits non-zero if application tables are reachable.

Locally none of this applies: `npm run dev` uses PGlite, an in-process WASM
Postgres, with no database to provision.

---

## 1. Create the database

1. Create a project at <https://neon.tech>.
2. Copy the connection string. It looks like:
   `postgresql://USER:PASSWORD@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

## 2. Point the schema at Postgres

In `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Nothing else in the data model changes.

## 3. Create the tables and load the question bank

From your machine, against Neon:

```bash
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

The seeder validates the bank, proves which SQL questions are gradable by
executing each reference, and loads all 588 questions.

## 4. Provision the practice database and its read-only role

```bash
DATABASE_URL="postgresql://..." npm run provision:practice
```

This creates the `practice` schema, seeds it, creates the `practice_ro` role,
and prints a `PRACTICE_DATABASE_URL`. It also runs an isolation check:

```
Verifying isolation...
  PASS  can read practice.users (300 rows)
  PASS  blocked from public."User"
  PASS  blocked from public."Attempt"
  PASS  blocked from public."Session"
  PASS  blocked from writing
```

**If any line says FAIL, do not deploy.** Save the printed URL.

## 5. Deploy

Import the GitHub repo at <https://vercel.com/new>. Vercel detects Next.js and
runs the `vercel-build` script, which generates the Prisma client and builds.

Schema changes are applied deliberately from your machine (step 3), never during
a deploy — a build should not be able to alter your production database.

## 6. Environment variables

Set these in **Project Settings → Environment Variables**:

| Variable | Required | Value |
| --- | --- | --- |
| `DATABASE_URL` | yes | Your Neon connection string (application role) |
| `PRACTICE_DATABASE_URL` | yes | Printed by step 4 (read-only role) |
| `APP_URL` | yes | `https://your-app.vercel.app` — used to build reset links |
| `RESEND_API_KEY` | for reset emails | From <https://resend.com> (free tier: 3,000/month) |
| `RESET_EMAIL_FROM` | optional | e.g. `Interview Prep <noreply@yourdomain.com>` |

Without `RESEND_API_KEY` the reset flow still works, but the link is written to
the server log instead of emailed. Fine for testing, useless for real users.

Redeploy after setting them — Vercel does not apply new variables to an existing
build.

---

## Costs

| | Free tier | When you would outgrow it |
| --- | --- | --- |
| Vercel Hobby | 100 GB bandwidth/month | Well beyond 100–200 users |
| Neon Free | 0.5 GB storage, autosuspends when idle | The question bank is ~10 MB; fine |
| Resend Free | 3,000 emails/month | Only password resets send email |

For 100–200 users this should cost nothing. Neon's free tier suspends after
inactivity, so the first request after a quiet spell takes a second or two.

---

## What is still not hardened

Honest list, so nothing is a surprise:

- **No email verification.** Anyone can sign up with an address they do not own.
  For an invite-shared URL that is usually fine; for a public one it is not.
- **No admin interface.** Removing a user or resetting someone manually means
  running SQL against Neon.
- **Fixed-window rate limiting** can allow up to 2× the limit across a window
  boundary. It turns thousands of password guesses per minute into a handful,
  which is the point, but it is not a sliding window.
- **No CSRF token beyond Next's built-in server-action protection.** Server
  actions carry an action id and are same-origin by default; there is no
  additional token layer.
- **Sessions do not rotate on privilege change** other than password reset,
  which does destroy all sessions.

---

## Local development is unaffected

```bash
npm install && npm run dev
```

Still zero-config: SQLite for app data, PGlite for the practice database, no
`PRACTICE_DATABASE_URL` needed. The hosted path only activates when that
variable is set.

## Verifying a deployment

```bash
npm test              # 84 tests
npm run smoke:security   # rate limiting + reset tokens
npm run smoke:isolation  # two accounts cannot see each other
```

After deploying, check by hand:

1. Sign up, confirm you land on a Day 1 dashboard.
2. Open a SQL question, submit a correct query, confirm it grades.
3. Sign out, request a password reset, confirm the email arrives.
4. Enter a wrong password nine times and confirm you are rate limited.
