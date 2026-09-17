"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Send,
  AlertTriangle,
  Gem,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface MessageItem {
  id: string;
  senderName: string;
  senderRole: "buyer" | "supplier" | "system";
  text: string;
  timestamp: string;
  isEscrowProposal?: boolean;
}

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: "msg-1",
    senderName: "Emirates Sovereign Bullion DMCC",
    senderRole: "buyer",
    text: "Greetings. We reviewed the SGS spectrographic assay certificate (94.5% Au) for lot MDA-GLD-019. We are prepared to execute an LOI for the full 185.00 kg allocation.",
    timestamp: "10:14 AM",
  },
  {
    id: "msg-2",
    senderName: "You (Albertine Sovereign Minerals)",
    senderRole: "supplier",
    text: "Thank you. The lot is secured in Entebbe Bonded Bullion Vault under MEMD seal #UG-2026-GLD-019. Indicative valuation is set at $13,650,000 based on the LBMA morning fix.",
    timestamp: "10:18 AM",
  },
  {
    id: "msg-3",
    senderName: "Emirates Sovereign Bullion DMCC",
    senderRole: "buyer",
    text: "Terms are acceptable under FOB Entebbe. If you initiate bilateral escrow, our treasury will fund the 10% custody lock deposit immediately.",
    timestamp: "10:25 AM",
  },
];

export default function NegotiationRoomPage() {
  const params = useParams();
  const threadId = (params?.id as string) || "neg-8821";

  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [currentUser, setCurrentUser] = useState<{
    fullName?: string;
    companyName?: string;
    role?: string;
  } | null>(null);
  const [inputText, setInputText] = useState("");
  const [leakWarning, setLeakWarning] = useState<string | null>(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowLocked, setEscrowLocked] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load custom messages for this thread if created from RFQ
  useEffect(() => {
    const cachedUser = sessionStorage.getItem("mda_user");
    if (cachedUser) {
      try {
        setCurrentUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const cached = sessionStorage.getItem(`mda_thread_${threadId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [threadId]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Client-side Contact Leak Filter
  const checkContactLeak = (text: string): boolean => {
    // 1. Phone number pattern (7+ digits, phone prefix, dashes or spaces)
    const phoneRegex = /(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{0,4}/;
    // Matches 7 or more consecutive or spaced digits
    const consecutiveDigitsRegex = /\b\d[\d\s-]{6,}\d\b/;

    // 2. Off-platform contact keywords
    const keywordRegex = /\b(whatsapp|telegram|signal|wechat|phone number|call me|reach me at|text me|my number is|mobile number)\b/i;

    if (keywordRegex.test(text)) {
      setLeakWarning(
        "Off-Platform Leak Detected: Mentioning 'WhatsApp', 'Telegram', or off-platform channels is strictly prohibited. All discussions must remain in this encrypted room to preserve Bilateral Escrow protection."
      );
      return true;
    }

    if (
      (phoneRegex.test(text) || consecutiveDigitsRegex.test(text)) &&
      text.replace(/\D/g, "").length >= 7
    ) {
      setLeakWarning(
        "Phone Number Detected: Direct phone numbers cannot be transmitted. All communication is recorded and insured under the MDA Escrow Charter."
      );
      return true;
    }

    setLeakWarning(null);
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    checkContactLeak(val);
  };

  // Supabase Realtime Hookup
  useEffect(() => {
    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`negotiation_${threadId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `thread_id=eq.${threadId}`,
          },
          (payload) => {
            const newRecord = payload.new as {
              id?: string;
              text?: string;
              sender_name?: string;
              sender_role?: "buyer" | "supplier" | "system";
            };
            if (newRecord && typeof newRecord.text === "string") {
              const incomingText: string = newRecord.text;
              setMessages((prev) => [
                ...prev,
                {
                  id: newRecord.id || `msg-${Date.now()}`,
                  senderName: newRecord.sender_name || "Counterparty",
                  senderRole: newRecord.sender_role || "buyer",
                  text: incomingText,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn("Realtime subscription note:", err);
    }
  }, [threadId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (checkContactLeak(inputText)) {
      return;
    }

    const newMessageText = inputText.trim();
    setInputText("");
    setLeakWarning(null);

    const isBuyer = currentUser?.role?.toLowerCase().includes("buyer") ?? false;
    const senderRole: "buyer" | "supplier" = isBuyer ? "buyer" : "supplier";
    const senderName = currentUser?.companyName || currentUser?.fullName || (isBuyer ? "You (Buyer)" : "You (Albertine Sovereign Minerals)");

    const optimisticMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      senderName,
      senderRole,
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => {
      const updated = [...prev, optimisticMsg];
      sessionStorage.setItem(`mda_thread_${threadId}`, JSON.stringify(updated));
      return updated;
    });

    try {
      setSending(true);
      const supabase = createClient();
      await supabase.from("messages").insert({
        thread_id: threadId,
        text: newMessageText,
        sender_name: senderName,
        sender_role: senderRole,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Message dispatch notice:", err);
    } finally {
      setSending(false);
    }
  };

  const handleInitiateEscrow = () => {
    setShowEscrowModal(false);
    setEscrowLocked(true);

    const escrowMsg: MessageItem = {
      id: `escrow-${Date.now()}`,
      senderName: "MDA Sovereign Escrow Gateway",
      senderRole: "system",
      text: "BILATERAL ESCROW INITIATED: Terms finalized for Lot MDA-GLD-019 (185.00 kg Gold Doré, 94.5% Au). Valuation of $13,650,000 locked under Entebbe Bonded Vault Custody. Counterparty treasury has 24 hours to fulfill collateral deposit.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isEscrowProposal: true,
    };

    setMessages((prev) => [...prev, escrowMsg]);
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] py-6 px-4 sm:px-8 flex flex-col justify-between relative">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
        <Link
          href="/dashboard/messages"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Negotiations Inbox
        </Link>

        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-mono text-white/80">
            ROOM #{threadId} · 256-BIT ENCRYPTED
          </span>
        </div>
      </header>

      {/* Main Negotiation Container */}
      <main className="max-w-5xl w-full mx-auto my-4 flex-1 flex flex-col justify-between relative z-10">
        {/* 1. Policy Guard Banner */}
        <div className="p-3.5 rounded-2xl bg-[#14171F] border border-[#D4AF37]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <p className="text-white/80 text-[11px] leading-relaxed">
              <span className="font-bold text-[#D4AF37]">
                Institutional Security Notice:
              </span>{" "}
              Never exchange off-platform contact details (WhatsApp, phone numbers). All trades negotiated on MDA are protected by Bilateral Escrow.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20 whitespace-nowrap">
            POLICY GUARD ACTIVE
          </span>
        </div>

        {/* 2. Lot Specification & Escrow Action Bar */}
        <div className="p-4 rounded-2xl bg-[#14171F] border border-white/[0.08] mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B0C10] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
              <Gem className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono">
                  MDA-GLD-019
                </span>
                <span className="text-xs text-white">
                  Gold Doré Bars (94.5% Au)
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                  185.00 kg
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">
                Counterparty: Emirates Sovereign Bullion DMCC · Entebbe Bonded Vault
              </p>
            </div>
          </div>

          {/* Escrow Trigger Action */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-white/40 block font-mono">
                AGREED VALUATION
              </span>
              <span className="text-base font-bold font-mono text-white">
                $13,650,000 USD
              </span>
            </div>

            {escrowLocked ? (
              <span className="px-4 py-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-mono font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Escrow Locked & Funded
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowEscrowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-1.5 active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Finalize Terms & Initiate Bilateral Escrow</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Messages Chat History Window */}
        <div className="flex-1 min-h-[380px] max-h-[460px] overflow-y-auto p-4 sm:p-6 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderRole === "supplier";
            const isSystem = msg.senderRole === "system";

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-[#0B0C10] border border-[#10B981]/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] my-4 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 text-[#10B981] font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{msg.senderName}</span>
                    <span className="text-[10px] text-white/40 ml-auto font-normal">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-white/90 leading-relaxed">{msg.text}</p>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-white/40">
                  <span>{msg.senderName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-white rounded-br-none"
                      : "bg-[#0B0C10] border border-white/[0.08] text-white/90 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 4. Contact Leak Warning Banner (if triggered) */}
        {leakWarning && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono mt-3 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Contact Leak Intercepted:</span>
              <span>{leakWarning}</span>
            </div>
            <button
              onClick={() => setLeakWarning(null)}
              className="text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5. Input Bar with Real-time Regex Filter */}
        <form
          onSubmit={handleSendMessage}
          className="mt-3 flex items-center gap-2 p-2 rounded-2xl bg-[#14171F] border border-white/[0.08]"
        >
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your official negotiation response (contact numbers are protected)..."
            className="flex-1 h-11 px-4 bg-[#0B0C10] border border-white/[0.06] text-xs text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || !!leakWarning || sending}
            className="h-11 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </main>

      {/* Escrow Confirmation Modal */}
      {showEscrowModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#14171F] border border-[#D4AF37]/40 shadow-[0_8px_40px_rgba(0,0,0,0.9)] relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowEscrowModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Initiate Bilateral Escrow
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  MULTILATERAL CUSTODY CONTRACT PROTOCOL
                </p>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.06] mb-6 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-white/40">LOT NUMBER:</span>
                <span className="text-white font-bold">MDA-GLD-019</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-white/40">COMMODITY & GRADE:</span>
                <span className="text-white font-semibold">
                  Gold Doré Bars (94.5% Au)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-white/40">CERTIFIED WEIGHT:</span>
                <span className="text-white font-semibold">185.00 kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-white/40">TOTAL CONSIDERATION:</span>
                <span className="text-[#D4AF37] font-bold text-sm">
                  $13,650,000 USD
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/40">CUSTODY VAULT:</span>
                <span className="text-[#10B981] font-semibold">
                  Entebbe Bonded Bullion Vault
                </span>
              </div>
            </div>

            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              By confirming, you execute binding escrow terms. Physical assay verification by Alex Stewart or SGS must match the registered certificate before final fund clearance to seller.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEscrowModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 text-xs font-mono transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleInitiateEscrow}
                className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm Escrow Lock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
