import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

test("production client chunks contain no service-role or server secret", () => {
  const root = join(process.cwd(), ".next", "static");
  assert.ok(existsSync(root), "run a production build before this test");
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (/\.(js|css|map)$/.test(path)) files.push(path);
    }
  };
  visit(root);
  assert.ok(files.length > 0);
  for (const file of files) {
    const contents = readFileSync(file, "utf8");
    assert.doesNotMatch(contents, /SUPABASE_SERVICE_ROLE_KEY|APPLICATION_HASH_SECRET|sb_secret_/);
    const actualSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (actualSecret) assert.ok(!contents.includes(actualSecret));
  }
});
