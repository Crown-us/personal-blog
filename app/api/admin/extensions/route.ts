import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extensions, categories, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

// POST: Create a new DevTool / Deal (Admin only)
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify current user is admin
    const dbCurrentUser = await db.query.users.findFirst({
      where: eq(users.email, currentUser.email!),
    });

    if (!dbCurrentUser || dbCurrentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Admins only" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      tagline,
      description,
      logoUrl,
      websiteUrl,
      affiliateUrl,
      chromeStoreUrl,
      pricingType,
      price,
      status,
      categorySlug,
      isFeatured,
    } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: "Name and Description are required" },
        { status: 400 }
      );
    }

    // Find category ID from the category slug
    let categoryId = null;
    if (categorySlug) {
      const foundCategory = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
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

    // Insert new extension listing
    const [newExtension] = await db
      .insert(extensions)
      .values({
        slug: finalSlug,
        name,
        tagline: tagline || "",
        description,
        logoUrl: logoUrl || "",
        websiteUrl: websiteUrl || "",
        affiliateUrl: affiliateUrl || "",
        chromeStoreUrl: chromeStoreUrl || websiteUrl || "",
        publisherId: dbCurrentUser.id,
        categoryId: categoryId,
        status: status || "approved",
        isFeatured: isFeatured || false,
        pricingType: pricingType || "free",
        price: price || null,
      })
      .returning();

    // Get the category details to match the frontend shape
    let categoryName = null;
    if (categoryId) {
      const foundCategory = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId),
      });
      if (foundCategory) {
        categoryName = foundCategory.name;
      }
    }

    const returnedExtension = {
      ...newExtension,
      categoryName,
      categorySlug,
    };

    return NextResponse.json({ success: true, extension: returnedExtension });
  } catch (error: any) {
    console.error("Failed to create extension/deal:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
