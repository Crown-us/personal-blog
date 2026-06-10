CREATE TYPE "public"."event_type" AS ENUM('view', 'click_install', 'click_website', 'click_affiliate', 'search_impression', 'comparison_view');--> statement-breakpoint
CREATE TYPE "public"."extension_status" AS ENUM('pending', 'approved', 'rejected', 'featured');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."pricing_type" AS ENUM('free', 'freemium', 'paid');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."sponsorship_tier" AS ENUM('basic', 'pro', 'premium');--> statement-breakpoint
CREATE TYPE "public"."user_plan" AS ENUM('free', 'pro', 'business');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'publisher', 'admin');--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extension_id" uuid,
	"event_type" "event_type" NOT NULL,
	"session_id" varchar(255),
	"user_id" uuid,
	"referrer" text,
	"country_code" char(2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_image_url" text,
	"author_id" uuid NOT NULL,
	"category_slug" varchar(100),
	"status" "post_status" DEFAULT 'draft',
	"is_featured" boolean DEFAULT false,
	"is_sponsored" boolean DEFAULT false,
	"sponsor_name" varchar(255),
	"reading_time_minutes" integer,
	"view_count" integer DEFAULT 0,
	"meta_title" varchar(60),
	"meta_description" varchar(160),
	"tags" text[],
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"icon_name" varchar(100),
	"color" varchar(7),
	"gradient" varchar(100),
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0,
	"extension_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "collection_extensions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_id" uuid NOT NULL,
	"extension_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"cover_image_url" text,
	"curated_by" uuid,
	"is_published" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"meta_title" varchar(60),
	"meta_description" varchar(160),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "extensions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"chrome_store_id" varchar(255),
	"name" varchar(255) NOT NULL,
	"tagline" varchar(500),
	"description" text NOT NULL,
	"logo_url" text,
	"website_url" text,
	"affiliate_url" text,
	"chrome_store_url" text NOT NULL,
	"publisher_id" uuid,
	"category_id" uuid,
	"status" "extension_status" DEFAULT 'pending' NOT NULL,
	"is_featured" boolean DEFAULT false,
	"is_sponsored" boolean DEFAULT false,
	"sponsorship_tier" "sponsorship_tier",
	"sponsorship_expires_at" timestamp,
	"version" varchar(50),
	"total_users" integer DEFAULT 0,
	"weekly_users" integer DEFAULT 0,
	"avg_rating" numeric(3, 2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"total_installs" integer DEFAULT 0,
	"click_count" integer DEFAULT 0,
	"meta_title" varchar(60),
	"meta_description" varchar(160),
	"tags" text[],
	"permissions" text[],
	"manifest" jsonb,
	"pricing_type" "pricing_type" DEFAULT 'free',
	"price" numeric(10, 2),
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "extensions_slug_unique" UNIQUE("slug"),
	CONSTRAINT "extensions_chrome_store_id_unique" UNIQUE("chrome_store_id")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"confirmed_at" timestamp,
	"unsubscribed_at" timestamp,
	"source" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extension_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"body" text,
	"pros" text[],
	"cons" text[],
	"verified" boolean DEFAULT false,
	"helpful_votes" integer DEFAULT 0,
	"status" "review_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_comparisons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"extension_ids" uuid[] NOT NULL,
	"user_id" uuid,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "saved_comparisons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "screenshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extension_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" varchar(255),
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"tagline" varchar(500),
	"description" text NOT NULL,
	"tech_stack" text[] NOT NULL,
	"price" varchar(50) NOT NULL,
	"price_raw" integer NOT NULL,
	"thumbnail" text,
	"screenshots" text[],
	"demo_link" text,
	"category" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "source_codes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_subscription_id" varchar(255),
	"stripe_product_id" varchar(255),
	"status" varchar(50) NOT NULL,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"avatar_url" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"plan" "user_plan" DEFAULT 'free' NOT NULL,
	"stripe_customer_id" varchar(255),
	"email_verified" boolean DEFAULT false,
	"newsletter_subscribed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_extension_id_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."extensions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_extensions" ADD CONSTRAINT "collection_extensions_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_extensions" ADD CONSTRAINT "collection_extensions_extension_id_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."extensions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_curated_by_users_id_fk" FOREIGN KEY ("curated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extensions" ADD CONSTRAINT "extensions_publisher_id_users_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extensions" ADD CONSTRAINT "extensions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_extension_id_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."extensions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_comparisons" ADD CONSTRAINT "saved_comparisons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_extension_id_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."extensions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_ext_idx" ON "analytics_events" USING btree ("extension_id");--> statement-breakpoint
CREATE INDEX "analytics_type_idx" ON "analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "analytics_date_idx" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ext_category_status_idx" ON "extensions" USING btree ("category_id","status");--> statement-breakpoint
CREATE INDEX "ext_featured_idx" ON "extensions" USING btree ("is_featured","status");--> statement-breakpoint
CREATE INDEX "ext_trending_idx" ON "extensions" USING btree ("weekly_users","status");--> statement-breakpoint
CREATE INDEX "ext_rating_idx" ON "extensions" USING btree ("avg_rating","status");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_unique_user_ext" ON "reviews" USING btree ("user_id","extension_id");--> statement-breakpoint
CREATE INDEX "reviews_extension_idx" ON "reviews" USING btree ("extension_id","status");