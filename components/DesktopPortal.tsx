"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import NavbarLogo from "@/components/NavbarLogo";
import {
  ShieldCheck,
  Building2,
  FileCheck,
  Scale,
  Lock,
  Search,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  SlidersHorizontal,
  Compass,
  Truck,
  MessageSquareCheck,
  Award,
} from "lucide-react";
import MineralShowcaseCard, {
  MineralLotItem,
} from "@/components/MineralShowcaseCard";
import { getMineralFallbackImage } from "@/utils/mineralFallback";

type MineralCategory = "all" | "metals" | "stones" | "rare-earth";

interface TickerItem {
  commodity: string;
  ticker: string;
  price: string;
  unit: string;
  change: string;
  isPositive: boolean;
}

const tickerItems: TickerItem[] = [
  {
    commodity: "Gold (99.99%)",
    ticker: "Au-US",
    price: "$2,642.50",
    unit: "oz",
    change: "+0.84%",
    isPositive: true,
  },
  {
    commodity: "Copper Grade A",
    ticker: "Cu-LME",
    price: "$9,850.00",
    unit: "MT",
    change: "+1.35%",
    isPositive: true,
  },
  {
    commodity: "Lithium SC6",
    ticker: "Li2O-SC6",
    price: "$980.00",
    unit: "MT",
    change: "-0.40%",
    isPositive: false,
  },
  {
    commodity: "Tantalite (Coltan 30%)",
    ticker: "Ta2O5-MIN",
    price: "$142.50",
    unit: "kg",
    change: "+2.15%",
    isPositive: true,
  },
  {
    commodity: "Cobalt Hydroxide",
    ticker: "Co-BAT",
    price: "$33,400.00",
    unit: "MT",
    change: "+0.20%",
    isPositive: true,
  },
  {
    commodity: "Tin / Cassiterite (65%)",
    ticker: "Sn-CONC",
    price: "$31,900.00",
    unit: "MT",
    change: "+0.65%",
    isPositive: true,
  },
];

const desktopBatches: MineralLotItem[] = [
  {
    id: "MDA-GLD-088",
    assayNo: "ASY-UG-2026-GLD-019",
    name: "94.5% Au Unrefined Gold Bars",
    category: "metals",
    grade: "Commercial Bullion",
    purity: "94.50% Au",
    weight: "185.00 kg",
    origin: "Buhweju Gold Belt, Uganda",
    institution: "Albertine Mineral Consortium",
    price: "$13,650,000",
    status: "Vault Custody",
    auditPartner: "MEMD Certified / SGS",
    incoterms: "FOB Entebbe",
    images: [
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "MDA-CPR-204",
    assayNo: "ASY-ZM-2026-CPR-441",
    name: "Copper Cathodes Grade A",
    category: "metals",
    grade: "Electrowon 99.99%",
    purity: "99.99% Cu",
    weight: "2,000.00 MT",
    origin: "Kitwe Refining Yard, Zambia",
    institution: "Zambian Copperbelt Trade Hub",
    price: "$19,700,000",
    status: "Ready for Escrow",
    auditPartner: "Alex Stewart Int.",
    incoterms: "CIF Durban",
    images: [
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "MDA-LIT-312",
    assayNo: "ASY-ZW-2026-LIT-808",
    name: "Spodumene Lithium Ore (SC6)",
    category: "rare-earth",
    grade: "Battery Hydroxide Feed",
    purity: "6.22% Li2O",
    weight: "6,500.00 MT",
    origin: "Bikita Mineral Concession, Zimbabwe",
    institution: "Great Dyke Lithium Miners",
    price: "$6,370,000",
    status: "Ready for Escrow",
    auditPartner: "Bureau Veritas",
    incoterms: "FOB Beira Port",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "MDA-COL-551",
    assayNo: "ASY-RW-2026-COL-112",
    name: "Tantalite (Coltan Concentrate)",
    category: "rare-earth",
    grade: "Ta2O5 > 32%",
    purity: "34.10% Ta2O5",
    weight: "75.00 MT",
    origin: "Bugesera Logistics Base, Rwanda",
    institution: "Central Rift Mineral Trading Co.",
    price: "$10,650,000",
    status: "Vault Custody",
    auditPartner: "ICGLR Tagged / SGS",
    incoterms: "CIF Rotterdam",
    images: [
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "MDA-DIA-904",
    assayNo: "ASY-BW-2026-DIA-055",
    name: "Kimberlite Rough Diamonds (D-H)",
    category: "stones",
    grade: "VVS-SI Gem Quality",
    purity: "Kimberley Process Cleared",
    weight: "1,250.00 cts",
    origin: "Orapa District, Botswana",
    institution: "Kalahari Diamond Exchange",
    price: "$4,200,000",
    status: "Vault Custody",
    auditPartner: "KPCS Verified / GIA Assay",
    incoterms: "FOB Gaborone",
    images: [
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "MDA-TZN-108",
    assayNo: "ASY-TZ-2026-TZN-301",
    name: "Natural Blue Zoisite (Tanzanite)",
    category: "stones",
    grade: "AAA Vivid Royal Blue",
    purity: "Untreated Rough Facet Grade",
    weight: "4,800.00 grams",
    origin: "Merelani Hills Block C, Tanzania",
    institution: "Kilimanjaro Gem Syndicate",
    price: "$2,890,000",
    status: "Ready for Escrow",
    auditPartner: "Tanzania Min. Commission",
    incoterms: "CIF Dubai",
    images: [
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

export default function DesktopPortal() {
  const [selectedCategory, setSelectedCategory] =
    useState<MineralCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allBatches, setAllBatches] = useState<MineralLotItem[]>(desktopBatches);

  useEffect(() => {
    interface CustomListingPayload {
      lot_id: string;
      assay_cert_number?: string;
      commodity: string;
      category: string;
      grade: string;
      purity: string;
      weight: string;
      origin_region: string;
      origin_country: string;
      price_usd: string;
      assay_lab?: string;
      incoterms?: string;
      images?: string[];
    }

    const cached = sessionStorage.getItem("mda_custom_listings");
    if (cached) {
      try {
        const customItems: CustomListingPayload[] = JSON.parse(cached);
        const mapped: MineralLotItem[] = customItems.map((item) => ({
          id: item.lot_id,
          assayNo: item.assay_cert_number || "ASY-2026-VERIFIED",
          name: item.commodity,
          category:
            item.category === "Precious Metals"
              ? "metals"
              : item.category === "Precious Stones"
              ? "stones"
              : "rare-earth",
          grade: item.grade,
          purity: item.purity,
          weight: item.weight,
          origin: `${item.origin_region}, ${item.origin_country}`,
          institution: "Registered Concession Holder",
          price: item.price_usd,
          status: "Verified Batch",
          auditPartner: item.assay_lab || "Accredited Lab",
          incoterms: item.incoterms || "FOB",
          images:
            item.images && item.images.length > 0 && item.images[0]
              ? item.images
              : [getMineralFallbackImage(item.commodity, item.category)],
        }));
        setAllBatches([...mapped, ...desktopBatches]);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const filteredBatches = allBatches.filter((b) => {
    const matchesCategory =
      selectedCategory === "all" ||
      b.category === selectedCategory ||
      (selectedCategory === "metals" && b.category === "Precious Metals") ||
      (selectedCategory === "stones" && b.category === "Precious Stones") ||
      (selectedCategory === "rare-earth" && b.category === "Rare Earth Elements");

    const matchesQuery =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.assayNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6]">
      {/* 1. Blurred Dark Glass Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0C10]/85 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <NavbarLogo />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-medium text-white/70">
            <Link
              href="/marketplace"
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
            >
              <span>Marketplace</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </Link>
            <Link
              href="#services"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Services
            </Link>
            <Link
              href="#due-diligence"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Due Diligence
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-mono text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Institutional Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_22px_rgba(245,158,11,0.4)] flex items-center gap-1.5 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Access Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Dark High-Contrast Banner */}
      <section className="relative pt-16 pb-12 px-8 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-[#D4AF37]/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-48 right-12 w-80 h-80 bg-[#10B981]/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#14171F] border border-white/[0.08] text-xs mb-6 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span className="text-white/80 font-medium">
                Sovereign Concession Network
              </span>
              <span className="text-white/30">|</span>
              <span className="text-[#D4AF37] font-mono font-semibold">
                $45M+ Bonded Escrow Reserve
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Africa&apos;s Most Trusted{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE68C]">
                Digital Mineral Marketplace
              </span>
            </h1>

            <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-2xl">
              Direct B2B execution between verified African mining concessions and
              global institutional buyers. Fully backed by independent laboratory
              assays, multi-signature custody, and statutory export compliance.
            </p>
          </div>

          {/* 3. Verified Regulatory Trust Ribbon */}
          <div className="p-4 rounded-2xl bg-[#14171F] border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="tracking-widest uppercase">
                  VERIFIED STATUTORY ACCREDITATION:
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0B0C10] border border-white/[0.06]">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      MEMD Uganda
                    </span>
                    <span className="text-[10px] text-white/50 block font-mono">
                      Lic. Min. Dev. Ref #441
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0B0C10] border border-white/[0.06]">
                  <Scale className="w-4 h-4 text-[#10B981]" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      LBMA Sourcing
                    </span>
                    <span className="text-[10px] text-white/50 block font-mono">
                      OECD Annex II Standard
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0B0C10] border border-white/[0.06]">
                  <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      URA Customs
                    </span>
                    <span className="text-[10px] text-white/50 block font-mono">
                      Tax & Export Seal Cleared
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0B0C10] border border-white/[0.06]">
                  <Building2 className="w-4 h-4 text-[#10B981]" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      URSB Registry
                    </span>
                    <span className="text-[10px] text-white/50 block font-mono">
                      Enterprise Reg #80020
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Interactive Mineral Search Bar & Indicative Pricing Ticker */}
          <div className="rounded-2xl bg-[#14171F] border border-white/[0.08] p-5 shadow-2xl space-y-4">
            {/* Search row */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Category Dropdown */}
              <div className="relative md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as MineralCategory)
                  }
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-white text-xs font-semibold rounded-xl px-4 appearance-none focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <option value="all">All Commodity Sectors</option>
                  <option value="metals">Precious Metals (Gold, Copper)</option>
                  <option value="stones">Precious Stones (Diamonds, Tanzanite)</option>
                  <option value="rare-earth">
                    Rare Earth & Critical (Lithium, Coltan)
                  </option>
                </select>
                <SlidersHorizontal className="w-4 h-4 text-white/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assay registration #, concession region, or grade (e.g. ASY-UG-2026, Lithium SC6, 94.5% Au)..."
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white placeholder-white/40 rounded-xl pl-11 pr-4 focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                />
              </div>

              {/* Search Execute Button */}
              <button className="h-12 px-7 bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2">
                <span>Filter Marketplace</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Indicative Pricing Ticker */}
            <div className="pt-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 whitespace-nowrap flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  INDICATIVE SPOT TICKER
                </span>

                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 py-1">
                  {tickerItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 whitespace-nowrap text-xs font-mono"
                    >
                      <span className="text-white/60">{item.commodity}:</span>
                      <span className="font-bold text-white">
                        {item.price}
                        <span className="text-[10px] font-normal text-white/40">
                          /{item.unit}
                        </span>
                      </span>
                      <span
                        className={`text-[11px] flex items-center ${
                          item.isPositive ? "text-[#10B981]" : "text-rose-400"
                        }`}
                      >
                        {item.isPositive ? (
                          <TrendingUp className="w-3 h-3 inline mr-0.5" />
                        ) : (
                          <TrendingDown className="w-3 h-3 inline mr-0.5" />
                        )}
                        {item.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Vetted Lots Section */}
      <section id="marketplace" className="px-8 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Certified Physical Batches
              <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                {filteredBatches.length} LOTS AVAILABLE
              </span>
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Physical inventory audited by accredited laboratories with custody held in verified bonded vaults.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === "all"
                  ? "bg-[#D4AF37] text-black font-bold"
                  : "bg-[#14171F] text-white/60 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("metals")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === "metals"
                  ? "bg-[#D4AF37] text-black font-bold"
                  : "bg-[#14171F] text-white/60 hover:text-white"
              }`}
            >
              Precious Metals
            </button>
            <button
              onClick={() => setSelectedCategory("stones")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === "stones"
                  ? "bg-[#D4AF37] text-black font-bold"
                  : "bg-[#14171F] text-white/60 hover:text-white"
              }`}
            >
              Precious Stones
            </button>
            <button
              onClick={() => setSelectedCategory("rare-earth")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === "rare-earth"
                  ? "bg-[#D4AF37] text-black font-bold"
                  : "bg-[#14171F] text-white/60 hover:text-white"
              }`}
            >
              Rare Earth / Critical
            </button>
          </div>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <MineralShowcaseCard key={batch.id} lot={batch} />
          ))}
        </div>
      </section>

      {/* 6. B2B Feature Grid (4 Pillars) */}
      <section id="services" className="px-8 py-20 bg-[#14171F]/50 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
              INSTITUTIONAL GRADE INFRASTRUCTURE
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Built for Sovereign Transparency & Risk Mitigation
            </h2>
            <p className="text-sm text-white/60 mt-3 leading-relaxed">
              Every trade executes through audited physical checkpoints, ensuring compliant bilateral transactions across African mining hubs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#14171F] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Sourcing Due Diligence
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Comprehensive provenance validation verifying mining concessions, artisanal collective compliance, OECD conflict-free declarations, and sovereign operational permits.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#14171F] border border-white/[0.08] hover:border-[#10B981]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Lab Assay Coordination
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Coordinated spectrographic and fire-assay testing through ISO 17025 accredited partners (SGS, Alex Stewart, MEMD Laboratories) with tamper-evident digital certificates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#14171F] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Export Facilitation
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Automated document generation for ICGLR certification, mineral export declarations, sovereign royalties processing, and bonded air-freight logistics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#14171F] border border-white/[0.08] hover:border-[#10B981]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageSquareCheck className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Secure In-App Negotiations
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Legally binding LOI and FCO workflows, real-time encrypted messaging, tripartite buyer-seller-escrow dispute mitigation, and verified bank custody settlements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Global Desktop Footer */}
      <GlobalFooter />
    </div>
  );
}
