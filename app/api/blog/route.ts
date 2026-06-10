import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const authorId = url.searchParams.get("authorId");

    let posts;
    if (authorId) {
      posts = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.authorId, authorId))
        .orderBy(desc(blogPosts.createdAt));
    } else {
      posts = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));
    }

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user in our Drizzle db first to ensure foreign key constraint
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
    const { title, excerpt, content, coverImageUrl, categorySlug, status, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug is unique, append timestamp if duplicate
    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
    });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    // Estimate reading time (approx 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const [newPost] = await db
      .insert(blogPosts)
      .values({
        slug: finalSlug,
        title,
        excerpt: excerpt || "",
        content,
        coverImageUrl: coverImageUrl || "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=60",
        authorId: dbUser.id,
        categorySlug: categorySlug || "general",
        status: status || "draft",
        readingTimeMinutes,
        tags: tags || [],
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
