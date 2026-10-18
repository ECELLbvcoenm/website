// Run only with ECELL_LOCAL_DB_CONTAINER pointing at a disposable Postgres container.
import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const container = process.env.ECELL_LOCAL_DB_CONTAINER;
const fixture = readFileSync(new URL("./fixtures/local-supabase-schema.sql", import.meta.url), "utf8");
const migration = (name) => readFileSync(new URL(`../supabase/migrations/202610180${name}.sql`, import.meta.url), "utf8");

function sql(database, input) {
  const result = spawnSync("docker", ["exec", "-i", container, "psql", "-X", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", database],
    { input, encoding: "utf8" });
  if (result.error) throw result.error;
  return result;
}

function database() {
  const name = `ecell_guard_${randomBytes(5).toString("hex")}`;
  assert.equal(sql("postgres", `create database ${name};`).status, 0);
  assert.equal(sql(name, fixture).status, 0);
  return name;
}

test("000 rejects a changed UUID member schema without creating applications", { skip: !container }, () => {
  const db = database();
  assert.equal(sql(db, "alter table public.members alter column id type text;").status, 0);
  const result = sql(db, migration("000_create_base_tables"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unexpected public\.members columns or types/);
  assert.match(sql(db, "select to_regclass('public.applications') is null;").stdout, / t\s/);
});

test("000 rejects an existing projects object", { skip: !container }, () => {
  const db = database();
  assert.equal(sql(db, "create table public.projects (id integer);").status, 0);
  const result = sql(db, migration("000_create_base_tables"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /target application object already exists/);
});

test("000 locks members before 001 and removes reported postgres defaults", { skip: !container }, () => {
  const db = database();
  assert.equal(sql(db, migration("000_create_base_tables")).status, 0);
  const checks = sql(db, `select relrowsecurity and
    not has_table_privilege('anon','public.members','SELECT,INSERT,UPDATE,DELETE,TRUNCATE') and
    not has_any_column_privilege('anon','public.members','SELECT,INSERT,UPDATE') and
    not has_table_privilege('authenticated','public.members','SELECT,INSERT,UPDATE,DELETE,TRUNCATE')
    from pg_class where oid='public.members'::regclass;`);
  assert.match(checks.stdout, / t\s/);
  assert.match(sql(db, "select to_regclass('public.applications') is not null;").stdout, / t\s/);
});

test("000 refuses global postgres table defaults it cannot narrow per schema", { skip: !container }, () => {
  const db = database();
  assert.equal(sql(db, "alter default privileges for role postgres grant select on tables to anon;").status, 0);
  const result = sql(db, migration("000_create_base_tables"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Global postgres table\/sequence default grants need separate review/);
  assert.match(sql(db, "select to_regclass('public.applications') is null;").stdout, / t\s/);
  assert.match(sql(db, "select relrowsecurity from pg_class where oid='public.members'::regclass;").stdout, / f\s/);
});

test("000 rejects an unexpected member index without changing its rows", { skip: !container }, () => {
  const db = database();
  assert.equal(sql(db, "create index members_name_extra on public.members(name);").status, 0);
  const result = sql(db, migration("000_create_base_tables"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unexpected policy, trigger, rule, or index/);
  assert.match(sql(db, "select count(*) from public.members where id='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';").stdout, / 1\s/);
});

test("001 rejects an existing public view without changing member grants", { skip: !container }, () => {
  const db = database();
  assert.equal(sql(db, migration("000_create_base_tables")).status, 0);
  assert.equal(sql(db, "create view public.public_members as select id from public.members;").status, 0);
  const result = sql(db, migration("001_lock_down_public_data"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /target schema or view already exists/);
  assert.match(sql(db, "select relrowsecurity from pg_class where oid='public.members'::regclass;").stdout, / t\s/);
});

test("002 rejects absent applications and leaves submission function absent", { skip: !container }, () => {
  const db = database();
  const result = sql(db, migration("002_application_submission"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Apply migration 001 first|Migration 001 must create applications/);
  assert.match(sql(db, "select to_regprocedure('public.submit_application(text,text,text,text,text,text,text)') is null;").stdout, / t\s/);
});

test("002 rejects an unexpected application column before installing the RPC", { skip: !container }, () => {
  const db = database();
  assert.equal(sql(db, migration("000_create_base_tables")).status, 0);
  assert.equal(sql(db, migration("001_lock_down_public_data")).status, 0);
  assert.equal(sql(db, "alter table public.applications add column extra_field text;").status, 0);
  const result = sql(db, migration("002_application_submission"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /applications columns or validated input constraint/);
  assert.match(sql(db, "select to_regprocedure('public.submit_application(text,text,text,text,text,text,text)') is null;").stdout, / t\s/);
});

test("003 clears direct and column service_role grants while preserving RPC and members", { skip: !container }, () => {
  const db = database();
  for (const name of ["000_create_base_tables", "001_lock_down_public_data", "002_application_submission"]) {
    assert.equal(sql(db, migration(name)).status, 0);
  }
  assert.match(sql(db, "select has_table_privilege('service_role','public.applications','SELECT');").stdout, / t\s/);
  assert.equal(sql(db, "grant select (email), update (status) on public.applications to service_role;").status, 0);
  const migrationResult = sql(db, migration("003_restrict_service_application_access"));
  assert.equal(migrationResult.status, 0, `${db}: ${migrationResult.stderr}`);
  const checks = sql(db, `select
    not has_table_privilege('service_role','public.applications',
      'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
    and not has_any_column_privilege('service_role','public.applications',
      'SELECT,INSERT,UPDATE,REFERENCES')
    and has_function_privilege('service_role',
      'public.submit_application(text,text,text,text,text,text,text)','EXECUTE')
    and has_table_privilege('service_role','public.members','SELECT,UPDATE');`);
  assert.match(checks.stdout, / t\s/);
});

test("003 rolls back if an inherited grant restores effective application access", { skip: !container }, () => {
  const db = database();
  for (const name of ["000_create_base_tables", "001_lock_down_public_data", "002_application_submission"]) {
    assert.equal(sql(db, migration(name)).status, 0);
  }
  assert.equal(sql(db, "grant authenticated to service_role;").status, 0);
  try {
    const result = sql(db, migration("003_restrict_service_application_access"));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /effective direct applications access/);
    assert.match(sql(db, "select has_table_privilege('service_role','public.applications','TRUNCATE');").stdout, / t\s/);
  } finally {
    // Role membership is cluster-wide even though the fixture database is disposable.
    assert.equal(sql(db, "revoke authenticated from service_role;").status, 0);
  }
});

test("000 through 003 pass SQL RLS fixtures and effective-rights postflight", { skip: !container }, () => {
  const db = database();
  for (const name of ["000_create_base_tables", "001_lock_down_public_data", "002_application_submission", "003_restrict_service_application_access"]) {
    const migrationResult = sql(db, migration(name));
    assert.equal(migrationResult.status, 0, `${name}: ${migrationResult.stderr}`);
  }
  const fixtureChecks = readFileSync(new URL("./rls.fixture.integration.sql", import.meta.url), "utf8");
  assert.equal(sql(db, fixtureChecks).status, 0);
  const rlsChecks = readFileSync(new URL("./rls.integration.sql", import.meta.url), "utf8")
    .replaceAll(":'admin_uid'", "'11111111-1111-4111-8111-111111111111'");
  assert.equal(sql(db, rlsChecks).status, 0);
  const postflight = readFileSync(new URL("../supabase/postflight.sql", import.meta.url), "utf8");
  const result = spawnSync("docker", ["exec", "-i", container, "psql", "-X", "-tA", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", db],
    { input: postflight, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const [relationsJson, rpcJson, noDirectAccess] = result.stdout.trim().split("|");
  const relations = JSON.parse(relationsJson);
  const applications = relations.find((row) => row.object_name === "public.applications" && row.role_name === "service_role");
  assert.ok(applications);
  for (const [key, value] of Object.entries(applications)) {
    if (key.startsWith("can_")) assert.equal(value, false, key);
  }
  assert.deepEqual(JSON.parse(rpcJson), { anon: false, authenticated: false, service_role: true });
  assert.equal(noDirectAccess, "t");
});
