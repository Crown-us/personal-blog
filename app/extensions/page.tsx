"use client";

import React, { useState, useMemo } from "react";
import ExtensionCard from "@/components/shared/ExtensionCard";
import CompareTray from "@/components/shared/CompareTray";
import { useCompare } from "@/hooks/useCompare";
import { mockExtensions } from "@/config/mock-data";
import { categories } from "@/config/categories";
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function ExtensionsDirectory() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { language, t, dict, tExtension } = useLanguage();

  const [extensionsList, setExtensionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/extensions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.extensions.length > 0) {
          setExtensionsList(data.extensions);
        } else {
          setExtensionsList(mockExtensions);
        }
      })
      .catch((err) => {
        console.error("Failed to load extensions list:", err);
        setExtensionsList(mockExtensions);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<string>("users-desc");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPricing("all");
    setMinRating(0);
    setSelectedSort("users-desc");
  };

  const getTranslatedCategoryName = (slug: string) => {
    if (language === "en") {
      if (slug === "all") return "All Categories";
      const cat = categories.find(c => c.slug === slug);
      return cat ? cat.name : slug;
    }
    switch (slug) {
      case "all": return "Semua Kategori";
      case "ai-tools": return "Alat AI";
      case "productivity": return "Produktivitas";
      case "privacy-security": return "Privasi & Keamanan";
      case "developer-tools": return "Alat Developer";
      case "writing": return "Penulisan";
      case "design": return "Desain";
      case "shopping": return "Belanja";
      case "news-reading": return "Berita & Bacaan";
      case "research-learning": return "Riset & Pembelajaran";
      case "content-creator": return "Pembuat Konten";
      case "freelancer-toolkit": return "Peralatan Freelancer";
      case "seo-marketing": return "SEO & Pemasaran";
      default: return slug;
    }
  };

  // Perform client side filter & sort
  const filteredExtensions = useMemo(() => {
    return extensionsList
      .map(tExtension)
      .filter((ext) => {
        // Query search
        const matchesQuery = 
          ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ext.tagline && ext.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
          ext.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory = 
          selectedCategory === "all" || 
          ext.categorySlug === selectedCategory;

        // Pricing filter
        const matchesPricing = 
          selectedPricing === "all" || 
          ext.pricingType === selectedPricing;

        // Rating filter
        const matchesRating = 
          parseFloat(ext.avgRating.toString()) >= minRating;

        return matchesQuery && matchesCategory && matchesPricing && matchesRating;
      })
      .sort((a, b) => {
        if (selectedSort === "users-desc") {
          return b.totalUsers - a.totalUsers;
        }
        if (selectedSort === "rating-desc") {
          return parseFloat(b.avgRating.toString()) - parseFloat(a.avgRating.toString());
        }
        if (selectedSort === "reviews-desc") {
          return b.totalReviews - a.totalReviews;
        }
        if (selectedSort === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedPricing, minRating, selectedSort, tExtension]);

  const pricingModels = [
    { value: "all", label: t({ id: "Semua Model Harga", en: "All Pricing Models" }) },
    { value: "free", label: t({ id: "Gratis", en: "Free" }) },
    { value: "freemium", label: "Freemium" },
    { value: "paid", label: t({ id: "Berbayar", en: "Paid" }) },
  ];

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Title / Header */}
        <div className="border-b border-border pb-6 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t({ id: "Sumber Daya Developer Pilihan", en: "Curated Developer Resources" })}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t({
              id: "Alat ekstensi pilihan dan terverifikasi yang dioptimalkan untuk pengembang, kreator, freelancer, dan profesional teknis.",
              en: "Handpicked, verified extension tools optimized for developers, creators, freelancers, and technical professionals."
            })}
          </p>
        </div>

        {/* Directory Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side Filters - Desktop */}
          <aside className="hidden lg:block space-y-6 sticky top-20 self-start">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm tracking-wide uppercase text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {t({ id: "Filter", en: "Filters" })}
              </h2>
              <button 
                onClick={handleResetFilters}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {t({ id: "Atur Ulang", en: "Reset" })}
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {dict["common.browseCategories"]}
              </h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-all ${
                    selectedCategory === "all" 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {t({ id: "Semua Kategori", en: "All Categories" })}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-all ${
                      selectedCategory === cat.slug 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {getTranslatedCategoryName(cat.slug)}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Filter */}
            <div className="space-y-2.5 border-t border-border pt-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t({ id: "Harga", en: "Pricing" })}
              </h3>
              <div className="flex flex-col gap-1.5">
                {pricingModels.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedPricing(item.value)}
                    className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-all ${
                      selectedPricing === item.value 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2.5 border-t border-border pt-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t({ id: "Rating Minimum", en: "Minimum Rating" })}
              </h3>
              <div className="flex flex-col gap-1.5">
                {[0, 4.5, 4.7, 4.9].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-all ${
                      minRating === rating 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {rating === 0 ? t({ id: "Semua Rating", en: "Any Rating" }) : t({ id: `${rating}★ & Ke Atas`, en: `${rating}★ & Above` })}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Sort Panel */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Directory search input */}
              <div className="relative w-full sm:max-w-md flex items-center p-1 rounded-xl border border-border bg-card">
                <div className="pl-3 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder={t({ id: "Filter berdasarkan kata kunci...", en: "Filter by keyword..." })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2 px-3 text-xs focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-muted-foreground hover:text-foreground mr-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {t({ id: "Urutkan:", en: "Sort By:" })}
                </span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="users-desc">{t({ id: "Pengguna (Banyak → Sedikit)", en: "Users (High → Low)" })}</option>
                  <option value="rating-desc">{t({ id: "Rating (Tinggi → Rendah)", en: "Rating (High → Low)" })}</option>
                  <option value="reviews-desc">{t({ id: "Jumlah Ulasan", en: "Reviews Count" })}</option>
                  <option value="newest">{t({ id: "Baru Ditambahkan", en: "Recently Added" })}</option>
                </select>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFiltersMobile(true)}
                  className="lg:hidden p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Active Filters Bar */}
            {(selectedCategory !== "all" || selectedPricing !== "all" || minRating > 0) && (
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="text-muted-foreground">{t({ id: "Filter aktif:", en: "Active filters:" })}</span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 font-medium border border-border">
                    {t({ id: "Kategori", en: "Category" })}: {getTranslatedCategoryName(selectedCategory)}
                    <button onClick={() => setSelectedCategory("all")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedPricing !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 font-medium border border-border">
                    {t({ id: "Harga", en: "Pricing" })}: {selectedPricing === "free" ? t({ id: "Gratis", en: "Free" }) : selectedPricing === "paid" ? t({ id: "Berbayar", en: "Paid" }) : selectedPricing}
                    <button onClick={() => setSelectedPricing("all")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 font-medium border border-border">
                    {minRating}★ & {t({ id: "Ke Atas", en: "Above" })}
                    <button onClick={() => setMinRating(0)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-primary hover:underline ml-2"
                >
                  {t({ id: "Hapus semua", en: "Clear all" })}
                </button>
              </div>
            )}

            {/* Results Grid */}
            {filteredExtensions.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-3xl">
                <p className="text-muted-foreground text-sm">
                  {t({ id: "Tidak ada devtools yang cocok dengan kriteria filter Anda. Coba atur ulang.", en: "No devtools match your filter criteria. Try resetting." })}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  {t({ id: "Atur Ulang Filter", en: "Reset Filters" })}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExtensions.map((ext) => (
                  <ExtensionCard
                    key={ext.id}
                    extension={ext}
                    onCompareToggle={toggleCompare}
                    isComparing={compareIds.includes(ext.id)}
                  />
                ))}
              </div>
            )}

            {/* Info total results count */}
            <div className="text-center text-xs text-muted-foreground border-t border-border/60 pt-6">
              {t({
                id: `Menampilkan ${filteredExtensions.length} dari ${extensionsList.length} devtools.`,
                en: `Showing ${filteredExtensions.length} of ${extensionsList.length} devtools.`
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-background p-6 shadow-2xl flex flex-col h-full justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-bold text-base">{t({ id: "Opsi Filter", en: "Filter Options" })}</h3>
                <button onClick={() => setShowFiltersMobile(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Filter Category */}
              <div className="py-4 space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t({ id: "Kategori", en: "Category" })}
                </h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="all">{t({ id: "Semua Kategori", en: "All Categories" })}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{getTranslatedCategoryName(cat.slug)}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Pricing */}
              <div className="py-4 space-y-2 border-t border-border">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t({ id: "Harga", en: "Pricing" })}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {pricingModels.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setSelectedPricing(p.value)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        selectedPricing === p.value 
                          ? "bg-primary border-primary text-primary-foreground" 
                          : "border-border hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Filter Rating */}
              <div className="py-4 space-y-2 border-t border-border">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Rating
                </h4>
                <div className="flex flex-col gap-1.5">
                  {[0, 4.5, 4.7, 4.9].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`text-left text-xs py-2 px-2.5 rounded-lg ${
                        minRating === r ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      {r === 0 ? t({ id: "Semua Rating", en: "Any Rating" }) : t({ id: `${r}★ & Ke Atas`, en: `${r}★ & Above` })}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFiltersMobile(false)}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground text-center mt-6"
            >
              {t({ id: "Terapkan Filter", en: "Apply Filters" })}
            </button>
          </div>
        </div>
      )}

      {/* Compare Drawer */}
      <CompareTray 
        compareIds={compareIds}
        onRemove={toggleCompare}
        onClear={clearCompare}
      />
    </PageWrapper>
  );
}
