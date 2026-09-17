import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Globe, MapPin, ShieldCheck, Lock } from "lucide-react";

export const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/mineraldealersafrica?igsh=ZzVla2Q5dG1scTA5&utm_source=qr",
    icon: (
      <svg
        className="w-4 h-4 fill-none stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@mineraldealersafrica?_r=1&_t=ZS-95jLJKO1BVi",
    icon: (
      <svg
        className="w-4 h-4 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.9 1.61V6.85a4.83 4.83 0 0 1-1-.16Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/mineraldealersafrica",
    icon: (
      <svg
        className="w-4 h-4 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/abu-mukasa-174320159?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    icon: (
      <svg
        className="w-4 h-4 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];

export default function GlobalFooter() {
  return (
    <footer className="px-6 sm:px-12 py-16 border-t border-white/[0.08] bg-[#0B0C10] text-xs text-white/50 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Col 1: Brand & Headquarters */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Mineral Dealers Africa"
                width={180}
                height={42}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm font-sans">
              The sovereign B2B mineral exchange connecting accredited African mining concessions directly with international offtake buyers under certified assay and bonded escrow governance.
            </p>

            <div className="space-y-2 pt-2 text-xs font-mono text-white/70">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Kampala, Uganda (East & Central Africa Operations)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a
                  href="mailto:info@mineraldealersafrica.com"
                  className="hover:text-white transition-colors"
                >
                  info@mineraldealersafrica.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a
                  href="https://mineraldealersafrica.com/"
                  className="hover:text-white transition-colors"
                >
                  https://mineraldealersafrica.com/
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Institutional Navigation */}
          <div className="md:col-span-3 space-y-3 font-mono">
            <span className="text-[11px] text-white/40 uppercase tracking-widest block font-bold">
              Institutional Portals
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <span>Live Mineral Inventory</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Trader Accreditation (KYC)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Institutional Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Bilateral Escrow Portal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] text-white/90 transition-colors font-semibold">
                  Corporate Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Social Channels & Security Reassurance */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest block font-bold">
              Official Media Channels
            </span>

            {/* Social Icons per exact styling specification */}
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

            <div className="p-4 rounded-2xl bg-[#14171F] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-white text-xs font-bold font-mono">
                <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Zero Off-Platform Leak Policy</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                To prevent fraud and maintain MEMD regulatory compliance, MDA prohibits unvetted telephone solicitation. All trade bids execute strictly inside platform escrow.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Ribbon */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <span className="text-white/40">
            © {new Date().getFullYear()} Mineral Dealers Africa (MDA). All rights reserved.
          </span>

          <div className="flex items-center gap-6 text-white/50">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <ShieldCheck className="w-3.5 h-3.5" /> MEMD & OECD PROTOCOL
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#D4AF37]">TIER-1 ESCROW PROTECTED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
