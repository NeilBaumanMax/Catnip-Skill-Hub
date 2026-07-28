import type { MainCategory, SkillResource, SkillSubtype } from "@/lib/domain/skills";

export interface AdminSkillCreateInput {
  readonly slug: string;
  readonly title: string;
  readonly originalName: string;
  readonly summary: string;
  readonly category: MainCategory;
  readonly tags: readonly string[];
  readonly subtype: SkillSubtype;
  readonly authorName: string;
  readonly sourceUrl: string;
  readonly repositoryUrl?: string;
  readonly repositoryPath?: string;
  readonly license: string;
  readonly version: string;
  readonly adminNotes?: string;
}

export interface AdminSkillUpdateInput {
  readonly title?: string;
  readonly summary?: string;
  readonly category?: MainCategory;
  readonly tags?: readonly string[];
  readonly authorName?: string;
  readonly sourceUrl?: string;
  readonly repositoryUrl?: string;
  readonly repositoryPath?: string;
  readonly license?: string;
  readonly version?: string;
  readonly downloadEnabled?: boolean;
  readonly adminNotes?: string;
}

export type AdminSkillOperation = "publish" | "unlist";

export interface AdminSkillService {
  list(): Promise<readonly SkillResource[]>;
  create(input: AdminSkillCreateInput): Promise<SkillResource>;
  update(slug: string, input: AdminSkillUpdateInput): Promise<SkillResource>;
  transition(slug: string, operation: AdminSkillOperation): Promise<SkillResource>;
  delete(slug: string): Promise<void>;
}
