// Run only against an isolated Supabase project and a test deployment.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const env = process.env;
const required = [
  "ECELL_TEST_SUPABASE_URL", "ECELL_TEST_SUPABASE_ANON_KEY",
  "ECELL_TEST_SUPABASE_SERVICE_ROLE_KEY", "ECELL_TEST_ADMIN_EMAIL",
  "ECELL_TEST_ADMIN_PASSWORD", "ECELL_TEST_USER_EMAIL",
  "ECELL_TEST_USER_PASSWORD", "ECELL_TEST_DEPLOYMENT_URL",
];
for (const name of required) if (!env[name]) throw new Error(`Missing ${name}`);
if (env.ECELL_TEST_ACK !== "isolated-project") throw new Error("Set ECELL_TEST_ACK=isolated-project");
const supabaseUrl = new URL(env.ECELL_TEST_SUPABASE_URL);
const deploymentUrl = new URL(env.ECELL_TEST_DEPLOYMENT_URL);
if (supabaseUrl.hostname === "gucesqkwizbndffsvqtk.supabase.co" ||
    deploymentUrl.hostname === "ecell-bvcoenm.vercel.app") {
  throw new Error("Production targets are forbidden");
}
if (supabaseUrl.protocol !== "https:" && supabaseUrl.hostname !== "127.0.0.1" && supabaseUrl.hostname !== "localhost") {
  throw new Error("Test Supabase URL must use HTTPS or loopback");
}
if (deploymentUrl.protocol !== "https:" && deploymentUrl.hostname !== "127.0.0.1" && deploymentUrl.hostname !== "localhost") {
  throw new Error("Test deployment URL must use HTTPS or loopback");
}

const options = { auth: { autoRefreshToken: false, persistSession: false } };
const anonymous = createClient(supabaseUrl.href, env.ECELL_TEST_SUPABASE_ANON_KEY, options);
const ordinary = createClient(supabaseUrl.href, env.ECELL_TEST_SUPABASE_ANON_KEY, options);
const admin = createClient(supabaseUrl.href, env.ECELL_TEST_SUPABASE_ANON_KEY, options);
const service = createClient(supabaseUrl.href, env.ECELL_TEST_SUPABASE_SERVICE_ROLE_KEY, options);
const nonce = randomUUID().replaceAll("-", "");
const name = `Security Fixture ${nonce}`;
const email = `security-${nonce}@example.invalid`;
const motivation = "I want to contribute to the E-Cell team and build useful projects.";
const application = { full_name: "Security Applicant", email, contact_number: "", department: "PR", motivation };
const sha = (value) => createHash("sha256").update(value).digest("hex");

async function api(body, headers = {}) {
  return fetch(new URL("/api/applications", deploymentUrl), {
    method: "POST", headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

test("isolated Supabase Auth, PostgREST, views, and test deployment", async () => {
  const [ordinaryLogin, adminLogin] = await Promise.all([
    ordinary.auth.signInWithPassword({ email: env.ECELL_TEST_USER_EMAIL, password: env.ECELL_TEST_USER_PASSWORD }),
    admin.auth.signInWithPassword({ email: env.ECELL_TEST_ADMIN_EMAIL, password: env.ECELL_TEST_ADMIN_PASSWORD }),
  ]);
  assert.ifError(ordinaryLogin.error);
  assert.ifError(adminLogin.error);
  assert.notEqual(ordinaryLogin.data.user.id, adminLogin.data.user.id);

  let memberId, adminApplicationId, submittedApplicationId;
  try {
    const anonRead = await anonymous.from("applications").select("id,email");
    assert.ok(anonRead.error, "anonymous application read must be denied");
    const baseRead = await anonymous.from("members").select("*");
    assert.ok(baseRead.error, "anonymous members base-table read must be denied");
    const anonWrite = await anonymous.from("applications").insert(application);
    assert.ok(anonWrite.error, "anonymous direct application write must be denied");
    const anonMemberWrite = await anonymous.from("members").insert(
      { id: randomUUID(), name, role: "Member", department: "Technical" });
    assert.ok(anonMemberWrite.error, "anonymous member insert must be denied");
    const anonRpc = await anonymous.rpc("submit_application", {
      p_full_name: "Security Applicant", p_email: email, p_contact_number: "",
      p_department: "PR", p_motivation: motivation,
      p_ip_hash: sha(`anon-${nonce}`), p_email_hash: sha(email),
    });
    assert.ok(anonRpc.error, "anonymous direct privileged RPC must be denied");
    const userRpc = await ordinary.rpc("submit_application", {
      p_full_name: "Security Applicant", p_email: email, p_contact_number: "",
      p_department: "PR", p_motivation: motivation,
      p_ip_hash: sha(`user-${nonce}`), p_email_hash: sha(email),
    });
    assert.ok(userRpc.error, "ordinary user direct privileged RPC must be denied");

    const ordinaryRead = await ordinary.from("applications").select("id,email");
    assert.ifError(ordinaryRead.error);
    assert.deepEqual(ordinaryRead.data, []);
    const ordinaryWrite = await ordinary.from("members").insert({ id: randomUUID(), name, role: "Member", department: "Technical" });
    assert.ok(ordinaryWrite.error, "ordinary user member write must be denied");
    const ordinaryApplicationWrite = await ordinary.from("applications").insert(application);
    assert.ok(ordinaryApplicationWrite.error, "ordinary user application write must be denied");
    const ordinaryAdminTable = await ordinary.schema("app_private").from("admin_users").insert({ user_id: ordinaryLogin.data.user.id });
    assert.ok(ordinaryAdminTable.error, "ordinary user must not change the allowlist");

    const member = await admin.from("members").insert({ id: randomUUID(), name, role: "Member", department: "Technical", is_public: true,
      image_url: "/images/members/test.jpg" }).select("id").single();
    assert.ifError(member.error); memberId = member.data.id;
    const memberView = await anonymous.from("public_members").select("*").eq("id", memberId).single();
    assert.ifError(memberView.error);
    assert.deepEqual(Object.keys(memberView.data).sort(),
      ["id", "name", "role", "department", "image_url", "rank", "instagram", "linkedin", "github"].sort());
    for (const [table, id, change] of [["members", memberId, { role: "Unauthorized" }]]) {
      const updated = await ordinary.from(table).update(change).eq("id", id).select("id");
      assert.ifError(updated.error);
      assert.deepEqual(updated.data, []);
      const deleted = await ordinary.from(table).delete().eq("id", id).select("id");
      assert.ifError(deleted.error);
      assert.deepEqual(deleted.data, []);
    }

    for (const path of ["/join", "/members", "/projects"]) {
      const page = await fetch(new URL(path, deploymentUrl));
      assert.equal(page.status, 200, `${path} must load in the test deployment`);
    }

    for (const bad of [{ ...application, status: "approved" }, { ...application, email: "bad" },
      { ...application, motivation: "x".repeat(2001) }]) {
      const response = await api(bad);
      assert.equal(response.status, 400);
    }
    const crossSite = await api(application, { origin: "https://unrelated.example" });
    assert.equal(crossSite.status, 403);
    const first = await api(application);
    assert.equal(first.status, 201);
    const duplicate = await api(application);
    assert.equal(duplicate.status, 201);
    assert.equal(await first.text(), await duplicate.text());
    const submitted = await admin.from("applications").select("id,email").eq("email", email);
    assert.ifError(submitted.error);
    assert.equal(submitted.data.length, 1);
    submittedApplicationId = submitted.data[0].id;
    const ordinaryAppUpdate = await ordinary.from("applications").update({ status: "approved" })
      .eq("id", submittedApplicationId).select("id");
    assert.ifError(ordinaryAppUpdate.error);
    assert.deepEqual(ordinaryAppUpdate.data, []);
    const ordinaryAppDelete = await ordinary.from("applications").delete()
      .eq("id", submittedApplicationId).select("id");
    assert.ifError(ordinaryAppDelete.error);
    assert.deepEqual(ordinaryAppDelete.data, []);

    const adminApplication = await admin.from("applications").insert({ ...application,
      email: `admin-${nonce}@example.invalid` }).select("id").single();
    assert.ifError(adminApplication.error); adminApplicationId = adminApplication.data.id;
    for (const [table, id, change] of [
      ["members", memberId, { role: "Lead" }],
      ["applications", adminApplicationId, { status: "approved" }],
    ]) {
      const updated = await admin.from(table).update(change).eq("id", id).select("id").single();
      assert.ifError(updated.error);
    }

    const ipHash = sha(`rate-${nonce}`);
    const rateResults = await Promise.all(Array.from({ length: 7 }, (_, index) =>
      service.rpc("submit_application", {
        p_full_name: "Rate Applicant", p_email: `rate-${index}-${nonce}@example.invalid`,
        p_contact_number: "", p_department: "PR", p_motivation: motivation,
        p_ip_hash: ipHash, p_email_hash: sha(`rate-${index}-${nonce}`),
      })));
    for (const result of rateResults) assert.ifError(result.error);
    assert.equal(rateResults.filter((result) => result.data === "accepted").length, 5);
    assert.equal(rateResults.filter((result) => result.data === "rate_limited").length, 2);
    for (const [table, id] of [["applications", adminApplicationId], ["members", memberId]]) {
      const deleted = await admin.from(table).delete().eq("id", id).select("id").single();
      assert.ifError(deleted.error);
    }
    adminApplicationId = memberId = undefined;
  } finally {
    for (const [table, id] of [["applications", adminApplicationId], ["applications", submittedApplicationId],
      ["members", memberId]]) {
      if (id !== undefined) await admin.from(table).delete().eq("id", id);
    }
  }
});
