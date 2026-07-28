import assert from "node:assert/strict";
import test from "node:test";
import { POST as recommend } from "../src/app/api/recommendations/route";
import { adminSkillService } from "../src/lib/admin/skills";
import { InMemoryRecommendationRepository, RecommendationService } from "../src/lib/recommendations";

const input = {
  skillUrl: "https://github.com/example/useful-skill",
  sourceChannel: "GitHub",
  reason: "这个 Skill 解决了清晰的问题。",
  contact: "",
};

test("推荐线索独立保存，不创建 Skill 草稿", async () => {
  const repository = new InMemoryRecommendationRepository();
  const service = new RecommendationService(repository);
  const before = (await adminSkillService.list()).length;
  const lead = await service.submit(input, "visitor-a", new Date("2026-01-01T00:00:00Z"));
  assert.equal(lead.status, "new");
  assert.equal((await repository.list()).length, 1);
  assert.equal((await adminSkillService.list()).length, before);
});

test("推荐字段要求 HTTPS 且每标识每小时最多五次", async () => {
  const service = new RecommendationService(new InMemoryRecommendationRepository());
  await assert.rejects(service.submit({ ...input, skillUrl: "http://example.com/skill" }, "invalid"), /HTTPS/);
  for (let index = 0; index < 5; index += 1) await service.submit(input, "visitor-b", new Date(1000 + index));
  await assert.rejects(service.submit(input, "visitor-b", new Date(2000)), /频繁/);
  await service.submit(input, "visitor-c", new Date(2000));
});

test("公开推荐 API 强制同源并用蜜罐静默拒绝机器人", async () => {
  const crossOrigin = await recommend(new Request("https://catnip.example/api/recommendations", {
    method: "POST", headers: { origin: "https://evil.example", "content-type": "application/json" }, body: JSON.stringify(input),
  }));
  assert.equal(crossOrigin.status, 403);

  const honeypot = await recommend(new Request("https://catnip.example/api/recommendations", {
    method: "POST", headers: { origin: "https://catnip.example", "content-type": "application/json" }, body: JSON.stringify({ ...input, website: "spam" }),
  }));
  assert.equal(honeypot.status, 202);
});
