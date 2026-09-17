import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/marketplace", "/marketplace/*", "/login", "/register"],
        disallow: ["/dashboard", "/dashboard/*", "/admin", "/admin/*"],
      },
    ],
    sitemap: "https://mineraldealersafrica.com/sitemap.xml",
  };
}
