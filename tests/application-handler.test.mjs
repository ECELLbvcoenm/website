import test from "node:test";
import assert from "node:assert/strict";
import { handleApplicationRequest } from "../lib/application-handler.ts";

const input = {
  full_name: "Jane Doe", email: "jane@example.com", contact_number: "",
  department: "PR", motivation: "I want to build useful projects with the team.",
};

function request(body = input, headers = {}) {
  return new Request("https://ecell-bvcoenm.vercel.app/api/applications", {
    method: "POST", headers: {
      "content-type": "application/json", origin: "https://ecell-bvcoenm.vercel.app",
      "x-vercel-forwarded-for": "203.0.113.4", ...headers,
    }, body: JSON.stringify(body),
  });
}

test("valid anonymous submission reaches the database adapter with normalized fields", async () => {
  let passed;
  const response = await handleApplicationRequest(request(), async (application, ip) => {
    passed = { application, ip };
    return "accepted";
  });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(passed, { application: input, ip: "203.0.113.4" });
});

test("invalid and privileged fields do not reach the database adapter", async () => {
  let calls = 0;
  const response = await handleApplicationRequest(request({ ...input, status: "approved" }), async () => {
    calls++;
    return "accepted";
  });
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});

test("cross-site and oversized requests are rejected", async () => {
  const submit = async () => "accepted";
  assert.equal((await handleApplicationRequest(request(input, { origin: "https://evil.example" }), submit)).status, 403);
  assert.equal((await handleApplicationRequest(request(input, { "content-length": "9000" }), submit)).status, 413);
  assert.equal((await handleApplicationRequest(request({ ...input, motivation: "x".repeat(9000) }), submit)).status, 400);
  assert.equal((await handleApplicationRequest(request(input, { "content-type": "text/plain" }), submit)).status, 415);
});

test("rate limits and failures have safe responses", async () => {
  const limited = await handleApplicationRequest(request(), async () => "rate_limited");
  assert.equal(limited.status, 429);
  const failed = await handleApplicationRequest(request(), async () => { throw new Error("database password and applicant data"); });
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /password|applicant data/);
});

test("duplicate and new submissions have identical public responses", async () => {
  const accepted = await handleApplicationRequest(request(), async () => "accepted");
  const duplicate = await handleApplicationRequest(request(), async () => "duplicate");
  assert.equal(accepted.status, duplicate.status);
  assert.equal(await accepted.text(), await duplicate.text());
});
