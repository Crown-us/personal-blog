import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extensions, analyticsEvents, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "affiliate"; // 'affiliate' or 'install'

  const referrer = request.headers.get("referer") || null;
  const countryCode = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "ID";

  try {
    // 1. Fetch extension details by slug
    const ext = await db.query.extensions.findFirst({
      where: eq(extensions.slug, slug),
    });

    if (!ext) {
      return NextResponse.json({ error: "Extension not found" }, { status: 404 });
    }

    // 2. Identify destination URL
    let destinationUrl = "";
    if (type === "install") {
      destinationUrl = ext.chromeStoreUrl || ext.affiliateUrl || ext.websiteUrl || "#";
    } else {
      destinationUrl = ext.affiliateUrl || ext.chromeStoreUrl || ext.websiteUrl || "#";
    }

    // Ensure URL has protocol
    if (destinationUrl && !destinationUrl.startsWith("http") && destinationUrl !== "#") {
      destinationUrl = `https://${destinationUrl}`;
    }

    // 3. Attempt to fetch current logged-in user if available to link session
    let loggedInUserId: string | null = null;
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Find user by email in database
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });
        // We can just use the user ID directly if it maps to auth.users or db users
        loggedInUserId = user.id;
      }
    } catch (authErr) {
      // Ignore auth error in redirect route
    }

    // 4. Log the click/install event in the analytics table
    try {
      await db.insert(analyticsEvents).values({
        extensionId: ext.id,
        eventType: type === "install" ? "click_install" : "click_affiliate",
        sessionId: request.cookies.get("sb-access-token")?.value?.substring(0, 100) || null,
        userId: loggedInUserId,
        referrer: referrer ? referrer.substring(0, 500) : null,
        countryCode: countryCode.substring(0, 2).toUpperCase() as any,
      });
      
      // Also increment click count on the extension record directly
      await db.update(extensions)
        .set({ 
          clickCount: (ext.clickCount || 0) + 1,
          totalInstalls: type === "install" ? (ext.totalInstalls || 0) + 1 : ext.totalInstalls
        })
        .where(eq(extensions.id, ext.id));
        
    } catch (logError) {
      console.error("Failed to log redirect analytics event:", logError);
    }

    // 5. Redirect to destination URL
    return NextResponse.redirect(destinationUrl);
  } catch (error: any) {
    console.error("Redirect handler error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
