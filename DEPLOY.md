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

## What only you can do

Two accounts, both free, both need a real person to sign up:

1. **Neon** — <https://neon.tech> — the database
2. **Vercel** — <https://vercel.com> — the app

Everything after that is one command.

---

## 1. Create the database

Sign up at Neon, create a project, and copy the connection string. It looks like:

```
postgresql://USER:PASSWORD@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

## 2. Prepare it — one command

```bash
DATABASE_URL="postgresql://...paste yours here..." npm run deploy:prepare
```

That does all four steps in order: points Prisma at Postgres, creates the
tables, loads all 588 questions, and builds the `practice` schema with its
read-only role. It finishes by verifying the lockdown:

```
Verifying isolation...
  PASS  can read practice.users (300 rows)
  PASS  blocked from public."User"
  PASS  blocked from public."Attempt"
  PASS  blocked from writing
```

**If any line says FAIL, stop — do not deploy.**

It then prints a `PRACTICE_DATABASE_URL`. Keep it for step 4.

> You no longer edit `schema.prisma` by hand. The provider is derived from
> `DATABASE_URL`, so a postgres:// string means Postgres and everything else
> means local SQLite. Running any local command without `DATABASE_URL` set puts
> it back automatically.

## 3. Deploy the app

Go to <https://vercel.com/new>, import `satyamsanu-max/data_analyst`, and deploy.
Vercel detects Next.js and runs `vercel-build` on its own.

The first deploy will fail to load data — that is expected, the environment
variables are not set yet.

## 4. Set the environment variables

**Project Settings → Environment Variables:**

| Variable | Required | Value |
| --- | --- | --- |
| `DATABASE_URL` | yes | The Neon string from step 1 |
| `PRACTICE_DATABASE_URL` | yes | Printed by step 2 (the read-only role) |
| `APP_URL` | yes | `https://your-app.vercel.app` — builds reset links |
| `RESEND_API_KEY` | for reset emails | <https://resend.com> — free tier, 3,000/month |
| `RESET_EMAIL_FROM` | optional | e.g. `Interview Prep <noreply@yourdomain.com>` |

Then **redeploy** — Vercel does not apply new variables to an existing build.

Without `RESEND_API_KEY` password reset still works, but the link is written to
the server log instead of emailed. Fine for testing, useless for real users.

## 5. Check it

1. Open the URL, create an account, confirm you land on a Day 1 dashboard.
2. Open a SQL question, submit a correct query, confirm it grades.
3. Sign out, request a password reset, confirm the email arrives.
4. Enter a wrong password nine times and confirm you get rate limited.

---

## Schema changes later

Deliberately **not** part of the build — a deploy should not be able to alter a
production database. When you change the schema, apply it yourself:

```bash
DATABASE_URL="postgresql://..." npx prisma db push
```

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
npm test              # 88 tests
npm run smoke:security   # rate limiting + reset tokens
npm run smoke:isolation  # two accounts cannot see each other
```

After deploying, check by hand:

1. Sign up, confirm you land on a Day 1 dashboard.
2. Open a SQL question, submit a correct query, confirm it grades.
3. Sign out, request a password reset, confirm the email arrives.
4. Enter a wrong password nine times and confirm you are rate limited.
