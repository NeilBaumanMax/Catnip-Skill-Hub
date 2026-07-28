import {
  MAIN_CATEGORIES,
  type MainCategory,
  type SkillResource,
  type SkillSubtype,
} from "@/lib/domain/skills";
import type { SkillRepository } from "@/lib/data/skills";
import type {
  AdminSkillCreateInput,
  AdminSkillOperation,
  AdminSkillService,
  AdminSkillUpdateInput,
} from "./types";

const SAFE_SLUG = /^[a-z0-9][a-z0-9-]{0,62}$/;
const SAFE_ORIGINAL_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const SUBTYPES: readonly SkillSubtype[] = ["single", "native_pack", "editorial_pack"];

export type SkillManagementErrorCode = "invalid_input" | "not_found" | "conflict" | "invalid_transition";

export class SkillManagementError extends Error {
  constructor(
    readonly code: SkillManagementErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SkillManagementError";
  }
}

function requiredText(value: string, label: string, maxLength: number): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new SkillManagementError("invalid_input", `${label}不能为空且不得超过 ${maxLength} 个字符。`);
  }
  return normalized;
}

function optionalText(value: string | undefined, maxLength: number): string | undefined {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  if (normalized.length > maxLength) throw new SkillManagementError("invalid_input", `字段不得超过 ${maxLength} 个字符。`);
  return normalized;
}

function webUrl(value: string, label: string): string {
  const normalized = requiredText(value, label, 500);
  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("unsupported protocol");
    return url.toString();
  } catch {
    throw new SkillManagementError("invalid_input", `${label}必须是 http 或 https 地址。`);
  }
}

function optionalWebUrl(value: string | undefined, label: string): string | undefined {
  return value?.trim() ? webUrl(value, label) : undefined;
}

function optionalGithubRepository(value: string | undefined): string | undefined {
  const normalized = optionalWebUrl(value, "GitHub 仓库");
  if (!normalized) return undefined;
  const url = new URL(normalized);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  if (url.protocol !== "https:" || url.hostname !== "github.com" || pathSegments.length !== 2) {
    throw new SkillManagementError("invalid_input", "GitHub 仓库必须是仓库根级 HTTPS 地址。");
  }
  return normalized.replace(/\/$/, "");
}

function category(value: MainCategory): MainCategory {
  if (!MAIN_CATEGORIES.includes(value)) throw new SkillManagementError("invalid_input", "主分类不在固定五类中。");
  return value;
}

function tags(values: readonly string[]): readonly string[] {
  const normalized = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  if (normalized.length > 12 || normalized.some((value) => value.length > 30)) {
    throw new SkillManagementError("invalid_input", "标签最多 12 个，每个不得超过 30 个字符。");
  }
  return normalized;
}

function createDraft(input: AdminSkillCreateInput): SkillResource {
  const slug = requiredText(input.slug, "slug", 63);
  if (!SAFE_SLUG.test(slug)) throw new SkillManagementError("invalid_input", "slug 只允许小写英文、数字和连字符。");

  const originalName = requiredText(input.originalName, "原始名称", 128);
  if (!SAFE_ORIGINAL_NAME.test(originalName)) {
    throw new SkillManagementError("invalid_input", "原始名称只允许英文、数字、点、下划线和连字符。");
  }

  if (!SUBTYPES.includes(input.subtype)) throw new SkillManagementError("invalid_input", "Skill 子类型无效。");

  const sourceUrl = webUrl(input.sourceUrl, "原始来源");
  const repositoryUrl = optionalGithubRepository(input.repositoryUrl);
  const repositoryPath = optionalText(input.repositoryPath, 300);
  const normalizedCategory = category(input.category);
  const normalizedTags = tags(input.tags);

  return {
    id: `admin-${slug}`,
    slug,
    resourceType: input.subtype === "single" ? "skill" : "skill_pack",
    subtype: input.subtype,
    title: requiredText(input.title, "中文标题", 100),
    originalName,
    summary: requiredText(input.summary, "一句话介绍", 240),
    description: "待管理员补充详细功能说明。",
    author: { name: requiredText(input.authorName, "原作者", 100) },
    source: {
      kind: input.subtype === "editorial_pack" ? "editorial_collection" : "third_party",
      label: "管理员手动录入",
      sourceUrl,
      repositoryUrl,
      repositoryPath,
      license: requiredText(input.license, "License", 100),
      version: requiredText(input.version, "版本", 100),
    },
    category: normalizedCategory,
    tags: normalizedTags,
    compatibility: ["Claude Code CLI", "Codex CLI"],
    images: [{
      id: `${slug}-cover`,
      kind: "cover",
      alt: `${requiredText(input.title, "中文标题", 100)} 的临时文字封面`,
      visualKey: "brief",
      sourceType: "catnip_css",
      sourceLabel: "Catnip Phase 4 CSS 占位",
    }],
    coverTheme: "brief",
    coverSize: "medium",
    features: [],
    useCases: [],
    childSkills: [],
    usageSteps: [],
    promptExamples: [],
    results: [],
    risks: [],
    relatedSlugs: [],
    governance: {
      publishStatus: "draft",
      inRecommendationPool: false,
      recommendationWeight: 0,
      pinned: false,
      hidden: false,
      downloadEnabled: false,
      adminNotes: optionalText(input.adminNotes, 1000) ?? "管理员新建草稿，等待补充与审核。",
      reviewState: "unreviewed",
    },
    stats: { views: 0, downloadClicks: 0, installCopies: 0, sourceVisits: 0 },
  };
}

function mapRepositoryError(error: unknown): never {
  const message = error instanceof Error ? error.message : "数据访问失败。";
  if (message.includes("已存在")) throw new SkillManagementError("conflict", message);
  if (message.includes("不存在")) throw new SkillManagementError("not_found", message);
  throw error;
}

export class DefaultAdminSkillService implements AdminSkillService {
  constructor(private readonly repository: SkillRepository) {}

  list(): Promise<readonly SkillResource[]> {
    return this.repository.list();
  }

  async create(input: AdminSkillCreateInput): Promise<SkillResource> {
    try {
      return await this.repository.create(createDraft(input));
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async update(slug: string, input: AdminSkillUpdateInput): Promise<SkillResource> {
    const current = await this.repository.findBySlug(slug);
    if (!current) throw new SkillManagementError("not_found", "Skill 不存在。");

    const repositoryPath = input.repositoryPath === undefined
      ? current.source.repositoryPath
      : optionalText(input.repositoryPath, 300);
    const downloadEnabled = input.downloadEnabled ?? current.governance.downloadEnabled;
    if (downloadEnabled && !repositoryPath) {
      throw new SkillManagementError("invalid_input", "开放镜像下载前必须配置可打包的仓库路径。");
    }

    const updated: SkillResource = {
      ...current,
      title: input.title === undefined ? current.title : requiredText(input.title, "中文标题", 100),
      summary: input.summary === undefined ? current.summary : requiredText(input.summary, "一句话介绍", 240),
      category: input.category === undefined ? current.category : category(input.category),
      tags: input.tags === undefined ? current.tags : tags(input.tags),
      author: input.authorName === undefined
        ? current.author
        : { ...current.author, name: requiredText(input.authorName, "原作者", 100) },
      source: {
        ...current.source,
        sourceUrl: input.sourceUrl === undefined ? current.source.sourceUrl : webUrl(input.sourceUrl, "原始来源"),
        repositoryUrl: input.repositoryUrl === undefined
          ? current.source.repositoryUrl
          : optionalGithubRepository(input.repositoryUrl),
        repositoryPath,
        license: input.license === undefined ? current.source.license : requiredText(input.license, "License", 100),
        version: input.version === undefined ? current.source.version : requiredText(input.version, "版本", 100),
      },
      governance: {
        ...current.governance,
        downloadEnabled,
        adminNotes: input.adminNotes === undefined
          ? current.governance.adminNotes
          : optionalText(input.adminNotes, 1000) ?? "",
      },
    };

    try {
      return await this.repository.update(slug, updated);
    } catch (error) {
      return mapRepositoryError(error);
    }
  }

  async transition(slug: string, operation: AdminSkillOperation): Promise<SkillResource> {
    const current = await this.repository.findBySlug(slug);
    if (!current) throw new SkillManagementError("not_found", "Skill 不存在。");

    const allowed = operation === "publish"
      ? current.governance.publishStatus === "draft" || current.governance.publishStatus === "unlisted"
      : current.governance.publishStatus === "published";
    if (!allowed) throw new SkillManagementError("invalid_transition", "当前发布状态不允许该操作。");
    if (operation === "publish" && current.subtype !== "single" && current.childSkills.length === 0) {
      throw new SkillManagementError("invalid_transition", "Skill Pack 必须先配置至少一个子 Skill 才能发布。");
    }

    const publishStatus = operation === "publish" ? "published" : "unlisted";
    return this.repository.update(slug, {
      ...current,
      governance: { ...current.governance, publishStatus },
    });
  }

  async delete(slug: string): Promise<void> {
    const current = await this.repository.findBySlug(slug);
    if (!current) throw new SkillManagementError("not_found", "Skill 不存在。");
    if (current.governance.publishStatus === "published") {
      throw new SkillManagementError("invalid_transition", "公开资源必须先下架才能删除。");
    }

    try {
      await this.repository.delete(slug);
    } catch (error) {
      mapRepositoryError(error);
    }
  }
}
