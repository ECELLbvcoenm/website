# Existing-members migration verification — 18 October 2026

## Executed locally

- An isolated, network-disabled PostgreSQL 15 container was seeded with the reported existing `public.members` shape: UUID primary key, the exact seven columns, one legacy row with an offsite image URL, no user triggers/policies/views/functions, and broad anon/authenticated table and column grants. Read-only `supabase/preflight.sql` completed before migration and reported only members.
- The revised `000 → 001 → 002` migration sequence completed in a fresh container. `000` created `applications` and left `projects` absent. Both `tests/rls.fixture.integration.sql` and `tests/rls.integration.sql` passed in transactions that rolled back their test rows. They checked RLS and grants, public member view fields, preservation of the legacy row and UUID with unpublished default, admin member/application CRUD, ordinary-user and anonymous denials, private allowlist denial, function execution grants, and a valid service-role submission.
- The revised SQL fixture confirmed the legacy member row and UUID remained present and unpublished. The seven-field fingerprint comparison and final read-only preflight run were performed in the earlier local round, not repeated after this revision.
- Six migration guard tests passed after this revision: wrong member ID type, conflicting projects object, unexpected member index, conflicting public view, running 002 before applications exists, and an unexpected applications column. The tests confirmed no partial target schema change in their cases.
- Two concurrent local SQL tests passed after this revision: one of two same-email requests was accepted, and five of eight same-IP requests were accepted.
- After this revision, `npm test` passed (3 test files), `npm run lint` passed with 18 warnings and zero errors, `npm run typecheck`, `npm run test:bundle`, and `npm run build -- --webpack` passed. `node --check tests/supabase.e2e.mjs` and `git diff --check` passed. The sandboxed build failed to parse TypeScript `--showConfig` output; the retry outside the sandbox passed.

## Default-privilege and early-lockdown revision

- A new disposable, network-isolated PostgreSQL 15 container was seeded with the reported broad `postgres` and `supabase_admin` public-schema table, sequence, and function defaults. The corrected `000 → 001 → 002` sequence passed. The SQL fixture and RLS integration tests passed; the fixture verified that identity sequences have no API-role privileges, future postgres-owned public tables and sequences receive no broad API-role grants, and `supabase_admin` defaults remain unchanged.
- Eight migration guard tests passed, including new checks that 000 secures members before 001 and refuses global postgres table defaults that cannot be narrowed per schema. Two concurrent submission tests passed. The read-only preflight/postflight script completed against the migrated local database.
- `npm test` passed (3 test files), `npm run typecheck` passed, and `git diff --check` passed. Lint, bundle test, and production build were not rerun for this SQL-only revision; their earlier results are listed above.

## Not executed

- No isolated Supabase project credentials or test deployment were available. `npm run test:supabase` was not run. Local PostgreSQL simulates `auth.uid()` and does not prove real JWT/PostgREST behavior, Vercel IP-header trust, or the joining form end-to-end.
- Production Supabase was not connected to or changed. Production Vercel was not changed or deployed. The owner has supplied a production preflight summary, but the exact default ACL entries, effective post-migration privileges, other schemas, and recovery mechanism remain unverified. Supabase Free has no verified recoverable backup here.

**Status:** ready for isolated Supabase testing, not production-verified. Follow `supabase/README.md` and stop on any production preflight difference.

## Follow-up service-role correction

- In a fresh network-isolated PostgreSQL 15 container, migrations `000 → 001 → 002 → 003` passed against the existing-members fixture. The fixture deliberately gives `service_role` direct member rights and a `postgres` public-schema default table grant. Migration 003 removed effective `service_role` table and column access to the existing `applications` table without changing the member grant or the submission RPC grant. Default ACLs did not regrant rights to the existing table.
- `npm run test:sql:guards` passed **11/11** tests. These include the full SQL RLS fixtures and read-only `supabase/postflight.sql`, direct service-role read/write denial, valid RPC submission, and a guard that rolls back 003 when an inherited grant leaves effective application access. The role-inheritance test removes its temporary cluster-wide membership afterward.
- `npm test` passed **3/3** test files, `npm run typecheck` passed, `npm run lint` passed with 18 warnings and zero errors, and `git diff --check` passed. Bundle scan, production build, real Supabase Auth/PostgREST, and deployed-form tests were not rerun for this SQL-only follow-up.
- No production SQL, settings change, deployment, or credentials were used. Production `service_role` grants, role inheritance, future-object defaults, and external member-management dependencies still require review in actual postflight output. The earlier draft included a global future-function default change; the current minimal migration removes it. Application function EXECUTE grants remain explicit.

## Minimal-scope revision

Migration 000 no longer changes default execution privileges for future functions. The current SQL text has not been rerun in PostgreSQL because this revision explicitly prohibited executing SQL. Earlier disposable PostgreSQL results above apply to the prior draft; only repository tests were run for this revision.

## Current local verification

On 18 October 2026, the current `000 → 001 → 002 → 003` files passed all 11 migration guard and RLS fixture tests in a new disposable PostgreSQL 15 container. The container was removed afterward. `npm test` passed 3 test files, `npm run test:bundle` passed, `npm run typecheck` passed, and `npm run lint` reported 0 errors and 18 warnings. A production build passed with `next build --webpack`; the default Turbopack build could not bind a local process in this environment. `git diff --check` passed. Real Supabase Auth/PostgREST, production grants, Vercel environment variables, and live joining-form submission remain unverified. No production SQL or deployment was performed.
