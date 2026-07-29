import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL 未配置，拒绝执行迁移。");

const client = postgres(databaseUrl, { max: 1, connect_timeout: 10, prepare: false });

try {
  await migrate(drizzle(client), { migrationsFolder: "drizzle", migrationsSchema: "public" });
  process.stdout.write("Catnip 数据库迁移完成。\n");
} finally {
  await client.end();
}
