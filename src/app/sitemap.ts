import type { MetadataRoute } from "next";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import { LANDING_PAGES } from "@/config/landing-pages.config";

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
    /* Посадочные под поисковые запросы: у каждой своя тема, свой заголовок
       и свой адрес — это отдельные точки входа из выдачи, а не разделы главной. */
    ...Object.values(LANDING_PAGES).map((page) => ({
      url: `${base}${page.path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...Object.values(LINKS.legal).map((path) => ({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
