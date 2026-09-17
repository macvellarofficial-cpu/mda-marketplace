"use client";

import React, { useState } from "react";
import Link from "next/link";
import NavbarLogo from "@/components/NavbarLogo";
import {
  Mail,
  Globe,
  MapPin,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
} from "lucide-react";
import GlobalFooter, { SOCIAL_LINKS } from "@/components/GlobalFooter";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("Uganda");
  const [inquiryType, setInquiryType] = useState<
    | "Mineral Sourcing"
    | "Laboratory Assay Coordination"
    | "Export Facilitation"
    | "Mining Equipment"
    | "General Partnership"
  >("Mineral Sourcing");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !workEmail.trim() || !companyName.trim() || !message.trim()) {
      setErrorMessage("Please complete all mandatory institutional contact fields.");
      return;
    }

    setSubmitting(true);

    // Simulate submission / store inquiry in session storage
    setTimeout(() => {
      try {
        const existing = JSON.parse(sessionStorage.getItem("mda_inquiries") || "[]");
        existing.unshift({
          fullName: fullName.trim(),
          workEmail: workEmail.trim(),
          companyName: companyName.trim(),
          country,
          inquiryType,
          message: message.trim(),
          timestamp: new Date().toISOString(),
        });
        sessionStorage.setItem("mda_inquiries", JSON.stringify(existing));
      } catch (err) {
        console.warn("Storage note:", err);
      }

      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0C10]/85 border-b border-white/[0.08] px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <NavbarLogo />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/marketplace"
              className="text-xs font-mono text-white/70 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-mono text-white/80 hover:text-white px-3.5 py-2 rounded-xl bg-[#14171F] border border-white/[0.08]"
            >
              Portal →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-12 sm:py-16 relative z-10 flex-1">
        {/* Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D4AF37]/10 blur-[140px] pointer-events-none rounded-full" />

        {/* Back Link & Header Title */}
        <div className="mb-10 space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14171F] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            DIRECT INSTITUTIONAL DESK
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Corporate & Institutional Inquiries
          </h1>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            Direct communication channel for sovereign mining ministries, international refineries, accredited geochemical assayers, and institutional mineral buyers.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Official Channels, Social Media, and Compliance Banner       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] space-y-6">
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">
                COMMUNICATION CHANNELS
              </span>

              {/* Official Credentials */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-2 text-white/40 uppercase text-[10px]">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Company Email</span>
                  </div>
                  <a
                    href="mailto:info@mineraldealersafrica.com"
                    className="text-sm font-bold text-white hover:text-[#D4AF37] transition-colors block"
                  >
                    info@mineraldealersafrica.com
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-2 text-white/40 uppercase text-[10px]">
                    <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Official Domain</span>
                  </div>
                  <a
                    href="https://mineraldealersafrica.com/"
                    className="text-sm font-bold text-white hover:text-[#D4AF37] transition-colors block"
                  >
                    https://mineraldealersafrica.com/
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B0C10] border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-2 text-white/40 uppercase text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Corporate Headquarters</span>
                  </div>
                  <p className="text-sm font-medium text-white/90">
                    Kampala, Uganda (East & Central Africa Operations)
                  </p>
                </div>
              </div>

              {/* Official Social Media Buttons */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-white/60 block">
                  Official Social Media Channels:
                </span>
                <div className="flex items-center gap-3">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] transition flex items-center justify-center text-white/80"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Reassurance Banner (Mandatory Text) */}
            <div className="p-6 rounded-3xl bg-[#14171F] border border-[#D4AF37]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-3 relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
                    Institutional Governance Standard
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed font-sans font-medium">
                    &ldquo;All commercial transactions and trade inquiries are executed strictly within the secure MDA platform under sovereign due diligence standards.&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-[11px] text-white/50 font-mono flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Zero phone solicitation · Enforced Bilateral Escrow</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Institutional Contact Form                                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-xs text-white/70 font-sans max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Mineral Dealers Africa. Your formal institutional inquiry has been routed to our corporate trade desk in Kampala. A compliance officer will follow up within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white/80 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold mb-1">
                      INSTITUTIONAL DOSSIER INQUIRY
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Submit Formal Inquiry
                    </h2>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Work Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-white/60 block mb-1.5">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Kasule Ronald"
                        className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-sans transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-white/60 block mb-1.5">
                        WORK EMAIL *
                      </label>
                      <input
                        type="email"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="trade@refinery-group.com"
                        className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Company Name & Country */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-white/60 block mb-1.5">
                        COMPANY / INSTITUTION NAME *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Albertine Mineral Consortium"
                        className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-sans transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-white/60 block mb-1.5">
                        COUNTRY OF OPERATION *
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Uganda"
                        className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-sans transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="text-xs font-mono text-white/60 block mb-1.5">
                      INQUIRY TYPE *
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) =>
                        setInquiryType(
                          e.target.value as
                            | "Mineral Sourcing"
                            | "Laboratory Assay Coordination"
                            | "Export Facilitation"
                            | "Mining Equipment"
                            | "General Partnership"
                        )
                      }
                      className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                    >
                      <option value="Mineral Sourcing">Mineral Sourcing (Gold, Copper, Lithium, Coltan, Tanzanite)</option>
                      <option value="Laboratory Assay Coordination">Laboratory Assay Coordination (SGS / Alex Stewart)</option>
                      <option value="Export Facilitation">Export Facilitation & Transit Logistics (MEMD / URA)</option>
                      <option value="Mining Equipment">Mining Equipment & Processing Plants</option>
                      <option value="General Partnership">General Partnership & Sovereign Relations</option>
                    </select>
                  </div>

                  {/* Message Text Area */}
                  <div>
                    <label className="text-xs font-mono text-white/60 block mb-1.5">
                      COMMERCIAL INQUIRY DETAILS *
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Outline your target procurement volume, required purity specifications, target delivery port (CIF/FOB), or corporate partnership request..."
                      className="w-full p-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-sans transition-colors resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-black font-extrabold text-sm transition-all shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2 font-mono">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Validating & Transmitting Inquiry...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 fill-black" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}
