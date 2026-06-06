"use client";

import React, { use, useMemo } from "react";
import Link from "next/link";
import ExtensionCard from "@/components/shared/ExtensionCard";
import CompareTray from "@/components/shared/CompareTray";
import { useCompare } from "@/hooks/useCompare";
import { mockExtensions } from "@/config/mock-data";
import { categories } from "@/config/categories";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { t, language, tExtension } = useLanguage();

  const getTranslatedCategory = (cat: any) => {
    if (!cat) return cat;
    if (language === "en") return cat;
    
    const translations: Record<string, { name: string; description: string }> = {
      "ai-tools": {
        name: "Alat AI",
        description: "Ekstensi Chrome bertenaga AI kecerdasan buatan, asisten menulis, ChatGPT, LLM, dan generator gambar."
      },
      "productivity": {
        name: "Produktivitas",
        description: "Tingkatkan efisiensi kerja Anda dengan pengelola tab, pelacak waktu, pencatat catatan, dan asisten fokus."
      },
      "privacy-security": {
        name: "Privasi & Keamanan",
        description: "Lindungi data pribadi Anda dengan pemblokir iklan, VPN, enkripsi sandi, dan manajemen cookie."
      },
      "developer-tools": {
        name: "Alat Developer",
        description: "Utilitas khusus untuk web debugging, inspeksi API, pembuat kode, dan integrasi repositori git."
      },
      "writing": {
        name: "Penulisan",
        description: "Asisten menulis otomatis, pemeriksa tata bahasa (grammar), koreksi ejaan, penerjemah, dan tools copywriting."
      },
      "design": {
        name: "Desain",
        description: "Pemilih warna layar, pengambil tangkapan layar (screenshot), pemilih font web, dan asisten visual desainer."
      },
      "shopping": {
        name: "Belanja",
        description: "Temukan kode kupon promo otomatis, bandingkan fluktuasi harga barang e-commerce, dan cashback."
      },
      "news-reading": {
        name: "Berita & Bacaan",
        description: "RSS feed reader kustom, mode baca bersih bebas iklan, pengubah teks-ke-suara, dan ringkasan berita."
      }
    };
    
    const tr = translations[cat.slug];
    if (tr) {
      return {
        ...cat,
        name: tr.name,
        description: tr.description
      };
    }
    return cat;
  };

  // Find category metadata
  const categoryMeta = useMemo(() => {
    const cat = categories.find((cat) => cat.slug === slug);
    return getTranslatedCategory(cat);
  }, [slug, language]);

  // Filter matching extensions with translation
  const matchingExtensions = useMemo(() => {
    return mockExtensions
      .filter((ext) => ext.categoryId === slug)
      .map(tExtension);
  }, [slug, tExtension]);

  if (!categoryMeta) {
    return (
      <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t({ id: "Kategori Tidak Ditemukan", en: "Category Not Found" })}</h1>
        <p className="text-muted-foreground mt-2">{t({ id: "Kategori yang Anda cari tidak ada.", en: "The category you are looking for does not exist." })}</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          {t({ id: "Kembali ke Beranda", en: "Go back Home" })}
        </Link>
      </div>
    );
  }

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back navigation */}
        <Link 
          href="/extensions"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          {t({ id: "Kembali ke Direktori", en: "Back to Directory" })}
        </Link>

        {/* Category Header banner card with HSL gradients */}
        <div className={`rounded-3xl border border-border bg-gradient-to-r ${categoryMeta.gradient} p-8 text-white mb-10 shadow-xl shadow-primary/5`}>
          <div className="max-w-xl space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight">{categoryMeta.name}</h1>
            <p className="text-sm text-white/80 leading-relaxed">
              {categoryMeta.description}
            </p>
          </div>
        </div>

        {/* Results grid */}
        {matchingExtensions.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground text-sm">
              {t({ id: "Belum ada ekstensi yang ditemukan di kategori ini.", en: "No extensions found in this category yet." })}
            </p>
            <Link
              href="/submit"
              className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              {t({ id: "Kirim ekstensi pertama", en: "Submit first extension" })}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchingExtensions.map((ext) => (
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
    </PageWrapper>
  );
}
