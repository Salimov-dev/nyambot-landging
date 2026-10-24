import { describe, expect, it } from "vitest";
import { landingPageSlug, readLandingFrom } from "./metrika";

/** Страница посадочной в целях Метрики и в `/zapusk?from=` (Руслан 25.10.2026). */
describe("страница посадочной в целях Метрики", () => {
  it("slug — адрес страницы без «/»", () => {
    expect(landingPageSlug("/rabota-s-zalom")).toBe("rabota-s-zalom");
    expect(landingPageSlug("/elektronnoe-menyu")).toBe("elektronnoe-menyu");
  });

  it("корень и вложенные адреса — без страницы", () => {
    expect(landingPageSlug("/")).toBeNull();
    expect(landingPageSlug("/a/b")).toBeNull();
  });

  it("from читается из адреса /zapusk", () => {
    expect(readLandingFrom("?from=bron-stolov")).toBe("bron-stolov");
    expect(readLandingFrom("?utm_source=yandex&from=moduli")).toBe("moduli");
  });

  it("кривое или пустое from — без страницы", () => {
    expect(readLandingFrom("")).toBeNull();
    expect(readLandingFrom("?from=")).toBeNull();
    expect(readLandingFrom("?from=<script>")).toBeNull();
    expect(readLandingFrom("?from=" + "a".repeat(60))).toBeNull();
  });
});
