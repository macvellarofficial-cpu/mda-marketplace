import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mineraldealersafrica.com";
  const currentDate = new Date();

  // Core public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Specific mineral lot detail routes for search engines
  const mineralLots = [
    "MDA-GLD-088",
    "MDA-CPR-204",
    "MDA-LIT-312",
    "MDA-COL-551",
    "MDA-DIA-904",
    "MDA-TZN-108",
  ];

  const lotRoutes: MetadataRoute.Sitemap = mineralLots.map((lotId) => ({
    url: `${baseUrl}/marketplace/${encodeURIComponent(lotId)}`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...lotRoutes];
}
