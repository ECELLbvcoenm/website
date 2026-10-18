import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { memberImagePath } from "../lib/member-image.ts";

for (const page of ["app/page.tsx", "app/members/page.tsx"]) {
  test(`${page} uses the publication-filtered view without a local roster fallback`, () => {
    const source = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    assert.match(source, /\.from\("public_members"\)/);
    assert.doesNotMatch(source, /LOCAL_MEMBERS|\.from\("members"\)/);
    assert.match(source, /memberImagePath\(member\.name\)/);
  });
}

test("member fallback images stay under the local member-image directory", () => {
  assert.equal(memberImagePath("Jane Doe"), "/images/members/jane_doe.jpg");
  for (const name of ["../../admin", "//evil.example/avatar", "member?x=1", "member#x", "", null, 12]) {
    assert.equal(memberImagePath(name), null);
  }
});
