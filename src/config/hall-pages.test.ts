import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { BRAND_CONFIG } from "@/config/brand.config";
import { LINKS } from "@/config/links.config";
import {
  LANDING_PAGE,
  LANDING_PAGES,
  type ILandingPageContent,
} from "@/config/landing-pages.config";

/**
 * Сторож страниц «Работы с залом» и модулей (план «Работа с залом», Ф10б
 * п. 3–4): страницы есть и в sitemap, сквозные страницы ссылаются на хаб,
 * обещания — только сделанное: онлайн-предоплату брони на R-Keeper не
 * обещаем, причину цены «ИИ в чате» не называем.
 */
const SRC_DIR = resolve(import.meta.dirname, "..");
const APP_DIR = join(SRC_DIR, "app");
const RU_LOCALE = resolve(SRC_DIR, "../public/locales/ru/landing.json");

const HALL_PAGES = [
  LANDING_PAGE.RABOTA_S_ZALOM,
  LANDING_PAGE.ELEKTRONNOE_MENYU,
  LANDING_PAGE.BRON_STOLOV,
  LANDING_PAGE.MODULI,
] as const;

/** Сквозные страницы, которые ведут на хаб зала (Ф10б п. 4) */
const LINKED_TO_HALL = [
  LANDING_PAGE.VOZMOZHNOSTI,
  LANDING_PAGE.IIKO,
  LANDING_PAGE.RKEEPER,
  LANDING_PAGE.VOPROSY,
  LANDING_PAGE.QR_KOD,
  LANDING_PAGE.ELEKTRONNOE_MENYU,
  LANDING_PAGE.BRON_STOLOV,
] as const;

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
};

const pageTexts = (page: ILandingPageContent): string[] =>
  collectStrings([
    page.metaTitle,
    page.metaDescription,
    page.heading,
    page.lead,
    page.blocks,
    page.faq,
  ]);

/** Предложения всех текстов страниц и ru-локали */
const sentences = [
  ...Object.values(LANDING_PAGES).flatMap(pageTexts),
  ...collectStrings(JSON.parse(readFileSync(RU_LOCALE, "utf8"))),
].flatMap((text) => text.split(/(?<=[.!?;])\s+/u));

describe("страницы зала и модулей", () => {
  it.each(Object.values(LANDING_PAGES).map((page) => page.path))(
    "%s — у адреса есть страница",
    (path) => {
      expect(existsSync(join(APP_DIR, path, "page.tsx"))).toBe(true);
    },
  );

  it.each(HALL_PAGES)("%s — в sitemap", (key) => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${BRAND_CONFIG.siteUrl}${LANDING_PAGES[key].path}`);
  });

  it.each(LINKED_TO_HALL)("%s — ссылка на «Работу с залом»", (key) => {
    const links = LANDING_PAGES[key].blocks.map((block) => block.link?.href);
    expect(links).toContain(LINKS.pages.hall);
  });

  it("общий QR-код и QR стола связаны ссылками", () => {
    const menu = LANDING_PAGES[LANDING_PAGE.ELEKTRONNOE_MENYU];
    expect(menu.blocks.map((block) => block.link?.href)).toContain(
      LINKS.pages.qrCode,
    );
  });

  it.each(Object.keys(LANDING_PAGES))(
    "%s — сцены карточек не повторяются",
    (key) => {
      const scenes = LANDING_PAGES[key].blocks
        .map((block) => block.scene)
        .filter((scene) => scene !== undefined);
      expect(new Set(scenes).size).toBe(scenes.length);
    },
  );

  it("онлайн-предоплату брони на R-Keeper не обещаем", () => {
    const rkeeperPrepay = sentences.filter(
      (sentence) =>
        sentence.includes("R-Keeper") && /предоплат/iu.test(sentence),
    );
    expect(rkeeperPrepay.length).toBeGreaterThan(0);
    for (const sentence of rkeeperPrepay)
      expect(sentence).toMatch(/на месте|нет|не поддерживается/u);
  });

  it("причину цены «ИИ в чате» не называем", () => {
    const reason = /токен|нейросет|языков\S* модел|GPT|вендор/iu;
    const aiSentences = sentences.filter((sentence) =>
      /(?<!\p{L})ИИ(?!\p{L})/u.test(sentence),
    );
    expect(aiSentences.length).toBeGreaterThan(0);
    expect(aiSentences.filter((sentence) => reason.test(sentence))).toEqual([]);
  });

  it("заказ со стола больше не «пока не принимаем»", () => {
    expect(sentences.join(" ")).not.toMatch(/пока не принимаем/u);
  });
});
