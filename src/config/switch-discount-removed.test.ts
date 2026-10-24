import { readdirSync, readFileSync } from "fs";
import { join, relative, resolve } from "path";
import { describe, expect, it } from "vitest";
import { LANDING_PAGES } from "@/config/landing-pages.config";
import { SEO_CONFIG } from "@/config/seo.config";
import {
  ZAPUSK_AFTER,
  ZAPUSK_HOW,
  ZAPUSK_PAGE,
} from "@/config/zapusk-page.config";

/**
 * Сторож снятой акции «скидка 50% на первые 3 месяца при переходе с другого
 * сервиса» (план «Работа с залом», Ф10 п. 1): юридически её нет — тарифы,
 * раздел 4: «На дату настоящей редакции акции не проводятся». Слова акции не
 * возвращаются ни в один язык, ни в тексты страниц, ни в строки компонентов.
 *
 * Юрдоки (`app/legal`) приходят с главного сервера и сюда не входят.
 */
const SRC_DIR = resolve(import.meta.dirname, "..");
const LOCALES_DIR = resolve(SRC_DIR, "../public/locales");
const LEGAL_DIR = join(SRC_DIR, "app", "legal");

/** «50%» в любом языке, «первые 3 месяца», «вдвое дешевле» и переводы */
const DISCOUNT_PATTERNS: RegExp[] = [
  /50\s?%/u,
  /перв\S*\s+(?:3|тр[её]х|три)\s+месяц/iu,
  /вдвое\s+дешевле/iu,
  /half\s+price/iu,
  /удвая\s+танней/iu,
  /першыя\s+3\s+месяц/iu,
  /ilk\s+3\s+ay/iu,
  /алгачкы\s+3\s+ай/iu,
  /3\s+моҳи\s+аввал/iu,
  /dastlabki\s+3\s+oy/iu,
];

/** Строки компонентов — без процента в стилях («50%» в CSS-значениях) */
const COMPONENT_PATTERNS: RegExp[] =
  DISCOUNT_PATTERNS.slice(1).concat(/скидк\S*\s+50/iu);

const findDiscount = (text: string): RegExp | undefined =>
  DISCOUNT_PATTERNS.find((pattern) => pattern.test(text));

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

describe("акции «скидка 50% при переходе» на лендинге нет", () => {
  it("языки найдены", () => {
    expect(languages.length).toBe(7);
  });

  it.each(languages)("%s — словари без 50% и «первых 3 месяцев»", (lng) => {
    const hits = listFiles(join(LOCALES_DIR, lng), /\.json$/u).flatMap((file) =>
      collectStrings(JSON.parse(readFileSync(file, "utf8")))
        .filter((text) => findDiscount(text))
        .map((text) => `${relative(LOCALES_DIR, file)}: ${text}`),
    );
    expect(hits).toEqual([]);
  });

  it.each(languages)("%s — ключей карточки скидки нет", (lng) => {
    const locale = JSON.parse(
      readFileSync(join(LOCALES_DIR, lng, "landing.json"), "utf8"),
    ) as { pricing: Record<string, unknown> };
    for (const key of ["switchTitle", "switchNote", "switchCta"])
      expect(locale.pricing).not.toHaveProperty(key);
  });

  it("тексты страниц без скидки", () => {
    const texts = collectStrings([
      LANDING_PAGES,
      SEO_CONFIG,
      ZAPUSK_PAGE,
      ZAPUSK_HOW,
      ZAPUSK_AFTER,
    ]);
    expect(texts.filter((text) => findDiscount(text))).toEqual([]);
  });

  it("строки в компонентах без скидки", () => {
    const hits = listFiles(SRC_DIR, /\.tsx?$/u).flatMap((file) =>
      stripComments(readFileSync(file, "utf8"))
        .split("\n")
        .filter((line) =>
          COMPONENT_PATTERNS.some((pattern) => pattern.test(line)),
        )
        .map((line) => `${relative(SRC_DIR, file)}: ${line.trim()}`),
    );
    expect(hits).toEqual([]);
  });

  it("сторож ловит слова акции", () => {
    expect(findDiscount("Получить скидку 50%")).toBeDefined();
    expect(findDiscount("Первые 3 месяца — вдвое дешевле")).toBeDefined();
    expect(findDiscount("Your first 3 months are half price")).toBeDefined();
    expect(findDiscount("3 месяца — 6 700 ₽")).toBeUndefined();
  });
});
