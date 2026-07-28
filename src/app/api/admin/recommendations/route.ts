import { getRequestAdmin } from "@/lib/auth";
import { recommendationService } from "@/lib/recommendations";

export async function GET(request: Request) {
  if (!getRequestAdmin(request)) return Response.json({ error: "需要管理员登录。" }, { status: 401 });
  return Response.json({ recommendations: await recommendationService.list(), persistence: "process-memory" });
}
