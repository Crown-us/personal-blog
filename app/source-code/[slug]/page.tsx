"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import { mockSourceCodes, mockBlogPosts } from "@/config/mock-data";
import { ChevronLeft, ExternalLink, CreditCard, BookOpen, Layers } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function SourceCodeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const { language, t, dict, tSourceCode, tBlog } = useLanguage();

  const product = useMemo(() => {
    const orig = mockSourceCodes.find((item) => item.slug === slug);
    return tSourceCode(orig);
  }, [slug, tSourceCode]);

  // Conversion: Find related tutorials
  const relatedTutorials = useMemo(() => {
    if (!product) return [];
    return mockBlogPosts
      .map(tBlog)
      .filter((post) => 
        post.relatedSourceCodeIds?.includes(product.id)
      );
  }, [product, tBlog]);

  const getTranslatedCategory = (cat: string) => {
    if (language === "en") return cat;
    switch (cat.toLowerCase()) {
      case "fullstack": return "Aplikasi Fullstack";
      case "saas": return "SaaS Boilerplate";
      case "templates": return "Template Website";
      default: return cat;
    }
  };

  if (!product) {
    return (
      <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t({ id: "Produk Tidak Ditemukan", en: "Product Not Found" })}</h1>
        <p className="text-muted-foreground mt-2">{t({ id: "Produk source code yang Anda cari tidak ada.", en: "The source code product you are looking for does not exist." })}</p>
        <Link href="/source-code" className="mt-4 inline-block text-primary hover:underline">
          {t({ id: "Kembali ke Marketplace", en: "Back to Marketplace" })}
        </Link>
      </div>
    );
  }

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseSuccess(true);
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back link */}
      <Link 
        href="/source-code"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        {t({ id: "Kembali ke Marketplace", en: "Back to Marketplace" })}
      </Link>

      {/* Main product card header */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-8 border-b border-border">
        
        {/* Left Side: Thumbnail & Title details */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary/80 border border-border text-5xl shadow-md">
            {product.thumbnail}
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {product.tagline}
            </p>

            {/* Tech stack badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {product.techStack.map((tech: string) => (
                <span key={tech} className="text-[10px] font-bold text-foreground bg-secondary border border-border px-2 py-0.5 rounded">
                  {tech}
                </span>
              ))}
              <span className="text-xs text-muted-foreground ml-2">
                {t({ id: "Kategori", en: "Category" })}: <span className="text-foreground font-semibold uppercase">{getTranslatedCategory(product.category)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Buy Card panel */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t({ id: "Harga", en: "Price" })}:</span>
            <span className="font-extrabold text-foreground text-lg text-primary">
              {product.price}
            </span>
          </div>

          {purchaseSuccess ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs font-semibold text-emerald-500 text-center">
              {t({ id: "✓ Pembelian berhasil! Periksa email Anda untuk mengunduh.", en: "✓ Purchase successful! check your inbox for download link." })}
            </div>
          ) : (
            <button
              onClick={handlePurchase}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
            >
              <CreditCard className="h-4 w-4" />
              {t({ id: "Beli Sekarang", en: "Instant Purchase" })}
            </button>
          )}

          <div className="flex gap-2">
            <a
              href={product.demoLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-border hover:bg-secondary text-foreground text-center flex items-center justify-center gap-1"
            >
              {t({ id: "Demo Live", en: "Live Demo" })}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
            {t({ id: "Pembayaran aman. Tautan unduhan langsung diberikan setelah verifikasi.", en: "Secure checkout. Immediate link authorization upon verification." })}
          </p>
        </div>

      </section>

      {/* Description & Screenshots section */}
      <section className="py-10 border-b border-border space-y-8">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground mb-3">
            {t({ id: "📝 Ringkasan Proyek & Fitur", en: "📝 Project Overview & Features" })}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.screenshots && product.screenshots.length > 0 && (
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground mb-3">
              {t({ id: "🖼️ Tangkapan Layar Tampilan", en: "🖼️ Interface Screenshots" })}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.screenshots.map((screen: string, idx: number) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card">
                  <img
                    src={screen}
                    alt={`${product.name} dashboard panel`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Conversion Strategy: Related developer tutorials */}
      {relatedTutorials.length > 0 && (
        <section className="py-10">
          <div className="border-b border-border/80 pb-2.5 mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              {t({ id: "📰 Panduan Implementasi Terkait", en: "📰 Related Implementation Tutorials" })}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedTutorials.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="market-card block rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                  {post.category}
                </span>
                <h3 className="font-bold text-xs text-foreground mt-2 line-clamp-1 leading-snug">
                  {post.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      </main>
    </PageWrapper>
  );
}
