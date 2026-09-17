import React from "react";

interface NavbarLogoProps {
  className?: string;
}

export default function NavbarLogo({ className = "" }: NavbarLogoProps) {
  return (
    <div
      className={`flex items-center gap-3.5 hover:opacity-90 transition-opacity cursor-pointer select-none bg-transparent ${className}`}
    >
      {/* Gemstone Faceted African Continent Contour */}
      <div className="relative w-10 h-11 flex-shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.45)]"
        >
          <defs>
            {/* Gold and Amber Gradients */}
            <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            <linearGradient id="goldGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FCD34D" />
            </linearGradient>
            <linearGradient id="goldGradient3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="goldGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            {/* Emerald Highlights */}
            <linearGradient id="emeraldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="emeraldGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Crystal Shimmer Filter */}
            <filter id="crystalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#D4AF37" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Faceted African Continent Geometric Gemstone Network */}
          <g filter="url(#crystalGlow)" stroke="#FFFFFF" strokeWidth="0.85" strokeLinejoin="round" strokeOpacity="0.3">
            {/* North-West (Morocco/Atlas) */}
            <polygon points="26,12 44,10 38,26 20,20" fill="url(#goldGradient1)" />

            {/* North-Central / Egypt / Sinai */}
            <polygon points="44,10 62,14 56,34 38,26" fill="url(#goldGradient2)" />

            {/* West Africa Bulge (Senegal/Guinea) */}
            <polygon points="20,20 38,26 28,42 12,34" fill="url(#goldGradient3)" />

            {/* Sahel & Niger Basin (Emerald Highlight facet) */}
            <polygon points="38,26 56,34 50,50 28,42" fill="url(#emeraldGradient1)" />

            {/* Horn of Africa (Somalia/Ethiopia) */}
            <polygon points="62,14 78,38 64,48 56,34" fill="url(#goldGradient4)" />

            {/* Gulf of Guinea & Cameroon */}
            <polygon points="28,42 50,50 42,62 30,52" fill="url(#goldGradient1)" />

            {/* Great Lakes & East Africa Mineral Belt (Emerald Highlight facet) */}
            <polygon points="56,34 64,48 62,64 50,50" fill="url(#emeraldGradient2)" />

            {/* Congo Basin (Central Copperbelt) */}
            <polygon points="50,50 62,64 48,76 42,62" fill="url(#goldGradient2)" />

            {/* West-Central Coast (Angola/Namibia) */}
            <polygon points="42,62 48,76 34,76 30,52" fill="url(#goldGradient3)" />

            {/* Southern Mineral Plateau (South Africa / Kalahari) */}
            <polygon points="48,76 62,64 48,98" fill="url(#goldGradient1)" />

            {/* Cape Agulhas Southern Peak */}
            <polygon points="34,76 48,76 48,98" fill="url(#goldGradient4)" />

            {/* Madagascar Gemstone Facet */}
            <polygon points="76,68 84,72 80,88 74,82" fill="url(#emeraldGradient1)" strokeOpacity="0.4" />
          </g>

          {/* Accent Glistening Nodes */}
          <circle cx="50" cy="50" r="1.8" fill="#FFFFFF" opacity="0.9" />
          <circle cx="78" cy="38" r="1.4" fill="#FCD34D" opacity="0.8" />
          <circle cx="48" cy="98" r="1.4" fill="#34D399" opacity="0.9" />
          <circle cx="12" cy="34" r="1.2" fill="#FFFFFF" opacity="0.7" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none select-none">
        <span className="font-bold text-white tracking-widest text-[15px] uppercase">
          MINERAL DEALERS
        </span>
        <span className="font-extrabold text-[#D4AF37] tracking-[0.22em] text-[15px] uppercase mt-0.5">
          AFRICA
        </span>
        <span className="text-[9px] font-medium tracking-[0.3em] text-emerald-400/90 uppercase mt-1">
          B2B COMMODITY EXCHANGE
        </span>
      </div>
    </div>
  );
}
