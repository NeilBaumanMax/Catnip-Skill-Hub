import assert from "node:assert/strict";
import test from "node:test";
import { DefaultAdminSkillService, SkillManagementError } from "../src/lib/admin/skills";
import { InMemorySkillRepository } from "../src/lib/data/skills";

const draftInput = {
  slug: "new-skill",
  title: "新的 Skill",
  originalName: "new-skill",
  summary: "用于验证管理员草稿和发布流程。",
  category: "编程开发" as const,
  tags: ["测试", "管理"],
  subtype: "single" as const,
  authorName: "Original Author",
  sourceUrl: "https://example.com/source",
  repositoryUrl: "https://github.com/example/new-skill",
  repositoryPath: "content/skills/new-skill",
  license: "License information unavailable",
  version: "1.0.0",
};

test("所有新资源强制先进入草稿", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  const skill = await service.create(draftInput);

  assert.equal(skill.governance.publishStatus, "draft");
  assert.equal(skill.governance.downloadEnabled, false);
  assert.equal(skill.governance.inRecommendationPool, false);
});

test("管理员可以编辑分类标签并显式控制下载", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await service.create(draftInput);
  const updated = await service.update("new-skill", {
    category: "自动化",
    tags: ["自动化", "自动化", "流程"],
    downloadEnabled: true,
    adminNotes: "管理员确认本地文件可用于镜像。",
  });

  assert.equal(updated.category, "自动化");
  assert.deepEqual(updated.tags, ["自动化", "流程"]);
  assert.equal(updated.governance.downloadEnabled, true);
});

test("License 文本不自动决定发布或下载法律结论", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await service.create(draftInput);
  const published = await service.transition("new-skill", "publish");
  assert.equal(published.governance.publishStatus, "published");
  assert.equal(published.source.license, "License information unavailable");
});

test("没有子项的 Skill Pack 不能误发布", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await service.create({ ...draftInput, slug: "empty-pack", originalName: "empty-pack", subtype: "native_pack" });

  await assert.rejects(
    service.transition("empty-pack", "publish"),
    (error: unknown) => error instanceof SkillManagementError && error.code === "invalid_transition",
  );
});

test("GitHub 仓库字段拒绝非 GitHub 或子路径地址", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await assert.rejects(
    service.create({ ...draftInput, slug: "bad-repo", originalName: "bad-repo", repositoryUrl: "https://example.com/repo" }),
    (error: unknown) => error instanceof SkillManagementError && error.code === "invalid_input",
  );
});

test("已发布资源必须先下架才能删除", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await service.create(draftInput);
  await service.transition("new-skill", "publish");

  await assert.rejects(
    service.delete("new-skill"),
    (error: unknown) => error instanceof SkillManagementError && error.code === "invalid_transition",
  );

  assert.equal((await service.transition("new-skill", "unlist")).governance.publishStatus, "unlisted");
  await service.delete("new-skill");
  assert.equal((await service.list()).length, 0);
});

test("无文件路径时不能开放会实际失败的镜像下载", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await service.create({ ...draftInput, slug: "no-path", originalName: "no-path", repositoryPath: undefined });

  await assert.rejects(
    service.update("no-path", { downloadEnabled: true }),
    (error: unknown) => error instanceof SkillManagementError && error.code === "invalid_input",
  );
});

test("受信 Release 资产可以在没有本地路径时开放下载", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await service.create({
    ...draftInput,
    slug: "remote-skill",
    originalName: "remote-skill",
    repositoryPath: undefined,
    version: "0.1.0",
    releaseAssetUrl: "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.1.0/remote-skill-0.1.0.zip",
  });
  const updated = await service.update("remote-skill", { downloadEnabled: true });
  assert.equal(updated.governance.downloadEnabled, true);
});

test("管理员录入拒绝非指定主库和文件名不匹配的 Release", async () => {
  const service = new DefaultAdminSkillService(new InMemorySkillRepository());
  await assert.rejects(
    service.create({
      ...draftInput,
      slug: "bad-release",
      originalName: "bad-release",
      releaseAssetUrl: "https://github.com/example/repo/releases/download/v1.0.0/bad-release-1.0.0.zip",
    }),
    (error: unknown) => error instanceof SkillManagementError && error.code === "invalid_input",
  );
});

test("仓储返回副本且实例之间隔离", async () => {
  const first = new InMemorySkillRepository();
  const second = new InMemorySkillRepository();
  const service = new DefaultAdminSkillService(first);
  const created = await service.create(draftInput);
  (created.tags as string[]).push("should-not-mutate");

  assert.deepEqual((await first.findBySlug("new-skill"))?.tags, ["测试", "管理"]);
  assert.equal((await second.list()).length, 0);
});
