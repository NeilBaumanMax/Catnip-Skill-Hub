import { eq, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { analyticsCounts, databaseSchema } from "@/lib/data/db/schema";
import type { AnalyticsCounts, AnalyticsEvent, AnalyticsRepository } from "./types";

const EMPTY: AnalyticsCounts = { views: 0, downloadClicks: 0, installCopies: 0, sourceVisits: 0 };

export class PostgresAnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof databaseSchema>) {}

  async get(slug: string): Promise<AnalyticsCounts> {
    const [row] = await this.db.select().from(analyticsCounts).where(eq(analyticsCounts.slug, slug)).limit(1);
    return row ? {
      views: row.views,
      downloadClicks: row.downloadClicks,
      installCopies: row.installCopies,
      sourceVisits: row.sourceVisits,
    } : { ...EMPTY };
  }

  async increment(slug: string, event: AnalyticsEvent): Promise<AnalyticsCounts> {
    const increments = event === "view" ? { views: 1 }
      : event === "download_click" ? { downloadClicks: 1 }
      : event === "install_copy" ? { installCopies: 1 }
      : { sourceVisits: 1 };
    const updates = event === "view" ? { views: sql`${analyticsCounts.views} + 1` }
      : event === "download_click" ? { downloadClicks: sql`${analyticsCounts.downloadClicks} + 1` }
      : event === "install_copy" ? { installCopies: sql`${analyticsCounts.installCopies} + 1` }
      : { sourceVisits: sql`${analyticsCounts.sourceVisits} + 1` };
    const [row] = await this.db.insert(analyticsCounts).values({ slug, ...increments })
      .onConflictDoUpdate({ target: analyticsCounts.slug, set: { ...updates, updatedAt: new Date() } })
      .returning();
    return {
      views: row.views,
      downloadClicks: row.downloadClicks,
      installCopies: row.installCopies,
      sourceVisits: row.sourceVisits,
    };
  }
}
