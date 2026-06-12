"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import Link from "next/link";

interface MarkdownRendererProps {
  content: string;
  onLinkClick?: () => void;
}

// A simple client-side syntax highlighter for code blocks
function highlightCode(code: string, language: string) {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lang = language.toLowerCase();

  if (lang === "typescript" || lang === "javascript" || lang === "js" || lang === "ts" || lang === "json") {
    return escaped
      // Keywords
      .replace(
        /\b(import|export|default|const|let|var|function|return|async|await|try|catch|if|else|throw|new|from|class|extends|interface|type|typeof|any|string|number|boolean|void|null|undefined)\b/g,
        '<span class="text-indigo-400 font-semibold">$1</span>'
      )
      // Strings
      .replace(
        /(['"`])(.*?)\1/g,
        '<span class="text-emerald-400">$1$2$1</span>'
      )
      // Comments
      .replace(
        /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
        '<span class="text-zinc-500 italic">$1</span>'
      )
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');
  }

  if (lang === "html" || lang === "xml") {
    return escaped
      // Tags
      .replace(
        /(&lt;\/?[a-zA-Z0-9:-]+)(\s|&gt;)/g,
        '<span class="text-indigo-400 font-semibold">$1</span>$2'
      )
      // Attributes
      .replace(
        /([a-zA-Z0-9:-]+)=(['"])(.*?)\2/g,
        '<span class="text-sky-400">$1</span>=<span class="text-emerald-400">"$3"</span>'
      )
      // Comments
      .replace(
        /(&lt;!--[\s\S]*?--&gt;)/g,
        '<span class="text-zinc-500 italic">$1</span>'
      );
  }

  if (lang === "css") {
    return escaped
      // Selectors & rules
      .replace(
        /([a-zA-Z0-9_.-]+)\s*\{/g,
        '<span class="text-indigo-400 font-semibold">$1</span> {'
      )
      // Properties
      .replace(
        /([a-zA-Z-]+)\s*:/g,
        '<span class="text-sky-400">$1</span>:'
      )
      // Values
      .replace(
        /:\s*([^;]+);/g,
        ': <span class="text-emerald-400">$1</span>;'
      );
  }

  return escaped;
}

export default function MarkdownRenderer({ content, onLinkClick }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!content) return null;

  // Split content by code blocks
  const parts = content.split("```");

  return (
    <div className="space-y-3 font-medium text-xs md:text-[13px] leading-relaxed text-muted-foreground">
      {parts.map((part, index) => {
        const isCodeBlock = index % 2 === 1;

        if (isCodeBlock) {
          // Parse language and actual code
          const match = part.match(/^([a-zA-Z0-9+#-]+)?\n([\s\S]*)$/);
          const rawLanguage = match ? match[1] || "" : "";
          const code = match ? match[2] : part;
          const displayLanguage = rawLanguage || "code";

          return (
            <div key={index} className="my-3 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-lg font-mono">
              {/* Header Bar */}
              <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider select-none">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  {displayLanguage}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(code, index)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Area */}
              <pre className="overflow-x-auto p-4 m-0 text-zinc-200 select-text font-mono text-[11px] md:text-xs leading-relaxed max-w-full">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(code, displayLanguage),
                  }}
                />
              </pre>
            </div>
          );
        }

        // Parse regular markdown lines
        const lines = part.split("\n");
        let listBuffer: React.ReactNode[] = [];
        let listType: "ul" | "ol" | null = null;
        const renderedBlocks: React.ReactNode[] = [];

        const flushList = (key: string) => {
          if (listBuffer.length > 0) {
            if (listType === "ul") {
              renderedBlocks.push(
                <ul key={`ul-${key}`} className="my-2 space-y-1 list-disc pl-5">
                  {...listBuffer}
                </ul>
              );
            } else if (listType === "ol") {
              renderedBlocks.push(
                <ol key={`ol-${key}`} className="my-2 space-y-1 list-decimal pl-5">
                  {...listBuffer}
                </ol>
              );
            }
            listBuffer = [];
            listType = null;
          }
        };

        const renderInlineStyles = (text: string) => {
          // 1. Links: [label](url)
          // 2. Bold: **text**
          // 3. Inline code: `code`
          
          let tokens: React.ReactNode[] = [text];

          // Parse Links
          tokens = tokens.flatMap((token, tokenIdx) => {
            if (typeof token !== "string") return token;
            const regex = /\[(.*?)\]\((.*?)\)/g;
            const elements: React.ReactNode[] = [];
            let lastIdx = 0;
            let linkMatch;

            while ((linkMatch = regex.exec(token)) !== null) {
              const [full, label, url] = linkMatch;
              const startIdx = linkMatch.index;

              if (startIdx > lastIdx) {
                elements.push(token.substring(lastIdx, startIdx));
              }

              const isInternal = url.startsWith("/");
              if (isInternal) {
                elements.push(
                  <Link
                    key={`link-${tokenIdx}-${startIdx}`}
                    href={url}
                    onClick={onLinkClick}
                    className="text-primary hover:underline font-bold inline-flex items-center gap-0.5 border-b border-primary/20 decoration-2 transition-colors"
                  >
                    {label}
                  </Link>
                );
              } else {
                elements.push(
                  <a
                    key={`link-${tokenIdx}-${startIdx}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-bold inline-flex items-center gap-0.5 border-b border-primary/20 decoration-2 transition-colors"
                  >
                    {label}
                  </a>
                );
              }

              lastIdx = regex.lastIndex;
            }

            if (lastIdx < token.length) {
              elements.push(token.substring(lastIdx));
            }

            return elements;
          });

          // Parse Bold
          tokens = tokens.flatMap((token, tokenIdx) => {
            if (typeof token !== "string") return token;
            const regex = /\*\*(.*?)\*\*/g;
            const elements: React.ReactNode[] = [];
            let lastIdx = 0;
            let boldMatch;

            while ((boldMatch = regex.exec(token)) !== null) {
              const [full, textInside] = boldMatch;
              const startIdx = boldMatch.index;

              if (startIdx > lastIdx) {
                elements.push(token.substring(lastIdx, startIdx));
              }

              elements.push(
                <strong key={`bold-${tokenIdx}-${startIdx}`} className="font-extrabold text-foreground">
                  {textInside}
                </strong>
              );

              lastIdx = regex.lastIndex;
            }

            if (lastIdx < token.length) {
              elements.push(token.substring(lastIdx));
            }

            return elements;
          });

          // Parse Inline Code
          tokens = tokens.flatMap((token, tokenIdx) => {
            if (typeof token !== "string") return token;
            const regex = /`(.*?)`/g;
            const elements: React.ReactNode[] = [];
            let lastIdx = 0;
            let codeMatch;

            while ((codeMatch = regex.exec(token)) !== null) {
              const [full, textInside] = codeMatch;
              const startIdx = codeMatch.index;

              if (startIdx > lastIdx) {
                elements.push(token.substring(lastIdx, startIdx));
              }

              elements.push(
                <code
                  key={`code-${tokenIdx}-${startIdx}`}
                  className="bg-secondary text-amber-500 font-mono px-1.5 py-0.5 rounded text-[11px] md:text-xs font-semibold border border-border/50"
                >
                  {textInside}
                </code>
              );

              lastIdx = regex.lastIndex;
            }

            if (lastIdx < token.length) {
              elements.push(token.substring(lastIdx));
            }

            return elements;
          });

          return tokens;
        };

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          // Headers
          if (trimmed.startsWith("### ")) {
            flushList(`${index}-${i}`);
            renderedBlocks.push(
              <h4 key={`h3-${index}-${i}`} className="text-xs md:text-sm font-bold text-foreground mt-4 mb-2 uppercase tracking-wide border-b border-border/50 pb-1.5">
                {renderInlineStyles(trimmed.substring(4))}
              </h4>
            );
          } else if (trimmed.startsWith("## ")) {
            flushList(`${index}-${i}`);
            renderedBlocks.push(
              <h3 key={`h2-${index}-${i}`} className="text-sm md:text-base font-extrabold text-foreground mt-5 mb-2.5">
                {renderInlineStyles(trimmed.substring(3))}
              </h3>
            );
          } else if (trimmed.startsWith("# ")) {
            flushList(`${index}-${i}`);
            renderedBlocks.push(
              <h2 key={`h1-${index}-${i}`} className="text-base md:text-lg font-extrabold text-foreground mt-6 mb-3">
                {renderInlineStyles(trimmed.substring(2))}
              </h2>
            );
          }
          // Unordered Lists
          else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            if (listType !== "ul") {
              flushList(`${index}-${i}`);
              listType = "ul";
            }
            listBuffer.push(
              <li key={`li-ul-${index}-${i}`} className="leading-relaxed text-xs md:text-[13px] text-muted-foreground my-1">
                {renderInlineStyles(trimmed.substring(2))}
              </li>
            );
          }
          // Ordered Lists
          else if (trimmed.match(/^\d+\.\s/)) {
            if (listType !== "ol") {
              flushList(`${index}-${i}`);
              listType = "ol";
            }
            const matchIndex = trimmed.indexOf(" ");
            listBuffer.push(
              <li key={`li-ol-${index}-${i}`} className="leading-relaxed text-xs md:text-[13px] text-muted-foreground my-1">
                {renderInlineStyles(trimmed.substring(matchIndex + 1))}
              </li>
            );
          }
          // Paragraphs & Spacing
          else {
            if (trimmed === "") {
              flushList(`${index}-${i}`);
              renderedBlocks.push(<div key={`space-${index}-${i}`} className="h-2" />);
            } else {
              flushList(`${index}-${i}`);
              renderedBlocks.push(
                <p key={`p-${index}-${i}`} className="my-1.5 text-xs md:text-[13px] leading-relaxed text-muted-foreground">
                  {renderInlineStyles(line)}
                </p>
              );
            }
          }
        }

        // Flush any remaining lists
        flushList(`${index}-end`);

        return <React.Fragment key={index}>{renderedBlocks}</React.Fragment>;
      })}
    </div>
  );
}
