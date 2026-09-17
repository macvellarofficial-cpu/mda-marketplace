import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0B0C10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mineraldealersafrica.com"),
  title: {
    default: "Mineral Dealers Africa (MDA) | Verified B2B Mineral Marketplace & Escrow",
    template: "%s | Mineral Dealers Africa",
  },
  description:
    "The institutional B2B mineral exchange connecting certified African mining concessions with global offtake buyers. Sovereign laboratory assays, OECD due-diligence, and Tier-1 bonded escrow.",
  applicationName: "Mineral Dealers Africa",
  authors: [{ name: "Mineral Dealers Africa Ltd", url: "https://mineraldealersafrica.com" }],
  creator: "Mineral Dealers Africa",
  publisher: "Mineral Dealers Africa Consortium",
  keywords: [
    "African minerals",
    "Gold Doré Bars",
    "Copper Cathodes",
    "Lithium Spodumene",
    "Coltan Tantalite",
    "Tanzanite",
    "B2B mineral marketplace",
    "Mineral escrow Africa",
    "MEMD Uganda mining",
    "SGS spectrographic assay",
    "OECD mineral due diligence",
    "ICGLR regional certification",
  ],
  alternates: {
    canonical: "https://mineraldealersafrica.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mineraldealersafrica.com",
    siteName: "Mineral Dealers Africa (MDA)",
    title: "Mineral Dealers Africa (MDA) | Verified B2B Mineral Marketplace & Escrow",
    description:
      "Direct institutional mineral sourcing from accredited African producers. Featuring laboratory assay verification, OECD compliance, and Tier-1 bonded trade escrow.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Mineral Dealers Africa - Sovereign B2B Mineral Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mineral Dealers Africa (MDA) | Verified B2B Mineral Marketplace",
    description:
      "The premier B2B mineral exchange connecting certified African mining concessions with global offtake buyers. Verified assays and Tier-1 escrow.",
    creator: "@MineralAfrica",
    images: [
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MDA",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mineraldealersafrica.com/#organization",
      "name": "Mineral Dealers Africa",
      "alternateName": "MDA",
      "url": "https://mineraldealersafrica.com",
      "logo": "https://mineraldealersafrica.com/icons/icon-512x512.png",
      "description":
        "The sovereign B2B mineral marketplace connecting licensed African mining concessionaires with verified international offtake buyers.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kampala",
        "addressRegion": "Central Region",
        "addressCountry": "UG"
      },
      "sameAs": [
        "https://twitter.com/MineralAfrica",
        "https://linkedin.com/company/mineral-dealers-africa"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://mineraldealersafrica.com/#website",
      "url": "https://mineraldealersafrica.com",
      "name": "Mineral Dealers Africa",
      "description": "Institutional B2B African Mineral Trading Network",
      "publisher": {
        "@id": "https://mineraldealersafrica.com/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-[#0B0C10] text-[#F3F4F6] min-h-screen antialiased selection:bg-[#D4AF37] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
