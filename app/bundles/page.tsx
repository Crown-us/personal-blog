"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, CheckCircle, CreditCard, ArrowRight, X, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

interface BundlePackage {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceRaw: number;
  originalPrice: string;
  badge?: string;
  items: string[];
  description: string;
}

export default function BundlesPage() {
  const { t } = useLanguage();
  const [selectedBundle, setSelectedBundle] = useState<BundlePackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer">("qris");
  const [checkoutStep, setCheckoutStep] = useState<"select" | "payment" | "success">("select");

  const bundles: BundlePackage[] = [
    {
      id: "bundle-1",
      name: t({ id: "Paket Mahasiswa & Freelance", en: "Student & Freelance Bundle" }),
      tagline: t({ 
        id: "Dua template populer untuk portofolio magang, tugas akhir, atau jasa pembuatan web client.", 
        en: "Two popular templates for internship portfolios, final projects, or client web development services." 
      }),
      price: t({ id: "Rp119.000", en: "$8.00" }),
      priceRaw: t({ id: 119000, en: 8 }),
      originalPrice: t({ id: "Rp158.000", en: "$10.50" }),
      badge: t({ id: "Terpopuler", en: "Most Popular" }),
      items: [
        t({ id: "Template Portofolio Pro", en: "Portfolio Pro Template" }), 
        t({ id: "Sistem Manajemen POS Kasir", en: "POS Management System" })
      ],
      description: t({ 
        id: "Mulai karir freelance Anda dengan setup porto premium serta sistem kasir POS siap pakai.", 
        en: "Start your freelance career with a premium portfolio setup and a ready-to-use POS cashier system." 
      })
    },
    {
      id: "bundle-2",
      name: t({ id: "Paket SaaS Founder", en: "SaaS Founder Bundle" }),
      tagline: t({ 
        id: "Dua sistem informasi fullstack siap saji untuk membangun bisnis SaaS mandiri.", 
        en: "Two ready-to-use fullstack information systems to build an independent SaaS business." 
      }),
      price: t({ id: "Rp149.000", en: "$10.00" }),
      priceRaw: t({ id: 149000, en: 10 }),
      originalPrice: t({ id: "Rp178.000", en: "$12.00" }),
      badge: t({ id: "Rekomendasi", en: "Recommended" }),
      items: [
        t({ id: "Sistem Manajemen RT/RW", en: "RT/RW Management System" }), 
        t({ id: "Platform Blog AI", en: "AI Blog Platform" })
      ],
      description: t({ 
        id: "Rancang portal manajemen warga atau kembangkan platform blog AI otomatis dalam hitungan menit.", 
        en: "Design a citizen management portal or develop an automated AI blog platform in minutes." 
      })
    },
    {
      id: "bundle-3",
      name: t({ id: "Paket Ultimate Developer (Semua Sistem)", en: "Ultimate Developer Bundle (All Systems)" }),
      tagline: t({ 
        id: "Dapatkan akses penuh ke seluruh source code berkualitas tinggi di platform kami.", 
        en: "Get full access to all high-quality source code on our platform." 
      }),
      price: t({ id: "Rp199.000", en: "$13.50" }),
      priceRaw: t({ id: 199000, en: 13.5 }),
      originalPrice: t({ id: "Rp356.000", en: "$24.00" }),
      badge: t({ id: "Hemat 45%", en: "Save 45%" }),
      items: [
        t({ id: "Sistem Manajemen RT/RW", en: "RT/RW Management System" }),
        t({ id: "Platform Blog AI", en: "AI Blog Platform" }),
        t({ id: "Template Portofolio Pro", en: "Portfolio Pro Template" }),
        t({ id: "Sistem Manajemen POS Kasir", en: "POS Management System" })
      ],
      description: t({ 
        id: "Koleksi lengkap sistem manajemen warga, kasir ritel, porto interaktif, dan blog generator bertenaga AI.", 
        en: "A complete collection of citizen management systems, retail POS, interactive portfolios, and AI-powered blog generators." 
      })
    }
  ];

  const handleOpenCheckout = (bundle: BundlePackage) => {
    setSelectedBundle(bundle);
    setCheckoutStep("payment");
  };

  const handleCloseCheckout = () => {
    setSelectedBundle(null);
    setCheckoutStep("select");
  };

  const handleSimulatePayment = () => {
    setCheckoutStep("success");
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="border-b border-border pb-6 mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Layers className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t({ id: "Paket Hemat Source Code", en: "Discounted Source Code Bundles" })}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t({
            id: "Dapatkan beberapa source code sekaligus dengan potongan harga khusus untuk developer, mahasiswa, dan agensi lokal.",
            en: "Get multiple source codes at once with special discounts for developers, students, and local agencies."
          })}
        </p>
      </div>

      {/* Grid Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-10">
        {bundles.map((bundle) => (
          <div 
            key={bundle.id}
            className={`relative rounded-2xl border bg-card p-6 flex flex-col justify-between transition-all duration-200 ${
              bundle.badge 
                ? "border-primary/40 shadow-lg ring-1 ring-primary/20 scale-[1.01]" 
                : "border-border shadow-md hover:border-border-hover"
            }`}
          >
            {bundle.badge && (
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="h-3 w-3" />
                {bundle.badge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-foreground leading-snug">
                  {bundle.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {bundle.tagline}
                </p>
              </div>

              {/* Pricing row */}
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-2xl font-black text-foreground">{bundle.price}</span>
                <span className="text-xs text-muted-foreground line-through">{bundle.originalPrice}</span>
              </div>

              {/* Items included list */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t({ id: "Produk yang didapat:", en: "Products included:" })}
                </p>
                <ul className="space-y-2">
                  {bundle.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground font-semibold">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                {bundle.description}
              </p>
            </div>

            <button
              onClick={() => handleOpenCheckout(bundle)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/15"
            >
              {t({ id: "Beli Paket Ini", en: "Buy This Bundle" })}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Trust notice */}
      <div className="rounded-2xl border border-border bg-secondary/20 p-5 text-center max-w-2xl mx-auto text-xs text-muted-foreground leading-relaxed">
        💡 <strong>{t({ id: "Info Lisensi:", en: "License Info:" })}</strong> {t({
          id: "Semua source code dalam paket dapat digunakan untuk projek pribadi, tugas kuliah, maupun dikustomisasi untuk projek klien komersial Anda. Tidak diperkenankan untuk dijual kembali sebagai produk kosongan.",
          en: "All source codes in the package can be used for personal projects, college assignments, or customized for your commercial client projects. Reselling as a standalone empty template/product is not allowed."
        })}
      </div>

      {/* Checkout Simulator Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-extrabold text-sm text-foreground">{t({ id: "Checkout Pembayaran", en: "Payment Checkout" })}</h3>
              </div>
              <button 
                onClick={handleCloseCheckout}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Steps Container */}
            {checkoutStep === "payment" && (
              <div className="p-6 space-y-6 flex-1">
                
                {/* Product Summary */}
                <div className="bg-secondary/40 border border-border rounded-2xl p-4 space-y-2 text-xs">
                  <div className="text-muted-foreground">{t({ id: "Detail Paket:", en: "Bundle Details:" })}</div>
                  <div className="font-extrabold text-sm text-foreground">{selectedBundle.name}</div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/60">
                    <span className="font-medium">{t({ id: "Total Tagihan:", en: "Total Bill:" })}</span>
                    <span className="font-black text-sm text-primary">{selectedBundle.price}</span>
                  </div>
                </div>

                {/* Payment Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {t({ id: "Pilih Metode Pembayaran:", en: "Choose Payment Method:" })}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod("qris")}
                      className={`p-3 rounded-xl border text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === "qris"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span className="text-lg">📱</span>
                      QRIS / E-Wallet
                    </button>
                    <button
                      onClick={() => setPaymentMethod("transfer")}
                      className={`p-3 rounded-xl border text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === "transfer"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span className="text-lg">🏦</span>
                      {t({ id: "Transfer Bank", en: "Bank Transfer" })}
                    </button>
                  </div>
                </div>

                {/* Gateway Detail */}
                {paymentMethod === "qris" ? (
                  <div className="border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-card">
                    <div className="w-36 h-36 bg-white border border-border p-2 rounded-xl flex items-center justify-center relative">
                      {/* Simulating QRIS logo and QR */}
                      <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">
                        [ MOCK QRIS QR ]
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {t({
                          id: "Scan kode QRIS di atas menggunakan GoPay, OVO, Dana, LinkAja, atau m-Banking Anda.",
                          en: "Scan the QRIS QR code above using GoPay, OVO, Dana, LinkAja, or your mobile banking."
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-border rounded-2xl p-4 space-y-3 bg-card text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">{t({ id: "Bank Penerima:", en: "Recipient Bank:" })}</span>
                      <span className="font-extrabold text-foreground">Bank BCA (Virtual Account)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">{t({ id: "Nomor Rekening:", en: "Account Number:" })}</span>
                      <span className="font-extrabold text-foreground select-all">8012 3456 7890 1234</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground font-medium">{t({ id: "Atas Nama:", en: "Account Name:" })}</span>
                      <span className="font-extrabold text-foreground">ExtensionHub Marketplace</span>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleSimulatePayment}
                  className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-1.5"
                >
                  {t({ id: "✓ Konfirmasi Pembayaran (Simulasi)", en: "✓ Confirm Payment (Simulation)" })}
                </button>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="p-6 space-y-6 flex-1 text-center py-10">
                <div className="text-4xl text-emerald-500">🎉</div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">{t({ id: "Pembayaran Sukses!", en: "Payment Successful!" })}</h3>
                  <p className="text-xs text-muted-foreground px-4">
                    {t({ id: "Terima kasih, pembayaran untuk", en: "Thank you, payment for" }) + " "}
                    <strong>{selectedBundle.name}</strong>
                    {" " + t({ id: "telah berhasil disimulasikan.", en: "has been successfully simulated." })}
                  </p>
                </div>

                {/* Download links container */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">{t({ id: "Download Source Code ZIP:", en: "Download Source Code ZIP:" })}</div>
                  {selectedBundle.items.map((item, idx) => (
                    <a
                      key={idx}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(t({
                          id: `Mulai mengunduh package ${item}.zip`,
                          en: `Starting download of package ${item}.zip`
                        }));
                      }}
                      className="block p-2 rounded-lg bg-card border border-border hover:border-emerald-500/35 hover:text-emerald-500 font-semibold transition-all flex items-center justify-between"
                    >
                      <span>📂 {item}.zip</span>
                      <span className="text-[10px] text-primary">Download →</span>
                    </a>
                  ))}
                </div>

                <button
                  onClick={handleCloseCheckout}
                  className="w-full rounded-xl bg-secondary py-3 text-xs font-bold text-foreground hover:bg-secondary/80 transition-all border border-border"
                >
                  {t({ id: "Kembali ke Bundles", en: "Back to Bundles" })}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
    </PageWrapper>
  );
}
