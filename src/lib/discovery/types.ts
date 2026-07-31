import type { MainCategory, SkillResource } from "@/lib/domain/skills";

export interface DiscoveryInput {
  readonly query?: string;
  readonly category?: string;
  readonly tags?: readonly string[];
}

export interface DiscoveryFilters {
  readonly query: string;
  readonly category?: MainCategory;
  readonly tags: readonly string[];
}

export interface DiscoveryResult {
  readonly items: readonly SkillResource[];
  readonly filters: DiscoveryFilters;
  readonly availableTags: readonly string[];
  readonly mode: "recommended" | "filtered";
}

export type RandomSource = () => number;
