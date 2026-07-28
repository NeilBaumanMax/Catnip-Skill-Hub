import { MAIN_CATEGORIES, PUBLIC_RESOURCE_TYPES, type SkillResource } from "./types";
import { SKILL_SEEDS } from "./seeds";

function catalogErrors(resources: readonly SkillResource[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const ids = new Set<string>();

  for (const resource of resources) {
    if (slugs.has(resource.slug)) errors.push(`重复 slug：${resource.slug}`);
    if (ids.has(resource.id)) errors.push(`重复 id：${resource.id}`);
    slugs.add(resource.slug);
    ids.add(resource.id);

    if (!MAIN_CATEGORIES.includes(resource.category)) errors.push(`未知主分类：${resource.slug}`);
    if (!PUBLIC_RESOURCE_TYPES.includes(resource.resourceType)) errors.push(`公开类型不允许：${resource.slug}`);
    if (resource.images.filter((image) => image.kind === "cover").length !== 1) errors.push(`封面数量错误：${resource.slug}`);
    if (resource.images.length > 8) errors.push(`图片超过八张：${resource.slug}`);
    if (resource.subtype === "single" && resource.childSkills.length > 0) errors.push(`单项 Skill 含子项：${resource.slug}`);
    if (resource.subtype !== "single" && resource.childSkills.length === 0) errors.push(`Skill Pack 缺少子项：${resource.slug}`);
    if (resource.governance.downloadEnabled && resource.source.license.includes("待管理员")) errors.push(`未确认 License 却开放下载：${resource.slug}`);
  }

  for (const resource of resources) {
    for (const relatedSlug of resource.relatedSlugs) {
      if (!slugs.has(relatedSlug)) errors.push(`相关 Skill 不存在：${resource.slug} -> ${relatedSlug}`);
    }
    for (const child of resource.childSkills) {
      if (child.hasStandalonePage && (!child.standaloneSlug || !slugs.has(child.standaloneSlug))) {
        errors.push(`子项独立页面不存在：${resource.slug} -> ${child.id}`);
      }
    }
  }

  return errors;
}

const errors = catalogErrors(SKILL_SEEDS);

if (errors.length > 0) {
  throw new Error(`Skill 静态目录不符合领域约束：\n${errors.join("\n")}`);
}

export function getPublishedSkills(): readonly SkillResource[] {
  return SKILL_SEEDS.filter(
    (skill) => skill.governance.publishStatus === "published" && !skill.governance.hidden,
  );
}

export function getSkillBySlug(slug: string): SkillResource | undefined {
  return getPublishedSkills().find((skill) => skill.slug === slug);
}

export function getRelatedSkills(skill: SkillResource): readonly SkillResource[] {
  return skill.relatedSlugs.flatMap((slug) => {
    const related = getSkillBySlug(slug);
    return related ? [related] : [];
  });
}

export function getCatalogValidationErrors(): readonly string[] {
  return catalogErrors(SKILL_SEEDS);
}
