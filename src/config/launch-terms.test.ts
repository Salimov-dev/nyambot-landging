import { readdirSync, readFileSync } from "fs";
import { join, relative, resolve } from "path";
import { describe, expect, it } from "vitest";
import {
  LANDING_PAGE,
  LANDING_PAGES,
  LAUNCH_AND_PAYMENT_FAQ,
  LICENSE_PRICE_TERMS,
} from "@/config/landing-pages.config";
import { PRICING_PLANS } from "@/config/pricing.config";
import { glueDash } from "@/lib/typography/typograph";
import { SEO_CONFIG } from "@/config/seo.config";
import {
  ZAPUSK_AFTER,
  ZAPUSK_HOW,
  ZAPUSK_PAGE,
} from "@/config/zapusk-page.config";

/**
 * Сторож условий запуска (план «Порядок запуска клиента», Ф6, Руслан
 * 15–16.10.2026): бесплатного периода нет — 14 дней тестового периода, счёт
 * за период с даты запуска. О бесплатном периоде лендинг не пишет ни словом:
 * ни «30 дней бесплатно», ни «пробный период», ни «попробуй бесплатно».
 * «Запустим за тебя бесплатно» — можно: бесплатен запуск, не лицензия.
 *
 * Смотрим всё, что видит гость: словари всех языков, тексты конфигов и
 * строки в компонентах (комментарии кода вырезаем — гость их не видит).
 * Юрдоки (`app/legal`) правятся своей фазой и сюда не входят.
 */
const SRC_DIR = resolve(import.meta.dirname, "..");
const LOCALES_DIR = resolve(SRC_DIR, "../public/locales");
const LEGAL_DIR = join(SRC_DIR, "app", "legal");
const RU = "ru";

/** «N дней бесплатно» на всех языках лендинга */
const DAYS_WORD = "(?:дн\\S*|дзён|days?|gün|күн|kun|рӯз)";
const FREE_WORD =
  "(?:бесплатн\\S*|бясплатн\\S*|free|pulsuz|ödənişsiz|акысыз|бекер|bepul|ройгон)";

const FREE_PERIOD_PATTERNS: RegExp[] = [
  new RegExp(`\\d+\\s*${DAYS_WORD}\\s*${FREE_WORD}`, "iu"),
  new RegExp(
    `${FREE_WORD}\\s+(?:период|перыяд|месяц|месяцы|${DAYS_WORD})`,
    "iu",
  ),
  /пробн\S*\s+(?:период|перыяд|срок|доступ|месяц)/iu,
  /(?:попробуй|попробовать|начни|начать)\s+бесплатно/iu,
  /\btrial\b/iu,
];

/** Пробный заказ и пробный оттиск QR — не про лицензию */
const findFreePeriod = (text: string): RegExp | undefined =>
  FREE_PERIOD_PATTERNS.find((pattern) => pattern.test(text));

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
};

const listFiles = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return path === LEGAL_DIR ? [] : listFiles(path, ext);
    return ext.test(entry.name) && !/\.test\./u.test(entry.name) ? [path] : [];
  });

/** Код без комментариев: блочных, JSX и строчных (кроме `://` в адресах) */
const stripComments = (source: string): string =>
  source.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/(^|[^:])\/\/.*$/gmu, "$1");

const languages = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

type ILandingLocale = {
  faq: { items: { question: string; answer: string }[] };
};

const readLanding = (lng: string): ILandingLocale =>
  JSON.parse(
    readFileSync(join(LOCALES_DIR, lng, "landing.json"), "utf8"),
  ) as ILandingLocale;

const formatRub = (value: number): string =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/gu, " ");

describe("бесплатного периода на лендинге нет", () => {
  it("языки найдены", () => {
    expect(languages).toContain(RU);
    expect(languages.length).toBe(7);
  });

  it.each(languages)("%s — словари без бесплатного периода", (lng) => {
    const files = listFiles(join(LOCALES_DIR, lng), /\.json$/u);
    const hits = files.flatMap((file) =>
      collectStrings(JSON.parse(readFileSync(file, "utf8")))
        .filter((text) => findFreePeriod(text))
        .map((text) => `${relative(LOCALES_DIR, file)}: ${text}`),
    );
    expect(hits).toEqual([]);
  });

  it("тексты конфигов без бесплатного периода", () => {
    const texts = collectStrings([
      LANDING_PAGES,
      SEO_CONFIG,
      ZAPUSK_PAGE,
      ZAPUSK_HOW,
      ZAPUSK_AFTER,
    ]);
    expect(texts.filter((text) => findFreePeriod(text))).toEqual([]);
  });

  it("строки в компонентах и страницах без бесплатного периода", () => {
    const hits = listFiles(SRC_DIR, /\.tsx?$/u).flatMap((file) =>
      stripComments(readFileSync(file, "utf8"))
        .split("\n")
        .filter((line) =>
          FREE_PERIOD_PATTERNS.slice(0, -1).some((pattern) =>
            pattern.test(line),
          ),
        )
        .map((line) => `${relative(SRC_DIR, file)}: ${line.trim()}`),
    );
    expect(hits).toEqual([]);
  });

  it("бесплатный запуск — можно", () => {
    expect(findFreePeriod("Запустим за тебя бесплатно")).toBeUndefined();
    expect(
      findFreePeriod("Запуск бесплатно · счёт — с даты запуска"),
    ).toBeUndefined();
    expect(findFreePeriod("30 дней бесплатно")).toBeDefined();
    expect(findFreePeriod("Как устроен пробный период?")).toBeDefined();
  });
});

describe("«Как проходит запуск и когда платить»", () => {
  // Словарь держит неразрывный пробел перед тире сам, конфиг — склейкой при отрисовке
  it("ru — в FAQ главной тот же ответ, что на подстраницах", () => {
    expect(readLanding(RU).faq.items).toContainEqual({
      question: glueDash(LAUNCH_AND_PAYMENT_FAQ.question),
      answer: glueDash(LAUNCH_AND_PAYMENT_FAQ.answer),
    });
  });

  it.each(languages)(
    "%s — вопрос есть: 14 дней и строка про R-Keeper",
    (lng) => {
      const launch = readLanding(lng).faq.items.find(
        ({ answer }) => answer.includes("14") && answer.includes("R-Keeper"),
      );
      expect(launch?.question).toBeTruthy();
    },
  );

  it("на /voprosy — тот же вопрос", () => {
    expect(LANDING_PAGES[LANDING_PAGE.VOPROSY].faq).toContainEqual(
      LAUNCH_AND_PAYMENT_FAQ,
    );
  });

  it("цена в ответе «Сколько это стоит?» — из тарифов", () => {
    const year = PRICING_PLANS.find((plan) => plan.months === 12);
    const month = PRICING_PLANS.find((plan) => plan.months === 1);
    expect(LICENSE_PRICE_TERMS).toContain(
      `${formatRub(year?.pricePerMonth ?? 0)} ₽`,
    );
    expect(LICENSE_PRICE_TERMS).toContain(
      `${formatRub(month?.priceRub ?? 0)} ₽`,
    );
  });
});

describe("/zapusk — как мы работаем", () => {
  const texts = collectStrings([ZAPUSK_HOW, ZAPUSK_AFTER]);

  it("для клиента — «автоматическая приёмка», без «раннера»", () => {
    expect(texts.join(" ")).not.toMatch(/раннер/iu);
    expect(texts.join(" ")).toMatch(/автоматическая приёмка/u);
    expect(texts.join(" ")).toMatch(/дозорный/u);
  });

  it("шаги над и под формой не повторяются", () => {
    const howTitles = ZAPUSK_HOW.steps.map((step) => step.title);
    for (const step of ZAPUSK_AFTER.steps)
      expect(howTitles).not.toContain(step.title);
  });
});

describe("R-Keeper — лицензия у дилера", () => {
  const LICENSE_CODE = "640390001";
  const page = LANDING_PAGES[LANDING_PAGE.RKEEPER];
  const setupBlock = page.blocks.find(
    (block) => block.title === "Что нужно для подключения",
  );

  it("в «Что нужно для подключения» и в вопросе — модуль и код", () => {
    expect(setupBlock?.text).toContain(LICENSE_CODE);
    const question = page.faq.find(
      (item) => item.question === "Что купить у дилера R-Keeper?",
    );
    expect(question?.answer).toContain(LICENSE_CODE);
    expect(question?.answer).toContain("Интерфейс подключения к WS Нямбот");
  });

  it("наших цен и реквизитов лицензии на сайте нет", () => {
    const all = JSON.stringify(LANDING_PAGES);
    expect(all).not.toMatch(/13[\s ]?500/u);
    expect(all).not.toMatch(/Салимов/u);
  });

  it("карточки страницы — одной длины ±15%", () => {
    const lengths = page.blocks.map((block) => block.text.length);
    const average =
      lengths.reduce((sum, length) => sum + length, 0) / lengths.length;
    for (const length of lengths) {
      expect(length).toBeGreaterThanOrEqual(average * 0.85);
      expect(length).toBeLessThanOrEqual(average * 1.15);
    }
  });
});
