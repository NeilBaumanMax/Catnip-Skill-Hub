import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/data/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://catnip:local-only@127.0.0.1:5432/catnip",
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "public",
  },
  strict: true,
});
