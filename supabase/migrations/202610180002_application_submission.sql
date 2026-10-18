begin;

do $$ begin
  if current_user <> 'postgres' then raise exception 'Apply this migration as the trusted postgres role'; end if;
  if to_regnamespace('app_private') is null then raise exception 'Apply migration 001 first'; end if;
  if to_regclass('app_private.submission_attempts') is not null or
     exists (select 1 from pg_catalog.pg_proc p
             join pg_catalog.pg_namespace n on n.oid=p.pronamespace
             where n.nspname='public' and p.proname='submit_application') then
    raise exception 'A target table or function already exists; inspect its owner and grants before applying';
  end if;
end $$;

create table app_private.submission_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  email_hash text not null check (email_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);
create index submission_attempts_ip_time on app_private.submission_attempts (ip_hash, created_at desc);
create index submission_attempts_email_time on app_private.submission_attempts (email_hash, created_at desc);
alter table app_private.submission_attempts enable row level security;
revoke all on app_private.submission_attempts from public, anon, authenticated;

-- Only the server's service role can call this narrow function. It never returns
-- application rows or accepts privileged attributes. All checks and insertion
-- happen in one transaction. The advisory locks serialize concurrent attempts.
create function public.submit_application(
  p_full_name text, p_email text, p_contact_number text,
  p_department text, p_motivation text, p_ip_hash text, p_email_hash text
) returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_name text := btrim(p_full_name);
  v_email text := lower(btrim(p_email));
  v_phone text := btrim(coalesce(p_contact_number, ''));
  v_motivation text := btrim(p_motivation);
begin
  if v_name is null or v_email is null or p_department is null or v_motivation is null or
     length(v_name) not between 2 and 120 or
     v_email !~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$' or length(v_email) > 254 or
     (v_phone <> '' and (length(v_phone) not between 7 and 20 or v_phone !~ '^\+?[0-9 ()-]+$')) or
     p_department not in ('Technical','Marketing','Finance','PR') or
     length(v_motivation) not between 20 and 2000 or
     p_ip_hash !~ '^[0-9a-f]{64}$' or p_email_hash !~ '^[0-9a-f]{64}$' then
    return 'invalid';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_ip_hash, 0));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_email_hash, 1));

  if (select count(*) from app_private.submission_attempts
      where ip_hash = p_ip_hash and created_at > now() - interval '1 hour') >= 5 then
    return 'rate_limited';
  end if;
  if exists (select 1 from app_private.submission_attempts
             where email_hash = p_email_hash and created_at > now() - interval '24 hours') then
    return 'duplicate';
  end if;

  insert into public.applications (full_name, email, contact_number, department, motivation)
  values (v_name, v_email, v_phone, p_department, v_motivation);
  insert into app_private.submission_attempts (ip_hash, email_hash)
  values (p_ip_hash, p_email_hash);
  return 'accepted';
end $$;

revoke all on function public.submit_application(text,text,text,text,text,text,text) from public, anon, authenticated;
do $$ declare g record; begin
  for g in
    select p.oid::regprocedure as object_name,
           case when a.grantee=0 then 'PUBLIC' else pg_catalog.quote_ident(r.rolname) end as recipient
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid=p.pronamespace
    cross join lateral pg_catalog.aclexplode(coalesce(p.proacl, pg_catalog.acldefault('f',p.proowner))) a
    left join pg_catalog.pg_roles r on r.oid=a.grantee
    where n.nspname='public' and p.proname='submit_application' and a.grantee <> p.proowner
  loop
    if g.recipient is null then raise exception 'Unknown ACL grantee on %', g.object_name; end if;
    execute format('revoke all on function %s from %s', g.object_name, g.recipient);
  end loop;
  for g in
    select c.oid::regclass as object_name,
           case when a.grantee=0 then 'PUBLIC' else pg_catalog.quote_ident(r.rolname) end as recipient
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    cross join lateral pg_catalog.aclexplode(coalesce(c.relacl, pg_catalog.acldefault('r',c.relowner))) a
    left join pg_catalog.pg_roles r on r.oid=a.grantee
    where n.nspname='app_private' and c.relname='submission_attempts' and a.grantee <> c.relowner
  loop
    if g.recipient is null then raise exception 'Unknown ACL grantee on %', g.object_name; end if;
    execute format('revoke all on table %s from %s', g.object_name, g.recipient);
  end loop;
end $$;
grant execute on function public.submit_application(text,text,text,text,text,text,text) to service_role;

commit;
