import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test from "node:test";
import { PostgresAnalyticsRepository } from "../../src/lib/analytics/postgres";
import { createDatabaseConnection } from "../../src/lib/data/db/client";
import { PostgresSkillRepository } from "../../src/lib/data/skills/postgres";
import { PostgresRecommendationRepository } from "../../src/lib/recommendations/postgres";
import { loadS3StorageConfig, S3AssetStorage } from "../../src/lib/storage/s3";

const databaseUrl = process.env.CATNIP_DATABASE_TEST_URL?.trim();

test("PostgreSQL 与 S3 适配器跨实例持久化数据", { skip: !databaseUrl }, async () => {
  assert.ok(databaseUrl);
  const connection = createDatabaseConnection(databaseUrl);
  const skillRepository = new PostgresSkillRepository(connection.db);
  const analyticsA = new PostgresAnalyticsRepository(connection.db);
  const analyticsB = new PostgresAnalyticsRepository(connection.db);
  const leadsA = new PostgresRecommendationRepository(connection.db);
  const leadsB = new PostgresRecommendationRepository(connection.db);
  const storageA = new S3AssetStorage(connection.db, loadS3StorageConfig());
  const storageB = new S3AssetStorage(connection.db, loadS3StorageConfig());
  const suffix = randomUUID();
  const analyticsSlug = `integration-${suffix}`;
  const leadId = randomUUID();
  const assetId = randomUUID();
  const bytes = new TextEncoder().encode(`catnip-${suffix}`);

  try {
    const skills = await skillRepository.list();
    assert.equal(skills.length, 10);

    await analyticsA.increment(analyticsSlug, "view");
    assert.equal((await analyticsB.get(analyticsSlug)).views, 1);

    await leadsA.create({
      id: leadId,
      skillUrl: "https://github.com/NeilBaumanMax/Catnip-Skill-Hub",
      sourceChannel: "integration-test",
      reason: "验证 PostgreSQL 跨 Repository 实例可见。",
      status: "new",
      createdAt: new Date().toISOString(),
    });
    assert.ok((await leadsB.list()).some((lead) => lead.id === leadId));

    await storageA.put({
      id: assetId,
      kind: "zip",
      filename: "integration.zip",
      contentType: "application/zip",
      size: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      createdAt: new Date().toISOString(),
      bytes,
    });
    const restored = await storageB.get(assetId);
    assert.deepEqual(restored?.bytes, bytes);
    assert.ok((await storageB.list()).some((asset) => asset.id === assetId));
    await storageB.delete(assetId);
    assert.equal(await storageA.get(assetId), undefined);
  } finally {
    await storageA.client.destroy();
    await storageB.client.destroy();
    await connection.client`delete from analytics_counts where slug = ${analyticsSlug}`;
    await connection.client`delete from recommendation_leads where id = ${leadId}`;
    await connection.client`delete from assets where id = ${assetId}`;
    await connection.client.end();
  }
});
