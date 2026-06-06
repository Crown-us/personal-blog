"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { navigation } from "@/config/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  const getTranslatedFooterLabel = (label: string) => {
    switch (label) {
      // Product links
      case "Browse DevTools": return t({ id: "Cari DevTools", en: "Browse DevTools" });
      case "Categories": return t({ id: "Kategori", en: "Categories" });
      case "Collections": return t({ id: "Koleksi", en: "Collections" });
      case "Trending": return t({ id: "Sedang Tren", en: "Trending" });
      case "Compare DevTools": return t({ id: "Bandingkan DevTools", en: "Compare DevTools" });
      
      // Company / Publishers links
      case "About": return t({ id: "Tentang Kami", en: "About" });
      case "Blog": return t({ id: "Tutorial", en: "Blog" });
      case "Submit DevTool": return t({ id: "Kirim DevTool", en: "Submit DevTool" });
      case "Advertise": return t({ id: "Pasang Iklan", en: "Advertise" });
      
      // Legal links
      case "Privacy Policy": return t({ id: "Kebijakan Privasi", en: "Privacy Policy" });
      case "Terms of Service": return t({ id: "Syarat & Ketentuan", en: "Terms of Service" });
      case "Cookie Policy": return t({ id: "Kebijakan Cookie", en: "Cookie Policy" });
      
      default: return label;
    }
  };

  return (
    <footer className="border-t border-border bg-secondary/15 py-8 mt-12 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-border/40">
          {/* Logo & Meta info */}
          <div className="space-y-2.5">
            <Link href="/" className="flex items-center gap-1.5 font-bold tracking-tight text-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-[10px]">
                🚀
              </span>
              <span>
                Roket<span className="text-primary">Dev</span>
              </span>
            </Link>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t({
                id: "Temukan dan unduh source code, template website, dan devtools terbaik untuk meluncurkan proyek Anda secepat roket.",
                en: "Discover and download the best source code, website templates, and devtools to launch your project as fast as a rocket."
              })}
            </p>
          </div>

          {/* Directory Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
              {t({ id: "Direktori", en: "Directory" })}
            </h3>
            <ul className="space-y-1">
              {navigation.footer.product.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground hover:underline transition-all">
                    {getTranslatedFooterLabel(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
              {t({ id: "Penerbit", en: "Publishers" })}
            </h3>
            <ul className="space-y-1">
              {navigation.footer.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground hover:underline transition-all">
                    {getTranslatedFooterLabel(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
              {t({ id: "Aturan & Keamanan", en: "Rules & Safety" })}
            </h3>
            <ul className="space-y-1">
              {navigation.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground hover:underline transition-all">
                    {getTranslatedFooterLabel(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-[11px]">
          <span>
            © {new Date().getFullYear()} RoketDev. {t({ id: "Hak cipta dilindungi undang-undang.", en: "All rights reserved." })}
          </span>
          <div className="flex gap-4">
            <a href={siteConfig.links.twitter} target="_blank" rel="noreferrer" className="hover:underline">
              Twitter / X
            </a>
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="hover:underline">
              GitHub Catalog
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
