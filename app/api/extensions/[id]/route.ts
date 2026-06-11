import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extensions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get database user
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email!),
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    // Load extension to check ownership
    const ext = await db.query.extensions.findFirst({
      where: eq(extensions.id, id),
    });

    if (!ext) {
      return NextResponse.json({ success: false, error: "Extension not found" }, { status: 404 });
    }

    const isAdmin = dbUser.role === "admin";
    const isOwner = ext.publisherId === dbUser.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { 
      status, 
      isFeatured, 
      isSponsored,
      name,
      tagline,
      description,
      logoUrl,
      websiteUrl,
      affiliateUrl,
      chromeStoreUrl,
      pricingType,
      price
    } = body;

    const updateData: any = {};
    
    // Only Admin can change audit status, featured, or sponsored flags
    if (isAdmin) {
      if (status !== undefined) updateData.status = status;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (isSponsored !== undefined) updateData.isSponsored = isSponsored;
      if (name !== undefined) updateData.name = name;
      if (tagline !== undefined) updateData.tagline = tagline;
      if (description !== undefined) updateData.description = description;
      if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
      if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
      if (affiliateUrl !== undefined) updateData.affiliateUrl = affiliateUrl;
      if (chromeStoreUrl !== undefined) updateData.chromeStoreUrl = chromeStoreUrl;
      if (pricingType !== undefined) updateData.pricingType = pricingType;
      if (price !== undefined) updateData.price = price;
    } else {
      return NextResponse.json({ success: false, error: "Only admin can audit submissions" }, { status: 403 });
    }

    const [updated] = await db
      .update(extensions)
      .set(updateData)
      .where(eq(extensions.id, id))
      .returning();

    return NextResponse.json({ success: true, extension: updated });
  } catch (error: any) {
    console.error("Failed to update extension:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email!),
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const ext = await db.query.extensions.findFirst({
      where: eq(extensions.id, id),
    });

    if (!ext) {
      return NextResponse.json({ success: false, error: "Extension not found" }, { status: 404 });
    }

    const isAdmin = dbUser.role === "admin";
    const isOwner = ext.publisherId === dbUser.id;

    // Both Admin and Developer Owner can delete submissions
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await db.delete(extensions).where(eq(extensions.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete extension:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
