"use client";

import React, { use, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { mockBlogPosts, mockExtensions, mockSourceCodes } from "@/config/mock-data";
import { Calendar, Clock, ChevronLeft, ArrowRight, Share2, Tag } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";

// Custom markdown preview renderer
function parseMarkdown(text: string): string {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-secondary/60 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-border/80 my-4 text-foreground"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded font-mono text-[11px] border border-border/80 text-foreground">$1</code>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-xl font-bold mt-6 mb-3 text-foreground">$1</h1>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2.5 text-foreground">$1</h2>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-2 text-foreground">$1</h3>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li class="list-disc ml-5 mb-1 text-muted-foreground">$1</li>');
  html = html.replace(/^\s*>\s+(.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-3 text-muted-foreground italic">$1</blockquote>');
  html = html.replace(/\n\n/g, '</p><p class="mb-4 text-sm sm:text-base leading-relaxed text-muted-foreground">');
  
  return `<p class="mb-4 text-sm sm:text-base leading-relaxed text-muted-foreground">${html}</p>`
    .replace(/<p class="mb-4 text-sm sm:text-base leading-relaxed text-muted-foreground"><h/g, '<h')
    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
    .replace(/<p class="mb-4 text-sm sm:text-base leading-relaxed text-muted-foreground"><pre/g, '<pre')
    .replace(/<\/pre><\/p>/g, '</pre>');
}

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { language, t, dict, tBlog, tExtension, tSourceCode } = useLanguage();

  const [dbPost, setDbPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.posts.find((p: any) => p.slug === slug);
          if (found) {
            setDbPost(found);
          }
        }
      })
      .catch((err) => console.error("Error fetching blog post:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const post = useMemo(() => {
    if (dbPost) {
      return {
        ...dbPost,
        category: dbPost.categorySlug?.replace("-", " ") || "General",
        tags: dbPost.tags || [],
      };
    }
    const orig = mockBlogPosts.find((p) => p.slug === slug);
    return orig ? tBlog(orig) : null;
  }, [dbPost, slug, tBlog]);

  // Embed a contextual extension inside the blog post
  const embeddedExtension = useMemo(() => {
    if (!post) return null;
    let ext;
    if (post.category === "AI Tools" || post.category === "Alat AI") {
      ext = mockExtensions.find((e) => e.slug === "chatgpt-sidebar");
    } else if (post.category === "Writing" || post.category === "Penulisan") {
      ext = mockExtensions.find((e) => e.slug === "grammarly-go");
    } else if (post.category === "Privacy & Security" || post.category === "Privasi & Keamanan") {
      ext = mockExtensions.find((e) => e.slug === "ublock-origin-secure");
    } else {
      ext = mockExtensions[0];
    }
    return tExtension(ext);
  }, [post, tExtension]);

  const relatedSourceCodes = useMemo(() => {
    if (!post || !post.relatedSourceCodeIds) return [];
    const ids = post.relatedSourceCodeIds;
    return mockSourceCodes.filter((item) => ids.includes(item.id)).map(tSourceCode);
  }, [post, tSourceCode]);

  const relatedExtensions = useMemo(() => {
    if (!post || !post.relatedExtensionIds) return [];
    const ids = post.relatedExtensionIds;
    return mockExtensions.filter((ext) => ids.includes(ext.id)).map(tExtension);
  }, [post, tExtension]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return mockBlogPosts.filter((p) => p.id !== post.id).slice(0, 2).map(tBlog);
  }, [post, tBlog]);

  const getTranslatedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      language === "id" ? "id-ID" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  if (!post) {
    return (
      <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t({ id: "Postingan Tidak Ditemukan", en: "Post Not Found" })}</h1>
        <p className="text-muted-foreground mt-2">{t({ id: "Postingan blog yang Anda cari tidak ada.", en: "The blog post you are looking for does not exist." })}</p>
        <Link href="/blog" className="mt-4 inline-block text-primary hover:underline">
          {t({ id: "Kembali ke Blog", en: "Back to Blog" })}
        </Link>
      </div>
    );
  }

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          {t({ id: "Kembali ke semua artikel", en: "Back to all articles" })}
        </Link>

        {/* Article header */}
        <article className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between border-y border-border/60 py-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {getTranslatedDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTimeMinutes} {t({ id: "menit baca", en: "min read" })}
              </span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert(language === "id" ? "Tautan berhasil disalin!" : "Link copied to clipboard!");
              }}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Share2 className="h-3.5 w-3.5" />
              {t({ id: "Bagikan Link", en: "Share Link" })}
            </button>
          </div>

          {/* Cover image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-card">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content Body */}
          {dbPost ? (
            <div 
              className="prose dark:prose-invert max-w-none py-6 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none py-6 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>{post.content}</p>
              
              <h3 className="text-lg font-bold text-foreground pt-4">
                {t({
                  id: "Mengapa menjalankan model di dalam ekstensi browser menyederhanakan kompleksitas UI",
                  en: "Why running models inside browser extensions simplifies UI complexity"
                })}
              </h3>
              <p>
                {t({
                  id: "Biasanya, menyalin-tempel blok kode, template email, atau ringkasan artikel dari bidang teks ke modul obrolan menimbulkan gesekan tata letak yang besar. Integrasi langsung ke panel samping browser atau menu konteks klik kanan Anda memungkinkan Anda meringkas konten dalam 1 klik.",
                  en: "Typically, copy-pasting code blocks, email templates, or article briefs from text fields over to chat modules creates major layout friction. A direct integration into your browser side-panel or right-click context menu lets you summarize content in 1-click."
                })}
              </p>

              {/* Contextual Curation Box Widget */}
              {embeddedExtension && (
                <div className="my-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row gap-6 justify-between items-center shadow-lg shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl shrink-0 bg-secondary/80 p-2.5 rounded-xl border border-border">
                      {embeddedExtension.logoUrl}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                        {t({ id: "Rekomendasi Ekstensi Pilihan", en: "Featured Extension recommendation" })}
                      </span>
                      <h4 className="font-extrabold text-sm text-foreground mt-1">{embeddedExtension.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{embeddedExtension.tagline}</p>
                    </div>
                  </div>

                  <a
                    href={embeddedExtension.affiliateUrl || embeddedExtension.chromeStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shrink-0 flex items-center gap-1"
                  >
                    {t({ id: "Pasang Ekstensi", en: "Install Extension" })}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              <p>
                {t({
                  id: "Ketika log audit diverifikasi, peringkat keamanan pengguna diperbarui. Dalam beberapa minggu mendatang kami akan menganalisis dan mengatalogkan lebih banyak plugin, memastikan bahwa izin manifes mengikuti panduan browser.",
                  en: "When audit logs are verified, user security rankings are updated. In the upcoming weeks we will be analyzing and cataloging more plugins, making sure that manifest permissions follow browser guidelines."
                })}
              </p>
            </div>
          )}

          {/* Tags list */}
          <div className="flex flex-wrap gap-2 pt-4">
            {post.tags.map((tag: string) => (
              <span 
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-secondary text-muted-foreground border border-border"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* Related Source Codes */}
        {relatedSourceCodes.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              📂 {t({ id: "Produk Source Code Terkait", en: "Related Source Code Products" })}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedSourceCodes.map((code) => (
                <div key={code.id} className="market-card flex flex-col justify-between rounded-xl p-4 transition-all duration-200">
                  <div>
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/80 border border-border text-2xl font-bold">
                        {code.thumbnail}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <Link 
                          href={`/source-code/${code.slug}`}
                          className="block font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
                        >
                          {code.name}
                        </Link>
                        <span className="block text-[11px] text-muted-foreground truncate">
                          {code.techStack.join(" + ")}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed h-[34px]">
                      {code.tagline}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-foreground">
                      <span className="text-primary font-bold">{code.price}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 flex gap-2">
                    <Link
                      href={`/source-code/${code.slug}`}
                      className="flex-1 text-center text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all"
                    >
                      {dict["common.viewDetails"]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Extensions */}
        {relatedExtensions.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              🧩 {t({ id: "Ekstensi yang Direkomendasikan", en: "Recommended Extensions" })}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedExtensions.map((ext) => (
                <div key={ext.id} className="market-card flex flex-col justify-between rounded-xl p-4 transition-all duration-200">
                  <div>
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/80 border border-border text-2xl font-bold">
                        {ext.logoUrl}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <Link 
                          href={`/extensions/${ext.slug}`}
                          className="block font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
                        >
                          {ext.name}
                        </Link>
                        <span className="block text-[11px] text-muted-foreground truncate">
                          {ext.tagline}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 flex gap-2">
                    <Link
                      href={`/extensions/${ext.slug}`}
                      className="flex-1 text-center text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all"
                    >
                      {dict["common.viewDetails"]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-6">
              📰 {t({ id: "Artikel Terkait", en: "Related Articles" })}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rp) => (
                <div key={rp.id} className="group border border-border rounded-2xl bg-card p-5 space-y-3 hover:border-primary/30 transition-all">
                  <span className="text-[10px] font-semibold text-primary uppercase">{rp.category}</span>
                  <Link href={`/blog/${rp.slug}`}>
                    <h4 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {rp.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2">{rp.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </PageWrapper>
  );
}
