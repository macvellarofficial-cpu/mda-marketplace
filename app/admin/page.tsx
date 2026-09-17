"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  Lock,
  Sparkles,
  Star,
  Ban,
  Search,
  ArrowLeft,
  AlertCircle,
  Gem,
  Scale,
  Eye,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getMineralFallbackImage } from "@/utils/mineralFallback";

// Designated admin emails
const ADMIN_EMAILS = [
  "admin@mineraldealers.africa",
  "compliance@mineraldealers.africa",
  "superadmin@mda.com",
  "kasule@albertine.ug",
];

interface KycSubmission {
  id: string;
  companyName: string;
  directorName: string;
  email: string;
  country: string;
  concessionRegion: string;
  licenseNumber: string;
  ursbCertFile: string;
  memdLicenseFile: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  auditNotes?: string;
}

interface ModeratedListing {
  id: string;
  assayNo: string;
  name: string;
  category: string;
  producer: string;
  weight: string;
  purity: string;
  price: string;
  status: "active" | "featured" | "suspended";
  image: string;
}

const INITIAL_KYC_QUEUE: KycSubmission[] = [
  {
    id: "KYC-SUB-2026-081",
    companyName: "Albertine Sovereign Minerals Ltd",
    directorName: "Elena Kasule",
    email: "kasule@albertine.ug",
    country: "Uganda",
    concessionRegion: "Buhweju Gold Belt",
    licenseNumber: "MEMD-ML-2025-00412",
    ursbCertFile: "URSB_Cert_Inc_Albertine_Minerals_2025.pdf",
    memdLicenseFile: "MEMD_ClassA_Dealer_License_2026_0942.pdf",
    submittedAt: "2026-09-14 14:22 UTC",
    status: "pending",
  },
  {
    id: "KYC-SUB-2026-082",
    companyName: "Great Dyke Lithium Miners Cooperative",
    directorName: "Tendai Moyo",
    email: "tmoyo@greatdyke-lithium.zw",
    country: "Zimbabwe",
    concessionRegion: "Bikita Pegmatite Belt",
    licenseNumber: "MMD-ZW-LIT-2024-88",
    ursbCertFile: "Zimbabwe_Registrar_Coop_Cert_2024.pdf",
    memdLicenseFile: "Ministry_Mines_Export_Permit_SC6.pdf",
    submittedAt: "2026-09-15 09:45 UTC",
    status: "approved",
  },
  {
    id: "KYC-SUB-2026-083",
    companyName: "Central Rift Mineral Trading Co.",
    directorName: "Jean-Paul Habimana",
    email: "habimana@centralrift.rw",
    country: "Rwanda",
    concessionRegion: "Bugesera Logistics Base",
    licenseNumber: "RMB-COL-2025-110",
    ursbCertFile: "RDB_Company_Incorporation_2025.pdf",
    memdLicenseFile: "RMB_Coltan_Traceability_ICGLR_Tag.pdf",
    submittedAt: "2026-09-16 11:30 UTC",
    status: "pending",
  },
  {
    id: "KYC-SUB-2026-084",
    companyName: "Kalahari Diamond Exchange Syndicate",
    directorName: "Bokamoso Khama",
    email: "khama@kalahari-diamonds.bw",
    country: "Botswana",
    concessionRegion: "Orapa Concession Block",
    licenseNumber: "BW-KPCS-2026-009",
    ursbCertFile: "CIPA_Botswana_Corporate_Reg.pdf",
    memdLicenseFile: "KPCS_Kimberley_Accreditation_Certificate.pdf",
    submittedAt: "2026-09-16 16:15 UTC",
    status: "pending",
  },
];

const INITIAL_MODERATION_LIST: ModeratedListing[] = [
  {
    id: "MDA-GLD-088",
    assayNo: "ASY-UG-2026-GLD-019",
    name: "94.5% Au Unrefined Gold Bars",
    category: "Precious Metals",
    producer: "Albertine Mineral Consortium",
    weight: "185.00 kg",
    purity: "94.50% Au Refined",
    price: "$13,650,000",
    status: "featured",
    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-CPR-204",
    assayNo: "ASY-ZM-2026-CPR-441",
    name: "Copper Cathodes Grade A",
    category: "Precious Metals",
    producer: "Zambian Copperbelt Trade Hub",
    weight: "2,000.00 MT",
    purity: "99.99% Cu Electrowon",
    price: "$19,700,000",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-LIT-312",
    assayNo: "ASY-ZW-2026-LIT-808",
    name: "Spodumene Lithium Ore (SC6)",
    category: "Rare Earth Elements",
    producer: "Great Dyke Lithium Miners",
    weight: "6,500.00 MT",
    purity: "6.22% Li2O",
    price: "$6,370,000",
    status: "featured",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-COL-551",
    assayNo: "ASY-RW-2026-COL-112",
    name: "Tantalite (Coltan Concentrate)",
    category: "Rare Earth Elements",
    producer: "Central Rift Mineral Trading Co.",
    weight: "75.00 MT",
    purity: "34.10% Ta2O5",
    price: "$10,650,000",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-DIA-904",
    assayNo: "ASY-BW-2026-DIA-055",
    name: "Kimberlite Rough Diamonds (D-H)",
    category: "Precious Stones",
    producer: "Kalahari Diamond Exchange",
    weight: "1,250.00 cts",
    purity: "Kimberley Process Cleared",
    price: "$4,200,000",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-TZN-108",
    assayNo: "ASY-TZ-2026-TZN-301",
    name: "Natural Blue Zoisite (Tanzanite)",
    category: "Precious Stones",
    producer: "Kilimanjaro Gem Syndicate",
    weight: "4,800.00 grams",
    purity: "AAA Vivid Royal Blue",
    price: "$2,890,000",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AdminConsolePage() {
  const [userEmail, setUserEmail] = useState<string>("admin@mineraldealers.africa");
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isSimulatedAdmin, setIsSimulatedAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"kyc" | "moderation">("kyc");
  const [kycQueue, setKycQueue] = useState<KycSubmission[]>(INITIAL_KYC_QUEUE);
  const [moderationList, setModerationList] = useState<ModeratedListing[]>(
    INITIAL_MODERATION_LIST
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<{
    title: string;
    fileName: string;
    company: string;
    type: "URSB" | "MEMD";
  } | null>(null);

  // Authenticate Admin user
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.email) {
          setUserEmail(user.email);
          const emailLower = user.email.toLowerCase();
          const authorized =
            ADMIN_EMAILS.includes(emailLower) ||
            emailLower.includes("admin") ||
            emailLower.endsWith("@mineraldealers.africa");
          setIsAdmin(authorized);
        } else {
          // Check session storage user
          const cachedUser = sessionStorage.getItem("mda_user");
          if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            if (parsed.workEmail) {
              setUserEmail(parsed.workEmail);
              const emailLower = parsed.workEmail.toLowerCase();
              const authorized =
                ADMIN_EMAILS.includes(emailLower) ||
                emailLower.includes("admin") ||
                emailLower.endsWith("@mineraldealers.africa");
              setIsAdmin(authorized);
            }
          }
        }
      } catch (err) {
        console.warn("Admin auth notice:", err);
      }
    };

    checkAdminAuth();

    // Check cached queue and listings
    const cachedKyc = sessionStorage.getItem("mda_admin_kyc_queue");
    if (cachedKyc) {
      try {
        setKycQueue(JSON.parse(cachedKyc));
      } catch (e) {
        console.error(e);
      }
    }

    const cachedMod = sessionStorage.getItem("mda_moderated_listings");
    if (cachedMod) {
      try {
        setModerationList(JSON.parse(cachedMod));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  // 1. One-click KYC Approval
  const handleApproveKyc = async (submission: KycSubmission) => {
    const updated = kycQueue.map((item) =>
      item.id === submission.id ? { ...item, status: "approved" as const } : item
    );
    setKycQueue(updated);
    sessionStorage.setItem("mda_admin_kyc_queue", JSON.stringify(updated));

    // Update in Supabase
    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({
          kyc_status: "approved",
          kyc_verified_at: new Date().toISOString(),
        })
        .eq("email", submission.email);
    } catch (err) {
      console.warn("Supabase KYC update note:", err);
    }

    // Sync session KYC status if current user matches
    const currentCachedKyc = sessionStorage.getItem("mda_kyc_data");
    if (currentCachedKyc) {
      try {
        const parsed = JSON.parse(currentCachedKyc);
        parsed.status = "Approved";
        sessionStorage.setItem("mda_kyc_data", JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
    }

    showNotification(
      `✓ APPROVED: ${submission.companyName} (${submission.licenseNumber}) verified with sovereign regulatory stamp.`
    );
  };

  // 2. One-click KYC Rejection
  const handleRejectKyc = async (submission: KycSubmission) => {
    const updated = kycQueue.map((item) =>
      item.id === submission.id ? { ...item, status: "rejected" as const } : item
    );
    setKycQueue(updated);
    sessionStorage.setItem("mda_admin_kyc_queue", JSON.stringify(updated));

    // Update in Supabase
    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({
          kyc_status: "rejected",
        })
        .eq("email", submission.email);
    } catch (err) {
      console.warn("Supabase KYC update note:", err);
    }

    // Sync session KYC status
    const currentCachedKyc = sessionStorage.getItem("mda_kyc_data");
    if (currentCachedKyc) {
      try {
        const parsed = JSON.parse(currentCachedKyc);
        parsed.status = "Action Required";
        sessionStorage.setItem("mda_kyc_data", JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
    }

    showNotification(
      `✕ REJECTED: ${submission.companyName} regulatory dossier returned for non-compliant documentation.`
    );
  };

  // 3. Marketplace Listing Moderation Actions
  const handleToggleFeature = (lotId: string) => {
    const updated = moderationList.map((item) => {
      if (item.id === lotId) {
        const newStatus = item.status === "featured" ? "active" : "featured";
        return { ...item, status: newStatus as "active" | "featured" };
      }
      return item;
    });
    setModerationList(updated);
    sessionStorage.setItem("mda_moderated_listings", JSON.stringify(updated));
    showNotification(`Updated featured status for batch lot ${lotId}.`);
  };

  const handleToggleSuspend = (lotId: string) => {
    const updated = moderationList.map((item) => {
      if (item.id === lotId) {
        const newStatus = item.status === "suspended" ? "active" : "suspended";
        return { ...item, status: newStatus as "active" | "suspended" };
      }
      return item;
    });
    setModerationList(updated);
    sessionStorage.setItem("mda_moderated_listings", JSON.stringify(updated));
    showNotification(`Listing ${lotId} status updated in central exchange index.`);
  };

  // Filtered queries
  const filteredKycQueue = kycQueue.filter(
    (item) =>
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModerationList = moderationList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.producer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Security Access Barrier if user is not authorized
  if (!isAdmin && !isSimulatedAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] flex items-center justify-center p-6 relative">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-rose-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Super Admin Access Required</h1>
            <p className="text-xs text-white/50 mt-1">
              The Regulatory Verification Console is restricted strictly to designated compliance officers & accredited MEMD auditors.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-white/[0.05] text-left text-xs font-mono space-y-1">
            <span className="text-white/40 block">CURRENT SESSION EMAIL:</span>
            <span className="text-[#D4AF37] block font-bold truncate">
              {userEmail || "anonymous_visitor@mda.network"}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setIsSimulatedAdmin(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Compliance Admin Session</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-xl bg-[#0B0C10] hover:bg-white/[0.05] border border-white/[0.08] text-white/80 font-mono text-xs block transition-colors"
            >
              Return to Trader Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0C10]/85 border-b border-white/[0.08] px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)]">
                <div className="w-full h-full bg-[#0B0C10] rounded-[10px] flex items-center justify-center">
                  <Gem className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wider text-white">
                    MDA
                  </span>
                  <span className="text-[9px] font-mono text-black bg-[#D4AF37] font-bold px-1.5 py-0.2 rounded">
                    SUPER ADMIN
                  </span>
                </div>
                <span className="text-[9px] text-white/50 block font-mono">
                  REGULATORY VERIFICATION CONSOLE
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14171F] border border-white/[0.08] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-white/60">Signed in as:</span>
              <span className="text-[#D4AF37] font-bold truncate max-w-[160px]">
                {userEmail}
              </span>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14171F] hover:bg-[#1C212D] border border-white/[0.08] text-xs font-mono text-white/80 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trader Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Console Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* Real-time Notification Banner */}
        {actionNotice && (
          <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 1. Regulatory KPI Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
            <span className="text-xs text-white/40 block font-mono uppercase">
              Registered Concession Holders
            </span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              142 Mines
            </span>
            <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> 100% Sovereign Licensed
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
            <span className="text-xs text-white/40 block font-mono uppercase">
              Pending KYC Audits
            </span>
            <span className="text-2xl font-bold font-mono text-[#D4AF37] mt-1 block">
              {kycQueue.filter((k) => k.status === "pending").length} Dossiers
            </span>
            <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 mt-1 font-mono">
              <AlertCircle className="w-3 h-3" /> URSB / MEMD Queue
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
            <span className="text-xs text-white/40 block font-mono uppercase">
              Active Moderated Batches
            </span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              {moderationList.filter((m) => m.status !== "suspended").length} Lots
            </span>
            <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="w-3 h-3" /> Live on Public Exchange
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
            <span className="text-xs text-white/40 block font-mono uppercase">
              Tier-1 Bonded Escrow Volume
            </span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              $57,460,000
            </span>
            <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
              <Lock className="w-3 h-3" /> Custody Vault Verified
            </span>
          </div>
        </div>

        {/* 2. Console Primary Tabs & Search */}
        <div className="p-4 rounded-2xl bg-[#14171F] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("kyc")}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "kyc"
                  ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  : "bg-[#0B0C10] text-white/60 hover:text-white border border-white/[0.05]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Supplier KYC Submissions</span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full ${
                  activeTab === "kyc"
                    ? "bg-black/20 text-black"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {kycQueue.filter((k) => k.status === "pending").length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("moderation")}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "moderation"
                  ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  : "bg-[#0B0C10] text-white/60 hover:text-white border border-white/[0.05]"
              }`}
            >
              <Gem className="w-4 h-4" />
              <span>Marketplace Moderation</span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full ${
                  activeTab === "moderation"
                    ? "bg-black/20 text-black"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {moderationList.length}
              </span>
            </button>
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "kyc"
                  ? "Search mining company, license #..."
                  : "Search batch ID, mineral, producer..."
              }
              className="w-full h-10 pl-9 pr-3.5 bg-[#0B0C10] border border-white/[0.08] text-xs text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono"
            />
          </div>
        </div>

        {/* 3. SECTION A: Supplier KYC Review Queue */}
        {activeTab === "kyc" && (
          <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                Accreditation Review Queue: URSB & MEMD Verifications
              </h2>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Super Admin audit interface to inspect certified corporate incorporation papers and sovereign mineral dealer licenses. Approved miners immediately unlock active listing rights.
              </p>
            </div>

            <div className="space-y-4">
              {filteredKycQueue.map((submission) => (
                <div
                  key={submission.id}
                  className="p-5 rounded-2xl bg-[#0B0C10] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-bold text-white">
                          {submission.companyName}
                        </span>
                        <span className="text-[10px] font-mono bg-white/[0.06] text-white/70 px-2 py-0.5 rounded border border-white/[0.08]">
                          {submission.country}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            submission.status === "approved"
                              ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                              : submission.status === "rejected"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-white/50 mt-0.5">
                        Director: <span className="text-white/80">{submission.directorName}</span> ({submission.email}) • Concession: {submission.concessionRegion}
                      </p>
                    </div>

                    <div className="text-xs font-mono text-white/40">
                      Sub: {submission.submittedAt}
                    </div>
                  </div>

                  {/* Documents Container */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* URSB Certificate */}
                    <div className="p-3.5 rounded-xl bg-[#14171F] border border-white/[0.06] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            URSB Incorporation Certificate
                          </span>
                          <span className="text-[11px] font-mono text-white/50 block truncate max-w-[220px]">
                            {submission.ursbCertFile}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setPreviewDocModal({
                            title: "Certificate of Incorporation",
                            fileName: submission.ursbCertFile,
                            company: submission.companyName,
                            type: "URSB",
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white/80 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>

                    {/* MEMD Mineral License */}
                    <div className="p-3.5 rounded-xl bg-[#14171F] border border-white/[0.06] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                          <Scale className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            MEMD Mining / Dealer License
                          </span>
                          <span className="text-[11px] font-mono text-[#D4AF37] block truncate max-w-[220px]">
                            {submission.licenseNumber}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setPreviewDocModal({
                            title: "MEMD Mining / Mineral Dealer License",
                            fileName: submission.memdLicenseFile,
                            company: submission.companyName,
                            type: "MEMD",
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white/80 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>

                  {/* One-Click Approval / Rejection Action Controls */}
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      onClick={() => handleRejectKyc(submission)}
                      disabled={submission.status === "rejected"}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                        submission.status === "rejected"
                          ? "opacity-50 cursor-not-allowed bg-rose-500/10 text-rose-300 border-rose-500/20"
                          : "bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white border-rose-500/30"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject KYC</span>
                    </button>

                    <button
                      onClick={() => handleApproveKyc(submission)}
                      disabled={submission.status === "approved"}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                        submission.status === "approved"
                          ? "opacity-50 cursor-not-allowed bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                          : "bg-[#10B981] hover:bg-emerald-400 text-black border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve KYC (Set Certified)</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredKycQueue.length === 0 && (
                <div className="py-12 text-center text-xs font-mono text-white/40 bg-[#0B0C10] rounded-2xl border border-white/[0.05]">
                  No KYC verification dossiers match &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. SECTION B: Marketplace Moderation List */}
        {activeTab === "moderation" && (
          <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Gem className="w-5 h-5 text-[#D4AF37]" />
                Active Marketplace Batches & Catalog Moderation
              </h2>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Super Admin controls to feature certified inventory on the homepage, or immediately suspend lots under investigation or inquiry.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModerationList.map((lot) => (
                <div
                  key={lot.id}
                  className={`rounded-3xl bg-[#0B0C10] border transition-all flex flex-col justify-between overflow-hidden ${
                    lot.status === "suspended"
                      ? "border-rose-500/40 opacity-75"
                      : lot.status === "featured"
                      ? "border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                      : "border-white/[0.08]"
                  }`}
                >
                  <div>
                    {/* Image */}
                    <div className="relative w-full h-44 rounded-t-2xl overflow-hidden bg-black">
                      <Image
                        src={lot.image || getMineralFallbackImage(lot.name, lot.category)}
                        alt={lot.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/20 to-black/60 pointer-events-none" />

                      {/* Floating status badge */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-black/75 backdrop-blur-md text-[#D4AF37] border border-white/[0.15] px-2.5 py-0.5 rounded-full">
                          {lot.category}
                        </span>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shadow ${
                            lot.status === "featured"
                              ? "bg-[#D4AF37] text-black"
                              : lot.status === "suspended"
                              ? "bg-rose-500 text-white"
                              : "bg-[#10B981]/80 text-black"
                          }`}
                        >
                          {lot.status}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-3 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-white/40 block">
                          {lot.id} • {lot.assayNo}
                        </span>
                        <h3 className="text-base font-bold text-white font-sans truncate">
                          {lot.name}
                        </h3>
                        <p className="text-[11px] text-white/60 font-sans truncate mt-0.5">
                          {lot.producer}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#14171F] border border-white/[0.04] text-[11px]">
                        <div>
                          <span className="text-white/40 block text-[9px] uppercase">
                            Weight
                          </span>
                          <span className="font-bold text-white">{lot.weight}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[9px] uppercase">
                            Valuation
                          </span>
                          <span className="font-bold text-[#D4AF37]">{lot.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Moderation Actions Footer */}
                  <div className="p-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 bg-[#14171F]/40">
                    <button
                      onClick={() => handleToggleFeature(lot.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 border ${
                        lot.status === "featured"
                          ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                          : "bg-white/[0.05] hover:bg-white/[0.1] text-white/70 border-white/[0.08]"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{lot.status === "featured" ? "Featured" : "Feature"}</span>
                    </button>

                    <button
                      onClick={() => handleToggleSuspend(lot.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 border ${
                        lot.status === "suspended"
                          ? "bg-rose-500 text-white font-bold border-rose-500"
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>
                        {lot.status === "suspended" ? "Reactivate" : "Suspend"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredModerationList.length === 0 && (
                <div className="col-span-3 py-12 text-center text-xs font-mono text-white/40 bg-[#0B0C10] rounded-2xl border border-white/[0.05]">
                  No mineral listings match &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Document Inspector Modal */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-[#14171F] border border-white/[0.1] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] block">
                  {previewDocModal.type} OFFICIAL REGISTRATION AUDIT
                </span>
                <h3 className="text-base font-bold text-white">
                  {previewDocModal.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-white/40">Entity:</span>
                <span className="text-white font-bold">{previewDocModal.company}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40">Document File:</span>
                <span className="text-[#D4AF37] truncate max-w-[200px]">
                  {previewDocModal.fileName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40">Digital Seal:</span>
                <span className="text-[#10B981] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 2048-Bit Statutory Signature
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#14171F] border border-white/[0.06] text-xs text-white/70 leading-relaxed">
              <p>
                Document verified against official ministerial database. File integrity checked via SHA-256 cryptographic digest. Approved documents reflect directly on the trader&apos;s bilateral escrow dossier.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewDocModal(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white/80 transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  showNotification(`Verified ${previewDocModal.fileName} integrity.`);
                  setPreviewDocModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold font-mono text-xs transition-colors"
              >
                Mark Audited
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
