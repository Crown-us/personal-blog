"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ExtensionCard from "@/components/shared/ExtensionCard";
import CompareTray from "@/components/shared/CompareTray";
import { useCompare } from "@/hooks/useCompare";
import { mockExtensions, mockReviews, mockBlogPosts, mockSourceCodes } from "@/config/mock-data";
import { Star, Download, Globe, Shield, ExternalLink, Calendar, MessageSquare, AlertTriangle, BookOpen, Layers, Check, X as XIcon, Bookmark } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { ExtensionWithDetails } from "@/types/extension";

export default function ExtensionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { language, t, tExtension, tSourceCode, tBlog } = useLanguage();

  const [dbExtension, setDbExtension] = useState<ExtensionWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/extensions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.extensions.find((ext: ExtensionWithDetails) => ext.slug === slug);
          if (found) {
            setDbExtension(found);
          }
        }
      })
      .catch((err) => console.error("Failed to load extension detail:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  // Find extension
  const extension = useMemo(() => {
    if (dbExtension) {
      return {
        ...dbExtension,
        categoryName: dbExtension.categoryName || "General",
        screenshots: dbExtension.screenshots || [],
      };
    }
    const orig = mockExtensions.find((ext) => ext.slug === slug);
    return orig ? tExtension(orig) : null;
  }, [dbExtension, slug, tExtension]);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (extension) {
      try {
        const stored = localStorage.getItem("roketdev_bookmarks");
        if (stored) {
          const bookmarks = JSON.parse(stored);
          const isSaved = bookmarks.includes(extension.slug) || bookmarks.includes(extension.id);
          setTimeout(() => {
            setIsBookmarked(isSaved);
          }, 0);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [extension]);

  const toggleBookmark = () => {
    if (!extension) return;
    try {
      const stored = localStorage.getItem("roketdev_bookmarks");
      let bookmarks = stored ? JSON.parse(stored) : [];
      const isSaved = bookmarks.includes(extension.slug);
      
      if (isSaved) {
        bookmarks = bookmarks.filter((s: string) => s !== extension.slug);
        setIsBookmarked(false);
      } else {
        bookmarks.push(extension.slug);
        setIsBookmarked(true);
      }
      localStorage.setItem("roketdev_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  };

  // Review states
  const reviewsList = useMemo(() => {
    if (!extension) return [];
    return mockReviews[extension.id] || [];
  }, [extension]);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewPros, setReviewPros] = useState("");
  const [reviewCons, setReviewCons] = useState("");
  const [reviews, setReviews] = useState(reviewsList);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Ratings summary distribution calculations
  const ratingsSummary = useMemo(() => {
    const total = reviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    
    reviews.forEach((r) => {
      const ratingKey = r.rating as 5 | 4 | 3 | 2 | 1;
      distribution[ratingKey] = (distribution[ratingKey] || 0) + 1;
      sum += r.rating;
    });

    const average = total > 0 ? sum / total : (extension ? parseFloat(extension.avgRating.toString()) : 0);

    return {
      average,
      total: total + (extension ? (extension.totalReviews - reviewsList.length) : 0),
      distribution
    };
  }, [reviews, extension, reviewsList]);

  // Related Extensions
  const relatedExtensions = useMemo(() => {
    if (!extension) return [];
    return mockExtensions
      .filter((ext) => ext.id !== extension.id && ext.categoryId === extension.categoryId)
      .slice(0, 3)
      .map(tExtension);
  }, [extension, tExtension]);

  // Conversion: Find related tutorials
  const relatedTutorials = useMemo(() => {
    if (!extension) return [];
    return mockBlogPosts
      .map(tBlog)
      .filter((post) => 
        post.relatedExtensionIds?.includes(extension.id)
      );
  }, [extension, tBlog]);

  // Related Source Code products based on category alignment
  const relatedSourceCodes = useMemo(() => {
    if (!extension) return [];
    let codes = [];
    if (extension.categoryId === "ai-tools") {
      codes = mockSourceCodes.filter((sc) => sc.id === "sc-2");
    } else if (extension.categoryId === "developer-tools") {
      codes = mockSourceCodes.filter((sc) => sc.id === "sc-3" || sc.id === "sc-4");
    } else if (extension.categoryId === "writing") {
      codes = mockSourceCodes.filter((sc) => sc.id === "sc-3");
    } else if (extension.categoryId === "productivity") {
      codes = mockSourceCodes.filter((sc) => sc.id === "sc-1");
    } else if (extension.categoryId === "privacy-security") {
      codes = mockSourceCodes.filter((sc) => sc.id === "sc-1" || sc.id === "sc-2");
    } else {
      codes = [mockSourceCodes[0]];
    }
    return codes.map(tSourceCode);
  }, [extension, tSourceCode]);

  // Curated themed collection details for contextual links
  const relatedCollection = useMemo(() => {
    if (!extension) return null;
    if (extension.categoryId === "ai-tools") {
      return {
        name: t({ id: "🤖 Peralatan Coding AI", en: "🤖 AI Coding Toolkit" }),
        slug: "ai-coding-toolkit",
        description: t({ id: "Asisten AI utama termasuk ChatGPT Sidebar dan Ekstensi Claude.", en: "Top AI helpers including ChatGPT Sidebar and Claude Extension." })
      };
    }
    if (extension.categoryId === "developer-tools") {
      return {
        name: t({ id: "💻 Esensial Developer", en: "💻 Developer Essentials" }),
        slug: "developer-essentials",
        description: t({ id: "Ekstensi inti untuk inspeksi, analisis, dan debugging.", en: "Core extensions for inspection, analysis, and debugging." })
      };
    }
    if (extension.categoryId === "writing" || extension.categoryId === "productivity") {
      return {
        name: t({ id: "⚡ Tumpukan Produktivitas", en: "⚡ Productivity Stack" }),
        slug: "productivity-stack",
        description: t({ id: "Tingkatkan komunikasi, penulisan, dan perekaman layar Anda.", en: "Level up your communication, writing, and screen recording." })
      };
    }
    if (extension.categoryId === "privacy-security") {
      return {
        name: t({ id: "🛡️ Esensial Privasi", en: "🛡️ Privacy Essentials" }),
        slug: "privacy-essentials",
        description: t({ id: "Lindungi sesi browser, blokir pelacak, dan kelola cookie.", en: "Protect browser sessions, block trackers, and manage cookies." })
      };
    }
    return null;
  }, [extension, t]);

  // Structured SEO data containing Pros, Cons, and Alternatives for search engine ranking
  const seoData = useMemo(() => {
    const data: Record<string, { pros: string[]; cons: string[]; alternatives: { name: string; slug: string; tagline: string }[] }> = language === "id" ? {
      "ext-1": {
        pros: ["Integrasi langsung GPT-4o & Claude", "Parser file PDF/DOCX", "Prompt klik kanan kontekstual"],
        cons: ["Memerlukan akun untuk fitur premium", "Batas kuota API pada versi gratis"],
        alternatives: [
          { name: "Claude Extension", slug: "claude-extension", tagline: "Antarmuka obrolan alternatif untuk model Anthropic." }
        ]
      },
      "ext-2": {
        pros: ["Deteksi nada & cek ejaan yang sangat baik", "Bekerja di hampir semua kotak input teks", "Template tulisan AI bawaan"],
        cons: ["Langganan premium yang mahal", "Pengetikan lambat di halaman yang berat"],
        alternatives: [
          { name: "LanguageTool", slug: "languagetool-grammar", tagline: "Asisten ejaan open-source yang berfokus pada privasi." }
        ]
      },
      "ext-3": {
        pros: ["Sumber terbuka & berorientasi privasi", "Mendukung 30+ bahasa", "Ringan dengan opsi hosting mandiri"],
        cons: ["Saran AI kurang canggih dibanding Grammarly", "Tampilan UI bisa terlihat usang"],
        alternatives: [
          { name: "Grammarly", slug: "grammarly-go", tagline: "Asisten penulis dan pengeditan nada AI." }
        ]
      },
      "ext-4": {
        pros: ["Rekam & unggah satu klik", "Salin tautan ke clipboard otomatis", "Komentar interaktif & reaksi emoji"],
        cons: ["Batas 5 menit pada versi gratis", "Masalah sinkronisasi audio sesekali"],
        alternatives: [
          { name: "Vimeo Record", slug: "vimeo-record", tagline: "Alat perekam browser yang ringan." }
        ]
      },
      "ext-5": {
        pros: ["Penggunaan memori & CPU yang sangat efisien", "Memblokir iklan, pop-up, dan pelacak", "Tidak ada daftar putih 'Iklan yang Diterima'"],
        cons: ["Dapat merusak tata letak situs web lama", "Perlu pembaruan daftar filter untuk iklan baru"],
        alternatives: [
          { name: "Privacy Badger", slug: "privacy-badger", tagline: "Pemblokir pelacak otomatis oleh EFF." }
        ]
      },
      "ext-6": {
        pros: ["Mengidentifikasi ratusan CMS, framework, dan alat", "Detail tumpukan teknologi instan", "Audit cookie dan skrip pelacak"],
        cons: ["Perlu API premium untuk pencarian massal", "Dapat dikelabui oleh header server khusus"],
        alternatives: [
          { name: "BuiltWith", slug: "builtwith", tagline: "Platform pencarian teknologi terperinci." }
        ]
      },
      "ext-7": {
        pros: ["Navigasi pohon file sidebar yang cepat", "Mendukung tema GitHub", "Memungkinkan bookmark file"],
        cons: ["Fitur pro memerlukan lisensi", "Dapat menghalangi UI GitHub pada monitor kecil"],
        alternatives: [
          { name: "GitHub File Tree", slug: "github-file-tree", tagline: "Penampil pohon file minimalis untuk browser." }
        ]
      },
      "ext-8": {
        pros: ["Mengumpulkan berita dari blog teknologi top", "Filter umpan berita yang dapat disesuaikan", "Tampilan UI yang bersih & modern"],
        cons: ["Menggantikan halaman tab baru default browser", "Dapat mengalihkan perhatian saat jam kerja"],
        alternatives: [
          { name: "Feedly", slug: "feedly", tagline: "Platform pembaca RSS untuk pengembang." }
        ]
      },
      "ext-9": {
        pros: ["Menghapus data lokal dalam 1 klik", "Target pembersihan cache yang dapat disesuaikan", "Ekstensi yang sangat ringan"],
        cons: ["Dapat mengeluarkan Anda dari situs jika salah konfigurasi"],
        alternatives: [
          { name: "Cookie Editor", slug: "cookie-editor", tagline: "Pengubah developer khusus cookie." }
        ]
      },
      "ext-10": {
        pros: ["Menyimpan daftar tab secara otomatis", "Memulihkan sesi setelah crash browser", "Mengekspor daftar tab ke markdown atau CSV"],
        cons: ["Tidak ada sinkronisasi antar perangkat di versi gratis"],
        alternatives: [
          { name: "OneTab", slug: "onetab", tagline: "Konsolidasikan tab ke dalam daftar untuk menghemat memori." }
        ]
      }
    } : {
      "ext-1": {
        pros: ["Direct GPT-4o & Claude integration", "File parser supporting PDF/DOCX", "Contextual right-click prompts"],
        cons: ["Requires account for premium features", "API rate limits on free tier"],
        alternatives: [
          { name: "Claude Extension", slug: "claude-extension", tagline: "Alternative chat interface for Anthropic models." }
        ]
      },
      "ext-2": {
        pros: ["Exceptional spell check & tone detection", "Works in almost all web text boxes", "AI writing templates built-in"],
        cons: ["Expensive premium subscription", "Can cause typing lag on heavy pages"],
        alternatives: [
          { name: "LanguageTool", slug: "languagetool-grammar", tagline: "Open source, privacy-focused spelling helper." }
        ]
      },
      "ext-3": {
        pros: ["Open source & privacy-oriented", "Supports over 30+ languages", "Lightweight with optional self-hosting"],
        cons: ["AI suggestions less advanced than Grammarly", "Browser UI can look dated"],
        alternatives: [
          { name: "Grammarly", slug: "grammarly-go", tagline: "AI writer and tone editing assistant." }
        ]
      },
      "ext-4": {
        pros: ["One-click record & upload", "Automatic clipboard link copying", "Interactive video comments & emojis"],
        cons: ["5-minute limit on free tier", "Occasional audio sync issues"],
        alternatives: [
          { name: "Vimeo Record", slug: "vimeo-record", tagline: "Lightweight browser recording tool." }
        ]
      },
      "ext-5": {
        pros: ["Highly efficient CPU and memory usage", "Blocks ads, popups, and tracker malware", "No 'Acceptable Ads' white-listing"],
        cons: ["Can break older website layouts", "Requires list updates for new ads"],
        alternatives: [
          { name: "Privacy Badger", slug: "privacy-badger", tagline: "Automatic tracker blocker by EFF." }
        ]
      },
      "ext-6": {
        pros: ["Identifies hundreds of CMS, frameworks, and tools", "Instant stack breakdown", "Audits cookies and tracking scripts"],
        cons: ["Premium API required for batch lookups", "Can be spoofed by custom server headers"],
        alternatives: [
          { name: "BuiltWith", slug: "builtwith", tagline: "Detailed technology lookup platform." }
        ]
      },
      "ext-7": {
        pros: ["Fast sidebar file navigation", "Supports GitHub themes", "Allows file bookmarking"],
        cons: ["Pro features require license", "Can block GitHub UI elements on smaller monitors"],
        alternatives: [
          { name: "GitHub File Tree", slug: "github-file-tree", tagline: "Minimalist file tree viewer for browser." }
        ]
      },
      "ext-8": {
        pros: ["Aggregates all top tech blogs", "Customizable feed filters", "Clean, modern visual UI layout"],
        cons: ["Replaces new tab screen default settings", "Can be distracting during work sessions"],
        alternatives: [
          { name: "Feedly", slug: "feedly", tagline: "RSS reader platform for developers." }
        ]
      },
      "ext-9": {
        pros: ["Clears local data in 1-click", "Highly customizable cache targets", "Very lightweight extension overhead"],
        cons: ["Can log you out of websites if not configured properly"],
        alternatives: [
          { name: "Cookie Editor", slug: "cookie-editor", tagline: "Cookie-only developer modifier." }
        ]
      },
      "ext-10": {
        pros: ["Saves tab lists automatically", "Restores sessions after crash", "Exports tabs to markdown or CSV"],
        cons: ["Does not sync across devices in free tier"],
        alternatives: [
          { name: "OneTab", slug: "onetab", tagline: "Consolidate tabs into a list to save memory." }
        ]
      }
    };
    
    if (!extension) return { pros: [], cons: [], alternatives: [] };
    return data[extension.id] || {
      pros: language === "id" ? ["Rilis developer terverifikasi", "Integrasi Chrome mulus", "Ukuran layout ringan"] : ["Verified developer release", "Seamless Chrome integration", "Lightweight layout footprint"],
      cons: language === "id" ? ["Mungkin memerlukan peningkatan izin", "Memerlukan koneksi aktif untuk sinkronisasi"] : ["May require permissions upgrade", "Requires active connection for sync"],
      alternatives: [
        { name: "Chrome Web Store Alternative", slug: "extensions", tagline: "Find other verified productivity resources." }
      ]
    };
  }, [extension, language]);

  if (isLoading && !dbExtension) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
        <div className="relative select-none">
          <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="absolute -inset-2 rounded-full bg-primary/5 blur animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground font-semibold tracking-wide animate-pulse">Loading Extension Details...</p>
      </div>
    );
  }

  if (!extension) {
    return (
      <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t({ id: "DevTool Tidak Ditemukan", en: "DevTool Not Found" })}</h1>
        <p className="text-muted-foreground mt-2">{t({ id: "Alat pengembang yang Anda cari tidak ada.", en: "The devtool you are looking for does not exist." })}</p>
        <Link href="/extensions" className="mt-4 inline-block text-primary hover:underline">
          {t({ id: "Kembali ke Direktori", en: "Back to Directory" })}
        </Link>
      </div>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewTitle.trim() || !reviewBody.trim()) return;

    const newReview = {
      id: `r-custom-${Date.now()}`,
      extensionId: extension.id,
      userId: `u-custom-${Date.now()}`,
      userName: reviewName.trim(),
      userAvatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
      rating: reviewRating,
      title: reviewTitle.trim(),
      body: reviewBody.trim(),
      pros: reviewPros ? reviewPros.split(",").map(p => p.trim()) : [],
      cons: reviewCons ? reviewCons.split(",").map(c => c.trim()) : [],
      verified: true,
      helpfulVotes: 0,
      status: "approved" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReviews([newReview, ...reviews]);
    setShowReviewSuccess(true);
    setReviewName("");
    setReviewTitle("");
    setReviewBody("");
    setReviewPros("");
    setReviewCons("");
    setReviewRating(5);
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
      default: return name;
    }
  };

  const getTranslatedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      language === "id" ? "id-ID" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/extensions" className="hover:text-foreground">DevTools</Link>
          <span>/</span>
          <Link href={`/extensions?category=${extension.categorySlug}`} className="hover:text-foreground capitalize">{getTranslatedCategoryName(extension.categoryName)}</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{extension.name}</span>
        </nav>

        {/* Extension Header block */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-8 border-b border-border">
          {/* Logo & Basic Info */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary/80 border border-border text-5xl shadow-md">
              {extension.logoUrl}
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {extension.name}
                </h1>
                {extension.isFeatured && (
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {t({ id: "Pilihan", en: "Featured" })}
                  </span>
                )}
              </div>

              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                {extension.tagline}
              </p>

              {/* Badges bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-foreground text-sm">{ratingsSummary.average.toFixed(2)}</span>
                  <span>({ratingsSummary.total} {t({ id: "ulasan", en: "reviews" })})</span>
                </div>
                
                <span className="text-border">|</span>
                
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span className="font-semibold text-foreground">{formatNumber(extension.totalUsers)}</span> {t({ id: "pengguna", en: "users" })}
                </div>

                <span className="text-border">|</span>

                <span className="capitalize font-semibold text-foreground px-2 py-0.5 rounded bg-secondary">
                  {extension.pricingType === "free" ? t({ id: "gratis", en: "free" }) : extension.pricingType}
                </span>

                <span className="text-border">|</span>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{t({ id: "Diperbarui:", en: "Updated:" })} {getTranslatedDate(extension.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs sidebar block */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t({ id: "Harga:", en: "Pricing:" })}</span>
              <span className="font-bold text-foreground text-base capitalize">
                {extension.pricingType === "free" ? t({ id: "Gratis", en: "Free" }) : `$${extension.price}/${t({ id: "bln", en: "mo" })}`}
              </span>
            </div>
            
            <a
              href={`/api/go/${extension.slug}?type=install`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
            >
              {t({ id: "Tambahkan ke Chrome", en: "Add to Chrome" })}
              <ExternalLink className="h-4 w-4" />
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => toggleCompare(extension.id)}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                  compareIds.includes(extension.id)
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border hover:bg-secondary text-foreground"
                }`}
              >
                {compareIds.includes(extension.id) ? t({ id: "★ Membandingkan", en: "★ Comparing" }) : t({ id: "Bandingkan", en: "Compare" })}
              </button>

              {/* Bookmark Button */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked
                    ? "border-amber-400 bg-amber-400/10 text-amber-500"
                    : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                title={isBookmarked ? t({ id: "Hapus Bookmark", en: "Remove Bookmark" }) : t({ id: "Tambah Bookmark", en: "Bookmark Tool" })}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>

              {extension.websiteUrl && (
                <a
                  href={extension.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                  title={t({ id: "Kunjungi Situs", en: "Visit Website" })}
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground">
              {t({ id: "Dengan mengklik \"Tambahkan ke Chrome\" Anda akan dialihkan ke Chrome Web Store.", en: "By clicking \"Add to Chrome\" you will be redirected to the Chrome Web Store." })}
            </p>
          </div>
        </section>

        {/* Screenshots Showcase */}
        {extension.screenshots && extension.screenshots.length > 0 && (
          <section className="py-10 border-b border-border">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              🖼️ {t({ id: "Tangkapan Layar", en: "Screenshots" })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {extension.screenshots.map((screen: { id: string; url: string; altText: string }) => (
                <div key={screen.id} className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card group cursor-zoom-in">
                  <img
                    src={screen.url}
                    alt={screen.altText}
                    className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {screen.altText}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info detail block */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 border-b border-border">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
                📝 {t({ id: "Deskripsi Produk", en: "Product Description" })}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {extension.description}
              </p>
            </div>

            {/* Features Listing */}
            <div>
              <h3 className="text-base font-bold tracking-tight text-foreground mb-3">
                ✨ {t({ id: "Fitur Utama", en: "Key Features" })}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {extension.tags?.map((tag: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary text-xs">✓</span>
                    Dukungan {tag}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <span className="text-primary text-xs">✓</span>
                  Versi Reguler {extension.version}
                </li>
              </ul>
            </div>

            {/* Pros & Cons Section */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-base font-bold tracking-tight text-foreground mb-4">
                📊 {t({ id: "Kelebihan & Kekurangan", en: "Pros & Cons" })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Kelebihan / Pros
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {seoData.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1">
                    <XIcon className="h-3.5 w-3.5" />
                    Kekurangan / Cons
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {seoData.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-base font-bold tracking-tight text-foreground mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                {t({ id: "Alternatif yang Direkomendasikan", en: "Recommended Alternatives" })}
              </h3>
              <div className="flex flex-col gap-3">
                {seoData.alternatives.map((alt, index) => (
                  <div key={index} className="rounded-xl border border-border bg-card p-3.5 flex justify-between items-center text-xs hover:border-primary/30 transition-all">
                    <div>
                      <h4 className="font-bold text-foreground">{alt.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{alt.tagline}</p>
                    </div>
                    <Link
                      href={`/extensions/${alt.slug}`}
                      className="text-[10px] font-bold text-primary hover:underline shrink-0"
                    >
                      {t({ id: "Bandingkan alat →", en: "Compare tool →" })}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h3 className="text-base font-bold tracking-tight text-foreground mb-3 flex items-center gap-2">
                  📰 {t({ id: "Panduan Implementasi Terkait", en: "Related Implementation Tutorials" })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedTutorials.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="market-card block rounded-xl p-4 hover:border-primary/50 transition-colors border border-border bg-card"
                    >
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/5 px-2 py-0.5 rounded border border-primary/10 font-medium">
                        {post.category}
                      </span>
                      <h4 className="font-bold text-xs text-foreground mt-2.5 line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {getTranslatedDate(post.publishedAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Permissions / Security transparency panel */}
          <div className="space-y-6">
            {/* Related Source Code Product */}
            {relatedSourceCodes.length > 0 && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                    {t({ id: "Marketplace Kode", en: "Code Marketplace" })}
                  </span>
                  <h3 className="font-bold text-sm text-foreground pt-1.5 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {t({ id: "Dapatkan Source Code", en: "Get the Source Code" })}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {t({ id: "Beli source code siap produksi untuk proyek yang mirip dengan ekstensi ini.", en: "Purchase the production-ready source code for projects similar to this extension." })}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {relatedSourceCodes.map((code) => (
                    <div key={code.id} className="bg-card rounded-xl border border-border p-3 space-y-2.5 shadow-sm">
                      <div className="flex gap-2.5">
                        <span className="text-xl bg-secondary/80 p-1.5 rounded-lg border border-border">
                          {code.thumbnail}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-foreground truncate">
                            {code.name}
                          </h4>
                          <span className="text-[10px] text-primary font-bold">
                            {code.price}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/source-code/${code.slug}`}
                        className="block text-center text-[10px] font-bold py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-sm shadow-primary/10"
                      >
                        {t({ id: "Beli Source Code", en: "Buy Source Code" })}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Collections */}
            {relatedCollection && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  {t({ id: "Bagian dari Koleksi", en: "Part of Collection" })}
                </h3>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-foreground">
                    {relatedCollection.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {relatedCollection.description}
                  </p>
                </div>
                <Link
                  href={extension.categorySlug ? `/extensions?category=${extension.categorySlug}` : "/extensions"}
                  className="block text-center text-[10px] font-bold py-1.5 rounded-lg border border-border hover:bg-secondary text-foreground transition-all"
                >
                  {t({ id: "Lihat Koleksi", en: "View Collection" })}
                </Link>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
              <h3 className="font-bold text-sm tracking-wide uppercase text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                {t({ id: "Izin yang diminta", en: "Permissions requested" })}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t({ id: "Kami menganalisis izin manifes Chrome yang diminta oleh alat pengembang ini untuk transparansi keamanan pengguna.", en: "We analyze Chrome manifest permissions requested by this devtool for user security transparency." })}
              </p>
              
              <div className="flex flex-col gap-2">
                {extension.permissions?.map((perm: string) => (
                  <div key={perm} className="flex items-center justify-between text-xs py-1.5 border-b border-border/40">
                    <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground font-semibold">
                      {perm}
                    </code>
                    <span className="text-muted-foreground text-[10px]">{t({ id: "Diperlukan", en: "Required" })}</span>
                  </div>
                )) || (
                  <p className="text-xs text-muted-foreground">{t({ id: "Tidak ada izin yang diminta di manifes.", en: "No permissions requested in manifest." })}</p>
                )}
              </div>
            </div>

            {/* Sponsored notice placeholder if premium listing */}
            {extension.isSponsored && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">{t({ id: "Penempatan Sponsor", en: "Sponsored Placement" })}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    {t({ id: "Penerbit ini membeli peringkat premium di beranda/direktori. Verifikasi dan spesifikasi telah diaudit.", en: "This publisher purchased premium homepage/directory ranking. Verification and specs are audited." })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 border-b border-border">
          {/* Reviews List & Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t({ id: "Ulasan", en: "Reviews" })} ({reviews.length})
              </h2>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t({ id: "Belum ada ulasan yang diposting. Jadilah yang pertama memberikan ulasan!", en: "No reviews posted yet. Be the first to review!" })}</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"}
                          alt={rev.userName}
                          className="h-9 w-9 rounded-full object-cover border border-border"
                        />
                        <div>
                          <p className="text-xs font-bold text-foreground">{rev.userName}</p>
                          <p className="text-[10px] text-muted-foreground">{getTranslatedDate(rev.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${
                              i < rev.rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-muted-foreground/35"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-semibold text-sm text-foreground">{rev.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rev.body}</p>

                    {/* Pros & Cons */}
                    {((rev.pros && rev.pros.length > 0) || (rev.cons && rev.cons.length > 0)) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        {rev.pros && rev.pros.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-semibold text-emerald-500">👍 Kelebihan / Pros:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                              {rev.pros.map((p, idx) => <li key={idx}>{p}</li>)}
                            </ul>
                          </div>
                        )}
                        {rev.cons && rev.cons.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-semibold text-rose-500">👎 Kekurangan / Cons:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                              {rev.cons.map((c, idx) => <li key={idx}>{c}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Review form */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-bold text-base text-foreground">{t({ id: "Tulis Ulasan", en: "Write a Review" })}</h3>
              
              {showReviewSuccess && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs font-semibold text-emerald-500">
                  {t({ id: "✓ Ulasan berhasil dikirim!", en: "✓ Review submitted successfully!" })}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Nama Anda", en: "Your Name" })}</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name..."
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Rating", en: "Rating" })}</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground font-semibold"
                    >
                      <option value="5">★★★★★ (5/5)</option>
                      <option value="4">★★★★☆ (4/5)</option>
                      <option value="3">★★★☆☆ (3/5)</option>
                      <option value="2">★★☆☆☆ (2/5)</option>
                      <option value="1">★☆☆☆☆ (1/5)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Judul Ulasan", en: "Review Headline" })}</label>
                  <input
                    type="text"
                    required
                    placeholder="Summarize your experience (e.g. Essential tool!)..."
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Isi Ulasan", en: "Review Body" })}</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your detailed feedback on usage, reliability, speed..."
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Kelebihan (pisahkan dengan koma)", en: "Pros (comma separated)" })}</label>
                    <input
                      type="text"
                      placeholder="Fast, Free, Offline support..."
                      value={reviewPros}
                      onChange={(e) => setReviewPros(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Kekurangan (pisahkan dengan koma)", en: "Cons (comma separated)" })}</label>
                    <input
                      type="text"
                      placeholder="Uses RAM, Slow loading..."
                      value={reviewCons}
                      onChange={(e) => setReviewCons(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                >
                  {t({ id: "Kirim Ulasan", en: "Post Review" })}
                </button>
              </form>
            </div>
          </div>

          {/* Ratings Distribution Sidebar summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-bold text-sm tracking-wide uppercase text-foreground">{t({ id: "Ringkasan Rating", en: "Rating Summary" })}</h3>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl font-extrabold text-foreground">{ratingsSummary.average.toFixed(1)}</span>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.round(ratingsSummary.average)
                            ? "fill-amber-400 text-amber-400" 
                            : "text-muted-foreground/35"
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{ratingsSummary.total} {t({ id: "total rating", en: "total ratings" })}</p>
                </div>
              </div>

              {/* Dist bars */}
              <div className="space-y-2 pt-2 text-xs">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingsSummary.distribution[stars as 5 | 4 | 3 | 2 | 1] || 0;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="w-3 text-right">{stars}</span>
                      <span className="text-muted-foreground">★</span>
                      <div className="flex-1 h-2 rounded bg-secondary overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Related Extensions */}
        {relatedExtensions.length > 0 && (
          <section className="py-10">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">
              🧩 {t({ id: "DevTools Terkait", en: "Related DevTools" })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedExtensions.map((ext) => (
                <ExtensionCard
                  key={ext.id}
                  extension={ext}
                  onCompareToggle={toggleCompare}
                  isComparing={compareIds.includes(ext.id)}
                />
              ))}
            </div>
          </section>
        )}

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
