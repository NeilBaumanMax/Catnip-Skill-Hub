import type { AssetStorage, StoredAssetMetadata, StoredAssetRecord } from "./types";

function metadata(record: StoredAssetRecord): StoredAssetMetadata {
  const { bytes: _bytes, ...result } = record;
  void _bytes;
  return structuredClone(result);
}

export class InMemoryAssetStorage implements AssetStorage {
  private readonly records = new Map<string, StoredAssetRecord>();

  async list(): Promise<readonly StoredAssetMetadata[]> {
    return [...this.records.values()]
      .map(metadata)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async get(id: string): Promise<StoredAssetRecord | undefined> {
    const record = this.records.get(id);
    return record ? { ...structuredClone(metadata(record)), bytes: record.bytes.slice() } : undefined;
  }

  async put(record: StoredAssetRecord): Promise<StoredAssetMetadata> {
    if (this.records.has(record.id)) throw new Error("文件 ID 已存在。");
    const stored = { ...structuredClone(metadata(record)), bytes: record.bytes.slice() };
    this.records.set(record.id, stored);
    return metadata(stored);
  }

  async delete(id: string): Promise<void> {
    if (!this.records.delete(id)) throw new Error("文件不存在。");
  }
}
