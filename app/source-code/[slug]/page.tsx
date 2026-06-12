"use client";

import React, { use, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { mockSourceCodes, mockBlogPosts } from "@/config/mock-data";
import { ChevronLeft, ExternalLink, CreditCard, BookOpen, Layers } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import CodeExplorer from "@/components/shared/CodeExplorer";

export default function SourceCodeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  const { language, t, dict, tSourceCode, tBlog } = useLanguage();

  const [dbProduct, setDbProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/source-code")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.sourceCodes.find((item: any) => item.slug === slug);
          if (found) {
            setDbProduct(found);
          }
        }
      })
      .catch((err) => console.error("Failed to load source code detail:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const product = useMemo(() => {
    if (dbProduct) {
      return {
        ...dbProduct,
        techStack: dbProduct.techStack || [],
        screenshots: dbProduct.screenshots || [],
      };
    }
    const orig = mockSourceCodes.find((item) => item.slug === slug);
    return orig ? tSourceCode(orig) : null;
  }, [dbProduct, slug, tSourceCode]);

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
    setShowCheckoutOptions(true);
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
          ) : showCheckoutOptions ? (
            <div className="space-y-2">
              <a
                href={`https://wa.me/6285117394678?text=${encodeURIComponent(
                  language === "id"
                    ? `Halo RoketDev, saya tertarik membeli template *${product.name}* seharga *${product.price}*. Bagaimana cara pembayarannya?`
                    : `Hi RoketDev, I'm interested in buying the *${product.name}* template for *${product.price}*. What are the payment steps?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] text-white py-3 text-sm font-semibold hover:bg-[#20ba56] transition-all shadow-md shadow-emerald-500/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="h-4 w-4">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                {t({ id: "Hubungi via WhatsApp", en: "Buy via WhatsApp" })}
              </a>
              <button
                onClick={() => {
                  setPurchaseSuccess(true);
                  try {
                    const saved = localStorage.getItem("roketdev_purchased_ids");
                    const list = saved ? JSON.parse(saved) : [];
                    if (!list.includes(product.id)) {
                      list.push(product.id);
                      localStorage.setItem("roketdev_purchased_ids", JSON.stringify(list));
                    }
                  } catch (e) {
                    console.error("Failed to save purchase:", e);
                  }
                }}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
              >
                <CreditCard className="h-4 w-4" />
                {t({ id: "Simulasi Pembayaran", en: "Simulate Payment" })}
              </button>
              <button
                onClick={() => setShowCheckoutOptions(false)}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground font-semibold py-1 transition-colors"
              >
                {t({ id: "Batal", en: "Cancel" })}
              </button>
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

      {/* Interactive Code Explorer & AI Explainer */}
      <section className="py-10 border-b border-border">
        <div className="space-y-1.5 mb-6">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            📂 {t({ id: "Eksplorasi Kode & Ulasan AI", en: "Interactive Code Explorer & AI Explainer" })}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t({
              id: "Telusuri arsitektur struktur berkas proyek ini secara interaktif dan tanyakan fungsi logika kodenya ke AI.",
              en: "Browse the file structures of this project interactively and ask the AI about the code logic."
            })}
          </p>
        </div>
        <CodeExplorer slug={product.slug} />
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
