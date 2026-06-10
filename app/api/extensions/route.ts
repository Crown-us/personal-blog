import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extensions, categories, users } from "@/lib/db/schema";
import { eq, and, desc, like, or } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

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

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user in our DB first
    let dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email!),
    });

    if (!dbUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          avatarUrl: user.user_metadata?.avatar_url || null,
          role: "user",
          plan: "free",
        })
        .returning();
      dbUser = newUser;
    }

    const body = await req.json();
    const {
      name,
      tagline,
      description,
      chromeStoreUrl,
      websiteUrl,
      category, // Submitted as category slug (e.g. "ai-tools")
      pricingType,
      price,
      tags,
      permissions,
    } = body;

    if (!name || !description || !chromeStoreUrl) {
      return NextResponse.json(
        { success: false, error: "Name, description, and Chrome Store URL are required" },
        { status: 400 }
      );
    }

    // Find category ID from the category slug
    let categoryId = null;
    if (category) {
      const foundCategory = await db.query.categories.findFirst({
        where: eq(categories.slug, category),
      });
      if (foundCategory) {
        categoryId = foundCategory.id;
      }
    }

    // Generate unique slug
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const existing = await db.query.extensions.findFirst({
      where: eq(extensions.slug, slugBase),
    });
    const finalSlug = existing ? `${slugBase}-${Date.now()}` : slugBase;

    // Parse array inputs (tags & permissions can be strings or arrays)
    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const permissionsArray = Array.isArray(permissions)
      ? permissions
      : typeof permissions === "string"
      ? permissions.split(",").map(p => p.trim()).filter(Boolean)
      : [];

    // Extract Chrome Store ID if possible
    let chromeStoreId = null;
    try {
      const match = chromeStoreUrl.match(/\/([a-z]{32})(\?|\/|$)/i);
      if (match) {
        chromeStoreId = match[1];
      }
    } catch (e) {
      console.warn("Failed to extract Chrome Store ID:", e);
    }

    // Insert new extension listing
    const [newExtension] = await db
      .insert(extensions)
      .values({
        slug: finalSlug,
        chromeStoreId,
        name,
        tagline: tagline || "",
        description,
        websiteUrl: websiteUrl || "",
        chromeStoreUrl,
        publisherId: dbUser.id,
        categoryId,
        status: "pending", // Audit status starts as pending
        pricingType: pricingType || "free",
        price: price ? price.toString() : null,
        tags: tagsArray,
        permissions: permissionsArray,
        logoUrl: "🧩", // Default emoji logo placeholder
      })
      .returning();

    return NextResponse.json({ success: true, extension: newExtension });
  } catch (error: any) {
    console.error("Failed to submit extension:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
