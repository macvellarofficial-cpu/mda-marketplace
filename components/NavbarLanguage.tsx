"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./theme/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/utils/i18n";
import { Globe, Check, ChevronDown } from "lucide-react";

export default function NavbarLanguage() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Select Language"
        title="Change Language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border border-white/10 hover:border-white/20 bg-white/[0.04] dark:bg-white/[0.04] dark:text-white/80 light:bg-slate-100 light:text-slate-800 transition-colors"
      >
        <Globe className="w-3.5 h-3.5 text-white/60 dark:text-white/60 light:text-slate-500" />
        <span className="text-xs text-white/80 dark:text-white/80 light:text-slate-700 uppercase font-semibold">
          {lang === "auto" ? "Auto" : lang.toUpperCase()}
        </span>
        <ChevronDown className="w-3 h-3 text-white/50 dark:text-white/50 light:text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl bg-[#14171F] dark:bg-[#14171F] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 border-b border-white/[0.06] dark:border-white/[0.06] light:border-slate-100 flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-white/40 dark:text-white/40 light:text-slate-400">
            <span>Global Language</span>
            <span className="text-accent">{SUPPORTED_LANGUAGES.length} Locales</span>
          </div>

          <div className="p-1 space-y-0.5">
            {SUPPORTED_LANGUAGES.map((option) => {
              const isSelected = lang === option.code;
              return (
                <button
                  key={option.code}
                  onClick={() => {
                    setLang(option.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-white/[0.08] dark:bg-white/[0.08] light:bg-slate-100 font-semibold text-white dark:text-white light:text-slate-900"
                      : "text-white/70 dark:text-white/70 light:text-slate-600 hover:bg-white/[0.04] dark:hover:bg-white/[0.04] light:hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{option.flag}</span>
                    <span className="font-sans">{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
