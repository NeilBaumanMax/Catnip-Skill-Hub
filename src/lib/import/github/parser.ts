import { posix } from "node:path";
import { GitHubImportError } from "./url";
import type { SkillImportCandidate } from "./types";

export const MAX_SKILL_FILE_BYTES = 256 * 1024;
const SAFE_NAME = /^[a-z0-9][a-z0-9-]{0,63}$/;

function frontmatterValue(lines: readonly string[], key: string): string | undefined {
  const prefix = `${key}:`;
  const line = lines.find((entry) => entry.startsWith(prefix));
  if (!line) return undefined;
  const value = line.slice(prefix.length).trim();
  if (!value || value === ">" || value === "|") return undefined;
  return value.replace(/^(["'])(.*)\1$/, "$2").trim();
}

export function parseSkillDocument(path: string, content: string): SkillImportCandidate {
  if (Buffer.byteLength(content, "utf8") > MAX_SKILL_FILE_BYTES) {
    throw new GitHubImportError("limit", `SKILL.md 超过 ${MAX_SKILL_FILE_BYTES} 字节：${path}`);
  }
  if (content.includes("\0")) throw new GitHubImportError("invalid_content", `SKILL.md 包含 NUL 字节：${path}`);

  const normalized = content.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) throw new GitHubImportError("invalid_content", `SKILL.md 缺少 frontmatter：${path}`);
  const end = normalized.indexOf("\n---\n", 4);
  if (end < 0 || end > 16 * 1024) throw new GitHubImportError("invalid_content", `SKILL.md frontmatter 无效：${path}`);

  const lines = normalized.slice(4, end).split("\n");
  const originalName = frontmatterValue(lines, "name");
  const description = frontmatterValue(lines, "description");
  if (!originalName || !SAFE_NAME.test(originalName)) {
    throw new GitHubImportError("invalid_content", `SKILL.md name 无效：${path}`);
  }
  if (!description || description.length > 600) {
    throw new GitHubImportError("invalid_content", `SKILL.md description 缺失或过长：${path}`);
  }

  return {
    path,
    folderPath: posix.dirname(path) === "." ? "" : posix.dirname(path),
    originalName,
    description,
  };
}
