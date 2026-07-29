import { desc } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { databaseSchema, recommendationLeads } from "@/lib/data/db/schema";
import type { RecommendationLead, RecommendationRepository } from "./types";

export class PostgresRecommendationRepository implements RecommendationRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof databaseSchema>) {}

  async list(): Promise<readonly RecommendationLead[]> {
    const rows = await this.db.select().from(recommendationLeads).orderBy(desc(recommendationLeads.createdAt));
    return rows.map((row) => ({
      id: row.id, skillUrl: row.skillUrl, sourceChannel: row.sourceChannel, reason: row.reason,
      contact: row.contact ?? undefined, status: "new", createdAt: row.createdAt.toISOString(),
    }));
  }

  async create(lead: RecommendationLead): Promise<RecommendationLead> {
    await this.db.insert(recommendationLeads).values({
      id: lead.id, skillUrl: lead.skillUrl, sourceChannel: lead.sourceChannel, reason: lead.reason,
      contact: lead.contact, status: lead.status, createdAt: new Date(lead.createdAt),
    });
    return structuredClone(lead);
  }
}
