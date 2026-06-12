"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import ExtensionCard from "@/components/shared/ExtensionCard";
import CompareTray from "@/components/shared/CompareTray";
import { mockExtensions, mockSourceCodes } from "@/config/mock-data";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { Heart, Trash2, ArrowRight, Layers, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, clearWishlist, isInWishlist } = useWishlist();
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { language, t, dict, tExtension, tSourceCode } = useLanguage();

  const [extensionsList, setExtensionsList] = useState<any[]>([]);
  const [sourceCodesList, setSourceCodesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const [extRes, scRes] = await Promise.all([
          fetch("/api/extensions"),
          fetch("/api/source-code"),
        ]);
        const [extData, scData] = await Promise.all([
          extRes.json(),
          scRes.json(),
        ]);

        if (extData.success && extData.extensions.length > 0) {
          setExtensionsList(extData.extensions);
        } else {
          setExtensionsList(mockExtensions);
        }

        if (scData.success && scData.sourceCodes.length > 0) {
          setSourceCodesList(scData.sourceCodes);
        } else {
          setSourceCodesList(mockSourceCodes);
        }
      } catch (err) {
        console.error("Failed to load wishlist items from database:", err);
        setExtensionsList(mockExtensions);
        setSourceCodesList(mockSourceCodes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistData();
  }, []);

  // Filter items that match the user's wishlist IDs
  const wishlistedExtensions = useMemo(() => {
    return extensionsList
      .filter((ext) => wishlist.some((item) => item.id === ext.id && item.type === "extension"))
      .map(tExtension);
  }, [extensionsList, wishlist, tExtension]);

  const wishlistedSourceCodes = useMemo(() => {
    return sourceCodesList
      .filter((code) => wishlist.some((item) => item.id === code.id && item.type === "source-code"))
      .map(tSourceCode);
  }, [sourceCodesList, wishlist, tSourceCode]);

  const hasItems = wishlistedExtensions.length > 0 || wishlistedSourceCodes.length > 0;

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Title section */}
        <div className="border-b border-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center gap-2">
              <Heart className="h-7 w-7 text-rose-500 fill-rose-500 animate-pulse" />
              {t({ id: "Daftar Keinginan Saya", en: "My Wishlist" })}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {t({
                id: "Simpan devtools, ekstensi, dan source code favorit Anda untuk referensi cepat di masa mendatang.",
                en: "Save your favorite devtools, extensions, and source codes for quick reference later."
              })}
            </p>
          </div>

          {hasItems && (
            <button
              onClick={() => {
                if (confirm(t({ id: "Apakah Anda yakin ingin menghapus semua item?", en: "Are you sure you want to clear your entire wishlist?" }))) {
                  clearWishlist();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors self-start sm:self-center"
            >
              <Trash2 className="h-4 w-4" />
              {t({ id: "Kosongkan Semua", en: "Clear All" })}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <span className="text-xs font-semibold animate-pulse text-muted-foreground">
              {t({ id: "Memuat daftar wishlist...", en: "Loading your wishlist..." })}
            </span>
          </div>
        ) : !hasItems ? (
          /* Empty wishlist state */
          <div className="text-center py-20 border border-dashed border-border rounded-2xl max-w-2xl mx-auto space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Heart className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">
                {t({ id: "Belum Ada Item di Wishlist", en: "Your Wishlist is Empty" })}
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {t({
                  id: "Jelajahi direktori devtool atau marketplace template kami untuk menambahkan item ke daftar ini.",
                  en: "Explore our devtool directories or template marketplace to start adding items here."
                })}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/extensions"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
              >
                🧩 {t({ id: "Cari DevTools", en: "Browse DevTools" })}
              </Link>
              <Link
                href="/source-code"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
              >
                📂 {t({ id: "Marketplace Source Code", en: "Source Codes" })}
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist content grids */
          <div className="space-y-12">
            
            {/* 1. Extensions Section */}
            {wishlistedExtensions.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-2">
                  🧩 {t({ id: "DevTools & Ekstensi", en: "Saved DevTools & Extensions" })} 
                  <span className="text-xs font-semibold bg-secondary px-2.5 py-0.5 rounded-full text-muted-foreground">
                    {wishlistedExtensions.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedExtensions.map((ext) => (
                    <ExtensionCard
                      key={ext.id}
                      extension={ext}
                      onCompareToggle={toggleCompare}
                      isComparing={compareIds.includes(ext.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Source Codes Section */}
            {wishlistedSourceCodes.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-2">
                  📂 {t({ id: "Source Code & Template", en: "Saved Source Codes & Templates" })}
                  <span className="text-xs font-semibold bg-secondary px-2.5 py-0.5 rounded-full text-muted-foreground">
                    {wishlistedSourceCodes.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedSourceCodes.map((code) => (
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
                      className="market-card flex flex-col justify-between rounded-xl p-4 transition-colors border border-border bg-card relative"
                    >
                      {/* Remove Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(code.id, "source-code");
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-lg border border-rose-500/20 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-colors z-10"
                        title={t({ id: "Hapus dari Wishlist", en: "Remove from Wishlist" })}
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </button>

                      <div>
                        {/* Header info */}
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

                        {/* Pricing details */}
                        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-foreground">
                          <span className="text-primary font-bold text-sm">{code.price}</span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">
                            {code.category}
                          </span>
                        </div>
                      </div>

                      {/* CTA link details */}
                      <div className="mt-4 pt-3 border-t border-border/40 flex gap-2">
                        <Link
                          href={`/source-code/${code.slug}`}
                          className="flex-1 text-center text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all"
                        >
                          {t({ id: "Lihat Detail", en: "View Details" })}
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Compare tray comparison */}
        <CompareTray
          compareIds={compareIds}
          onRemove={toggleCompare}
          onClear={clearCompare}
        />

      </main>
    </PageWrapper>
  );
}
