"use client";

import React from "react";
import Link from "next/link";
import { X, ArrowRight, Layers } from "lucide-react";
import { mockExtensions } from "@/config/mock-data";
import { useLanguage } from "@/components/LanguageProvider";

interface CompareTrayProps {
  compareIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function CompareTray({ 
  compareIds, 
  onRemove, 
  onClear 
}: CompareTrayProps) {
  const { t, tExtension } = useLanguage();
  
  if (compareIds.length === 0) return null;

  const selectedExtensions = mockExtensions
    .filter((ext) => compareIds.includes(ext.id))
    .map(tExtension);

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-3 shadow-xl backdrop-blur-md">
        
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-[11px] font-bold text-foreground">
            {t({ id: "Bandingkan", en: "Comparing" })} ({compareIds.length}/3)
          </span>
        </div>

        {/* Selected item chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {selectedExtensions.map((ext) => (
            <div 
              key={ext.id}
              className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-2 py-0.5 text-[10px]"
            >
              <span>{ext.logoUrl}</span>
              <span className="font-semibold max-w-[60px] truncate">{ext.name}</span>
              <button
                onClick={() => onRemove(ext.id)}
                className="p-0.5 hover:bg-border rounded text-muted-foreground hover:text-foreground"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onClear}
            className="text-[10px] font-semibold text-muted-foreground hover:text-foreground px-1.5 py-1"
          >
            {t({ id: "Bersihkan", en: "Clear" })}
          </button>
          
          <Link
            href={`/compare?ids=${compareIds.join(",")}`}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            {t({ id: "Bandingkan", en: "Compare" })}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
