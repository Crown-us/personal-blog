"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  Download, 
  MousePointerClick, 
  Star, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  Settings, 
  LogOut, 
  Trash2,
  Filter
} from "lucide-react";
import { mockExtensions, mockReviews } from "@/config/mock-data";
import { formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function PublisherDashboard() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock list of publisher submitted extensions
  const [publisherExts, setPublisherExts] = useState([
    {
      id: "ext-1",
      slug: "chatgpt-sidebar",
      name: t({ id: "ChatGPT Sidebar & Pengunggah File", en: "ChatGPT Sidebar & File Uploader" }),
      logoUrl: "🤖",
      status: "approved",
      clicks: 12450,
      installs: 890,
      rating: 4.8,
      reviewsCount: 1420
    },
    {
      id: "ext-custom-demo",
      slug: "demo-ext",
      name: t({ id: "Smart Auto-Fill Snippet Pintar", en: "Smart Auto-Fill Snippets" }),
      logoUrl: "⚡",
      status: "pending",
      clicks: 0,
      installs: 0,
      rating: 0,
      reviewsCount: 0
    }
  ]);

  // Combined metrics
  const totalClicks = publisherExts.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalInstalls = publisherExts.reduce((acc, curr) => acc + curr.installs, 0);

  const handleDeleteDemo = (id: string) => {
    setPublisherExts(publisherExts.filter((ext) => ext.id !== id));
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-2 border border-border bg-card p-4 rounded-2xl">
            <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t({ id: "Panel Penerbit", en: "Publisher Panel" })}
            </div>
            
            {[
              { id: "overview", label: t({ id: "📊 Statistik Ringkasan", en: "📊 Overview Stats" }), icon: BarChart3 },
              { id: "extensions", label: t({ id: "🧩 DevTools Saya", en: "🧩 My DevTools" }), icon: Settings },
              { id: "reviews", label: t({ id: "⭐ Kontrol Ulasan", en: "⭐ Review Control" }), icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}

            <hr className="border-border/60 my-2" />

            <Link
              href="/submit"
              className="w-full text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center gap-2 text-primary hover:bg-primary/5"
            >
              <PlusCircle className="h-4 w-4" />
              {t({ id: "Kirim DevTool", en: "Submit DevTool" })}
            </Link>

            <Link
              href="/"
              className="w-full text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center gap-2 text-rose-500 hover:bg-rose-500/5"
            >
              <LogOut className="h-4 w-4" />
              {t({ id: "Keluar", en: "Sign Out" })}
            </Link>
          </aside>

          {/* Main Dashboard panel */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{t({ id: "Dasbor Analitik", en: "Analytics Dashboard" })}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t({
                      id: "Kelola daftar produk, pantau metrik, dan lacak unduhan pengguna.",
                      en: "Manage listings, monitor metrics, and track user downloads."
                    })}
                  </p>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Total Klik Pengalihan", en: "Total Redirect Clicks" })}</span>
                      <MousePointerClick className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{formatNumber(totalClicks)}</p>
                    <span className="text-[10px] text-emerald-500 font-semibold">{t({ id: "↑ 12.4% dari minggu lalu", en: "↑ 12.4% from last week" })}</span>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Estimasi Pemasangan", en: "Est. Installs" })}</span>
                      <Download className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{formatNumber(totalInstalls)}</p>
                    <span className="text-[10px] text-emerald-500 font-semibold">{t({ id: "↑ 8.2% dari minggu lalu", en: "↑ 8.2% from last week" })}</span>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Rata-rata Rating", en: "Avg Rating" })}</span>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">4.8★</p>
                    <span className="text-[10px] text-muted-foreground">{t({ id: "Di semua produk", en: "Across all properties" })}</span>
                  </div>
                </div>

                {/* Growth chart mockup */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <h2 className="text-sm font-bold tracking-wider uppercase text-foreground">
                    {t({
                      id: "Analitik Klik & Pemasangan (30 Hari Terakhir)",
                      en: "Click & Install Analytics (Last 30 Days)"
                    })}
                  </h2>
                  <div className="h-48 border border-border/40 rounded-xl bg-secondary/10 flex items-end justify-between px-6 pb-2 pt-6">
                    {[12, 18, 15, 24, 30, 28, 35, 42, 38, 50].map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-full max-w-[20px]">
                        <div 
                          className="w-full bg-primary rounded-t transition-all duration-500 hover:bg-primary/80" 
                          style={{ height: `${val * 3}px` }}
                        />
                        <span className="text-[8px] text-muted-foreground">{t({ id: "Jun", en: "Jun" })} {idx * 3 + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Extensions List */}
            {activeTab === "extensions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{t({ id: "Produk yang Dikirim", en: "Submitted Properties" })}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t({ id: "Devtools terdaftar dan status audit Anda.", en: "Your registered devtools and status audits." })}</p>
                  </div>
                  <Link
                    href="/submit"
                    className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                  >
                    {t({ id: "+ Kirim Baru", en: "+ Submit New" })}
                  </Link>
                </div>

                <div className="border border-border rounded-2xl bg-card overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                        <th className="p-4">{t({ id: "DevTool", en: "DevTool" })}</th>
                        <th className="p-4">{t({ id: "Status", en: "Status" })}</th>
                        <th className="p-4">{t({ id: "Metrik", en: "Metrics" })}</th>
                        <th className="p-4 text-right">{t({ id: "Aksi", en: "Actions" })}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-muted-foreground">
                      {publisherExts.map((ext) => (
                        <tr key={ext.id} className="hover:bg-secondary/20 transition-all">
                          <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                            <span className="text-xl bg-secondary p-1 rounded border border-border">{ext.logoUrl}</span>
                            <Link href={`/extensions/${ext.slug}`} className="hover:underline">{ext.name}</Link>
                          </td>
                          <td className="p-4">
                            {ext.status === "approved" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle className="h-3 w-3" />
                                {t({ id: "Aktif", en: "Active" })}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Clock className="h-3 w-3" />
                                {t({ id: "Dalam Peninjauan", en: "Review Audit" })}
                              </span>
                            )}
                          </td>
                          <td className="p-4 space-y-0.5">
                            <div>{t({ id: "Klik:", en: "Clicks:" })} <span className="font-semibold text-foreground">{ext.clicks}</span></div>
                            <div>{t({ id: "Pemasangan:", en: "Installs:" })} <span className="font-semibold text-foreground">{ext.installs}</span></div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteDemo(ext.id)}
                              className="p-1.5 rounded-lg border border-border hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Review management */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Kontrol Ulasan", en: "Review Control" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{t({ id: "Baca dan balas masukan pengguna pada devtools Anda.", en: "Read and reply to user feedback on your devtools." })}</p>
                </div>

                <div className="space-y-4">
                  {/* Pull reviews for ext-1 from mockReviews */}
                  {(mockReviews["ext-1"] || []).map((rev) => (
                    <div key={rev.id} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <img 
                            src={rev.userAvatarUrl} 
                            alt={rev.userName} 
                            className="h-7 w-7 rounded-full object-cover border border-border"
                          />
                          <span className="font-bold text-foreground">{rev.userName}</span>
                          <span className="text-muted-foreground">{t({ id: "pada ChatGPT Sidebar", en: "on ChatGPT Sidebar" })}</span>
                        </div>
                        
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/35"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-foreground">{rev.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rev.body}</p>

                      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-border/40">
                        <span className="text-muted-foreground">{formatDate(rev.createdAt)}</span>
                        <button className="text-primary font-semibold hover:underline">
                          {t({ id: "Tulis balasan →", en: "Write reply →" })}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
