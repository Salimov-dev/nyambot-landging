import { readFileSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";
import { LANDING_PAGES } from "@/config/landing-pages.config";
import { SEO_CONFIG } from "@/config/seo.config";

/**
 * Сторож «всё включено» (Руслан 24.10.2026): с модулями «Работа с залом» и
 * «ИИ в чате» лицензия — это всё для доставки и самовывоза, а зал и ИИ —
 * модулями. Обещать «все возможности в одном тарифе» больше нельзя: это
 * неправда. Подписи «Все возможности» у ссылок на страницу возможностей —
 * можно, пока рядом нет слова «тариф» или «лицензия».
 */
const LOCALES_DIR = resolve(import.meta.dirname, "../../public/locales");

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
};

const readLocale = (lng: string): string[] =>
  collectStrings(
    JSON.parse(readFileSync(join(LOCALES_DIR, lng, "landing.json"), "utf8")),
  );

const sentencesOf = (texts: string[]): string[] =>
  texts.flatMap((text) => text.split(/(?<=[.!?;])\s+/u));

/** Обещание «всё в тарифе» — где бы ни стояло */
const RU_ALWAYS =
  /вс[её] включено|все функции|всеми функциями|полный функционал/iu;
const EN_ALWAYS =
  /all included|every feature|full features|all features included/iu;

/** «Все возможности» — только рядом с тарифом или лицензией */
const RU_NEAR = /все возможности|вс[её] сразу/iu;
const RU_PLAN = /тариф|лицензи|подписк/iu;
const EN_NEAR = /all features|every feature/iu;
const EN_PLAN = /\bplan\b|licen[cs]e|subscription/iu;

const findClaims = (
  sentences: string[],
  always: RegExp,
  near: RegExp,
  plan: RegExp,
): string[] =>
  sentences.filter(
    (sentence) =>
      always.test(sentence) || (near.test(sentence) && plan.test(sentence)),
  );

describe("лицензия не обещает «всё включено»", () => {
  it("ru-локаль", () => {
    expect(
      findClaims(sentencesOf(readLocale("ru")), RU_ALWAYS, RU_NEAR, RU_PLAN),
    ).toEqual([]);
  });

  it("en-локаль", () => {
    expect(
      findClaims(sentencesOf(readLocale("en")), EN_ALWAYS, EN_NEAR, EN_PLAN),
    ).toEqual([]);
  });

  it("тексты страниц и SEO", () => {
    const texts = collectStrings([LANDING_PAGES, SEO_CONFIG]);
    expect(findClaims(sentencesOf(texts), RU_ALWAYS, RU_NEAR, RU_PLAN)).toEqual(
      [],
    );
  });

  it("сторож ловит обещание", () => {
    const sentences = [
      "Доставка, самовывоз и «Команда» — всё включено.",
      "Один тариф, все возможности, без процента с заказа",
    ];
    expect(findClaims(sentences, RU_ALWAYS, RU_NEAR, RU_PLAN)).toHaveLength(2);
    expect(
      findClaims(["Все возможности"], RU_ALWAYS, RU_NEAR, RU_PLAN),
    ).toEqual([]);
  });
});
