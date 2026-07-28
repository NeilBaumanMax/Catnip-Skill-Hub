import { InMemoryRecommendationRepository } from "./in-memory";
import { RecommendationService } from "./service";

const runtime = globalThis as typeof globalThis & {
  catnipRecommendationRepository?: InMemoryRecommendationRepository;
};

export const recommendationRepository = runtime.catnipRecommendationRepository ?? new InMemoryRecommendationRepository();
runtime.catnipRecommendationRepository = recommendationRepository;
export const recommendationService = new RecommendationService(recommendationRepository);
