-- Run read-only in the Supabase SQL editor before changing production.
-- Save the output privately; it can reveal table structure and grants.
-- Never paste member row data or database credentials into a review message.
-- SQL Editor may show only the final result set. The final SELECT below
-- consolidates the checks into one row; inspect every JSON column in it.
select current_database() as database_name, current_user as migration_role,
       current_setting('server_version') as postgres_version,
       to_regclass('auth.users') is not null as auth_users_exists;

with member_shape as (
  select string_agg(column_name || ':' || data_type, ',' order by column_name) as columns
  from information_schema.columns
  where table_schema='public' and table_name='members'
), member_constraints as (
  select count(*) as total,
         count(*) filter (where contype='p' and pg_get_constraintdef(oid)='PRIMARY KEY (id)') as id_primary_keys
  from pg_catalog.pg_constraint where conrelid=to_regclass('public.members')
)
select to_regclass('public.members') is not null as members_present,
       pg_catalog.pg_get_userbyid(c.relowner) as members_owner,
       c.relkind as members_kind, c.relrowsecurity as members_rls,
       m.columns as members_columns,
       m.columns='department:text,id:uuid,image_url:text,linkedin_url:text,name:text,rank:integer,role:text'
         as exact_expected_columns,
       k.total as constraint_count, k.id_primary_keys as id_primary_key_count,
       to_regclass('public.projects') is null as projects_absent,
       to_regclass('public.applications') is null as applications_absent,
       to_regnamespace('app_private') is null as private_schema_absent
from member_shape m cross join member_constraints k
left join pg_catalog.pg_class c on c.oid=to_regclass('public.members');

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

-- Table REVOKE alone does not clear independent column grants.
select n.nspname as schema_name, c.relname as table_name,
       a.attname as column_name,
       case when acl.grantee=0 then 'PUBLIC' else r.rolname end as grantee,
       acl.privilege_type, acl.is_grantable
from pg_catalog.pg_attribute a
join pg_catalog.pg_class c on c.oid=a.attrelid
join pg_catalog.pg_namespace n on n.oid=c.relnamespace
cross join lateral pg_catalog.aclexplode(a.attacl) acl
left join pg_catalog.pg_roles r on r.oid=acl.grantee
where n.nspname='public' and c.relname in ('members','projects','applications')
  and a.attnum > 0 and not a.attisdropped
order by schema_name, table_name, column_name, grantee, acl.privilege_type;

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

-- Extra indexes or rewrite rules on the existing table require review.
select i.indexrelid::regclass as index_name, pg_get_indexdef(i.indexrelid) as definition
from pg_catalog.pg_index i where i.indrelid=to_regclass('public.members')
order by index_name;
select rulename, definition
from pg_catalog.pg_rules
where schemaname='public' and tablename='members';

-- Effective privileges include inherited grants; TRUNCATE bypasses row policies.
select role_name,
       has_table_privilege(role_name, to_regclass('public.members'), 'SELECT') as can_select,
       has_table_privilege(role_name, to_regclass('public.members'), 'INSERT') as can_insert,
       has_table_privilege(role_name, to_regclass('public.members'), 'UPDATE') as can_update,
       has_table_privilege(role_name, to_regclass('public.members'), 'DELETE') as can_delete,
       has_table_privilege(role_name, to_regclass('public.members'), 'TRUNCATE') as can_truncate,
       has_any_column_privilege(role_name, to_regclass('public.members'), 'SELECT') as column_select,
       has_any_column_privilege(role_name, to_regclass('public.members'), 'UPDATE') as column_update
from (values ('anon'),('authenticated'),('service_role')) as roles(role_name);

select defaclrole::regrole as defining_role,
       case when defaclnamespace=0 then 'global' else defaclnamespace::regnamespace::text end as scope,
       defaclobjtype as object_type, defaclacl as grants
from pg_catalog.pg_default_acl
where defaclnamespace=0 or defaclnamespace='public'::regnamespace;

select roleid::regrole as granted_role, member::regrole as member_role, admin_option
from pg_catalog.pg_auth_members
where roleid in ('anon'::regrole,'authenticated'::regrole,'service_role'::regrole)
   or member in ('anon'::regrole,'authenticated'::regrole,'service_role'::regrole);

-- Members may contain legacy rows and UUIDs; migrations preserve them. New
-- projects/applications must be absent before 000 and empty before 001.
do $$ declare target text; row_count bigint; begin
  foreach target in array array['members','projects','applications'] loop
    if to_regclass(format('public.%I', target)) is null then
      raise notice 'public.%: absent', target;
    else
      execute format('select count(*) from public.%I', target) into row_count;
      raise notice 'public.%: % rows', target, row_count;
    end if;
  end loop;
end $$;

-- Compare this fingerprint before and after 000/001 to verify that the seven
-- original member fields and UUIDs survived unchanged. Excludes is_public.
select count(*) as members_count,
       md5(coalesce(jsonb_agg(to_jsonb(m) - 'is_public' order by m.id)::text, '[]'))
         as original_member_fields_fingerprint
from public.members m;

-- Consolidated SQL Editor result. The earlier queries remain useful in psql,
-- but this final result includes their essential checks and the full inventory.
with api_roles(role_name) as (
  values ('anon'::text), ('authenticated'::text), ('service_role'::text)
)
select current_database() as database_name, current_user as migration_role,
  current_setting('server_version') as postgres_version,
  to_regclass('auth.users') is not null as auth_users_exists,
  (select count(*) from public.members) as members_count,
  (select md5(coalesce(jsonb_agg(to_jsonb(m)-'is_public' order by m.id)::text,'[]'))
     from public.members m) as original_member_fields_fingerprint,
  jsonb_build_object(
    'members_columns', (select string_agg(column_name||':'||data_type,',' order by column_name)
      from information_schema.columns where table_schema='public' and table_name='members'),
    'members_owner', (select pg_catalog.pg_get_userbyid(relowner) from pg_catalog.pg_class
      where oid=to_regclass('public.members')),
    'members_constraints', (select count(*) from pg_catalog.pg_constraint
      where conrelid=to_regclass('public.members')),
    'members_id_primary_key_count', (select count(*) from pg_catalog.pg_constraint
      where conrelid=to_regclass('public.members') and contype='p'
        and pg_catalog.pg_get_constraintdef(oid)='PRIMARY KEY (id)'),
    'projects_absent', to_regclass('public.projects') is null,
    'applications_absent', to_regclass('public.applications') is null,
    'app_private_absent', to_regnamespace('app_private') is null,
    'public_members_view_absent', to_regclass('public.public_members') is null,
    'public_projects_view_absent', to_regclass('public.public_projects') is null,
    'submit_application_absent', not exists (
      select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='submit_application')
  ) as starting_shape,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'schema',n.nspname,'name',c.relname,'kind',c.relkind,
    'owner',pg_catalog.pg_get_userbyid(c.relowner),
    'rls_enabled',c.relrowsecurity,'rls_forced',c.relforcerowsecurity,
    'options',c.reloptions,
    'columns',(select coalesce(jsonb_agg(jsonb_build_object(
      'name',a.attname,'type',pg_catalog.format_type(a.atttypid,a.atttypmod),
      'nullable',not a.attnotnull,'default',pg_catalog.pg_get_expr(d.adbin,d.adrelid))
      order by a.attnum),'[]'::jsonb)
      from pg_catalog.pg_attribute a left join pg_catalog.pg_attrdef d
        on d.adrelid=a.attrelid and d.adnum=a.attnum
      where a.attrelid=c.oid and a.attnum>0 and not a.attisdropped),
    'view_definition',case when c.relkind in ('v','m') then pg_catalog.pg_get_viewdef(c.oid,true) end,
    'acl',c.relacl::text)
    order by n.nspname,c.relname),'[]'::jsonb)
   from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
   where n.nspname in ('public','app_private') and c.relkind in ('r','p','v','m','f','S')) as relations,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'object',c.oid::regclass::text,'role',role_name,
    'select',pg_catalog.has_table_privilege(role_name,c.oid,'SELECT'),
    'insert',pg_catalog.has_table_privilege(role_name,c.oid,'INSERT'),
    'update',pg_catalog.has_table_privilege(role_name,c.oid,'UPDATE'),
    'delete',pg_catalog.has_table_privilege(role_name,c.oid,'DELETE'),
    'truncate',pg_catalog.has_table_privilege(role_name,c.oid,'TRUNCATE'),
    'references',pg_catalog.has_table_privilege(role_name,c.oid,'REFERENCES'),
    'trigger',pg_catalog.has_table_privilege(role_name,c.oid,'TRIGGER'),
    'column_select',pg_catalog.has_any_column_privilege(role_name,c.oid,'SELECT'),
    'column_insert',pg_catalog.has_any_column_privilege(role_name,c.oid,'INSERT'),
    'column_update',pg_catalog.has_any_column_privilege(role_name,c.oid,'UPDATE'))
    order by n.nspname,c.relname,role_name),'[]'::jsonb)
   from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
   cross join api_roles
   where n.nspname in ('public','app_private','storage') and c.relkind in ('r','p','v','m','f')) as table_privileges,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'schema',n.nspname,'role',role_name,
    'usage',pg_catalog.has_schema_privilege(role_name,n.oid,'USAGE'),
    'create',pg_catalog.has_schema_privilege(role_name,n.oid,'CREATE'),
    'acl',n.nspacl::text) order by n.nspname,role_name),'[]'::jsonb)
   from pg_catalog.pg_namespace n cross join api_roles
   where n.nspname in ('public','app_private','storage')) as schema_privileges,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'sequence',c.oid::regclass::text,'role',role_name,
    'usage',pg_catalog.has_sequence_privilege(role_name,c.oid,'USAGE'),
    'select',pg_catalog.has_sequence_privilege(role_name,c.oid,'SELECT'),
    'update',pg_catalog.has_sequence_privilege(role_name,c.oid,'UPDATE'))
    order by n.nspname,c.relname,role_name),'[]'::jsonb)
   from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
   cross join api_roles where n.nspname in ('public','app_private','storage') and c.relkind='S') as sequence_privileges,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'table',c.oid::regclass::text,'column',a.attname,
    'grantee',case when acl.grantee=0 then 'PUBLIC' else grantee.rolname end,
    'privilege',acl.privilege_type,'grantable',acl.is_grantable)
    order by n.nspname,c.relname,a.attname,acl.grantee,acl.privilege_type),'[]'::jsonb)
   from pg_catalog.pg_attribute a join pg_catalog.pg_class c on c.oid=a.attrelid
   join pg_catalog.pg_namespace n on n.oid=c.relnamespace
   cross join lateral pg_catalog.aclexplode(a.attacl) acl
   left join pg_catalog.pg_roles grantee on grantee.oid=acl.grantee
   where n.nspname in ('public','app_private','storage') and a.attnum>0 and not a.attisdropped) as column_grants,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'schema',schemaname,'table',tablename,'name',policyname,
    'permissive',permissive,'roles',roles,'command',cmd,
    'using',qual,'with_check',with_check)
    order by schemaname,tablename,policyname),'[]'::jsonb)
   from pg_catalog.pg_policies where schemaname in ('public','app_private','storage')) as policies,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'function',p.oid::regprocedure::text,'owner',pg_catalog.pg_get_userbyid(p.proowner),
    'security_definer',p.prosecdef,'settings',p.proconfig,
    'acl',p.proacl::text,
    'execute_by_role',(select jsonb_object_agg(role_name,
       pg_catalog.has_function_privilege(role_name,p.oid,'EXECUTE')) from api_roles))
    order by n.nspname,p.proname,p.oid),'[]'::jsonb)
   from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
   where n.nspname in ('public','app_private','storage')) as functions,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'table',t.tgrelid::regclass::text,'name',t.tgname,
    'enabled',t.tgenabled,'internal',t.tgisinternal,
    'definition',pg_catalog.pg_get_triggerdef(t.oid))
    order by n.nspname,c.relname,t.tgname),'[]'::jsonb)
   from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid=t.tgrelid
   join pg_catalog.pg_namespace n on n.oid=c.relnamespace
   where n.nspname in ('public','app_private','storage')) as triggers,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'table',con.conrelid::regclass::text,'name',con.conname,
    'validated',con.convalidated,'definition',pg_catalog.pg_get_constraintdef(con.oid))
    order by n.nspname,c.relname,con.conname),'[]'::jsonb)
   from pg_catalog.pg_constraint con join pg_catalog.pg_class c on c.oid=con.conrelid
   join pg_catalog.pg_namespace n on n.oid=c.relnamespace
   where n.nspname in ('public','app_private')) as constraints,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'name',i.indexrelid::regclass::text,'definition',pg_catalog.pg_get_indexdef(i.indexrelid))
    order by i.indexrelid::regclass::text),'[]'::jsonb)
   from pg_catalog.pg_index i where i.indrelid=to_regclass('public.members')) as member_indexes,
  (select coalesce(jsonb_agg(jsonb_build_object('name',r.rulename,'definition',r.definition)
    order by r.rulename),'[]'::jsonb)
   from pg_catalog.pg_rules r where r.schemaname='public' and r.tablename='members') as member_rules,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'role',defaclrole::regrole::text,
    'scope',case when defaclnamespace=0 then 'global' else defaclnamespace::regnamespace::text end,
    'object_type',defaclobjtype,'grants',defaclacl::text)
    order by defaclrole,defaclnamespace,defaclobjtype),'[]'::jsonb)
   from pg_catalog.pg_default_acl where defaclnamespace=0 or defaclnamespace in
     (select oid from pg_catalog.pg_namespace where nspname in ('public','app_private','storage'))) as default_privileges,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'owner',owner_role.rolname,
    'scope',case when d.defaclnamespace=0 then 'global' else scope.nspname end,
    'object_type',d.defaclobjtype,
    'grantee',case when acl.grantee=0 then 'PUBLIC' else grantee.rolname end,
    'privilege',acl.privilege_type,'grantable',acl.is_grantable)
    order by owner_role.rolname,d.defaclnamespace,d.defaclobjtype,acl.grantee,acl.privilege_type),'[]'::jsonb)
   from pg_catalog.pg_default_acl d
   join pg_catalog.pg_roles owner_role on owner_role.oid=d.defaclrole
   left join pg_catalog.pg_namespace scope on scope.oid=d.defaclnamespace
   cross join lateral pg_catalog.aclexplode(d.defaclacl) acl
   left join pg_catalog.pg_roles grantee on grantee.oid=acl.grantee
   where d.defaclnamespace=0 or scope.nspname in ('public','app_private','storage')) as default_acl_grants,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'granted_role',granted.rolname,'member_role',member_role.rolname,
    'admin_option',am.admin_option)
    order by granted.rolname,member_role.rolname),'[]'::jsonb)
   from pg_catalog.pg_auth_members am
   join pg_catalog.pg_roles granted on granted.oid=am.roleid
   join pg_catalog.pg_roles member_role on member_role.oid=am.member
   where granted.rolname in ('anon','authenticated','service_role','postgres')
      or member_role.rolname in ('anon','authenticated','service_role')) as role_memberships,
  (select coalesce(jsonb_agg(jsonb_build_object(
    'name',c.relname,'kind',c.relkind,'owner',pg_catalog.pg_get_userbyid(c.relowner),
    'rls_enabled',c.relrowsecurity,'rls_forced',c.relforcerowsecurity,'acl',c.relacl::text)
    order by c.relname),'[]'::jsonb)
   from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
   where n.nspname='storage' and c.relkind in ('r','p','v','m','f')) as storage_relations,
  jsonb_build_object(
    'buckets_table_exists',to_regclass('storage.buckets') is not null,
    'selectable',coalesce(pg_catalog.has_table_privilege(current_user,to_regclass('storage.buckets'),'SELECT'),false),
    'rows_xml',case
      when to_regclass('storage.buckets') is not null
       and coalesce(pg_catalog.has_table_privilege(current_user,to_regclass('storage.buckets'),'SELECT'),false)
       and exists (select 1 from pg_catalog.pg_attribute
                   where attrelid=to_regclass('storage.buckets') and attname in ('id','name','public')
                   group by attrelid having count(*)=3)
      then pg_catalog.query_to_xml('select id, name, public from storage.buckets order by id',false,false,'')::text
      else null end,
    'note',case
      when to_regclass('storage.buckets') is null then 'storage.buckets absent'
      when not coalesce(pg_catalog.has_table_privilege(current_user,to_regclass('storage.buckets'),'SELECT'),false)
        then 'No SELECT privilege; inspect bucket settings in Dashboard'
      else 'Inspect rows_xml; storage.objects policies are in policies' end
  ) as storage_buckets;
