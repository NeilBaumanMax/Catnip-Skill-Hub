import { InMemoryAnalyticsRepository } from "./in-memory";
import { AnalyticsService } from "./service";

const runtime = globalThis as typeof globalThis & { catnipAnalyticsRepository?: InMemoryAnalyticsRepository };
export const analyticsRepository = runtime.catnipAnalyticsRepository ?? new InMemoryAnalyticsRepository();
runtime.catnipAnalyticsRepository = analyticsRepository;
export const analyticsService = new AnalyticsService(analyticsRepository);
