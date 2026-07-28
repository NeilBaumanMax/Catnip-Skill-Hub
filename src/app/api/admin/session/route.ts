import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  AuthConfigurationError,
  authenticateAdmin,
  createAdminSessionToken,
  isSameOriginMutation,
  loadAdminAuthConfig,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "请求来源无效。" }, { status: 403 });
  }

  try {
    const body = await request.json() as { email?: unknown; password?: unknown };
    if (typeof body.email !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ error: "请输入邮箱和密码。" }, { status: 400 });
    }

    const config = loadAdminAuthConfig();
    const identity = await authenticateAdmin(body.email, body.password, config);
    if (!identity) return NextResponse.json({ error: "邮箱或密码错误。" }, { status: 401 });

    const response = NextResponse.json({ admin: identity });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(identity, config.sessionSecret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      return NextResponse.json({ error: "管理员认证尚未配置。" }, { status: 503 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "请求内容不是有效 JSON。" }, { status: 400 });
    }
    throw error;
  }
}

export async function DELETE(request: Request) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "请求来源无效。" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
