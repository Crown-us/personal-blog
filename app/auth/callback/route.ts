import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // If next parameter exists, redirect there, otherwise fallback to dashboard
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      const user = data.user;
      
      try {
        // Synchronize Supabase Auth user with our Drizzle users table
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (!existingUser) {
          const isAdminEmail = user.email === "wijaya.kevinn@gmail.com";
          await db.insert(users).values({
            email: user.email!,
            fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            avatarUrl: user.user_metadata?.avatar_url || null,
            role: isAdminEmail ? "admin" : "user",
            plan: isAdminEmail ? "pro" : "free",
          });
          console.log(`Synced new user profile to DB: ${user.email}`);
        }
      } catch (dbError) {
        console.error("Failed to sync authenticated user to database:", dbError);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
