import { bigint, boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { SkillResource } from "@/lib/domain/skills";

export const skills = pgTable("skills", {
  slug: text("slug").primaryKey(),
  id: text("id").notNull().unique(),
  title: text("title").notNull(),
  publishStatus: text("publish_status").notNull(),
  hidden: boolean("hidden").notNull().default(false),
  payload: jsonb("payload").$type<SkillResource>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const recommendationLeads = pgTable("recommendation_leads", {
  id: text("id").primaryKey(),
  skillUrl: text("skill_url").notNull(),
  sourceChannel: text("source_channel").notNull(),
  reason: text("reason").notNull(),
  contact: text("contact"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const analyticsCounts = pgTable("analytics_counts", {
  slug: text("slug").primaryKey(),
  views: bigint("views", { mode: "number" }).notNull().default(0),
  downloadClicks: bigint("download_clicks", { mode: "number" }).notNull().default(0),
  installCopies: bigint("install_copies", { mode: "number" }).notNull().default(0),
  sourceVisits: bigint("source_visits", { mode: "number" }).notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  kind: text("kind").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: bigint("size", { mode: "number" }).notNull(),
  sha256: text("sha256").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const databaseSchema = { skills, recommendationLeads, analyticsCounts, assets };
