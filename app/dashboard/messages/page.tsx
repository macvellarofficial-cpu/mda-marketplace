"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Search,
  ChevronRight,
  Gem,
  Building2,
} from "lucide-react";

interface NegotiationThread {
  id: string;
  lotId: string;
  commodity: string;
  counterparty: string;
  counterpartyRole: string;
  counterpartyCountry: string;
  agreedPrice: string;
  weight: string;
  status: "In Negotiation" | "Escrow Initiated" | "Assay Review";
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const INITIAL_THREADS: NegotiationThread[] = [
  {
    id: "neg-8821",
    lotId: "MDA-GLD-019",
    commodity: "Gold Doré Bars (94.5% Au)",
    counterparty: "Emirates Sovereign Bullion DMCC",
    counterpartyRole: "Institutional Refinery",
    counterpartyCountry: "United Arab Emirates",
    agreedPrice: "$13,650,000",
    weight: "185.00 kg",
    status: "In Negotiation",
    lastMessage: "We have reviewed the SGS assay report. Can you confirm FOB Entebbe or CIF Dubai?",
    timestamp: "10 mins ago",
    unreadCount: 2,
  },
  {
    id: "neg-4412",
    lotId: "MDA-CPR-441",
    commodity: "Copper Cathodes Grade A (99.99%)",
    counterparty: "Glencore Commodities AG",
    counterpartyRole: "Industrial Offtake Buyer",
    counterpartyCountry: "Switzerland",
    agreedPrice: "$19,700,000",
    weight: "2,000.00 MT",
    status: "Escrow Initiated",
    lastMessage: "Bilateral escrow deposit of 10% has been confirmed in custody. Proceeding with Alex Stewart inspector.",
    timestamp: "1 hour ago",
    unreadCount: 0,
  },
  {
    id: "neg-9023",
    lotId: "MDA-LIT-808",
    commodity: "Spodumene Lithium Ore (SC6)",
    counterparty: "Contemporary Amperex Technologies",
    counterpartyRole: "Battery Chemical Manufacturer",
    counterpartyCountry: "China",
    agreedPrice: "$6,370,000",
    weight: "6,500.00 MT",
    status: "Assay Review",
    lastMessage: "Kindly share the secondary spectrographic XRF data for Li2O percentage.",
    timestamp: "Yesterday",
    unreadCount: 0,
  },
];

export default function MessagesInboxPage() {
  const [threads, setThreads] = useState<NegotiationThread[]>(INITIAL_THREADS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cached = sessionStorage.getItem("mda_custom_threads");
    if (cached) {
      try {
        const customThreads = JSON.parse(cached);
        if (Array.isArray(customThreads) && customThreads.length > 0) {
          setThreads([...customThreads, ...INITIAL_THREADS]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const filteredThreads = threads.filter(
    (t) =>
      t.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lotId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] py-8 px-4 sm:px-8 relative">
      {/* Ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08] relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#10B981]" />
          <span className="text-[11px] font-mono text-white/70">
            ENCRYPTED BILATERAL ROOMS
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto my-8 relative z-10">
        {/* Policy Guard Banner */}
        <div className="p-4 rounded-2xl bg-[#14171F] border border-[#D4AF37]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="font-bold text-white block">
                Institutional Security Policy
              </span>
              <p className="text-white/60 text-[11px]">
                Never exchange off-platform contact details (WhatsApp, phone numbers). All trades negotiated on MDA are protected by Bilateral Escrow.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20 whitespace-nowrap">
            ANTI-LEAK ACTIVE
          </span>
        </div>

        {/* Inbox List Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
                Protected Negotiation Rooms
              </h1>
              <p className="text-xs text-white/50 mt-1">
                Direct encrypted negotiation channels between verified concession sellers and institutional offtake buyers.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by counterparty or lot..."
                className="w-full h-10 pl-9 pr-3 bg-[#0B0C10] border border-white/[0.08] text-xs text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-3">
            {filteredThreads.map((thread) => (
              <Link
                key={thread.id}
                href={`/dashboard/messages/${thread.id}`}
                className="p-5 rounded-2xl bg-[#0B0C10] border border-white/[0.06] hover:border-[#D4AF37]/50 transition-all duration-200 block group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#14171F] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#D4AF37]/30 transition-colors">
                      <Gem className="w-5 h-5 text-[#D4AF37]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white font-mono">
                          {thread.lotId}
                        </span>
                        <span className="text-xs text-white/40">·</span>
                        <span className="text-xs font-semibold text-white">
                          {thread.commodity}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          ({thread.weight})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-white/60 mb-2 font-mono">
                        <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-white/90">{thread.counterparty}</span>
                        <span className="text-white/30">|</span>
                        <span className="text-white/50">{thread.counterpartyRole}</span>
                        <span className="text-white/30">|</span>
                        <span className="text-[#D4AF37]">{thread.counterpartyCountry}</span>
                      </div>

                      <p className="text-xs text-white/50 line-clamp-1 group-hover:text-white/70 transition-colors">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </div>

                  {/* Right Price & Status */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.04] flex-shrink-0">
                    <span className="text-base font-extrabold font-mono text-white block">
                      {thread.agreedPrice}
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          thread.status === "Escrow Initiated"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                            : "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
                        }`}
                      >
                        {thread.status}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        {thread.timestamp}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
