import { GitHubImportError, parseGitHubRepositoryUrl } from "./url";
import type {
  GitHubImportSource,
  GitHubRepositoryMetadata,
  GitHubRepositoryRef,
  GitHubTree,
  GitHubTreeEntry,
} from "./types";

const API_ORIGIN = "https://api.github.com";
const JSON_LIMIT = 2 * 1024 * 1024;
const TEXT_LIMIT = 256 * 1024;
const REQUEST_TIMEOUT_MS = 8_000;

type FetchLike = typeof fetch;

async function readLimited(response: Response, limit: number): Promise<Uint8Array> {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > limit) {
    throw new GitHubImportError("limit", "GitHub 响应超过允许大小。");
  }

  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new GitHubImportError("limit", "GitHub 响应超过允许大小。");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export class GitHubApiClient implements GitHubImportSource {
  constructor(
    private readonly token: string | undefined = process.env.CATNIP_GITHUB_TOKEN?.trim() || undefined,
    private readonly fetcher: FetchLike = fetch,
  ) {}

  private async request(path: string, accept: string, limit: number): Promise<Uint8Array> {
    const url = new URL(path, API_ORIGIN);
    if (url.origin !== API_ORIGIN) throw new GitHubImportError("invalid_url", "GitHub API 目标无效。");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await this.fetcher(url, {
        method: "GET",
        redirect: "error",
        signal: controller.signal,
        headers: {
          Accept: accept,
          "User-Agent": "Catnip-Skill-Hub",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
      });
      if (!response.ok) {
        throw new GitHubImportError("upstream", `GitHub API 请求失败（${response.status}）。`);
      }
      return await readLimited(response, limit);
    } catch (error) {
      if (error instanceof GitHubImportError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new GitHubImportError("upstream", "GitHub API 请求超时。");
      }
      throw new GitHubImportError("upstream", "GitHub API 请求失败。");
    } finally {
      clearTimeout(timeout);
    }
  }

  private async json<T>(path: string): Promise<T> {
    const bytes = await this.request(path, "application/vnd.github+json", JSON_LIMIT);
    try {
      return JSON.parse(new TextDecoder().decode(bytes)) as T;
    } catch {
      throw new GitHubImportError("upstream", "GitHub API 返回无效 JSON。");
    }
  }

  async getRepository(ref: GitHubRepositoryRef): Promise<GitHubRepositoryMetadata> {
    const result = await this.json<{
      html_url?: unknown;
      default_branch?: unknown;
      license?: { spdx_id?: unknown } | null;
    }>(`/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repository)}`);
    if (typeof result.html_url !== "string" || typeof result.default_branch !== "string") {
      throw new GitHubImportError("upstream", "GitHub 仓库元数据不完整。");
    }
    const canonical = parseGitHubRepositoryUrl(result.html_url);
    if (
      canonical.owner.toLowerCase() !== ref.owner.toLowerCase() ||
      canonical.repository.toLowerCase() !== ref.repository.toLowerCase()
    ) throw new GitHubImportError("upstream", "GitHub 仓库元数据与请求不一致。");
    return {
      repositoryUrl: canonical.repositoryUrl,
      defaultBranch: result.default_branch,
      license: typeof result.license?.spdx_id === "string" ? result.license.spdx_id : null,
    };
  }

  async getBranchCommit(ref: GitHubRepositoryRef, branch: string): Promise<string> {
    const result = await this.json<{ commit?: { sha?: unknown } }>(
      `/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repository)}/branches/${encodeURIComponent(branch)}`,
    );
    if (typeof result.commit?.sha !== "string" || !/^[a-f0-9]{40,64}$/.test(result.commit.sha)) {
      throw new GitHubImportError("upstream", "GitHub 分支 Commit 无效。");
    }
    return result.commit.sha;
  }

  async getTree(ref: GitHubRepositoryRef, commit: string): Promise<GitHubTree> {
    const result = await this.json<{
      truncated?: unknown;
      tree?: Array<{ path?: unknown; type?: unknown; size?: unknown }>;
    }>(`/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repository)}/git/trees/${commit}?recursive=1`);
    if (typeof result.truncated !== "boolean" || !Array.isArray(result.tree)) {
      throw new GitHubImportError("upstream", "GitHub 文件树响应无效。");
    }
    const entries: GitHubTreeEntry[] = result.tree.flatMap((entry) => {
      if (typeof entry.path !== "string" || !["blob", "tree", "commit"].includes(String(entry.type))) return [];
      return [{
        path: entry.path,
        type: entry.type as GitHubTreeEntry["type"],
        size: typeof entry.size === "number" ? entry.size : undefined,
      }];
    });
    return { truncated: result.truncated, entries };
  }

  async getTextFile(ref: GitHubRepositoryRef, path: string, commit: string): Promise<string> {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const bytes = await this.request(
      `/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repository)}/contents/${encodedPath}?ref=${commit}`,
      "application/vnd.github.raw+json",
      TEXT_LIMIT,
    );
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new GitHubImportError("invalid_content", "SKILL.md 不是有效的 UTF-8 文本。");
    }
  }
}
