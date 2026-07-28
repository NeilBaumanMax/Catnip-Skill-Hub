export interface RecommendationInput {
  readonly skillUrl: string;
  readonly sourceChannel: string;
  readonly reason: string;
  readonly contact?: string;
}

export interface RecommendationLead extends RecommendationInput {
  readonly id: string;
  readonly status: "new";
  readonly createdAt: string;
}

export interface RecommendationRepository {
  list(): Promise<readonly RecommendationLead[]>;
  create(lead: RecommendationLead): Promise<RecommendationLead>;
}
