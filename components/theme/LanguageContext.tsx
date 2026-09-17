"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation, LanguageOption } from "@/utils/i18n";

interface LanguageContextType {
  lang: SupportedLanguage;
  effectiveLang: string;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  isRTL: boolean;
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>("en");
  const [effectiveLang, setEffectiveLang] = useState<string>("en");

  useEffect(() => {
    const saved = localStorage.getItem("mda_lang") as SupportedLanguage | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
    } else {
      setLangState("auto");
    }
  }, []);

  useEffect(() => {
    let resolved = lang;
    if (lang === "auto" && typeof window !== "undefined") {
      const browserLang = navigator.language?.slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
        resolved = browserLang as SupportedLanguage;
      } else {
        resolved = "en";
      }
    }
    setEffectiveLang(resolved);

    const isRtl = resolved === "ar";
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
      document.documentElement.lang = resolved;
    }
  }, [lang]);

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    localStorage.setItem("mda_lang", newLang);
  };

  const t = (key: string) => {
    return getTranslation(effectiveLang, key);
  };

  const isRTL = effectiveLang === "ar";
  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[1];

  return (
    <LanguageContext.Provider
      value={{
        lang,
        effectiveLang,
        setLang,
        t,
        isRTL,
        currentOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
