import { InMemoryAssetStorage } from "./in-memory";
import { AssetService } from "./service";

const runtime = globalThis as typeof globalThis & { catnipAssetStorage?: InMemoryAssetStorage };
export const runtimeAssetStorage = runtime.catnipAssetStorage ?? new InMemoryAssetStorage();
runtime.catnipAssetStorage = runtimeAssetStorage;
export const assetService = new AssetService(runtimeAssetStorage);
