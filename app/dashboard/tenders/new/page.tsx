"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gem,
  ArrowLeft,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Lock,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function NewBuyingTenderPage() {
  const router = useRouter();

  // Form states
  const [tenderTitle, setTenderTitle] = useState("Procurement of 500 MT Copper Cathodes Grade A");
  const [commodity, setCommodity] = useState("Copper Cathodes");
  const [targetPurity, setTargetPurity] = useState("99.99% Cu Electrowon");
  const [requiredQuantity, setRequiredQuantity] = useState("500");
  const [unit, setUnit] = useState<"MT" | "kg" | "carats">("MT");
  const [tenderType, setTenderType] = useState<"Spot Batch" | "Monthly Offtake (12 Months)" | "Quarterly Offtake">("Monthly Offtake (12 Months)");
  const [destinationPort, setDestinationPort] = useState("CIF Rotterdam / Antwerp Port");
  const [incoterms, setIncoterms] = useState<"CIF" | "FOB" | "EXW">("CIF");
  const [indicativeBudgetUSD, setIndicativeBudgetUSD] = useState("4925000");
  const [escrowBank, setEscrowBank] = useState("Tier-1 Bonded Custody (Stanbic Bank / Absa)");
  const [deadlineDays, setDeadlineDays] = useState("14");
  const [specFileName, setSpecFileName] = useState<string | null>("Offtake_Commercial_Specs_RFP_2026.pdf");
  const [notes, setNotes] = useState(
    "Seeking accredited African refinery or sovereign-licensed concessionaire capable of recurring monthly shipments under standard international L/C or Tier-1 bonded cash escrow."
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSpecFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!tenderTitle.trim() || !commodity.trim() || !requiredQuantity.trim()) {
      setErrorMessage("Please complete all mandatory tender specifications.");
      return;
    }

    setLoading(true);

    try {
      const tenderId = `TND-2026-${Math.floor(100 + Math.random() * 900)}`;
      const tenderData = {
        id: tenderId,
        title: tenderTitle.trim(),
        commodity: commodity.trim(),
        targetPurity: targetPurity.trim(),
        quantity: `${parseFloat(requiredQuantity).toLocaleString()} ${unit}`,
        tenderType,
        destinationPort,
        incoterms,
        budgetUSD: `$${parseFloat(indicativeBudgetUSD).toLocaleString()}`,
        escrowBank,
        deadline: `${deadlineDays} Days Remaining`,
        specFileName: specFileName || "RFP_Specification_Sheet.pdf",
        notes: notes.trim(),
        status: "Open for Bids",
        bidsCount: 0,
        createdAt: new Date().toISOString(),
      };

      // 1. Cache in session storage for instant dashboard updates
      const existingTenders = JSON.parse(sessionStorage.getItem("mda_buyer_tenders") || "[]");
      existingTenders.unshift(tenderData);
      sessionStorage.setItem("mda_buyer_tenders", JSON.stringify(existingTenders));

      // 2. Try writing to Supabase if table exists
      try {
        const supabase = createClient();
        await supabase.from("buying_tenders").insert(tenderData);
      } catch (dbErr) {
        console.warn("Tender Supabase note:", dbErr);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish buying tender.";
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
            <span className="text-[9px] text-[#D4AF37] block font-mono">BUYER PROCUREMENT</span>
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
            INSTITUTIONAL COMMODITY TENDER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Post International Buying Tender
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1 leading-relaxed">
            Broadcast procurement requirements to sovereign-licensed African mining concessions, accredited smelters, and verified artisanal cooperatives.
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
            <span>Tender broadcast successfully to verified miners! Redirecting to dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tender Title */}
          <div>
            <label className="text-xs font-mono text-white/60 block mb-1.5">
              PROCUREMENT TENDER TITLE *
            </label>
            <input
              type="text"
              value={tenderTitle}
              onChange={(e) => setTenderTitle(e.target.value)}
              placeholder="e.g. Sourcing 1,000 MT Lithium Spodumene SC6 (CIF Beira)"
              className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
              required
            />
          </div>

          {/* Commodity & Target Purity */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                COMMODITY OF INTEREST *
              </label>
              <input
                type="text"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                placeholder="e.g. Gold Doré / Copper Cathodes / Spodumene"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                MINIMUM REQUIRED ASSAYED PURITY *
              </label>
              <input
                type="text"
                value={targetPurity}
                onChange={(e) => setTargetPurity(e.target.value)}
                placeholder="e.g. 94.5% Au / 99.99% Cu / 6.0% Li2O"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                required
              />
            </div>
          </div>

          {/* Quantity, Units & Tender Frequency */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                TARGET QUANTITY *
              </label>
              <input
                type="number"
                step="any"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                placeholder="500"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                MEASUREMENT UNIT *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as "MT" | "kg" | "carats")}
                className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <option value="MT">Metric Tonnes (MT)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="carats">Carats (cts)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                OFFTAKE FREQUENCY *
              </label>
              <select
                value={tenderType}
                onChange={(e) => setTenderType(e.target.value as typeof tenderType)}
                className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <option value="Spot Batch">One-Off Spot Batch</option>
                <option value="Monthly Offtake (12 Months)">Monthly Offtake (12 Mos)</option>
                <option value="Quarterly Offtake">Quarterly Offtake Contract</option>
              </select>
            </div>
          </div>

          {/* Delivery Port, Incoterms, Budget and Deadline */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                DELIVERY INCOTERMS *
              </label>
              <select
                value={incoterms}
                onChange={(e) => setIncoterms(e.target.value as "CIF" | "FOB" | "EXW")}
                className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                <option value="FOB">FOB (Free on Board - Origin Port)</option>
                <option value="EXW">EXW (Ex-Works - Vault Custody)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                DISCHARGE PORT *
              </label>
              <input
                type="text"
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                placeholder="e.g. CIF Rotterdam"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                INDICATIVE BUDGET (USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  value={indicativeBudgetUSD}
                  onChange={(e) => setIndicativeBudgetUSD(e.target.value)}
                  placeholder="4925000"
                  className="w-full h-12 pl-9 pr-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1.5">
                BID DEADLINE (DAYS) *
              </label>
              <input
                type="number"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                placeholder="14"
                min="1"
                max="90"
                className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                required
              />
            </div>
          </div>

          {/* Escrow Custody Structure */}
          <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-bold text-white">Tier-1 Bonded Escrow Settlement</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              All supplier bids are legally protected. Payment releases execute strictly against accredited spectrographic assay results (SGS, Alex Stewart) at the bonded custody vault.
            </p>
            <input
              type="text"
              value={escrowBank}
              onChange={(e) => setEscrowBank(e.target.value)}
              className="w-full h-10 px-3 bg-[#14171F] border border-white/[0.08] text-xs text-white rounded-lg focus:outline-none focus:border-[#D4AF37] font-mono"
            />
          </div>

          {/* Document Upload Container */}
          <div className="p-5 rounded-2xl bg-[#0B0C10] border border-dashed border-white/[0.15] hover:border-[#D4AF37]/40 transition-colors">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#D4AF37]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Upload Technical Specifications / RFP Document
                  </span>
                  <span className="text-[11px] text-white/50 font-mono block truncate max-w-[280px]">
                    {specFileName || "Attach PDF RFP document (Max 25MB)"}
                  </span>
                </div>
              </div>

              <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white/80 transition-colors whitespace-nowrap">
                <span>Browse PDF</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-mono text-white/60 block mb-1.5">
              SPECIAL OFFTAKE INSTRUCTIONS & ASSAY REQUIREMENTS
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify requirements for SGS or Alex Stewart independent lab assays, sampling protocols, and penalty clauses..."
              className="w-full p-3.5 bg-[#0B0C10] border border-white/[0.08] text-xs text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono leading-relaxed"
            />
          </div>

          {/* Submit Action Buttons */}
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
              <FileText className="w-4 h-4" />
              <span>{loading ? "Publishing Tender..." : "Publish Buying Tender"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
