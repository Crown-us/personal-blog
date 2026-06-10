"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Eye, Edit3, Image as ImageIcon, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { categories } from "@/config/categories";

// List of high-quality default images for quick cover selection
const UNSPLASH_SUGGESTIONS = [
  { label: "AI & Neural Networks", url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80" },
  { label: "Coding & Code Editor", url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80" },
  { label: "Workplace & Focus", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80" },
  { label: "SEO & Growth Analytics", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80" },
];

export default function CreateTutorialPage() {
  const { t, language } = useLanguage();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categorySlug, setCategorySlug] = useState("developer-tools");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  // UX states
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-calculated metrics
  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  // Handle Unsplash suggestion selection
  const handleSelectSuggestion = (url: string) => {
    setCoverImageUrl(url);
  };

  // Custom regex markdown parser for live preview
  const previewHtml = useMemo(() => {
    if (!content) return `<p class="text-muted-foreground/60 italic">${t({ id: "Ketik sesuatu di tab Edit untuk melihat pratinjau...", en: "Type something in the Edit tab to see a preview..." })}</p>`;
    
    let html = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks: ```js ... ```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-secondary/60 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-border/80 my-4 text-foreground"><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded font-mono text-[11px] border border-border/80 text-foreground">$1</code>');

    // Headers: # Title, ## Subtitle, etc.
    html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3 text-foreground">$1</h1>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2.5 text-foreground">$1</h2>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-foreground">$1</h3>');

    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');

    // Italic: *text*
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

    // Lists: - item
    html = html.replace(/^\s*-\s+(.+)$/gm, '<li class="list-disc ml-5 mb-1 text-muted-foreground">$1</li>');

    // Blockquotes: > quote
    html = html.replace(/^\s*>\s+(.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-3 text-muted-foreground italic">$1</blockquote>');

    // Line breaks / paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4 text-sm leading-relaxed text-muted-foreground">');
    
    return `<p class="mb-4 text-sm leading-relaxed text-muted-foreground">${html}</p>`
      .replace(/<p class="mb-4 text-sm leading-relaxed text-muted-foreground"><h/g, '<h')
      .replace(/<\/h(\d)><\/p>/g, '</h$1>')
      .replace(/<p class="mb-4 text-sm leading-relaxed text-muted-foreground"><pre/g, '<pre')
      .replace(/<\/pre><\/p>/g, '</pre>');
  }, [content, t]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent, finalStatus: "draft" | "published") => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    if (!title.trim()) {
      setErrorMessage(t({ id: "Judul tutorial tidak boleh kosong.", en: "Tutorial title cannot be empty." }));
      setIsSubmitting(false);
      return;
    }

    if (!content.trim()) {
      setErrorMessage(t({ id: "Konten tutorial tidak boleh kosong.", en: "Tutorial content cannot be empty." }));
      setIsSubmitting(false);
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt: excerpt || title.slice(0, 120),
          content,
          coverImageUrl,
          categorySlug,
          status: finalStatus,
          tags: tagsArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t({ id: "Gagal menyimpan tutorial.", en: "Failed to save tutorial." }));
      }

      setSuccessMessage(
        finalStatus === "published"
          ? t({ id: "Tutorial Anda berhasil dipublikasikan!", en: "Your tutorial was successfully published!" })
          : t({ id: "Draf tutorial berhasil disimpan!", en: "Tutorial draft was saved successfully!" })
      );

      // Redirect back to dashboard after brief delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || t({ id: "Terjadi kesalahan.", en: "An error occurred." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 border border-border hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <BookOpen className="h-5 w-5 text-primary" />
                {t({ id: "Tulis Tutorial Baru", en: "Write New Tutorial" })}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t({
                  id: "Bagikan panduan pengembangan, tips pemrograman, atau panduan devtools Anda.",
                  en: "Share development guides, coding tips, or walkthroughs of your devtools."
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={isSubmitting}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/40 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {t({ id: "Simpan Draf", en: "Save Draft" })}
            </button>
            <button
              onClick={(e) => handleSubmit(e, "published")}
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all flex items-center gap-1.5 shadow-md shadow-primary/10 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {t({ id: "Publikasikan", en: "Publish Now" })}
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3 border border-rose-500/20 bg-rose-500/5 text-rose-500 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Editing Block */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Editor vs Preview Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("edit")}
                className={`py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "edit"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                {t({ id: "Tulis", en: "Edit Content" })}
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === "preview"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                {t({ id: "Pratinjau", en: "Live Preview" })}
              </button>
            </div>

            {activeTab === "edit" ? (
              /* Edit Pane */
              <div className="space-y-4">
                
                {/* Title Input */}
                <input
                  type="text"
                  placeholder={t({ id: "Judul Tutorial...", en: "Tutorial Title..." })}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-border/80 focus:border-primary text-2xl font-extrabold focus:outline-none py-2 text-foreground placeholder:text-muted-foreground/40"
                />

                {/* Excerpt Input */}
                <textarea
                  placeholder={t({
                    id: "Ringkasan singkat tentang apa yang dibahas dalam tutorial ini (excerpt)...",
                    en: "Write a short summary (excerpt) of what this tutorial covers..."
                  })}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border border-border/70 rounded-xl focus:border-primary text-xs focus:outline-none p-3 text-muted-foreground placeholder:text-muted-foreground/50 resize-none"
                />

                {/* Content Editor */}
                <div className="relative border border-border rounded-2xl bg-card overflow-hidden focus-within:border-primary">
                  {/* Toolbar */}
                  <div className="bg-secondary/40 border-b border-border/60 py-2 px-3 flex gap-2 text-[10px] font-semibold text-muted-foreground">
                    <span>Markdown Shortcuts:</span>
                    <button type="button" onClick={() => setContent(c => c + "\n# ")} className="hover:text-foreground"># H1</button>
                    <button type="button" onClick={() => setContent(c => c + "\n## ")} className="hover:text-foreground">## H2</button>
                    <button type="button" onClick={() => setContent(c => c + " **bold** ")} className="hover:text-foreground">**Bold**</button>
                    <button type="button" onClick={() => setContent(c => c + " *italic* ")} className="hover:text-foreground">*Italic*</button>
                    <button type="button" onClick={() => setContent(c => c + "\n- ")} className="hover:text-foreground">- List</button>
                    <button type="button" onClick={() => setContent(c => c + "\n```javascript\n\n```")} className="hover:text-foreground">Codeblock</button>
                  </div>

                  <textarea
                    placeholder={t({
                      id: "Tulis isi tutorial di sini menggunakan sintaks Markdown...",
                      en: "Write the tutorial content here using Markdown syntax..."
                    })}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={16}
                    className="w-full bg-transparent p-4 text-xs font-mono focus:outline-none text-foreground placeholder:text-muted-foreground/30 resize-y leading-relaxed"
                  />
                  
                  {/* Word count footer */}
                  <div className="bg-secondary/20 border-t border-border/40 py-1.5 px-4 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>{wordCount} {t({ id: "kata", en: "words" })}</span>
                    <span>~{readingTime} {t({ id: "menit baca", en: "min read" })}</span>
                  </div>
                </div>

              </div>
            ) : (
              /* Preview Pane */
              <div className="rounded-2xl border border-border bg-card p-6 min-h-[400px] shadow-sm">
                
                {/* Simulated Article Header */}
                <div className="space-y-4 pb-6 border-b border-border/60 mb-6">
                  {coverImageUrl && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-secondary/20 border border-border/40">
                      <img src={coverImageUrl} alt={title} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/5 px-2.5 py-1 rounded border border-primary/10 inline-block">
                    {categories.find((c) => c.slug === categorySlug)?.name || categorySlug}
                  </span>
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                    {title || t({ id: "Judul Tutorial", en: "Tutorial Title" })}
                  </h1>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    {excerpt || t({ id: "Belum ada ringkasan.", en: "No summary provided." })}
                  </p>
                </div>

                {/* Rendered HTML */}
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            )}
          </div>

          {/* Settings Sidebar Panel */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2.5">
                {t({ id: "Pengaturan Artikel", en: "Article Settings" })}
              </h3>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                  {t({ id: "Kategori", en: "Category" })}
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground capitalize"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug} className="text-foreground">
                      {language === "en" ? cat.name : cat.slug === "ai-tools" ? "Alat AI" : cat.slug === "productivity" ? "Produktivitas" : cat.slug === "developer-tools" ? "Alat Developer" : cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                  {t({ id: "Tag (pisahkan dengan koma)", en: "Tags (comma separated)" })}
                </label>
                <input
                  type="text"
                  placeholder="nextjs, chrome-extension, seo"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Cover Image Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {t({ id: "URL Gambar Sampul", en: "Cover Image URL" })}
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/45"
                />

                {/* Suggestions Gallery */}
                <div className="space-y-1.5 pt-1.5">
                  <span className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                    {t({ id: "Rekomendasi Gambar:", en: "Suggested Cover Images:" })}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {UNSPLASH_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(sug.url)}
                        className={`h-11 rounded-lg border overflow-hidden relative group text-left transition-all ${
                          coverImageUrl === sug.url 
                            ? "border-primary ring-1 ring-primary" 
                            : "border-border/60 hover:border-border"
                        }`}
                      >
                        <img src={sug.url} alt={sug.label} className="object-cover w-full h-full filter brightness-[0.45] group-hover:scale-102 transition-transform" />
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white text-center px-1 truncate">
                          {sug.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>
    </PageWrapper>
  );
}
