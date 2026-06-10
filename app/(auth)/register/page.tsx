"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  const redirectTo = (searchParams.get("redirectTo") || "/dashboard").trim();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // Handle Credentials Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Check if user is signed in directly (auto-confirm enabled)
      if (data.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setSuccessMsg(
          t({
            id: "Pendaftaran berhasil! Silakan cek email Anda untuk memverifikasi akun Anda.",
            en: "Registration successful! Please check your email inbox to verify your account."
          })
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || t({ id: "Pendaftaran gagal. Silakan coba lagi.", en: "Registration failed. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Registration
  const handleGoogleRegister = async () => {
    setErrorMsg("");
    setOauthLoading(true);

    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || t({ id: "Gagal menghubungkan ke Google.", en: "Failed to connect to Google." }));
      setOauthLoading(false);
    }
  };

  return (
    <PageWrapper>
      <main className="flex-1 flex items-center justify-center relative px-4 py-16 overflow-hidden min-h-[80vh]">
        {/* Neon glowing decorative blobs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card/70 border border-border/80 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col space-y-6 relative"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-1.5">
              <Sparkles className="h-5 w-5 text-primary" />
              {t({ id: "Daftar Akun Baru", en: "Create New Account" })}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t({ id: "Gabung dengan RoketDev dan mulai meluncur.", en: "Join RoketDev and start launching today." })}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 border border-rose-500/20 bg-rose-500/5 text-rose-500 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!successMsg && (
            <>
              {/* Social OAuth Button */}
              <button
                onClick={handleGoogleRegister}
                disabled={oauthLoading || loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/40 transition-all disabled:opacity-50"
              >
                <svg className="h-4 w-4 mr-1 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                {t({ id: "Daftar dengan Google", en: "Sign Up with Google" })}
              </button>

              {/* Separator */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground/60 font-semibold my-2">
                <div className="flex-1 border-t border-border/60" />
                <span>{t({ id: "atau dengan email", en: "or with email" })}</span>
                <div className="flex-1 border-t border-border/60" />
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    {t({ id: "Nama Lengkap", en: "Full Name" })}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    {t({ id: "Email", en: "Email Address" })}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    {t({ id: "Kata Sandi", en: "Password" })}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || oauthLoading}
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  {loading ? t({ id: "Membuat akun...", en: "Creating account..." }) : t({ id: "Daftar Sekarang", en: "Sign Up Now" })}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          )}

          {/* Footer Link */}
          <div className="text-center text-xs text-muted-foreground">
            {t({ id: "Sudah punya akun? ", en: "Already have an account? " })}
            <Link
              href={`/login${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-primary font-bold hover:underline"
            >
              {t({ id: "Masuk disini", en: "Sign in here" })}
            </Link>
          </div>
        </motion.div>
      </main>
    </PageWrapper>
  );
}
