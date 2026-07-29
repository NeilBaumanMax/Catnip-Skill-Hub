import { InMemoryRecommendationRepository } from "./in-memory";
import { getRuntimeDatabase, isPersistentRuntime } from "@/lib/data/db";
import { PostgresRecommendationRepository } from "./postgres";
import { RecommendationService } from "./service";
import type { RecommendationRepository } from "./types";

const runtime = globalThis as typeof globalThis & {
  catnipRecommendationRepository?: RecommendationRepository;
};

export const recommendationRepository = runtime.catnipRecommendationRepository ?? (isPersistentRuntime()
  ? new PostgresRecommendationRepository(getRuntimeDatabase().db)
  : new InMemoryRecommendationRepository());
runtime.catnipRecommendationRepository = recommendationRepository;
export const recommendationService = new RecommendationService(recommendationRepository);
