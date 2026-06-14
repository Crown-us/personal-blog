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
  Cpu,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectCodeStructures, CodeFile, CodeFolder, CodeNode } from "@/config/code-structures";
import { useLanguage } from "@/components/LanguageProvider";
import MarkdownRenderer from "./MarkdownRenderer";

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

// Helper to get styled file type icons
const getFileIcon = (fileName: string, isActive: boolean) => {
  const ext = fileName.split(".").pop();
  if (fileName === "package.json") {
    return <span className={`text-[12px] font-bold ${isActive ? 'text-rose-400 animate-pulse' : 'text-rose-400/80'} select-none mr-0.5`}>⬢</span>;
  }
  if (ext === "json") {
    return <span className={`text-[12px] font-bold ${isActive ? 'text-amber-400' : 'text-amber-400/80'} select-none`}>{"{"}</span>;
  }
  if (ext === "ts" || ext === "tsx") {
    return <span className={`text-[9px] font-extrabold px-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 select-none mr-0.5 scale-90`}>TS</span>;
  }
  if (ext === "js" || ext === "jsx") {
    return <span className={`text-[9px] font-extrabold px-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 select-none mr-0.5 scale-90`}>JS</span>;
  }
  if (ext === "css") {
    return <span className={`text-[12px] font-extrabold ${isActive ? 'text-indigo-400' : 'text-indigo-400/80'} select-none`}>#</span>;
  }
  if (ext === "html") {
    return <span className={`text-[11px] font-bold ${isActive ? 'text-orange-400' : 'text-orange-400/80'} select-none`}>&lt;&gt;</span>;
  }
  return <FileCode className="h-3.5 w-3.5 shrink-0" />;
};

export default function CodeExplorer({ slug }: CodeExplorerProps) {
  const { t } = useLanguage();
  const projectStructure = projectCodeStructures[slug];
  
  const firstFile = projectStructure ? findFirstFile(projectStructure.root) : null;

  const [activeFile, setActiveFile] = useState<CodeFile | null>(firstFile);
  const [openTabs, setOpenTabs] = useState<CodeFile[]>(() => {
    return firstFile ? [firstFile] : [];
  });
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
    
    // Add to openTabs if not already present
    setOpenTabs(prev => {
      if (prev.some(t => t.path === file.path)) return prev;
      return [...prev, file];
    });

    // Automatically switch to code tab on mobile
    if (window.innerWidth < 1024) {
      setActiveTab("code");
    }
  };

  const handleCloseTab = (e: React.MouseEvent, fileToClose: CodeFile) => {
    e.stopPropagation();
    const updatedTabs = openTabs.filter(t => t.path !== fileToClose.path);
    setOpenTabs(updatedTabs);
    
    if (activeFile?.path === fileToClose.path) {
      if (updatedTabs.length > 0) {
        const nextActive = updatedTabs[updatedTabs.length - 1];
        setActiveFile(nextActive);
        setAiExplanation(nextActive.explanation);
      } else {
        setActiveFile(null);
        setAiExplanation("");
      }
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
          className={`flex items-center gap-1.5 w-full py-1.5 rounded-lg text-left text-xs font-medium transition-all px-2 focus:outline-none relative group ${
            isActive 
              ? "bg-primary/10 text-primary border-l-2 border-primary font-semibold" 
              : "hover:bg-secondary/35 text-muted-foreground hover:text-foreground border-l-2 border-transparent"
          }`}
          style={{ paddingLeft: `${depth * 8 + 14}px` }}
        >
          <span className="flex items-center gap-1 shrink-0">
            {getFileIcon(file.name, isActive)}
          </span>
          <span className="truncate group-hover:translate-x-0.5 transition-transform duration-150">{file.name}</span>
        </button>
      );
    }
  };

  // Removed old simple formatter in favor of robust MarkdownRenderer component

  return (
    <section className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col mt-10 transition-all duration-300 hover:shadow-indigo-500/5 hover:border-border">
      
      {/* Window Mock Bar Header */}
      <div className="bg-secondary/55 border-b border-border/80 px-4 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          {/* Traffic Lights buttons */}
          <div className="flex gap-1.5 select-none">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block hover:brightness-90 transition-all cursor-pointer" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block hover:brightness-90 transition-all cursor-pointer" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block hover:brightness-90 transition-all cursor-pointer" />
          </div>
          
          <div className="flex items-center gap-2 select-none">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground tracking-tight select-none">
              {projectStructure.root.name} &mdash; Sandbox Explorer
            </span>
          </div>
        </div>

        {/* Action Status Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 select-none shadow-sm shadow-primary/5">
          <Cpu className="h-3.5 w-3.5 animate-pulse text-primary" />
          {t({ id: "Live Preview", en: "Live Preview" })}
        </div>
      </div>

      {/* Tab Selectors for Mobile/Tablet */}
      <div className="lg:hidden flex border-b border-border bg-card/60 backdrop-blur-sm select-none">
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
        <div className={`lg:col-span-1 border-r border-border/80 bg-zinc-950/5 dark:bg-zinc-950/20 backdrop-blur-sm p-4 overflow-y-auto ${
          activeTab === "files" ? "block" : "hidden lg:block"
        }`}>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground/65 uppercase tracking-widest pl-2 mb-3 select-none">
              {t({ id: "Struktur Direktori", en: "Directory Tree" })}
            </h4>
            {renderTree(projectStructure.root)}
          </div>
        </div>

        {/* Column 2 & 3: Code Editor Workspace (Hidden on mobile unless active) */}
        <div className={`lg:col-span-2 border-r border-border/80 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/90 flex flex-col overflow-hidden relative ${
          activeTab === "code" ? "flex" : "hidden lg:flex"
        }`}>
          {activeFile ? (
            <>
              {/* File tabs row */}
              <div className="bg-zinc-900/95 border-b border-zinc-800 flex items-center overflow-x-auto shrink-0 scrollbar-none select-none">
                {openTabs.map((tab) => {
                  const isActive = activeFile?.path === tab.path;
                  return (
                    <button
                      key={tab.path}
                      onClick={() => handleSelectFile(tab)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono border-r border-zinc-850 transition-all select-none focus:outline-none relative ${
                        isActive
                          ? "bg-zinc-950 text-foreground font-semibold"
                          : "bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/70"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 to-primary" />
                      )}
                      <span className="flex items-center gap-1.5">
                        {getFileIcon(tab.name, isActive)}
                        {tab.name}
                      </span>
                      <span 
                        onClick={(e) => handleCloseTab(e, tab)}
                        className="p-0.5 rounded-full hover:bg-zinc-800/80 hover:text-rose-400 transition-colors text-[9px] font-bold text-zinc-500"
                      >
                        ✕
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* File detail breadcrumb bar */}
              <div className="bg-zinc-950/40 border-b border-zinc-900/85 px-4 py-1.5 flex items-center justify-between shrink-0 select-none">
                <span className="text-[10px] font-mono text-zinc-400 font-medium flex items-center gap-1">
                  <span className="text-muted-foreground">{projectStructure.root.name}</span>
                  <span className="text-zinc-700">/</span>
                  <span className="text-primary/95 font-semibold">{activeFile.path}</span>
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700/50">
                  {activeFile.language}
                </span>
              </div>

              {/* Code Panel Display */}
              <div className="flex-1 p-4 overflow-auto font-mono text-[11px] sm:text-xs text-zinc-300 leading-relaxed flex items-start select-text selection:bg-indigo-500/30 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {/* Line numbers mock panel */}
                <div className="text-zinc-750 text-right pr-4 select-none border-r border-zinc-850 mr-4 font-mono w-6">
                  {activeFile.code.split("\n").map((_, i) => (
                    <div key={i} className="h-5">{i + 1}</div>
                  ))}
                </div>
                {/* Real highlighted code */}
                <pre className="overflow-visible whitespace-pre m-0 flex-1">
                  <code 
                    className="block font-mono leading-5 text-left"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightCode(activeFile.code, activeFile.language) 
                    }} 
                  />
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500 gap-3">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center shadow-lg shadow-black/40">
                <Layers className="h-6 w-6 text-zinc-650 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400">{t({ id: "Pilih file dari direktori untuk membacanya.", en: "Select a file from directory to read contents." })}</p>
                <p className="text-[10px] text-zinc-650 mt-0.5">{t({ id: "Atau buka kembali tab file yang ditutup.", en: "Or re-open a file tab from the explorer tree." })}</p>
              </div>
            </div>
          )}
        </div>

        {/* Column 4: AI Code Explainer Box (Hidden on mobile unless active) */}
        <div className={`lg:col-span-1 bg-secondary/5 dark:bg-secondary/15 p-4 flex flex-col overflow-hidden ${
          activeTab === "ai" ? "flex" : "hidden lg:flex"
        }`}>
          {activeFile ? (
            <>
              {/* AI Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3 shrink-0">
                <div className="flex items-center gap-2 select-none">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-primary text-white flex items-center justify-center shadow-md shadow-indigo-500/10 relative group">
                    <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-primary opacity-20 blur group-hover:opacity-40 transition-opacity" />
                    <Bot className="h-4.5 w-4.5 relative z-10" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-foreground flex items-center gap-1">
                      Asisten AI
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                    </h4>
                    <p className="text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider">Gemini 3.5 Flash</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 select-none">
                  {/* Discuss Code in Live Chat */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!activeFile) return;
                      const query = `Bro, mari diskusikan file ${activeFile.path}. Bisakah kamu jelaskan tentang kode berikut?\n\n\`\`\`${activeFile.language}\n${activeFile.code}\n\`\`\``;
                      const event = new CustomEvent("open-roketdev-chat", {
                        detail: { query }
                      });
                      window.dispatchEvent(event);
                    }}
                    title="Diskusikan kode ini di Live Chat"
                    className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-primary transition-all flex items-center gap-1 text-[10px] font-bold shadow-sm focus:outline-none"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-primary/70" />
                    <span className="hidden xl:inline">Diskusi</span>
                  </button>

                  {/* Ask Gemini Review button */}
                  <button
                    onClick={() => handleAskAI()}
                    disabled={isAiLoading}
                    title="Minta Gemini mengulas baris kode secara mendalam"
                    className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-primary disabled:opacity-50 transition-all focus:outline-none shadow-sm"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isAiLoading ? 'animate-spin text-primary' : ''}`} />
                  </button>
                </div>
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
                    <div className="text-xs text-muted-foreground leading-relaxed font-medium">
                      <MarkdownRenderer content={aiExplanation} />
                    </div>
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
