import { BRAND_CONFIG } from "@/config/brand.config";

export const dynamic = "force-static";

const ROBOTS_DIRECTIVES = [
  "User-Agent: *",
  "Allow: /",
  "Clean-param: etext&ybaip",
  `Host: ${BRAND_CONFIG.siteUrl}`,
  `Sitemap: ${BRAND_CONFIG.siteUrl}/sitemap.xml`,
  "",
] as const;

export function GET(): Response {
  return new Response(ROBOTS_DIRECTIVES.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
