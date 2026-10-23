import { describe, expect, it } from "vitest";
import { LANDING_PAGES } from "@/config/landing-pages.config";
import { LINKS } from "@/config/links.config";
import { splitTermLinks, TERM_LINKS } from "./term-links";

const YOOKASSA = "ЮKassa";
const REFERRAL_SOURCE = "source=nyambot";

describe("splitTermLinks", () => {
  it("ссылка ЮKassa — реферальная ссылка Нямбота", () => {
    expect(LINKS.yookassaReferral).toBe(
      "https://yookassa.ru/joinups/?source=nyambot",
    );
    const yookassa = TERM_LINKS.find((link) => link.term === YOOKASSA);
    expect(yookassa?.href).toContain(REFERRAL_SOURCE);
  });

  it("упоминание ЮKassa становится ссылкой, текст вокруг — как был", () => {
    const text = "Деньги идут на твой счёт в ЮKassa или Яндекс.Пэй.";
    const parts = splitTermLinks(text);
    expect(parts).toEqual([
      { text: "Деньги идут на твой счёт в " },
      { text: YOOKASSA, href: LINKS.yookassaReferral },
      { text: " или Яндекс.Пэй." },
    ]);
    expect(parts.map((part) => part.text).join("")).toBe(text);
  });

  it("ссылкой становится только первое упоминание", () => {
    const parts = splitTermLinks("ЮKassa и снова ЮKassa");
    expect(parts.filter((part) => part.href)).toHaveLength(1);
    expect(parts.map((part) => part.text).join("")).toBe(
      "ЮKassa и снова ЮKassa",
    );
  });

  it("на посадочных каждое упоминание ЮKassa в карточке и ответе — реферальная ссылка", () => {
    const texts = Object.values(LANDING_PAGES).flatMap((page) => [
      ...page.blocks.map((block) => block.text),
      ...page.faq.map((item) => item.answer),
    ]);
    const withYookassa = texts.filter((text) => text.includes(YOOKASSA));
    // Упоминания есть: если их уберут из текстов, тест надо пересмотреть
    expect(withYookassa.length).toBeGreaterThan(0);
    for (const text of withYookassa) {
      const link = splitTermLinks(text).find((part) => part.href);
      expect(link?.href).toContain(REFERRAL_SOURCE);
    }
  });

  it("текст без названий — один кусок без ссылки", () => {
    expect(splitTermLinks("Оплата при получении")).toEqual([
      { text: "Оплата при получении" },
    ]);
    expect(splitTermLinks("")).toEqual([{ text: "" }]);
  });
});
