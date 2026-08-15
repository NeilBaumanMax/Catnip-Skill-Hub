import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
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

const REAL_SLUG = "idea-to-production-vibecoding";

async function createLocalFixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "catnip-download-test-"));
  const skillDirectory = resolve(root, "content", "skills", REAL_SLUG);
  await mkdir(resolve(skillDirectory, "agents"), { recursive: true });
  await writeFile(resolve(skillDirectory, "SKILL.md"), "---\nname: idea-to-production-vibecoding\ndescription: Test fixture.\n---\n");
  await writeFile(resolve(skillDirectory, "LICENSE"), "MIT\n");
  await writeFile(resolve(skillDirectory, "agents", "openai.yaml"), "interface:\n  display_name: Test\n");
  return root;
}

test("ZIP 保持原 Skill 文件并只在外层加入 Catnip 文件", async () => {
  const skill = getSkillBySlug(REAL_SLUG);
  assert.ok(skill);
  const projectRoot = await createLocalFixture();

  try {
    const archive = await buildSkillArchive(skill, {
      projectRoot,
      downloadedAt: new Date("2026-08-16T00:00:00.000Z"),
      catnipPageUrl: `https://catnip.example/skills/${REAL_SLUG}`,
    });
    const files = unzipSync(archive.bytes);

    assert.equal(archive.filename, `${REAL_SLUG}.zip`);
    assert.ok(files[`${REAL_SLUG}/SKILL.md`]);
    assert.ok(files[`${REAL_SLUG}/LICENSE`]);
    assert.ok(files[`${REAL_SLUG}/agents/openai.yaml`]);
    assert.ok(files["Catnip-安装说明.md"]);
    assert.ok(files["Catnip-来源信息.json"]);
    assert.equal(Object.keys(files).filter((path) => path.startsWith(`${REAL_SLUG}/Catnip-`)).length, 0);

    const guide = strFromU8(files["Catnip-安装说明.md"]);
    assert.match(guide, /Claude Code CLI/);
    assert.match(guide, /Codex CLI/);
    assert.match(guide, new RegExp(`--skill ${REAL_SLUG}`));

    const metadata = JSON.parse(strFromU8(files["Catnip-来源信息.json"]));
    assert.equal(metadata.originalName, REAL_SLUG);
    assert.equal(metadata.license, "MIT");
    assert.equal(metadata.downloadedAt, "2026-08-16T00:00:00.000Z");
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("管理员关闭下载时资源被拒绝", async () => {
  const skill = getSkillBySlug(REAL_SLUG);
  assert.ok(skill);
  const disabled: SkillResource = {
    ...skill,
    governance: { ...skill.governance, downloadEnabled: false },
  };

  await assert.rejects(
    buildSkillArchive(disabled),
    (error: unknown) => error instanceof SkillDownloadError && error.code === "not_enabled",
  );
});

test("即使管理员字段为 true 也拒绝逃逸项目目录的路径", async () => {
  const skill = getSkillBySlug(REAL_SLUG);
  assert.ok(skill);
  const unsafeSkill: SkillResource = {
    ...skill,
    source: { ...skill.source, repositoryPath: "../outside-project" },
  };

  await assert.rejects(
    buildSkillArchive(unsafeSkill),
    (error: unknown) => error instanceof SkillDownloadError && error.code === "unsafe_path",
  );
});

test("受信 Catnip Release 资产优先解析为不可变重定向", async () => {
  const skill = getSkillBySlug(REAL_SLUG);
  assert.ok(skill?.source.releaseAssetUrl);
  assert.equal(getCatnipReleaseAssetError(skill.source.releaseAssetUrl, skill.slug, skill.source.version), null);

  const resolved = await resolveSkillDownload(skill);
  assert.equal(resolved.kind, "release_redirect");
  if (resolved.kind === "release_redirect") assert.equal(resolved.url, skill.source.releaseAssetUrl);
});

test("Release 来源拒绝任意域名、latest 和不匹配文件名，并允许包版本独立于目录版本", () => {
  assert.match(
    getCatnipReleaseAssetError(
      "https://example.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.3.0/apple-design-1.0.0.zip",
      "apple-design",
      "1.0.0",
    ) ?? "",
    /github.com/,
  );
  assert.match(
    getCatnipReleaseAssetError(
      "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/latest/apple-design-1.0.0.zip",
      "apple-design",
      "1.0.0",
    ) ?? "",
    /版本 Tag/,
  );
  assert.match(
    getCatnipReleaseAssetError(
      "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.3.0/other-1.0.0.zip",
      "apple-design",
      "1.0.0",
    ) ?? "",
    /slug 和版本/,
  );
  assert.equal(
    getCatnipReleaseAssetError(
      "https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.3.0/apple-design-1.0.0.zip",
      "apple-design",
      "1.0.0",
    ),
    null,
  );
});

test("三个 v0.3.0 公共 Skill 都解析为已验证 Release 下载", async () => {
  const expected = {
    "idea-to-production-vibecoding": "idea-to-production-vibecoding-1.0.0.zip",
    "apple-design": "apple-design-1.0.0.zip",
    "dashi-ppt": "dashi-ppt-0.4.4.zip",
  } as const;

  for (const [slug, filename] of Object.entries(expected)) {
    const skill = getSkillBySlug(slug);
    assert.ok(skill);
    const resolved = await resolveSkillDownload(skill);
    assert.equal(resolved.kind, "release_redirect");
    if (resolved.kind === "release_redirect") {
      assert.equal(resolved.url, `https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.3.0/${filename}`);
    }
  }
});

test("没有 Release 时仍可使用受控本地归档服务", async () => {
  const skill = getSkillBySlug(REAL_SLUG);
  assert.ok(skill);
  const projectRoot = await createLocalFixture();
  const localSkill: SkillResource = {
    ...skill,
    source: { ...skill.source, releaseAssetUrl: undefined },
  };

  try {
    const resolved = await resolveSkillDownload(localSkill, { projectRoot });
    assert.equal(resolved.kind, "local_archive");
    if (resolved.kind === "local_archive") assert.ok(resolved.archive.bytes.byteLength > 0);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("公开下载 API 对真实 Skill 返回受信 Release 307", async () => {
  const response = await downloadRoute(
    new Request(`http://localhost:3000/api/skills/${REAL_SLUG}/download`),
    { params: Promise.resolve({ slug: REAL_SLUG }) },
  );
  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    `https://github.com/neilbauman666/Catnip-skill-hub-main/releases/download/v0.3.0/${REAL_SLUG}-1.0.0.zip`,
  );
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});
