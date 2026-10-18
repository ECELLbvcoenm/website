-- Run ONLY against an isolated test Supabase database, after migrations 000 through 003.
-- psql -v ON_ERROR_STOP=1 -v admin_uid=<existing-auth-user-uuid> -f tests/rls.integration.sql
-- All data writes in this script roll back. Use an existing test Auth user.
begin;

insert into app_private.admin_users (user_id) values (:'admin_uid'::uuid)
on conflict (user_id) do nothing;

do $$ begin
  if has_table_privilege('anon', 'public.applications', 'SELECT') or
     has_table_privilege('anon', 'public.applications', 'INSERT') or
     has_table_privilege('anon', 'public.applications', 'UPDATE') or
     has_table_privilege('anon', 'public.applications', 'DELETE') then
    raise exception 'anon has direct application privileges';
  end if;
  if has_table_privilege('anon', 'public.members', 'INSERT') or
     has_table_privilege('anon', 'public.members', 'UPDATE') or
     has_table_privilege('anon', 'public.members', 'DELETE') then
    raise exception 'anon has member write privileges';
  end if;
  if not has_table_privilege('anon', 'public.public_members', 'SELECT') then
    raise exception 'public listing views are inaccessible';
  end if;
  if has_function_privilege('anon', 'public.submit_application(text,text,text,text,text,text,text)', 'EXECUTE') or
     has_function_privilege('authenticated', 'public.submit_application(text,text,text,text,text,text,text)', 'EXECUTE') then
    raise exception 'public can bypass form endpoint';
  end if;
end $$;

set local role anon;
select count(*) from public.public_members;
do $$ begin
  begin
    perform count(*) from public.applications;
    raise exception 'anon could read applications';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.members default values;
    raise exception 'anon could insert a member';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
set local role authenticated;
do $$ begin
  if app_private.is_admin() then raise exception 'ordinary user was treated as admin'; end if;
  if (select count(*) from public.applications) <> 0 or
     (select count(*) from public.members) <> 0 then
    raise exception 'ordinary user could read protected base rows';
  end if;
end $$;
-- RLS must return zero rows even though authenticated has a table SELECT grant.
select count(*) from public.applications;
select count(*) from public.members;
reset role;

select set_config('request.jwt.claim.sub', :'admin_uid', true);
set local role authenticated;
do $$ begin
  if not app_private.is_admin() then raise exception 'allowlisted user not treated as admin'; end if;
end $$;
select count(*) from public.applications;
select count(*) from public.members;
reset role;

-- Service-only submission verifies field mapping, duplicate handling, and rate
-- limiting in one transaction. These test emails and rows never commit.
set local role service_role;
do $$ begin
  begin
    perform count(*) from public.applications;
    raise exception 'service_role read applications directly';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.applications (full_name,email,department,motivation)
    values ('Direct Write','direct-write@example.invalid','PR',
            'A valid application must use the restricted RPC instead.');
    raise exception 'service_role inserted applications directly';
  exception when insufficient_privilege then null;
  end;
end $$;
do $$
declare result text; n int;
begin
  for n in 1..5 loop
    result := public.submit_application('Test Applicant', 'security-test-'||n||'@example.invalid',
      '', 'PR', 'This is an integration test application for the team.',
      repeat('a',64), lpad(to_hex(n),64,'0'));
    if result <> 'accepted' then raise exception 'valid submission failed: %', result; end if;
  end loop;
  result := public.submit_application('Test Applicant', 'security-test-1@example.invalid',
    '', 'PR', 'This is an integration test application for the team.', repeat('a',64), lpad(to_hex(1),64,'0'));
  if result <> 'rate_limited' then raise exception 'rate limit failed: %', result; end if;
end $$;
reset role;

rollback;
