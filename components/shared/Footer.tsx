"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/components/LanguageProvider";
import { Rocket, Mail, Send, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const hasVisitedSession = sessionStorage.getItem("has_visited_session");
    const method = hasVisitedSession ? "GET" : "POST";

    fetch("/api/visitors", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: method === "POST" ? JSON.stringify({ referrer: typeof document !== "undefined" ? document.referrer : null }) : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVisitorCount(data.count);
          if (method === "POST") {
            sessionStorage.setItem("has_visited_session", "true");
          }
        }
      })
      .catch((err) => console.error("Failed to load visitor stats:", err));
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <footer className="relative border-t border-neutral-200 dark:border-neutral-900 bg-[#F8FAFC] dark:bg-[#0B0F19] text-neutral-600 dark:text-neutral-400 text-xs mt-16 overflow-hidden">
      {/* Top glowing accent line representing rocket flame gradient similar to laravel.com accent */}
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 via-primary to-indigo-600" />
      
      {/* Ambient glow effect at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-36 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none blur-3xl opacity-30 dark:opacity-100" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-neutral-200 dark:border-neutral-900">
          
          {/* Column 1: Brand Logo, Description, Newsletter (4 cols span) */}
          <div className="lg:col-span-4 space-y-6 pr-0 lg:pr-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-neutral-900 dark:text-white text-base group">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-red-500 to-primary text-white shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Rocket className="h-4 w-4 fill-current" />
                </span>
                <span className="text-lg font-bold">
                  Roket<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-extrabold">Dev</span>
                </span>
              </Link>
              
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
                {t({
                  id: "RoketDev adalah marketplace dan direktori source code, template website, dan devtools pilihan untuk membantu pengembang, freelancer, dan agensi lokal meluncurkan projek mereka secepat roket.",
                  en: "RoketDev is a curated marketplace and directory of source code, website templates, and devtools helping developers, freelancers, and local agencies launch their projects as fast as a rocket."
                })}
              </p>
            </div>

            {/* Newsletter Subscription Form */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-[10px] text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-primary" />
                <span>{t({ id: "Berlangganan Newsletter", en: "Subscribe to Newsletter" })}</span>
              </h4>
              
              {status === "success" ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {t({
                      id: "Terima kasih! Anda berhasil berlangganan. 🚀",
                      en: "Thank you! You have successfully subscribed. 🚀"
                    })}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t({ id: "Masukkan email Anda", en: "Enter your email address" })}
                    disabled={status === "submitting"}
                    className="bg-white dark:bg-neutral-900/90 border border-neutral-300 dark:border-neutral-800/80 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-[11px] rounded-lg px-3 py-2 w-full transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="shrink-0 p-2 rounded-lg bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons similar to laravel.com (using custom inline SVGs for compatibility) */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={siteConfig.links.twitter} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-lg bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xs dark:shadow-none"
                aria-label="Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href={siteConfig.links.github} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-lg bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-white dark:hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xs dark:shadow-none"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xs dark:shadow-none"
                aria-label="Discord"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.075 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xs dark:shadow-none"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Navigation Links (8 cols span, divided into 4 columns) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Column 2: Products */}
            <div className="space-y-4">
              <h3 className="font-bold text-[10px] text-neutral-900 dark:text-white uppercase tracking-widest">
                {t({ id: "Produk & Direktori", en: "Products & Directory" })}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/extensions" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Cari DevTools", en: "Browse DevTools" })}
                  </Link>
                </li>
                <li>
                  <Link href="/source-code" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Source Code Premium", en: "Premium Source Code" })}
                  </Link>
                </li>
                <li>
                  <Link href="/bundles" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Paket Hemat", en: "Curated Bundles" })}
                  </Link>
                </li>
                <li>
                  <Link href="/showcase" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Showcase Demo", en: "Live Showcases" })}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-4">
              <h3 className="font-bold text-[10px] text-neutral-900 dark:text-white uppercase tracking-widest">
                {t({ id: "Sumber Daya", en: "Resources" })}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/blog" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Tutorial & Blog", en: "Tutorials & Blog" })}
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Kirim Produk", en: "Submit Product" })}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Konsol Penerbit", en: "Publisher Console" })}
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Bandingkan Alat", en: "Compare Tools" })}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Ecosystem */}
            <div className="space-y-4">
              <h3 className="font-bold text-[10px] text-neutral-900 dark:text-white uppercase tracking-widest">
                {t({ id: "Ekosistem", en: "Ecosystem" })}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/categories" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Kategori Pilihan", en: "Featured Categories" })}
                  </Link>
                </li>
                <li>
                  <Link href="/trending" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Produk Tren", en: "Trending Products" })}
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Koleksi Pilihan", en: "Featured Collections" })}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Status Layanan", en: "Service Status" })}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div className="space-y-4">
              <h3 className="font-bold text-[10px] text-neutral-900 dark:text-white uppercase tracking-widest">
                {t({ id: "Legalitas", en: "Rules & Legal" })}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Kebijakan Privasi", en: "Privacy Policy" })}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Syarat Ketentuan", en: "Terms of Service" })}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Kebijakan Cookie", en: "Cookie Policy" })}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-neutral-900 dark:hover:text-white hover:translate-x-0.5 transition-all duration-200 block text-neutral-500 dark:text-neutral-400">
                    {t({ id: "Hubungi Kami", en: "Contact Support" })}
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-neutral-500">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left leading-relaxed">
            <span>
              © {new Date().getFullYear()} RoketDev. {t({ id: "Seluruh hak cipta dilindungi.", en: "All rights reserved." })}
            </span>
            {visitorCount !== null && (
              <>
                <span className="hidden md:inline text-neutral-200 dark:text-neutral-800">|</span>
                <span className="flex items-center gap-1">
                  👁️ {t({ id: "Total Kunjungan:", en: "Total Visits:" })} <strong className="text-neutral-800 dark:text-white font-bold">{visitorCount}</strong>
                </span>
              </>
            )}
            <span className="hidden md:inline text-neutral-200 dark:text-neutral-800">|</span>
            <span>
              {t({
                id: "RoketDev adalah platform direktori independen untuk pengembang software Indonesia.",
                en: "RoketDev is an independent directory platform for Indonesian software developers."
              })}
            </span>
          </div>
          <span className="flex items-center gap-1.5 shrink-0 bg-neutral-200/50 dark:bg-neutral-900/40 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800/30">
            {t({ id: "Dibangun dengan", en: "Built with" })}{" "}
            <span className="text-red-500 animate-pulse">❤️</span>{" "}
            {t({ id: "untuk pengembang lokal", en: "for local developers" })}
          </span>
        </div>

      </div>

      {/* Giant backdrop text wordmark at the very bottom (Laravel style) */}
      {/* Light Mode backdrop: subtle black outline, thicker stroke width (2px), italic */}
      <div 
        className="block dark:hidden select-none pointer-events-none text-center font-black italic tracking-[0.12em] uppercase text-[15vw] leading-none mt-6 text-transparent"
        style={{ WebkitTextStroke: "2px rgba(0, 0, 0, 0.16)", transform: "translateY(25%)" }}
      >
        ROKETDEV
      </div>
      
      {/* Dark Mode backdrop: subtle white outline, thicker stroke width (2px), italic */}
      <div 
        className="hidden dark:block select-none pointer-events-none text-center font-black italic tracking-[0.12em] uppercase text-[15vw] leading-none mt-6 text-transparent"
        style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.16)", transform: "translateY(25%)" }}
      >
        ROKETDEV
      </div>
    </footer>
  );
}
