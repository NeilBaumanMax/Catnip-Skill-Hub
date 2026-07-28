import { analyticsService, AnalyticsError } from "@/lib/analytics";
import { isSameOriginMutation } from "@/lib/auth";

interface EventRouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, { params }: EventRouteContext) {
  if (!isSameOriginMutation(request)) return Response.json({ error: "请求来源无效。" }, { status: 403 });

  try {
    const body = await request.json() as { event?: unknown };
    const counts = await analyticsService.record((await params).slug, body.event);
    return Response.json({ counts, persistence: "process-memory" });
  } catch (error) {
    if (error instanceof AnalyticsError) {
      return Response.json({ error: error.message }, { status: error.code === "not_found" ? 404 : 400 });
    }
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return Response.json({ error: "请求字段无效。" }, { status: 400 });
    }
    throw error;
  }
}
