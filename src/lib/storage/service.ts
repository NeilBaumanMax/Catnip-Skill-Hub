import { createHash, randomUUID } from "node:crypto";
import { extname } from "node:path";
import type { AssetKind, AssetStorage, StoredAssetMetadata, StoredAssetRecord } from "./types";

export const MAX_ZIP_BYTES = 25 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const IMAGE_TYPES = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/gif", ".gif"],
  ["image/webp", ".webp"],
]);

export class AssetValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssetValidationError";
  }
}

function safeFilename(filename: string): string {
  const normalized = filename.trim();
  if (
    !normalized ||
    normalized.length > 180 ||
    normalized.includes("/") ||
    normalized.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(normalized)
  ) {
    throw new AssetValidationError("文件名无效。");
  }
  return normalized;
}

function hasZipMagic(bytes: Uint8Array): boolean {
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) return false;
  return (bytes[2] === 0x03 && bytes[3] === 0x04) ||
    (bytes[2] === 0x05 && bytes[3] === 0x06) ||
    (bytes[2] === 0x07 && bytes[3] === 0x08);
}

function hasImageMagic(contentType: string, bytes: Uint8Array): boolean {
  if (contentType === "image/png") {
    return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  }
  if (contentType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === "image/gif") {
    const header = new TextDecoder().decode(bytes.slice(0, 6));
    return header === "GIF87a" || header === "GIF89a";
  }
  if (contentType === "image/webp") {
    return bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export class AssetService {
  constructor(private readonly storage: AssetStorage) {}

  list(): Promise<readonly StoredAssetMetadata[]> {
    return this.storage.list();
  }

  get(id: string): Promise<StoredAssetRecord | undefined> {
    return this.storage.get(id);
  }

  async save(
    kind: AssetKind,
    file: { readonly name: string; readonly type: string; readonly bytes: Uint8Array },
    now = new Date(),
  ): Promise<StoredAssetMetadata> {
    const filename = safeFilename(file.name);
    if (file.bytes.length === 0) throw new AssetValidationError("空文件不可保存。");

    if (kind === "zip") {
      if (file.bytes.length > MAX_ZIP_BYTES) throw new AssetValidationError("ZIP 超过 25 MB 限制。");
      if (extname(filename).toLowerCase() !== ".zip" || !["application/zip", "application/x-zip-compressed"].includes(file.type)) {
        throw new AssetValidationError("ZIP 扩展名或 MIME 类型无效。");
      }
      if (!hasZipMagic(file.bytes)) throw new AssetValidationError("ZIP 文件头无效。");
    } else if (kind === "image") {
      if (file.bytes.length > MAX_IMAGE_BYTES) throw new AssetValidationError("图片超过 8 MB 限制。");
      const expectedExtension = IMAGE_TYPES.get(file.type);
      const actualExtension = extname(filename).toLowerCase();
      const extensionMatches = expectedExtension === ".jpg"
        ? actualExtension === ".jpg" || actualExtension === ".jpeg"
        : actualExtension === expectedExtension;
      if (!expectedExtension || !extensionMatches || !hasImageMagic(file.type, file.bytes)) {
        throw new AssetValidationError("图片扩展名、MIME 或文件头不一致。");
      }
    } else {
      throw new AssetValidationError("文件类型无效。");
    }

    return this.storage.put({
      id: randomUUID(),
      kind,
      filename,
      contentType: file.type,
      size: file.bytes.length,
      sha256: createHash("sha256").update(file.bytes).digest("hex"),
      createdAt: now.toISOString(),
      bytes: file.bytes.slice(),
    });
  }

  delete(id: string): Promise<void> {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new AssetValidationError("文件 ID 无效。");
    return this.storage.delete(id);
  }
}
