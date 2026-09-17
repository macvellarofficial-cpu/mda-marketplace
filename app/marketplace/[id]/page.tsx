"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Download,
  Bookmark,
  X,
  Send,
  ChevronRight,
  BadgeCheck,
  Scale,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getMineralFallbackImage } from "@/utils/mineralFallback";

interface MineralDetailItem {
  id: string;
  assayNo: string;
  name: string;
  category: string;
  grade: string;
  purity: string;
  weight: string;
  weightNumeric: number;
  weightUnit: string;
  origin: string;
  concessionCoordinates: string;
  institution: string;
  licenseNumber: string;
  price: string;
  unitPriceUSD: number;
  unitLabel: string;
  status: string;
  auditPartner: string;
  assayDate: string;
  incoterms: string;
  vaultLocation: string;
  description: string;
  images: string[];
  assayBreakdown: { element: string; symbol: string; percentage: string }[];
  complianceBadges: string[];
}

interface CustomListingRecord {
  lot_id: string;
  assay_cert_number?: string;
  commodity: string;
  category?: string;
  grade?: string;
  purity?: string;
  weight?: string;
  origin_region?: string;
  origin_country?: string;
  price_usd?: string;
  assay_lab?: string;
  incoterms?: string;
  images?: string[];
}

const EXTENDED_DETAILS: Record<string, Partial<MineralDetailItem>> = {
  "MDA-GLD-088": {
    id: "MDA-GLD-088",
    assayNo: "ASY-UG-2026-GLD-019",
    name: "94.5% Au Unrefined Gold Bars",
    category: "Precious Metals",
    grade: "Commercial Bullion (94.5% Au)",
    purity: "94.50% Au Refined",
    weight: "185.00 kg",
    weightNumeric: 185,
    weightUnit: "kg",
    origin: "Buhweju Gold Belt, Western Region, Uganda",
    concessionCoordinates: "0°22'48.0\"S 30°17'24.0\"E",
    institution: "Albertine Sovereign Minerals Consortium Ltd",
    licenseNumber: "MEMD Mining Lease #ML-2022-091",
    price: "$13,650,000",
    unitPriceUSD: 73783,
    unitLabel: "kg",
    status: "Vault Custody - Entebbe",
    auditPartner: "MEMD Certified / SGS Geochemical",
    assayDate: "September 04, 2026",
    incoterms: "FOB Entebbe Bonded Vault",
    vaultLocation: "Bank of Uganda Bonded Vault / Entebbe Logistics Hub",
    description:
      "Alluvial and lode-extracted gold doré bars cast into standard 5 kg and 10 kg inspection ingots. Smelted under strict environmental safeguards with zero mercury amalgamation. Certified through spectrographic fire assay by SGS Mineral Services in collaboration with the Directorate of Geological Survey and Mines (DGSM).",
    images: [
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    ],
    assayBreakdown: [
      { element: "Gold", symbol: "Au", percentage: "94.50%" },
      { element: "Silver", symbol: "Ag", percentage: "4.82%" },
      { element: "Iron", symbol: "Fe", percentage: "0.14%" },
      { element: "Copper", symbol: "Cu", percentage: "0.08%" },
      { element: "Trace Residue", symbol: "Others", percentage: "< 0.46%" },
    ],
    complianceBadges: [
      "OECD Annex II Cleared",
      "ICGLR Regional Certification",
      "URSB Tax Compliant",
      "EAC Mineral Traceability",
    ],
  },
  "MDA-GLD-019": {
    id: "MDA-GLD-019",
    assayNo: "ASY-UG-2026-GLD-019",
    name: "94.5% Au Unrefined Gold Bars",
    category: "Precious Metals",
    grade: "Commercial Bullion (94.5% Au)",
    purity: "94.50% Au Refined",
    weight: "185.00 kg",
    weightNumeric: 185,
    weightUnit: "kg",
    origin: "Buhweju Gold Belt, Western Region, Uganda",
    concessionCoordinates: "0°22'48.0\"S 30°17'24.0\"E",
    institution: "Albertine Sovereign Minerals Consortium Ltd",
    licenseNumber: "MEMD Mining Lease #ML-2022-091",
    price: "$13,650,000",
    unitPriceUSD: 73783,
    unitLabel: "kg",
    status: "Vault Custody - Entebbe",
    auditPartner: "MEMD Certified / SGS Geochemical",
    assayDate: "September 04, 2026",
    incoterms: "FOB Entebbe Bonded Vault",
    vaultLocation: "Bank of Uganda Bonded Vault / Entebbe Logistics Hub",
    description:
      "Alluvial and lode-extracted gold doré bars cast into standard 5 kg and 10 kg inspection ingots. Smelted under strict environmental safeguards with zero mercury amalgamation.",
    images: [
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=85",
    ],
    assayBreakdown: [
      { element: "Gold", symbol: "Au", percentage: "94.50%" },
      { element: "Silver", symbol: "Ag", percentage: "4.82%" },
      { element: "Iron", symbol: "Fe", percentage: "0.14%" },
      { element: "Copper", symbol: "Cu", percentage: "0.08%" },
    ],
    complianceBadges: [
      "OECD Annex II Cleared",
      "ICGLR Regional Certification",
      "URSB Tax Compliant",
    ],
  },
  "MDA-CPR-204": {
    id: "MDA-CPR-204",
    assayNo: "ASY-ZM-2026-CPR-441",
    name: "Copper Cathodes Grade A",
    category: "Precious Metals",
    grade: "Electrowon 99.99% Cu",
    purity: "99.99% Cu Electrowon",
    weight: "2,000.00 MT",
    weightNumeric: 2000,
    weightUnit: "MT",
    origin: "Kitwe Refining Yard, Copperbelt Province, Zambia",
    concessionCoordinates: "12°48'09.0\"S 28°12'45.0\"E",
    institution: "Zambian Copperbelt Trade Hub Ltd",
    licenseNumber: "ZEMA Environmental Lic. #ZM-CPR-2024",
    price: "$19,700,000",
    unitPriceUSD: 9850,
    unitLabel: "MT",
    status: "Ready for Escrow - Bonded Yard",
    auditPartner: "Alex Stewart International",
    assayDate: "August 28, 2026",
    incoterms: "CIF Durban Port / Walvis Bay",
    vaultLocation: "Zambian Bonded Freight Terminal / Kitwe",
    description:
      "High-conductivity electrowon electrolytic copper cathodes conformant with BS EN 1978:1998 (Cu-ETP-2) standards. Packaged in strapped bundles of 2.5 MT on ocean export pallets, pre-cleared for SADC and international container shipping.",
    images: [
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85",
    ],
    assayBreakdown: [
      { element: "Copper", symbol: "Cu", percentage: "99.993%" },
      { element: "Iron", symbol: "Fe", percentage: "0.002%" },
      { element: "Lead", symbol: "Pb", percentage: "0.001%" },
      { element: "Silver", symbol: "Ag", percentage: "0.001%" },
      { element: "Sulfur", symbol: "S", percentage: "< 0.003%" },
    ],
    complianceBadges: [
      "LME Grade A Spec",
      "Alex Stewart Tamper-Sealed",
      "SADC Certificate of Origin",
    ],
  },
  "MDA-LIT-312": {
    id: "MDA-LIT-312",
    assayNo: "ASY-ZW-2026-LIT-808",
    name: "Spodumene Lithium Ore (SC6)",
    category: "Rare Earth Elements",
    grade: "Battery Hydroxide Feed (6.22% Li2O)",
    purity: "6.22% Li2O Chemical Grade",
    weight: "6,500.00 MT",
    weightNumeric: 6500,
    weightUnit: "MT",
    origin: "Bikita Mineral Concession, Masvingo, Zimbabwe",
    concessionCoordinates: "19°57'12.0\"S 31°26'00.0\"E",
    institution: "Great Dyke Lithium Miners Syndicate",
    licenseNumber: "MMD Mineral Export Lic #ZW-LIT-9921",
    price: "$6,370,000",
    unitPriceUSD: 980,
    unitLabel: "MT",
    status: "Ready for Escrow - Rail Siding",
    auditPartner: "Bureau Veritas Inspection",
    assayDate: "September 02, 2026",
    incoterms: "FOB Beira Port, Mozambique",
    vaultLocation: "Beira Bulk Minerals Terminal / Siding 4",
    description:
      "Dense medium separation (DMS) spodumene pegmatite concentrate with ultra-low iron contamination (Fe2O3 < 0.85%). Specially formulated for direct conversion to battery-grade lithium hydroxide monohydrate.",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=85",
    ],
    assayBreakdown: [
      { element: "Lithium Oxide", symbol: "Li2O", percentage: "6.22%" },
      { element: "Iron Oxide", symbol: "Fe2O3", percentage: "0.78%" },
      { element: "Alumina", symbol: "Al2O3", percentage: "24.15%" },
      { element: "Silica", symbol: "SiO2", percentage: "64.10%" },
      { element: "Potassium/Sodium", symbol: "K2O+Na2O", percentage: "1.45%" },
    ],
    complianceBadges: [
      "Bureau Veritas Certified",
      "Battery Precursor Spec",
      "Export Beneficiation Permit",
    ],
  },
  "MDA-COL-551": {
    id: "MDA-COL-551",
    assayNo: "ASY-RW-2026-COL-112",
    name: "Tantalite (Coltan Concentrate)",
    category: "Rare Earth Elements",
    grade: "Ta2O5 > 32% Certified",
    purity: "34.10% Ta2O5",
    weight: "75.00 MT",
    weightNumeric: 75,
    weightUnit: "MT",
    origin: "Bugesera Logistics Base, Eastern Province, Rwanda",
    concessionCoordinates: "2°08'40.0\"S 30°15'10.0\"E",
    institution: "Central Rift Mineral Trading Co.",
    licenseNumber: "RMB Concession #RW-MIN-8810",
    price: "$10,650,000",
    unitPriceUSD: 142000,
    unitLabel: "MT",
    status: "Vault Custody - Kigali Central",
    auditPartner: "ICGLR Tagged / SGS Minerals",
    assayDate: "August 30, 2026",
    incoterms: "CIF Rotterdam / Antwerp",
    vaultLocation: "RMB Sovereign Bonded Storage / Kigali",
    description:
      "Tantalum-niobium mineral concentrate tagged under the ICGLR Regional Certification Mechanism. Conflict-free supply chain fully compliant with Dodd-Frank 1502 and EU Conflict Minerals Regulation.",
    images: [
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    ],
    assayBreakdown: [
      { element: "Tantalum Pentoxide", symbol: "Ta2O5", percentage: "34.10%" },
      { element: "Niobium Pentoxide", symbol: "Nb2O5", percentage: "22.30%" },
      { element: "Tin Dioxide", symbol: "SnO2", percentage: "1.90%" },
      { element: "Iron Oxide", symbol: "FeO", percentage: "8.40%" },
      { element: "Titanium Dioxide", symbol: "TiO2", percentage: "2.10%" },
    ],
    complianceBadges: [
      "ICGLR Green Barcode Tagged",
      "RMB Export Cleared",
      "EU Due Diligence Verified",
    ],
  },
  "MDA-DIA-904": {
    id: "MDA-DIA-904",
    assayNo: "ASY-BW-2026-DIA-055",
    name: "Kimberlite Rough Diamonds (D-H)",
    category: "Precious Stones",
    grade: "VVS-SI Gem Quality Rough",
    purity: "Kimberley Process Cleared",
    weight: "1,250.00 cts",
    weightNumeric: 1250,
    weightUnit: "cts",
    origin: "Orapa District Concession, Central District, Botswana",
    concessionCoordinates: "21°18'20.0\"S 25°22'15.0\"E",
    institution: "Kalahari Diamond Exchange Ltd",
    licenseNumber: "Botswana Mines Lic. #BW-DIA-2021",
    price: "$4,200,000",
    unitPriceUSD: 3360,
    unitLabel: "ct",
    status: "Vault Custody - Gaborone",
    auditPartner: "KPCS Verified / GIA Rough Evaluation",
    assayDate: "September 01, 2026",
    incoterms: "CIF Antwerp Vault / Dubai DDE",
    vaultLocation: "Diamond Technology Park Vault / Gaborone",
    description:
      "Natural untreated octohedral and dodecahedral rough diamond crystals ranging from 2.0 to 14.5 carats per stone. D-H colour spectrum with exceptional clarity. Sealed with government tamper-proof KPCS serial tags.",
    images: [
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
    ],
    assayBreakdown: [
      { element: "Carbon Purity", symbol: "C", percentage: "99.95%" },
      { element: "Nitrogen Impurity", symbol: "N", percentage: "< 0.04%" },
      { element: "Hydrogen/Boron", symbol: "Trace", percentage: "< 0.01%" },
    ],
    complianceBadges: [
      "Kimberley Process Certificate",
      "GIA Rough Dossier",
      "Botswana Mineral Hub Cleared",
    ],
  },
  "MDA-TZN-108": {
    id: "MDA-TZN-108",
    assayNo: "ASY-TZ-2026-TZN-301",
    name: "Natural Blue Zoisite (Tanzanite)",
    category: "Precious Stones",
    grade: "AAA Vivid Royal Blue",
    purity: "Untreated Rough Facet Grade",
    weight: "4,800.00 grams",
    weightNumeric: 4800,
    weightUnit: "grams",
    origin: "Merelani Hills Block C, Manyara Region, Tanzania",
    concessionCoordinates: "3°34'50.0\"S 36°59'30.0\"E",
    institution: "Kilimanjaro Gem Syndicate",
    licenseNumber: "TMC Concession #TZ-GEM-771",
    price: "$2,890,000",
    unitPriceUSD: 602,
    unitLabel: "gram",
    status: "Ready for Escrow - Arusha Vault",
    auditPartner: "Tanzania Mining Commission / GJEPC",
    assayDate: "August 25, 2026",
    incoterms: "FOB Dar es Salaam / Arusha",
    vaultLocation: "Mirerani High-Security Gem Facility",
    description:
      "Trichroic zoisite crystals exhibiting intense violet-blue pleochroism. Excellent crystal shape and crystal facet integrity. Direct mine-to-market traceability with Tanzania Mining Commission mineral transit permits.",
    images: [
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=85",
    ],
    assayBreakdown: [
      { element: "Silicon Dioxide", symbol: "SiO2", percentage: "39.5%" },
      { element: "Alumina", symbol: "Al2O3", percentage: "33.2%" },
      { element: "Calcium Oxide", symbol: "CaO", percentage: "24.1%" },
      { element: "Vanadium (Colorant)", symbol: "V2O3", percentage: "0.32%" },
    ],
    complianceBadges: [
      "Tanzania Mining Commission Seal",
      "Merelani Wall Passcode Cleared",
      "Conflict-Free Gem Certificate",
    ],
  },
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "MDA-GLD-088";
  const lotId = decodeURIComponent(rawId);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{
    email?: string;
    workEmail?: string;
    fullName?: string;
    companyName?: string;
    role?: string;
    id?: string;
  } | null>(null);

  // Listing data
  const [lot, setLot] = useState<MineralDetailItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals & UI States
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showRfqDrawer, setShowRfqDrawer] = useState(false);
  const [showAssayModal, setShowAssayModal] = useState(false);
  const [savedBookmark, setSavedBookmark] = useState(false);
  const [rfqSubmitting, setRfqSubmitting] = useState(false);

  // RFQ Form States
  const [proposedUnitPrice, setProposedUnitPrice] = useState<string>("");
  const [desiredQuantity, setDesiredQuantity] = useState<string>("");
  const [incotermsPref, setIncotermsPref] = useState<"CIF" | "FOB" | "EXW">("CIF");
  const [destinationPort, setDestinationPort] = useState<string>("CIF Rotterdam Port");
  const [commercialSpecs, setCommercialSpecs] = useState<string>("");
  const [rfqError, setRfqError] = useState("");

  // Check auth and fetch listing
  useEffect(() => {
    // 1. Check local session
    const cachedUser = sessionStorage.getItem("mda_user");
    if (cachedUser) {
      try {
        setCurrentUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Check Supabase session
      try {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user) {
            setCurrentUser({
              id: data.user.id,
              email: data.user.email,
              workEmail: data.user.email,
              fullName: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
              role: data.user.user_metadata?.role || "buyer",
            });
          }
        });
      } catch (e) {
        console.warn(e);
      }
    }

    // 2. Resolve listing data
    let found = EXTENDED_DETAILS[lotId];

    // Check custom listings if not in static map
    if (!found) {
      const customListings = sessionStorage.getItem("mda_custom_listings");
      if (customListings) {
        try {
          const parsed = JSON.parse(customListings);
          const match = parsed.find((item: CustomListingRecord) => item.lot_id === lotId);
          if (match) {
            const fallbackImg = getMineralFallbackImage(match.commodity, match.category);
            const numVal = parseFloat(match.price_usd?.replace(/[^0-9.]/g, "") || "1000000");
            const weightNum = parseFloat(match.weight?.replace(/[^0-9.]/g, "") || "100");
            found = {
              id: match.lot_id,
              assayNo: match.assay_cert_number || "ASY-2026-CUSTOM",
              name: match.commodity,
              category: match.category || "Precious Metals",
              grade: match.grade || "Commercial Standard Grade",
              purity: match.purity || "Certified Assay Standard",
              weight: match.weight || "100.00 kg",
              weightNumeric: weightNum,
              weightUnit: match.weight?.split(" ")[1] || "kg",
              origin: `${match.origin_region || "Central Region"}, ${match.origin_country || "Uganda"}`,
              concessionCoordinates: "0°18'50.0\"N 32°34'10.0\"E",
              institution: "Registered Concession Syndicate",
              licenseNumber: "MEMD Mining Permit #UG-2026-REG",
              price: match.price_usd || "$1,000,000",
              unitPriceUSD: Math.round(numVal / (weightNum || 1)),
              unitLabel: match.weight?.split(" ")[1] || "kg",
              status: "Vault Custody - Verified Batch",
              auditPartner: match.assay_lab || "MEMD Directorate",
              assayDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              incoterms: match.incoterms || "FOB Entebbe",
              vaultLocation: "Uganda Bonded Custody Terminal",
              description: `Concession batch of ${match.commodity} assayed at ${match.purity} grade, registered under sovereign inspection standards.`,
              images: match.images && match.images.length > 0 ? match.images : [fallbackImg],
              assayBreakdown: [
                { element: match.commodity, symbol: "Min", percentage: match.purity },
                { element: "Associated Mineral", symbol: "Sub", percentage: "Balance" },
              ],
              complianceBadges: ["Verified Concession", "MEMD Inspector Approved"],
            };
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Default fallback if ID is not recognized
    if (!found) {
      found = {
        ...EXTENDED_DETAILS["MDA-GLD-088"],
        id: lotId,
        name: `${lotId} Certified Mineral Batch`,
      };
    }

    setLot(found as MineralDetailItem);
    setProposedUnitPrice(found.unitPriceUSD ? found.unitPriceUSD.toString() : "73783");
    setDesiredQuantity(found.weightNumeric ? found.weightNumeric.toString() : "185");
  }, [lotId]);

  // Handle RFQ Action Trigger
  const handleRfqClick = () => {
    if (!currentUser) {
      setShowGuestModal(true);
      return;
    }
    setShowRfqDrawer(true);
  };

  // Handle Assay Verification Trigger
  const handleAssayClick = () => {
    if (!currentUser) {
      setShowGuestModal(true);
      return;
    }
    setShowAssayModal(true);
  };

  // Submit Formal RFQ & Route to Bilateral Negotiation
  const handleSubmitRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setRfqError("");

    if (!proposedUnitPrice || !desiredQuantity) {
      setRfqError("Please specify both proposed unit price and target quantity.");
      return;
    }

    setRfqSubmitting(true);

    try {
      const unitVal = parseFloat(proposedUnitPrice) || 0;
      const qtyVal = parseFloat(desiredQuantity) || 0;
      const totalBudget = Math.round(unitVal * qtyVal);
      const threadId = `neg-${Math.floor(1000 + Math.random() * 9000)}`;
      const rfqId = `rfq-${Date.now()}`;

      const rfqRecord = {
        id: rfqId,
        lot_id: lot?.id || lotId,
        buyer_email: currentUser?.workEmail || currentUser?.email || "buyer@institution.com",
        buyer_name: currentUser?.companyName || currentUser?.fullName || "Institutional Offtake Buyer",
        proposed_unit_price: unitVal,
        desired_quantity: `${qtyVal} ${lot?.unitLabel || "kg"}`,
        incoterms: incotermsPref,
        destination_port: destinationPort,
        commercial_specs: commercialSpecs,
        total_budget_usd: totalBudget,
        status: "pending_review",
        created_at: new Date().toISOString(),
      };

      const initialMessageText = `[FORMAL RFQ TRANSMITTED]
Batch: ${lot?.id} - ${lot?.name}
Proposed Unit Price: $${unitVal.toLocaleString()} / ${lot?.unitLabel || "unit"}
Target Quantity: ${qtyVal} ${lot?.unitLabel || "units"} (${incotermsPref}${incotermsPref === "CIF" ? ` ${destinationPort}` : ""})
Total Commercial Valuation: $${totalBudget.toLocaleString()} USD
Custody Structure: Tier-1 Bonded Escrow Settlement
Buyer Notes: ${commercialSpecs.trim() || "Ready to execute conditional LOI upon spectrographic confirmation."}`;

      // 1. Write to Supabase tables
      try {
        const supabase = createClient();
        await supabase.from("rfqs").insert(rfqRecord);
        await supabase.from("conversations").insert({
          id: threadId,
          lot_id: lot?.id || lotId,
          buyer_email: rfqRecord.buyer_email,
          status: "In Negotiation",
          created_at: new Date().toISOString(),
        });
        await supabase.from("messages").insert({
          thread_id: threadId,
          sender_name: rfqRecord.buyer_name,
          sender_role: "buyer",
          text: initialMessageText,
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn("Supabase RFQ dispatch notice:", dbErr);
      }

      // 2. Cache thread in sessionStorage for immediate negotiation room load
      const newThread = {
        id: threadId,
        lotId: lot?.id || lotId,
        commodity: lot?.name || "Mineral Asset",
        counterparty: lot?.institution || "Concession Producer",
        counterpartyRole: "Concession Producer",
        counterpartyCountry: lot?.origin.split(",")[1]?.trim() || "Uganda",
        agreedPrice: `$${totalBudget.toLocaleString()}`,
        weight: `${qtyVal} ${lot?.unitLabel || "units"}`,
        status: "In Negotiation" as const,
        lastMessage: `Formal RFQ transmitted: $${unitVal.toLocaleString()} / ${lot?.unitLabel || "unit"}`,
        timestamp: "Just now",
        unreadCount: 0,
      };

      const existingThreads = JSON.parse(sessionStorage.getItem("mda_custom_threads") || "[]");
      existingThreads.unshift(newThread);
      sessionStorage.setItem("mda_custom_threads", JSON.stringify(existingThreads));

      // Cache thread messages
      const initialThreadMsgs = [
        {
          id: `msg-${Date.now()}`,
          senderName: "System (MDA Institutional Protocol)",
          senderRole: "system" as const,
          text: "Negotiation Room initialized. All communications are bound by the MDA Bilateral Escrow Charter. External contact exchanges are monitored and prohibited.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        {
          id: `msg-${Date.now() + 1}`,
          senderName: currentUser?.companyName || currentUser?.fullName || "You (Buyer)",
          senderRole: "buyer" as const,
          text: initialMessageText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isEscrowProposal: true,
        },
      ];
      sessionStorage.setItem(`mda_thread_${threadId}`, JSON.stringify(initialThreadMsgs));

      // 3. Redirect to the bilateral negotiation room
      setShowRfqDrawer(false);
      router.push(`/dashboard/messages/${threadId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to transmit RFQ.";
      setRfqError(msg);
      setRfqSubmitting(false);
    }
  };

  if (!lot) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-white font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving Mineral Concession Dossier...</span>
        </div>
      </div>
    );
  }

  const currentHeroImage = lot.images[activeImageIndex] || lot.images[0];
  const unitCalcTotal =
    (parseFloat(proposedUnitPrice) || 0) * (parseFloat(desiredQuantity) || 0);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] pb-28 sm:pb-32">
      {/* Top Ambient Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#D4AF37]/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0B0C10]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/marketplace"
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <Link href="/marketplace" className="hover:text-white/80 transition-colors">
                  Marketplace
                </Link>
                <span>/</span>
                <span className="text-[#D4AF37] font-semibold">{lot.id}</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[240px] sm:max-w-md">
                {lot.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSavedBookmark(!savedBookmark)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                savedBookmark
                  ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                  : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">
                {savedBookmark ? "Saved to Watchlist" : "Watchlist"}
              </span>
            </button>

            <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="hidden md:inline">Sovereign Vault Cleared</span>
              <span className="md:hidden">Cleared</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 space-y-8 relative z-10">
        {/* TOP SECTION: Photo Gallery + Primary Commercial Block */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: Image Gallery & Specimen Proof */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary High-Res Specimen View */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-[#14171F] border border-white/[0.08] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <Image
                src={currentHeroImage}
                alt={lot.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized={currentHeroImage.startsWith("blob:")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/90 via-transparent to-black/30 pointer-events-none" />

              {/* Floating Metadata Tags */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-mono font-bold tracking-wide shadow-lg">
                  {lot.id}
                </span>

                <span className="px-3 py-1 rounded-full bg-[#14171F]/90 backdrop-blur-md text-white/90 border border-white/[0.15] text-xs font-mono font-medium shadow-lg">
                  {lot.incoterms}
                </span>
              </div>

              {/* Bottom Image Tag: Custody Location */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.1] text-xs text-white/90 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="truncate max-w-[260px] sm:max-w-md">{lot.vaultLocation}</span>
                </div>

                <span className="text-[11px] font-mono text-white/60 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/[0.1]">
                  Photo {activeImageIndex + 1} of {lot.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {lot.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {lot.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx
                        ? "border-[#D4AF37] scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        : "border-white/[0.1] hover:border-white/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${lot.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: Commercial Specs & Primary Action Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
                  {lot.category}
                </span>
                <span className="text-xs font-mono text-white/50 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Assayed {lot.assayDate}
                </span>
              </div>

              {/* Title & Grade */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {lot.name}
                </h2>
                <p className="text-sm font-mono text-[#D4AF37] mt-1 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#10B981]" />
                  <span>{lot.grade}</span>
                </p>
              </div>

              {/* Indicative Valuation & Price Metric */}
              <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block">
                  Indicative Commercial Valuation (USD)
                </span>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#D4AF37]">
                    {lot.price}
                  </span>
                  <span className="text-xs font-mono text-white/60">
                    ≈ ${lot.unitPriceUSD.toLocaleString()} / {lot.unitLabel}
                  </span>
                </div>
              </div>

              {/* Core Physical & Assay Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0B0C10] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    Certified Weight
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-0.5 block">
                    {lot.weight}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0C10] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    Assayed Purity
                  </span>
                  <span className="text-lg font-bold font-mono text-[#10B981] mt-0.5 block truncate">
                    {lot.purity}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0C10] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    Assay Audit Ref
                  </span>
                  <span className="text-xs font-bold font-mono text-[#D4AF37] mt-1 block truncate">
                    {lot.assayNo}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0C10] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    Delivery Incoterms
                  </span>
                  <span className="text-xs font-bold font-mono text-white mt-1 block truncate">
                    {lot.incoterms.split(" ")[0]} ({lot.incoterms.split(" ").slice(1).join(" ")})
                  </span>
                </div>
              </div>

              {/* Primary Dual Action Bar */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleRfqClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-black font-extrabold text-sm transition-all shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Submit Formal RFQ</span>
                </button>

                <button
                  onClick={handleAssayClick}
                  className="w-full py-3 px-6 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-[#10B981]/50 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 text-white/90 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Request Assay Verification</span>
                </button>
              </div>

              {/* Concession Holder Footnote */}
              <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between text-xs font-mono text-white/50">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="truncate max-w-[200px]">{lot.institution}</span>
                </span>
                <span className="text-[#10B981] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Licensed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLIANCE & ESCROW SECURITY NOTICE (Mandatory Policy Banner) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14171F] border border-[#D4AF37]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Institutional Compliance Notice
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-mono border border-[#10B981]/30 font-bold">
                    MEMD & OECD PROTOCOL
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-4xl">
                  Institutional Security: Direct phone numbers and external links are prohibited. All commercial negotiations execute through MDA Bilateral Escrow.
                </p>
                <p className="text-[11px] text-white/50 font-mono">
                  Off-platform solicitation voids trade insurance and triggers automatic dossier review by national mineral directorates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <span className="text-xs font-mono text-[#D4AF37] bg-black/40 px-3 py-1.5 rounded-xl border border-white/[0.08] flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Tier-1 Bonded Protection</span>
              </span>
            </div>
          </div>
        </div>

        {/* DETAILED DOSSIER TABS: Spectrographic Assay, Provenance & Chain of Custody */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Spectrographic Assay Chemistry */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-white">
                  Spectrographic Assay Certificate
                </h3>
              </div>
              <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20">
                {lot.auditPartner}
              </span>
            </div>

            {/* Assay Chemistry Table */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
              <table className="w-full text-xs font-mono">
                <thead className="bg-[#0B0C10] text-white/50 uppercase border-b border-white/[0.06]">
                  <tr>
                    <th className="py-2.5 px-4 text-left">Element</th>
                    <th className="py-2.5 px-4 text-left">Chemical Symbol</th>
                    <th className="py-2.5 px-4 text-right">Assayed Concentration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {lot.assayBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-white">
                        {row.element}
                      </td>
                      <td className="py-3 px-4 text-[#D4AF37] font-mono">
                        {row.symbol}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#10B981]">
                        {row.percentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B0C10] border border-white/[0.05] flex items-center justify-between text-xs font-mono">
              <span className="text-white/50">Audit Docket Hash:</span>
              <span className="text-[#D4AF37] text-[11px] truncate max-w-[220px]">
                sha256:4a8b9...f81e29
              </span>
            </div>
          </div>

          {/* Geological Origin & Concession Provenance */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-white">
                  Concession Origin & Provenance
                </h3>
              </div>
              <span className="text-xs font-mono text-white/40">
                {lot.licenseNumber}
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              {lot.description}
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C10] border border-white/[0.04]">
                <span className="text-white/50">Concession GPS:</span>
                <span className="text-white font-semibold">{lot.concessionCoordinates}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C10] border border-white/[0.04]">
                <span className="text-white/50">Jurisdiction Concession:</span>
                <span className="text-white font-semibold">{lot.origin}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C10] border border-white/[0.04]">
                <span className="text-white/50">Bonded Vault Storage:</span>
                <span className="text-[#D4AF37] font-semibold">{lot.vaultLocation}</span>
              </div>
            </div>

            {/* Compliance Badges */}
            <div>
              <span className="text-[11px] font-mono text-white/40 block mb-2 uppercase">
                Regulatory Passcodes & Accreditations
              </span>
              <div className="flex flex-wrap gap-2">
                {lot.complianceBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/80 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STICKY BOTTOM FLOATING ACTION BAR FOR MOBILE / QUICK TRIGGER */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#0B0C10]/95 backdrop-blur-xl border-t border-white/[0.1] px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-[10px] font-mono text-white/40 uppercase block">
              Batch {lot.id}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-mono text-[#D4AF37]">
                {lot.price}
              </span>
              <span className="text-xs text-white/50 font-mono">
                ({lot.weight} @ {lot.purity})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAssayClick}
              className="flex-1 sm:flex-initial py-3 px-4 rounded-xl bg-[#14171F] hover:bg-white/[0.08] border border-white/[0.12] text-xs font-mono text-white/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Verify Assay</span>
            </button>

            <button
              onClick={handleRfqClick}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-black font-extrabold text-xs transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Submit Formal RFQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GUEST ACCESS GUARD MODAL (Unauthenticated Visitors)                    */}
      {/* ========================================================================= */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#14171F] border border-[#D4AF37]/30 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setShowGuestModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Emblem with Gold Ambient Glow */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)]">
                <Lock className="w-8 h-8" />
              </div>
            </div>

            {/* Content per exact requirements */}
            <div className="text-center space-y-2.5">
              <span className="text-[11px] font-mono text-[#D4AF37] tracking-widest uppercase font-semibold">
                INSTITUTIONAL ACCESS GATE
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Sign In to Access African Mineral Batches
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans pt-1">
                To maintain MEMD and OECD due-diligence standards, only verified institutional buyers can initiate tenders, inspect certificates, and negotiate directly with producers.
              </p>
            </div>

            {/* Security Badge Container */}
            <div className="p-3.5 rounded-2xl bg-[#0B0C10] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Anti-Intermediary Escrow</span>
              </span>
              <span className="text-[#10B981] font-bold">256-Bit Encrypted</span>
            </div>

            {/* Dual Action Buttons per requirements */}
            <div className="space-y-3">
              <Link
                href="/register"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-black font-extrabold text-sm transition-all shadow-[0_4px_25px_rgba(212,175,55,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Create Buyer Account</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="w-full py-3 px-6 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Institutional Sign In</span>
              </Link>
            </div>

            <p className="text-[11px] text-center text-white/40 font-mono">
              Accounts are vetted against national mineral dealer registers.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AUTHENTICATED BUYER RFQ BIDDING DRAWER / MODAL                         */}
      {/* ========================================================================= */}
      {showRfqDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#14171F] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setShowRfqDrawer(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FORMAL BIDDING TRANSMISSION</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Submit Formal RFQ Proposal
              </h3>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Target Batch: <span className="text-white">{lot.id}</span> ({lot.name} - {lot.grade})
              </p>
            </div>

            {/* Benchmark Valuation Reference */}
            <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">
                  Producer Asking Price
                </span>
                <span className="text-lg font-bold font-mono text-[#D4AF37]">
                  {lot.price}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/40 uppercase block">
                  Available Weight
                </span>
                <span className="text-sm font-bold font-mono text-white">
                  {lot.weight} ({lot.purity})
                </span>
              </div>
            </div>

            {/* RFQ Form */}
            <form onSubmit={handleSubmitRfq} className="space-y-5">
              {rfqError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{rfqError}</span>
                </div>
              )}

              {/* Proposed Unit Price & Desired Quantity */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    PROPOSED UNIT PRICE (USD PER {lot.unitLabel.toUpperCase()}) *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      step="any"
                      value={proposedUnitPrice}
                      onChange={(e) => setProposedUnitPrice(e.target.value)}
                      placeholder={lot.unitPriceUSD.toString()}
                      className="w-full h-12 pl-9 pr-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    DESIRED QUANTITY ({lot.unitLabel.toUpperCase()}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={desiredQuantity}
                    onChange={(e) => setDesiredQuantity(e.target.value)}
                    placeholder={lot.weightNumeric.toString()}
                    className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Incoterms Preference & Destination Port */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    INCOTERMS PREFERENCE *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["CIF", "FOB", "EXW"] as const).map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setIncotermsPref(mode)}
                        className={`h-12 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                          incotermsPref === mode
                            ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                            : "bg-[#0B0C10] border-white/[0.08] text-white/60 hover:text-white"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    {incotermsPref === "CIF"
                      ? "DESTINATION DISCHARGE PORT *"
                      : "ORIGIN DISPATCH HUB"}
                  </label>
                  <input
                    type="text"
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    placeholder="e.g. CIF Rotterdam / CIF Dubai"
                    className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Commercial Specs / Custom Requirements */}
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  COMMERCIAL SPECIFICATIONS & CONDITIONS
                </label>
                <textarea
                  rows={3}
                  value={commercialSpecs}
                  onChange={(e) => setCommercialSpecs(e.target.value)}
                  placeholder="Specify secondary assay preferences (SGS / Alex Stewart), preferred letter of credit (L/C) issuing bank, packing requirements, or delivery schedule..."
                  className="w-full p-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-sans transition-colors resize-none"
                />
              </div>

              {/* Dynamic Calculation Callout */}
              <div className="p-4 rounded-2xl bg-[#0B0C10] border border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    Calculated Bid Valuation (USD)
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-[#D4AF37]">
                    ${unitCalcTotal.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1 justify-end">
                    <Lock className="w-3 h-3" /> Tier-1 Escrow Guarded
                  </span>
                  <span className="text-[11px] text-white/50 font-mono">
                    Stanbic / Absa Custody
                  </span>
                </div>
              </div>

              {/* Transmit Action */}
              <button
                type="submit"
                disabled={rfqSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-black font-extrabold text-sm transition-all shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {rfqSubmitting ? (
                  <div className="flex items-center gap-2 font-mono">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Proposal to Producer...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-black" />
                    <span>Transmit Formal RFQ & Open Negotiation Room</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ASSAY VERIFICATION CERTIFICATE MODAL                                   */}
      {/* ========================================================================= */}
      {showAssayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#14171F] border border-white/[0.12] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-6">
            <button
              onClick={() => setShowAssayModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#10B981] font-bold uppercase tracking-wider block">
                  INDEPENDENT AUDIT VERIFIED
                </span>
                <h3 className="text-xl font-bold text-white">
                  Cryptographic Assay Dossier
                </h3>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C10] border border-white/[0.04]">
                <span className="text-white/50">Assay Certificate ID:</span>
                <span className="text-[#D4AF37] font-bold">{lot.assayNo}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C10] border border-white/[0.04]">
                <span className="text-white/50">Accredited Laboratory:</span>
                <span className="text-white font-medium">{lot.auditPartner}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C10] border border-white/[0.04]">
                <span className="text-white/50">Testing Methodology:</span>
                <span className="text-white font-medium">ICP-OES / Fire Assay Spectrometry</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C10] border border-white/[0.04]">
                <span className="text-white/50">Chain of Custody Seal:</span>
                <span className="text-[#10B981] font-bold">TAMPER-SEAL #MEMD-9812-OK</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] space-y-2">
              <span className="text-xs font-bold text-white block">
                Official Certification Summary
              </span>
              <p className="text-xs text-white/60 font-sans leading-relaxed">
                This mineral lot was sampled under sovereign custody at the {lot.vaultLocation}. Certified chemical composition conforms to international offtake standards with full provenance tracing to {lot.origin}.
              </p>
            </div>

            <button
              onClick={() => {
                alert(`Official Cryptographic Assay Docket for ${lot.assayNo} has been requested and queued for secure download.`);
                setShowAssayModal(false);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-extrabold text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Verified Cryptographic PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
