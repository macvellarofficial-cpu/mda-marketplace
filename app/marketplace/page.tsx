"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import { Gem, Search, PlusCircle, Sparkles } from "lucide-react";
import MineralShowcaseCard, {
  MineralLotItem,
} from "@/components/MineralShowcaseCard";
import { getMineralFallbackImage } from "@/utils/mineralFallback";

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

const DEFAULT_LOTS: MineralLotItem[] = [
  {
    id: "MDA-GLD-088",
    assayNo: "ASY-UG-2026-GLD-019",
    name: "94.5% Au Unrefined Gold Bars",
    category: "metals",
    grade: "Commercial Bullion (94.5% Au)",
    purity: "94.50% Au Refined",
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
    grade: "Electrowon 99.99% Cu",
    purity: "99.99% Cu Electrowon",
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
    grade: "Battery Hydroxide Feed (6.22% Li2O)",
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
    grade: "Ta2O5 > 32% Certified",
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
    grade: "VVS-SI Gem Quality Rough",
    purity: "Kimberley Process Cleared",
    weight: "1,250.00 cts",
    origin: "Orapa District, Botswana",
    institution: "Kalahari Diamond Exchange",
    price: "$4,200,000",
    status: "Vault Custody",
    auditPartner: "KPCS Verified / GIA",
    incoterms: "CIF Antwerp",
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
    incoterms: "FOB Dar es Salaam",
    images: [
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allLots, setAllLots] = useState<MineralLotItem[]>(DEFAULT_LOTS);

  // Load custom listings created by supplier
  useEffect(() => {
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

        setAllLots([...mapped, ...DEFAULT_LOTS]);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const filteredLots = allLots.filter((lot) => {
    const matchesCategory =
      selectedCategory === "all" ||
      lot.category === selectedCategory ||
      (selectedCategory === "metals" && lot.category === "Precious Metals") ||
      (selectedCategory === "stones" && lot.category === "Precious Stones") ||
      (selectedCategory === "rare-earth" && lot.category === "Rare Earth Elements");

    const matchesSearch =
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.assayNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.origin.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0C10]/85 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Mineral Dealers Africa"
              width={180}
              height={42}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/listings/new"
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)] flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Batch</span>
            </Link>

            <Link
              href="/dashboard"
              className="text-xs font-mono text-white/70 hover:text-white px-3 py-2 rounded-lg bg-[#14171F] border border-white/[0.08]"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {/* Marketplace Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14171F] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE VERIFIED INVENTORY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Mineral Exchange
          </h1>
          <p className="text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
            All physical commodity lots are backed by accredited spectrographic laboratory certificates, photographic provenance, and bonded escrow settlement.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#14171F] border border-white/[0.08] shadow-2xl mb-10 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mineral, assay ID (e.g. ASY-UG-2026), or concession origin..."
              className="w-full h-12 pl-11 pr-4 bg-[#0B0C10] border border-white/[0.06] text-xs text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0C10] p-1.5 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === "all"
                  ? "bg-[#D4AF37] text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              All Lots
            </button>
            <button
              onClick={() => setSelectedCategory("metals")}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === "metals"
                  ? "bg-[#D4AF37] text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Precious Metals
            </button>
            <button
              onClick={() => setSelectedCategory("stones")}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === "stones"
                  ? "bg-[#D4AF37] text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Precious Stones
            </button>
            <button
              onClick={() => setSelectedCategory("rare-earth")}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === "rare-earth"
                  ? "bg-[#D4AF37] text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Rare Earths / Critical
            </button>
          </div>
        </div>

        {/* Visual Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <MineralShowcaseCard key={lot.id} lot={lot} />
          ))}
        </div>

        {filteredLots.length === 0 && (
          <div className="py-20 text-center rounded-3xl bg-[#14171F] border border-white/[0.08]">
            <Gem className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <span className="text-base font-bold text-white block">
              No mineral lots match your criteria
            </span>
            <p className="text-xs text-white/40 mt-1">
              Try adjusting your search query or category filter.
            </p>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}
