import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extensions, categories } from "@/lib/db/schema";
import { eq, and, desc, like, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const categorySlug = url.searchParams.get("category");
    const isFeatured = url.searchParams.get("featured");
    const status = url.searchParams.get("status") || "approved"; // Default to only approved extensions
    const query = url.searchParams.get("q");

    const conditions = [];

    if (status !== "all") {
      conditions.push(eq(extensions.status, status as any));
    }

    if (isFeatured === "true") {
      conditions.push(eq(extensions.isFeatured, true));
    }

    if (query) {
      conditions.push(
        or(
          like(extensions.name, `%${query}%`),
          like(extensions.tagline, `%${query}%`),
          like(extensions.description, `%${query}%`)
        )
      );
    }

    let queryBuilder = db
      .select({
        id: extensions.id,
        slug: extensions.slug,
        chromeStoreId: extensions.chromeStoreId,
        name: extensions.name,
        tagline: extensions.tagline,
        description: extensions.description,
        logoUrl: extensions.logoUrl,
        websiteUrl: extensions.websiteUrl,
        affiliateUrl: extensions.affiliateUrl,
        chromeStoreUrl: extensions.chromeStoreUrl,
        publisherId: extensions.publisherId,
        categoryId: extensions.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        status: extensions.status,
        isFeatured: extensions.isFeatured,
        isSponsored: extensions.isSponsored,
        version: extensions.version,
        totalUsers: extensions.totalUsers,
        weeklyUsers: extensions.weeklyUsers,
        avgRating: extensions.avgRating,
        totalReviews: extensions.totalReviews,
        totalInstalls: extensions.totalInstalls,
        pricingType: extensions.pricingType,
        price: extensions.price,
        createdAt: extensions.createdAt,
      })
      .from(extensions)
      .leftJoin(categories, eq(extensions.categoryId, categories.id));

    if (categorySlug) {
      conditions.push(eq(categories.slug, categorySlug));
    }

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions)) as any;
    }

    const list = await queryBuilder.orderBy(desc(extensions.weeklyUsers));

    return NextResponse.json({ success: true, extensions: list });
  } catch (error: any) {
    console.error("Failed to fetch extensions:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
