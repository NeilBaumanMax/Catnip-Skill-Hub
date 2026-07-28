import assert from "node:assert/strict";
import test from "node:test";
import { POST as eventRoute } from "../src/app/api/skills/[slug]/events/route";
import { AnalyticsService, InMemoryAnalyticsRepository } from "../src/lib/analytics";

test("统计服务只接受四种增量事件并返回副本", async () => {
  const repository = new InMemoryAnalyticsRepository();
  const service = new AnalyticsService(repository, (slug) => slug === "public-skill");
  assert.equal((await service.record("public-skill", "view")).views, 1);
  assert.equal((await service.record("public-skill", "download_click")).downloadClicks, 1);
  assert.equal((await service.record("public-skill", "install_copy")).installCopies, 1);
  assert.equal((await service.record("public-skill", "source_visit")).sourceVisits, 1);
  const snapshot = await service.get("public-skill");
  assert.deepEqual(snapshot, { views: 1, downloadClicks: 1, installCopies: 1, sourceVisits: 1 });
  assert.notEqual(snapshot, await service.get("public-skill"));
  await assert.rejects(service.record("public-skill", "arbitrary_metric"), /无效/);
});

test("统计拒绝未知或非公开 Skill，Repository 实例彼此隔离", async () => {
  const first = new AnalyticsService(new InMemoryAnalyticsRepository(), (slug) => slug === "public-skill");
  const second = new AnalyticsService(new InMemoryAnalyticsRepository(), () => true);
  await first.record("public-skill", "view");
  assert.equal((await second.get("public-skill")).views, 0);
  await Promise.all(Array.from({ length: 20 }, () => second.record("public-skill", "view")));
  assert.equal((await second.get("public-skill")).views, 20);
  await assert.rejects(first.record("hidden-skill", "view"), /不存在或未公开/);
});

test("统计 API 强制同源、拒绝未知资源和无效事件", async () => {
  const context = { params: Promise.resolve({ slug: "deeper-reasoning" }) };
  const crossOrigin = await eventRoute(new Request("https://catnip.example/api/skills/deeper-reasoning/events", {
    method: "POST",
    headers: { origin: "https://evil.example", "content-type": "application/json" },
    body: JSON.stringify({ event: "view" }),
  }), context);
  assert.equal(crossOrigin.status, 403);

  const invalid = await eventRoute(new Request("https://catnip.example/api/skills/deeper-reasoning/events", {
    method: "POST",
    headers: { origin: "https://catnip.example", "content-type": "application/json" },
    body: JSON.stringify({ event: "set_total" }),
  }), context);
  assert.equal(invalid.status, 400);

  const missing = await eventRoute(new Request("https://catnip.example/api/skills/not-found/events", {
    method: "POST",
    headers: { origin: "https://catnip.example", "content-type": "application/json" },
    body: JSON.stringify({ event: "view" }),
  }), { params: Promise.resolve({ slug: "not-found" }) });
  assert.equal(missing.status, 404);
});
