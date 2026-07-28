export type AssetKind = "zip" | "image";

export interface StoredAssetMetadata {
  readonly id: string;
  readonly kind: AssetKind;
  readonly filename: string;
  readonly contentType: string;
  readonly size: number;
  readonly sha256: string;
  readonly createdAt: string;
}

export interface StoredAssetRecord extends StoredAssetMetadata {
  readonly bytes: Uint8Array;
}

export interface AssetStorage {
  list(): Promise<readonly StoredAssetMetadata[]>;
  get(id: string): Promise<StoredAssetRecord | undefined>;
  put(record: StoredAssetRecord): Promise<StoredAssetMetadata>;
  delete(id: string): Promise<void>;
}
