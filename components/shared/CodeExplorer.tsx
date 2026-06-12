"use client";

import React, { useState, useRef } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Bot, 
  Sparkles, 
  Send, 
  Terminal, 
  Layers, 
  RefreshCw, 
  Cpu 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectCodeStructures, CodeFile, CodeFolder, CodeNode } from "@/config/code-structures";
import { useLanguage } from "@/components/LanguageProvider";

interface CodeExplorerProps {
  slug: string;
}

// Helper to find the first file in a directory tree recursively
const findFirstFile = (folder: CodeFolder): CodeFile | null => {
  for (const child of folder.children) {
    if (child.type === "file") {
      return child;
    } else {
      const file = findFirstFile(child);
      if (file) return file;
    }
  }
  return null;
};

export default function CodeExplorer({ slug }: CodeExplorerProps) {
  const { t } = useLanguage();
  const projectStructure = projectCodeStructures[slug];
  
  const firstFile = projectStructure ? findFirstFile(projectStructure.root) : null;

  const [activeFile, setActiveFile] = useState<CodeFile | null>(firstFile);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (projectStructure) {
      initial[projectStructure.root.name] = true;
      initial["lib"] = true;
      initial["app"] = true;
      initial["src"] = true;
    }
    return initial;
  });
  const [aiExplanation, setAiExplanation] = useState<string>(firstFile ? firstFile.explanation : "");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  
  // Mobile UI Tabs: "files" | "code" | "ai"
  const [activeTab, setActiveTab] = useState<"files" | "code" | "ai">("code");
  
  const aiResponseRef = useRef<HTMLDivElement>(null);

  if (!projectStructure) {
    return null; // Don't render if project structure mock data doesn't exist
  }

  const handleToggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const handleSelectFile = (file: CodeFile) => {
    setActiveFile(file);
    setAiExplanation(file.explanation);
    setCustomQuestion("");
    // Automatically switch to code tab on mobile
    if (window.innerWidth < 1024) {
      setActiveTab("code");
    }
  };

  const handleAskAI = async (e?: React.FormEvent, questionText?: string) => {
    if (e) e.preventDefault();
    if (!activeFile) return;

    const query = questionText || customQuestion;
    if (!query && questionText === undefined) return;

    setIsAiLoading(true);
    if (!questionText) setCustomQuestion("");

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: activeFile.path,
          code: activeFile.code,
          language: activeFile.language,
          question: query
        })
      });

      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
        // If on mobile, switch to AI tab so they see response
        if (window.innerWidth < 1024) {
          setActiveTab("ai");
        }
        // Smooth scroll to explanation top
        setTimeout(() => {
          aiResponseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        throw new Error("Gagal mengambil penjelasan");
      }
    } catch (error) {
      console.error(error);
      setAiExplanation("Aduh bro, gagal terhubung ke Asisten AI. Coba klik ulang tombol penjelasannya ya!");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Basic syntax highlighter helper
  const highlightCode = (code: string, language: string) => {
    if (!code) return "";
    
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (language === "typescript" || language === "javascript") {
      // Keywords
      escaped = escaped.replace(
        /\b(import|export|default|const|let|var|function|return|async|await|try|catch|if|else|throw|new|from|class|extends|interface|type|typeof|any|string|number|boolean|void)\b/g,
        '<span class="text-indigo-400 font-semibold">$1</span>'
      );
      // Strings
      escaped = escaped.replace(
        /(['"`])(.*?)\1/g,
        '<span class="text-emerald-400">$1$2$1</span>'
      );
      // Comments
      escaped = escaped.replace(
        /(\/\/.*)/g,
        '<span class="text-muted-foreground/60 italic">$1</span>'
      );
      // Numbers
      escaped = escaped.replace(
        /\b(\d+)\b/g,
        '<span class="text-amber-400">$1</span>'
      );
    } else if (language === "php") {
      // Keywords
      escaped = escaped.replace(
        /\b(namespace|use|class|extends|public|protected|private|function|return|if|else|session|foreach|as)\b/g,
        '<span class="text-indigo-400 font-semibold">$1</span>'
      );
      // Variables
      escaped = escaped.replace(
        /(\$[a-zA-Z0-9_]+)/g,
        '<span class="text-sky-400">$1</span>'
      );
      // Strings
      escaped = escaped.replace(
        /(['"`])(.*?)\1/g,
        '<span class="text-emerald-400">$1$2$1</span>'
      );
      // Comments
      escaped = escaped.replace(
        /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
        '<span class="text-muted-foreground/60 italic">$1</span>'
      );
    }

    return escaped;
  };

  // Recursive tree renderer
  const renderTree = (node: CodeNode, depth = 0) => {
    const isFolder = node.type === "folder";
    const isExpanded = expandedFolders[node.path || node.name];

    if (isFolder) {
      const folder = node as CodeFolder;
      return (
        <div key={folder.path || folder.name} className="select-none">
          <button
            onClick={() => handleToggleFolder(folder.path || folder.name)}
            className="flex items-center gap-1.5 w-full py-1 hover:bg-secondary/40 rounded-lg text-left text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors px-1"
            style={{ paddingLeft: `${depth * 8 + 4}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            ) : (
              <Folder className="h-3.5 w-3.5 shrink-0 text-indigo-400/80" />
            )}
            <span className="truncate">{folder.name}</span>
          </button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                {folder.children.map(child => renderTree(child, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    } else {
      const file = node as CodeFile;
      const isActive = activeFile?.path === file.path;
      return (
        <button
          key={file.path}
          onClick={() => handleSelectFile(file)}
          className={`flex items-center gap-1.5 w-full py-1.5 rounded-lg text-left text-xs font-medium transition-all px-2 ${
            isActive 
              ? "bg-primary/10 text-primary border-l-2 border-primary" 
              : "hover:bg-secondary/30 text-muted-foreground hover:text-foreground border-l-2 border-transparent"
          }`}
          style={{ paddingLeft: `${depth * 8 + 14}px` }}
        >
          <FileCode className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="truncate">{file.name}</span>
        </button>
      );
    }
  };

  // AI text parser for simple markdown formatting (bold, checklist, backticks)
  const formatAiText = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Inline code backticks
    html = html.replace(/`(.*?)`/g, '<code class="bg-zinc-800 text-amber-400 px-1 py-0.5 rounded text-[11px] font-semibold">$1</code>');
    
    // Bullet points
    const lines = html.split("\n");
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return `<li class="ml-4 list-disc my-1.5 leading-relaxed text-xs text-muted-foreground">${trimmed.substring(2)}</li>`;
      }
      if (trimmed.match(/^\d+\.\s/)) {
        const numContent = trimmed.replace(/^\d+\.\s/, "");
        return `<li class="ml-4 list-decimal my-1.5 leading-relaxed text-xs text-muted-foreground">${numContent}</li>`;
      }
      return line;
    });

    html = formatted.join("\n");
    
    // Custom header tags
    html = html.replace(/### (.*?)\n/g, '<h4 class="text-xs font-bold text-foreground mt-4 mb-2 uppercase tracking-wide border-b pb-1">$1</h4>');
    html = html.replace(/## (.*?)\n/g, '<h3 class="text-sm font-extrabold text-foreground mt-5 mb-2">$1</h3>');
    
    // Newlines
    html = html.replace(/\n\n/g, '<div class="h-3"></div>');
    html = html.replace(/\n/g, "<br/>");
    
    return html;
  };

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl flex flex-col mt-10">
      
      {/* Window Mock Bar Header */}
      <div className="bg-secondary/40 border-b border-border/80 px-4 py-3.5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          {/* Traffic Lights buttons */}
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          
          <div className="flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-foreground tracking-tight select-none">
              {projectStructure.root.name} &mdash; Sandbox Explorer
            </span>
          </div>
        </div>

        {/* Action Status Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary px-2.5 py-1 rounded bg-primary/5 border border-primary/10">
          <Cpu className="h-3.5 w-3.5 animate-pulse text-primary" />
          {t({ id: "Live Preview", en: "Live Preview" })}
        </div>
      </div>

      {/* Tab Selectors for Mobile/Tablet */}
      <div className="lg:hidden flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab("files")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-colors ${
            activeTab === "files" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          📂 {t({ id: "Berkas", en: "Files" })}
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-colors ${
            activeTab === "code" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          💻 {t({ id: "Kode", en: "Code" })}
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-colors ${
            activeTab === "ai" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          🤖 AI {t({ id: "Jelaskan", en: "Explain" })}
        </button>
      </div>

      {/* Main Panel Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[460px] h-[520px] items-stretch">
        
        {/* Column 1: File Tree Selector (Hidden on mobile unless active) */}
        <div className={`lg:col-span-1 border-r border-border bg-zinc-950/15 backdrop-blur-sm p-4 overflow-y-auto ${
          activeTab === "files" ? "block" : "hidden lg:block"
        }`}>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-3">
              {t({ id: "Struktur Direktori", en: "Directory Tree" })}
            </h4>
            {renderTree(projectStructure.root)}
          </div>
        </div>

        {/* Column 2 & 3: Code Editor Workspace (Hidden on mobile unless active) */}
        <div className={`lg:col-span-2 border-r border-border bg-zinc-950 flex flex-col overflow-hidden relative ${
          activeTab === "code" ? "flex" : "hidden lg:flex"
        }`}>
          {activeFile ? (
            <>
              {/* File tab header */}
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-mono text-zinc-300 font-medium flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                  {activeFile.path}
                </span>
                <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded select-none">
                  {activeFile.language}
                </span>
              </div>

              {/* Code Panel Display */}
              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed flex items-start select-text selection:bg-indigo-500/30">
                {/* Line numbers mock panel */}
                <div className="text-zinc-600 text-right pr-4 select-none border-r border-zinc-800/80 mr-4 font-mono w-6">
                  {activeFile.code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Real highlighted code */}
                <pre className="overflow-visible whitespace-pre m-0">
                  <code 
                    dangerouslySetInnerHTML={{ 
                      __html: highlightCode(activeFile.code, activeFile.language) 
                    }} 
                  />
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500 gap-2">
              <Layers className="h-10 w-10 text-zinc-700 animate-pulse" />
              <p className="text-xs">{t({ id: "Pilih file dari direktori untuk membacanya.", en: "Select a file from directory to read contents." })}</p>
            </div>
          )}
        </div>

        {/* Column 4: AI Code Explainer Box (Hidden on mobile unless active) */}
        <div className={`lg:col-span-1 bg-secondary/15 p-4 flex flex-col overflow-hidden ${
          activeTab === "ai" ? "flex" : "hidden lg:flex"
        }`}>
          {activeFile ? (
            <>
              {/* AI Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-primary text-white flex items-center justify-center shadow-sm">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Asisten AI RoketDev</h4>
                    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Gemini 2.5 Flash</p>
                  </div>
                </div>

                {/* Ask Gemini Review button */}
                <button
                  onClick={() => handleAskAI()}
                  disabled={isAiLoading}
                  title="Minta Gemini mengulas baris kode secara mendalam"
                  className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isAiLoading ? 'animate-spin text-primary' : ''}`} />
                </button>
              </div>

              {/* Explanations Display Scrollable */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 select-text">
                
                {/* Explanation text container */}
                <div ref={aiResponseRef} className="space-y-3">
                  {isAiLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3">
                      <div className="relative">
                        <Sparkles className="h-8 w-8 text-primary animate-spin" />
                        <span className="absolute -inset-1 rounded-full bg-primary/20 blur animate-ping" />
                      </div>
                      <span className="text-xs font-medium animate-pulse">{t({ id: "AI sedang meneliti kode...", en: "AI is analyzing code logic..." })}</span>
                    </div>
                  ) : (
                    <div 
                      className="text-xs text-muted-foreground leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: formatAiText(aiExplanation) }}
                    />
                  )}
                </div>

                {/* Suggestion Chips */}
                {!isAiLoading && (
                  <div className="pt-2 border-t border-border/40 space-y-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">{t({ id: "Tanya Cepat:", en: "Quick Questions:" })}</span>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleAskAI(undefined, "Bagaimana alur logic penulisan kode ini?")}
                        className="text-[10px] text-left px-2 py-1.5 rounded-lg border border-border hover:border-primary/40 bg-card hover:bg-primary/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                      >
                        ⚡ {t({ id: "Bagaimana alur logikanya?", en: "Explain code architecture logic?" })}
                      </button>
                      <button
                        onClick={() => handleAskAI(undefined, "Apakah ada potensi bug keamanan atau optimasi di kode ini?")}
                        className="text-[10px] text-left px-2 py-1.5 rounded-lg border border-border hover:border-primary/40 bg-card hover:bg-primary/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                      >
                        🛡️ {t({ id: "Apakah ada potensi bug / optimasi?", en: "Security check or optimisations?" })}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Ask Input form */}
              <form onSubmit={handleAskAI} className="mt-3 pt-3 border-t border-border/80 flex items-center gap-1.5 shrink-0">
                <input
                  type="text"
                  placeholder={t({ id: "Tanya AI tentang file ini...", en: "Ask AI about this file..." })}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  disabled={isAiLoading}
                  className="w-full bg-card border border-border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 disabled:opacity-50 text-foreground"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !customQuestion.trim()}
                  className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-muted-foreground gap-2">
              <Bot className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-[11px]">{t({ id: "Pilih file untuk melihat ulasan AI.", en: "Select a file to run AI analysis review." })}</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
