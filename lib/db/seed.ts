import { db } from "./index";
import { categories, extensions, screenshots, reviews, sourceCodes, users } from "./schema";
import { mockExtensions, mockSourceCodes, mockReviews } from "../../config/mock-data";
import { categories as mockCategories } from "../../config/categories";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🚀 Starting database seeding...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  try {
    // 1. Clean up existing tables
    console.log("🧹 Cleaning up existing tables...");
    await db.execute(
      sql`TRUNCATE TABLE reviews, screenshots, collection_extensions, collections, blog_posts, analytics_events, saved_comparisons, subscriptions, extensions, source_codes, categories, users RESTART IDENTITY CASCADE`
    );
    console.log("✅ Database tables cleared successfully.");

    // 2. Create an admin/publisher user
    console.log("👤 Creating admin/publisher user...");
    const [adminUser] = await db
      .insert(users)
      .values({
        email: "admin@roketdev.com",
        fullName: "RoketDev Team",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
        role: "admin",
        plan: "pro",
      })
      .returning();
    console.log(`✅ Admin user created: ${adminUser.fullName} (${adminUser.id})`);

    // 3. Seed Categories
    console.log("📁 Seeding categories...");
    const categoryMap = new Map<string, string>(); // Maps slug to database UUID

    for (const mockCat of mockCategories) {
      const [dbCat] = await db
        .insert(categories)
        .values({
          slug: mockCat.slug,
          name: mockCat.name,
          description: mockCat.description,
          iconName: mockCat.icon,
          color: mockCat.color,
          gradient: mockCat.gradient,
        })
        .returning();
      
      categoryMap.set(mockCat.slug, dbCat.id);
    }
    console.log(`✅ Seeded ${categoryMap.size} categories.`);

    // 4. Seed Extensions & Screenshots & Reviews
    console.log("🧩 Seeding extensions, screenshots, and reviews...");
    let extensionCount = 0;
    let screenshotCount = 0;
    let reviewCount = 0;

    for (const mockExt of mockExtensions) {
      const categoryId = categoryMap.get(mockExt.categorySlug || "") || null;

      // Insert extension
      const [dbExt] = await db
        .insert(extensions)
        .values({
          slug: mockExt.slug,
          chromeStoreId: mockExt.chromeStoreId,
          name: mockExt.name,
          tagline: mockExt.tagline,
          description: mockExt.description,
          logoUrl: mockExt.logoUrl,
          websiteUrl: mockExt.websiteUrl,
          affiliateUrl: mockExt.affiliateUrl,
          chromeStoreUrl: mockExt.chromeStoreUrl || "",
          publisherId: adminUser.id,
          categoryId: categoryId,
          status: mockExt.status as any,
          isFeatured: mockExt.isFeatured || false,
          isSponsored: mockExt.isSponsored || false,
          version: mockExt.version,
          totalUsers: mockExt.totalUsers || 0,
          weeklyUsers: mockExt.weeklyUsers || 0,
          avgRating: mockExt.avgRating?.toString() || "0",
          totalReviews: mockExt.totalReviews || 0,
          totalInstalls: mockExt.totalInstalls || 0,
          clickCount: mockExt.clickCount || 0,
          metaTitle: mockExt.metaTitle,
          metaDescription: mockExt.metaDescription,
          tags: mockExt.tags,
          permissions: mockExt.permissions,
          pricingType: mockExt.pricingType as any,
          price: mockExt.price?.toString() || null,
        })
        .returning();

      extensionCount++;

      // Insert screenshots for this extension
      if (mockExt.screenshots && mockExt.screenshots.length > 0) {
        for (const screen of mockExt.screenshots) {
          await db.insert(screenshots).values({
            extensionId: dbExt.id,
            url: screen.url,
            altText: screen.altText,
            sortOrder: screen.sortOrder || 0,
          });
          screenshotCount++;
        }
      }

      // Insert reviews for this extension (if any exist in mockReviews)
      const extReviews = mockReviews[mockExt.id];
      if (extReviews && extReviews.length > 0) {
        for (const review of extReviews) {
          // Check if there is an existing review for this user-ext combo (unique constraint)
          try {
            await db.insert(reviews).values({
              extensionId: dbExt.id,
              userId: adminUser.id, // Using adminUser as reviewer for simplicity
              rating: review.rating,
              title: review.title,
              body: review.body,
              pros: review.pros,
              cons: review.cons,
              verified: review.verified || false,
              helpfulVotes: review.helpfulVotes || 0,
              status: "approved",
            });
            reviewCount++;
          } catch (err) {
            // Skip duplicates in seeding if any
          }
        }
      }
    }

    console.log(`✅ Seeded ${extensionCount} extensions, ${screenshotCount} screenshots, and ${reviewCount} reviews.`);

    // 5. Seed Source Codes
    console.log("💻 Seeding source codes...");
    let sourceCodeCount = 0;

    for (const mockSc of mockSourceCodes) {
      await db.insert(sourceCodes).values({
        slug: mockSc.slug,
        name: mockSc.name,
        tagline: mockSc.tagline,
        description: mockSc.description,
        techStack: mockSc.techStack,
        price: mockSc.price,
        priceRaw: mockSc.priceRaw,
        thumbnail: mockSc.thumbnail,
        screenshots: mockSc.screenshots,
        demoLink: mockSc.demoLink,
        category: mockSc.category,
      });
      sourceCodeCount++;
    }

    console.log(`✅ Seeded ${sourceCodeCount} source code templates.`);
    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  }
}

main();
