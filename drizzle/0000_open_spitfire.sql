CREATE TABLE "analytics_counts" (
	"slug" text PRIMARY KEY NOT NULL,
	"views" bigint DEFAULT 0 NOT NULL,
	"download_clicks" bigint DEFAULT 0 NOT NULL,
	"install_copies" bigint DEFAULT 0 NOT NULL,
	"source_visits" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"object_key" text NOT NULL,
	"kind" text NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size" bigint NOT NULL,
	"sha256" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "assets_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
CREATE TABLE "recommendation_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"skill_url" text NOT NULL,
	"source_channel" text NOT NULL,
	"reason" text NOT NULL,
	"contact" text,
	"status" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"slug" text PRIMARY KEY NOT NULL,
	"id" text NOT NULL,
	"title" text NOT NULL,
	"publish_status" text NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_id_unique" UNIQUE("id")
);
