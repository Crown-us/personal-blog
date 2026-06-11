import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, users, extensions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

// 1. GET: Fetch all reviews for moderation (Admin only)
export async function GET(req: NextRequest) {
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

    const allReviews = await db
      .select({
        id: reviews.id,
        extensionId: reviews.extensionId,
        userId: reviews.userId,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        pros: reviews.pros,
        cons: reviews.cons,
        verified: reviews.verified,
        status: reviews.status,
        createdAt: reviews.createdAt,
        userName: users.fullName,
        userAvatarUrl: users.avatarUrl,
        extensionName: extensions.name,
        extensionSlug: extensions.slug,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(extensions, eq(reviews.extensionId, extensions.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ success: true, reviews: allReviews });
  } catch (error: any) {
    console.error("Failed to fetch admin reviews:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. DELETE: Remove a review (Admin only)
export async function DELETE(req: NextRequest) {
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

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
    }

    const deleted = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
