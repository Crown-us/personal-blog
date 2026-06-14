"use client";

import React from "react";
import Link from "next/link";
import { Star, Download, Heart } from "lucide-react";
import { ExtensionWithDetails } from "@/types/extension";
import { formatNumber } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";

interface ExtensionCardProps {
  extension: ExtensionWithDetails;
  onCompareToggle?: (id: string) => void;
  isComparing?: boolean;
}

export default function ExtensionCard({ 
  extension, 
  onCompareToggle, 
  isComparing 
}: ExtensionCardProps) {
  const { t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(extension.id, "extension");
  
  const rating = parseFloat(extension.avgRating?.toString() || "0");
  const publisher = extension.publisherName || t({ id: "Pengembang Terverifikasi", en: "Verified Developer" });

  return (
    <motion.div 
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
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(extension.id, "extension");
        }}
        className={`absolute top-3 right-3 p-1.5 rounded-lg border transition-colors hover:bg-secondary z-10 ${
          isWishlisted
            ? "text-rose-500 bg-rose-500/5 border-rose-500/20"
            : "text-muted-foreground hover:text-foreground bg-card border-border/80"
        }`}
        title={isWishlisted ? t({ id: "Hapus dari Wishlist", en: "Remove from Wishlist" }) : t({ id: "Tambah ke Wishlist", en: "Add to Wishlist" })}
      >
        <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
      </button>
      <div>
        {/* Header: Icon + Name & Publisher */}
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/80 border border-border text-2xl font-bold">
            {extension.logoUrl || "🧩"}
          </div>
          <div className="space-y-0.5 min-w-0">
            <Link 
              href={`/extensions/${extension.slug}`}
              className="block font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
            >
              {extension.name}
            </Link>
            <span className="block text-[11px] text-muted-foreground truncate">
              {publisher}
            </span>
          </div>
        </div>

        {/* Short description */}
        <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed h-[34px]">
          {extension.tagline}
        </p>

        {/* Stats inline */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span>({formatNumber(extension.totalReviews || 0)})</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3 text-muted-foreground" />
            <span>{formatNumber(extension.totalUsers || 0)} {t({ id: "pengguna", en: "users" })}</span>
          </div>
          {extension.trustBadge && (
            <>
              <span className="text-border">•</span>
              <span className="font-bold text-primary/90 text-[10px] tracking-wide shrink-0">
                {extension.trustBadge}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Single clean row of CTA at the bottom */}
      <div className="mt-4 pt-3 border-t border-border/40 flex gap-2">
        <Link
          href={`/extensions/${extension.slug}`}
          className="flex-1 text-center text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all"
        >
          {t({ id: "Lihat", en: "View" })}
        </Link>
        
        {onCompareToggle && (
          <button
            onClick={() => onCompareToggle(extension.id)}
            className={`px-2 py-1.5 text-[10px] font-semibold rounded-lg border transition-all ${
              isComparing 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {isComparing ? t({ id: "Membandingkan", en: "Comparing" }) : t({ id: "Bandingkan", en: "Compare" })}
          </button>
        )}
      </div>
      
    </motion.div>
  );
}
