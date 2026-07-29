import { InMemoryAssetStorage } from "./in-memory";
import { getRuntimeDatabase, isPersistentRuntime } from "@/lib/data/db";
import { loadS3StorageConfig, S3AssetStorage } from "./s3";
import { AssetService } from "./service";
import type { AssetStorage } from "./types";

const runtime = globalThis as typeof globalThis & { catnipAssetStorage?: AssetStorage };
export const runtimeAssetStorage = runtime.catnipAssetStorage ?? (isPersistentRuntime()
  ? new S3AssetStorage(getRuntimeDatabase().db, loadS3StorageConfig())
  : new InMemoryAssetStorage());
runtime.catnipAssetStorage = runtimeAssetStorage;
export const assetService = new AssetService(runtimeAssetStorage);
export const assetPersistence = isPersistentRuntime() ? "postgres-s3" : "process-memory";
