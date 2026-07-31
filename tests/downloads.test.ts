import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { strFromU8, unzipSync } from "fflate";
import { getSkillBySlug, type SkillResource } from "../src/lib/domain/skills";
import {
  buildSkillArchive,
  getCatnipReleaseAssetError,
  resolveSkillDownload,
  SkillDownloadError,
} from "../src/lib/downloads";
import { GET as downloadRoute } from "../src/app/api/skills/[slug]/download/route";

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

test("受信 Catnip Release 资产优先解析为不可变重定向", async () => {
  const skill = getSkillBySlug("project-brief");
  assert.ok(skill?.source.releaseAssetUrl);
  assert.equal(
    getCatnipReleaseAssetError(skill.source.releaseAssetUrl, skill.slug, skill.source.version),
    null,
  );

  const resolved = await resolveSkillDownload(skill);
  assert.equal(resolved.kind, "release_redirect");
  if (resolved.kind === "release_redirect") assert.equal(resolved.url, skill.source.releaseAssetUrl);
});

test("Release 来源拒绝任意域名、latest 和不匹配文件名", () => {
  assert.match(
    getCatnipReleaseAssetError(
      "https://example.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.1.0/project-brief-0.1.0.zip",
      "project-brief",
      "0.1.0",
    ) ?? "",
    /github.com/,
  );
  assert.match(
    getCatnipReleaseAssetError(
      "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/latest/project-brief-0.1.0.zip",
      "project-brief",
      "0.1.0",
    ) ?? "",
    /版本 Tag/,
  );
  assert.match(
    getCatnipReleaseAssetError(
      "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.1.0/other-0.1.0.zip",
      "project-brief",
      "0.1.0",
    ) ?? "",
    /slug 和版本/,
  );
  assert.match(
    getCatnipReleaseAssetError(
      "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v9.9.9/project-brief-0.1.0.zip",
      "project-brief",
      "0.1.0",
    ) ?? "",
    /版本 Tag/,
  );
});

test("没有 Release 的既有资源仍可使用本地归档服务", async () => {
  const skill = getSkillBySlug("project-brief");
  assert.ok(skill);
  const localSkill: SkillResource = {
    ...skill,
    source: { ...skill.source, releaseAssetUrl: undefined },
  };
  const resolved = await resolveSkillDownload(localSkill, {
    downloadedAt: new Date("2026-07-31T10:00:00.000Z"),
  });
  assert.equal(resolved.kind, "local_archive");
  if (resolved.kind === "local_archive") assert.ok(resolved.archive.bytes.byteLength > 0);
});

test("公开下载 API 对 project-brief 返回受信 Release 307", async () => {
  const response = await downloadRoute(
    new Request("http://localhost:3000/api/skills/project-brief/download"),
    { params: Promise.resolve({ slug: "project-brief" }) },
  );
  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.1.0/project-brief-0.1.0.zip",
  );
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});
