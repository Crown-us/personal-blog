"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { mockExtensions } from "@/config/mock-data";
import { Star, Download, ShieldCheck, Check, X, AlertTriangle, Layers } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

function ComparisonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, tExtension } = useLanguage();
  
  // Get compared IDs from query string (?ids=ext-1,ext-2)
  const idsParam = searchParams.get("ids") || "";
  const comparedIds = useMemo(() => {
    return idsParam ? idsParam.split(",").filter(Boolean) : [];
  }, [idsParam]);

  const [extensionsList, setExtensionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        console.error("Failed to load extensions for comparison:", err);
        setExtensionsList(mockExtensions);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Find corresponding extensions with translation
  const comparedExtensions = useMemo(() => {
    return extensionsList
      .filter((ext) => comparedIds.includes(ext.id))
      .map(tExtension);
  }, [comparedIds, extensionsList, tExtension]);

  // All extensions for replacement dropdowns with translation
  const availableExtensions = useMemo(() => {
    return extensionsList.map(tExtension);
  }, [extensionsList, tExtension]);

  // Change compared extension at index
  const handleReplaceExtension = (index: number, newId: string) => {
    const nextIds = [...comparedIds];
    if (newId === "none") {
      nextIds.splice(index, 1);
    } else {
      nextIds[index] = newId;
    }
    // De-duplicate
    const uniqueIds = Array.from(new Set(nextIds));
    router.push(`/compare?ids=${uniqueIds.join(",")}`);
  };

  const handleAddExtension = (id: string) => {
    if (comparedIds.length >= 3) {
      alert(t({
        id: "Anda hanya dapat membandingkan hingga 3 ekstensi sekaligus.",
        en: "You can compare up to 3 extensions at a time."
      }));
      return;
    }
    if (comparedIds.includes(id)) return;
    const nextIds = [...comparedIds, id];
    router.push(`/compare?ids=${nextIds.join(",")}`);
  };

  return (
    <>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Title */}
        <div className="border-b border-border pb-6 mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center justify-center sm:justify-start gap-2">
            <Layers className="h-7 w-7 text-primary" />
            {t({ id: "Bandingkan Ekstensi", en: "Compare Extensions" })}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t({
              id: "Bandingkan fitur, harga, izin privasi, dan rating berdampingan untuk membuat pilihan tepat.",
              en: "Compare features, pricing, privacy permissions, and ratings side-by-side to make the right choice."
            })}
          </p>
        </div>

        {comparedExtensions.length === 0 ? (
          /* Empty selection state */
          <div className="text-center py-20 border border-dashed border-border rounded-3xl max-w-2xl mx-auto space-y-6">
            <div className="text-4xl">⚖️</div>
            <div>
              <h2 className="text-xl font-bold">{t({ id: "Tidak ada ekstensi yang dipilih untuk dibandingkan", en: "No extensions selected for comparison" })}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t({
                  id: "Pilih hingga 3 ekstensi dari direktori untuk mulai membandingkan.",
                  en: "Choose up to 3 extensions from the directory to start comparing."
                })}
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase block text-left">
                {t({ id: "Pilih ekstensi:", en: "Select an extension:" })}
              </label>
              <select
                onChange={(e) => handleAddExtension(e.target.value)}
                defaultValue=""
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm focus:outline-none text-foreground font-semibold"
              >
                <option value="" disabled>{t({ id: "Pilih pertama...", en: "Choose first..." })}</option>
                {availableExtensions.map((ext) => (
                  <option key={ext.id} value={ext.id}>
                    {ext.logoUrl} {ext.name}
                  </option>
                ))}
              </select>

              <Link
                href="/extensions"
                className="inline-block text-xs text-primary hover:underline font-semibold"
              >
                {t({ id: "Cari di Direktori →", en: "Browse Directory →" })}
              </Link>
            </div>
          </div>
        ) : (
          /* Side by Side Comparison Layout */
          <div className="space-y-8">
            
            {/* Main side-by-side grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
              
              {/* Feature Titles column */}
              <div className="hidden md:flex flex-col justify-between rounded-2xl border border-transparent p-5 bg-card/20">
                <div className="space-y-8 pt-20">
                  <div className="h-10 text-xs font-bold uppercase text-muted-foreground tracking-wider border-b border-border/40 pb-2">
                    {t({ id: "Detail umum", en: "General details" })}
                  </div>
                  <div className="h-8 text-xs font-semibold text-muted-foreground">{t({ id: "Rating", en: "Rating" })}</div>
                  <div className="h-8 text-xs font-semibold text-muted-foreground">{t({ id: "Pengguna aktif mingguan", en: "Weekly active users" })}</div>
                  <div className="h-8 text-xs font-semibold text-muted-foreground">{t({ id: "Model harga", en: "Pricing model" })}</div>
                  <div className="h-8 text-xs font-semibold text-muted-foreground">{t({ id: "Versi ekstensi", en: "Extension version" })}</div>

                  <div className="h-10 text-xs font-bold uppercase text-muted-foreground tracking-wider border-b border-border/40 pb-2 pt-2">
                    {t({ id: "Keamanan & Izin", en: "Security & Permissions" })}
                  </div>
                  <div className="h-24 text-xs font-semibold text-muted-foreground">{t({ id: "Izin yang diperlukan", en: "Permissions required" })}</div>
                </div>
                
                <div className="text-xs text-muted-foreground/60 border-t border-border/40 pt-4">
                  RoketDev Metrics
                </div>
              </div>

              {/* Compared Items columns (Max 3) */}
              {Array.from({ length: 3 }).map((_, idx) => {
                const ext = comparedExtensions[idx];
                return (
                  <div 
                    key={idx}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      ext 
                        ? "border-border bg-card shadow-lg" 
                        : "border-dashed border-border/60 bg-card/10 flex items-center justify-center text-center p-8 min-h-[300px]"
                    }`}
                  >
                    {ext ? (
                      /* Extension details column */
                      <div className="space-y-8">
                        {/* Selector/Drop header */}
                        <div className="flex flex-col gap-3">
                          <select
                            value={ext.id}
                            onChange={(e) => handleReplaceExtension(idx, e.target.value)}
                            className="text-xs bg-transparent border-none font-bold text-primary focus:outline-none w-full truncate"
                          >
                            {availableExtensions.map((avail) => (
                              <option key={avail.id} value={avail.id}>
                                {avail.name}
                              </option>
                            ))}
                            <option value="none">{t({ id: "Hapus", en: "Remove" })}</option>
                          </select>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{ext.logoUrl}</span>
                            <div>
                              <h3 className="font-extrabold text-sm text-foreground line-clamp-1">
                                {ext.name}
                              </h3>
                              <span className="text-[10px] text-muted-foreground capitalize">
                                {ext.categoryName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* General details specs */}
                        <div className="space-y-8 pt-4 border-t border-border/60">
                          {/* Rating */}
                          <div className="h-8 flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold text-foreground">{parseFloat(ext.avgRating.toString()).toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground">({ext.totalReviews})</span>
                          </div>

                          {/* Users */}
                          <div className="h-8 flex items-center gap-1.5">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground font-semibold">{formatNumber(ext.totalUsers)}</span>
                          </div>

                          {/* Pricing */}
                          <div className="h-8 flex items-center">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-foreground capitalize">
                              {ext.pricingType === "free" ? t({ id: "Gratis", en: "Free" }) : ext.pricingType === "freemium" ? "Freemium" : t({ id: "Berbayar", en: "Paid" })} {ext.price ? `($${ext.price}/mo)` : ""}
                            </span>
                          </div>

                          {/* Version */}
                          <div className="h-8 flex items-center text-xs text-muted-foreground font-semibold">
                            v{ext.version || "1.0.0"}
                          </div>

                          {/* Permissions */}
                          <div className="h-24 overflow-y-auto space-y-1.5 no-scrollbar border-t border-border/40 pt-4">
                            {ext.permissions && ext.permissions.length > 0 ? (
                              ext.permissions.map((perm: string) => (
                                <code key={perm} className="block text-[10px] bg-secondary px-1.5 py-0.5 rounded text-foreground font-mono w-max">
                                  {perm}
                                </code>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">{t({ id: "Tidak ada", en: "None" })}</span>
                            )}
                          </div>
                        </div>

                        {/* Installation Link CTA */}
                        <div className="pt-6 border-t border-border/60">
                          <a
                            href={`/api/go/${ext.slug}?type=install`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                          >
                            {t({ id: "Tambahkan ke Chrome", en: "Add to Chrome" })}
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Empty slot dropdown */
                      <div className="space-y-4 max-w-[180px]">
                        <p className="text-xs text-muted-foreground font-semibold">
                          {t({ id: "Tambah ekstensi untuk dibandingkan", en: "Add an extension to compare" })}
                        </p>
                        <select
                          onChange={(e) => handleAddExtension(e.target.value)}
                          defaultValue=""
                          className="w-full rounded-xl border border-border bg-card px-2.5 py-2 text-xs focus:outline-none text-muted-foreground font-semibold"
                        >
                          <option value="" disabled>{t({ id: "Pilih...", en: "Choose..." })}</option>
                          {availableExtensions
                            .filter((item) => !comparedIds.includes(item.id))
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Summary Recommendation Matrix panel */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-md">
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t({ id: "Matriks Ringkasan Perbandingan", en: "Comparison Summary Matrix" })}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground leading-relaxed">
                {comparedExtensions.map((ext) => (
                  <div key={ext.id} className="space-y-2 border-r border-border/40 last:border-none pr-4">
                    <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                      <span>{ext.logoUrl}</span>
                      {ext.name}
                    </h3>
                    <p className="line-clamp-3">{ext.tagline}</p>
                    
                    <div className="pt-2 space-y-1.5">
                      <div className="font-semibold text-foreground">{t({ id: "Rekomendasi:", en: "Recommendations:" })}</div>
                      {ext.avgRating >= 4.8 ? (
                        <div className="text-emerald-500 font-semibold flex items-center gap-1">
                          {t({ id: `✓ Tingkat kepuasan pengguna terbaik (${ext.avgRating})`, en: `✓ Best user satisfaction rating (${ext.avgRating})` })}
                        </div>
                      ) : null}
                      {ext.totalUsers > 1000000 ? (
                        <div className="text-primary font-semibold flex items-center gap-1">
                          {t({ id: `✓ Sangat tepercaya (${formatNumber(ext.totalUsers)}+ unduhan)`, en: `✓ Widely trusted (${formatNumber(ext.totalUsers)}+ installs)` })}
                        </div>
                      ) : null}
                      {ext.pricingType === "free" ? (
                        <div className="text-amber-500 font-semibold flex items-center gap-1">
                          {t({ id: "✓ Sepenuhnya gratis & terbuka", en: "✓ Completely free & open" })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function ComparisonPage() {
  return (
    <PageWrapper>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading comparison matrix...</p>
          </div>
        </div>
      }>
        <ComparisonContent />
      </Suspense>
    </PageWrapper>
  );
}
