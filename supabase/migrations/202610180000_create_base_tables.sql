-- Existing-members path for project gucesqkwizbndffsvqtk. Run only after
-- reviewing preflight output. Preserves public.members, its rows and UUIDs.
begin;

do $$
declare actual_columns text;
begin
  if current_user <> 'postgres' then
    raise exception 'Apply as the trusted postgres role';
  end if;
  if to_regclass('auth.users') is null then
    raise exception 'Supabase Auth schema is required';
  end if;
  if not exists (select 1 from pg_catalog.pg_class c
                 where c.oid=to_regclass('public.members') and c.relkind='r'
                   and not c.relrowsecurity and not c.relforcerowsecurity
                   and pg_catalog.pg_get_userbyid(c.relowner)='postgres') then
    raise exception 'public.members must be a postgres-owned ordinary table with RLS disabled';
  end if;
  if pg_catalog.pg_has_role('anon','service_role','MEMBER') or
     pg_catalog.pg_has_role('authenticated','service_role','MEMBER') or
     pg_catalog.pg_has_role('anon','postgres','MEMBER') or
     pg_catalog.pg_has_role('authenticated','postgres','MEMBER') then
    raise exception 'An untrusted API role inherits a privileged database role';
  end if;
  if to_regclass('public.projects') is not null or
     to_regclass('public.applications') is not null or
     to_regclass('public.public_members') is not null or
     to_regclass('public.public_projects') is not null or
     to_regnamespace('app_private') is not null or
     exists (select 1 from pg_catalog.pg_proc p
             join pg_catalog.pg_namespace n on n.oid=p.pronamespace
             where n.nspname='public' and p.proname='submit_application') then
    raise exception 'A target application object already exists; inspect before applying';
  end if;
  select string_agg(column_name || ':' || data_type, ',' order by column_name)
    into actual_columns from information_schema.columns
    where table_schema='public' and table_name='members';
  if actual_columns <> 'department:text,id:uuid,image_url:text,linkedin_url:text,name:text,rank:integer,role:text' then
    raise exception 'Unexpected public.members columns or types: %', actual_columns;
  end if;
  if (select count(*) from pg_catalog.pg_constraint
      where conrelid='public.members'::regclass) <> 1 or
     not exists (select 1 from pg_catalog.pg_constraint c
                 join pg_catalog.pg_attribute a on a.attrelid=c.conrelid
                   and a.attnum=any(c.conkey)
                 where c.conrelid='public.members'::regclass and c.contype='p'
                 group by c.oid having count(*)=1 and bool_and(a.attname='id')) then
    raise exception 'public.members must have only its UUID id primary key constraint';
  end if;
  if exists (select 1 from pg_catalog.pg_policies
             where schemaname='public' and tablename='members') or
     exists (select 1 from pg_catalog.pg_trigger
             where tgrelid='public.members'::regclass and not tgisinternal) or
     exists (select 1 from pg_catalog.pg_rewrite
             where ev_class='public.members'::regclass) or
     (select count(*) from pg_catalog.pg_index
      where indrelid='public.members'::regclass) <> 1 then
    raise exception 'public.members has an unexpected policy, trigger, rule, or index';
  end if;
  if exists (
    select 1 from pg_catalog.pg_class c
    cross join lateral pg_catalog.aclexplode(coalesce(c.relacl, pg_catalog.acldefault('r',c.relowner))) a
    left join pg_catalog.pg_roles r on r.oid=a.grantee
    where c.oid='public.members'::regclass and a.grantee <> c.relowner
      and (a.is_grantable or
           (a.grantee <> 0 and coalesce(r.rolname,'<unknown>')
            not in ('anon','authenticated','service_role')))
  ) or exists (
    select 1 from pg_catalog.pg_attribute a
    cross join lateral pg_catalog.aclexplode(a.attacl) acl
    left join pg_catalog.pg_roles r on r.oid=acl.grantee
    where a.attrelid='public.members'::regclass and a.attnum > 0
      and not a.attisdropped and acl.grantee <> 0
      and acl.grantee <> (select relowner from pg_catalog.pg_class
                         where oid='public.members'::regclass)
      and (acl.is_grantable or
           coalesce(r.rolname,'<unknown>') not in ('anon','authenticated','service_role'))
  ) then
    raise exception 'public.members has an unexpected or delegable table/column grant';
  end if;
  if exists (
    select 1 from pg_catalog.pg_default_acl d
    cross join lateral pg_catalog.aclexplode(d.defaclacl) acl
    where d.defaclrole='postgres'::regrole and d.defaclnamespace=0
      and d.defaclobjtype in ('r','S')
      and acl.grantee in (0,'anon'::regrole,'authenticated'::regrole)
  ) then
    raise exception 'Global postgres table/sequence default grants need separate review; per-schema REVOKE cannot remove them';
  end if;
end $$;

-- These per-schema defaults belong to the reviewed application object owner.
-- Do not change supabase_admin's defaults or any existing platform object.
-- Global table/sequence grants cannot be undone per schema; the guard above
-- must be extended if preflight reports such grants for postgres.
alter default privileges for role postgres in schema public
  revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon, authenticated;
-- Function execution is restricted on the specific application functions in
-- 001 and 002. Leave database-wide future-function defaults unchanged.

-- Lock down the existing table in this first transaction. Migration 001 adds
-- its public view and admin policies; run the files in one coordinated window.
alter table public.members enable row level security;
revoke all on public.members from public, anon, authenticated;
do $$ declare g record; begin
  for g in
    select distinct a.attname as column_name,
           case when acl.grantee=0 then 'PUBLIC' else pg_catalog.quote_ident(r.rolname) end as recipient
    from pg_catalog.pg_attribute a
    cross join lateral pg_catalog.aclexplode(a.attacl) acl
    left join pg_catalog.pg_roles r on r.oid=acl.grantee
    where a.attrelid='public.members'::regclass and a.attnum>0 and not a.attisdropped
      and (acl.grantee=0 or r.rolname in ('anon','authenticated'))
  loop
    execute format('revoke all (%I) on table public.members from %s',g.column_name,g.recipient);
  end loop;
end $$;

create table public.applications (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  contact_number text,
  department text not null,
  motivation text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  internal_notes text,
  created_at timestamptz not null default now()
);

-- Default public-schema grants must not expose these tables between migrations.
alter table public.applications enable row level security;
revoke all on public.applications from public, anon, authenticated;
do $$ declare sequence_name text; g record; begin
  sequence_name := pg_catalog.pg_get_serial_sequence('public.applications','id');
  if sequence_name is null then raise exception 'applications.id identity sequence is missing'; end if;
  for g in
    select distinct case when acl.grantee=0 then 'PUBLIC' else pg_catalog.quote_ident(r.rolname) end as recipient
    from pg_catalog.pg_class c
    cross join lateral pg_catalog.aclexplode(coalesce(c.relacl,pg_catalog.acldefault('S',c.relowner))) acl
    left join pg_catalog.pg_roles r on r.oid=acl.grantee
    where c.oid=sequence_name::regclass and acl.grantee<>c.relowner
  loop
    if g.recipient is null then raise exception 'Unknown grant on applications identity sequence'; end if;
    execute format('revoke all on sequence %s from %s',sequence_name,g.recipient);
  end loop;
end $$;

commit;
