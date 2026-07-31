import { MAIN_CATEGORIES, getPublishedSkills, type MainCategory, type SkillResource } from "@/lib/domain/skills";
import type { DiscoveryFilters, DiscoveryInput, DiscoveryResult, RandomSource } from "./types";

const MAX_QUERY_LENGTH = 100;
const MAX_TAG_LENGTH = 80;
const MAX_TAG_FILTERS = 8;

function normalizeText(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("zh-CN");
}

function normalizeFilters(input: DiscoveryInput): DiscoveryFilters {
  const query = typeof input.query === "string" ? input.query.normalize("NFKC").trim().slice(0, MAX_QUERY_LENGTH) : "";
  const category = MAIN_CATEGORIES.includes(input.category as MainCategory)
    ? input.category as MainCategory
    : undefined;
  const seenTags = new Set<string>();
  const tags = (Array.isArray(input.tags) ? input.tags : [])
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.normalize("NFKC").trim().slice(0, MAX_TAG_LENGTH))
    .filter(Boolean)
    .filter((tag) => {
      const normalized = normalizeText(tag);
      if (seenTags.has(normalized)) return false;
      seenTags.add(normalized);
      return true;
    })
    .slice(0, MAX_TAG_FILTERS);
  return { query, category, tags };
}

function searchText(skill: SkillResource): string {
  return normalizeText([
    skill.title,
    skill.originalName,
    skill.summary,
    skill.description,
    skill.author.name,
    skill.category,
    ...skill.tags,
  ].join(" "));
}

function safeRandom(random: RandomSource): number {
  const value = random();
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(1 - Number.EPSILON, Math.max(Number.MIN_VALUE, value));
}

function weightedRandomOrder(resources: readonly SkillResource[], random: RandomSource): SkillResource[] {
  return resources
    .map((skill) => ({
      skill,
      key: Math.pow(safeRandom(random), 1 / skill.governance.recommendationWeight),
    }))
    .sort((left, right) => right.key - left.key || left.skill.slug.localeCompare(right.skill.slug))
    .map(({ skill }) => skill);
}

function recommendationOrder(resources: readonly SkillResource[], random: RandomSource): SkillResource[] {
  const eligible = resources.filter(
    (skill) => skill.governance.inRecommendationPool && skill.governance.recommendationWeight > 0,
  );
  const pinned = eligible.filter((skill) => skill.governance.pinned);
  const regular = eligible.filter((skill) => !skill.governance.pinned);
  return [...weightedRandomOrder(pinned, random), ...weightedRandomOrder(regular, random)];
}

export function discoverSkills(
  input: DiscoveryInput,
  random: RandomSource = Math.random,
  resources: readonly SkillResource[] = getPublishedSkills(),
): DiscoveryResult {
  const visible = resources.filter(
    (skill) => skill.governance.publishStatus === "published" && !skill.governance.hidden,
  );
  const requestedFilters = normalizeFilters(input);
  const availableTags = [...new Set(visible.flatMap((skill) => skill.tags))]
    .sort((left, right) => left.localeCompare(right, "zh-CN"));
  const availableTagsByKey = new Map(availableTags.map((tag) => [normalizeText(tag), tag]));
  const filters: DiscoveryFilters = {
    ...requestedFilters,
    tags: requestedFilters.tags
      .map((tag) => availableTagsByKey.get(normalizeText(tag)))
      .filter((tag): tag is string => Boolean(tag)),
  };
  const hasFilters = Boolean(filters.query || filters.category || filters.tags.length);

  if (!hasFilters) {
    return { items: recommendationOrder(visible, random), filters, availableTags, mode: "recommended" };
  }

  const query = normalizeText(filters.query);
  const tags = filters.tags.map(normalizeText);
  const items = visible
    .filter((skill) => !filters.category || skill.category === filters.category)
    .filter((skill) => tags.every(
      (tag) => skill.tags.some((candidate) => normalizeText(candidate) === tag),
    ))
    .filter((skill) => !query || searchText(skill).includes(query))
    .sort((left, right) => left.title.localeCompare(right.title, "zh-CN"));

  return { items, filters, availableTags, mode: "filtered" };
}
