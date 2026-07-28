import { randomUUID } from "node:crypto";
import type { RecommendationInput, RecommendationLead, RecommendationRepository } from "./types";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;

export class RecommendationError extends Error {
  constructor(readonly code: "invalid" | "rate_limited", message: string) {
    super(message);
    this.name = "RecommendationError";
  }
}

function textField(value: unknown, label: string, maxLength: number, required = true): string {
  if (typeof value !== "string") throw new RecommendationError("invalid", `${label}无效。`);
  const result = value.trim();
  if ((required && !result) || result.length > maxLength) {
    throw new RecommendationError("invalid", `${label}为空或过长。`);
  }
  return result;
}

export class RecommendationService {
  private readonly attempts = new Map<string, number[]>();

  constructor(private readonly repository: RecommendationRepository) {}

  list(): Promise<readonly RecommendationLead[]> {
    return this.repository.list();
  }

  async submit(input: RecommendationInput, identifier: string, now = new Date()): Promise<RecommendationLead> {
    const key = identifier.trim().slice(0, 200) || "unknown";
    const cutoff = now.getTime() - RATE_WINDOW_MS;
    const recent = (this.attempts.get(key) ?? []).filter((timestamp) => timestamp > cutoff);
    if (recent.length >= RATE_LIMIT) throw new RecommendationError("rate_limited", "提交过于频繁，请稍后再试。");
    recent.push(now.getTime());
    this.attempts.set(key, recent);

    const skillUrl = textField(input.skillUrl, "Skill 链接", 500);
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(skillUrl);
    } catch {
      throw new RecommendationError("invalid", "Skill 链接无效。");
    }
    if (parsedUrl.protocol !== "https:" || parsedUrl.username || parsedUrl.password) {
      throw new RecommendationError("invalid", "Skill 链接必须使用 HTTPS。");
    }

    return this.repository.create({
      id: randomUUID(),
      status: "new",
      createdAt: now.toISOString(),
      skillUrl: parsedUrl.toString(),
      sourceChannel: textField(input.sourceChannel, "发现渠道", 100),
      reason: textField(input.reason, "推荐理由", 1_500),
      contact: textField(input.contact ?? "", "联系方式", 200, false) || undefined,
    });
  }
}
