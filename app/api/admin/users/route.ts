import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

// 1. GET: Fetch all users (Admin only)
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

    const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ success: true, users: allUsers });
  } catch (error: any) {
    console.error("Failed to fetch admin users list:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. PATCH: Update user role and plan (Admin only)
export async function PATCH(req: NextRequest) {
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
    const { userId, role, plan } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // Ensure they don't lock themselves out by changing their own admin role
    if (userId === dbCurrentUser.id && role !== "admin") {
      return NextResponse.json({ success: false, error: "Cannot revoke your own admin role" }, { status: 400 });
    }

    const updated = await db
      .update(users)
      .set({
        role: role as any,
        plan: plan as any,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated[0] });
  } catch (error: any) {
    console.error("Failed to update user access:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Remove user (Admin only)
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
    const userId = url.searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    if (userId === dbCurrentUser.id) {
      return NextResponse.json({ success: false, error: "Cannot delete your own account" }, { status: 400 });
    }

    const deleted = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete user profile:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
