// Run only against the isolated Docker fixture, never a production database.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

const run = promisify(execFile);
const container = process.env.ECELL_LOCAL_DB_CONTAINER;
if (!container) throw new Error("Set ECELL_LOCAL_DB_CONTAINER to the isolated local test container");
const hash = (value) => createHash("sha256").update(value).digest("hex");

async function submit(email, ipHash) {
  const emailHash = hash(email);
  const sql = `set role service_role; select public.submit_application(` +
    `'Fixture Applicant','${email}','','PR',` +
    `'I want to contribute to useful projects with the team.',` +
    `'${ipHash}','${emailHash}');`;
  const { stdout } = await run("docker", ["exec", container, "psql", "-U", "postgres", "-tA", "-v", "ON_ERROR_STOP=1", "-c", sql]);
  return stdout.trim().split("\n").at(-1);
}

test("concurrent submissions of one email create one application", async () => {
  const nonce = randomUUID().replaceAll("-", "");
  const email = `duplicate-${nonce}@example.invalid`;
  const results = await Promise.all([
    submit(email, hash(`ip-a:${nonce}`)),
    submit(email, hash(`ip-b:${nonce}`)),
  ]);
  assert.deepEqual(results.sort(), ["accepted", "duplicate"]);
  const { stdout } = await run("docker", ["exec", container, "psql", "-U", "postgres", "-tA", "-c",
    `select count(*) from public.applications where email='${email}'`]);
  assert.equal(stdout.trim(), "1");
});

test("concurrent submissions from one IP cannot exceed five per hour", async () => {
  const nonce = randomUUID().replaceAll("-", "");
  const ipHash = hash(`same-ip:${nonce}`);
  const results = await Promise.all(Array.from({ length: 8 }, (_, n) =>
    submit(`rate-${n}-${nonce}@example.invalid`, ipHash)));
  assert.equal(results.filter((result) => result === "accepted").length, 5);
  assert.equal(results.filter((result) => result === "rate_limited").length, 3);
});
