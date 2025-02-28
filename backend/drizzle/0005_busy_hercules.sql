ALTER TABLE "posts" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_draft" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "status";