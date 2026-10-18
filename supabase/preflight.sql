-- Run read-only in the Supabase SQL editor before changing production.
-- Save the output privately; it can reveal table structure and grants.
select table_schema, table_name, table_type
from information_schema.tables
where table_schema in ('public', 'storage')
order by table_schema, table_name;

-- A collision with a target schema/view/function must be reviewed before the
-- migrations. They intentionally fail rather than replace unknown objects.
select current_user as migration_role,
       to_regnamespace('app_private') as private_schema,
       to_regclass('public.public_members') as members_view,
       to_regclass('public.public_projects') as projects_view,
       to_regclass('app_private.admin_users') as admin_table,
       to_regclass('app_private.submission_attempts') as rate_table;

select table_name, ordinal_position, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name in ('members', 'projects', 'applications')
order by table_name, ordinal_position;

select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name in ('members', 'projects', 'applications')
order by table_name, grantee, privilege_type;

-- ACL entries include custom/inherited roles that information_schema can miss.
select n.nspname as schema_name, c.relname as object_name, c.relkind,
       pg_get_userbyid(c.relowner) as owner, c.relrowsecurity, c.relforcerowsecurity,
       c.reloptions, case when a.grantee=0 then 'PUBLIC' else r.rolname end as grantee,
       a.privilege_type, a.is_grantable
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid=c.relnamespace
cross join lateral pg_catalog.aclexplode(coalesce(c.relacl, pg_catalog.acldefault('r',c.relowner))) a
left join pg_catalog.pg_roles r on r.oid=a.grantee
where (n.nspname='public' and c.relname in ('members','projects','applications','public_members','public_projects'))
   or (n.nspname='app_private' and c.relname in ('admin_users','submission_attempts'))
order by schema_name, object_name, grantee, a.privilege_type;

select t.schemaname, t.tablename, c.relrowsecurity, c.relforcerowsecurity
from pg_catalog.pg_tables t
join pg_catalog.pg_class c on c.relname = t.tablename
join pg_catalog.pg_namespace n on n.oid = c.relnamespace and n.nspname = t.schemaname
where schemaname = 'public';

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public'
order by tablename, policyname;

select tc.table_name, tc.constraint_name, tc.constraint_type, pg_get_constraintdef(c.oid) as definition
from information_schema.table_constraints tc
join pg_catalog.pg_constraint c on c.conname = tc.constraint_name
join pg_catalog.pg_class r on r.oid = c.conrelid and r.relname = tc.table_name
join pg_catalog.pg_namespace n on n.oid = r.relnamespace and n.nspname = tc.table_schema
where tc.table_schema = 'public' and tc.table_name in ('members', 'projects', 'applications')
order by tc.table_name, tc.constraint_name;

select n.nspname as schema_name, p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments,
       pg_get_userbyid(p.proowner) as owner, p.prosecdef as security_definer,
       p.proconfig as settings,
       case when a.grantee=0 then 'PUBLIC' else r.rolname end as grantee,
       a.privilege_type
from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace
cross join lateral pg_catalog.aclexplode(coalesce(p.proacl, pg_catalog.acldefault('f',p.proowner))) a
left join pg_catalog.pg_roles r on r.oid=a.grantee
where n.nspname in ('public','app_private') order by n.nspname, p.proname, grantee;

select schemaname, viewname, definition from pg_catalog.pg_views where schemaname = 'public';

select n.nspname as schema_name, c.relname as object_name, c.relkind,
       pg_get_userbyid(c.relowner) as owner, c.reloptions
from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind in ('v','m');

select n.nspname as schema_name, c.relname as table_name, t.tgname,
       pg_get_triggerdef(t.oid) as definition
from pg_catalog.pg_trigger t
join pg_catalog.pg_class c on c.oid=t.tgrelid
join pg_catalog.pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('members','projects','applications') and not t.tgisinternal;

select defaclrole::regrole as defining_role,
       case when defaclnamespace=0 then 'global' else defaclnamespace::regnamespace::text end as scope,
       defaclobjtype as object_type, defaclacl as grants
from pg_catalog.pg_default_acl
where defaclnamespace=0 or defaclnamespace='public'::regnamespace;

select roleid::regrole as granted_role, member::regrole as member_role, admin_option
from pg_catalog.pg_auth_members
where roleid in ('anon'::regrole,'authenticated'::regrole,'service_role'::regrole)
   or member in ('anon'::regrole,'authenticated'::regrole,'service_role'::regrole);

-- Counts only; do not export applicant data in a review report. The migration
-- stops if any count is nonzero because NOT VALID checks still affect updates.
select count(*) as members_with_nonlocal_images
from public.members
where image_url is not null and image_url <> '' and
      image_url !~ '^/images/members/[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp|avif)$';

select count(*) as applications_failing_new_validation
from public.applications where (
  full_name is not null and email is not null and department is not null and motivation is not null and
  length(btrim(full_name)) between 2 and 120 and
  lower(email) ~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$' and
  length(email) <= 254 and
  (contact_number is null or contact_number = '' or contact_number ~ '^\+?[0-9 ()-]{7,20}$') and
  department in ('Technical','Marketing','Finance','PR') and
  length(btrim(motivation)) between 20 and 2000
) is not true;
