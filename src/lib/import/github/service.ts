import { parseSkillDocument, MAX_SKILL_FILE_BYTES } from "./parser";
import type { GitHubImportPreview, GitHubImportSource } from "./types";
import { GitHubImportError, parseGitHubRepositoryUrl } from "./url";

const MAX_TREE_ENTRIES = 5_000;
const MAX_SKILL_FILES = 20;

export class GitHubSkillImportService {
  constructor(private readonly source: GitHubImportSource) {}

  async preview(repositoryUrl: string): Promise<GitHubImportPreview> {
    const ref = parseGitHubRepositoryUrl(repositoryUrl);
    const metadata = await this.source.getRepository(ref);
    const sourceCommit = await this.source.getBranchCommit(ref, metadata.defaultBranch);
    const tree = await this.source.getTree(ref, sourceCommit);

    if (tree.truncated) throw new GitHubImportError("limit", "GitHub 文件树被截断，拒绝不完整导入。");
    if (tree.entries.length > MAX_TREE_ENTRIES) throw new GitHubImportError("limit", "仓库文件数量超过导入限制。");

    const skillEntries = tree.entries
      .filter((entry) => entry.type === "blob" && (entry.path === "SKILL.md" || entry.path.endsWith("/SKILL.md")));
    if (skillEntries.some((entry) => entry.size !== undefined && entry.size > MAX_SKILL_FILE_BYTES)) {
      throw new GitHubImportError("limit", "仓库中的 SKILL.md 超过 256 KB 限制。");
    }
    const skillPaths = skillEntries.map((entry) => entry.path);
    if (skillPaths.length === 0) throw new GitHubImportError("invalid_content", "仓库中没有可读取的 SKILL.md。");
    if (skillPaths.length > MAX_SKILL_FILES) throw new GitHubImportError("limit", "SKILL.md 数量超过 20 个。");

    const candidates = [];
    for (const path of skillPaths) {
      candidates.push(parseSkillDocument(path, await this.source.getTextFile(ref, path, sourceCommit)));
    }

    return {
      repositoryUrl: metadata.repositoryUrl,
      defaultBranch: metadata.defaultBranch,
      sourceCommit,
      license: metadata.license,
      candidates,
      createsDraft: false,
      publishesResource: false,
    };
  }
}
