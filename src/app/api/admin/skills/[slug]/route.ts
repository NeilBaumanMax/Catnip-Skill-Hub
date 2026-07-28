import {
  adminSkillService,
  SkillManagementError,
  type AdminSkillOperation,
  type AdminSkillUpdateInput,
} from "@/lib/admin/skills";
import { getRequestAdmin, isSameOriginMutation } from "@/lib/auth";

interface SkillRouteContext {
  params: Promise<{ slug: string }>;
}

function managementError(error: unknown) {
  if (error instanceof SkillManagementError) {
    const status = error.code === "not_found" ? 404 : error.code === "conflict" ? 409 : 400;
    return Response.json({ error: error.message }, { status });
  }
  if (error instanceof SyntaxError || error instanceof TypeError) {
    return Response.json({ error: "请求字段无效。" }, { status: 400 });
  }
  throw error;
}

function authorize(request: Request): Response | null {
  if (!getRequestAdmin(request)) return Response.json({ error: "需要管理员登录。" }, { status: 401 });
  if (!isSameOriginMutation(request)) return Response.json({ error: "请求来源无效。" }, { status: 403 });
  return null;
}

export async function PATCH(request: Request, { params }: SkillRouteContext) {
  const denied = authorize(request);
  if (denied) return denied;

  try {
    const { slug } = await params;
    const body = await request.json() as {
      operation?: AdminSkillOperation | "update";
      input?: AdminSkillUpdateInput;
    };
    const skill = body.operation === "publish" || body.operation === "unlist"
      ? await adminSkillService.transition(slug, body.operation)
      : body.operation === "update" && body.input
        ? await adminSkillService.update(slug, body.input)
        : null;

    if (!skill) return Response.json({ error: "管理操作无效。" }, { status: 400 });
    return Response.json({ skill });
  } catch (error) {
    return managementError(error);
  }
}

export async function DELETE(request: Request, { params }: SkillRouteContext) {
  const denied = authorize(request);
  if (denied) return denied;

  try {
    const { slug } = await params;
    await adminSkillService.delete(slug);
    return new Response(null, { status: 204 });
  } catch (error) {
    return managementError(error);
  }
}
