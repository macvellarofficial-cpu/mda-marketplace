"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AccentPreset = "gold" | "blue" | "purple" | "emerald";

export interface AccentColorConfig {
  id: AccentPreset;
  name: string;
  primary: string;
  hover: string;
  rgb: string;
  dotColor: string;
}

export const ACCENT_PRESETS: Record<AccentPreset, AccentColorConfig> = {
  gold: {
    id: "gold",
    name: "Imperial Gold",
    primary: "#D4AF37",
    hover: "#B8972E",
    rgb: "212, 175, 55",
    dotColor: "bg-[#D4AF37]",
  },
  blue: {
    id: "blue",
    name: "Electric Blue",
    primary: "#2563EB",
    hover: "#1D4ED8",
    rgb: "37, 99, 235",
    dotColor: "bg-[#2563EB]",
  },
  purple: {
    id: "purple",
    name: "Luxury Purple",
    primary: "#7C3AED",
    hover: "#6D28D9",
    rgb: "124, 58, 237",
    dotColor: "bg-[#7C3AED]",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Green",
    primary: "#059669",
    hover: "#047857",
    rgb: "5, 150, 105",
    dotColor: "bg-[#059669]",
  },
};

interface AccentContextType {
  accent: AccentPreset;
  config: AccentColorConfig;
  setAccent: (accent: AccentPreset) => void;
}

const AccentContext = createContext<AccentContextType | undefined>(undefined);

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentPreset>("gold");

  useEffect(() => {
    const saved = localStorage.getItem("mda_accent") as AccentPreset | null;
    if (saved && ACCENT_PRESETS[saved]) {
      setAccentState(saved);
      applyAccent(saved);
    } else {
      applyAccent("gold");
    }
  }, []);

  const applyAccent = (preset: AccentPreset) => {
    const conf = ACCENT_PRESETS[preset];
    if (typeof document !== "undefined") {
      document.documentElement.dataset.accent = preset;
      document.documentElement.style.setProperty("--color-primary", conf.primary);
      document.documentElement.style.setProperty("--color-primary-hover", conf.hover);
      document.documentElement.style.setProperty("--color-primary-rgb", conf.rgb);
    }
  };

  const setAccent = (newAccent: AccentPreset) => {
    setAccentState(newAccent);
    localStorage.setItem("mda_accent", newAccent);
    applyAccent(newAccent);
  };

  return (
    <AccentContext.Provider
      value={{
        accent,
        config: ACCENT_PRESETS[accent],
        setAccent,
      }}
    >
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const context = useContext(AccentContext);
  if (!context) {
    throw new Error("useAccent must be used within an AccentProvider");
  }
  return context;
}
