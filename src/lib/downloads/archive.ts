import { lstat, readdir, readFile } from "node:fs/promises";
import { basename, relative, resolve, sep } from "node:path";
import { strToU8, zipSync } from "fflate";
import type { SkillResource } from "@/lib/domain/skills";
import { buildInstallCommandMatrix } from "@/lib/install";

export type DownloadErrorCode = "not_enabled" | "missing_source" | "unsafe_path" | "invalid_source";

export class SkillDownloadError extends Error {
  constructor(
    readonly code: DownloadErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SkillDownloadError";
  }
}

export interface ArchiveOptions {
  readonly projectRoot?: string;
  readonly downloadedAt?: Date;
  readonly catnipPageUrl?: string;
}

export interface SkillArchive {
  readonly bytes: Uint8Array;
  readonly filename: string;
  readonly contentType: "application/zip";
}

async function collectFiles(directory: string, archiveRoot: string): Promise<Record<string, Uint8Array>> {
  const files: Record<string, Uint8Array> = {};

  async function visit(currentDirectory: string): Promise<void> {
    const entries = await readdir(currentDirectory, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = resolve(currentDirectory, entry.name);
      const relativePath = relative(directory, absolutePath).split(sep).join("/");

      if (entry.isSymbolicLink()) {
        throw new SkillDownloadError("invalid_source", `Skill 文件夹不得包含符号链接：${relativePath}`);
      }

      if (entry.isDirectory()) {
        await visit(absolutePath);
        continue;
      }

      if (!entry.isFile()) {
        throw new SkillDownloadError("invalid_source", `Skill 文件夹包含不支持的文件类型：${relativePath}`);
      }

      files[`${archiveRoot}/${relativePath}`] = new Uint8Array(await readFile(absolutePath));
    }
  }

  await visit(directory);
  return files;
}

function installationGuide(skill: SkillResource): string {
  const commands = buildInstallCommandMatrix(skill);

  return [
    "# Catnip 安装说明",
    "",
    `- 中文标题：${skill.title}`,
    `- 原始 Skill 名称：${skill.originalName}`,
    `- 原作者：${skill.author.name}`,
    `- 原始仓库：${skill.source.repositoryUrl ?? skill.source.sourceUrl}`,
    `- 下载版本：${skill.source.version}`,
    "",
    "## Claude Code CLI",
    "",
    commands ? `当前项目：\`${commands["claude-code"].project}\`\n\n全局安装：\`${commands["claude-code"].global}\`` : "当前资源没有可验证的安装源。",
    "",
    "## Codex CLI",
    "",
    commands ? `当前项目：\`${commands.codex.project}\`\n\n全局安装：\`${commands.codex.global}\`` : "当前资源没有可验证的安装源。",
    "",
  ].join("\n");
}

export async function buildSkillArchive(skill: SkillResource, options: ArchiveOptions = {}): Promise<SkillArchive> {
  if (!skill.governance.downloadEnabled) {
    throw new SkillDownloadError("not_enabled", "管理员尚未开放该资源的 Catnip 镜像下载。");
  }

  if (!skill.source.repositoryPath) {
    throw new SkillDownloadError("missing_source", "该资源没有可打包的仓库路径。");
  }

  const repositoryPrefix = `content${sep}skills${sep}`;
  const repositoryPath = skill.source.repositoryPath.split("/").join(sep);

  if (!repositoryPath.startsWith(repositoryPrefix)) {
    throw new SkillDownloadError("unsafe_path", "Skill 路径必须位于 content/skills。");
  }

  const relativeSkillPath = repositoryPath.slice(repositoryPrefix.length);
  const contentRoot = options.projectRoot
    ? resolve(options.projectRoot, "content", "skills")
    : resolve(process.cwd(), "content", "skills");
  const skillDirectory = resolve(contentRoot, relativeSkillPath);
  const allowedPrefix = `${contentRoot}${sep}`;

  if (!skillDirectory.startsWith(allowedPrefix)) {
    throw new SkillDownloadError("unsafe_path", "Skill 路径超出项目目录。");
  }

  const sourceStat = await lstat(skillDirectory).catch(() => null);
  if (!sourceStat?.isDirectory() || sourceStat.isSymbolicLink()) {
    throw new SkillDownloadError("invalid_source", "Skill 源路径不是安全的普通目录。");
  }

  const archiveRoot = basename(skillDirectory);
  const files = await collectFiles(skillDirectory, archiveRoot);
  const downloadedAt = options.downloadedAt ?? new Date();
  const catnipPageUrl = options.catnipPageUrl ?? `/skills/${skill.slug}`;
  const sourceMetadata = {
    originalName: skill.originalName,
    originalAuthor: skill.author.name,
    sourceUrl: skill.source.sourceUrl,
    repositoryUrl: skill.source.repositoryUrl,
    sourceCommit: skill.source.sourceCommit ?? null,
    license: skill.source.license,
    downloadedAt: downloadedAt.toISOString(),
    catnipPageUrl,
  };

  files["Catnip-安装说明.md"] = strToU8(installationGuide(skill));
  files["Catnip-来源信息.json"] = strToU8(`${JSON.stringify(sourceMetadata, null, 2)}\n`);

  return {
    bytes: zipSync(files, { level: 6 }),
    filename: `${skill.originalName}.zip`,
    contentType: "application/zip",
  };
}
