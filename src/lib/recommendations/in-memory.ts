import type { RecommendationLead, RecommendationRepository } from "./types";

export class InMemoryRecommendationRepository implements RecommendationRepository {
  private readonly leads: RecommendationLead[] = [];

  async list(): Promise<readonly RecommendationLead[]> {
    return structuredClone([...this.leads].reverse());
  }

  async create(lead: RecommendationLead): Promise<RecommendationLead> {
    const saved = structuredClone(lead);
    this.leads.push(saved);
    return structuredClone(saved);
  }
}
