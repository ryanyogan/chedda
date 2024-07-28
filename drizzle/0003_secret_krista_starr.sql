CREATE TABLE IF NOT EXISTS "connected_banks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"status" text NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscriptions_subscription_id_unique" UNIQUE("subscription_id")
);
