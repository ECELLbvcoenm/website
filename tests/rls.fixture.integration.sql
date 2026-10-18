-- Run against tests/fixtures/local-supabase-schema.sql after both migrations.
-- This fixture covers concrete CRUD and privilege behavior; it is not a test
-- of the production schema or of PostgREST JWT verification.
\set ON_ERROR_STOP on
begin;

do $$ declare actual text; begin
  select string_agg(column_name, ',' order by ordinal_position) into actual
  from information_schema.columns where table_schema='public' and table_name='public_members';
  if actual <> 'id,name,role,department,image_url,rank,instagram,linkedin,github' then
    raise exception 'Unexpected public member columns: %', actual;
  end if;
  select string_agg(column_name, ',' order by ordinal_position) into actual
  from information_schema.columns where table_schema='public' and table_name='public_projects';
  if actual <> 'title' then raise exception 'Unexpected public project columns: %', actual; end if;
  if (select count(*) from public.public_members) <> 0 then
    raise exception 'Existing member was published without review';
  end if;
  if has_table_privilege('authenticated','app_private.admin_users','INSERT') or
     has_table_privilege('authenticated','app_private.admin_users','UPDATE') or
     has_table_privilege('authenticated','app_private.admin_users','DELETE') then
    raise exception 'Authenticated role can modify admin allowlist';
  end if;
  if not exists (select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
                 where n.nspname='public' and c.relname='public_members' and
                       'security_invoker=false'=any(c.reloptions)) then
    raise exception 'public_members has unexpected view security settings';
  end if;
  if not exists (select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
                 where n.nspname='public' and p.proname='submit_application' and p.prosecdef and
                       'search_path=""'=any(p.proconfig)) then
    raise exception 'submission function owner execution/search_path changed';
  end if;
end $$;

set local role anon;
do $$ begin
  begin
    perform public.submit_application('Test Applicant','anon@example.invalid','','PR',
      'This should never be stored in the applications table.',repeat('a',64),repeat('b',64));
    raise exception 'anon invoked privileged function';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
set local role authenticated;
do $$ begin
  if app_private.is_admin() then raise exception 'ordinary user gained admin rights'; end if;
  begin
    insert into app_private.admin_users (user_id) values ('22222222-2222-4222-8222-222222222222');
    raise exception 'ordinary user changed allowlist';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.members (name,role,department) values ('Unauthorized','Member','Technical');
    raise exception 'ordinary user inserted a member';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.members set name='Unauthorized';
    if found then raise exception 'ordinary user updated members'; end if;
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.projects;
    if found then raise exception 'ordinary user deleted projects'; end if;
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

update public.members set is_public=true where name='Fixture Member';
set local role anon;
do $$ begin
  if (select count(*) from public.public_members where name='Fixture Member') <> 1 then
    raise exception 'Approved public member is missing';
  end if;
end $$;
reset role;

insert into app_private.admin_users (user_id) values ('11111111-1111-4111-8111-111111111111');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
set local role authenticated;
do $$ declare member_id bigint; project_id bigint; application_id bigint; begin
  if not app_private.is_admin() then raise exception 'admin allowlist failed'; end if;
  insert into public.members (name,role,department,image_url)
    values ('Test Member','Member','Technical','/images/members/test.jpg') returning id into member_id;
  update public.members set role='Lead' where id=member_id;
  if not found then raise exception 'admin member update failed'; end if;
  delete from public.members where id=member_id;
  if not found then raise exception 'admin member delete failed'; end if;

  insert into public.projects (title) values ('Test Project') returning id into project_id;
  update public.projects set is_public=true where id=project_id;
  if not found then raise exception 'admin project update failed'; end if;
  delete from public.projects where id=project_id;
  if not found then raise exception 'admin project delete failed'; end if;

  insert into public.applications (full_name,email,department,motivation)
    values ('Test Applicant','admin-test@example.invalid','PR',
            'This is a valid test application with enough motivation.') returning id into application_id;
  update public.applications set status='approved' where id=application_id;
  if not found then raise exception 'admin application update failed'; end if;
  delete from public.applications where id=application_id;
  if not found then raise exception 'admin application delete failed'; end if;
end $$;
reset role;

rollback;
