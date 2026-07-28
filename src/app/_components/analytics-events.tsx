"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AnalyticsCounts, AnalyticsEvent } from "@/lib/analytics";

export async function reportSkillEvent(slug: string, event: AnalyticsEvent): Promise<AnalyticsCounts | undefined> {
  try {
    const response = await fetch(`/api/skills/${encodeURIComponent(slug)}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    });
    if (!response.ok) return undefined;
    const body = await response.json() as { counts?: AnalyticsCounts };
    return body.counts;
  } catch {
    return undefined;
  }
}

export function ViewTracker({ slug, initialViews }: { readonly slug: string; readonly initialViews: number }) {
  const sent = useRef(false);
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void reportSkillEvent(slug, "view").then((counts) => {
      if (counts) setViews(counts.views);
    });
  }, [slug]);

  return <span aria-label={`阅读 ${views} 次`}>阅读 {views}</span>;
}

export function TrackedExternalLink({
  slug,
  href,
  children,
}: {
  readonly slug: string;
  readonly href: string;
  readonly children: ReactNode;
}) {
  return <a href={href} target="_blank" rel="noreferrer" onClick={() => void reportSkillEvent(slug, "source_visit")}>{children}</a>;
}
