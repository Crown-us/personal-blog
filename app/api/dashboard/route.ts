import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extensions, users, blogPosts, analyticsEvents } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get or create database user record
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

    // 3. Get affiliate click events (Admin only)
    let affiliateEvents: any[] = [];
    if (isAdmin) {
      try {
        affiliateEvents = await db
          .select({
            id: analyticsEvents.id,
            createdAt: analyticsEvents.createdAt,
            eventType: analyticsEvents.eventType,
            countryCode: analyticsEvents.countryCode,
            extensionId: extensions.id,
            extensionName: extensions.name,
            extensionLogo: extensions.logoUrl,
            extensionSlug: extensions.slug,
            affiliateUrl: extensions.affiliateUrl,
          })
          .from(analyticsEvents)
          .leftJoin(extensions, eq(analyticsEvents.extensionId, extensions.id))
          .where(inArray(analyticsEvents.eventType, ["click_install", "click_affiliate"]))
          .orderBy(desc(analyticsEvents.createdAt));
      } catch (err) {
        console.error("Error fetching analytics events for admin:", err);
      }
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
      affiliateEvents: affiliateEvents,
    });
  } catch (error: any) {
    console.error("Failed to load dashboard data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
