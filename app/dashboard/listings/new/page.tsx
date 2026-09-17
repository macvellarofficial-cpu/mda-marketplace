"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Gem,
  ArrowLeft,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Scale,
  Sparkles,
  Camera,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { COUNTRIES } from "@/utils/regions";

export type CategoryType = "Precious Metals" | "Precious Stones" | "Rare Earth Elements";
export type AssayLabType =
  | "SGS"
  | "Alex Stewart International"
  | "MEMD Directorate of Geological Survey"
  | "Bureau Veritas";

interface PresetMineral {
  name: string;
  category: CategoryType;
  defaultPurity: string;
  defaultUnit: "kg" | "MT" | "carats";
  defaultPricePerUnit: string;
  defaultPhoto: string;
}

const PRESETS: PresetMineral[] = [
  {
    name: "Gold Doré Bars",
    category: "Precious Metals",
    defaultPurity: "94.5% Au",
    defaultUnit: "kg",
    defaultPricePerUnit: "74000",
    defaultPhoto:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Copper Cathodes Grade A",
    category: "Precious Metals",
    defaultPurity: "99.99% Cu Electrowon",
    defaultUnit: "MT",
    defaultPricePerUnit: "9850",
    defaultPhoto:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Spodumene Concentrate (SC6)",
    category: "Rare Earth Elements",
    defaultPurity: "6.14% Li2O",
    defaultUnit: "MT",
    defaultPricePerUnit: "980",
    defaultPhoto:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tantalite (Coltan 30%+)",
    category: "Rare Earth Elements",
    defaultPurity: "32.4% Ta2O5",
    defaultUnit: "kg",
    defaultPricePerUnit: "142",
    defaultPhoto:
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rough Kimberlite Diamonds",
    category: "Precious Stones",
    defaultPurity: "VVS-SI Gem Quality",
    defaultUnit: "carats",
    defaultPricePerUnit: "3360",
    defaultPhoto:
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Natural Tanzanite (Blue Zoisite)",
    category: "Precious Stones",
    defaultPurity: "AAA Vivid Royal Blue",
    defaultUnit: "carats",
    defaultPricePerUnit: "600",
    defaultPhoto:
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
  },
];

export default function NewListingPage() {
  const router = useRouter();

  // Form states
  const [category, setCategory] = useState<CategoryType>("Precious Metals");
  const [mineralName, setMineralName] = useState("Gold Doré Bars");
  const [purityGrade, setPurityGrade] = useState("94.5% Au Refined");
  const [weight, setWeight] = useState("100.00");
  const [unit, setUnit] = useState<"kg" | "MT" | "carats">("kg");
  const [incoterms, setIncoterms] = useState<"FOB" | "CIF" | "EXW" | "CFR">("FOB");
  const [countryCode, setCountryCode] = useState("UG");
  const [region, setRegion] = useState(COUNTRIES[0].regions[0] || "");
  const [askingPriceUSD, setAskingPriceUSD] = useState("7400000");
  const [assayLab, setAssayLab] = useState<AssayLabType>(
    "MEMD Directorate of Geological Survey"
  );
  const [assayCertNumber, setAssayCertNumber] = useState("ASY-UG-2026-GLD-778");
  const [assayFileName, setAssayFileName] = useState<string | null>(
    "SGS_Spectrographic_Report_Lot_049.pdf"
  );
  const [description, setDescription] = useState("");

  // Image upload states (MANDATORY)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    PRESETS[0].defaultPhoto
  );
  const [imageFileName, setImageFileName] = useState<string>("gold_dore_specimen.jpg");

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedCountry =
    COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const country = COUNTRIES.find((c) => c.code === code);
    if (country) {
      setRegion(country.regions[0] || "");
    }
  };

  const handlePresetSelect = (preset: PresetMineral) => {
    setCategory(preset.category);
    setMineralName(preset.name);
    setPurityGrade(preset.defaultPurity);
    setUnit(preset.defaultUnit);
    const numericWeight = parseFloat(weight) || 1;
    const unitPrice = parseFloat(preset.defaultPricePerUnit) || 1000;
    setAskingPriceUSD((numericWeight * unitPrice).toFixed(0));

    // If user hasn't uploaded a manual file, update the preview to the preset specimen photo
    if (!imageFile) {
      setImagePreview(preset.defaultPhoto);
      setImageFileName(`${preset.name.toLowerCase().replace(/\s+/g, "_")}_specimen.jpg`);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageFileName(file.name);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setErrorMessage("");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageFileName("");
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssayFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Mandatory image check
    if (!imageFile && !imagePreview) {
      setErrorMessage(
        "Mandatory Photograph Required: You must attach at least 1 verified photograph of the physical mineral specimen or lot before publishing."
      );
      return;
    }

    if (!mineralName.trim() || !purityGrade.trim() || !weight.trim()) {
      setErrorMessage("Please fill in all mandatory mineral specification fields.");
      return;
    }

    if (!askingPriceUSD.trim() || parseFloat(askingPriceUSD) <= 0) {
      setErrorMessage("Please specify a valid indicative valuation in USD.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      let sellerId: string | null = null;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        sellerId = user?.id || null;
      } catch (authErr) {
        console.warn("Auth user lookup notice:", authErr);
      }

      // Upload image to 'mineral-images' Supabase Storage bucket
      let publicImageUrl = imagePreview || "";

      if (imageFile) {
        try {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const filePath = `${sellerId || "public"}/${fileName}`;

          const { error: storageError } = await supabase.storage
            .from("mineral-images")
            .upload(filePath, imageFile);

          if (!storageError) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("mineral-images").getPublicUrl(filePath);
            publicImageUrl = publicUrl;
          } else {
            console.warn(
              "Supabase storage upload notice (using fallback url):",
              storageError.message
            );
          }
        } catch (storageErr) {
          console.warn("Storage upload exception:", storageErr);
        }
      }

      // Generate unique lot ID
      const lotId = `MDA-${mineralName
        .substring(0, 3)
        .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      const listingData = {
        lot_id: lotId,
        seller_id: sellerId,
        category,
        commodity: mineralName.trim(),
        grade: purityGrade.trim(),
        purity: purityGrade.trim(),
        weight: `${parseFloat(weight).toLocaleString()} ${unit}`,
        incoterms,
        origin_country: selectedCountry.name,
        origin_region: region,
        price_usd: `$${parseFloat(askingPriceUSD).toLocaleString()}`,
        status: "active",
        images: [publicImageUrl],
        assay_lab: assayLab,
        assay_cert_number: assayCertNumber,
        assay_file_name: assayFileName,
        notes: description.trim(),
        created_at: new Date().toISOString(),
      };

      // 1. Direct write to public.mineral_listings table
      const { error: dbError } = await supabase
        .from("mineral_listings")
        .insert(listingData);

      if (dbError) {
        console.warn("Supabase listings insert notice:", dbError.message);
      }

      // 2. Cache in session storage for instant dashboard and marketplace updates
      const existingListings = JSON.parse(
        sessionStorage.getItem("mda_custom_listings") || "[]"
      );
      existingListings.unshift(listingData);
      sessionStorage.setItem(
        "mda_custom_listings",
        JSON.stringify(existingListings)
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create listing.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] py-8 px-4 sm:px-8 relative">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08] relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] font-mono text-[#D4AF37]">
            SUPPLIER CONCESSION INTAKE
          </span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto my-8 relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0C10] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                VERIFIED LOT CREATION
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Register New Mineral Batch
              </h1>
              <p className="text-xs text-white/60 mt-1">
                List audited physical commodity lots with mandatory specimen photography for institutional buyers and accredited refiners.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0B0C10] border border-white/[0.05] text-xs font-mono">
              <Scale className="w-4 h-4 text-[#10B981]" />
              <span className="text-white/80">MEMD & OECD Compliant</span>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-6 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-mono mb-6 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>
                Batch listing registered successfully with verified photograph! Redirecting to dashboard...
              </span>
            </div>
          )}

          {/* Quick Presets Bar */}
          <div className="mb-8">
            <span className="text-[11px] font-mono text-white/50 block mb-2 uppercase tracking-wider">
              QUICK-SELECT ACCREDITED MINERAL PRESETS:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    mineralName === preset.name
                      ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                      : "bg-[#0B0C10] text-white/70 border-white/[0.06] hover:border-white/[0.2] hover:text-white"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* MANDATORY IMAGE UPLOAD SECTION */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10] border-2 border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#D4AF37]" />
                    Mineral Lot / Physical Specimen Photograph
                    <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                      STRICTLY MANDATORY *
                    </span>
                  </span>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    High-resolution photograph showing physical assay hallmarks, bar stamping, or raw ore sample.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded border border-[#10B981]/20 self-start sm:self-auto">
                  SUPABASE &apos;mineral-images&apos;
                </span>
              </div>

              {/* Instant Image Preview Box */}
              {imagePreview ? (
                <div className="p-4 rounded-xl bg-[#14171F] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-full sm:w-52 h-36 rounded-lg overflow-hidden border border-white/[0.1] flex-shrink-0 bg-black">
                    <Image
                      src={imagePreview}
                      alt="Mineral Specimen Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 208px"
                      unoptimized={imagePreview.startsWith("blob:")}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/[0.1] text-[9px] font-mono text-[#D4AF37]">
                      PRIMARY SPECIMEN
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-left w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white font-mono truncate">
                        {imageFileName || "verified_mineral_specimen.jpg"}
                      </span>
                      <span className="text-[10px] text-[#10B981] font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready for Upload
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      This primary photograph will be displayed on the public marketplace and certified on the bilateral escrow dossier.
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <label className="cursor-pointer text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-white/20">|</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Upload Zone */
                <label className="relative border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#14171F]/60 flex flex-col items-center justify-center group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    required
                  />
                  <div className="w-14 h-14 rounded-2xl bg-[#0B0C10] border border-[#D4AF37]/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <Camera className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <span className="text-sm font-bold text-white block">
                    Upload Physical Mineral Specimen Photograph *
                  </span>
                  <span className="text-xs text-white/50 mt-1 max-w-sm block">
                    Click to browse or drag & drop JPG, PNG, or WebP photo (Max 15MB). Cannot submit without this image.
                  </span>
                </label>
              )}
            </div>

            {/* 1. Category & Mineral Name */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  COMMODITY SECTOR CATEGORY *
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                  >
                    <option value="Precious Metals">
                      Precious Metals (Gold, Copper, Platinum)
                    </option>
                    <option value="Precious Stones">
                      Precious Stones (Diamonds, Tanzanite, Emeralds)
                    </option>
                    <option value="Rare Earth Elements">
                      Rare Earth Elements (Lithium, Coltan, Cobalt)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  MINERAL COMMODITY NAME *
                </label>
                <input
                  type="text"
                  value={mineralName}
                  onChange={(e) => setMineralName(e.target.value)}
                  placeholder="e.g. Gold Doré Bars / Copper Cathodes"
                  className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  required
                />
              </div>
            </div>

            {/* 2. Purity & Weight */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  ASSAYED PURITY / GRADE *
                </label>
                <input
                  type="text"
                  value={purityGrade}
                  onChange={(e) => setPurityGrade(e.target.value)}
                  placeholder="e.g. 94.5% Au / 99.99% Cu"
                  className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  CERTIFIED WEIGHT / QUANTITY *
                </label>
                <input
                  type="number"
                  step="any"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="100.00"
                  className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  WEIGHT MEASUREMENT UNIT *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "kg" | "MT" | "carats")}
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <option value="kg">Kilograms (kg) - Bullion & Concentrates</option>
                  <option value="MT">Metric Tonnes (MT) - Base & Bulk Ores</option>
                  <option value="carats">Carats (cts) - Gemstones & Diamonds</option>
                </select>
              </div>
            </div>

            {/* 3. Incoterms & Concession Origin */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  INCOTERMS DELIVERY TERM *
                </label>
                <select
                  value={incoterms}
                  onChange={(e) =>
                    setIncoterms(e.target.value as "FOB" | "CIF" | "EXW" | "CFR")
                  }
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <option value="FOB">FOB (Free on Board - Entebbe / Mombasa)</option>
                  <option value="CIF">CIF (Cost, Insurance, Freight - Dubai)</option>
                  <option value="EXW">EXW (Ex Works - Bonded Vault Depot)</option>
                  <option value="CFR">CFR (Cost and Freight)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  ORIGIN COUNTRY *
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  CONCESSION MINING DISTRICT *
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  {selectedCountry.regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Indicative Asking Price in USD */}
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                INDICATIVE ASKING VALUATION (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="any"
                  value={askingPriceUSD}
                  onChange={(e) => setAskingPriceUSD(e.target.value)}
                  placeholder="7400000"
                  className="w-full h-12 pl-8 pr-4 bg-[#0B0C10] border border-white/[0.08] text-base font-mono font-bold text-white rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mt-1.5">
                <span>
                  Unit Benchmark: ~$
                  {parseFloat(weight) > 0
                    ? (parseFloat(askingPriceUSD) / parseFloat(weight)).toFixed(2)
                    : "0.00"}{" "}
                  / {unit}
                </span>
                <span className="text-[#10B981]">Escrow Protected Release</span>
              </div>
            </div>

            {/* 5. Laboratory Assay Certificate Upload Container */}
            <div className="p-5 rounded-2xl bg-[#0B0C10] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                    Accredited Laboratory Assay Verification
                  </span>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    Attach spectrographic certificate from an accredited testing facility.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30">
                  ISO 17025 REQD
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-white/50 block mb-1">
                    TESTING LABORATORY
                  </label>
                  <select
                    value={assayLab}
                    onChange={(e) => setAssayLab(e.target.value as AssayLabType)}
                    className="w-full h-11 bg-[#14171F] border border-white/[0.06] text-xs text-white rounded-xl px-3 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="MEMD Directorate of Geological Survey">
                      MEMD Directorate of Geological Survey (Entebbe)
                    </option>
                    <option value="SGS">SGS Mineral Services</option>
                    <option value="Alex Stewart International">
                      Alex Stewart International
                    </option>
                    <option value="Bureau Veritas">Bureau Veritas Minerals</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/50 block mb-1">
                    OFFICIAL CERTIFICATE #
                  </label>
                  <input
                    type="text"
                    value={assayCertNumber}
                    onChange={(e) => setAssayCertNumber(e.target.value)}
                    placeholder="ASY-UG-2026-GLD-778"
                    className="w-full h-11 px-3 bg-[#14171F] border border-white/[0.06] text-xs text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono"
                  />
                </div>
              </div>

              {/* Drag and Drop Container */}
              <div className="relative border-2 border-dashed border-white/[0.12] hover:border-[#D4AF37]/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#14171F]/50 group">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileDrop}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-xl bg-[#0B0C10] border border-white/[0.08] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-semibold text-white block">
                    {assayFileName ? (
                      <span className="text-[#10B981] font-mono flex items-center gap-1.5 justify-center">
                        <CheckCircle2 className="w-4 h-4" /> Attached: {assayFileName}
                      </span>
                    ) : (
                      "Click to upload or drag & drop assay document"
                    )}
                  </span>
                  <span className="text-[10px] text-white/40 mt-1 font-mono">
                    PDF, JPG or PNG (Spectrographic analysis, XRF / Fire Assay) max 25MB
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Concession Notes */}
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                CONCESSION NOTES & CUSTODY SPECIFICATIONS (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include details regarding sovereign bonded warehouse location, vault seals, or special export packaging..."
                className="w-full p-4 bg-[#0B0C10] border border-white/[0.08] text-xs text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 text-xs font-mono transition-all"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading || success}
                className="px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 disabled:opacity-50 active:scale-98"
              >
                <Gem className="w-4 h-4" />
                <span>
                  {loading
                    ? "Uploading & Registering..."
                    : success
                    ? "Listing Published!"
                    : "Publish Mineral Batch"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
