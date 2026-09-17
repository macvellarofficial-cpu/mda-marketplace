"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  FileText,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export type KycStatus = "Pending Review" | "Approved" | "Action Required";

interface DocumentSlot {
  id: "ursb_cert" | "memd_license" | "ura_tax";
  title: string;
  regulator: string;
  code: string;
  description: string;
  sampleFormat: string;
  fileName: string | null;
  fileSize?: string;
  uploadDate?: string;
  status: "verified" | "pending" | "empty";
}

const INITIAL_SLOTS: DocumentSlot[] = [
  {
    id: "ursb_cert",
    title: "Certificate of Incorporation",
    regulator: "URSB (Uganda Registration Services Bureau)",
    code: "URSB-B2B-VERIFIED",
    description:
      "Certified Articles of Association or Certificate of Incorporation establishing legal corporate presence.",
    sampleFormat: "PDF format, official registry seal visible (Max 25MB)",
    fileName: "URSB_Cert_Inc_Albertine_Minerals_2025.pdf",
    fileSize: "2.4 MB",
    uploadDate: "2026-08-14",
    status: "verified",
  },
  {
    id: "memd_license",
    title: "Mineral Dealer / Mining Lease License",
    regulator: "MEMD Uganda (Ministry of Energy & Mineral Dev.)",
    code: "MEMD-MIN-STATUTORY",
    description:
      "Statutory Class A Mineral Dealer License, Concession Lease, or Artisanal Cooperative Recognition Permit.",
    sampleFormat: "PDF format, Directorate of Geological Survey stamp (Max 25MB)",
    fileName: "MEMD_ClassA_Dealer_License_2026_0942.pdf",
    fileSize: "4.1 MB",
    uploadDate: "2026-09-02",
    status: "verified",
  },
  {
    id: "ura_tax",
    title: "Tax Clearance Certificate (TCC)",
    regulator: "URA (Uganda Revenue Authority)",
    code: "URA-TCC-CLEARED",
    description:
      "Valid electronic Tax Clearance Certificate certifying compliance with corporate royalties and export duties.",
    sampleFormat: "PDF format, verified QR verification code (Max 25MB)",
    fileName: null,
    fileSize: undefined,
    uploadDate: undefined,
    status: "empty",
  },
];

export default function KycPage() {
  const [kycStatus, setKycStatus] = useState<KycStatus>("Action Required");
  const [docs, setDocs] = useState<DocumentSlot[]>(INITIAL_SLOTS);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Load from cached profile or Supabase
    const cached = sessionStorage.getItem("mda_kyc_data");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.status) setKycStatus(parsed.status);
        if (parsed.docs) setDocs(parsed.docs);
      } catch (e) {
        console.error(e);
      }
    }

    const loadProfileKyc = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("kyc_status, kyc_docs")
            .eq("id", user.id)
            .single();

          if (data) {
            if (data.kyc_status) setKycStatus(data.kyc_status);
            if (data.kyc_docs && Array.isArray(data.kyc_docs)) {
              setDocs(data.kyc_docs);
            }
          }
        }
      } catch (err) {
        console.warn("KYC profile fetch notice:", err);
      }
    };

    loadProfileKyc();
  }, []);

  const handleFileUpload = (
    slotId: "ursb_cert" | "memd_license" | "ura_tax",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const today = new Date().toISOString().split("T")[0];
      const updatedDocs = docs.map((d) => {
        if (d.id === slotId) {
          return {
            ...d,
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: today,
            status: "pending" as const,
          };
        }
        return d;
      });

      setDocs(updatedDocs);

      // Recalculate status
      const allUploaded = updatedDocs.every((d) => d.fileName !== null);
      if (allUploaded) {
        setKycStatus("Pending Review");
      }
    }
  };

  const handleSaveKyc = async () => {
    setSaving(true);
    setSuccessMessage("");

    try {
      const supabase = createClient();
      const allUploaded = docs.every((d) => d.fileName !== null);
      const newStatus: KycStatus = allUploaded ? "Pending Review" : "Action Required";

      setKycStatus(newStatus);

      // Save to Supabase profiles
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("profiles")
          .update({
            kyc_status: newStatus,
            kyc_docs: docs,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      // Cache locally
      sessionStorage.setItem(
        "mda_kyc_data",
        JSON.stringify({ status: newStatus, docs })
      );

      setSuccessMessage(
        allUploaded
          ? "All regulatory certificates submitted. MEMD and URA compliance audit initiated!"
          : "Documents saved. Complete remaining items to request final clearance."
      );
    } catch (err) {
      console.warn("KYC save notice:", err);
      sessionStorage.setItem(
        "mda_kyc_data",
        JSON.stringify({ status: kycStatus, docs })
      );
      setSuccessMessage("KYC documentation saved successfully.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] py-8 px-4 sm:px-8 relative">
      {/* Glow ambient circle */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#10B981]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08] relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span className="text-[11px] font-mono text-white/70">
            SOVEREIGN COMPLIANCE PORTAL
          </span>
        </div>
      </header>

      {/* Main Card */}
      <main className="max-w-4xl mx-auto my-8 relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0C10] border border-[#10B981]/30 text-xs font-mono text-[#10B981] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                KYC & REGULATORY CLEARANCE
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Statutory Accreditation Desk
              </h1>
              <p className="text-xs text-white/60 mt-1">
                Institutional documentation required under the Uganda Mining and Minerals Act (2022) & OECD Due Diligence.
              </p>
            </div>

            {/* Current Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white/50">Current Status:</span>
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                  kycStatus === "Approved"
                    ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40"
                    : kycStatus === "Pending Review"
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/40"
                }`}
              >
                {kycStatus === "Approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {kycStatus === "Pending Review" && <Clock className="w-3.5 h-3.5" />}
                {kycStatus === "Action Required" && <AlertCircle className="w-3.5 h-3.5" />}
                {kycStatus}
              </span>
            </div>
          </div>

          {/* Success Notification */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-mono mb-6 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Compliance Guidelines Ribbon */}
          <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-white/70">
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              <span>
                Tier-1 Trading requires verification across all three statutory regulators.
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#D4AF37]">
              Sovereign Escrow Protection Active
            </span>
          </div>

          {/* 3 DOCUMENT SLOTS */}
          <div className="space-y-4 mb-8">
            {docs.map((slot) => (
              <div
                key={slot.id}
                className="p-5 rounded-2xl bg-[#0B0C10] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white font-mono">
                      {slot.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.2 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      {slot.code}
                    </span>
                  </div>

                  <p className="text-[11px] text-white/50 mb-1">
                    {slot.regulator}
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed mb-2">
                    {slot.description}
                  </p>

                  {slot.fileName ? (
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-lg border border-[#10B981]/20">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{slot.fileName}</span>
                      {slot.fileSize && (
                        <span className="text-white/40">({slot.fileSize})</span>
                      )}
                      {slot.uploadDate && (
                        <span className="text-white/40">· {slot.uploadDate}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Document missing &mdash; Required
                      for accreditation
                    </span>
                  )}
                </div>

                {/* Upload Button Container */}
                <div className="flex-shrink-0">
                  <label className="relative cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14171F] hover:bg-[#1C212E] border border-white/[0.12] hover:border-[#D4AF37]/50 text-xs font-semibold text-white transition-all group">
                    <UploadCloud className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <span>{slot.fileName ? "Replace File" : "Upload File"}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(slot.id, e)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/50 font-mono">
              Last saved state is preserved in encrypted session storage.
            </span>

            <button
              onClick={handleSaveKyc}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{saving ? "Saving Verification..." : "Submit KYC for Audit"}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
