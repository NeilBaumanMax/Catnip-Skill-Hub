import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { getRuntimeDatabase, isPersistentRuntime } from "@/lib/data/db";
import { runtimeAssetStorage, S3AssetStorage } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isPersistentRuntime()) {
    return Response.json({ status: "ok", persistence: "process-memory" });
  }

  try {
    const { client } = getRuntimeDatabase();
    await client`select 1`;
    if (!(runtimeAssetStorage instanceof S3AssetStorage)) throw new Error("S3 存储适配器未启用。");
    await runtimeAssetStorage.client.send(new HeadBucketCommand({ Bucket: runtimeAssetStorage.config.bucket }));
    return Response.json({ status: "ok", persistence: "postgres-s3" });
  } catch {
    return Response.json({ status: "unhealthy" }, { status: 503 });
  }
}
