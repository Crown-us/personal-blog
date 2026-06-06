"use client";

import React, { useState } from "react";
import Link from "next/link";
import ExtensionCard from "@/components/shared/ExtensionCard";
import CompareTray from "@/components/shared/CompareTray";
import { useCompare } from "@/hooks/useCompare";
import { mockExtensions, mockSourceCodes, mockBlogPosts } from "@/config/mock-data";
import { categories } from "@/config/categories";
import { Search, Bot, Zap, Shield, Code2, PenLine, Sparkles, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const [searchQuery, setSearchQuery] = useState("");
  const { language, t, dict, tExtension, tSourceCode, tBlog } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Icon mapping for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot": return <Bot className="h-4 w-4" />;
      case "Zap": return <Zap className="h-4 w-4" />;
      case "Shield": return <Shield className="h-4 w-4" />;
      case "Code2": return <Code2 className="h-4 w-4" />;
      case "PenLine": return <PenLine className="h-4 w-4" />;
      case "GraduationCap": return <GraduationCap className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTranslatedCategoryName = (name: string) => {
    if (language === "en") return name;
    switch (name) {
      case "AI Tools": return "Alat AI";
      case "Productivity": return "Produktivitas";
      case "Privacy & Security": return "Privasi & Keamanan";
      case "Developer Tools": return "Alat Developer";
      case "Writing": return "Penulisan";
      case "Design": return "Desain";
      case "Shopping": return "Belanja";
      case "News & Reading": return "Berita & Bacaan";
      case "Research & Learning": return "Riset & Pembelajaran";
      default: return name;
    }
  };

  const featuredExtensions = mockExtensions.filter((e) => e.isFeatured).map(tExtension);
  const popularExtensions = mockExtensions.filter((e) => !e.isFeatured).map(tExtension);
  const translatedSourceCodes = mockSourceCodes.slice(0, 3).map(tSourceCode);
  const translatedBlogPosts = mockBlogPosts.slice(0, 3).map(tBlog);

  const trendingTerms = language === "id"
    ? ["Pemblokir iklan", "ChatGPT", "Asisten menulis", "Privasi"]
    : ["Ad blocker", "ChatGPT", "Writing assistant", "Privacy"];

  return (
    <PageWrapper>

      {/* Search Header Section */}
      <section className="bg-secondary/40 border-b border-border py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4">
              {t({
                id: "Temukan devtools dan plugin untuk memodifikasi workspace Anda",
                en: "Find devtools and plugins to customize your workspace"
              })}
            </h1>

            {/* Search Input Bar */}
            <form 
              onSubmit={handleSearchSubmit}
              className="flex items-center p-1 rounded-xl border border-border bg-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm max-w-2xl"
            >
              <div className="pl-3 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder={t({
                  id: "Cari devtools, kategori, atau pembuat...",
                  en: "Search devtools, categories, or creators..."
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2.5 px-3 text-xs focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all"
              >
                {t({ id: "Cari", en: "Search" })}
              </button>
            </form>

            {/* Category Shortcuts under search */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground mr-1.5 font-medium">{t({ id: "Kategori:", en: "Categories:" })}</span>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {getTranslatedCategoryName(cat.name)}
                </Link>
              ))}
            </div>

            {/* Popular searches shortcut */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="font-semibold">{t({ id: "Sedang Tren:", en: "Trending:" })}</span>
              {trendingTerms.map((tTerm) => (
                <button
                  key={tTerm}
                  onClick={() => {
                    setSearchQuery(tTerm);
                    router.push(`/search?q=${encodeURIComponent(tTerm)}`);
                  }}
                  className="hover:text-foreground hover:underline"
                >
                  {tTerm}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Main Browse Section */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Layout: Sidebar Categories + Extension Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Category Sidebar */}
          <aside className="space-y-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1.5">
              {dict["common.browseCategories"]}
            </h2>
            <nav className="flex flex-col gap-1">
              <Link
                href="/extensions"
                className="text-xs font-semibold py-2 px-3 rounded-lg hover:bg-secondary text-foreground flex items-center gap-2 border border-transparent"
              >
                🧩 {t({ id: "Semua DevTools", en: "All DevTools" })}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="text-xs font-medium py-2 px-3 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground flex items-center justify-between border border-transparent"
                >
                  <span className="flex items-center gap-2">
                    {getCategoryIcon(cat.icon)}
                    {getTranslatedCategoryName(cat.name)}
                  </span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Right Lists (Featured & Popular) */}
          <div className="lg:col-span-3 space-y-10">
            
            {/* Featured Extensions grid */}
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-5">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  ✦ {dict["common.featured"]}
                </h2>
                <Link href="/extensions" className="text-xs text-primary hover:underline font-semibold">
                  {dict["common.seeAll"]}
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredExtensions.map((ext) => (
                  <ExtensionCard
                    key={ext.id}
                    extension={ext}
                    onCompareToggle={toggleCompare}
                    isComparing={compareIds.includes(ext.id)}
                  />
                ))}
              </div>
            </div>

            {/* Popular Extensions grid */}
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-5">
                <h2 className="text-sm font-bold text-foreground">
                  🔥 {dict["common.popular"]}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularExtensions.map((ext) => (
                  <ExtensionCard
                    key={ext.id}
                    extension={ext}
                    onCompareToggle={toggleCompare}
                    isComparing={compareIds.includes(ext.id)}
                  />
                ))}
              </div>
            </div>

            {/* 🔥 Popular Source Codes */}
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-5">
                <h2 className="text-sm font-bold text-foreground">
                  🔥 {dict["common.popularSourceCode"]}
                </h2>
                <Link href="/source-code" className="text-xs text-primary hover:underline font-semibold">
                  {dict["common.seeAll"]}
                </Link>
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {translatedSourceCodes.map((code) => (
                  <motion.div 
                    key={code.id} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -5, 
                      scale: 1.015,
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" 
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      mass: 0.8
                    }}
                    className="market-card flex flex-col justify-between rounded-xl p-4 transition-colors border border-border bg-card"
                  >
                    <div>
                      <div className="flex gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/80 border border-border text-2xl font-bold">
                          {code.thumbnail}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <Link 
                            href={`/source-code/${code.slug}`}
                            className="block font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
                          >
                            {code.name}
                          </Link>
                          <span className="block text-[11px] text-muted-foreground truncate">
                            {code.techStack.join(" + ")}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed h-[34px]">
                        {code.tagline}
                      </p>

                      <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="font-bold text-foreground text-xs">{code.price}</span>
                        <span className="text-border">•</span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {t({ id: "Rp50K - Rp100K", en: "$4.00 - $7.00" })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex gap-2">
                      <Link
                        href={`/source-code/${code.slug}`}
                        className="flex-1 text-center text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all"
                      >
                        {dict["common.viewDetails"]}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Curated Developer Resource Bundles */}
            <div className="pt-2">
              <div className="border-b border-border/80 pb-2.5 mb-5">
                <h2 className="text-sm font-bold text-foreground">
                  📂 {dict["common.bundles"]}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors shadow-sm">
                  <h3 className="font-bold text-xs text-foreground">🤖 {t({ id: "Peralatan Coding AI", en: "AI Coding Toolkit" })}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    {t({
                      id: "Asisten AI utama yang berpusat pada pengembang termasuk ChatGPT Sidebar, Ekstensi Claude, dan pendamping Copilot.",
                      en: "Top developer-centric AI assistants including ChatGPT Sidebar, Claude Extension, and Copilot companions."
                    })}
                  </p>
                  <Link href="/extensions?category=ai-tools" className="inline-block text-[11px] font-semibold text-primary hover:underline mt-3">
                    {t({ id: "Lihat 3 sumber daya →", en: "View 3 resources →" })}
                  </Link>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors shadow-sm">
                  <h3 className="font-bold text-xs text-foreground">💻 {t({ id: "Esensial Developer", en: "Developer Essentials" })}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    {t({
                      id: "Alat inti untuk inspeksi frontend, analisis kinerja, dan pemformatan JSON yang bersih.",
                      en: "Core tools for frontend inspection, performance analysis, and clean JSON formatting."
                    })}
                  </p>
                  <Link href="/extensions?category=developer-tools" className="inline-block text-[11px] font-semibold text-primary hover:underline mt-3">
                    {t({ id: "Lihat 3 sumber daya →", en: "View 3 resources →" })}
                  </Link>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors shadow-sm">
                  <h3 className="font-bold text-xs text-foreground">⚡ {t({ id: "Tumpukan Produktivitas", en: "Productivity Stack" })}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    {t({
                      id: "Percepat alur kerja pengembangan Anda dengan penulisan cerdas, pemeriksaan bahasa, dan berbagi video Loom instan.",
                      en: "Accelerate your dev workflows with smart writing, language linting, and instant Loom video sharing."
                    })}
                  </p>
                  <Link href="/extensions?category=writing" className="inline-block text-[11px] font-semibold text-primary hover:underline mt-3">
                    {t({ id: "Lihat 3 sumber daya →", en: "View 3 resources →" })}
                  </Link>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors shadow-sm">
                  <h3 className="font-bold text-xs text-foreground">🛡️ {t({ id: "Esensial Privasi", en: "Privacy Essentials" })}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    {t({
                      id: "Amankan lingkungan browser Anda, blokir skrip pelacak, dan kelola atribut sesi cookie.",
                      en: "Secure your browser environment, block tracking scripts, and manage session cookie attributes."
                    })}
                  </p>
                  <Link href="/extensions?category=privacy-security" className="inline-block text-[11px] font-semibold text-primary hover:underline mt-3">
                    {t({ id: "Lihat 3 sumber daya →", en: "View 3 resources →" })}
                  </Link>
                </div>
              </div>
            </div>

            {/* 📰 Latest Tutorials */}
            <div className="pt-2">
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-5">
                <h2 className="text-sm font-bold text-foreground">
                  📰 {dict["common.tutorials"]}
                </h2>
                <Link href="/blog" className="text-xs text-primary hover:underline font-semibold">
                  {dict["common.seeAll"]}
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {translatedBlogPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    className="market-card block rounded-xl p-4 hover:border-primary/50 transition-colors"
                  >
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/5 px-2 py-0.5 rounded border border-primary/10 font-medium">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-xs text-foreground mt-2.5 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(post.publishedAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Compare Drawer */}
      <CompareTray 
        compareIds={compareIds}
        onRemove={toggleCompare}
        onClear={clearCompare}
      />
    </PageWrapper>
  );
}
