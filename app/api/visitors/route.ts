import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Query total page views
    const [result] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, "view"));

    const totalViews = result?.count || 0;

    return NextResponse.json({ success: true, count: totalViews });
  } catch (error: any) {
    console.error("Failed to fetch visitors count:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { referrer } = body;

    // Record new view event
    await db.insert(analyticsEvents).values({
      eventType: "view",
      referrer: referrer || null,
    });

    // Query updated total page views count
    const [result] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, "view"));

    const totalViews = result?.count || 0;

    return NextResponse.json({ success: true, count: totalViews });
  } catch (error: any) {
    console.error("Failed to record visitor view:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
