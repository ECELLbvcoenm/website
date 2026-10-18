-- Run after 000 on the reviewed existing-members schema.
-- This migration deliberately fails if the application schema differs.
begin;

do $$ begin
  if current_user <> 'postgres' then
    raise exception 'Apply this migration as the trusted postgres role';
  end if;
  if pg_catalog.pg_has_role('anon', 'service_role', 'MEMBER') or
     pg_catalog.pg_has_role('authenticated', 'service_role', 'MEMBER') or
     pg_catalog.pg_has_role('anon', 'postgres', 'MEMBER') or
     pg_catalog.pg_has_role('authenticated', 'postgres', 'MEMBER') then
    raise exception 'An untrusted API role inherits a privileged database role';
  end if;
  if to_regnamespace('app_private') is not null or
     to_regclass('public.public_members') is not null or
     to_regclass('public.public_projects') is not null or
     to_regclass('public.projects') is not null then
    raise exception 'A target schema or view already exists; inspect its owner and grants before applying';
  end if;
  if to_regclass('public.members') is null or
     to_regclass('public.applications') is null then
    raise exception 'Run migration 000 first; members and applications are required';
  end if;
  if exists (select 1 from pg_catalog.pg_policies
             where schemaname='public' and tablename in ('members','applications')) then
    raise exception 'Target tables already have policies; review them before applying';
  end if;
  if exists (select 1 from pg_catalog.pg_constraint
             where (conname='members_local_image_url' and conrelid='public.members'::regclass) or
                   (conname='applications_public_fields_valid' and conrelid='public.applications'::regclass)) then
    raise exception 'A target constraint name already exists; review it before applying';
  end if;
  if exists (select 1 from public.applications limit 1) then
    raise exception 'New applications table must be empty';
  end if;
  if exists (
    select 1 from pg_catalog.pg_trigger t
    join pg_catalog.pg_class c on c.oid=t.tgrelid
    join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname in ('members','applications')
      and not t.tgisinternal
  ) then
    raise exception 'An application table has an existing trigger; inspect it before applying';
  end if;
end $$;

do $$
declare required_column text;
begin
  foreach required_column in array array['id','name','role','department','image_url','linkedin_url','rank'] loop
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='members' and column_name=required_column) then
      raise exception 'members.% is required; inspect the live schema before editing this migration', required_column;
    end if;
  end loop;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='members'
               and column_name in ('name','role','department','image_url','linkedin_url')
               and data_type not in ('text','character varying')) then
    raise exception 'member public fields must be text or varchar; inspect the live schema';
  end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema='public' and table_name='members'
                   and column_name='id' and data_type='uuid') or
     not exists (select 1 from information_schema.columns
                 where table_schema='public' and table_name='members'
                   and column_name='rank' and data_type='integer') then
    raise exception 'members.id must be UUID and members.rank must be integer';
  end if;
  foreach required_column in array array['full_name','email','contact_number','department','motivation'] loop
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='applications' and column_name=required_column and data_type in ('text','character varying')) then
      raise exception 'applications.% must be text or varchar; inspect the live schema', required_column;
    end if;
  end loop;
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='applications'
      and column_name not in ('full_name','email','contact_number','department','motivation')
      and is_nullable='NO' and column_default is null
      and is_identity='NO' and is_generated='NEVER'
  ) then
    raise exception 'applications has another required column without a default; adapt the submission function';
  end if;
  if exists (
    select 1 from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    cross join lateral pg_catalog.aclexplode(coalesce(c.relacl, pg_catalog.acldefault('r',c.relowner))) a
    left join pg_catalog.pg_roles r on r.oid=a.grantee
    where n.nspname='public' and c.relname in ('members','applications')
      and (pg_catalog.pg_get_userbyid(c.relowner) <> 'postgres' or
           (a.grantee <> 0 and coalesce(r.rolname,'<unknown>') not in ('postgres','anon','authenticated','service_role')))
  ) then
    raise exception 'A target table has an unexpected owner or role grant; inspect before applying';
  end if;
  if exists (
    select 1 from pg_catalog.pg_attribute a
    join pg_catalog.pg_class c on c.oid=a.attrelid
    join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    cross join lateral pg_catalog.aclexplode(a.attacl) acl
    left join pg_catalog.pg_roles r on r.oid=acl.grantee
    where n.nspname='public' and c.relname in ('members','applications')
      and a.attnum > 0 and not a.attisdropped and acl.grantee <> c.relowner
      and acl.grantee <> 0
      and coalesce(r.rolname,'<unknown>') not in ('anon','authenticated','service_role')
  ) then
    raise exception 'A target column has an unexpected role grant; inspect before applying';
  end if;
end $$;

create schema app_private;
revoke all on schema app_private from public, anon, authenticated;

create table app_private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table app_private.admin_users enable row level security;
revoke all on app_private.admin_users from public, anon, authenticated;

create function app_private.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from app_private.admin_users where user_id = (select auth.uid())) $$;
revoke all on function app_private.is_admin() from public, anon, authenticated;
grant usage on schema app_private to authenticated;
grant execute on function app_private.is_admin() to authenticated;

do $$ begin
  if not exists (select 1 from information_schema.columns
                 where table_schema='public' and table_name='members' and column_name='is_public') then
    alter table public.members add column is_public boolean not null default false;
  elsif exists (select 1 from public.members where is_public is null) then
    raise exception 'members.is_public already exists with null values; review them before applying';
  end if;
end $$;
alter table public.members alter column is_public set default false;
alter table public.members alter column is_public set not null;
alter table public.members enable row level security;
alter table public.applications enable row level security;

revoke all on public.members, public.applications from public, anon, authenticated;
-- Table-level REVOKE does not remove separate column-level grants.
do $$ declare g record; begin
  for g in
    select distinct n.nspname as schema_name, c.relname as table_name,
           a.attname as column_name,
           case when acl.grantee=0 then 'PUBLIC' else pg_catalog.quote_ident(r.rolname) end as recipient
    from pg_catalog.pg_attribute a
    join pg_catalog.pg_class c on c.oid=a.attrelid
    join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    cross join lateral pg_catalog.aclexplode(a.attacl) acl
    left join pg_catalog.pg_roles r on r.oid=acl.grantee
    where n.nspname='public' and c.relname in ('members','applications')
      and a.attnum > 0 and not a.attisdropped
      and (acl.grantee=0 or r.rolname in ('anon','authenticated'))
  loop
    execute format('revoke all (%I) on table %I.%I from %s',
                   g.column_name, g.schema_name, g.table_name, g.recipient);
  end loop;
end $$;
grant select, insert, update, delete on public.members, public.applications to authenticated;
-- Serial primary keys need sequence USAGE for authenticated admin inserts.
-- Identity columns handle their own sequence access.
do $$ declare s text; t text; c text; begin
  foreach t in array array['members','applications'] loop
    for c in select column_name from information_schema.columns
             where table_schema='public' and table_name=t and column_default like 'nextval(%' loop
      s := pg_get_serial_sequence(format('public.%I', t), c);
      if s is not null then
        execute format('revoke all on sequence %s from public, anon, authenticated', s);
        execute format('grant usage on sequence %s to authenticated', s);
      end if;
    end loop;
  end loop;
end $$;

create policy members_admin_select on public.members for select to authenticated
using ((select app_private.is_admin()));
create policy members_admin_insert on public.members for insert to authenticated
with check ((select app_private.is_admin()));
create policy members_admin_update on public.members for update to authenticated
using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy members_admin_delete on public.members for delete to authenticated
using ((select app_private.is_admin()));

create policy applications_admin_select on public.applications for select to authenticated
using ((select app_private.is_admin()));
create policy applications_admin_insert on public.applications for insert to authenticated
with check ((select app_private.is_admin()));
create policy applications_admin_update on public.applications for update to authenticated
using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy applications_admin_delete on public.applications for delete to authenticated
using ((select app_private.is_admin()));

-- These narrow, owner-executed views intentionally expose only curated columns.
-- Base tables remain inaccessible to anon, and ordinary authenticated users have
-- no matching base-table SELECT policy. Do not add private columns to these views.
create view public.public_members with (security_barrier = true, security_invoker = false) as
select id, name, role, department,
       case when image_url ~ '^/images/members/[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp|avif)$' then image_url else null end as image_url,
       rank,
       null::text as instagram,
       case when linkedin_url ~ '^https://(www\.)?linkedin\.com/' then linkedin_url else null end as linkedin,
       null::text as github
from public.members where is_public = true;
revoke all on public.public_members from public, anon, authenticated;
grant select on public.public_members to anon, authenticated;

-- Preserve legacy member rows, including quarantined offsite URLs. The view
-- suppresses those URLs; this NOT VALID check applies to every new/updated row.
alter table public.members add constraint members_local_image_url
check (image_url is null or image_url = '' or image_url ~ '^/images/members/[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp|avif)$') not valid;

-- Applications are new and empty, so this check is validated immediately.
alter table public.applications add constraint applications_public_fields_valid check (
  full_name is not null and email is not null and department is not null and motivation is not null and
  length(btrim(full_name)) between 2 and 120 and
  lower(email) ~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$' and
  length(email) <= 254 and
  (contact_number is null or contact_number = '' or contact_number ~ '^\+?[0-9 ()-]{7,20}$') and
  department in ('Technical','Marketing','Finance','PR') and
  length(btrim(motivation)) between 20 and 2000
 );

-- Default privileges can grant newly created objects to additional roles.
-- Remove every non-owner ACL entry on the private table, helper function, and
-- public views before granting back only the documented permissions.
do $$ declare g record; begin
  for g in
    select c.oid::regclass as object_name,
           case when a.grantee=0 then 'PUBLIC' else pg_catalog.quote_ident(r.rolname) end as recipient
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    cross join lateral pg_catalog.aclexplode(coalesce(c.relacl, pg_catalog.acldefault('r',c.relowner))) a
    left join pg_catalog.pg_roles r on r.oid=a.grantee
    where a.grantee <> c.relowner and
          ((n.nspname='app_private' and c.relname='admin_users') or
           (n.nspname='public' and c.relname='public_members'))
  loop
    if g.recipient is null then raise exception 'Unknown ACL grantee on %', g.object_name; end if;
    execute format('revoke all on table %s from %s', g.object_name, g.recipient);
  end loop;
  for g in
    select p.oid::regprocedure as object_name,
           case when a.grantee=0 then 'PUBLIC' else pg_catalog.quote_ident(r.rolname) end as recipient
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid=p.pronamespace
    cross join lateral pg_catalog.aclexplode(coalesce(p.proacl, pg_catalog.acldefault('f',p.proowner))) a
    left join pg_catalog.pg_roles r on r.oid=a.grantee
    where n.nspname='app_private' and p.proname='is_admin' and a.grantee <> p.proowner
  loop
    if g.recipient is null then raise exception 'Unknown ACL grantee on %', g.object_name; end if;
    execute format('revoke all on function %s from %s', g.object_name, g.recipient);
  end loop;
end $$;
grant select on public.public_members to anon, authenticated;
grant execute on function app_private.is_admin() to authenticated;

commit;
