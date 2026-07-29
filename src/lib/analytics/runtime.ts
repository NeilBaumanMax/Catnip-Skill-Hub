import { InMemoryAnalyticsRepository } from "./in-memory";
import { getRuntimeDatabase, isPersistentRuntime } from "@/lib/data/db";
import { runtimeSkillRepository } from "@/lib/data/skills";
import { PostgresAnalyticsRepository } from "./postgres";
import { AnalyticsService } from "./service";
import type { AnalyticsRepository } from "./types";

const runtime = globalThis as typeof globalThis & { catnipAnalyticsRepository?: AnalyticsRepository };
export const analyticsRepository = runtime.catnipAnalyticsRepository ?? (isPersistentRuntime()
  ? new PostgresAnalyticsRepository(getRuntimeDatabase().db)
  : new InMemoryAnalyticsRepository());
runtime.catnipAnalyticsRepository = analyticsRepository;
export const analyticsService = new AnalyticsService(analyticsRepository, async (slug) => {
  const skill = await runtimeSkillRepository.findBySlug(slug);
  return Boolean(skill && skill.governance.publishStatus === "published" && !skill.governance.hidden);
});
