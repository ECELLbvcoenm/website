import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseApplication } from "../lib/application.ts";

const valid = {
  full_name: "  Jane   Doe  ",
  email: "  JANE@example.com  ",
  contact_number: "+91 98765 43210",
  department: "Technical",
  motivation: "I want to contribute to the team and learn by building projects.",
};

test("valid anonymous application is normalized to five allowed fields", () => {
  assert.deepEqual(parseApplication(valid), {
    ...valid, full_name: "Jane Doe", email: "jane@example.com",
  });
});

test("invalid, oversized, malformed and unexpected fields are rejected", () => {
  const cases = [
    { ...valid, full_name: "A" },
    { ...valid, full_name: "A".repeat(121) },
    { ...valid, email: "not-an-email" },
    { ...valid, contact_number: "phone" },
    { ...valid, department: "Admin" },
    { ...valid, motivation: "too short" },
    { ...valid, motivation: "x".repeat(2001) },
    { ...valid, status: "approved" },
    { ...valid, admin_role: true },
    { ...valid, internal_notes: "override" },
    { ...valid, website: "https://spam.example" },
  ];
  for (const value of cases) assert.equal(parseApplication(value), null);
  assert.equal(parseApplication([]), null);
  assert.equal(parseApplication(null), null);
});

test("client form does not import a privileged client or write directly to Supabase", () => {
  const source = readFileSync(new URL("../app/join/page.tsx", import.meta.url), "utf8");
  assert.match(source, /fetch\("\/api\/applications"/);
  assert.doesNotMatch(source, /\.from\("applications"\)/);
  assert.doesNotMatch(source, /SERVICE_ROLE|SECRET_KEY/);
});

test("SQL denies anonymous table writes and isolates applicant reads", () => {
  const migration = readFileSync(new URL("../supabase/migrations/202610180001_lock_down_public_data.sql", import.meta.url), "utf8");
  for (const table of ["members", "projects", "applications"]) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  assert.match(migration, /revoke all on public\.members, public\.projects, public\.applications from public, anon, authenticated/);
  assert.doesNotMatch(migration, /grant .* on public\.applications to anon/i);
  assert.match(migration, /applications_admin_select/);
  assert.match(migration, /app_private\.is_admin\(\)/);
  assert.match(migration, /create view public\.public_members/);
  assert.match(migration, /from public\.members where is_public = true/);
  assert.match(migration, /create view public\.public_projects/);
  assert.match(migration, /from public\.projects where is_public = true/);
  for (const table of ["members", "projects", "applications"]) {
    for (const operation of ["select", "insert", "update", "delete"]) {
      assert.match(migration, new RegExp(`create policy ${table}_admin_${operation} on public\\.${table}`));
    }
  }
});

test("submission function is service-only and enforces atomic rate and duplicate checks", () => {
  const migration = readFileSync(new URL("../supabase/migrations/202610180002_application_submission.sql", import.meta.url), "utf8");
  assert.match(migration, /revoke all on function public\.submit_application.* from public, anon, authenticated/);
  assert.match(migration, /grant execute on function public\.submit_application.* to service_role/);
  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(migration, /rate_limited/);
  assert.match(migration, /duplicate/);
  assert.match(migration, /insert into public\.applications \(full_name, email, contact_number, department, motivation\)/);
});
