import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { GET as assetsGet } from "../src/app/api/admin/assets/route";
import { AssetService, AssetValidationError, InMemoryAssetStorage, MAX_IMAGE_BYTES } from "../src/lib/storage";

test("存储服务原样保存合法 ZIP 并记录 SHA-256", async () => {
  const storage = new InMemoryAssetStorage();
  const service = new AssetService(storage);
  const bytes = Uint8Array.from([0x50, 0x4b, 0x05, 0x06, 1, 2, 3, 4]);
  const metadata = await service.save("zip", { name: "skill.zip", type: "application/zip", bytes }, new Date("2026-01-01T00:00:00Z"));
  assert.equal(metadata.sha256, createHash("sha256").update(bytes).digest("hex"));
  assert.deepEqual((await service.get(metadata.id))?.bytes, bytes);
  bytes[0] = 0;
  assert.equal((await service.get(metadata.id))?.bytes[0], 0x50);
  assert.equal("bytes" in (await service.list())[0], false);
});

test("存储服务校验图片 MIME、扩展名、魔数与大小", async () => {
  const service = new AssetService(new InMemoryAssetStorage());
  const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal((await service.save("image", { name: "cover.png", type: "image/png", bytes: png })).kind, "image");
  await assert.rejects(service.save("image", { name: "cover.jpg", type: "image/png", bytes: png }), AssetValidationError);
  await assert.rejects(service.save("zip", { name: "skill.zip", type: "application/zip", bytes: png }), /文件头/);
  await assert.rejects(service.save("image", { name: "huge.png", type: "image/png", bytes: new Uint8Array(MAX_IMAGE_BYTES + 1) }), /8 MB/);
  await assert.rejects(service.save("zip", { name: "../skill.zip", type: "application/zip", bytes: Uint8Array.from([0x50, 0x4b, 3, 4]) }), /文件名/);
});

test("文件管理 API 对匿名请求安全失败", async () => {
  const response = await assetsGet(new Request("https://catnip.example/api/admin/assets"));
  assert.equal(response.status, 401);
});
