"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { getMineralFallbackImage } from "@/utils/mineralFallback";

export interface MineralLotItem {
  id: string;
  assayNo: string;
  name: string;
  category: "metals" | "stones" | "rare-earth" | string;
  grade: string;
  purity: string;
  weight: string;
  origin: string;
  institution: string;
  price: string;
  status: string;
  auditPartner: string;
  images?: string[];
  incoterms?: string;
}

// Fallback high-quality curated photography per commodity type
export const getMineralThumbnail = (
  name: string,
  category: string,
  images?: string[]
): string => {
  if (images && images.length > 0 && images[0]) {
    return images[0];
  }
  return getMineralFallbackImage(name, category);
};

export default function MineralShowcaseCard({
  lot,
}: {
  lot: MineralLotItem;
}) {
  const imageUrl = getMineralThumbnail(lot.name, lot.category, lot.images);
  const incoterm = lot.incoterms || "FOB Entebbe";

  const categoryLabel =
    lot.category === "metals" || lot.category === "Precious Metals"
      ? "Precious Metals"
      : lot.category === "stones" || lot.category === "Precious Stones"
      ? "Precious Stones"
      : "Rare Earths / Critical";

  return (
    <div className="rounded-3xl bg-[#14171F] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden group">
      <div>
        {/* TOP HALF: Visual Image Container with Overlay Badges */}
        <Link
          href={`/marketplace/${encodeURIComponent(lot.id)}`}
          className="relative w-full h-48 rounded-t-xl bg-black/60 overflow-hidden block cursor-pointer"
        >
          <Image
            src={imageUrl}
            alt={lot.name}
            fill
            className="object-cover w-full h-48 rounded-t-xl group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={imageUrl.startsWith("blob:")}
          />

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-black/20 to-black/60 pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="text-[10px] font-mono uppercase bg-black/75 backdrop-blur-md text-[#D4AF37] border border-white/[0.15] px-2.5 py-1 rounded-full font-semibold shadow-md">
              {categoryLabel}
            </span>

            <span className="text-[10px] font-mono uppercase bg-[#14171F]/85 backdrop-blur-md text-white/90 border border-white/[0.15] px-2.5 py-1 rounded-full shadow-md font-medium">
              {incoterm}
            </span>
          </div>

          {/* Bottom Overlay Badges */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="text-[10px] font-mono bg-[#10B981]/20 backdrop-blur-md text-[#10B981] border border-[#10B981]/40 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> Verified MEMD
            </span>

            <span className="text-[10px] font-mono text-white/70 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/[0.1]">
              {lot.auditPartner}
            </span>
          </div>
        </Link>

        {/* BOTTOM HALF: Batch Specifications & Pricing */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#D4AF37] font-bold tracking-wider">
                {lot.id}
              </span>
              <span className="text-white/40">{lot.assayNo}</span>
            </div>

            <Link
              href={`/marketplace/${encodeURIComponent(lot.id)}`}
              className="block cursor-pointer"
            >
              <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                {lot.name}
              </h3>
            </Link>
            <p className="text-xs text-white/50 mt-0.5">{lot.grade}</p>
          </div>

          {/* Monospace Assay Specs Box */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#0B0C10] border border-white/[0.05] text-xs font-mono">
            <div>
              <span className="text-[10px] text-white/40 block font-sans uppercase tracking-wider">
                Certified Weight
              </span>
              <span className="font-bold text-white text-sm block mt-0.5">
                {lot.weight}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/40 block font-sans uppercase tracking-wider">
                Assayed Purity
              </span>
              <span className="font-bold text-[#10B981] text-sm block mt-0.5 truncate">
                {lot.purity}
              </span>
            </div>
          </div>

          {/* Concession Origin & Producer */}
          <div className="space-y-1 text-xs text-white/60 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-white/40">Producer:</span>
              <span className="text-white/85 font-sans font-medium truncate max-w-[180px]">
                {lot.institution}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40">Concession:</span>
              <span className="text-white/70 truncate max-w-[180px]">
                {lot.origin}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-3 bg-[#14171F]">
        <div>
          <span className="text-[10px] text-white/40 block font-sans uppercase tracking-wider">
            Indicative Valuation
          </span>
          <span className="text-lg font-extrabold font-mono text-[#D4AF37]">
            {lot.price}
          </span>
        </div>

        <Link
          href={`/marketplace/${encodeURIComponent(lot.id)}`}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold text-xs transition-all flex items-center gap-1.5 border border-[#D4AF37]/30 shadow-[0_0_12px_rgba(212,175,55,0.15)] active:scale-95"
        >
          <span>Initiate RFQ</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
