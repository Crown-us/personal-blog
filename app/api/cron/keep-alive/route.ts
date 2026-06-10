import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Run a tiny query to verify connection and keep Supabase Postgres active
    await db.execute(sql`SELECT 1`);
    
    return NextResponse.json({
      success: true,
      message: "Database pinged successfully. Supabase is active and awake!",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Database keep-alive cron failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to query database.",
      },
      { status: 500 }
    );
  }
}
