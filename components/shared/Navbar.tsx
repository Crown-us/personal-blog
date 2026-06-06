"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Plus,
  LayoutDashboard,
  Search,
  Layers,
  Globe
} from "lucide-react";
import { navigation } from "@/config/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { language, setLanguage, dict } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getTranslatedLabel = (label: string) => {
    switch (label) {
      case "DevTools": return dict["nav.devtools"];
      case "Source Code": return dict["nav.sourceCode"];
      case "Bundles": return dict["nav.bundles"];
      case "Showcase": return dict["nav.showcase"];
      case "Tutorials": return dict["nav.blog"];
      default: return label;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-all h-14">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              ⚡
            </span>
            <span>
              Extension<span className="text-primary font-bold">Hub</span>
            </span>
          </Link>

          {/* Directory nav links */}
          <nav className="hidden md:flex items-center gap-4">
            {navigation.main.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold transition-colors hover:text-foreground relative py-1 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {getTranslatedLabel(item.label)}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Inline Search for navigation comfort */}
        {pathname !== "/" && (
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center bg-secondary/80 border border-border rounded-lg px-2.5 py-1 w-64 text-xs"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
            <input
              type="text"
              placeholder={dict["nav.searchPlaceholder"]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent focus:outline-none text-foreground w-full placeholder:text-muted-foreground/60"
            />
          </form>
        )}

        {/* Right Side: CTAs & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          
          <Link
            href="/compare"
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-border bg-secondary/35 text-foreground hover:bg-secondary transition-all"
          >
            <Layers className="h-3 w-3" />
            {dict["nav.compare"]}
          </Link>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all"
              aria-label="Change Language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}</span>
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-1.5 w-20 origin-top-right rounded-xl border border-border bg-card p-1 shadow-lg ring-1 ring-black/5 z-50"
                  >
                    <button
                      onClick={() => {
                        setLanguage("id");
                        setIsLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                        language === "id" 
                          ? "bg-secondary text-foreground font-bold" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <span>🇮🇩</span> ID
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setIsLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                        language === "en" 
                          ? "bg-secondary text-foreground font-bold" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <span>🇬🇧</span> EN
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            aria-label="Toggle Theme"
          >
            <Sun className="h-3.5 w-3.5 dark:hidden" />
            <Moon className="h-3.5 w-3.5 hidden dark:block" />
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            {dict["nav.console"]}
          </Link>

          <Link
            href="/submit"
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            {dict["nav.submit"]}
          </Link>
        </div>

        {/* Mobile toggles */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile Language Button Toggle */}
          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-bold text-muted-foreground"
            aria-label="Change Language"
          >
            {language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
          >
            <Sun className="h-3.5 w-3.5 dark:hidden" />
            <Moon className="h-3.5 w-3.5 hidden dark:block" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col gap-2">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold py-1.5 text-muted-foreground hover:text-foreground"
                >
                  {getTranslatedLabel(item.label)}
                </Link>
              ))}
            </nav>
            
            <hr className="border-border" />
            
            <div className="flex items-center justify-between pt-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                {dict["nav.console"]} Dashboard
              </Link>
              
              <Link
                href="/submit"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                {dict["nav.submit"]}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
