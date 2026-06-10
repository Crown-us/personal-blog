import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  jsonb,
  pgEnum,
  index,
  char,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["user", "publisher", "admin"]);
export const userPlanEnum = pgEnum("user_plan", ["free", "pro", "business"]);
export const extensionStatusEnum = pgEnum("extension_status", [
  "pending",
  "approved",
  "rejected",
  "featured",
]);
export const pricingTypeEnum = pgEnum("pricing_type", [
  "free",
  "freemium",
  "paid",
]);
export const sponsorshipTierEnum = pgEnum("sponsorship_tier", [
  "basic",
  "pro",
  "premium",
]);
export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);
export const eventTypeEnum = pgEnum("event_type", [
  "view",
  "click_install",
  "click_website",
  "click_affiliate",
  "search_impression",
  "comparison_view",
]);

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("user").notNull(),
  plan: userPlanEnum("plan").default("free").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  emailVerified: boolean("email_verified").default(false),
  newsletterSubscribed: boolean("newsletter_subscribed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 100 }),
  color: varchar("color", { length: 7 }),
  gradient: varchar("gradient", { length: 100 }),
  parentId: uuid("parent_id"),
  sortOrder: integer("sort_order").default(0),
  extensionCount: integer("extension_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Extensions ───────────────────────────────────────────────────────────────
export const extensions = pgTable(
  "extensions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    chromeStoreId: varchar("chrome_store_id", { length: 255 }).unique(),
    name: varchar("name", { length: 255 }).notNull(),
    tagline: varchar("tagline", { length: 500 }),
    description: text("description").notNull(),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    affiliateUrl: text("affiliate_url"),
    chromeStoreUrl: text("chrome_store_url").notNull(),
    publisherId: uuid("publisher_id").references(() => users.id),
    categoryId: uuid("category_id").references(() => categories.id),
    status: extensionStatusEnum("status").default("pending").notNull(),
    isFeatured: boolean("is_featured").default(false),
    isSponsored: boolean("is_sponsored").default(false),
    sponsorshipTier: sponsorshipTierEnum("sponsorship_tier"),
    sponsorshipExpiresAt: timestamp("sponsorship_expires_at"),
    version: varchar("version", { length: 50 }),
    totalUsers: integer("total_users").default(0),
    weeklyUsers: integer("weekly_users").default(0),
    avgRating: numeric("avg_rating", { precision: 3, scale: 2 }).default("0"),
    totalReviews: integer("total_reviews").default(0),
    totalInstalls: integer("total_installs").default(0),
    clickCount: integer("click_count").default(0),
    metaTitle: varchar("meta_title", { length: 60 }),
    metaDescription: varchar("meta_description", { length: 160 }),
    tags: text("tags").array(),
    permissions: text("permissions").array(),
    manifest: jsonb("manifest"),
    pricingType: pricingTypeEnum("pricing_type").default("free"),
    price: numeric("price", { precision: 10, scale: 2 }),
    lastSyncedAt: timestamp("last_synced_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("ext_category_status_idx").on(table.categoryId, table.status),
    index("ext_featured_idx").on(table.isFeatured, table.status),
    index("ext_trending_idx").on(table.weeklyUsers, table.status),
    index("ext_rating_idx").on(table.avgRating, table.status),
  ]
);

// ─── Screenshots ──────────────────────────────────────────────────────────────
export const screenshots = pgTable("screenshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  extensionId: uuid("extension_id")
    .references(() => extensions.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    extensionId: uuid("extension_id")
      .references(() => extensions.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 255 }),
    body: text("body"),
    pros: text("pros").array(),
    cons: text("cons").array(),
    verified: boolean("verified").default(false),
    helpfulVotes: integer("helpful_votes").default(0),
    status: reviewStatusEnum("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("reviews_unique_user_ext").on(table.userId, table.extensionId),
    index("reviews_extension_idx").on(table.extensionId, table.status),
  ]
);

// ─── Collections ──────────────────────────────────────────────────────────────
export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  curatedBy: uuid("curated_by").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  metaTitle: varchar("meta_title", { length: 60 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const collectionExtensions = pgTable("collection_extensions", {
  id: uuid("id").primaryKey().defaultRandom(),
  collectionId: uuid("collection_id")
    .references(() => collections.id, { onDelete: "cascade" })
    .notNull(),
  extensionId: uuid("extension_id")
    .references(() => extensions.id, { onDelete: "cascade" })
    .notNull(),
  sortOrder: integer("sort_order").default(0),
  note: text("note"),
});

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url"),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  categorySlug: varchar("category_slug", { length: 100 }),
  status: postStatusEnum("status").default("draft"),
  isFeatured: boolean("is_featured").default(false),
  isSponsored: boolean("is_sponsored").default(false),
  sponsorName: varchar("sponsor_name", { length: 255 }),
  readingTimeMinutes: integer("reading_time_minutes"),
  viewCount: integer("view_count").default(0),
  metaTitle: varchar("meta_title", { length: 60 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  tags: text("tags").array(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Analytics Events ─────────────────────────────────────────────────────────
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    extensionId: uuid("extension_id").references(() => extensions.id),
    eventType: eventTypeEnum("event_type").notNull(),
    sessionId: varchar("session_id", { length: 255 }),
    userId: uuid("user_id"),
    referrer: text("referrer"),
    countryCode: char("country_code", { length: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("analytics_ext_idx").on(table.extensionId),
    index("analytics_type_idx").on(table.eventType),
    index("analytics_date_idx").on(table.createdAt),
  ]
);

// ─── Newsletter Subscribers ───────────────────────────────────────────────────
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Saved Comparisons ────────────────────────────────────────────────────────
export const savedComparisons = pgTable("saved_comparisons", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  extensionIds: uuid("extension_ids").array().notNull(),
  userId: uuid("user_id").references(() => users.id),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripeProductId: varchar("stripe_product_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Source Codes ─────────────────────────────────────────────────────────────
export const sourceCodes = pgTable("source_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 500 }),
  description: text("description").notNull(),
  techStack: text("tech_stack").array().notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  priceRaw: integer("price_raw").notNull(),
  thumbnail: text("thumbnail"),
  screenshots: text("screenshots").array(),
  demoLink: text("demo_link"),
  category: varchar("category", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Extension = typeof extensions.$inferSelect;
export type NewExtension = typeof extensions.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Screenshot = typeof screenshots.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Collection = typeof collections.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type SourceCode = typeof sourceCodes.$inferSelect;
export type NewSourceCode = typeof sourceCodes.$inferInsert;
