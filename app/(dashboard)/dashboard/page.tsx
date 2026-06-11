"use client";

import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  Settings, 
  LogOut, 
  Trash2,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function PublisherDashboard() {
  const { t, language } = useLanguage();
  const supabase = createSupabaseBrowserClient();

  const [activeTab, setActiveTab] = useState("bookmarks");
  const [userRole, setUserRole] = useState("user");
  const [profile, setProfile] = useState<any>(null);
  const [dbExtensions, setDbExtensions] = useState<any[]>([]);
  const [bookmarkedExtensions, setBookmarkedExtensions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch dashboard data
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserRole(data.role);
          setDbExtensions(data.extensions);
          setProfile(data.user);
          setActiveTab("bookmarks");
        }
      })
      .catch((err) => console.error("Failed to load dashboard data:", err))
      .finally(() => setIsLoading(false));

    // 2. Load bookmarks from localStorage
    try {
      const stored = localStorage.getItem("roketdev_bookmarks");
      if (stored) {
        const bookmarkSlugs = JSON.parse(stored);
        if (bookmarkSlugs.length > 0) {
          fetch("/api/extensions?status=all")
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                const matched = data.extensions.filter((ext: any) => 
                  bookmarkSlugs.includes(ext.slug) || bookmarkSlugs.includes(ext.id)
                );
                setBookmarkedExtensions(matched);
              }
            });
        }
      }
    } catch (e) {
      console.warn("Failed to load bookmarks:", e);
    }
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };



  const handleDeleteSubmission = async (id: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus usulan DevTool ini?", en: "Are you sure you want to delete this DevTool submission?" }))) {
      try {
        // We will call DELETE /api/extensions/[id] or handle it via db delete
        const res = await fetch(`/api/extensions/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setDbExtensions(dbExtensions.filter((ext) => ext.id !== id));
        } else {
          alert(data.error || "Failed to delete submission.");
        }
      } catch (err) {
        console.error("Error deleting submission:", err);
      }
    }
  };

  const removeBookmark = (slug: string) => {
    try {
      const stored = localStorage.getItem("roketdev_bookmarks");
      if (stored) {
        const bookmarks = JSON.parse(stored);
        const filtered = bookmarks.filter((s: string) => s !== slug);
        localStorage.setItem("roketdev_bookmarks", JSON.stringify(filtered));
        setBookmarkedExtensions(bookmarkedExtensions.filter((e) => e.slug !== slug));
      }
    } catch (e) {
      console.error(e);
    }
  };



  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground font-semibold">
              {t({ id: "Memuat dasbor...", en: "Loading dashboard..." })}
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-2 border border-border bg-card p-4 rounded-2xl shadow-sm">
            <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t({ id: "Panel Pengguna", en: "User Console" })}
            </div>
            
            {[
              { id: "bookmarks", label: t({ id: "Bookmark Saya", en: "My Bookmarks" }), icon: Bookmark },
              { id: "extensions", label: t({ id: "Usulan DevTool Saya", en: "My Proposed Tools" }), icon: Settings }
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

            {userRole === "admin" && (
              <>
                <hr className="border-border/60 my-2" />
                <Link
                  href="/admin"
                  target="_blank"
                  className="w-full text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center gap-2 text-amber-500 hover:bg-amber-500/5 border border-amber-500/20 bg-amber-500/5 font-bold"
                >
                  <Settings className="h-4 w-4" />
                  {t({ id: "Panel Kontrol Admin", en: "Admin Control Panel" })}
                </Link>
              </>
            )}

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

          {/* Main Dashboard panel */}
          <div className="lg:col-span-9 space-y-6">
            


            {/* Tab: Bookmarks List */}
            {activeTab === "bookmarks" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Bookmark Saya", en: "My Bookmarks" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{t({ id: "Koleksi DevTools pilihan yang Anda simpan.", en: "Your curated list of saved DevTools." })}</p>
                </div>

                {bookmarkedExtensions.length === 0 ? (
                  <div className="rounded-2xl border border-border border-dashed p-12 text-center space-y-4 bg-card">
                    <Bookmark className="h-8 w-8 text-muted-foreground/50 mx-auto animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t({ id: "Belum Ada Bookmark", en: "No Bookmarks Yet" })}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 max-w-sm mx-auto">
                        {t({
                          id: "Anda belum menyimpan DevTool apa pun. Telusuri direktori kami dan simpan beberapa favorit!",
                          en: "You haven't bookmarked any DevTools yet. Browse our directory and save some favorites!"
                        })}
                      </p>
                    </div>
                    <Link
                      href="/extensions"
                      className="inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                    >
                      {t({ id: "Telusuri Direktori", en: "Browse Directory" })}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookmarkedExtensions.map((ext) => (
                      <div key={ext.id} className="border border-border rounded-2xl bg-card p-4 flex flex-col justify-between hover:shadow-sm transition-all">
                        <div className="flex gap-3">
                          <span className="text-2xl bg-secondary h-11 w-11 flex items-center justify-center rounded-xl border border-border shadow-sm">{ext.logoUrl || "🧩"}</span>
                          <div className="min-w-0">
                            <Link href={`/extensions/${ext.slug}`} className="font-bold text-sm text-foreground hover:text-primary transition-colors block truncate">{ext.name}</Link>
                            <span className="text-[10px] text-muted-foreground block truncate">{ext.tagline}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-3 border-t border-border/40 justify-end">
                          <Link href={`/extensions/${ext.slug}`} className="px-3 py-1.5 text-[11px] font-semibold bg-secondary rounded-lg hover:bg-secondary/80 text-foreground transition-all">
                            {t({ id: "Lihat", en: "View" })}
                          </Link>
                          <button
                            onClick={() => removeBookmark(ext.slug)}
                            className="px-2.5 py-1.5 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/5 rounded-lg border border-border hover:border-rose-500/20 transition-all flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            {t({ id: "Hapus", en: "Remove" })}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Extensions List */}
            {activeTab === "extensions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {userRole === "admin" ? t({ id: "Semua Usulan DevTool", en: "All DevTool Submissions" }) : t({ id: "Usulan DevTool Saya", en: "My DevTool Submissions" })}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userRole === "admin" ? t({ id: "Daftar pengajuan produk dari seluruh pengguna.", en: "Product submissions from all users." }) : t({ id: "Daftar pengajuan produk Anda dan status auditasinya.", en: "Your submitted products and audit status." })}
                    </p>
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
                      {dbExtensions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center p-8 text-muted-foreground italic">
                            {t({ id: "Belum ada usulan DevTool.", en: "No DevTool submissions yet." })}
                          </td>
                        </tr>
                      ) : (
                        dbExtensions.map((ext) => (
                          <tr key={ext.id} className="hover:bg-secondary/20 transition-all">
                            <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                              <span className="text-xl bg-secondary p-1 rounded border border-border">{ext.logoUrl || "🧩"}</span>
                              <Link href={`/extensions/${ext.slug}`} className="hover:underline">{ext.name}</Link>
                            </td>
                            <td className="p-4">
                              {ext.status === "approved" || ext.status === "featured" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  <CheckCircle className="h-3 w-3" />
                                  {t({ id: "Aktif", en: "Active" })}
                                </span>
                              ) : ext.status === "rejected" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded-full border border-rose-500/20">
                                  <Trash2 className="h-3 w-3" />
                                  {t({ id: "Ditolak", en: "Rejected" })}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/20">
                                  <Clock className="h-3 w-3" />
                                  {t({ id: "Dalam Peninjauan", en: "Review Audit" })}
                                </span>
                              )}
                            </td>
                            <td className="p-4 space-y-0.5">
                              <div>{t({ id: "Klik:", en: "Clicks:" })} <span className="font-semibold text-foreground">{ext.clickCount || 0}</span></div>
                              <div>{t({ id: "Pemasangan:", en: "Installs:" })} <span className="font-semibold text-foreground">{ext.totalInstalls || 0}</span></div>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteSubmission(ext.id)}
                                className="p-1.5 rounded-lg border border-border hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-500/20 transition-all"
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
            )}

          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
