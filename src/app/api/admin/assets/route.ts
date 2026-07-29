import { getRequestAdmin, isSameOriginMutation } from "@/lib/auth";
import { assetPersistence, assetService, AssetValidationError, MAX_ZIP_BYTES } from "@/lib/storage";

const MAX_MULTIPART_BYTES = MAX_ZIP_BYTES + 1024 * 1024;

function unauthorized() {
  return Response.json({ error: "需要管理员登录。" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!getRequestAdmin(request)) return unauthorized();
  return Response.json({ assets: await assetService.list(), persistence: assetPersistence });
}

export async function POST(request: Request) {
  if (!getRequestAdmin(request)) return unauthorized();
  if (!isSameOriginMutation(request)) return Response.json({ error: "请求来源无效。" }, { status: 403 });

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_BYTES) {
    return Response.json({ error: "上传请求超过大小限制。" }, { status: 413 });
  }

  try {
    const form = await request.formData();
    const kind = form.get("kind");
    const file = form.get("file");
    if ((kind !== "zip" && kind !== "image") || !(file instanceof File)) {
      return Response.json({ error: "请选择有效文件和类型。" }, { status: 400 });
    }
    const asset = await assetService.save(kind, {
      name: file.name,
      type: file.type,
      bytes: new Uint8Array(await file.arrayBuffer()),
    });
    return Response.json({ asset }, { status: 201 });
  } catch (error) {
    if (error instanceof AssetValidationError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
