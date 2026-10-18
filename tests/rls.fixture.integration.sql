-- Run against tests/fixtures/local-supabase-schema.sql after migrations 000 through 003.
-- This fixture covers concrete CRUD and privilege behavior; it is not a test
-- of the production schema or of PostgREST JWT verification.
\set ON_ERROR_STOP on
begin;

insert into public.members (id, name, role, department, image_url, linkedin_url)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Fixture Member', 'Member', 'Technical', '/images/members/fixture.jpg',
        'https://unrelated.example/profile');

do $$ declare actual text; begin
  if to_regclass('public.projects') is not null or
     to_regclass('public.public_projects') is not null then
    raise exception 'Migrations created an unnecessary projects object';
  end if;
  select string_agg(column_name, ',' order by ordinal_position) into actual
  from information_schema.columns where table_schema='public' and table_name='public_members';
  if actual <> 'id,name,role,department,image_url,rank,instagram,linkedin,github' then
    raise exception 'Unexpected public member columns: %', actual;
  end if;
  if (select count(*) from public.public_members) <> 0 then
    raise exception 'Existing member was published without review';
  end if;
  if not exists (select 1 from public.members where
      id='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'::uuid and
      name='Legacy Member' and image_url='https://unrelated.example/old-avatar.png'
      and is_public=false) then
    raise exception 'Legacy member row or UUID was changed';
  end if;
  begin
    insert into public.members (id,name,role,department,image_url)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','Bad Image','Member','Technical','https://unrelated.example/avatar.png');
    raise exception 'External member image URL was accepted';
  exception when check_violation then null;
  end;
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
  if has_table_privilege('anon','public.members','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') or
     has_any_column_privilege('anon','public.members','SELECT,INSERT,UPDATE') or
     has_table_privilege('anon','public.applications','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') or
     has_any_column_privilege('anon','public.applications','SELECT,INSERT,UPDATE') then
    raise exception 'Anonymous base-table or column grant survived migration';
  end if;
  if has_sequence_privilege('anon',pg_get_serial_sequence('public.applications','id'),'USAGE,SELECT,UPDATE') or
     has_sequence_privilege('authenticated',pg_get_serial_sequence('public.applications','id'),'USAGE,SELECT,UPDATE') or
     has_sequence_privilege('service_role',pg_get_serial_sequence('public.applications','id'),'USAGE,SELECT,UPDATE') or
     has_sequence_privilege('anon',pg_get_serial_sequence('app_private.submission_attempts','id'),'USAGE,SELECT,UPDATE') or
     has_sequence_privilege('authenticated',pg_get_serial_sequence('app_private.submission_attempts','id'),'USAGE,SELECT,UPDATE') or
     has_sequence_privilege('service_role',pg_get_serial_sequence('app_private.submission_attempts','id'),'USAGE,SELECT,UPDATE') then
    raise exception 'Identity sequence privilege survived migration';
  end if;
  if exists (
    select 1 from pg_catalog.pg_default_acl d
    cross join lateral pg_catalog.aclexplode(d.defaclacl) acl
    where d.defaclrole='postgres'::regrole
      and d.defaclnamespace in (0,'public'::regnamespace)
      and d.defaclobjtype in ('r','S')
      and acl.grantee in (0,'anon'::regrole,'authenticated'::regrole)
  ) then raise exception 'Broad postgres defaults remain'; end if;
  if not exists (
    select 1 from pg_catalog.pg_default_acl d
    cross join lateral pg_catalog.aclexplode(d.defaclacl) acl
    where d.defaclrole='supabase_admin'::regrole and d.defaclnamespace='public'::regnamespace
      and d.defaclobjtype='r' and acl.grantee='anon'::regrole
  ) then raise exception 'Supabase-managed defaults were changed'; end if;
  if not exists (
    select 1 from pg_catalog.pg_default_acl d
    cross join lateral pg_catalog.aclexplode(d.defaclacl) acl
    where d.defaclrole='postgres'::regrole and d.defaclnamespace='public'::regnamespace
      and d.defaclobjtype='r' and acl.grantee='service_role'::regrole
      and acl.privilege_type='SELECT'
  ) then raise exception 'Fixture service_role default grant was unexpectedly changed'; end if;
  if has_function_privilege('anon',
       'public.submit_application(text,text,text,text,text,text,text)','EXECUTE') or
     has_function_privilege('authenticated',
       'public.submit_application(text,text,text,text,text,text,text)','EXECUTE') or
     not has_function_privilege('service_role',
       'public.submit_application(text,text,text,text,text,text,text)','EXECUTE') then
    raise exception 'Submission RPC execution grants are incorrect';
  end if;
  if has_table_privilege('service_role','public.applications',
       'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') or
     has_any_column_privilege('service_role','public.applications',
       'SELECT,INSERT,UPDATE,REFERENCES') then
    raise exception 'service_role retained effective direct applications access';
  end if;
  if not has_table_privilege('service_role','public.members','SELECT,UPDATE') or
     not has_any_column_privilege('service_role','public.members','SELECT') then
    raise exception 'Follow-up migration unexpectedly changed member grants';
  end if;
end $$;

create table public.future_privilege_probe (id bigint generated always as identity primary key);
do $$ begin
  if has_table_privilege('anon','public.future_privilege_probe','SELECT,INSERT,UPDATE,DELETE') or
     has_table_privilege('authenticated','public.future_privilege_probe','SELECT,INSERT,UPDATE,DELETE') or
     has_sequence_privilege('anon',pg_get_serial_sequence('public.future_privilege_probe','id'),'USAGE,SELECT,UPDATE') or
     has_sequence_privilege('authenticated',pg_get_serial_sequence('public.future_privilege_probe','id'),'USAGE,SELECT,UPDATE') then
    raise exception 'Future postgres-owned public object received API-role privileges';
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
    insert into public.members (id,name,role,department) values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','Unauthorized','Member','Technical');
    raise exception 'ordinary user inserted a member';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.members set name='Unauthorized';
    if found then raise exception 'ordinary user updated members'; end if;
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
  if (select linkedin from public.public_members where name='Fixture Member') is not null then
    raise exception 'Unapproved social host leaked through public view';
  end if;
end $$;
reset role;

insert into app_private.admin_users (user_id) values ('11111111-1111-4111-8111-111111111111');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
set local role authenticated;
do $$ declare member_id uuid; application_id bigint; begin
  if not app_private.is_admin() then raise exception 'admin allowlist failed'; end if;
  insert into public.members (id,name,role,department,image_url)
    values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','Test Member','Member','Technical','/images/members/test.jpg') returning id into member_id;
  update public.members set role='Lead' where id=member_id;
  if not found then raise exception 'admin member update failed'; end if;
  delete from public.members where id=member_id;
  if not found then raise exception 'admin member delete failed'; end if;

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
