export interface GitHubRepositoryRef {
  readonly owner: string;
  readonly repository: string;
  readonly repositoryUrl: string;
}

export interface GitHubRepositoryMetadata {
  readonly repositoryUrl: string;
  readonly defaultBranch: string;
  readonly license: string | null;
}

export interface GitHubTreeEntry {
  readonly path: string;
  readonly type: "blob" | "tree" | "commit";
  readonly size?: number;
}

export interface GitHubTree {
  readonly truncated: boolean;
  readonly entries: readonly GitHubTreeEntry[];
}

export interface GitHubImportSource {
  getRepository(ref: GitHubRepositoryRef): Promise<GitHubRepositoryMetadata>;
  getBranchCommit(ref: GitHubRepositoryRef, branch: string): Promise<string>;
  getTree(ref: GitHubRepositoryRef, commit: string): Promise<GitHubTree>;
  getTextFile(ref: GitHubRepositoryRef, path: string, commit: string): Promise<string>;
}

export interface SkillImportCandidate {
  readonly path: string;
  readonly folderPath: string;
  readonly originalName: string;
  readonly description: string;
}

export interface GitHubImportPreview {
  readonly repositoryUrl: string;
  readonly defaultBranch: string;
  readonly sourceCommit: string;
  readonly license: string | null;
  readonly candidates: readonly SkillImportCandidate[];
  readonly createsDraft: false;
  readonly publishesResource: false;
}
