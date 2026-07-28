import { getRequestAdmin, isSameOriginMutation } from "@/lib/auth";
import { githubSkillImportService, GitHubImportError } from "@/lib/import/github";

export async function POST(request: Request) {
  if (!getRequestAdmin(request)) return Response.json({ error: "需要管理员登录。" }, { status: 401 });
  if (!isSameOriginMutation(request)) return Response.json({ error: "请求来源无效。" }, { status: 403 });

  try {
    const body = await request.json() as { repositoryUrl?: unknown };
    if (typeof body.repositoryUrl !== "string") {
      return Response.json({ error: "请输入 GitHub 仓库 URL。" }, { status: 400 });
    }
    return Response.json({ preview: await githubSkillImportService.preview(body.repositoryUrl) });
  } catch (error) {
    if (error instanceof GitHubImportError) {
      const status = error.code === "upstream" ? 502 : error.code === "limit" ? 413 : 400;
      return Response.json({ error: error.message }, { status });
    }
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return Response.json({ error: "请求字段无效。" }, { status: 400 });
    }
    throw error;
  }
}
