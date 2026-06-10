import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extensions, users, blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get database user record
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email!),
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User profile not found in database" }, { status: 404 });
    }

    const isAdmin = dbUser.role === "admin";

    // 1. Get submissions (if Admin, fetch ALL submissions; if Regular User, fetch only their own)
    let userExtensions = [];
    if (isAdmin) {
      userExtensions = await db
        .select()
        .from(extensions)
        .orderBy(desc(extensions.createdAt));
    } else {
      userExtensions = await db
        .select()
        .from(extensions)
        .where(eq(extensions.publisherId, dbUser.id))
        .orderBy(desc(extensions.createdAt));
    }

    // 2. Get tutorials (if Admin, fetch ALL; if Regular User, fetch only their own)
    let userBlogs = [];
    if (isAdmin) {
      userBlogs = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));
    } else {
      userBlogs = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.authorId, dbUser.id))
        .orderBy(desc(blogPosts.createdAt));
    }

    return NextResponse.json({
      success: true,
      role: dbUser.role,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
        avatarUrl: dbUser.avatarUrl,
        plan: dbUser.plan,
      },
      extensions: userExtensions,
      blogPosts: userBlogs,
    });
  } catch (error: any) {
    console.error("Failed to load dashboard data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
