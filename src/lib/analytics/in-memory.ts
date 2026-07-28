import type { AnalyticsCounts, AnalyticsEvent, AnalyticsRepository } from "./types";

const EMPTY_COUNTS: AnalyticsCounts = {
  views: 0,
  downloadClicks: 0,
  installCopies: 0,
  sourceVisits: 0,
};

const EVENT_FIELDS: Record<AnalyticsEvent, keyof AnalyticsCounts> = {
  view: "views",
  download_click: "downloadClicks",
  install_copy: "installCopies",
  source_visit: "sourceVisits",
};

export class InMemoryAnalyticsRepository implements AnalyticsRepository {
  private readonly counts = new Map<string, AnalyticsCounts>();

  async get(slug: string): Promise<AnalyticsCounts> {
    return structuredClone(this.counts.get(slug) ?? EMPTY_COUNTS);
  }

  async increment(slug: string, event: AnalyticsEvent): Promise<AnalyticsCounts> {
    const current = this.counts.get(slug) ?? EMPTY_COUNTS;
    const field = EVENT_FIELDS[event];
    const next = { ...current, [field]: current[field] + 1 };
    this.counts.set(slug, next);
    return structuredClone(next);
  }
}
