# Security audit — 18 October 2026

## Verified in this repository

- The join page previously inserted the five form fields directly from the
  browser into `public.applications`. There was no server validation, rate
  limiting, duplicate protection, or safe error mapping. The browser displayed
  raw Supabase errors.
- The members page queried `select('*')` from `public.members`, rendered its
  `image_url` directly, and used database social URLs as link targets. The
  homepage also queried the table directly. There are no member or project
  write paths, admin routes, file uploads, or server actions in this repository.
- Auth is a client sign-in/sign-up UI. Before these changes, no code verified
  admin authorization. The projects page currently uses static content rather
  than a Supabase query.
- The source and reachable Git history search found no service-role key or
  tracked environment file. The browser uses a public Supabase anon key, which
  is expected. This search cannot rule out exposure in deployment settings,
  logs, another repository, or prior deleted remote history.
- The deployed homepage responded with `Access-Control-Allow-Origin: *` on
  a public HTML response when checked. That header alone does not expose
  applicant records. The repository contained no custom CORS configuration.
- An npm production audit initially reported seven advisories, including a
  critical advisory affecting Next.js 16.1.6. After updating Next.js and
  compatible transitive dependencies, the production audit reported zero.
  The full audit still reports five high advisories in the development-only
  `eslint-config-next` → `fast-glob` → `micromatch` → `braces` chain. npm's
  suggested fix downgrades `eslint-config-next` to 14.x, which is incompatible
  with the current Next.js 16 toolchain; do not apply `--force` blindly.

## Reported database state and cause analysis

The site owner reports RLS disabled and broad grants on `members`; the reported
production schema has no `projects` or `applications` table. This was not
independently verified because the repository has no production database access.
If `members` has grants to `anon` or `authenticated`, Supabase's Data API could have
allowed unauthorized reads and writes. Disabled RLS alone is not proof that a
particular actor or request wrote the unfamiliar member records. The browser
member listing accepted externally hosted image URLs, but the form never sent
data to `members`. The repository includes hardcoded legitimate member names,
social links, and local images in `lib/localMembers.ts`; it does not import
members from an external feed.

To identify a cause, preserve and correlate Supabase API/Postgres audit logs,
Auth logs, write timestamps, source IPs, JWT roles, any service-role usage,
Vercel deployment history, and other clients holding project credentials.
Do not delete remaining suspect data or logs as part of code rollout.

## Controls implemented

- Database migrations revoke direct public table access, enable RLS, refuse
  existing target policies/objects so they can be reviewed, and require a private Auth UID
  allowlist for authenticated admin CRUD. Public listings use fixed-field,
  filtered views. Only a service-role-only function can submit five explicit
  application fields; it validates inputs and enforces atomic IP and email
  limits. No admin UI has been invented.
- The join form submits to a same-origin server route with a bounded JSON body,
  strict field allowlist, normalization, format/length checks, safe responses,
  and no PII logging. The service key stays server-side. Recent duplicates
  receive the same public response as new applications.
- Member images are loaded only from local image paths; social links require
  expected HTTPS hosts. Narrow public view queries replace direct table reads.
  Basic security headers are set for all routes.

## Verification limits and rollout

The prior local checks do not establish the live database's security. An isolated
PostgreSQL 15 fixture can exercise migration syntax, grants, RLS, admin CRUD,
direct function denial, and concurrent submission behavior, but uses a synthetic
schema and a simulated `auth.uid()`. It does not verify the actual Supabase schema,
PostgREST JWT handling, deployed request headers, or browser-to-database form flow.
Run `supabase/preflight.sql`, adapt to the actual schema, and complete the isolated
Supabase project tests in `supabase/README.md` before production approval. No
production database, settings, credentials, or deployment were changed.

## Clean setup revision

The owner now reports that only `public.members` remains, with a UUID primary
key and seven specified columns; it has RLS disabled and broad
public grants. This report is supplied evidence, not an independent live
database observation. Migration `000` now checks that exact shape and creates
only the missing `applications` table. The static projects page needs no table.
Migration `001` secures
the existing member table without changing UUIDs or deleting rows. Migration
`002` checks the application schema before installing the restricted RPC. Member
rows and UUIDs are preserved and start unpublished. All
three files fail on unexpected target objects rather than replacing them.
The final page review also found that a checked-in roster could display names
even when database rows were unpublished. The homepage and members page now
render only rows returned by `public_members`; an empty view produces no cards.
Follow `supabase/README.md` for the only documented execution path and
`supabase/TEST_REPORT.md` for verification limits.
