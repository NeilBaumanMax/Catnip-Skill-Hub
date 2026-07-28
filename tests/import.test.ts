import assert from "node:assert/strict";
import test from "node:test";
import {
  GitHubApiClient,
  GitHubImportError,
  GitHubSkillImportService,
  MAX_SKILL_FILE_BYTES,
  parseGitHubRepositoryUrl,
  parseSkillDocument,
  type GitHubImportSource,
  type GitHubRepositoryRef,
} from "../src/lib/import/github";
import { POST as importPreviewRoute } from "../src/app/api/admin/import/github/route";

const SHA = "a".repeat(40);
const SKILL = "---\nname: useful-skill\ndescription: A focused helper.\n---\n# Useful\n";

function source(overrides: Partial<GitHubImportSource> = {}) {
  const calls: string[] = [];
  const implementation: GitHubImportSource = {
    async getRepository(ref) {
      calls.push(`repository:${ref.repositoryUrl}`);
      return { repositoryUrl: ref.repositoryUrl, defaultBranch: "main", license: "MIT" };
    },
    async getBranchCommit(_ref, branch) {
      calls.push(`branch:${branch}`);
      return SHA;
    },
    async getTree(_ref, commit) {
      calls.push(`tree:${commit}`);
      return { truncated: false, entries: [{ path: "skills/useful/SKILL.md", type: "blob", size: SKILL.length }] };
    },
    async getTextFile(_ref, path, commit) {
      calls.push(`file:${path}:${commit}`);
      return SKILL;
    },
    ...overrides,
  };
  return { implementation, calls };
}

test("GitHub 仓库地址只接受 HTTPS 根地址", () => {
  assert.deepEqual(parseGitHubRepositoryUrl("https://github.com/Catnip/demo.git"), {
    owner: "Catnip", repository: "demo", repositoryUrl: "https://github.com/Catnip/demo",
  });
  for (const value of [
    "http://github.com/Catnip/demo",
    "https://evil.example/Catnip/demo",
    "https://user@github.com/Catnip/demo",
    "https://github.com/Catnip/demo/tree/main",
    "https://github.com/Catnip/demo?tab=readme",
  ]) assert.throws(() => parseGitHubRepositoryUrl(value), GitHubImportError);
});

test("SKILL.md 只提取受限 frontmatter 并拒绝异常内容", () => {
  assert.deepEqual(parseSkillDocument("a/SKILL.md", SKILL), {
    path: "a/SKILL.md", folderPath: "a", originalName: "useful-skill", description: "A focused helper.",
  });
  assert.throws(() => parseSkillDocument("SKILL.md", "# Missing"), /frontmatter/);
  assert.throws(() => parseSkillDocument("SKILL.md", SKILL.replace("useful-skill", "Bad Name")), /name/);
  assert.throws(() => parseSkillDocument("SKILL.md", `${SKILL}\0`), /NUL/);
  assert.throws(() => parseSkillDocument("SKILL.md", `${SKILL}${"x".repeat(MAX_SKILL_FILE_BYTES)}`), /超过/);
});

test("导入预览固定 Commit 且明确不建稿、不发布", async () => {
  const fake = source();
  const preview = await new GitHubSkillImportService(fake.implementation).preview("https://github.com/Catnip/demo");
  assert.equal(preview.sourceCommit, SHA);
  assert.equal(preview.createsDraft, false);
  assert.equal(preview.publishesResource, false);
  assert.deepEqual(fake.calls, [
    "repository:https://github.com/Catnip/demo", "branch:main", `tree:${SHA}`, `file:skills/useful/SKILL.md:${SHA}`,
  ]);
});

test("导入拒绝截断树、超量条目、超大或过多 SKILL.md", async () => {
  const ref = "https://github.com/Catnip/demo";
  await assert.rejects(new GitHubSkillImportService(source({ async getTree() { return { truncated: true, entries: [] }; } }).implementation).preview(ref), /截断/);
  await assert.rejects(new GitHubSkillImportService(source({ async getTree() { return { truncated: false, entries: Array.from({ length: 5001 }, (_, index) => ({ path: `f${index}`, type: "blob" as const })) }; } }).implementation).preview(ref), /文件数量/);
  await assert.rejects(new GitHubSkillImportService(source({ async getTree() { return { truncated: false, entries: [{ path: "SKILL.md", type: "blob", size: MAX_SKILL_FILE_BYTES + 1 }] }; } }).implementation).preview(ref), /256 KB/);
  await assert.rejects(new GitHubSkillImportService(source({ async getTree() { return { truncated: false, entries: Array.from({ length: 21 }, (_, index) => ({ path: `${index}/SKILL.md`, type: "blob" as const, size: 10 })) }; } }).implementation).preview(ref), /超过 20/);
});

test("GitHub 客户端固定 API 域名、禁用重定向并限制响应", async () => {
  let capturedUrl = "";
  let capturedInit: RequestInit | undefined;
  const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedUrl = input.toString();
    capturedInit = init;
    return new Response(JSON.stringify({ html_url: "https://github.com/Catnip/demo", default_branch: "main", license: null }));
  }) as typeof fetch;
  const client = new GitHubApiClient(undefined, fetcher);
  const ref: GitHubRepositoryRef = parseGitHubRepositoryUrl("https://github.com/Catnip/demo");
  await client.getRepository(ref);
  assert.equal(new URL(capturedUrl).origin, "https://api.github.com");
  assert.equal(capturedInit?.redirect, "error");
  assert.equal((capturedInit?.headers as Record<string, string>).Authorization, undefined);

  const redirectClient = new GitHubApiClient(undefined, (async () => new Response(null, { status: 302 })) as typeof fetch);
  await assert.rejects(redirectClient.getRepository(ref), /302/);
  const largeClient = new GitHubApiClient(undefined, (async () => new Response("{}", { headers: { "content-length": String(3 * 1024 * 1024) } })) as typeof fetch);
  await assert.rejects(largeClient.getRepository(ref), /超过/);
});

test("GitHub 导入 API 对匿名请求安全失败", async () => {
  const response = await importPreviewRoute(new Request("https://catnip.example/api/admin/import/github", {
    method: "POST",
    headers: { origin: "https://catnip.example", "content-type": "application/json" },
    body: JSON.stringify({ repositoryUrl: "https://github.com/Catnip/demo" }),
  }));
  assert.equal(response.status, 401);
});
