import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/auth/supabase";
import { promises as fs } from "fs";
import path from "path";

// GET: List all files in public/deals
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

    const dirPath = path.join(process.cwd(), "public", "deals");
    
    // Ensure directory exists
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }

    const files = await fs.readdir(dirPath);
    const images = [];

    for (const file of files) {
      // Filter out non-image files
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        images.push({
          name: file,
          url: `/deals/${file}`,
          sizeBytes: stats.size,
          createdAt: stats.mtime,
        });
      }
    }

    // Sort by most recent
    images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("Failed to list deal images:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Upload a new image file to public/deals
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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Verify file is an image
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean and generate filename
    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const nameWithoutExt = path.basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const fileName = `${nameWithoutExt}-${Date.now()}${ext}`;
    const dirPath = path.join(process.cwd(), "public", "deals");
    const filePath = path.join(dirPath, fileName);

    // Ensure directory exists
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      image: {
        name: fileName,
        url: `/deals/${fileName}`,
        sizeBytes: buffer.length,
      }
    });
  } catch (error: any) {
    console.error("Failed to upload deal image:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
