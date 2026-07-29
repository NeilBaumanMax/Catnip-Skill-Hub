import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { desc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { assets, databaseSchema } from "@/lib/data/db/schema";
import type { AssetKind, AssetStorage, StoredAssetMetadata, StoredAssetRecord } from "./types";

export interface S3StorageConfig {
  readonly endpoint: string;
  readonly region: string;
  readonly bucket: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly forcePathStyle: boolean;
}

export function loadS3StorageConfig(env: Readonly<Record<string, string | undefined>> = process.env): S3StorageConfig {
  const required = (name: string): string => {
    const value = env[name]?.trim();
    if (!value) throw new Error(`${name} 未配置。`);
    return value;
  };
  return {
    endpoint: required("CATNIP_S3_ENDPOINT"),
    region: required("CATNIP_S3_REGION"),
    bucket: required("CATNIP_S3_BUCKET"),
    accessKeyId: required("CATNIP_S3_ACCESS_KEY_ID"),
    secretAccessKey: required("CATNIP_S3_SECRET_ACCESS_KEY"),
    forcePathStyle: env.CATNIP_S3_FORCE_PATH_STYLE !== "false",
  };
}

function metadata(row: typeof assets.$inferSelect): StoredAssetMetadata {
  return {
    id: row.id,
    kind: row.kind as AssetKind,
    filename: row.filename,
    contentType: row.contentType,
    size: row.size,
    sha256: row.sha256,
    createdAt: row.createdAt.toISOString(),
  };
}

export class S3AssetStorage implements AssetStorage {
  readonly client: S3Client;

  constructor(
    private readonly db: PostgresJsDatabase<typeof databaseSchema>,
    readonly config: S3StorageConfig,
  ) {
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: config.forcePathStyle,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
  }

  async list(): Promise<readonly StoredAssetMetadata[]> {
    const rows = await this.db.select().from(assets).orderBy(desc(assets.createdAt));
    return rows.map(metadata);
  }

  async get(id: string): Promise<StoredAssetRecord | undefined> {
    const [row] = await this.db.select().from(assets).where(eq(assets.id, id)).limit(1);
    if (!row) return undefined;
    const response = await this.client.send(new GetObjectCommand({ Bucket: this.config.bucket, Key: row.objectKey }));
    if (!response.Body) throw new Error("对象存储返回空内容。");
    return { ...metadata(row), bytes: await response.Body.transformToByteArray() };
  }

  async put(record: StoredAssetRecord): Promise<StoredAssetMetadata> {
    const objectKey = `assets/${record.id}`;
    await this.client.send(new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: objectKey,
      Body: record.bytes,
      ContentType: record.contentType,
      Metadata: { sha256: record.sha256, filename: encodeURIComponent(record.filename) },
    }));
    try {
      const [row] = await this.db.insert(assets).values({
        id: record.id, objectKey, kind: record.kind, filename: record.filename,
        contentType: record.contentType, size: record.size, sha256: record.sha256,
        createdAt: new Date(record.createdAt),
      }).returning();
      return metadata(row);
    } catch (error) {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: objectKey })).catch(() => undefined);
      if ((error as { code?: string }).code === "23505") throw new Error("文件 ID 已存在。");
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const [row] = await this.db.select().from(assets).where(eq(assets.id, id)).limit(1);
    if (!row) throw new Error("文件不存在。");
    await this.client.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: row.objectKey }));
    await this.db.delete(assets).where(eq(assets.id, id));
  }
}
