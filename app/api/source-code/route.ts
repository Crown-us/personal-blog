import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sourceCodes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const list = await db
      .select()
      .from(sourceCodes)
      .orderBy(desc(sourceCodes.createdAt));

    return NextResponse.json({ success: true, sourceCodes: list });
  } catch (error: any) {
    console.error("Failed to fetch source codes:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
