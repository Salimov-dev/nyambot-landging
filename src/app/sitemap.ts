import type { MetadataRoute } from "next";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BRAND_CONFIG.siteUrl;
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...Object.values(LINKS.legal).map((path) => ({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
