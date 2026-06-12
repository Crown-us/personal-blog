"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star, ExternalLink, Sparkles, Percent, Tag, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { motion } from "framer-motion";

export default function DealsPage() {
  const { t, language, dict } = useLanguage();

  const [extensionsList, setExtensionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/extensions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter only those with affiliate links
          const filtered = data.extensions.filter((ext: any) => ext.affiliateUrl);
          setExtensionsList(filtered);
        }
      })
      .catch((err) => {
        console.error("Failed to load deals:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categoriesList = useMemo(() => {
    const categoriesSet = new Set<string>();
    extensionsList.forEach((ext) => {
      if (ext.categorySlug) {
        categoriesSet.add(ext.categorySlug);
      }
    });

    const list = Array.from(categoriesSet).map((slug) => {
      // Humanize category name
      const name = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { value: slug, label: name };
    });

    return [{ value: "all", label: t({ id: "Semua Kategori", en: "All Categories" }) }, ...list];
  }, [extensionsList, t]);

  const filteredDeals = useMemo(() => {
    return extensionsList.filter((ext) => {
      const matchesQuery =
        ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ext.tagline && ext.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ext.description && ext.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || ext.categorySlug === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [extensionsList, searchQuery, selectedCategory]);

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Section */}
        <div className="border-b border-border pb-8 mb-8 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Percent className="h-48 w-48 text-primary" />
          </div>
          
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider bg-primary/5 border border-primary/10 rounded-full px-3 py-1 w-max">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>{t({ id: "Penawaran Eksklusif Pengembang", en: "Curated Developer Tools & Deals" })}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center gap-2">
            <Percent className="h-7 w-7 text-primary" />
            {t({ id: "Penawaran Terbaik & Deals", en: "Premium Developer Deals" })}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t({
              id: "Temukan diskon, uji coba gratis eksklusif, dan penawaran terbaik untuk perkakas serta ekstensi produktivitas yang disaring secara manual oleh tim kami.",
              en: "Find curated discounts, exclusive trials, and recommended offers on developer tools and productivity extensions, manually verified by our team."
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter */}
          <aside className="space-y-6 sticky top-20 self-start">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h2 className="font-bold text-xs tracking-wide uppercase text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {t({ id: "Filter Penawaran", en: "Filter Deals" })}
              </h2>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  {t({ id: "Bersihkan", en: "Clear All" })}
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t({ id: "Kategori Alat", en: "Tool Category" })}
              </h3>
              <div className="flex flex-col gap-1.5">
                {categoriesList.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedCategory(item.value)}
                    className={`text-left text-xs py-1.5 px-2.5 rounded-lg transition-all ${
                      selectedCategory === item.value
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Safety badge */}
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <ShieldCheck className="h-4 w-4" />
                {t({ id: "Terverifikasi Aman", en: "Developer Verified" })}
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {t({
                  id: "Setiap penawaran dijamin aman dan terhubung langsung ke situs resmi produk melalui partner program.",
                  en: "Every listing is manually verified to connect safely to the official product site via partner programs."
                })}
              </p>
            </div>
          </aside>

          {/* Main Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-md flex items-center p-1 rounded-xl border border-border bg-card shadow-xs">
              <div className="pl-3 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder={t({ id: "Cari penawaran...", en: "Search tools or deals..." })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2 px-3 text-xs focus:outline-none text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Loading / Cards Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
                <p className="text-xs text-muted-foreground">
                  {t({ id: "Belum ada penawaran deals yang sesuai kriteria Anda.", en: "No exclusive deals match your criteria currently." })}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="flex flex-col justify-between rounded-2xl p-5 border border-border bg-card/60 backdrop-blur-md shadow-xs hover:shadow-lg transition-all"
                  >
                    <div>
                      {/* Logo and Rating */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/80 border border-border text-2xl font-bold shadow-inner">
                          {deal.logoUrl && (deal.logoUrl.startsWith("http") || deal.logoUrl.startsWith("/")) ? (
                            <img src={deal.logoUrl} alt={deal.name} className="h-full w-full object-cover rounded-2xl" />
                          ) : (
                            deal.logoUrl || "🧩"
                          )}
                        </div>

                        {/* Stars Rating */}
                        <div className="flex items-center gap-1 bg-amber-500/5 px-2 py-1 rounded-lg border border-amber-500/10 text-amber-500 text-[10px] font-bold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>{deal.avgRating ? parseFloat(deal.avgRating).toFixed(1) : "5.0"}</span>
                        </div>
                      </div>

                      {/* Header Info */}
                      <div className="mt-4 space-y-1">
                        <Link href={`/extensions/${deal.slug}`} className="block font-black text-base text-foreground hover:text-primary transition-all">
                          {deal.name}
                        </Link>
                        <span className="inline-block text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/5 border border-primary/10 uppercase tracking-wider capitalize">
                          {deal.categoryName || deal.categorySlug || "Tools"}
                        </span>
                      </div>

                      {/* Tagline / Description */}
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {deal.tagline || deal.description}
                      </p>
                    </div>

                    {/* Bottom CTA Block */}
                    <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                      {/* Pricing Tag */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">{t({ id: "Tipe Pricing", en: "Pricing model" })}</span>
                        <span className="text-xs font-bold text-foreground capitalize">
                          {deal.pricingType === "free" ? t({ id: "Gratis", en: "Free" }) : `$${deal.price}/${t({ id: "bln", en: "mo" })}`}
                        </span>
                      </div>

                      {/* Claim Deal Link */}
                      <a
                        href={`/api/go/${deal.slug}?type=affiliate`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20 cursor-pointer"
                      >
                        {t({ id: "Ambil Penawaran", en: "Claim Deal" })}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>

        </div>

      </main>
    </PageWrapper>
  );
}
