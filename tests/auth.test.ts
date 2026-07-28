import assert from "node:assert/strict";
import test from "node:test";
import {
  AuthConfigurationError,
  authenticateAdmin,
  createAdminSessionToken,
  hashAdminPassword,
  isSameOriginMutation,
  loadAdminAuthConfig,
  readAdminSessionToken,
  verifyAdminPassword,
} from "../src/lib/auth";

const email = "admin@example.test";
const sessionSecret = "phase4-test-session-secret-with-32-characters";

test("scrypt 管理员密码只接受正确明文", async () => {
  const encoded = await hashAdminPassword("a-long-test-password");
  assert.match(encoded, /^scrypt\$16384\$8\$1\$/);
  assert.equal(await verifyAdminPassword("a-long-test-password", encoded), true);
  assert.equal(await verifyAdminPassword("wrong-test-password", encoded), false);
  assert.equal(await verifyAdminPassword("a-long-test-password", "invalid"), false);
});

test("认证配置缺失时安全失败且不编造默认值", () => {
  assert.throws(() => loadAdminAuthConfig({}), AuthConfigurationError);
  assert.throws(
    () => loadAdminAuthConfig({
      CATNIP_ADMIN_EMAIL: email,
      CATNIP_ADMIN_PASSWORD_HASH: "scrypt$placeholder",
      CATNIP_SESSION_SECRET: "short",
    }),
    AuthConfigurationError,
  );
});

test("管理员邮箱和密码必须同时匹配", async () => {
  const passwordHash = await hashAdminPassword("another-test-password");
  const config = loadAdminAuthConfig({
    CATNIP_ADMIN_EMAIL: email.toUpperCase(),
    CATNIP_ADMIN_PASSWORD_HASH: passwordHash,
    CATNIP_SESSION_SECRET: sessionSecret,
  });

  assert.deepEqual(await authenticateAdmin(email, "another-test-password", config), { email, role: "admin" });
  assert.equal(await authenticateAdmin("other@example.test", "another-test-password", config), null);
  assert.equal(await authenticateAdmin(email, "wrong-test-password", config), null);
});

test("签名会话拒绝篡改和过期 Token", () => {
  const now = new Date("2026-07-28T15:00:00.000Z");
  const token = createAdminSessionToken({ email, role: "admin" }, sessionSecret, now);

  assert.deepEqual(readAdminSessionToken(token, sessionSecret, now), { email, role: "admin" });
  assert.equal(readAdminSessionToken(`${token}tampered`, sessionSecret, now), null);
  assert.equal(readAdminSessionToken(token, sessionSecret, new Date("2026-07-29T00:00:01.000Z")), null);
});

test("写请求只接受同源 Origin", () => {
  assert.equal(isSameOriginMutation(new Request("https://catnip.example/api", { headers: { origin: "https://catnip.example" } })), true);
  assert.equal(isSameOriginMutation(new Request("https://catnip.example/api", { headers: { origin: "https://evil.example" } })), false);
  assert.equal(isSameOriginMutation(new Request("https://catnip.example/api")), false);
});
