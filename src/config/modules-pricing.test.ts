import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";
import {
  LICENSE_MODULE,
  LICENSE_MODULES,
  MODULES_PRICING,
  formatRubSpaced,
  moduleMonthlyRub,
  modulePriceForMonthsRub,
} from "@/config/modules-pricing.config";
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
 * 🔴 Скидки за срок у модулей нет (Руслан 24.10.2026): цена за срок —
 * месячная, умноженная на число месяцев; лендинг цен за 3, 6 и 12 месяцев и
 * процентов выгоды у модулей не показывает.
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

/** Сроки модуля в таблице тарифов */
const TERM_LABEL: Record<number, string> = {
  1: "1 месяц",
  3: "3 месяца",
  6: "6 месяцев",
  12: "12 месяцев",
};
const TERMS = [1, 3, 6, 12] as const;

type IRuModules = {
  pricing: { modules: { rules: Record<string, string> } };
  hallBlock: { label: string };
};

const readRu = (): IRuModules =>
  JSON.parse(
    readFileSync(join(LOCALES_DIR, "ru", "landing.json"), "utf8"),
  ) as IRuModules;

/** «2 490 ₽» в тексте тарифов → 2490 */
const parseRub = (cell: string): number => Number(cell.replace(/[^\d]/gu, ""));

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
};

describe("цены модулей — одна константа", () => {
  it("цены — как в каталоге 24.10.2026", () => {
    expect(moduleMonthlyRub(LICENSE_MODULE.HALL)).toBe(2490);
    expect(moduleMonthlyRub(LICENSE_MODULE.AI_CHAT)).toBe(990);
  });

  it("скидки за срок нет: цена за срок = месяц × число месяцев", () => {
    expect(
      TERMS.map((m) => modulePriceForMonthsRub(LICENSE_MODULE.HALL, m)),
    ).toEqual([2490, 7470, 14940, 29880]);
    expect(
      TERMS.map((m) => modulePriceForMonthsRub(LICENSE_MODULE.AI_CHAT, m)),
    ).toEqual([990, 2970, 5940, 11880]);
  });

  it("страницы берут цену из константы", () => {
    for (const licenseModule of LICENSE_MODULES)
      expect(MODULES_PRICE_TERMS).toContain(
        `${formatRubSpaced(moduleMonthlyRub(licenseModule))} ₽ в месяц за точку`,
      );
    expect(HALL_PRICE_TERMS).toContain(
      `${formatRubSpaced(moduleMonthlyRub(LICENSE_MODULE.HALL))} ₽ в месяц за точку`,
    );
  });

  it("на страницах модулей нет цен мимо константы", () => {
    const allowed = new Set(
      LICENSE_MODULES.map((licenseModule) =>
        formatRubSpaced(moduleMonthlyRub(licenseModule)),
      ),
    );
    const moduleTexts = [
      LANDING_PAGE.RABOTA_S_ZALOM,
      LANDING_PAGE.ELEKTRONNOE_MENYU,
      LANDING_PAGE.BRON_STOLOV,
      LANDING_PAGE.MODULI,
    ].map((key) => JSON.stringify(LANDING_PAGES[key]));
    const licenseRub = /3 675/u;
    for (const text of moduleTexts) {
      const prices = [...text.matchAll(/(\d[\d ]*) ₽/gu)].map((match) =>
        match[1].trim(),
      );
      for (const price of prices)
        if (!licenseRub.test(price)) expect(allowed).toContain(price);
    }
  });

  it("о модулях нет «выгоднее на срок» и процентов выгоды", () => {
    const ruTexts = collectStrings([
      JSON.parse(readFileSync(join(LOCALES_DIR, "ru", "landing.json"), "utf8")),
      LANDING_PAGES,
    ]);
    const termDiscount =
      /тем выгоднее|дешевле при оплате за срок|выгоднее на срок|срок дольше — выгоднее/iu;
    expect(ruTexts.filter((text) => termDiscount.test(text))).toEqual([]);
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

    it.each(TERMS)("срок %i мес — месяц × срок", (months) => {
      const row = section
        .split("\n")
        .find((line) => line.startsWith(`| ${TERM_LABEL[months]} `));
      const cells = row?.split("|").map((cell) => cell.trim()) ?? [];
      // | Срок | «Работа с залом» | «ИИ в чате» |
      expect(parseRub(cells[2] ?? "")).toBe(
        modulePriceForMonthsRub(LICENSE_MODULE.HALL, months),
      );
      expect(parseRub(cells[3] ?? "")).toBe(
        modulePriceForMonthsRub(LICENSE_MODULE.AI_CHAT, months),
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
