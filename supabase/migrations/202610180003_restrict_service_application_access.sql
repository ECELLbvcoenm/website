-- Run after 000, 001, and 002. Keep service_role's submission RPC grant.
-- This transaction fails if inherited or PUBLIC grants still give service_role
-- effective direct access to applications after its own grants are revoked.
begin;

do $$ begin
  if current_user <> 'postgres' then
    raise exception 'Apply this migration as the trusted postgres role';
  end if;
  if not exists (
    select 1 from pg_catalog.pg_class c
    where c.oid = to_regclass('public.applications')
      and c.relkind = 'r' and c.relrowsecurity
      and pg_catalog.pg_get_userbyid(c.relowner) = 'postgres'
  ) then
    raise exception 'Expected a postgres-owned applications table with RLS enabled';
  end if;
  if not exists (
    select 1 from pg_catalog.pg_proc p
    where p.oid = to_regprocedure('public.submit_application(text,text,text,text,text,text,text)')
      and p.prosecdef
      and pg_catalog.pg_get_userbyid(p.proowner) = 'postgres'
      and 'search_path=""' = any(p.proconfig)
  ) or not pg_catalog.has_function_privilege(
    'service_role', 'public.submit_application(text,text,text,text,text,text,text)', 'EXECUTE'
  ) then
    raise exception 'Expected the postgres-owned service_role submission RPC from migration 002';
  end if;
end $$;

revoke all on table public.applications from service_role;

-- Table-level REVOKE leaves independent column grants in place.
do $$ declare column_name text; begin
  for column_name in
    select distinct a.attname
    from pg_catalog.pg_attribute a
    cross join lateral pg_catalog.aclexplode(a.attacl) acl
    where a.attrelid = 'public.applications'::regclass
      and a.attnum > 0 and not a.attisdropped
      and acl.grantee = 'service_role'::regrole
  loop
    execute format('revoke all (%I) on table public.applications from service_role', column_name);
  end loop;
end $$;

do $$ begin
  if pg_catalog.has_table_privilege(
       'service_role', 'public.applications',
       'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'
     ) or pg_catalog.has_any_column_privilege(
       'service_role', 'public.applications', 'SELECT,INSERT,UPDATE,REFERENCES'
     ) then
    raise exception 'service_role still has effective direct applications access; inspect inherited and PUBLIC grants';
  end if;
  if not pg_catalog.has_function_privilege(
    'service_role', 'public.submit_application(text,text,text,text,text,text,text)', 'EXECUTE'
  ) then
    raise exception 'service_role lost submission RPC access';
  end if;
end $$;

commit;
