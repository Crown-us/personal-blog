"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { mockSourceCodes } from "@/config/mock-data";
import { Search, Layers, SlidersHorizontal, RefreshCw, X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { motion } from "framer-motion";

export default function SourceCodeMarketplace() {
  const { language, t, dict, tSourceCode } = useLanguage();

  // Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTech("all");
    setSelectedCategory("all");
  };

  const filteredProducts = useMemo(() => {
    return mockSourceCodes
      .map(tSourceCode)
      .filter((code) => {
        const matchesQuery = 
          code.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          code.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          code.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTech = 
          selectedTech === "all" ||
          code.techStack.some((tStack: string) => tStack.toLowerCase() === selectedTech.toLowerCase());

        const matchesCategory = 
          selectedCategory === "all" ||
          code.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchesQuery && matchesTech && matchesCategory;
      });
  }, [searchQuery, selectedTech, selectedCategory, tSourceCode]);

  const categoriesList = [
    { value: "all", label: t({ id: "Semua Tipe", en: "All Types" }) },
    { value: "fullstack", label: t({ id: "Aplikasi Fullstack", en: "Fullstack App" }) },
    { value: "saas", label: "SaaS Boilerplate" },
    { value: "templates", label: t({ id: "Template Website", en: "Website Templates" }) }
  ];

  const getTranslatedCategory = (cat: string) => {
    if (language === "en") return cat;
    switch (cat.toLowerCase()) {
      case "fullstack": return "Aplikasi Fullstack";
      case "saas": return "SaaS Boilerplate";
      case "templates": return "Template Website";
      default: return cat;
    }
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="border-b border-border pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center gap-2">
          <Layers className="h-7 w-7 text-primary" />
          {t({ id: "Marketplace Source Code", en: "Source Code Marketplace" })}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {t({
            id: "Portal dan template source code premium yang terverifikasi pengembang, seharga Rp50.000 hingga Rp100.000.",
            en: "Premium, developer-verified source code portals and templates priced from Rp50.000 to Rp100.000."
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs tracking-wide uppercase text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t({ id: "Filter Teknologi", en: "Tech Filters" })}
            </h2>
            <button 
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              {t({ id: "Atur Ulang", en: "Reset" })}
            </button>
          </div>

          {/* Tech Stack Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t({ id: "Tumpukan Teknologi", en: "Tech Stack" })}
            </h3>
            <div className="flex flex-col gap-1.5">
              {[
                { value: "all", label: t({ id: "Semua Teknologi", en: "All Tech" }) },
                { value: "next.js", label: "Next.js" },
                { value: "react", label: "React" },
                { value: "laravel", label: "Laravel" }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSelectedTech(item.value)}
                  className={`text-left text-xs py-1.5 px-2.5 rounded-lg transition-all ${
                    selectedTech === item.value 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5 border-t border-border pt-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t({ id: "Tipe / Kategori", en: "Type / Category" })}
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

        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md flex items-center p-1 rounded-xl border border-border bg-card">
            <div className="pl-3 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder={t({ id: "Cari source code...", en: "Search source codes..." })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-2 px-3 text-xs focus:outline-none text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Grid listing */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl">
              <p className="text-xs text-muted-foreground">
                {t({ id: "Tidak ada produk source code yang cocok dengan kriteria Anda.", en: "No source code products match your criteria." })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((code) => (
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
                    {/* Header Thumbnail + Info */}
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

                    {/* Tagline */}
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed h-[34px]">
                      {code.tagline}
                    </p>

                    {/* Price and Badges */}
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-foreground">
                      <span className="text-primary font-bold text-sm">{code.price}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {getTranslatedCategory(code.category)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex gap-2">
                    <Link
                      href={`/source-code/${code.slug}`}
                      className="flex-1 text-center text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all"
                    >
                      {dict["common.viewDetails"]}
                    </Link>
                    
                    <a
                      href={code.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground flex items-center gap-1"
                      title="Live Demo"
                    >
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
