import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";
import {
  LICENSE_MODULE,
  LICENSE_MODULES,
  MODULE_TERM_MONTHS,
  MODULES_PRICING,
  formatRubSpaced,
  moduleMonthlyRub,
  moduleTermDiscountPercent,
} from "@/config/modules-pricing.config";
import { PRICING_PLANS } from "@/config/pricing.config";
import {
  HALL_PRICE_TERMS,
  LANDING_PAGE,
  LANDING_PAGES,
  MODULE_BLOCKS,
  MODULES_PRICE_TERMS,
} from "@/config/landing-pages.config";

/**
 * Сторож цен модулей (план «Работа с залом», Ф10б п. 2): лендинг, тарифы и
 * каталог main-server показывают одни и те же цены, а одна правка константы
 * меняет все места лендинга.
 *
 * Тарифы лежат в соседнем репозитории main-server — сверяем с ними, когда
 * рабочее пространство собрано целиком (локально); в одиночной сборке
 * лендинга файла нет, и сверка с ним пропускается.
 */
const LANDING_DIR = resolve(import.meta.dirname, "../..");
const TARIFFS_FILE = resolve(
  LANDING_DIR,
  "../main-server-nyambot/public/legal-documents/nyambot-tariffs-and-standards.md",
);
const LOCALES_DIR = join(LANDING_DIR, "public/locales");

type IRuModules = {
  pricing: {
    modules: {
      rules: Record<string, string>;
    };
  };
  hallBlock: { label: string };
};

const readRu = (): IRuModules =>
  JSON.parse(
    readFileSync(join(LOCALES_DIR, "ru", "landing.json"), "utf8"),
  ) as IRuModules;

/** «2 490 ₽» в тексте тарифов → 2490 */
const parseRub = (cell: string): number => Number(cell.replace(/[^\d]/gu, ""));

/** Название срока в таблице тарифов */
const TERM_LABEL: Record<number, string> = {
  1: "1 месяц",
  3: "3 месяца",
  6: "6 месяцев",
  12: "12 месяцев",
};

describe("цены модулей — одна константа", () => {
  it.each(LICENSE_MODULES)(
    "%s — все сроки, длинный срок выгоднее",
    (licenseModule) => {
      const prices = MODULES_PRICING[licenseModule].priceRub;
      for (const months of MODULE_TERM_MONTHS)
        expect(prices[months]).toBeGreaterThan(0);
      for (const months of MODULE_TERM_MONTHS.filter((term) => term > 1))
        expect(prices[months] / months).toBeLessThan(prices[1]);
    },
  );

  it("цены — как в каталоге 24.10.2026", () => {
    expect(MODULES_PRICING[LICENSE_MODULE.HALL].priceRub).toEqual({
      1: 2490,
      3: 6700,
      6: 12650,
      12: 22400,
    });
    expect(MODULES_PRICING[LICENSE_MODULE.AI_CHAT].priceRub).toEqual({
      1: 990,
      3: 2670,
      6: 5030,
      12: 8900,
    });
  });

  it("страницы берут цены из константы", () => {
    const hall = MODULES_PRICING[LICENSE_MODULE.HALL].priceRub;
    for (const months of MODULE_TERM_MONTHS)
      expect(HALL_PRICE_TERMS).toContain(`${formatRubSpaced(hall[months])} ₽`);
    for (const licenseModule of LICENSE_MODULES)
      expect(MODULES_PRICE_TERMS).toContain(
        `${formatRubSpaced(moduleMonthlyRub(licenseModule))} ₽ в месяц за точку`,
      );

    const modulesPage = JSON.stringify(LANDING_PAGES[LANDING_PAGE.MODULI]);
    for (const licenseModule of LICENSE_MODULES)
      for (const months of MODULE_TERM_MONTHS)
        expect(modulesPage).toContain(
          `${formatRubSpaced(MODULES_PRICING[licenseModule].priceRub[months])} ₽`,
        );
  });

  it("на страницах нет цен модулей мимо константы", () => {
    const allowed = new Set(
      LICENSE_MODULES.flatMap((licenseModule) =>
        MODULE_TERM_MONTHS.map((months) =>
          formatRubSpaced(MODULES_PRICING[licenseModule].priceRub[months]),
        ),
      ),
    );
    const moduleTexts = [
      LANDING_PAGE.RABOTA_S_ZALOM,
      LANDING_PAGE.ELEKTRONNOE_MENYU,
      LANDING_PAGE.BRON_STOLOV,
      LANDING_PAGE.MODULI,
    ].map((key) => JSON.stringify(LANDING_PAGES[key]));
    const licenseRub = /3 675|4 900/u;
    for (const text of moduleTexts) {
      const prices = [...text.matchAll(/(\d[\d ]*) ₽/gu)].map((match) =>
        match[1].trim(),
      );
      for (const price of prices)
        if (!licenseRub.test(price)) expect(allowed).toContain(price);
    }
  });

  it("названия модулей те же, что в константе", () => {
    for (const licenseModule of LICENSE_MODULES) {
      expect(MODULE_BLOCKS[licenseModule].title).toBe(
        `«${MODULES_PRICING[licenseModule].name}»`,
      );
      expect(MODULE_BLOCKS[licenseModule].module).toBe(licenseModule);
    }
    expect(readRu().hallBlock.label).toBe(
      MODULES_PRICING[LICENSE_MODULE.HALL].name,
    );
  });

  it("ru — условие «подключаются к лицензии» сказано прямо", () => {
    expect(Object.values(readRu().pricing.modules.rules).join(" ")).toMatch(
      /подключаются к лицензии Нямбота/u,
    );
  });

  /* Выгода срока — бейджем «−10%» у цены срока, как у тарифов лицензии:
     числа считаются из цен вниз и совпадают с выгодой лицензии на тот же
     срок; у месяца выгоды нет */
  it.each(LICENSE_MODULES)(
    "%s — выгода сроков как у лицензии",
    (licenseModule) => {
      for (const months of MODULE_TERM_MONTHS) {
        const plan = PRICING_PLANS.find((item) => item.months === months);
        expect(moduleTermDiscountPercent(licenseModule, months)).toBe(
          plan?.discountPercent,
        );
      }
    },
  );
});

describe.skipIf(!existsSync(TARIFFS_FILE))(
  "цены модулей = раздел 1А тарифов",
  () => {
    const tariffs = existsSync(TARIFFS_FILE)
      ? readFileSync(TARIFFS_FILE, "utf8")
      : "";
    const section = tariffs.split("## 1А. Модули")[1]?.split("\n## ")[0] ?? "";

    it("раздел найден", () => {
      expect(section).toContain("«Работа с залом»");
      expect(section).toContain("«ИИ в чате»");
    });

    it.each(MODULE_TERM_MONTHS)("срок %i мес — те же цены", (months) => {
      const row = section
        .split("\n")
        .find((line) => line.startsWith(`| ${TERM_LABEL[months]} `));
      const cells = row?.split("|").map((cell) => cell.trim()) ?? [];
      // | Срок | «Работа с залом» | «ИИ в чате» |
      expect(parseRub(cells[2] ?? "")).toBe(
        MODULES_PRICING[LICENSE_MODULE.HALL].priceRub[months],
      );
      expect(parseRub(cells[3] ?? "")).toBe(
        MODULES_PRICING[LICENSE_MODULE.AI_CHAT].priceRub[months],
      );
    });

    it("цена в месяц за точку — та же", () => {
      for (const licenseModule of LICENSE_MODULES) {
        const row = section
          .split("\n")
          .find((line) =>
            line.startsWith(`| «${MODULES_PRICING[licenseModule].name}»`),
          );
        expect(row).toContain(
          `${formatRubSpaced(moduleMonthlyRub(licenseModule))} ₽ в месяц`,
        );
      }
    });
  },
);
