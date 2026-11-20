import { describe, expect, it } from "vitest";
import { BRAND_CONFIG } from "@/config/brand.config";
import { GET } from "./route";

describe("robots.txt", () => {
  it("разрешает обход и сообщает Яндексу о параметрах дублей", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect((await response.text()).split("\n")).toEqual([
      "User-Agent: *",
      "Allow: /",
      "Clean-param: etext&ybaip",
      `Host: ${BRAND_CONFIG.siteUrl}`,
      `Sitemap: ${BRAND_CONFIG.siteUrl}/sitemap.xml`,
      "",
    ]);
  });
});
