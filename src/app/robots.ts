import type { MetadataRoute } from "next";
import { BRAND_CONFIG } from "@/config/brand.config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BRAND_CONFIG.siteUrl}/sitemap.xml`,
    host: BRAND_CONFIG.siteUrl,
  };
}
