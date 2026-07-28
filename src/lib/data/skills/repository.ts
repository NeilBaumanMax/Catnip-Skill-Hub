import type { SkillResource } from "@/lib/domain/skills";

export interface SkillRepository {
  list(): Promise<readonly SkillResource[]>;
  findBySlug(slug: string): Promise<SkillResource | undefined>;
  create(skill: SkillResource): Promise<SkillResource>;
  update(slug: string, skill: SkillResource): Promise<SkillResource>;
  delete(slug: string): Promise<void>;
}
