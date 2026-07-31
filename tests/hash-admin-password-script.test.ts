import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { verifyAdminPassword } from "../src/lib/auth/password";

function runHashTool(password: string) {
  return spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/hash-admin-password.ts"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      input: `${password}\n`,
    },
  );
}

test("管理员密码哈希 CLI 可在当前 tsx 输出模式下执行", async () => {
  const password = "catnip-test-password";
  const result = runHashTool(password);

  assert.equal(result.status, 0, result.stderr);
  const hash = result.stdout.trim();
  assert.match(hash, /^scrypt\$/);
  assert.equal(await verifyAdminPassword(password, hash), true);
});

test("管理员密码哈希 CLI 继续拒绝过短密码", () => {
  const result = runHashTool("too-short");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /12 至 256/);
});
