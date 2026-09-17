"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gem,
  ShieldCheck,
  Award,
  Download,
  X,
} from "lucide-react";

interface SlideData {
  id: number;
  tag: string;
  title: string;
  headline: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
  specs: { label: string; value: string }[];
}

const slides: SlideData[] = [
  {
    id: 1,
    tag: "PRODUCER DIRECT",
    title: "Direct Mineral Sourcing",
    headline: "Connecting verified African producers with international buyers.",
    description:
      "Bypass unregulated intermediaries. Access sovereign-licensed concessions across Uganda, DRC, Zambia, and Ghana with transparent mine-to-market provenance.",
    accent: "#D4AF37",
    icon: <Gem className="w-10 h-10 text-[#D4AF37]" />,
    specs: [
      { label: "VETTED PRODUCERS", value: "120+ MINES" },
      { label: "CHAIN OF CUSTODY", value: "OECD COMPLIANT" },
    ],
  },
  {
    id: 2,
    tag: "INSTITUTIONAL TRUST",
    title: "Assay & Escrow Protection",
    headline: "Independent laboratory verification before payments.",
    description:
      "Capital is locked in Tier-1 custody vaults. Full payment releases occur strictly upon accredited spectrographic assay results (SGS, Alex Stewart) confirming purity.",
    accent: "#10B981",
    icon: <ShieldCheck className="w-10 h-10 text-[#10B981]" />,
    specs: [
      { label: "LAB PARTNERS", value: "SGS / ALEX STEWART" },
      { label: "ESCROW SECURITY", value: "100% BONDED" },
    ],
  },
  {
    id: 3,
    tag: "REGULATORY VERIFIED",
    title: "Traceable & Compliant Trade",
    headline: "Backed by MEMD Uganda and regional export standards.",
    description:
      "End-to-end documentation: ICGLR certificates, mineral export permits, URA tax clearance, and digital certificate seals on every transacted batch.",
    accent: "#D4AF37",
    icon: <Award className="w-10 h-10 text-[#D4AF37]" />,
    specs: [
      { label: "LICENSING", value: "MEMD UGANDA" },
      { label: "CLEARANCE", value: "URA & URSB VERIFIED" },
    ],
  },
];

export default function MobileOnboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-25 transition-all duration-700"
        style={{
          backgroundColor: activeSlide.accent,
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full bg-[#0B0C10] rounded-[10px] flex items-center justify-center">
              <Gem className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <span className="font-bold text-base tracking-wider text-white">
              MDA
            </span>
            <span className="text-[9px] text-[#D4AF37] block font-mono tracking-widest">
              MINERAL DEALERS
            </span>
          </div>
        </div>

        <Link
          href="#marketplace"
          className="text-xs font-mono text-white/60 hover:text-[#D4AF37] transition-colors py-1.5 px-3 rounded-full bg-[#14171F] border border-white/[0.08]"
        >
          Skip to Market →
        </Link>
      </header>

      {/* Swipeable Carousel Container */}
      <div
        className="relative z-10 my-auto py-4 select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col items-center text-center">
          {/* Slide Visual Icon Shield */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-center relative z-10">
              {activeSlide.icon}
            </div>
            <div
              className="absolute -inset-2 rounded-3xl blur-xl opacity-30 transition-all duration-500"
              style={{ backgroundColor: activeSlide.accent }}
            />
          </div>

          {/* Badge Tag */}
          <span className="inline-block text-[10px] font-mono tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20 mb-3 uppercase">
            {activeSlide.tag}
          </span>

          {/* Slide Titles */}
          <h2 className="text-2xl font-black tracking-tight text-white mb-2 leading-tight">
            {activeSlide.title}
          </h2>

          <p className="text-sm font-medium text-white/90 mb-3 px-2 leading-snug">
            {activeSlide.headline}
          </p>

          <p className="text-xs text-white/60 leading-relaxed max-w-sm mb-6 px-3">
            {activeSlide.description}
          </p>

          {/* Monospace Specs Card */}
          <div className="w-full max-w-xs grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#14171F] border border-white/[0.08] text-left">
            {activeSlide.specs.map((spec, idx) => (
              <div key={idx}>
                <span className="text-[9px] text-white/40 block font-sans uppercase tracking-wider">
                  {spec.label}
                </span>
                <span className="text-xs font-mono font-semibold text-white truncate block">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-8 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons & Links */}
      <div className="relative z-10 space-y-3 pt-2 pb-14">
        <Link
          href="/register"
          className="w-full py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-sm tracking-wide text-center block transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-[0.98]"
        >
          Get Started
        </Link>

        <Link
          href="/login"
          className="w-full py-3.5 px-6 rounded-xl bg-[#14171F] hover:bg-[#1A1E29] border border-white/[0.08] text-white font-medium text-sm text-center block transition-all active:scale-[0.98]"
        >
          Sign In
        </Link>

        <div className="text-center pt-1">
          <Link
            href="#marketplace"
            className="text-xs font-mono text-white/50 hover:text-white transition-colors"
          >
            Skip to Marketplace
          </Link>
        </div>
      </div>

      {/* Zeraket-style Floating PWA Banner at Bottom */}
      {showPwaBanner && (
        <div className="fixed bottom-3 left-3 right-3 z-50 p-3.5 rounded-2xl bg-[#14171F]/95 backdrop-blur-xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B0C10] border border-[#D4AF37]/30 flex items-center justify-center p-2 flex-shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              <Gem className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  Add MDA to home screen
                </span>
                <span className="text-[9px] font-mono text-[#10B981] px-1 py-0.2 rounded bg-[#10B981]/10">
                  PWA
                </span>
              </div>
              <p className="text-[10px] text-white/60">
                Instant quotes & offline assay verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowPwaBanner(false)}
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1 shadow-md hover:bg-[#F59E0B] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="p-1 rounded-md text-white/40 hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
