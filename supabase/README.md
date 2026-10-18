# Supabase security rollout

The repository has no authoritative production schema or database connection. These
versioned migrations are one-time changes, not rerunnable SQL scripts. Run
`preflight.sql` first and compare the complete output with the migration assumptions.
Migration `001` fails on missing columns, unexpected table owners/grants, existing
target policies/views/schema/constraints, or legacy rows incompatible with its new
checks. Migration `002` fails on target function/table collisions. Inspect triggers,
foreign keys, existing functions, storage buckets, exposed schemas, and custom role
memberships separately. Adapt and retest migrations in isolation if any assumption
differs. Neither migration has been tested against the production schema.

## Order

1. Back up production data and preserve relevant audit logs. In a separate test
   Supabase project restored from a sanitized, production-like schema, apply
   `202610180001_lock_down_public_data.sql`, then
   `202610180002_application_submission.sql`. Run `tests/rls.integration.sql`,
   concurrent submission checks, and a real form submission through a test deployment.
   `tests/rls.fixture.integration.sql` is specific to the synthetic local fixture.
   Confirm actual Auth JWTs and PostgREST behavior, which the local PostgreSQL fixture
   cannot test.
2. Review every existing member row privately. Migration `001` sets new
   `members.is_public` values to false. Publish only approved IDs after migration;
   the checked-in local member roster keeps the page populated during review.
   `projects.is_public` also defaults to false; its current page is static.
3. In production, run `preflight.sql` read-only and resolve differences. Configure
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `APPLICATION_HASH_SECRET` only
   in Vercel's server environment; configure the public URL and anon key separately.
   Verify the service role key has never entered a client bundle.
4. Apply migration `001` then `002` as the trusted `postgres` role. Existing browser
   form writes will stop at `001`; deploy the updated code promptly in a coordinated
   window. Do not expose the new API route before its RPC and server secrets exist.
5. Add only verified administrator Auth user IDs to `app_private.admin_users` using
   the SQL editor, after checking identity through a trusted channel. Example:
   `insert into app_private.admin_users(user_id) values ('<verified-auth-user-uuid>');`
   Keep this table out of exposed schemas. Verify normal authenticated users remain
   unable to change the allowlist.
6. Publish approved member/project IDs, verify public views, test one real form
   submission, and verify anon/authenticated denials through the Data API. Monitor
   Supabase and Vercel logs for errors and unusual volume without logging applicant PII.

The migrations do not delete application or member data. They are not safely
reversible with a generic DOWN script: RLS/grants/views/publication flags and
application checks change access semantics, and forms submitted after rollout
would be lost by a blind restore. Keep a tested backup/PITR recovery plan. If
rollout fails, first disable the public join route at the edge or redeploy a
known compatible version; restore from a snapshot or construct a reviewed
forward migration, preserving submissions received since the snapshot.

The `public_members` and `public_projects` views are intentionally owner-executed,
with a fixed list of public fields and `is_public` filter. They bypass base-table
RLS by design; never add private columns or remove that filter. The underlying
tables have RLS enabled and no direct public grants. The migration refuses to
replace existing target policies or views because their semantics may differ.
Apply as the trusted database owner and verify view ownership, `security_invoker`
settings, function execution ACLs, and grants afterward.

Admin CRUD is available through Supabase's authenticated API only to user IDs
in the private allowlist. The database verifies the signed JWT and the allowlist
for every operation. There is no admin UI or admin endpoint in this repository.
Use a trusted database administration channel or build a server-verified admin
UI separately. An ordinary site sign-in grants no administrative rights.


The form's server route uses a service-role key only to invoke one restricted
database function. Keep that key and `APPLICATION_HASH_SECRET` in Vercel server
environment variables, never in `NEXT_PUBLIC_*`. The function applies atomic
IP limits and email deduplication before inserting five explicit fields.
IP/email hashes are retained in `app_private.submission_attempts`; set a data
retention policy for this operational table. The IP cap is a cost/abuse guard,
not identity proof: changing IP and email bypasses it. Verify that Vercel
overwrites `x-vercel-forwarded-for` in the deployed request path; another proxy
or host requires an equivalent trusted address source.

## Incident review

Preserve database audit/API logs, Vercel logs, deployment history, Auth logs,
and a private snapshot of affected rows if available. Compare write timestamps,
Supabase API logs and JWT role, source IP, any service-role usage, and deployment
logs before attributing the unfamiliar member records. This repository has no
member write path; RLS being disabled and prior grants could have allowed direct
REST writes with a public key, but that is a hypothesis until logs/grants confirm it.
The site previously rendered database-provided `image_url` values directly.

If a service-role or secret key is found in a client bundle, commit history,
logs, or another public location, rotate it in the Supabase dashboard and update
Vercel after the database controls are tested. A publishable/anon key is intended
to be public; its exposure alone is not a secret leak. Rotate credentials only
as part of an approved, coordinated production change.
