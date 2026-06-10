"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ExtensionCard from "@/components/shared/ExtensionCard";
import CompareTray from "@/components/shared/CompareTray";
import { useCompare } from "@/hooks/useCompare";
import { mockExtensions } from "@/config/mock-data";
import { Search, Compass } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { language, t, dict, tExtension } = useLanguage();

  // Read search query (?q=...)
  const q = searchParams.get("q") || "";
  const [queryInput, setQueryInput] = useState(q);

  const [extensionsList, setExtensionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) {
      setExtensionsList([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/extensions?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.extensions.length > 0) {
          setExtensionsList(data.extensions);
        } else {
          // fallback to mockExtensions filtered client-side
          setExtensionsList(
            mockExtensions.filter((ext) => {
              return (
                ext.name.toLowerCase().includes(q.toLowerCase()) ||
                (ext.tagline && ext.tagline.toLowerCase().includes(q.toLowerCase())) ||
                ext.description.toLowerCase().includes(q.toLowerCase()) ||
                ext.categoryName?.toLowerCase().includes(q.toLowerCase()) ||
                ext.tags?.some((tTag: string) => tTag.toLowerCase().includes(q.toLowerCase()))
              );
            })
          );
        }
      })
      .catch((err) => {
        console.error("Search API fetch failed:", err);
        setExtensionsList([]);
      })
      .finally(() => setIsLoading(false));
  }, [q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(queryInput.trim())}`);
  };

  const results = useMemo(() => {
    return extensionsList.map(tExtension);
  }, [extensionsList, tExtension]);

  return (
    <>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search Header */}
        <div className="border-b border-border pb-6 mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t({ id: "Hasil Pencarian", en: "Search Results" })}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t({
              id: `${results.length} hasil ditemukan untuk "${q}"`,
              en: `${results.length} results found for "${q}"`
            })}
          </p>
        </div>

        {/* Search inputs refine block */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl relative flex items-center p-1 rounded-xl border border-border bg-card mb-8">
          <div className="pl-3 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder={t({ id: "Cari ekstensi...", en: "Search extensions..." })}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="w-full bg-transparent py-2 px-3 text-xs focus:outline-none text-foreground placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all"
          >
            {t({ id: "Cari", en: "Refine" })}
          </button>
        </form>

        {/* Results grid */}
        {results.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl max-w-xl mx-auto space-y-4">
            <Compass className="h-10 w-10 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-bold text-base text-foreground">
                {t({ id: "Tidak ada hasil ditemukan", en: "No matches found" })}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t({ id: "Coba gunakan kata-kata umum atau cari berdasarkan kategori.", en: "Try using general words or browse by category." })}
              </p>
            </div>
            <Link
              href="/extensions"
              className="inline-block text-xs font-semibold text-primary hover:underline"
            >
              {t({ id: "Telusuri Direktori", en: "Browse Directory" })}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((ext) => (
              <ExtensionCard
                key={ext.id}
                extension={ext}
                onCompareToggle={toggleCompare}
                isComparing={compareIds.includes(ext.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Compare Drawer */}
      <CompareTray 
        compareIds={compareIds}
        onRemove={toggleCompare}
        onClear={clearCompare}
      />
    </>
  );
}

export default function SearchResults() {
  const { t } = useLanguage();
  return (
    <PageWrapper>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground font-semibold">
              {t({ id: "Mencari daftar...", en: "Searching listings..." })}
            </p>
          </div>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </PageWrapper>
  );
}
