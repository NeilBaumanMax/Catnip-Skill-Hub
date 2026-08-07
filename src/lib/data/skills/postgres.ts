import { asc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { getPublishedSkills, type SkillResource } from "@/lib/domain/skills";
import { REQUIRED_PUBLIC_SKILL_SEEDS } from "@/lib/domain/skills/seeds";
import { databaseSchema, skills } from "@/lib/data/db/schema";
import type { SkillRepository } from "./repository";

function clone(skill: SkillResource): SkillResource {
  return structuredClone(skill);
}

export class PostgresSkillRepository implements SkillRepository {
  private seedPromise?: Promise<void>;

  constructor(private readonly db: PostgresJsDatabase<typeof databaseSchema>) {}

  private ensureSeeded(): Promise<void> {
    this.seedPromise ??= (async () => {
      const existing = await this.db.select({ slug: skills.slug }).from(skills).limit(1);
      const initialSeeds = existing.length > 0 ? REQUIRED_PUBLIC_SKILL_SEEDS : getPublishedSkills();
      const seeds = initialSeeds.map((skill) => ({
        slug: skill.slug,
        id: skill.id,
        title: skill.title,
        publishStatus: skill.governance.publishStatus,
        hidden: skill.governance.hidden,
        payload: clone(skill),
      }));
      if (seeds.length > 0) await this.db.insert(skills).values(seeds).onConflictDoNothing({ target: skills.slug });
    })();
    return this.seedPromise;
  }

  async list(): Promise<readonly SkillResource[]> {
    await this.ensureSeeded();
    const rows = await this.db.select({ payload: skills.payload }).from(skills).orderBy(asc(skills.title));
    return rows.map(({ payload }) => clone(payload));
  }

  async findBySlug(slug: string): Promise<SkillResource | undefined> {
    await this.ensureSeeded();
    const [row] = await this.db.select({ payload: skills.payload }).from(skills).where(eq(skills.slug, slug)).limit(1);
    return row ? clone(row.payload) : undefined;
  }

  async create(skill: SkillResource): Promise<SkillResource> {
    await this.ensureSeeded();
    try {
      await this.db.insert(skills).values({
        slug: skill.slug, id: skill.id, title: skill.title,
        publishStatus: skill.governance.publishStatus, hidden: skill.governance.hidden, payload: clone(skill),
      });
    } catch (error) {
      if ((error as { code?: string }).code === "23505") throw new Error("Skill slug 已存在。");
      throw error;
    }
    return clone(skill);
  }

  async update(slug: string, skill: SkillResource): Promise<SkillResource> {
    await this.ensureSeeded();
    if (slug !== skill.slug) throw new Error("更新时不得修改 Skill slug。");
    const rows = await this.db.update(skills).set({
      title: skill.title, publishStatus: skill.governance.publishStatus,
      hidden: skill.governance.hidden, payload: clone(skill), updatedAt: new Date(),
    }).where(eq(skills.slug, slug)).returning({ slug: skills.slug });
    if (rows.length === 0) throw new Error("Skill 不存在。");
    return clone(skill);
  }

  async delete(slug: string): Promise<void> {
    await this.ensureSeeded();
    const rows = await this.db.delete(skills).where(eq(skills.slug, slug)).returning({ slug: skills.slug });
    if (rows.length === 0) throw new Error("Skill 不存在。");
  }
}
