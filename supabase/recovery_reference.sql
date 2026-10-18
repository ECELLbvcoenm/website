-- Read-only recovery reference for the reported pre-migration members table.
-- Run in Dashboard SQL Editor only after preflight confirms the exact schema.
-- Save all result sets privately; DO NOT paste member rows into chat or tickets.
-- This is not a restorable database backup. It excludes Supabase-managed schemas,
-- Auth, Storage files, extensions, configuration, logs, and concurrent changes.
select now() as captured_at, current_database() as database_name,
       current_user as capture_role, current_setting('server_version') as postgres_version;

select c.oid::regclass as object_name, pg_get_userbyid(c.relowner) as owner,
       c.relkind, c.relrowsecurity, c.relforcerowsecurity, c.relacl
from pg_catalog.pg_class c where c.oid=to_regclass('public.members');

select a.attnum, a.attname, pg_catalog.format_type(a.atttypid,a.atttypmod) as data_type,
       a.attnotnull, pg_get_expr(d.adbin,d.adrelid) as default_expression,
       a.attidentity, a.attgenerated, a.attacl
from pg_catalog.pg_attribute a
left join pg_catalog.pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
where a.attrelid=to_regclass('public.members') and a.attnum>0 and not a.attisdropped
order by a.attnum;

select conname, contype, convalidated, pg_get_constraintdef(oid) as definition
from pg_catalog.pg_constraint where conrelid=to_regclass('public.members');
select indexrelid::regclass as index_name, pg_get_indexdef(indexrelid) as definition
from pg_catalog.pg_index where indrelid=to_regclass('public.members');

select n.nspname, c.relname, case when acl.grantee=0 then 'PUBLIC' else r.rolname end as grantee,
       acl.privilege_type, acl.is_grantable
from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
cross join lateral pg_catalog.aclexplode(coalesce(c.relacl,pg_catalog.acldefault('r',c.relowner))) acl
left join pg_catalog.pg_roles r on r.oid=acl.grantee
where c.oid=to_regclass('public.members') order by grantee, acl.privilege_type;

select a.attname, case when acl.grantee=0 then 'PUBLIC' else r.rolname end as grantee,
       acl.privilege_type, acl.is_grantable
from pg_catalog.pg_attribute a cross join lateral pg_catalog.aclexplode(a.attacl) acl
left join pg_catalog.pg_roles r on r.oid=acl.grantee
where a.attrelid=to_regclass('public.members') and a.attnum>0 and not a.attisdropped
order by a.attname, grantee, acl.privilege_type;

-- Save this result as a private CSV using the Dashboard result export option.
-- The seven selected fields are the complete reported application row shape.
select id,name,role,department,image_url,linkedin_url,rank
from public.members order by id;
