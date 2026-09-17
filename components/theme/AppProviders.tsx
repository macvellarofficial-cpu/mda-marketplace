"use client";

import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AccentProvider } from "./AccentContext";
import { LanguageProvider } from "./LanguageContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AccentProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AccentProvider>
    </ThemeProvider>
  );
}
