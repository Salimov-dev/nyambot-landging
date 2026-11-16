import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { LINKS } from "@/config/links.config";
import { LANDING_PAGE, LANDING_PAGES } from "@/config/landing-pages.config";
import {
  LICENSE_MODULE,
  moduleMonthlyRub,
  formatRubSpaced,
} from "@/config/modules-pricing.config";

describe("корпоративные обеды: демо, страница и цена", () => {
  const page = LANDING_PAGES[LANDING_PAGE.CORPORATE_LUNCHES];
  it("адрес демо ведёт на существующую индексируемую страницу", () => {
    expect(page.path).toBe("/korporativnye-obedy");
    expect(page.path).toBe(LINKS.pages.corporateLunches);
    expect(sitemap().some((row) => row.url.endsWith(page.path))).toBe(true);
    expect(
      readFileSync(
        resolve(import.meta.dirname, "../app/korporativnye-obedy/page.tsx"),
        "utf8",
      ),
    ).toContain("createPageMetadata");
  });
  it("цена модуля берётся из общего каталога лендинга, а 0 ₽ относится к доставке сотруднику", () => {
    expect(
      page.blocks.some((block) => block.module === LICENSE_MODULE.CORPORATE),
    ).toBe(true);
    const fee = page.faq.find(
      (row) => row.question === "Сколько стоит модуль?",
    )?.answer;
    expect(fee).toContain(
      `${formatRubSpaced(moduleMonthlyRub(LICENSE_MODULE.CORPORATE))} ₽ в месяц за точку`,
    );
    expect(page.blocks[0].text).toContain("доставка сотруднику — 0 ₽");
    expect(JSON.stringify(page)).not.toContain("1 490");
  });
  it("секция главной стоит непосредственно после работы с залом", () => {
    const home = readFileSync(
      resolve(import.meta.dirname, "../app/page.tsx"),
      "utf8",
    );
    expect(home).toMatch(/<HallSection\s*\/>\s*<CorporateSection\s*\/>/u);
  });
  it("публичные обещания сохраняют личные платежи и отделяют договор с компанией", () => {
    expect(
      page.faq.find((row) => row.question === "Компания оплачивает общий счёт?")
        ?.answer,
    ).toContain("вне Нямбота");
    expect(
      page.faq.find((row) => row.question === "Можно заказать на завтра?")
        ?.answer,
    ).toContain("сегодня на сегодня");
    expect(page.guide.href).toBe(`${LINKS.docs}/modules/corporate-lunches`);
  });
});
