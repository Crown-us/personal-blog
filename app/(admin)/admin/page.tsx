"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Download, 
  MousePointerClick, 
  Star, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  LogOut, 
  Trash2,
  BookOpen,
  Calendar,
  ShieldAlert,
  Eye,
  Settings,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { mockReviews } from "@/config/mock-data";
import { formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const supabase = createSupabaseBrowserClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dbExtensions, setDbExtensions] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dashboard data
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserRole(data.role);
          setDbExtensions(data.extensions);
          setTutorials(data.blogPosts);
          setProfile(data.user);
        }
      })
      .catch((err) => console.error("Failed to load admin stats:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsActionLoading(id);
    try {
      const res = await fetch(`/api/extensions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDbExtensions(dbExtensions.map((ext) => ext.id === id ? { ...ext, status: newStatus } : ext));
      } else {
        alert(data.error || "Failed to update audit status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    setIsActionLoading(id + "-featured");
    const newStatus = isFeatured ? "featured" : "approved";
    try {
      const res = await fetch(`/api/extensions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDbExtensions(dbExtensions.map((ext) => ext.id === id ? { ...ext, status: newStatus } : ext));
      } else {
        alert(data.error || "Failed to update featured flag.");
      }
    } catch (err) {
      console.error("Error updating featured status:", err);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus produk ini dari database?", en: "Are you sure you want to permanently delete this tool from the database?" }))) {
      setIsActionLoading(id + "-delete");
      try {
        const res = await fetch(`/api/extensions/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setDbExtensions(dbExtensions.filter((ext) => ext.id !== id));
        } else {
          alert(data.error || "Failed to delete listing.");
        }
      } catch (err) {
        console.error("Error deleting listing:", err);
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus tutorial ini?", en: "Are you sure you want to delete this tutorial?" }))) {
      try {
        const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setTutorials(tutorials.filter((post) => post.id !== id));
        } else {
          alert(data.error || "Failed to delete tutorial.");
        }
      } catch (err) {
        console.error("Error deleting tutorial:", err);
      }
    }
  };

  // Loader state
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground font-semibold">
              {t({ id: "Memverifikasi hak akses admin...", en: "Verifying admin access..." })}
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Security guard - Role check
  if (userRole !== "admin") {
    return (
      <PageWrapper>
        <main className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
          <div className="max-w-md w-full border border-border bg-card/60 backdrop-blur-xl p-8 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">
                {t({ id: "Akses Terbatas (Admin Only)", en: "Restricted Access (Admin Only)" })}
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t({
                  id: "Maaf, halaman ini hanya diperuntukkan bagi Administrator sistem. Akun Anda tidak memiliki otoritas akses ke area ini.",
                  en: "Sorry, this page is restricted to system Administrators only. Your account does not have authorization here."
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md shadow-primary/20 transition-all text-center"
              >
                {t({ id: "Kembali ke Dasbor Saya", en: "Go to My Dashboard" })}
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 rounded-xl border border-border hover:bg-secondary text-xs text-foreground font-semibold transition-all text-center"
              >
                {t({ id: "Kembali ke Beranda", en: "Go back Home" })}
              </Link>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  // Metrics calculation
  const totalClicks = dbExtensions.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);
  const totalInstalls = dbExtensions.reduce((acc, curr) => acc + (curr.totalInstalls || 0), 0);

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Admin Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-2 border border-border bg-card p-4 rounded-2xl shadow-sm">
            <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t({ id: "Panel Kontrol Admin", en: "Admin Control Panel" })}
            </div>
            
            {[
              { id: "overview", label: t({ id: "📊 Statistik Ringkasan", en: "📊 Overview Stats" }), icon: BarChart3 },
              { id: "extensions", label: t({ id: "🧩 Audit DevTools", en: "🧩 Audit DevTools" }), icon: Settings },
              { id: "reviews", label: t({ id: "⭐ Kontrol Ulasan", en: "⭐ Review Control" }), icon: Star },
              { id: "blog", label: t({ id: "📝 Kelola Tutorial", en: "📝 Manage Tutorials" }), icon: BookOpen }
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

            <button
              onClick={handleSignOut}
              className="w-full text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center gap-2 text-rose-500 hover:bg-rose-500/5"
            >
              <LogOut className="h-4 w-4" />
              {t({ id: "Keluar Sesi", en: "Sign Out" })}
            </button>
          </aside>

          {/* Admin Panel Actions */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{t({ id: "Konsol Admin RoketDev", en: "RoketDev Admin Console" })}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t({
                      id: "Pantau kesehatan data sistem, audit pengajuan devtool, dan kelola panduan developer.",
                      en: "Monitor system metrics, audit devtool listings, and publish developer tutorials."
                    })}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Total Klik Pengalihan", en: "Total Redirect Clicks" })}</span>
                      <MousePointerClick className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{formatNumber(totalClicks)}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Estimasi Pemasangan", en: "Est. Installs" })}</span>
                      <Download className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{formatNumber(totalInstalls)}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Rata-rata Rating", en: "Avg Rating" })}</span>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">4.8★</p>
                  </div>
                </div>

                {/* Growth chart mockup */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
                  <h2 className="text-sm font-bold tracking-wider uppercase text-foreground">
                    {t({
                      id: "Grafik Aktivitas Sistem (30 Hari Terakhir)",
                      en: "System Activity Graph (Last 30 Days)"
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

            {/* Tab: DevTools Audits */}
            {activeTab === "extensions" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Audit Usulan DevTools", en: "DevTools Audit Queue" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{t({ id: "Tinjau, setujui, tolak, atau tandai unggulan untuk listing yang diajukan.", en: "Review, approve, reject, or feature submitted developer listings." })}</p>
                </div>

                <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                          <th className="p-4">{t({ id: "DevTool", en: "DevTool" })}</th>
                          <th className="p-4">{t({ id: "Status", en: "Status" })}</th>
                          <th className="p-4">{t({ id: "Metrik", en: "Metrics" })}</th>
                          <th className="p-4 text-center">{t({ id: "Tindakan Audit", en: "Audit Action" })}</th>
                          <th className="p-4 text-right">{t({ id: "Hapus", en: "Delete" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {dbExtensions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-muted-foreground italic">
                              {t({ id: "Antrean audit kosong.", en: "Audit queue is empty." })}
                            </td>
                          </tr>
                        ) : (
                          dbExtensions.map((ext) => (
                            <tr key={ext.id} className="hover:bg-secondary/20 transition-all">
                              <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                                <span className="text-xl bg-secondary p-1 rounded border border-border">{ext.logoUrl || "🧩"}</span>
                                <div className="flex flex-col">
                                  <Link href={`/extensions/${ext.slug}`} target="_blank" className="hover:underline text-foreground">{ext.name}</Link>
                                  <span className="text-[10px] text-muted-foreground/60">{ext.pricingType}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                {ext.status === "featured" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    <Sparkles className="h-3 w-3 fill-amber-500" />
                                    Featured
                                  </span>
                                ) : ext.status === "approved" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <CheckCircle className="h-3 w-3" />
                                    {t({ id: "Aktif", en: "Approved" })}
                                  </span>
                                ) : ext.status === "rejected" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded-full border border-rose-500/20">
                                    <AlertTriangle className="h-3 w-3" />
                                    Rejected
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/20">
                                    <Clock className="h-3 w-3" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-4 space-y-0.5">
                                <div>{t({ id: "Klik:", en: "Clicks:" })} <span className="font-semibold text-foreground">{ext.clickCount || 0}</span></div>
                                <div>{t({ id: "Rating:", en: "Rating:" })} <span className="font-semibold text-foreground">{ext.avgRating || 0}★</span></div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="inline-flex gap-1">
                                  {ext.status !== "approved" && ext.status !== "featured" && (
                                    <button
                                      disabled={isActionLoading === ext.id}
                                      onClick={() => handleUpdateStatus(ext.id, "approved")}
                                      className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      {t({ id: "Setujui", en: "Approve" })}
                                    </button>
                                  )}
                                  {ext.status !== "rejected" && (
                                    <button
                                      disabled={isActionLoading === ext.id}
                                      onClick={() => handleUpdateStatus(ext.id, "rejected")}
                                      className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      {t({ id: "Tolak", en: "Reject" })}
                                    </button>
                                  )}
                                  {ext.status === "approved" && (
                                    <button
                                      disabled={isActionLoading === ext.id + "-featured"}
                                      onClick={() => handleToggleFeatured(ext.id, true)}
                                      className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      Feature
                                    </button>
                                  )}
                                  {ext.status === "featured" && (
                                    <button
                                      disabled={isActionLoading === ext.id + "-featured"}
                                      onClick={() => handleToggleFeatured(ext.id, false)}
                                      className="px-2 py-1 rounded bg-slate-500 hover:bg-slate-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      Unfeature
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  disabled={isActionLoading === ext.id + "-delete"}
                                  onClick={() => handleDeleteSubmission(ext.id)}
                                  className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews moderation */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Moderasi Ulasan Pengguna", en: "Review Moderation" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{t({ id: "Baca, edit, atau hapus ulasan yang dikirim oleh pengguna pada aplikasi.", en: "Read, audit, or remove user-submitted reviews across properties." })}</p>
                </div>

                <div className="space-y-4">
                  {(mockReviews["ext-1"] || []).map((rev) => (
                    <div key={rev.id} className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
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
                        <span className="text-rose-500 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                          <Trash2 className="h-3 w-3" />
                          Delete Review
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Tutorials */}
            {activeTab === "blog" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{t({ id: "Kelola Tutorial Developer", en: "Manage Developer Tutorials" })}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t({ id: "Publikasikan atau sunting tulisan blog dan tips developer.", en: "Publish, update, or remove tutorials and tips." })}</p>
                  </div>
                  <Link
                    href="/dashboard/blog/new"
                    className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    {t({ id: "Tulis Baru", en: "Write New" })}
                  </Link>
                </div>

                {tutorials.length === 0 ? (
                  <div className="rounded-2xl border border-border border-dashed p-12 text-center space-y-4 bg-card">
                    <BookOpen className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t({ id: "Belum Ada Tutorial", en: "No Tutorials Yet" })}</h4>
                    </div>
                    <Link
                      href="/dashboard/blog/new"
                      className="inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                    >
                      {t({ id: "Tulis Tutorial Pertama", en: "Write First Tutorial" })}
                    </Link>
                  </div>
                ) : (
                  <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                          <th className="p-4">{t({ id: "Tutorial", en: "Tutorial" })}</th>
                          <th className="p-4">{t({ id: "Kategori", en: "Category" })}</th>
                          <th className="p-4">{t({ id: "Status", en: "Status" })}</th>
                          <th className="p-4">{t({ id: "Estimasi Baca", en: "Reading Time" })}</th>
                          <th className="p-4 text-right">{t({ id: "Hapus", en: "Actions" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {tutorials.map((post) => (
                          <tr key={post.id} className="hover:bg-secondary/20 transition-all">
                            <td className="p-4 font-semibold text-foreground">
                              <div className="flex flex-col gap-0.5">
                                <Link href={`/blog/${post.slug}`} target="_blank" className="hover:underline text-foreground text-xs line-clamp-1">
                                  {post.title}
                                </Link>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                                  <Calendar className="h-2.5 w-2.5" />
                                  {new Date(post.createdAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 capitalize">
                              {post.categorySlug?.replace("-", " ") || "General"}
                            </td>
                            <td className="p-4">
                              {post.status === "published" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  {t({ id: "Publik", en: "Published" })}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border">
                                  {t({ id: "Draf", en: "Draft" })}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              {post.readingTimeMinutes} {t({ id: "menit", en: "min" })}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteTutorial(post.id)}
                                className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
