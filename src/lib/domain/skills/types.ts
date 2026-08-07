export const MAIN_CATEGORIES = [
  "VibeCoding 硬件",
  "编程开发",
  "前端设计",
  "产品与项目管理",
  "自动化",
] as const;

export const PUBLIC_RESOURCE_TYPES = ["skill", "skill_pack"] as const;

export type MainCategory = (typeof MAIN_CATEGORIES)[number];
export type PublicResourceType = (typeof PUBLIC_RESOURCE_TYPES)[number];
export type ResourceType =
  | PublicResourceType
  | "prompt"
  | "mcp"
  | "agent_workflow"
  | "rule"
  | "template";
export type SkillSubtype = "single" | "native_pack" | "editorial_pack";
export type PublishStatus = "draft" | "published" | "unlisted" | "archived";
export type CoverTheme =
  | "mind"
  | "interface"
  | "hardware"
  | "brief"
  | "flow"
  | "map"
  | "system"
  | "sensor"
  | "release"
  | "research";
export type CoverSize = "medium" | "large" | "tall";
export type ImageKind = "cover" | "gallery";
export type ImageSourceType = "catnip_css" | "ai_generated" | "original_author" | "community" | "team_test";

export interface SkillAuthor {
  readonly name: string;
  readonly url?: string;
}

export interface SkillSource {
  readonly kind: "catnip_original" | "third_party" | "editorial_collection";
  readonly label: string;
  readonly sourceUrl: string;
  readonly repositoryUrl?: string;
  readonly repositoryPath?: string;
  readonly releaseAssetUrl?: string;
  readonly license: string;
  readonly version: string;
  readonly sourceCommit?: string;
}

export interface SkillImage {
  readonly id: string;
  readonly kind: ImageKind;
  readonly alt: string;
  readonly url?: string;
  readonly visualKey: CoverTheme;
  readonly sourceType: ImageSourceType;
  readonly sourceLabel: string;
  readonly externalVideoUrl?: string;
}

export interface ChildSkill {
  readonly id: string;
  readonly originalName: string;
  readonly title: string;
  readonly summary: string;
  readonly hasStandalonePage: boolean;
  readonly standaloneSlug?: string;
  readonly sourceLabel: string;
}

export interface SkillResult {
  readonly title: string;
  readonly description: string;
}

export interface SkillGovernance {
  readonly publishStatus: PublishStatus;
  readonly inRecommendationPool: boolean;
  readonly recommendationWeight: number;
  readonly pinned: boolean;
  readonly hidden: boolean;
  readonly downloadEnabled: boolean;
  readonly adminNotes: string;
  readonly reviewState: "unreviewed" | "reviewing" | "reviewed";
}

export interface SkillStats {
  readonly views: number;
  readonly downloadClicks: number;
  readonly installCopies: number;
  readonly sourceVisits: number;
}

export interface SkillResource {
  readonly id: string;
  readonly slug: string;
  readonly resourceType: PublicResourceType;
  readonly subtype: SkillSubtype;
  readonly title: string;
  readonly originalName: string;
  readonly summary: string;
  readonly description: string;
  readonly author: SkillAuthor;
  readonly source: SkillSource;
  readonly category: MainCategory;
  readonly tags: readonly string[];
  readonly compatibility: readonly ("Claude Code CLI" | "Codex CLI")[];
  readonly images: readonly SkillImage[];
  readonly coverTheme: CoverTheme;
  readonly coverSize: CoverSize;
  readonly features: readonly string[];
  readonly useCases: readonly string[];
  readonly childSkills: readonly ChildSkill[];
  readonly usageSteps: readonly string[];
  readonly promptExamples: readonly string[];
  readonly results: readonly SkillResult[];
  readonly risks: readonly string[];
  readonly relatedSlugs: readonly string[];
  readonly governance: SkillGovernance;
  readonly stats?: SkillStats;
}
