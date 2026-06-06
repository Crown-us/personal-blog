"use client";

import React, { useState } from "react";
import Link from "next/link";
import { categories } from "@/config/categories";
import { PlusCircle, Upload, Check, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function SubmitDevTool() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [chromeStoreUrl, setChromeStoreUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState("ai-tools");
  const [pricingType, setPricingType] = useState("free");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [permissions, setPermissions] = useState("");

  const getTranslatedCategoryName = (slug: string) => {
    if (language === "en") {
      const cat = categories.find(c => c.slug === slug);
      return cat ? cat.name : slug;
    }
    switch (slug) {
      case "ai-tools": return "Alat AI";
      case "productivity": return "Produktivitas";
      case "privacy-security": return "Privasi & Keamanan";
      case "developer-tools": return "Alat Developer";
      case "writing": return "Penulisan";
      case "design": return "Desain";
      case "shopping": return "Belanja";
      case "news-reading": return "Berita & Bacaan";
      default: return slug;
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 py-10">
        
        {/* Title */}
        <div className="border-b border-border pb-6 mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center justify-center gap-2">
            <PlusCircle className="h-7 w-7 text-primary" />
            {t({ id: "Kirim DevTool", en: "Submit DevTool" })}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t({
              id: "Daftarkan alat developer atau plugin Anda di ExtensionHub. Jangkau 50.000+ pencari tertarget.",
              en: "List your developer tool or plugin on ExtensionHub. Reach 50,000+ targeted discoverers."
            })}
          </p>
        </div>

        {/* Stepper bar */}
        {!isSuccess && (
          <div className="flex items-center justify-between gap-2 mb-10 text-xs font-semibold text-muted-foreground">
            {[
              { num: 1, label: t({ id: "Info Dasar", en: "Basic Info" }) },
              { num: 2, label: t({ id: "Harga & Metadata", en: "Pricing & Metadata" }) },
              { num: 3, label: t({ id: "Audit & Konfirmasi", en: "Audit & Confirm" }) }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                  step === s.num
                    ? "bg-primary border-primary text-primary-foreground font-bold shadow-md shadow-primary/10"
                    : step > s.num
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-bold"
                      : "border-border"
                }`}>
                  {step > s.num ? "✓" : s.num}
                </span>
                <span className={step === s.num ? "text-foreground font-bold" : ""}>
                  {s.label}
                </span>
                {s.num < 3 && <span className="text-border">|</span>}
              </div>
            ))}
          </div>
        )}

        {isSuccess ? (
          /* Success display */
          <div className="text-center py-16 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl space-y-6 max-w-lg mx-auto">
            <div className="text-4xl text-emerald-500">✓</div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t({ id: "Pengiriman Diterima!", en: "Submission Received!" })}</h2>
              <p className="text-sm text-muted-foreground mt-2 px-6">
                {t({
                  id: "Devtool Anda masuk dalam antrean audit keamanan kami. Ini biasanya memakan waktu 24-48 jam. Kami akan mengirimkan email setelah disetujui!",
                  en: "Your devtool is queued for our security audit. This usually takes 24-48 hours. We will email you once approved!"
                })}
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
              >
                {t({ id: "Buka Dasbor Penerbit", en: "Go to Publisher Dashboard" })}
              </Link>
              <Link
                href="/extensions"
                className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/40 transition-all"
              >
                {t({ id: "Cari di direktori", en: "Browse directory" })}
              </Link>
            </div>
          </div>
        ) : (
          /* Form Stepper panels */
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
            <form onSubmit={step === 3 ? handleSubmit : handleNextStep} className="space-y-6">
              
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Nama DevTool", en: "DevTool Name" })}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grammarly Helper..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Tagline Singkat", en: "Short Tagline" })}</label>
                    <input
                      type="text"
                      required
                      placeholder={t({ id: "Ringkas fungsi dalam 15 kata...", en: "Summarize function in 15 words..." })}
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "URL Chrome Web Store", en: "Chrome Web Store URL" })}</label>
                    <input
                      type="url"
                      required
                      placeholder="https://chromewebstore.google.com/detail/..."
                      value={chromeStoreUrl}
                      onChange={(e) => setChromeStoreUrl(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "URL Situs Web (Opsional)", en: "Website URL (Optional)" })}</label>
                    <input
                      type="url"
                      placeholder="https://myextension.com..."
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  {/* Logo Mock uploader */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">{t({ id: "Ikon Logo", en: "Logo Icon" })}</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/20 transition-all">
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground font-semibold">
                        {t({ id: "Seret dan lepas logo atau cari", en: "Drag and drop logo or browse" })}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{t({ id: "PNG, JPG atau SVG. Maks 100x100px.", en: "PNG, JPG or SVG. Max 100x100px." })}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Pricing & Metadata */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Kategori", en: "Category" })}</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none text-foreground font-semibold"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>{getTranslatedCategoryName(cat.slug)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Model Harga", en: "Pricing Model" })}</label>
                      <select
                        value={pricingType}
                        onChange={(e) => setPricingType(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none text-foreground font-semibold"
                      >
                        <option value="free">{t({ id: "Gratis", en: "Free" })}</option>
                        <option value="freemium">Freemium</option>
                        <option value="paid">{t({ id: "Berbayar", en: "Paid" })}</option>
                      </select>
                    </div>
                  </div>

                  {pricingType !== "free" && (
                    <div className="space-y-1.5 border border-border rounded-xl p-4 bg-secondary/20">
                      <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Harga per bulan (USD)", en: "Price per month (USD)" })}</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="9.99..."
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Tag (dipisahkan koma)", en: "Tags (comma separated)" })}</label>
                    <input
                      type="text"
                      placeholder="AI, writing, security..."
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Izin Manifest (dipisahkan koma)", en: "Manifest Permissions (comma separated)" })}</label>
                    <input
                      type="text"
                      placeholder="activeTab, storage, sidePanel..."
                      value={permissions}
                      onChange={(e) => setPermissions(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Confirm Audit */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-600 dark:text-amber-400">{t({ id: "Pemberitahuan Audit Keamanan", en: "Security Audit Notice" })}</h4>
                      <p className="mt-1">
                        {t({
                          id: "Kami memeriksa semua devtools untuk kode yang dikaburkan, pustaka pelacak, dan memverifikasi izin yang terdaftar. Pelanggaran akan menyebabkan penolakan langsung.",
                          en: "We check all devtools for obfuscated code, tracking libraries, and verify matching permissions listed. Obstruction will cause direct disapproval."
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">{t({ id: "Deskripsi Detail Produk", en: "Product Details Description" })}</label>
                    <textarea
                      required
                      rows={5}
                      placeholder={t({ id: "Jelaskan fitur, alur penggunaan, detail transparansi harga...", en: "Explain features, usage flow, pricing transparency details..." })}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  {/* Summary preview list */}
                  <div className="rounded-xl border border-border p-4 bg-secondary/20 text-xs space-y-2">
                    <div className="font-bold text-foreground">{t({ id: "Ringkasan pengiriman:", en: "Submission summary:" })}</div>
                    <div>{t({ id: "Nama:", en: "Name:" })} <span className="font-semibold text-foreground">{name || "-"}</span></div>
                    <div>{t({ id: "URL Toko:", en: "Store URL:" })} <span className="font-semibold text-foreground text-primary truncate max-w-[200px] inline-block align-bottom">{chromeStoreUrl || "-"}</span></div>
                    <div>{t({ id: "Kategori:", en: "Category:" })} <span className="font-semibold text-foreground uppercase">{category || "-"}</span></div>
                    <div>{t({ id: "Model harga:", en: "Pricing model:" })} <span className="font-semibold text-foreground uppercase">{pricingType || "-"}</span></div>
                  </div>
                </div>
              )}

              {/* Stepper buttons footer */}
              <div className="flex justify-between items-center pt-4 border-t border-border/60">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/40 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t({ id: "Kembali", en: "Back" })}
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    t({ id: "Mengirimkan...", en: "Submitting..." })
                  ) : step === 3 ? (
                    t({ id: "Kirim DevTool", en: "Submit DevTool" })
                  ) : (
                    <>
                      {t({ id: "Langkah Berikutnya", en: "Next Step" })}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
      </main>
    </PageWrapper>
  );
}
