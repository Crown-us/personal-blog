import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

// Get single blog post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Update blog post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email!),
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User profile not found in database" }, { status: 404 });
    }

    const body = await req.json();
    const { title, excerpt, content, coverImageUrl, categorySlug, status, tags } = body;

    // Check if post exists and belongs to the user
    const existingPost = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.id, id), eq(blogPosts.authorId, dbUser.id)),
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Post not found or you are not authorized to edit this post" },
        { status: 404 }
      );
    }

    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    const readingTimeMinutes = content ? Math.max(1, Math.ceil(wordCount / 200)) : existingPost.readingTimeMinutes;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title;
      // Regenerate slug if title changes
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) {
      updateData.content = content;
      updateData.readingTimeMinutes = readingTimeMinutes;
    }
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    if (categorySlug !== undefined) updateData.categorySlug = categorySlug;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "published" && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (tags !== undefined) updateData.tags = tags;

    const [updatedPost] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email!),
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User profile not found in database" }, { status: 404 });
    }

    // Delete matching post (verifies ownership)
    const result = await db
      .delete(blogPosts)
      .where(and(eq(blogPosts.id, id), eq(blogPosts.authorId, dbUser.id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Post not found or you are not authorized to delete this post" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
