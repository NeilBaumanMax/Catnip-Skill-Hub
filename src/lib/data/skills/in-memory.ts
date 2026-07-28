import type { SkillResource } from "@/lib/domain/skills";
import type { SkillRepository } from "./repository";

function clone(skill: SkillResource): SkillResource {
  return structuredClone(skill);
}

export class InMemorySkillRepository implements SkillRepository {
  private readonly records = new Map<string, SkillResource>();

  constructor(initialSkills: readonly SkillResource[] = []) {
    for (const skill of initialSkills) this.records.set(skill.slug, clone(skill));
  }

  async list(): Promise<readonly SkillResource[]> {
    return [...this.records.values()].map(clone).sort((left, right) => left.title.localeCompare(right.title, "zh-CN"));
  }

  async findBySlug(slug: string): Promise<SkillResource | undefined> {
    const skill = this.records.get(slug);
    return skill ? clone(skill) : undefined;
  }

  async create(skill: SkillResource): Promise<SkillResource> {
    if (this.records.has(skill.slug)) throw new Error("Skill slug 已存在。");
    const stored = clone(skill);
    this.records.set(stored.slug, stored);
    return clone(stored);
  }

  async update(slug: string, skill: SkillResource): Promise<SkillResource> {
    if (!this.records.has(slug)) throw new Error("Skill 不存在。");
    if (slug !== skill.slug) throw new Error("更新时不得修改 Skill slug。");
    const stored = clone(skill);
    this.records.set(slug, stored);
    return clone(stored);
  }

  async delete(slug: string): Promise<void> {
    if (!this.records.delete(slug)) throw new Error("Skill 不存在。");
  }
}
