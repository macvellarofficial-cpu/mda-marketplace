"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Zap,
  MapPin,
  Building2,
  Phone,
  Mail,
  Globe,
  FileText,
  ArrowUpRight,
  PlusCircle,
  Truck,
  ShieldCheck,
  X,
  Send,
  Download,
} from "lucide-react";
import {
  EquipmentItem,
  DEFAULT_EQUIPMENT_ITEMS,
} from "@/data/equipmentData";
import { createClient } from "@/utils/supabase/client";

export default function EquipmentCatalogSection() {
  const [equipmentList, setEquipmentList] =
    useState<EquipmentItem[]>(DEFAULT_EQUIPMENT_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMachineForRfq, setSelectedMachineForRfq] =
    useState<EquipmentItem | null>(null);
  const [rfqSuccess, setRfqSuccess] = useState<boolean>(false);
  const [rfqSubmitting, setRfqSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for RFQ
  const [rfqForm, setRfqForm] = useState({
    buyerName: "",
    buyerOrg: "",
    buyerEmail: "",
    buyerPhone: "",
    concessionCountry: "Uganda",
    termType: "Outright Purchase",
    deliveryPort: "FOB Durban / CIF Dar es Salaam",
    notes: "",
  });

  // Load custom equipment from session and Supabase
  useEffect(() => {
    const loadEquipment = async () => {
      let combined = [...DEFAULT_EQUIPMENT_ITEMS];

      // 1. Session storage
      try {
        const cached = sessionStorage.getItem("mda_custom_equipment");
        if (cached) {
          const parsed: EquipmentItem[] = JSON.parse(cached);
          combined = [...parsed, ...combined];
        }
      } catch (err) {
        console.warn("Notice loading local equipment cache:", err);
      }

      // 2. Supabase if reachable
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("mining_equipment")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mappedFromDb: EquipmentItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            manufacturer: item.manufacturer,
            machineType: item.machine_type || item.machineType,
            category: item.category,
            capacity: item.capacity,
            capacityTPH: item.capacity_tph,
            powerRequirement: item.power_requirement || item.powerRequirement,
            deliveryIncoterms: item.delivery_incoterms || item.deliveryIncoterms,
            leadTime: item.lead_time || item.leadTime,
            priceUSD: item.price_usd || item.priceUSD,
            status: item.status || "In Stock",
            location: item.location,
            headquarters: item.headquarters,
            contactPhone: item.contact_phone || item.contactPhone,
            contactEmail: item.contact_email || item.contactEmail,
            website: item.website,
            photoUrl: item.photo_url || item.photoUrl,
            specSheetFileName:
              item.spec_sheet_file_name || item.specSheetFileName,
          }));

          // Avoid duplicates by ID
          const existingIds = new Set(combined.map((c) => c.id));
          const uniqueNew = mappedFromDb.filter((d) => !existingIds.has(d.id));
          combined = [...uniqueNew, ...combined];
        }
      } catch (err) {
        // Fallback silently
      }

      setEquipmentList(combined);
    };

    loadEquipment();
  }, []);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownloadSpec = (item: EquipmentItem) => {
    triggerToast(
      `Downloading verified technical dossier: ${item.specSheetFileName || `${item.id}_spec.pdf`}`
    );
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachineForRfq) return;
    setRfqSubmitting(true);

    try {
      const newInquiry = {
        id: `INQ-${Date.now().toString().slice(-4)}`,
        machinery: selectedMachineForRfq.name,
        minerCooperative:
          rfqForm.buyerOrg || rfqForm.buyerName || "Institutional Operator",
        concessionCountry: rfqForm.concessionCountry,
        termType: rfqForm.termType,
        requestedDelivery: rfqForm.deliveryPort,
        offeredBudget: selectedMachineForRfq.priceUSD,
        status: "Pending Quotation",
        timestamp: "Just now",
        contactEmail: rfqForm.buyerEmail,
        contactPhone: rfqForm.buyerPhone,
      };

      const existingInquiries = JSON.parse(
        sessionStorage.getItem("mda_equipment_inquiries") || "[]"
      );
      existingInquiries.unshift(newInquiry);
      sessionStorage.setItem(
        "mda_equipment_inquiries",
        JSON.stringify(existingInquiries)
      );

      setRfqSuccess(true);
      setTimeout(() => {
        setRfqSuccess(false);
        setSelectedMachineForRfq(null);
        triggerToast("Official Machinery RFQ submitted to manufacturer desk.");
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setRfqSubmitting(false);
    }
  };

  // Filter categories
  const categories = [
    { id: "all", label: "All Machinery" },
    { id: "haul", label: "Haul Trucks" },
    { id: "excavator", label: "Super Shovels" },
    { id: "loader", label: "Underground LHD" },
    { id: "drill", label: "Blast Hole Rigs" },
    { id: "crusher", label: "Cone Crushers" },
  ];

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesCat =
      selectedCategory === "all" ||
      (selectedCategory === "haul" &&
        (item.machineType.toLowerCase().includes("haul") ||
          item.category?.toLowerCase().includes("haul"))) ||
      (selectedCategory === "excavator" &&
        (item.machineType.toLowerCase().includes("excavator") ||
          item.machineType.toLowerCase().includes("shovel") ||
          item.category?.toLowerCase().includes("shovel"))) ||
      (selectedCategory === "loader" &&
        (item.machineType.toLowerCase().includes("loader") ||
          item.category?.toLowerCase().includes("loader") ||
          item.name.toLowerCase().includes("lhd"))) ||
      (selectedCategory === "drill" &&
        (item.machineType.toLowerCase().includes("drill") ||
          item.category?.toLowerCase().includes("drill"))) ||
      (selectedCategory === "crusher" &&
        (item.machineType.toLowerCase().includes("crush") ||
          item.category?.toLowerCase().includes("crush")));

    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.manufacturer &&
        item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location &&
        item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.capacity &&
        item.capacity.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesQuery;
  });

  return (
    <section id="equipment" className="px-6 lg:px-8 py-20 max-w-7xl mx-auto relative">
      {/* Floating Action Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10B981] text-black font-mono text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] mb-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="font-semibold tracking-wider uppercase">
              LIVE REGIONAL MACHINERY CATALOGUE
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Heavy Mining Equipment & Extraction Plants
          </h2>
          <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
            Direct procurement from factory-authorized manufacturers (Caterpillar, Komatsu, Sandvik, Epiroc, Metso) with OEM warranties, regional parts support, and bonded African depot delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/equipment/new"
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Machinery</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl bg-[#14171F] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 font-mono text-xs transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Equipment Portal</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-[#14171F] border border-white/[0.08] p-4 sm:p-5 mb-8 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search machinery by model, OEM (CAT, Komatsu, Sandvik, Epiroc, Metso), depot, or capacity..."
              className="w-full h-11 bg-[#0B0C10] border border-white/[0.08] text-sm text-white placeholder-white/40 rounded-xl pl-11 pr-4 focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
            />
          </div>

          {/* Quick Count Badge */}
          <div className="h-11 px-4 bg-[#0B0C10] border border-white/[0.08] rounded-xl flex items-center justify-center font-mono text-xs text-[#10B981] whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#10B981] mr-2" />
            <span>{filteredEquipment.length} Machines Listed</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  : "bg-[#0B0C10] text-white/60 hover:text-white border border-white/[0.06]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#14171F] border border-white/[0.06] text-white/50 space-y-3 font-mono text-xs">
          <Wrench className="w-10 h-10 mx-auto text-white/30" />
          <p>No machinery matching "{searchQuery}" in this category.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-[#D4AF37] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((eqp) => (
            <div
              key={eqp.id}
              className="rounded-3xl bg-[#14171F] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl"
            >
              <div>
                {/* Media Container */}
                <div className="relative w-full h-48 bg-black overflow-hidden">
                  <Image
                    src={
                      eqp.photoUrl ||
                      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={eqp.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-transparent to-black/60 pointer-events-none" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[#D4AF37] border border-[#D4AF37]/30 font-semibold shadow-sm">
                      {eqp.machineType}
                    </span>
                    <span className="bg-[#10B981]/20 backdrop-blur-md text-[#10B981] border border-[#10B981]/40 px-2.5 py-1 rounded-full font-bold">
                      ● {eqp.status}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-white/70">
                    Ref ID: <span className="text-white font-bold">{eqp.id}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-4 text-xs font-mono">
                  <div>
                    {eqp.manufacturer && (
                      <span className="inline-block text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/25 font-bold mb-1.5">
                        {eqp.manufacturer}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white font-sans leading-snug">
                      {eqp.name}
                    </h3>
                  </div>

                  {/* Technical Specs Card */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-[#0B0C10] border border-white/[0.05]">
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#D4AF37]" /> Capacity:
                      </span>
                      <span className="text-white font-bold truncate max-w-[170px]">
                        {eqp.capacity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Power:
                      </span>
                      <span className="text-white/80 truncate max-w-[170px]">
                        {eqp.powerRequirement}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.05]">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#10B981]" /> Incoterms:
                      </span>
                      <span className="text-[#10B981] font-semibold truncate max-w-[170px]">
                        {eqp.deliveryIncoterms}
                      </span>
                    </div>

                    {eqp.location && (
                      <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.05]">
                        <span className="text-white/40 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" /> Depot:
                        </span>
                        <span className="text-white/80 truncate max-w-[170px]">
                          {eqp.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Manufacturer Contacts Box */}
                  {(eqp.contactPhone || eqp.contactEmail || eqp.website) && (
                    <div className="p-3 rounded-xl bg-[#14171F]/80 border border-white/[0.06] space-y-1.5 text-[11px]">
                      <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Manufacturer Direct Desk
                      </div>

                      {eqp.contactPhone && (
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#10B981]" /> Phone:
                          </span>
                          <a
                            href={`tel:${eqp.contactPhone}`}
                            className="text-[#10B981] hover:underline font-mono"
                          >
                            {eqp.contactPhone}
                          </a>
                        </div>
                      )}

                      {eqp.contactEmail && (
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-cyan-400" /> Email:
                          </span>
                          <a
                            href={`mailto:${eqp.contactEmail}`}
                            className="text-cyan-300 hover:underline truncate max-w-[150px] font-mono"
                          >
                            {eqp.contactEmail}
                          </a>
                        </div>
                      )}

                      {eqp.website && (
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-indigo-400" /> Portal:
                          </span>
                          <a
                            href={eqp.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-300 hover:underline truncate max-w-[150px] font-mono flex items-center gap-0.5"
                          >
                            <span>{eqp.website.replace("https://", "")}</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 pt-3 border-t border-white/[0.08] bg-[#0B0C10]/60 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[9px] text-white/40 block uppercase tracking-wider font-mono">
                      Indicative FOB / CIF Price
                    </span>
                    <span className="text-lg font-black text-[#D4AF37] font-mono">
                      {eqp.priceUSD}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/50 font-mono">
                    {eqp.leadTime}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedMachineForRfq(eqp);
                      setRfqForm((prev) => ({
                        ...prev,
                        deliveryPort: eqp.deliveryIncoterms,
                      }));
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Send className="w-3 h-3" />
                    <span>Request RFQ</span>
                  </button>

                  <button
                    onClick={() => handleDownloadSpec(eqp)}
                    className="py-2.5 px-3 rounded-xl bg-[#14171F] hover:bg-white/[0.06] border border-white/[0.08] text-white/80 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3 text-[#10B981]" />
                    <span>Spec Sheet</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RFQ Quotation Modal */}
      {selectedMachineForRfq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#14171F] border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedMachineForRfq(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.04] text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {rfqSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center mx-auto text-[#10B981]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Machinery RFQ Transmitted!
                </h3>
                <p className="text-xs text-white/60 font-mono max-w-sm mx-auto">
                  Your formal request for {selectedMachineForRfq.name} has been routed to the verified manufacturer desk and regional logistics hub.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                    FORMAL MACHINERY QUOTATION INQUIRY
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                    {selectedMachineForRfq.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-white/50 mt-1">
                    <span>OEM: {selectedMachineForRfq.manufacturer}</span>
                    <span>•</span>
                    <span className="text-[#D4AF37] font-bold">
                      {selectedMachineForRfq.priceUSD}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1">
                      REPRESENTATIVE NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean-Luc Mugisha"
                      value={rfqForm.buyerName}
                      onChange={(e) =>
                        setRfqForm({ ...rfqForm, buyerName: e.target.value })
                      }
                      className="w-full h-10 bg-[#0B0C10] border border-white/[0.08] text-white text-xs rounded-xl px-3 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1">
                      MINING COOPERATIVE / COMPANY
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Great Lakes Mining Corp"
                      value={rfqForm.buyerOrg}
                      onChange={(e) =>
                        setRfqForm({ ...rfqForm, buyerOrg: e.target.value })
                      }
                      className="w-full h-10 bg-[#0B0C10] border border-white/[0.08] text-white text-xs rounded-xl px-3 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1">
                      WORK EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="trader@company.com"
                      value={rfqForm.buyerEmail}
                      onChange={(e) =>
                        setRfqForm({ ...rfqForm, buyerEmail: e.target.value })
                      }
                      className="w-full h-10 bg-[#0B0C10] border border-white/[0.08] text-white text-xs rounded-xl px-3 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1">
                      PHONE / WHATSAPP
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+256 700 000 000"
                      value={rfqForm.buyerPhone}
                      onChange={(e) =>
                        setRfqForm({ ...rfqForm, buyerPhone: e.target.value })
                      }
                      className="w-full h-10 bg-[#0B0C10] border border-white/[0.08] text-white text-xs rounded-xl px-3 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1">
                      CONCESSION COUNTRY
                    </label>
                    <select
                      value={rfqForm.concessionCountry}
                      onChange={(e) =>
                        setRfqForm({
                          ...rfqForm,
                          concessionCountry: e.target.value,
                        })
                      }
                      className="w-full h-10 bg-[#0B0C10] border border-white/[0.08] text-white text-xs rounded-xl px-3 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Uganda">Uganda (Albertine / Buhweju)</option>
                      <option value="DRC">DR Congo (Katanga / Kivu)</option>
                      <option value="Zambia">Zambia (Copperbelt)</option>
                      <option value="Tanzania">Tanzania (Geita / Merelani)</option>
                      <option value="Zimbabwe">Zimbabwe (Great Dyke)</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Botswana">Botswana</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1">
                      PROCUREMENT TERMS
                    </label>
                    <select
                      value={rfqForm.termType}
                      onChange={(e) =>
                        setRfqForm({ ...rfqForm, termType: e.target.value })
                      }
                      className="w-full h-10 bg-[#0B0C10] border border-white/[0.08] text-white text-xs rounded-xl px-3 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Outright Purchase">Outright Purchase</option>
                      <option value="Hire Purchase / Lease">
                        Hire Purchase / Lease
                      </option>
                      <option value="Offtake Offset">
                        Offtake Mineral Barter / Offset
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-white/50 block mb-1">
                    DELIVERY PORT / INCOTERMS PREFERENCE
                  </label>
                  <input
                    type="text"
                    value={rfqForm.deliveryPort}
                    onChange={(e) =>
                      setRfqForm({ ...rfqForm, deliveryPort: e.target.value })
                    }
                    className="w-full h-10 bg-[#0B0C10] border border-white/[0.08] text-white text-xs rounded-xl px-3 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={rfqSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {rfqSubmitting
                        ? "Transmitting Request..."
                        : "Submit Certified RFQ to Manufacturer"}
                    </span>
                  </button>
                  <p className="text-[10px] text-white/40 text-center mt-2 font-mono">
                    Protected by MDA Escrow & Accredited OEM Distributor Agreement
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
