import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../src/app/api/admin/skills/route";
import { POST as login } from "../src/app/api/admin/session/route";
import { hashAdminPassword } from "../src/lib/auth";
import { getPublishedSkills } from "../src/lib/domain/skills";

test("未认证的管理 API 返回 401", async () => {
  const response = await GET(new Request("https://catnip.example/api/admin/skills"));
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "需要管理员登录。" });
});

test("真实登录路由签发 HttpOnly 会话且授权管理 API", async (context) => {
  const original = {
    email: process.env.CATNIP_ADMIN_EMAIL,
    passwordHash: process.env.CATNIP_ADMIN_PASSWORD_HASH,
    sessionSecret: process.env.CATNIP_SESSION_SECRET,
  };
  context.after(() => {
    if (original.email === undefined) delete process.env.CATNIP_ADMIN_EMAIL;
    else process.env.CATNIP_ADMIN_EMAIL = original.email;
    if (original.passwordHash === undefined) delete process.env.CATNIP_ADMIN_PASSWORD_HASH;
    else process.env.CATNIP_ADMIN_PASSWORD_HASH = original.passwordHash;
    if (original.sessionSecret === undefined) delete process.env.CATNIP_SESSION_SECRET;
    else process.env.CATNIP_SESSION_SECRET = original.sessionSecret;
  });

  process.env.CATNIP_ADMIN_EMAIL = "admin@example.test";
  process.env.CATNIP_ADMIN_PASSWORD_HASH = await hashAdminPassword("route-test-password");
  process.env.CATNIP_SESSION_SECRET = "route-test-session-secret-with-at-least-32-characters";

  const loginResponse = await login(new Request("https://catnip.example/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "https://catnip.example" },
    body: JSON.stringify({ email: "admin@example.test", password: "route-test-password" }),
  }));
  assert.equal(loginResponse.status, 200);
  const setCookie = loginResponse.headers.get("set-cookie");
  assert.match(setCookie ?? "", /catnip_admin_session=/);
  assert.match(setCookie ?? "", /HttpOnly/i);
  assert.doesNotMatch(setCookie ?? "", /route-test-password/);

  const cookie = setCookie?.split(";", 1)[0];
  const authorized = await GET(new Request("https://catnip.example/api/admin/skills", {
    headers: { cookie: cookie ?? "" },
  }));
  assert.equal(authorized.status, 200);
  const body = await authorized.json() as { skills: unknown[]; persistence: string };
  assert.equal(body.persistence, "process-memory");
  assert.equal(body.skills.length, getPublishedSkills().length);
});
