"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Gem,
  ShieldCheck,
  Lock,
  LogOut,
  FileCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  MessageSquare,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Wrench,
  Scale,
  ChevronRight,
  Award,
  Sparkles,
  Bookmark,
  FileText,
  UploadCloud,
  Layers,
  Zap,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getMineralFallbackImage } from "@/utils/mineralFallback";

interface UserProfile {
  fullName: string;
  workEmail?: string;
  role: string;
  companyName: string;
  country: string;
  region: string;
  phone?: string;
}

interface CustomListing {
  lot_id: string;
  commodity: string;
  grade: string;
  weight: string;
  origin_region: string;
  origin_country: string;
  price_usd: string;
  status: string;
  assay_lab: string;
  assay_cert_number: string;
}

// Buyer Tender & Bid item
interface BuyerTender {
  id: string;
  title: string;
  commodity: string;
  bidderSupplier: string;
  targetQuantity: string;
  bidOfferPrice: string;
  counterOfferPrice?: string;
  incoterms: string;
  status: "Under Review" | "Escrow Pending" | "Assayed";
  timestamp: string;
}

// Equipment Catalog Item
interface EquipmentItem {
  id: string;
  name: string;
  machineType: string;
  capacity: string;
  powerRequirement: string;
  deliveryIncoterms: string;
  leadTime: string;
  priceUSD: string;
  status: "In Stock" | "Made to Order";
  location: string;
  specSheetFileName?: string;
  photoUrl?: string;
}

// Equipment Inquiry from miner/cooperative
interface EquipmentInquiry {
  id: string;
  machinery: string;
  minerCooperative: string;
  concessionCountry: string;
  termType: "Outright Purchase" | "Hire Purchase / Lease" | "Offtake Offset";
  requestedDelivery: string;
  offeredBudget: string;
  status: "Pending Quotation" | "Proposal Sent" | "Inspection Scheduled";
  timestamp: string;
}

// Service Provider Offering
interface ServiceOffering {
  id: string;
  title: string;
  category: "ISO 17025 Independent Assay" | "Geological Survey" | "Export Logistics/Transit" | "Mining Law & ESG Compliance";
  leadTime: string;
  rateUSD: string;
  accreditationBadge: string;
  status: "Active Offering" | "Certified Provider";
}

// Service Credential
interface ServiceCredential {
  id: string;
  title: string;
  authority: string;
  validUntil: string;
  fileName: string;
  status: "Verified Statutory" | "Audit Current";
}

// Service RFQ from buyer/supplier
interface ServiceRfq {
  id: string;
  clientEntity: string;
  role: "Buyer" | "Supplier";
  requiredService: string;
  lotReference: string;
  targetDate: string;
  feeBudget: string;
  status: "Pending Lab Intake" | "Transit Scheduled" | "Assay In Progress";
}

const DEFAULT_BUYER_TENDERS: BuyerTender[] = [
  {
    id: "TND-2026-UG-014",
    title: "185 kg Gold Doré Offtake Tender",
    commodity: "Gold Doré (94.5% Au)",
    bidderSupplier: "Albertine Sovereign Minerals Ltd",
    targetQuantity: "185.00 kg",
    bidOfferPrice: "$13,650,000",
    counterOfferPrice: "$13,580,000",
    incoterms: "FOB Entebbe",
    status: "Escrow Pending",
    timestamp: "3 hours ago",
  },
  {
    id: "TND-2026-ZM-088",
    title: "2,000 MT Grade A Copper Cathodes",
    commodity: "Copper Cathodes 99.99%",
    bidderSupplier: "Zambian Copperbelt Trade Hub",
    targetQuantity: "2,000 MT",
    bidOfferPrice: "$19,700,000",
    counterOfferPrice: undefined,
    incoterms: "CIF Durban",
    status: "Assayed",
    timestamp: "8 hours ago",
  },
  {
    id: "TND-2026-ZW-042",
    title: "6,500 MT Spodumene Lithium Concentrate",
    commodity: "Lithium Ore (SC6 6.22% Li2O)",
    bidderSupplier: "Great Dyke Lithium Miners",
    targetQuantity: "6,500 MT",
    bidOfferPrice: "$6,370,000",
    counterOfferPrice: "$6,250,000",
    incoterms: "FOB Beira Port",
    status: "Under Review",
    timestamp: "1 day ago",
  },
  {
    id: "TND-2026-RW-091",
    title: "75 MT Columbite-Tantalite Offtake",
    commodity: "Tantalite (Coltan 34% Ta2O5)",
    bidderSupplier: "Central Rift Mineral Trading Co.",
    targetQuantity: "75 MT",
    bidOfferPrice: "$10,650,000",
    counterOfferPrice: undefined,
    incoterms: "CIF Rotterdam",
    status: "Under Review",
    timestamp: "2 days ago",
  },
];

const DEFAULT_SAVED_WATCHLIST = [
  {
    id: "MDA-GLD-088",
    assayNo: "ASY-UG-2026-GLD-019",
    name: "94.5% Au Unrefined Gold Bars",
    producer: "Albertine Sovereign Minerals Ltd",
    weight: "185.00 kg",
    purity: "94.50% Au Refined",
    indicativeValuation: "$13,650,000",
    change: "+1.2%",
    incoterms: "FOB Entebbe",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-COL-551",
    assayNo: "ASY-RW-2026-COL-112",
    name: "Tantalite (Coltan Concentrate)",
    producer: "Central Rift Mineral Trading Co.",
    weight: "75.00 MT",
    purity: "34.10% Ta2O5",
    indicativeValuation: "$10,650,000",
    change: "+2.4%",
    incoterms: "CIF Rotterdam",
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-CPR-204",
    assayNo: "ASY-ZM-2026-CPR-441",
    name: "Copper Cathodes Grade A",
    producer: "Zambian Copperbelt Trade Hub",
    weight: "2,000.00 MT",
    purity: "99.99% Cu Electrowon",
    indicativeValuation: "$19,700,000",
    change: "+0.8%",
    incoterms: "CIF Durban",
    image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "MDA-TZN-108",
    assayNo: "ASY-TZ-2026-TZN-301",
    name: "Natural Blue Zoisite (Tanzanite)",
    producer: "Kilimanjaro Gem Syndicate",
    weight: "4,800.00 grams",
    purity: "AAA Vivid Royal Blue",
    indicativeValuation: "$2,890,000",
    change: "-0.4%",
    incoterms: "CIF Dubai",
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
  },
];

const DEFAULT_EQUIPMENT_ITEMS: EquipmentItem[] = [
  {
    id: "EQP-CONE-01",
    name: "Symons Standard 4 1/4 Ft Secondary Cone Crusher",
    machineType: "Cone Crusher",
    capacity: "180 TPH",
    powerRequirement: "160 kW (3-Phase 380V)",
    deliveryIncoterms: "FOB Durban Port",
    leadTime: "Immediate Dispatch",
    priceUSD: "$210,000",
    status: "In Stock",
    location: "Kampala Industrial Depot, Uganda",
    photoUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "EQP-EXCAV-02",
    name: "Heavy Mining Hydraulic Excavator (45-Ton Crawler)",
    machineType: "Excavator",
    capacity: "320 TPH Bulk Move",
    powerRequirement: "283 kW Turbo Diesel",
    deliveryIncoterms: "CIF Mombasa Port",
    leadTime: "2 Weeks Transit",
    priceUSD: "$345,000",
    status: "In Stock",
    location: "Mombasa Yard, Kenya",
    photoUrl: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "EQP-MILL-03",
    name: "Continuous Discharge Overflow Ball Mill (Ø2.4 x 4.5m)",
    machineType: "Ball Mill",
    capacity: "45 TPH Fine Slurry",
    powerRequirement: "320 kW Wound Motor",
    deliveryIncoterms: "EXW Ndola Depot",
    leadTime: "Immediate Dispatch",
    priceUSD: "$295,000",
    status: "In Stock",
    location: "Ndola Heavy Yard, Zambia",
    photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "EQP-GRAV-04",
    name: "Modular Centrifugal Gold Gravity Separation Plant",
    machineType: "Gravity Separation Plant",
    capacity: "60 TPH Raw Ore",
    powerRequirement: "45 kW Electric Pump",
    deliveryIncoterms: "FOB Dar es Salaam",
    leadTime: "Immediate Dispatch",
    priceUSD: "$165,000",
    status: "In Stock",
    location: "Mwanza Logistics Base, Tanzania",
    photoUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "EQP-OPTIC-05",
    name: "Dual-Sensor Optical & X-Ray Gemstone Sorter",
    machineType: "Optical Gem Sorter",
    capacity: "15 TPH Diamond & Tanzanite",
    powerRequirement: "18 kW Pneumatic Air",
    deliveryIncoterms: "CIF Entebbe Airport",
    leadTime: "Made to Order (3 wks)",
    priceUSD: "$480,000",
    status: "Made to Order",
    location: "Johannesburg Tech Hub, RSA",
    photoUrl: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
  },
];

const DEFAULT_EQUIPMENT_INQUIRIES: EquipmentInquiry[] = [
  {
    id: "INQ-2026-091",
    machinery: "Continuous Discharge Overflow Ball Mill",
    minerCooperative: "Albertine Gold Artisanal Union",
    concessionCountry: "Uganda (Buhweju)",
    termType: "Hire Purchase / Lease",
    requestedDelivery: "Within 30 Days",
    offeredBudget: "$280,000 (Installment Escrow)",
    status: "Pending Quotation",
    timestamp: "2 hours ago",
  },
  {
    id: "INQ-2026-092",
    machinery: "Symons Standard 4 1/4 Ft Cone Crusher",
    minerCooperative: "Great Dyke Lithium Cooperative",
    concessionCountry: "Zimbabwe (Bikita)",
    termType: "Outright Purchase",
    requestedDelivery: "Immediate Dispatch",
    offeredBudget: "$205,000 L/C",
    status: "Proposal Sent",
    timestamp: "1 day ago",
  },
  {
    id: "INQ-2026-093",
    machinery: "Dual-Sensor Optical Gem Sorter",
    minerCooperative: "Kilimanjaro Gem Syndicate",
    concessionCountry: "Tanzania (Merelani)",
    termType: "Offtake Offset",
    requestedDelivery: "Q4 2026",
    offeredBudget: "$450,000 Rough Tanzanite Offset",
    status: "Inspection Scheduled",
    timestamp: "2 days ago",
  },
];

const DEFAULT_SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    id: "SRV-ASSAY-101",
    title: "Fire Assay & Inductively Coupled Plasma (ICP-OES) Testing",
    category: "ISO 17025 Independent Assay",
    leadTime: "24 - 48 Hours Turnaround",
    rateUSD: "$450 / composite sample",
    accreditationBadge: "ISO/IEC 17025 Accredited • Alex Stewart / SGS Partner",
    status: "Active Offering",
  },
  {
    id: "SRV-GEOL-202",
    title: "JORC / NI 43-101 Concession Resource Estimation & Core Logging",
    category: "Geological Survey",
    leadTime: "3 - 4 Weeks Fieldwork",
    rateUSD: "$38,000 / technical report",
    accreditationBadge: "Competent Person (AusIMM & SACNASP Registered)",
    status: "Active Offering",
  },
  {
    id: "SRV-LOG-303",
    title: "Armored Air-Side Bullion Transit & Cross-Border Escort",
    category: "Export Logistics/Transit",
    leadTime: "Scheduled Charter Flights",
    rateUSD: "$8,500 / consignment segment",
    accreditationBadge: "Lloyds of London Specie Insured ($50M limit)",
    status: "Active Offering",
  },
  {
    id: "SRV-LEGAL-404",
    title: "Sovereign Mining Title Due Diligence & ICGLR Traceability Compliance",
    category: "Mining Law & ESG Compliance",
    leadTime: "5 Business Days",
    rateUSD: "$6,500 / concession audit",
    accreditationBadge: "MEMD Licensed Consultancy • ICGLR Certified Auditor",
    status: "Active Offering",
  },
];

const DEFAULT_SERVICE_CREDENTIALS: ServiceCredential[] = [
  {
    id: "CRED-SGS-01",
    title: "Alex Stewart International & SGS Lab Partnership Verification",
    authority: "SGS Mineral Services & Alex Stewart Int. QA/QC",
    validUntil: "2027-12-31",
    fileName: "AlexStewart_SGS_Spectrographic_Partnership_2026.pdf",
    status: "Verified Statutory",
  },
  {
    id: "CRED-MEMD-02",
    title: "MEMD Directorate of Geological Survey Mineral Consultancy License",
    authority: "Ministry of Energy and Mineral Development (Uganda)",
    validUntil: "2027-06-30",
    fileName: "MEMD_Statutory_Consultancy_License_LAB_041.pdf",
    status: "Verified Statutory",
  },
  {
    id: "CRED-URA-03",
    title: "URA Authorized Economic Operator (AEO) Transit Clearing License",
    authority: "Uganda Revenue Authority Customs Department",
    validUntil: "2026-12-31",
    fileName: "URA_AEO_Customs_Clearance_Seal_8820.pdf",
    status: "Audit Current",
  },
];

const DEFAULT_SERVICE_RFQS: ServiceRfq[] = [
  {
    id: "SRFQ-2026-081",
    clientEntity: "Albertine Sovereign Minerals Ltd",
    role: "Supplier",
    requiredService: "Wet Chemical Spectrographic Assay (Au 94.5%)",
    lotReference: "MDA-GLD-088 (185 kg Gold Doré)",
    targetDate: "Tomorrow, 10:00 UTC",
    feeBudget: "$1,800 USD",
    status: "Assay In Progress",
  },
  {
    id: "SRFQ-2026-082",
    clientEntity: "Anglo-Continental Metals Fund",
    role: "Buyer",
    requiredService: "Armored Airport Cargo Transit (Entebbe to Dubai)",
    lotReference: "MDA-GLD-088 Vault Escort",
    targetDate: "2026-09-24",
    feeBudget: "$8,500 USD",
    status: "Transit Scheduled",
  },
  {
    id: "SRFQ-2026-083",
    clientEntity: "Central Rift Mineral Trading Co.",
    role: "Supplier",
    requiredService: "ICGLR Traceability Tagging & Fingerprint Seal",
    lotReference: "MDA-COL-551 (75 MT Tantalite)",
    targetDate: "2026-09-28",
    feeBudget: "$3,600 USD",
    status: "Pending Lab Intake",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Elena Kasule",
    role: "Supplier",
    companyName: "Albertine Sovereign Minerals Ltd",
    country: "Uganda",
    region: "Buhweju Gold Concession",
  });

  const [customListings, setCustomListings] = useState<CustomListing[]>([]);
  const [kycStatus, setKycStatus] = useState("Action Required");
  const [activeRole, setActiveRole] = useState<
    "supplier" | "buyer" | "equipment_manufacturer" | "service_provider"
  >("supplier");

  // Buyer state
  const [buyerTenders, setBuyerTenders] = useState<BuyerTender[]>(DEFAULT_BUYER_TENDERS);
  const [buyerActiveTab, setBuyerActiveTab] = useState<"tenders" | "watchlist">("tenders");

  // Equipment state
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(DEFAULT_EQUIPMENT_ITEMS);
  const [equipmentInquiries] = useState<EquipmentInquiry[]>(DEFAULT_EQUIPMENT_INQUIRIES);
  const [equipmentActiveTab, setEquipmentActiveTab] = useState<"catalog" | "inquiries">("catalog");

  // Service Provider state
  const [serviceOfferings] = useState<ServiceOffering[]>(DEFAULT_SERVICE_OFFERINGS);
  const [serviceCredentials] = useState<ServiceCredential[]>(DEFAULT_SERVICE_CREDENTIALS);
  const [serviceRfqs] = useState<ServiceRfq[]>(DEFAULT_SERVICE_RFQS);
  const [serviceActiveTab, setServiceActiveTab] = useState<"profile" | "vault" | "rfqs">("profile");

  useEffect(() => {
    // 1. Load user profile from session storage or Supabase
    const cachedUser = sessionStorage.getItem("mda_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setProfile(parsed);
        if (parsed.role) {
          const r = parsed.role.toLowerCase();
          if (r.includes("buyer")) setActiveRole("buyer");
          else if (r.includes("equipment")) setActiveRole("equipment_manufacturer");
          else if (r.includes("service")) setActiveRole("service_provider");
          else setActiveRole("supplier");
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Load custom listings
    const cachedListings = sessionStorage.getItem("mda_custom_listings");
    if (cachedListings) {
      try {
        setCustomListings(JSON.parse(cachedListings));
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Load custom buyer tenders
    const cachedTenders = sessionStorage.getItem("mda_buyer_tenders");
    if (cachedTenders) {
      try {
        const parsedTenders = JSON.parse(cachedTenders);
        setBuyerTenders([...parsedTenders, ...DEFAULT_BUYER_TENDERS]);
      } catch (e) {
        console.error(e);
      }
    }

    // 4. Load custom equipment
    const cachedEquipment = sessionStorage.getItem("mda_custom_equipment");
    if (cachedEquipment) {
      try {
        const parsedEq = JSON.parse(cachedEquipment);
        setEquipmentList([...parsedEq, ...DEFAULT_EQUIPMENT_ITEMS]);
      } catch (e) {
        console.error(e);
      }
    }

    // 5. Load KYC status
    const cachedKyc = sessionStorage.getItem("mda_kyc_data");
    if (cachedKyc) {
      try {
        const parsed = JSON.parse(cachedKyc);
        if (parsed.status) setKycStatus(parsed.status);
      } catch (e) {
        console.error(e);
      }
    }

    const loadSupabaseProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (dbProfile) {
            const loadedProfile: UserProfile = {
              fullName:
                dbProfile.full_name || user.email?.split("@")[0] || "Trader",
              workEmail: dbProfile.email || user.email,
              role: dbProfile.role || "Supplier",
              companyName: dbProfile.company_name || "Albertine Minerals",
              country: dbProfile.country || "Uganda",
              region: dbProfile.region || "Buhweju",
              phone: dbProfile.phone,
            };
            setProfile(loadedProfile);

            const r = (dbProfile.role || "").toLowerCase();
            if (r.includes("buyer")) setActiveRole("buyer");
            else if (r.includes("equipment")) setActiveRole("equipment_manufacturer");
            else if (r.includes("service")) setActiveRole("service_provider");
            else setActiveRole("supplier");

            if (dbProfile.kyc_status) {
              setKycStatus(dbProfile.kyc_status);
            }
          }
        }
      } catch (err) {
        console.warn("Supabase profile load notice:", err);
      }
    };

    loadSupabaseProfile();
  }, []);

  const handleRoleSwitch = (
    newRole: "supplier" | "buyer" | "equipment_manufacturer" | "service_provider"
  ) => {
    setActiveRole(newRole);
    const displayRole =
      newRole === "buyer"
        ? "Buyer"
        : newRole === "equipment_manufacturer"
        ? "Equipment Manufacturer"
        : newRole === "service_provider"
        ? "Service Provider"
        : "Supplier";

    const updatedProfile = { ...profile, role: displayRole };
    setProfile(updatedProfile);
    sessionStorage.setItem("mda_user", JSON.stringify(updatedProfile));
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out notice:", e);
    }
    sessionStorage.removeItem("mda_user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0C10]/85 border-b border-white/[0.08] px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Mineral Dealers Africa"
                width={180}
                height={42}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Dashboard Sub-navigation Tabs */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-mono">
              <Link
                href="/dashboard"
                className="px-3.5 py-1.5 rounded-lg bg-[#14171F] text-[#D4AF37] border border-[#D4AF37]/30 font-semibold"
              >
                Overview
              </Link>
              <Link
                href="/marketplace"
                className="px-3.5 py-1.5 rounded-lg hover:bg-white/[0.05] text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
                Marketplace
              </Link>
              {activeRole === "supplier" && (
                <Link
                  href="/dashboard/listings/new"
                  className="px-3.5 py-1.5 rounded-lg hover:bg-white/[0.05] text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  List Batch
                </Link>
              )}
              {activeRole === "buyer" && (
                <Link
                  href="/dashboard/tenders/new"
                  className="px-3.5 py-1.5 rounded-lg hover:bg-white/[0.05] text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Post Tender
                </Link>
              )}
              {activeRole === "equipment_manufacturer" && (
                <Link
                  href="/dashboard/equipment/new"
                  className="px-3.5 py-1.5 rounded-lg hover:bg-white/[0.05] text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Add Equipment
                </Link>
              )}
              <Link
                href="/dashboard/kyc"
                className="px-3.5 py-1.5 rounded-lg hover:bg-white/[0.05] text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                KYC & Compliance
              </Link>
              <Link
                href="/dashboard/messages"
                className="px-3.5 py-1.5 rounded-lg hover:bg-white/[0.05] text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Negotiations
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-colors font-bold flex items-center gap-1 border border-[#D4AF37]/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Super Admin
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dynamic Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-[#14171F] p-1 rounded-xl border border-white/[0.08] text-[11px] font-mono">
              <span className="text-white/40 px-2 select-none">ROLE:</span>
              <button
                onClick={() => handleRoleSwitch("supplier")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === "supplier"
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Supplier
              </button>
              <button
                onClick={() => handleRoleSwitch("buyer")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === "buyer"
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Buyer
              </button>
              <button
                onClick={() => handleRoleSwitch("equipment_manufacturer")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === "equipment_manufacturer"
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Equipment
              </button>
              <button
                onClick={() => handleRoleSwitch("service_provider")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === "service_provider"
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Services
              </button>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white/80 hover:text-white transition-all flex items-center gap-2 border border-white/[0.06]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* KYC Alert Ribbon */}
        {kycStatus !== "Approved" && (
          <div className="p-4 rounded-2xl bg-[#14171F] border border-[#D4AF37]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Statutory Mineral Verification: Status {kycStatus}
                </span>
                <p className="text-[11px] text-white/60">
                  Upload URSB Incorporation, MEMD Dealer License, and URA Tax Clearance to unlock unlimited Tier-1 escrow releases.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/kyc"
              className="px-4 py-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-xs font-mono transition-all border border-[#D4AF37]/30 whitespace-nowrap"
            >
              Manage KYC Docs →
            </Link>
          </div>
        )}

        {/* Welcome Header */}
        <div className="p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-[130px] pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0C10] border border-[#10B981]/30 text-xs font-mono text-[#10B981] mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ACTIVE STAKEHOLDER PORTAL: {profile.role.toUpperCase()}
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {profile.fullName}
              </h1>
              <p className="text-sm text-white/60 mt-1 font-mono">
                {profile.companyName} · {profile.region}, {profile.country}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {activeRole === "supplier" && (
                <Link
                  href="/dashboard/listings/new"
                  className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ New Batch Listing</span>
                </Link>
              )}

              {activeRole === "buyer" && (
                <Link
                  href="/dashboard/tenders/new"
                  className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Buying Tender</span>
                </Link>
              )}

              {activeRole === "equipment_manufacturer" && (
                <Link
                  href="/dashboard/equipment/new"
                  className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Equipment</span>
                </Link>
              )}

              {activeRole === "service_provider" && (
                <Link
                  href="/dashboard/kyc"
                  className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Credentials</span>
                </Link>
              )}

              <Link
                href="/dashboard/messages"
                className="px-4 py-3 rounded-xl bg-[#0B0C10] hover:bg-white/[0.05] border border-white/[0.08] text-white text-xs font-mono transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>Negotiation Room</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 1. BUYER PORTAL                                                   */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeRole === "buyer" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Active RFQs Sent
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  5 Sent
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <TrendingUp className="w-3 h-3" /> All Concessions Verified
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Saved Mineral Batches
                </span>
                <span className="text-2xl font-bold font-mono text-[#D4AF37] mt-1 block">
                  {DEFAULT_SAVED_WATCHLIST.length} Watchlisted
                </span>
                <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 mt-1 font-mono">
                  <Bookmark className="w-3 h-3" /> Live Valuation Sync
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Verified Trades in Escrow
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  $18,500,000
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <Lock className="w-3 h-3" /> Tier-1 Vault Secured
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Sourced Lab Assays
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  12 Reports
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <FileCheck className="w-3 h-3" /> SGS / Alex Stewart
                </span>
              </div>
            </div>

            {/* Buyer Navigation Tabs */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <button
                onClick={() => setBuyerActiveTab("tenders")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  buyerActiveTab === "tenders"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-[#14171F] text-white/60 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Active Tenders & Quotations</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-black font-bold">
                  {buyerTenders.length}
                </span>
              </button>

              <button
                onClick={() => setBuyerActiveTab("watchlist")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  buyerActiveTab === "watchlist"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-[#14171F] text-white/60 hover:text-white"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved Watchlist</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {DEFAULT_SAVED_WATCHLIST.length}
                </span>
              </button>

              <div className="ml-auto">
                <Link
                  href="/dashboard/tenders/new"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold font-mono text-xs transition-colors flex items-center gap-1.5 border border-[#D4AF37]/30"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Buying Tender</span>
                </Link>
              </div>
            </div>

            {/* TAB 1: Active Tenders & Quotations */}
            {buyerActiveTab === "tenders" && (
              <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#D4AF37]" />
                      Active Buying Tenders, Supplier Bids & Counter-Offers
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Bilateral procurement contracts submitted across verified African mining networks.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/tenders/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ New Tender</span>
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-white/40">
                        <th className="pb-3">TENDER ID</th>
                        <th className="pb-3">COMMODITY & REQUIREMENTS</th>
                        <th className="pb-3">BIDDER / CONCESSION</th>
                        <th className="pb-3">TARGET QUANTITY</th>
                        <th className="pb-3">BID OFFER</th>
                        <th className="pb-3">COUNTER-OFFER</th>
                        <th className="pb-3">STATUS</th>
                        <th className="pb-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {buyerTenders.map((tender) => (
                        <tr key={tender.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 text-[#D4AF37] font-bold">{tender.id}</td>
                          <td className="py-4">
                            <span className="text-white font-bold block">{tender.title}</span>
                            <span className="text-[11px] text-[#10B981]">{tender.commodity}</span>
                          </td>
                          <td className="py-4 text-white/80">{tender.bidderSupplier}</td>
                          <td className="py-4 text-white font-bold">{tender.targetQuantity}</td>
                          <td className="py-4 font-bold text-[#D4AF37]">{tender.bidOfferPrice}</td>
                          <td className="py-4 font-mono text-amber-300">
                            {tender.counterOfferPrice || "—"}
                          </td>
                          <td className="py-4">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                tender.status === "Assayed"
                                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                                  : tender.status === "Escrow Pending"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                              }`}
                            >
                              {tender.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <Link
                              href={`/dashboard/messages?tender=${encodeURIComponent(tender.id)}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold text-xs transition-colors border border-[#D4AF37]/30"
                            >
                              <span>Negotiate</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Saved Watchlist */}
            {buyerActiveTab === "watchlist" && (
              <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-[#D4AF37]" />
                      Saved Mineral Watchlist & Live Valuations
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Pinned physical mineral lots held in bonded custody with real-time indicative valuation tracking.
                    </p>
                  </div>

                  <Link
                    href="/marketplace"
                    className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    <span>Browse All Lots</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {DEFAULT_SAVED_WATCHLIST.map((batch) => (
                    <div
                      key={batch.id}
                      className="rounded-3xl bg-[#0B0C10] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        <div className="relative w-full h-44 bg-black overflow-hidden">
                          <Image
                            src={batch.image || getMineralFallbackImage(batch.name, "metals")}
                            alt={batch.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-black/60 pointer-events-none" />

                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                            <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[#D4AF37] border border-white/[0.1]">
                              {batch.incoterms}
                            </span>
                            <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-2 py-0.5 rounded-full font-bold">
                              Verified
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 right-2.5">
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                batch.change.startsWith("+")
                                  ? "bg-[#10B981]/90 text-black"
                                  : "bg-rose-500/90 text-white"
                              }`}
                            >
                              {batch.change} 24h
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-2 text-xs font-mono">
                          <div className="flex items-center justify-between text-[10px] text-white/40">
                            <span>{batch.id}</span>
                            <span>{batch.assayNo}</span>
                          </div>
                          <h3 className="text-sm font-bold text-white font-sans truncate">
                            {batch.name}
                          </h3>
                          <p className="text-[11px] text-white/60 font-sans truncate">
                            {batch.producer}
                          </p>

                          <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#14171F] text-[11px]">
                            <div>
                              <span className="text-[9px] text-white/40 block uppercase">Weight</span>
                              <span className="text-white font-bold">{batch.weight}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-white/40 block uppercase">Purity</span>
                              <span className="text-[#10B981] font-bold truncate block">{batch.purity}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-2 border-t border-white/[0.05] flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-white/40 block uppercase">Valuation</span>
                          <span className="text-sm font-bold text-[#D4AF37] font-mono">
                            {batch.indicativeValuation}
                          </span>
                        </div>
                        <Link
                          href={`/dashboard/messages?lot=${encodeURIComponent(batch.id)}`}
                          className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold font-mono text-xs transition-colors flex items-center gap-1 border border-[#D4AF37]/30"
                        >
                          <span>RFQ</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 2. EQUIPMENT MANUFACTURER PORTAL                                  */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeRole === "equipment_manufacturer" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Equipment KPI Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Machinery in Catalog
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {equipmentList.length} Units
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> CE & ISO Certified
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Cooperative Quote Requests
                </span>
                <span className="text-2xl font-bold font-mono text-[#D4AF37] mt-1 block">
                  {equipmentInquiries.length} Active Leads
                </span>
                <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 mt-1 font-mono">
                  <Clock className="w-3 h-3" /> Concession Direct
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Parts Supply Contracts
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  18 Concessions
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <Wrench className="w-3 h-3" /> Guaranteed Maintenance
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Total Catalog Valuation
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  $1,515,000
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Ready for Delivery
                </span>
              </div>
            </div>

            {/* Equipment Tabs */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <button
                onClick={() => setEquipmentActiveTab("catalog")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  equipmentActiveTab === "catalog"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-[#14171F] text-white/60 hover:text-white"
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Heavy Machinery Catalog</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-black font-bold">
                  {equipmentList.length}
                </span>
              </button>

              <button
                onClick={() => setEquipmentActiveTab("inquiries")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  equipmentActiveTab === "inquiries"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-[#14171F] text-white/60 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Quote Requests & Miner Leads</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {equipmentInquiries.length}
                </span>
              </button>

              <div className="ml-auto">
                <Link
                  href="/dashboard/equipment/new"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold font-mono text-xs transition-colors flex items-center gap-1.5 shadow"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add New Equipment</span>
                </Link>
              </div>
            </div>

            {/* TAB 1: Heavy Machinery Catalog */}
            {equipmentActiveTab === "catalog" && (
              <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-[#D4AF37]" />
                      Active Heavy Plant & Mineral Processing Machinery
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Crushers, excavators, optical sorters, and gravity separation plants ready for concession deployment.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/equipment/new"
                    className="text-xs font-mono text-[#D4AF37] hover:underline"
                  >
                    + Register Machine
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {equipmentList.map((eqp) => (
                    <div
                      key={eqp.id}
                      className="rounded-3xl bg-[#0B0C10] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        <div className="relative w-full h-44 bg-black overflow-hidden">
                          <Image
                            src={eqp.photoUrl || "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80"}
                            alt={eqp.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-black/60 pointer-events-none" />

                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                            <span className="bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[#D4AF37] border border-white/[0.1]">
                              {eqp.machineType}
                            </span>
                            <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-2 py-0.5 rounded-full font-bold">
                              {eqp.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-white/40 block">{eqp.id}</span>
                            <h3 className="text-sm font-bold text-white font-sans leading-snug">
                              {eqp.name}
                            </h3>
                          </div>

                          <div className="space-y-1.5 p-3 rounded-xl bg-[#14171F] border border-white/[0.04]">
                            <div className="flex items-center justify-between">
                              <span className="text-white/40 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-[#D4AF37]" /> Capacity:
                              </span>
                              <span className="text-white font-bold">{eqp.capacity}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/40 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-400" /> Power:
                              </span>
                              <span className="text-white/80 truncate max-w-[140px]">{eqp.powerRequirement}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                              <span className="text-white/40">Incoterms:</span>
                              <span className="text-[#10B981]">{eqp.deliveryIncoterms}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-2 border-t border-white/[0.06] flex items-center justify-between bg-[#14171F]/30">
                        <div>
                          <span className="text-[9px] text-white/40 block uppercase">Price (USD)</span>
                          <span className="text-base font-bold text-[#D4AF37] font-mono">{eqp.priceUSD}</span>
                        </div>
                        <span className="text-[11px] text-white/50 font-mono">{eqp.leadTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Quote Requests Tab */}
            {equipmentActiveTab === "inquiries" && (
              <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                    Mining Cooperative Machinery Quote Requests
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Inquiries received directly from sovereign-licensed mining cooperatives and private concessions across Africa.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-white/40">
                        <th className="pb-3">INQUIRY ID</th>
                        <th className="pb-3">REQUESTED MACHINERY</th>
                        <th className="pb-3">MINER / COOPERATIVE</th>
                        <th className="pb-3">CONCESSION ORIGIN</th>
                        <th className="pb-3">PROCUREMENT TERMS</th>
                        <th className="pb-3">INDICATIVE BUDGET</th>
                        <th className="pb-3">STATUS</th>
                        <th className="pb-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {equipmentInquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 text-[#D4AF37] font-bold">{inq.id}</td>
                          <td className="py-4 text-white font-bold">{inq.machinery}</td>
                          <td className="py-4 text-white/90">{inq.minerCooperative}</td>
                          <td className="py-4 text-white/60">{inq.concessionCountry}</td>
                          <td className="py-4 text-amber-300">{inq.termType}</td>
                          <td className="py-4 font-bold text-white">{inq.offeredBudget}</td>
                          <td className="py-4">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <Link
                              href={`/dashboard/messages?inquiry=${encodeURIComponent(inq.id)}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold text-xs transition-colors border border-[#D4AF37]/30"
                            >
                              <span>Respond</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 3. SERVICE PROVIDER PORTAL                                        */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeRole === "service_provider" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Service KPI Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Accredited Service Lines
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {serviceOfferings.length} Active Services
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> ISO 17025 Certified
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Credentials in Vault
                </span>
                <span className="text-2xl font-bold font-mono text-[#D4AF37] mt-1 block">
                  {serviceCredentials.length} Licenses
                </span>
                <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 mt-1 font-mono">
                  <ShieldCheck className="w-3 h-3" /> MEMD & URA Sealed
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Service RFQs Pending
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {serviceRfqs.length} Workorders
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <Clock className="w-3 h-3" /> High-Priority Testing
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Audited Consignment Volume
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  $32,400,000
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <Award className="w-3 h-3" /> 100% Zero Dispute
                </span>
              </div>
            </div>

            {/* Service Provider Tabs */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <button
                onClick={() => setServiceActiveTab("profile")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  serviceActiveTab === "profile"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-[#14171F] text-white/60 hover:text-white"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Professional Profile Manager</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-black font-bold">
                  {serviceOfferings.length}
                </span>
              </button>

              <button
                onClick={() => setServiceActiveTab("vault")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  serviceActiveTab === "vault"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-[#14171F] text-white/60 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Credentials Vault</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {serviceCredentials.length}
                </span>
              </button>

              <button
                onClick={() => setServiceActiveTab("rfqs")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  serviceActiveTab === "rfqs"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-[#14171F] text-white/60 hover:text-white"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Service RFQs</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {serviceRfqs.length}
                </span>
              </button>
            </div>

            {/* TAB 1: Professional Profile Manager (Services Offered) */}
            {serviceActiveTab === "profile" && (
              <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#D4AF37]" />
                    Accredited Mineral Services Offered
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Configure laboratory assay capabilities, geological exploration surveys, armored logistics, and ESG certification offerings.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {serviceOfferings.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-5 rounded-2xl bg-[#0B0C10] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                          {srv.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {srv.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white font-sans">{srv.title}</h3>
                      <p className="text-xs font-mono text-[#10B981]">{srv.accreditationBadge}</p>

                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-white/40 block uppercase">Standard Fee</span>
                          <span className="font-bold text-white">{srv.rateUSD}</span>
                        </div>
                        <span className="text-white/60">{srv.leadTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Credentials Vault */}
            {serviceActiveTab === "vault" && (
              <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                      Accreditation Credentials & Ministerial Licenses Vault
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Statutory partnerships with Alex Stewart International, SGS, and the MEMD Directorate of Geological Survey.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/kyc"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload New License</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {serviceCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center flex-shrink-0">
                          <FileCheck className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">{cred.title}</span>
                          <span className="text-xs font-mono text-white/50 block">
                            Issuing Body: {cred.authority} • Valid Through: {cred.validUntil}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-[10px] font-mono bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-2.5 py-1 rounded-full font-bold">
                          {cred.status}
                        </span>
                        <span className="text-xs font-mono text-[#D4AF37] underline truncate max-w-[180px]">
                          {cred.fileName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Service RFQs Tab */}
            {serviceActiveTab === "rfqs" && (
              <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    Inquiries & Batch Testing / Freight Workorders
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Testing requests and secure freight logistics mandates initiated by registered buyers and suppliers.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-white/40">
                        <th className="pb-3">WORKORDER ID</th>
                        <th className="pb-3">CLIENT ENTITY</th>
                        <th className="pb-3">ROLE</th>
                        <th className="pb-3">REQUIRED SERVICE</th>
                        <th className="pb-3">BATCH LOT REF</th>
                        <th className="pb-3">TARGET DATE</th>
                        <th className="pb-3">FEE BUDGET</th>
                        <th className="pb-3">STATUS</th>
                        <th className="pb-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {serviceRfqs.map((rfq) => (
                        <tr key={rfq.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 text-[#D4AF37] font-bold">{rfq.id}</td>
                          <td className="py-4 text-white font-bold">{rfq.clientEntity}</td>
                          <td className="py-4">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-white/80">
                              {rfq.role}
                            </span>
                          </td>
                          <td className="py-4 text-white/90">{rfq.requiredService}</td>
                          <td className="py-4 text-white/60">{rfq.lotReference}</td>
                          <td className="py-4 text-white/50">{rfq.targetDate}</td>
                          <td className="py-4 font-bold text-[#D4AF37]">{rfq.feeBudget}</td>
                          <td className="py-4">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                              {rfq.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <Link
                              href={`/dashboard/messages?serviceRfq=${encodeURIComponent(rfq.id)}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold text-xs transition-colors border border-[#D4AF37]/30"
                            >
                              <span>Manage</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 4. SUPPLIER PORTAL (PRODUCER VIEW)                                */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeRole === "supplier" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Supplier Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Bonded Escrow Balance
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  $4,850,000.00
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <Lock className="w-3 h-3" /> Tier-1 Vault Custody
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Active Trade Contracts
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {3 + customListings.length} Lots
                </span>
                <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 mt-1 font-mono">
                  <Clock className="w-3 h-3" /> In Settlement / Custody
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Certified Assays
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {18 + customListings.length} Records
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <FileCheck className="w-3 h-3" /> SGS / Alex Stewart / MEMD
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171F] border border-white/[0.08]">
                <span className="text-xs text-white/40 block font-mono uppercase">
                  Compliance Score
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  99.8%
                </span>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-mono">
                  <ShieldCheck className="w-3 h-3" /> OECD Annex II Clean
                </span>
              </div>
            </div>

            {/* Active Bilateral Escrow Pipeline Table */}
            <div className="p-6 rounded-3xl bg-[#14171F] border border-white/[0.08]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Active Bilateral Escrow Pipeline & Registered Batches
                    <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                      {3 + customListings.length} ACTIVE LOTS
                    </span>
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Real-time tracking of mineral shipments, assay certifications, and fund releases.
                  </p>
                </div>

                <Link
                  href="/dashboard/listings/new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-mono text-xs font-semibold transition-all border border-[#D4AF37]/30"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register Mineral Lot</span>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-white/40 font-mono">
                      <th className="pb-3">BATCH ASSAY ID</th>
                      <th className="pb-3">COMMODITY & GRADE</th>
                      <th className="pb-3">CERTIFIED WEIGHT</th>
                      <th className="pb-3">CONCESSION ORIGIN</th>
                      <th className="pb-3">VALUATION (USD)</th>
                      <th className="pb-3">STATUS</th>
                      <th className="pb-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05] font-mono">
                    {/* User-created listings */}
                    {customListings.map((lot) => (
                      <tr key={lot.lot_id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 text-[#D4AF37] font-bold">{lot.lot_id}</td>
                        <td className="py-4">
                          <span className="text-white font-bold block">{lot.commodity}</span>
                          <span className="text-[11px] text-white/50">{lot.grade}</span>
                        </td>
                        <td className="py-4 text-white font-semibold">{lot.weight}</td>
                        <td className="py-4 text-white/70">
                          {lot.origin_region}, {lot.origin_country}
                        </td>
                        <td className="py-4 font-bold text-white">{lot.price_usd}</td>
                        <td className="py-4">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold uppercase">
                            {lot.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link
                            href="/dashboard/messages"
                            className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
                          >
                            <span>Open Escrow</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {/* Preloaded lots */}
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-[#D4AF37] font-bold">MDA-GLD-088</td>
                      <td className="py-4">
                        <span className="text-white font-bold block">Gold Doré Bars</span>
                        <span className="text-[11px] text-white/50">94.50% Au Refined</span>
                      </td>
                      <td className="py-4 text-white font-semibold">185.00 kg</td>
                      <td className="py-4 text-white/70">Buhweju Concession, Uganda</td>
                      <td className="py-4 font-bold text-white">$13,650,000.00</td>
                      <td className="py-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold uppercase">
                          Vault Custody
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href="/dashboard/messages"
                          className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
                        >
                          <span>Open Escrow</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-[#D4AF37] font-bold">MDA-CPR-204</td>
                      <td className="py-4">
                        <span className="text-white font-bold block">Copper Cathodes Grade A</span>
                        <span className="text-[11px] text-white/50">99.99% Cu Electrowon</span>
                      </td>
                      <td className="py-4 text-white font-semibold">2,000.00 MT</td>
                      <td className="py-4 text-white/70">Kitwe Yard, Zambia</td>
                      <td className="py-4 font-bold text-white">$19,700,000.00</td>
                      <td className="py-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                          In Escrow Audit
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href="/dashboard/messages"
                          className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
                        >
                          <span>Open Escrow</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-[#D4AF37] font-bold">MDA-LIT-312</td>
                      <td className="py-4">
                        <span className="text-white font-bold block">Spodumene Lithium Ore (SC6)</span>
                        <span className="text-[11px] text-white/50">6.22% Li2O Concentrate</span>
                      </td>
                      <td className="py-4 text-white font-semibold">6,500.00 MT</td>
                      <td className="py-4 text-white/70">Bikita Concession, Zimbabwe</td>
                      <td className="py-4 font-bold text-white">$6,370,000.00</td>
                      <td className="py-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                          Assayed & Ready
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href="/dashboard/messages"
                          className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
                        >
                          <span>Open Escrow</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
