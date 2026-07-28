import { getSkillBySlug } from "@/lib/domain/skills";
import { ANALYTICS_EVENTS, type AnalyticsCounts, type AnalyticsEvent, type AnalyticsRepository } from "./types";

export class AnalyticsError extends Error {
  constructor(readonly code: "invalid_event" | "not_found", message: string) {
    super(message);
    this.name = "AnalyticsError";
  }
}

export class AnalyticsService {
  constructor(
    private readonly repository: AnalyticsRepository,
    private readonly isPublicSkill: (slug: string) => boolean = (slug) => Boolean(getSkillBySlug(slug)),
  ) {}

  async get(slug: string): Promise<AnalyticsCounts> {
    if (!this.isPublicSkill(slug)) throw new AnalyticsError("not_found", "Skill 不存在或未公开。");
    return this.repository.get(slug);
  }

  async getMany(slugs: readonly string[]): Promise<Readonly<Record<string, AnalyticsCounts>>> {
    const entries = await Promise.all(slugs.map(async (slug) => [slug, await this.get(slug)] as const));
    return Object.fromEntries(entries);
  }

  async record(slug: string, event: unknown): Promise<AnalyticsCounts> {
    if (!this.isPublicSkill(slug)) throw new AnalyticsError("not_found", "Skill 不存在或未公开。");
    if (typeof event !== "string" || !ANALYTICS_EVENTS.includes(event as AnalyticsEvent)) {
      throw new AnalyticsError("invalid_event", "统计事件无效。");
    }
    return this.repository.increment(slug, event as AnalyticsEvent);
  }
}
