import { isSameOriginMutation } from "@/lib/auth";
import { recommendationService, RecommendationError, type RecommendationInput } from "@/lib/recommendations";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return Response.json({ error: "请求来源无效。" }, { status: 403 });

  try {
    const body = await request.json() as RecommendationInput & { website?: unknown };
    if (typeof body.website === "string" && body.website.trim()) {
      return Response.json({ accepted: true }, { status: 202 });
    }
    const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
    const identifier = forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
    await recommendationService.submit(body, identifier);
    return Response.json({ accepted: true }, { status: 201 });
  } catch (error) {
    if (error instanceof RecommendationError) {
      return Response.json({ error: error.message }, { status: error.code === "rate_limited" ? 429 : 400 });
    }
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return Response.json({ error: "请求字段无效。" }, { status: 400 });
    }
    throw error;
  }
}
