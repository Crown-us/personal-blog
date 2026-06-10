"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { mockSourceCodes, mockExtensions } from "@/config/mock-data";
import { Play, ExternalLink, ArrowRight, Laptop, HelpCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function ShowcasePage() {
  const { t, tExtension, tSourceCode } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "source-code" | "devtools">("all");

  const [extensionsList, setExtensionsList] = useState<any[]>([]);
  const [sourceCodesList, setSourceCodesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShowcaseData = async () => {
      try {
        const [extRes, scRes] = await Promise.all([
          fetch("/api/extensions"),
          fetch("/api/source-code")
        ]);

        const [extData, scData] = await Promise.all([
          extRes.json(),
          scRes.json()
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
        console.error("Failed to load showcase data from DB:", err);
        setExtensionsList(mockExtensions);
        setSourceCodesList(mockSourceCodes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowcaseData();
  }, []);

  const showcaseItems = useMemo(() => {
    const list: any[] = [];
    
    // Add Source Codes
    sourceCodesList.map(tSourceCode).forEach((sc) => {
      list.push({
        id: sc.id,
        type: "source-code",
        name: sc.name,
        tagline: sc.tagline,
        thumbnail: sc.thumbnail,
        demoLink: sc.demoLink,
        techStack: sc.techStack,
        price: sc.price,
        detailLink: `/source-code/${sc.slug}`
      });
    });

    // Add DevTools (only the ones with demo or website links)
    extensionsList.map(tExtension).forEach((ext) => {
      list.push({
        id: ext.id,
        type: "devtools",
        name: ext.name,
        tagline: ext.tagline,
        thumbnail: ext.logoUrl || "🧩",
        demoLink: ext.websiteUrl || ext.chromeStoreUrl,
        techStack: ext.tags || [],
        price: ext.pricingType === "free" ? t({ id: "Gratis", en: "Free" }) : "Freemium",
        detailLink: `/extensions/${ext.slug}`
      });
    });

    return list;
  }, [t, tExtension, tSourceCode, extensionsList, sourceCodesList]);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return showcaseItems;
    return showcaseItems.filter((item) => item.type === activeTab);
  }, [activeTab, showcaseItems]);

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="border-b border-border pb-6 mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Laptop className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t({ id: "Demo Live & Showcase", en: "Live Demo & Showcase" })}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t({
            id: "Uji coba langsung sistem aplikasi, template source code, dan devtools terkurasi secara live sebelum Anda membeli atau memasang.",
            en: "Test live application systems, source code templates, and curated devtools live before you buy or install."
          })}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center sm:justify-start gap-2 mb-8 border-b border-border/40 pb-4">
        {[
          { id: "all", label: t({ id: "Semua Demo", en: "All Demos" }) },
          { id: "source-code", label: t({ id: "💻 Source Code (Sistem Jadi)", en: "💻 Source Code (Ready Systems)" }) },
          { id: "devtools", label: t({ id: "🧩 DevTools (Ekstensi & Alat)", en: "🧩 DevTools (Extensions & Tools)" }) }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
              activeTab === tab.id
                ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/10"
                : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Showcase */}
      {filteredItems.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground text-sm">
          {t({ id: "Tidak ada demo dalam kategori ini.", en: "No demos in this category." })}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={`${item.type}-${item.id}`}
              className="market-card rounded-2xl border border-border bg-card p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/80 border border-border text-2xl font-bold shadow-sm">
                      {item.thumbnail}
                    </span>
                    <div>
                      <Link 
                        href={item.detailLink}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider block mt-0.5">
                        {item.type === "source-code" ? t({ id: "💻 Source Code", en: "💻 Source Code" }) : t({ id: "🧩 DevTool", en: "🧩 DevTool" })}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    item.type === "source-code" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {item.price}
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-2 h-[36px]">
                  {item.tagline}
                </p>

                {/* Tech stack badging */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3">
                  {item.techStack.slice(0, 3).map((stack: string) => (
                    <span 
                      key={stack}
                      className="text-[9px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border/50"
                    >
                      {stack}
                    </span>
                  ))}
                  {item.techStack.length > 3 && (
                    <span className="text-[9px] text-muted-foreground font-semibold">+{item.techStack.length - 3}</span>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-2 mt-5 pt-3 border-t border-border/40">
                <a
                  href={item.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-[11px] font-semibold text-center flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <Play className="h-3 w-3 fill-current" />
                  {t({ id: "Coba Demo Live", en: "Try Live Demo" })}
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <Link
                  href={item.detailLink}
                  className="py-1.5 px-3 rounded-lg border border-border hover:bg-secondary text-foreground text-[11px] font-semibold text-center flex items-center justify-center gap-1 transition-all"
                >
                  {t({ id: "Detail", en: "Details" })}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Info helper block */}
      <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-6 flex flex-col sm:flex-row gap-4 items-center max-w-3xl mx-auto shadow-sm">
        <HelpCircle className="h-8 w-8 text-primary shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed text-center sm:text-left">
          <h4 className="font-bold text-foreground mb-1">
            {t({ id: "Demo & Sandbox Keamanan", en: "Demos & Security Sandbox" })}
          </h4>
          <p>
            {t({
              id: "Semua link demo dijalankan di sandbox environment masing-masing pengembang atau server demonstrasi terisolasi kami. Kami melakukan audit berkala untuk memastikan situs demonstrasi aman dari script berbahaya.",
              en: "All demo links run in the sandbox environment of their respective developers or our isolated demonstration servers. We conduct periodic audits to ensure demonstration sites are safe from malicious scripts."
            })}
          </p>
        </div>
      </div>

    </main>
    </PageWrapper>
  );
}
