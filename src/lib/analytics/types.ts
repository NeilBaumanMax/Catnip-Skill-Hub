export const ANALYTICS_EVENTS = ["view", "download_click", "install_copy", "source_visit"] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export interface AnalyticsCounts {
  readonly views: number;
  readonly downloadClicks: number;
  readonly installCopies: number;
  readonly sourceVisits: number;
}

export interface AnalyticsRepository {
  get(slug: string): Promise<AnalyticsCounts>;
  increment(slug: string, event: AnalyticsEvent): Promise<AnalyticsCounts>;
}
