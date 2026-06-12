import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser, createSupabaseServerClient } from "@/lib/auth/supabase";
import path from "path";

// GET: List all files in Supabase Storage bucket "deals"
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

    const supabase = await createSupabaseServerClient();
    
    // List files in "deals" bucket
    const { data: files, error: listError } = await supabase.storage
      .from("deals")
      .list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (listError) {
      throw listError;
    }

    const images = (files || []).map((file) => {
      const { data: { publicUrl } } = supabase.storage
        .from("deals")
        .getPublicUrl(file.name);

      return {
        name: file.name,
        url: publicUrl,
        sizeBytes: file.metadata?.size || 0,
        createdAt: file.created_at ? new Date(file.created_at) : new Date(),
      };
    });

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("Failed to list deal images:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Upload a new image file to Supabase Storage bucket "deals"
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

    const supabase = await createSupabaseServerClient();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("deals")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("deals")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      image: {
        name: fileName,
        url: publicUrl,
        sizeBytes: buffer.length,
      }
    });
  } catch (error: any) {
    console.error("Failed to upload deal image:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
