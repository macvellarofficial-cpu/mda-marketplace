"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAccent, ACCENT_PRESETS, AccentPreset } from "./AccentContext";
import { Check, Palette, ChevronDown } from "lucide-react";

export default function AccentPicker() {
  const { accent, setAccent, config } = useAccent();
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
        aria-label="Change Accent Color"
        title="Custom Accent Color"
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border border-white/10 hover:border-white/20 bg-white/[0.04] dark:bg-white/[0.04] dark:text-white/80 light:bg-slate-100 light:text-slate-800 transition-colors"
      >
        <div
          className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)] border border-white/30"
          style={{ backgroundColor: config.primary }}
        />
        <span className="hidden sm:inline text-xs text-white/70 dark:text-white/70 light:text-slate-700">
          {config.name}
        </span>
        <ChevronDown className="w-3 h-3 text-white/50 dark:text-white/50 light:text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-2xl bg-[#14171F] dark:bg-[#14171F] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-white/[0.06] dark:border-white/[0.06] light:border-slate-100 flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-white/40 dark:text-white/40 light:text-slate-400">
            <Palette className="w-3 h-3 text-accent" />
            <span>Theme Accent</span>
          </div>

          <div className="p-1 space-y-0.5">
            {(Object.keys(ACCENT_PRESETS) as AccentPreset[]).map((key) => {
              const preset = ACCENT_PRESETS[key];
              const isSelected = accent === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setAccent(key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-white/[0.08] dark:bg-white/[0.08] light:bg-slate-100 font-semibold text-white dark:text-white light:text-slate-900"
                      : "text-white/70 dark:text-white/70 light:text-slate-600 hover:bg-white/[0.04] dark:hover:bg-white/[0.04] light:hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span>{preset.name}</span>
                  </div>
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5"
                      style={{ color: preset.primary }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
