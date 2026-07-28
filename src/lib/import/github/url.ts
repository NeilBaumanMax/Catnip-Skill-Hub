import type { GitHubRepositoryRef } from "./types";

const SAFE_SEGMENT = /^[A-Za-z0-9_.-]{1,100}$/;

export class GitHubImportError extends Error {
  constructor(
    readonly code: "invalid_url" | "upstream" | "limit" | "invalid_content",
    message: string,
  ) {
    super(message);
    this.name = "GitHubImportError";
  }
}

export function parseGitHubRepositoryUrl(input: string): GitHubRepositoryRef {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new GitHubImportError("invalid_url", "请输入有效的 GitHub 仓库 URL。");
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new GitHubImportError("invalid_url", "只接受 github.com 的 HTTPS 仓库根地址。");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 2) {
    throw new GitHubImportError("invalid_url", "GitHub 地址必须指向仓库根目录，不接受文件、分支或子路径。");
  }

  const owner = segments[0];
  const repository = segments[1].replace(/\.git$/, "");
  if (!SAFE_SEGMENT.test(owner) || !SAFE_SEGMENT.test(repository)) {
    throw new GitHubImportError("invalid_url", "GitHub owner 或仓库名称无效。");
  }

  return {
    owner,
    repository,
    repositoryUrl: `https://github.com/${owner}/${repository}`,
  };
}
