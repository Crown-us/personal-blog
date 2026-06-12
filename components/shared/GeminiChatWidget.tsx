"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, X, Send, Sparkles, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function GeminiChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo bro! 👋 Saya **Asisten AI RoketDev**.\n\nAda yang bisa saya bantu hari ini? Kamu bisa tanya seputar *DevTools*, *Chrome Extensions*, atau *Boilerplate/Source Code* yang cocok untuk kebutuhan coding kamu! Contohnya:",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true); // To trigger alert/dot on load

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [messages, isOpen, isLoading]);



  // Clickable suggest chips
  const suggestionChips = [
    { label: "🏢 Template RT/RW", query: "Template fullstack buat manajemen RT RW" },
    { label: "🤖 AI Blog SaaS", query: "Source code Nextjs buat platform blog AI" },
    { label: "🧩 ChatGPT Sidebar", query: "Rekomendasi ekstensi asisten AI di browser" },
    { label: "🎨 Portfolio Template", query: "Ada template portofolio developer?" },
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format messages history into role/parts for Gemini API
      const history = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        throw new Error("Gagal terhubung ke API Gemini");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Aduh bro, maaf banget. Sepertinya ada gangguan koneksi ke server. Coba kirim ulang pesan kamu ya!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRef = useRef(handleSend);
  useEffect(() => {
    handleSendRef.current = handleSend;
  });

  useEffect(() => {
    const handleOpenChat = (e: CustomEvent<{ query: string }>) => {
      setIsOpen(true);
      if (e.detail.query) {
        handleSendRef.current(e.detail.query);
      }
    };

    window.addEventListener("open-roketdev-chat" as any, handleOpenChat);
    return () => {
      window.removeEventListener("open-roketdev-chat" as any, handleOpenChat);
    };
  }, []);

  // Removed old simple formatter in favor of robust MarkdownRenderer component

  // Click Interceptor: Makes markdown links behave like client-side Router pushes
  const handleMessageContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A") {
      const href = target.getAttribute("href");
      if (href && href.startsWith("/")) {
        e.preventDefault();
        router.push(href);
        // On mobile, close widget after navigating
        if (window.innerWidth < 768) {
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/6285117394678"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group focus:outline-none"
          title="Hubungi via WhatsApp"
          aria-label="Hubungi via WhatsApp"
        >
          {/* Pulsing Glow Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-[#25D366] opacity-30 blur group-hover:opacity-75 transition-all duration-300 animate-pulse"></span>
          
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="h-6 w-6">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </div>
        </a>

        {/* Chatbot Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-primary text-white shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 group focus:outline-none"
          aria-label="Tanya Gemini AI"
        >
          {/* Pulsing Glow Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-violet-600 to-primary opacity-30 blur group-hover:opacity-75 transition-all duration-300 animate-pulse"></span>
          
          <div className="relative z-10">
            {isOpen ? (
              <X className="h-6 w-6 transition-transform duration-250 rotate-90" />
            ) : (
              <Bot className="h-6 w-6 transition-transform duration-250 hover:rotate-6 animate-bounce-[duration:2s]" />
            )}
          </div>

          {/* New message notification badge */}
          {hasNewMessage && !isOpen && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-extrabold text-white items-center justify-center">
                1
              </span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Box Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-8rem)] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-950/20 via-primary/15 to-transparent border-b border-border/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-primary text-white shadow-inner">
                  <Bot className="h-5.5 w-5.5" />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    Asisten AI RoketDev
                    <Sparkles className="h-3 w-3 text-indigo-400 fill-indigo-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] font-semibold text-muted-foreground">Gemini 3.5 • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body & Scroll Area */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-border"
              onClick={handleMessageContainerClick}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                        : "bg-secondary/70 border border-border text-foreground rounded-tl-none"
                    }`}
                  >
                    <MarkdownRenderer content={msg.content} />
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/70 border border-border text-muted-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5 animate-pulse text-primary" />
                    <span className="text-[10px] font-medium mr-1">RoketDev sedang mengetik</span>
                    <span className="flex gap-1 items-center">
                      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </div>
                </div>
              )}

              {/* Recommendation Suggestion Chips */}
              {messages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-1.5 animate-fade-in">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                    Coba ketik atau klik contoh ini:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestionChips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(chip.query)}
                        className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary hover:border-primary/30 text-foreground transition-all cursor-pointer text-left"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-border bg-secondary/20 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Tanya devtool, template, atau workspace..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-2 px-3 text-xs focus:outline-none placeholder:text-muted-foreground/50 text-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground transition-all shrink-0 focus:outline-none"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
