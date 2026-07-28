import { getRequestAdmin, isSameOriginMutation } from "@/lib/auth";
import { assetService, AssetValidationError } from "@/lib/storage";

interface AssetRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: AssetRouteContext) {
  if (!getRequestAdmin(request)) return Response.json({ error: "需要管理员登录。" }, { status: 401 });
  const asset = await assetService.get((await params).id);
  if (!asset) return Response.json({ error: "文件不存在。" }, { status: 404 });
  const body = asset.bytes.buffer.slice(asset.bytes.byteOffset, asset.bytes.byteOffset + asset.bytes.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      "Content-Type": asset.contentType,
      "Content-Length": String(asset.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(asset.filename)}`,
      "Cache-Control": "no-store",
    },
  });
}

export async function DELETE(request: Request, { params }: AssetRouteContext) {
  if (!getRequestAdmin(request)) return Response.json({ error: "需要管理员登录。" }, { status: 401 });
  if (!isSameOriginMutation(request)) return Response.json({ error: "请求来源无效。" }, { status: 403 });
  try {
    await assetService.delete((await params).id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof AssetValidationError) return Response.json({ error: error.message }, { status: 400 });
    if (error instanceof Error && error.message.includes("不存在")) return Response.json({ error: error.message }, { status: 404 });
    throw error;
  }
}
