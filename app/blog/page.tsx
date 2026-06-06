"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { mockBlogPosts } from "@/config/mock-data";
import { Calendar, Clock, BookOpen, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

export default function BlogIndex() {
  const { language, t, dict, tBlog } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const list = new Set(mockBlogPosts.map(tBlog).map((post) => post.category));
    return ["all", ...Array.from(list)];
  }, [tBlog]);

  const filteredPosts = useMemo(() => {
    const translated = mockBlogPosts.map(tBlog);
    if (activeCategory === "all") return translated;
    return translated.filter((post) => post.category === activeCategory);
  }, [activeCategory, tBlog]);

  const featuredPost = useMemo(() => {
    const translated = mockBlogPosts.map(tBlog);
    return translated.find((post) => post.isFeatured) || translated[0];
  }, [tBlog]);

  const otherPosts = useMemo(() => {
    return filteredPosts.filter((post) => post.id !== featuredPost?.id);
  }, [filteredPosts, featuredPost]);

  const getTranslatedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      language === "id" ? "id-ID" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title Header */}
        <div className="border-b border-border pb-6 mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center justify-center sm:justify-start gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            {t({ id: "Blog RoketDev", en: "RoketDev Blog" })}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t({
              id: "Tips SEO, panduan privasi browser, ulasan ekstensi, dan alur kerja produktivitas.",
              en: "SEO tips, browser privacy guides, extension reviews, and productivity workflows."
            })}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border/40 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all capitalize ${
                activeCategory === cat
                  ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/15"
                  : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "all" ? t({ id: "Semua Postingan", en: "All Posts" }) : cat}
            </button>
          ))}
        </div>

        {/* Featured Post (only show if viewing all or the featured post's category) */}
        {featuredPost && (activeCategory === "all" || featuredPost.category === activeCategory) && (
          <section className="mb-12">
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg hover:border-primary/30 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Cover Image */}
                <div className="lg:col-span-7 relative min-h-[300px] bg-secondary/30">
                  <img
                    src={featuredPost.coverImageUrl}
                    alt={featuredPost.title}
                    className="object-cover w-full h-full group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-primary-foreground uppercase tracking-wide">
                    {t({ id: "Pilihan", en: "Featured" })}
                  </span>
                </div>

                {/* Details */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                    
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {getTranslatedDate(featuredPost.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredPost.readingTimeMinutes} {t({ id: "menit baca", en: "min read" })}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="text-primary font-semibold flex items-center gap-1 hover:underline"
                    >
                      {t({ id: "Baca selengkapnya", en: "Read full" })}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Post Grid (Other Posts) */}
        {otherPosts.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground text-sm">
            {t({ id: "Tidak ada postingan lain yang ditemukan dalam kategori ini.", en: "No other posts found in this category." })}
          </p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <div
                key={post.id}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all shadow-md"
              >
                <div>
                  {/* Cover */}
                  <div className="relative aspect-video bg-secondary/30 overflow-hidden">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/5 px-2.5 py-1 rounded border border-primary/10">
                      {post.category}
                    </span>
                    
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mx-5 pb-5 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTimeMinutes} {t({ id: "menit baca", en: "min read" })}
                  </span>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary font-semibold flex items-center gap-0.5 hover:underline"
                  >
                    {t({ id: "Baca", en: "Read" })}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </PageWrapper>
  );
}
