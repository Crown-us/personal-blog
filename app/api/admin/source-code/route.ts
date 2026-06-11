import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sourceCodes, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";

// 1. POST: Create a new Source Code listing (Admin only)
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
    const { name, tagline, description, techStack, price, priceRaw, thumbnail, demoLink, category, screenshots } = body;

    if (!name || !description || !techStack || !price || priceRaw === undefined || !category) {
      return NextResponse.json(
        { success: false, error: "Name, Description, Tech Stack, Price, Price Raw, and Category are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug is unique, append timestamp if duplicate
    const existing = await db.query.sourceCodes.findFirst({
      where: eq(sourceCodes.slug, slug),
    });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const [newProduct] = await db
      .insert(sourceCodes)
      .values({
        slug: finalSlug,
        name,
        tagline: tagline || "",
        description,
        techStack: Array.isArray(techStack) ? techStack : techStack.split(",").map((t: string) => t.trim()),
        price,
        priceRaw: parseInt(priceRaw, 10),
        thumbnail: thumbnail || "💻",
        demoLink: demoLink || "",
        category,
        screenshots: Array.isArray(screenshots) ? screenshots : (screenshots ? screenshots.split(",").map((s: string) => s.trim()) : []),
      })
      .returning();

    return NextResponse.json({ success: true, sourceCode: newProduct });
  } catch (error: any) {
    console.error("Failed to create source code:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. PATCH: Update an existing Source Code listing (Admin only)
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
    const { id, name, tagline, description, techStack, price, priceRaw, thumbnail, demoLink, category, screenshots } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Source Code ID is required" }, { status: 400 });
    }

    // Generate slug from name if name changed
    let updatedFields: any = {
      tagline,
      description,
      price,
      priceRaw: priceRaw !== undefined ? parseInt(priceRaw, 10) : undefined,
      thumbnail,
      demoLink,
      category,
      updatedAt: new Date(),
    };

    if (name) {
      updatedFields.name = name;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const existing = await db.query.sourceCodes.findFirst({
        where: eq(sourceCodes.slug, slug),
      });
      updatedFields.slug = existing && existing.id !== id ? `${slug}-${Date.now()}` : slug;
    }

    if (techStack) {
      updatedFields.techStack = Array.isArray(techStack) ? techStack : techStack.split(",").map((t: string) => t.trim());
    }

    if (screenshots !== undefined) {
      updatedFields.screenshots = Array.isArray(screenshots) ? screenshots : (screenshots ? screenshots.split(",").map((s: string) => s.trim()) : []);
    }

    const updated = await db
      .update(sourceCodes)
      .set(updatedFields)
      .where(eq(sourceCodes.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Source code not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, sourceCode: updated[0] });
  } catch (error: any) {
    console.error("Failed to update source code:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Remove a Source Code listing (Admin only)
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
      return NextResponse.json({ success: false, error: "Source Code ID is required" }, { status: 400 });
    }

    const deleted = await db
      .delete(sourceCodes)
      .where(eq(sourceCodes.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ success: false, error: "Source code not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Source code deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete source code listing:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
