"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Gem,
  ArrowLeft,
  Wrench,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Layers,
  Zap,
  DollarSign,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const MACHINE_PRESETS = [
  {
    type: "Cone Crusher",
    name: "Symons Standard 4 1/4 Ft Secondary Cone Crusher",
    capacityTPH: "180",
    powerReq: "160 kW (3-Phase 380V/50Hz)",
    incoterms: "FOB Durban Port",
    priceUSD: "210000",
    photo:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Excavator",
    name: "Heavy Mining Hydraulic Excavator 45-Ton (CAT 345 Equivalent)",
    capacityTPH: "320",
    powerReq: "283 kW Turbocharged Diesel",
    incoterms: "CIF Mombasa Port",
    priceUSD: "345000",
    photo:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Ball Mill",
    name: "Continuous Discharge Overflow Ball Mill (Ø2.4 x 4.5m)",
    capacityTPH: "45",
    powerReq: "320 kW Wound Rotor Motor",
    incoterms: "EXW Ndola Depot, Zambia",
    priceUSD: "295000",
    photo:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Gravity Separation Plant",
    name: "Centrifugal Gold Concentrator & Spiral Shaking Tables",
    capacityTPH: "60",
    powerReq: "45 kW Electric Submersible",
    incoterms: "FOB Dar es Salaam",
    priceUSD: "165000",
    photo:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "Optical Gem Sorter",
    name: "High-Resolution Dual Sensor Tanzanite & Diamond Sorter",
    capacityTPH: "15",
    powerReq: "18 kW Pneumatic Air Ejection",
    incoterms: "CIF Entebbe International Airport",
    priceUSD: "480000",
    photo:
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
  },
];

export default function NewEquipmentPage() {
  const router = useRouter();

  // Form states
  const [machineType, setMachineType] = useState("Cone Crusher");
  const [equipmentName, setEquipmentName] = useState("Symons Standard 4 1/4 Ft Secondary Cone Crusher");
  const [capacityTPH, setCapacityTPH] = useState("180");
  const [powerRequirement, setPowerRequirement] = useState("160 kW (3-Phase 380V/50Hz)");
  const [deliveryIncoterms, setDeliveryIncoterms] = useState("FOB Durban Port");
  const [priceUSD, setPriceUSD] = useState("210000");
  const [leadTime, setLeadTime] = useState("Immediate Dispatch (In Stock)");
  const [depotLocation, setDepotLocation] = useState("Kampala Industrial Park, Uganda");
  const [specSheetFileName, setSpecSheetFileName] = useState<string | null>("Cone_Crusher_Technical_Blueprint.pdf");
  const [photoUrl, setPhotoUrl] = useState(MACHINE_PRESETS[0].photo);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectPreset = (preset: typeof MACHINE_PRESETS[0]) => {
    setMachineType(preset.type);
    setEquipmentName(preset.name);
    setCapacityTPH(preset.capacityTPH);
    setPowerRequirement(preset.powerReq);
    setDeliveryIncoterms(preset.incoterms);
    setPriceUSD(preset.priceUSD);
    setPhotoUrl(preset.photo);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleSpecSheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSpecSheetFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!equipmentName.trim() || !capacityTPH.trim() || !powerRequirement.trim()) {
      setErrorMessage("Please complete all mandatory machinery specifications.");
      return;
    }

    setLoading(true);

    try {
      const equipmentId = `EQP-${machineType.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      const equipmentData = {
        id: equipmentId,
        name: equipmentName.trim(),
        machineType,
        category: machineType,
        capacity: `${capacityTPH} TPH`,
        capacityTPH: parseFloat(capacityTPH),
        powerRequirement: powerRequirement.trim(),
        deliveryIncoterms,
        leadTime,
        priceUSD: `$${parseFloat(priceUSD).toLocaleString()}`,
        status: "In Stock" as const,
        location: depotLocation,
        specSheetFileName: specSheetFileName || "Machinery_Spec_Sheet.pdf",
        photoUrl,
        createdAt: new Date().toISOString(),
      };

      // 1. Cache in session storage
      const existing = JSON.parse(sessionStorage.getItem("mda_custom_equipment") || "[]");
      existing.unshift(equipmentData);
      sessionStorage.setItem("mda_custom_equipment", JSON.stringify(existing));

      // 2. Write to Supabase if table exists
      try {
        const supabase = createClient();
        await supabase.from("mining_equipment").insert(equipmentData);
      } catch (dbErr) {
        console.warn("Equipment Supabase notice:", dbErr);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register machinery.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08] relative z-10">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full bg-[#0B0C10] rounded-[10px] flex items-center justify-center">
              <Gem className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider text-white">MDA</span>
            <span className="text-[9px] text-[#D4AF37] block font-mono">EQUIPMENT CATALOG</span>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14171F] hover:bg-[#1C212D] border border-white/[0.08] text-xs font-mono text-white/80 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </header>

      {/* Main Form Box */}
      <main className="max-w-4xl w-full mx-auto my-8 p-6 sm:p-10 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0C10] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            HEAVY INDUSTRIAL MINING MACHINERY
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Register New Mining Equipment
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1 leading-relaxed">
            List crushers, continuous grinding mills, optical sorting plants, and excavators available for direct delivery to African mining concessions.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-6 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-mono mb-6 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Machinery published successfully to the MDA Industrial Catalog! Redirecting...</span>
          </div>
        )}

        {/* Quick Machine Presets Bar */}
        <div className="mb-8">
          <span className="text-[11px] font-mono text-white/50 block mb-2 uppercase tracking-wider">
            QUICK PRESETS (HEAVY PLANT):
          </span>
          <div className="flex flex-wrap gap-2">
            {MACHINE_PRESETS.map((preset) => (
              <button
                key={preset.type}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  machineType === preset.type
                    ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow"
                    : "bg-[#0B0C10] text-white/70 border-white/[0.06] hover:border-white/[0.2] hover:text-white"
                }`}
              >
                {preset.type}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Machine Type & Name */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                MACHINE TYPE *
              </label>
              <select
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
                className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <option value="Cone Crusher">Cone Crusher</option>
                <option value="Jaw Crusher">Jaw Crusher</option>
                <option value="Excavator">Excavator / Heavy Earthmover</option>
                <option value="Ball Mill">Ball Mill / Sag Mill</option>
                <option value="Gravity Separation Plant">Gravity Separation Plant</option>
                <option value="Optical Gem Sorter">Optical Gem Sorter</option>
                <option value="Core Drill Rig">Core Drill Rig</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                MODEL NAME & SPECIFICATION *
              </label>
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                placeholder="e.g. Symons Standard 4 1/4 Ft Secondary Cone Crusher"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                required
              />
            </div>
          </div>

          {/* Capacity (TPH) & Power Requirement */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                THROUGHPUT CAPACITY (TPH - TONNES PER HOUR) *
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  step="any"
                  value={capacityTPH}
                  onChange={(e) => setCapacityTPH(e.target.value)}
                  placeholder="180"
                  className="w-full h-12 pl-10 pr-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                POWER REQUIREMENT *
              </label>
              <div className="relative">
                <Zap className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={powerRequirement}
                  onChange={(e) => setPowerRequirement(e.target.value)}
                  placeholder="e.g. 160 kW (3-Phase 380V / 50Hz) or Diesel Hydraulic"
                  className="w-full h-12 pl-10 pr-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Incoterms & Price */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                DELIVERY INCOTERMS *
              </label>
              <input
                type="text"
                value={deliveryIncoterms}
                onChange={(e) => setDeliveryIncoterms(e.target.value)}
                placeholder="e.g. FOB Durban Port / CIF Mombasa"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                PRICE (USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  value={priceUSD}
                  onChange={(e) => setPriceUSD(e.target.value)}
                  placeholder="210000"
                  className="w-full h-12 pl-9 pr-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                LEAD TIME & AVAILABILITY
              </label>
              <input
                type="text"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                placeholder="e.g. Immediate Dispatch / 3 Weeks"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-white/60 block mb-1.5">
              DEPOT / WAREHOUSE LOCATION *
            </label>
            <input
              type="text"
              value={depotLocation}
              onChange={(e) => setDepotLocation(e.target.value)}
              placeholder="e.g. Kampala Industrial Park, Uganda"
              className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
              required
            />
          </div>

          {/* Machinery Spec Sheet Upload */}
          <div className="p-5 rounded-2xl bg-[#0B0C10] border border-dashed border-white/[0.15] hover:border-[#D4AF37]/40 transition-colors">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#D4AF37]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Upload Machinery Specification Sheet (PDF / CAD) *
                  </span>
                  <span className="text-[11px] text-white/50 font-mono block truncate max-w-[280px]">
                    {specSheetFileName || "Attach technical datasheet, dimensions & power draw"}
                  </span>
                </div>
              </div>

              <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white/80 transition-colors whitespace-nowrap">
                <span>Browse Spec Sheet</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleSpecSheetUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Photograph Preview */}
          <div className="p-5 rounded-2xl bg-[#0B0C10] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                Primary Machinery Photograph
              </span>
              <label className="cursor-pointer text-xs font-mono text-[#D4AF37] hover:underline">
                <span>Upload Custom Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black border border-white/[0.08]">
              <Image
                src={photoUrl}
                alt={equipmentName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-black/50 pointer-events-none" />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#D4AF37] border border-white/[0.1]">
                {machineType}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white/80 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>{loading ? "Registering Machine..." : "Publish to Catalog"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
