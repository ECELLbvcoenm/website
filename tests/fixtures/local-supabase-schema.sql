-- Minimal Auth stand-in plus the exact pre-existing production members shape.
do $$ begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if;
  if not exists (select 1 from pg_roles where rolname='supabase_admin') then create role supabase_admin nologin; end if;
end $$;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;
grant usage on schema public to anon, authenticated, service_role;
create table public.members (
  id uuid primary key, name text, role text, department text,
  image_url text, linkedin_url text, rank integer
);
-- Match the reported broad public-schema defaults without changing global ACLs.
alter default privileges for role postgres in schema public grant all on tables to anon, authenticated;
alter default privileges for role postgres in schema public grant all on tables to service_role;
alter default privileges for role postgres in schema public grant all on sequences to anon, authenticated;
alter default privileges for role postgres in schema public grant execute on functions to anon, authenticated;
alter default privileges for role supabase_admin in schema public grant all on tables to anon, authenticated;
alter default privileges for role supabase_admin in schema public grant all on sequences to anon, authenticated;
alter default privileges for role supabase_admin in schema public grant execute on functions to anon, authenticated;
grant select, insert, update, delete on public.members to anon, authenticated;
grant select (linkedin_url), update (linkedin_url) on public.members to anon, authenticated;
grant select, update on public.members to service_role;
grant select (linkedin_url) on public.members to service_role;
insert into public.members (id,name,role,department,image_url,linkedin_url,rank)
values ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','Legacy Member','Member','Technical',
        'https://unrelated.example/old-avatar.png','https://linkedin.com/in/legacy',1);
insert into auth.users (id) values ('11111111-1111-4111-8111-111111111111');
