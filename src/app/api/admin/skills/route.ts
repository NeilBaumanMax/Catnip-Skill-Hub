import { adminSkillService, SkillManagementError, type AdminSkillCreateInput } from "@/lib/admin/skills";
import { getRequestAdmin, isSameOriginMutation } from "@/lib/auth";

function unauthorized() {
  return Response.json({ error: "需要管理员登录。" }, { status: 401 });
}

function managementError(error: unknown) {
  if (error instanceof SkillManagementError) {
    const status = error.code === "conflict" ? 409 : error.code === "not_found" ? 404 : 400;
    return Response.json({ error: error.message }, { status });
  }
  if (error instanceof SyntaxError || error instanceof TypeError) {
    return Response.json({ error: "请求字段无效。" }, { status: 400 });
  }
  throw error;
}

export async function GET(request: Request) {
  if (!getRequestAdmin(request)) return unauthorized();
  return Response.json({ skills: await adminSkillService.list(), persistence: "process-memory" });
}

export async function POST(request: Request) {
  if (!getRequestAdmin(request)) return unauthorized();
  if (!isSameOriginMutation(request)) return Response.json({ error: "请求来源无效。" }, { status: 403 });

  try {
    const skill = await adminSkillService.create(await request.json() as AdminSkillCreateInput);
    return Response.json({ skill }, { status: 201 });
  } catch (error) {
    return managementError(error);
  }
}
