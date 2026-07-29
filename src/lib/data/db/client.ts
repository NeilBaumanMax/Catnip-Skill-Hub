import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import { databaseSchema } from "./schema";

export interface DatabaseConnection {
  readonly db: PostgresJsDatabase<typeof databaseSchema>;
  readonly client: Sql;
}

export function createDatabaseConnection(databaseUrl: string): DatabaseConnection {
  if (!databaseUrl.trim()) throw new Error("DATABASE_URL 未配置。");
  const client = postgres(databaseUrl, { max: 10, idle_timeout: 20, connect_timeout: 10, prepare: false });
  return { db: drizzle(client, { schema: databaseSchema }), client };
}

const runtime = globalThis as typeof globalThis & { catnipDatabase?: DatabaseConnection };

export function isPersistentRuntime(): boolean {
  return process.env.CATNIP_PERSISTENCE_MODE === "postgres";
}

export function getRuntimeDatabase(): DatabaseConnection {
  if (!isPersistentRuntime()) throw new Error("当前未启用 PostgreSQL 持久化模式。");
  if (!runtime.catnipDatabase) runtime.catnipDatabase = createDatabaseConnection(process.env.DATABASE_URL ?? "");
  return runtime.catnipDatabase;
}
