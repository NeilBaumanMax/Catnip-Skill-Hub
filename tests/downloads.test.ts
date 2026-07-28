import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { strFromU8, unzipSync } from "fflate";
import { getSkillBySlug, type SkillResource } from "../src/lib/domain/skills";
import { buildSkillArchive, SkillDownloadError } from "../src/lib/downloads";

test("ZIP 保持原 Skill 文件并只在外层加入 Catnip 文件", async () => {
  const skill = getSkillBySlug("project-brief");
  assert.ok(skill);

  const archive = await buildSkillArchive(skill, {
    downloadedAt: new Date("2026-07-28T14:00:00.000Z"),
    catnipPageUrl: "https://catnip.example/skills/project-brief",
  });
  const files = unzipSync(archive.bytes);

  assert.equal(archive.filename, "project-brief.zip");
  assert.ok(files["project-brief/SKILL.md"]);
  assert.ok(files["project-brief/LICENSE"]);
  assert.ok(files["project-brief/agents/openai.yaml"]);
  assert.ok(files["Catnip-安装说明.md"]);
  assert.ok(files["Catnip-来源信息.json"]);
  assert.equal(Object.keys(files).filter((path) => path.startsWith("project-brief/Catnip-")).length, 0);

  const originalSkill = await readFile(resolve("content/skills/project-brief/SKILL.md"));
  assert.deepEqual(Buffer.from(files["project-brief/SKILL.md"]), originalSkill);

  const guide = strFromU8(files["Catnip-安装说明.md"]);
  assert.match(guide, /Claude Code CLI/);
  assert.match(guide, /Codex CLI/);
  assert.match(guide, /--skill project-brief/);

  const metadata = JSON.parse(strFromU8(files["Catnip-来源信息.json"]));
  assert.equal(metadata.originalName, "project-brief");
  assert.equal(metadata.license, "MIT");
  assert.equal(metadata.downloadedAt, "2026-07-28T14:00:00.000Z");
  assert.equal(metadata.catnipPageUrl, "https://catnip.example/skills/project-brief");
});

test("管理员未开放下载的资源被拒绝", async () => {
  const skill = getSkillBySlug("deeper-reasoning");
  assert.ok(skill);

  await assert.rejects(
    buildSkillArchive(skill),
    (error: unknown) => error instanceof SkillDownloadError && error.code === "not_enabled",
  );
});

test("即使管理员字段为 true 也拒绝逃逸项目目录的路径", async () => {
  const skill = getSkillBySlug("project-brief");
  assert.ok(skill);

  const unsafeSkill: SkillResource = {
    ...skill,
    source: { ...skill.source, repositoryPath: "../outside-project" },
    governance: { ...skill.governance, downloadEnabled: true },
  };

  await assert.rejects(
    buildSkillArchive(unsafeSkill),
    (error: unknown) => error instanceof SkillDownloadError && error.code === "unsafe_path",
  );
});
