-- Isolated PostgreSQL fixture. It checks SQL behavior, not the production schema.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;
grant usage on schema public to anon, authenticated, service_role;

create table public.members (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null,
  department text not null,
  image_url text,
  rank integer,
  instagram text,
  linkedin text,
  github text,
  private_email text
);
create table public.projects (
  id bigint generated always as identity primary key,
  title text not null,
  internal_notes text
);
create table public.applications (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  contact_number text,
  department text not null,
  motivation text not null,
  status text not null default 'pending',
  internal_notes text
);
insert into auth.users (id) values ('11111111-1111-4111-8111-111111111111');
insert into public.members (name, role, department, image_url, private_email)
values ('Fixture Member', 'Member', 'Technical', '/images/members/fixture.jpg', 'private@example.invalid');
grant select, insert, update, delete on public.members, public.projects, public.applications to anon, authenticated;
