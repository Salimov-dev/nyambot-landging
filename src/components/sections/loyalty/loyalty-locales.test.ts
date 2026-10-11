import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";
import { LANDING_PAGES } from "@/config/landing-pages.config";

/**
 * Сторож секции «Лояльность» (план «Лендинг: блок Лояльность», 11.10.2026).
 * Секция переведена на все языки лендинга (11.10.2026): язык без её ключей
 * секцию молча не покажет — сторож ловит это раньше. r_k Friends — фактом:
 * без «скоро» и без ссылки на гайд по Friends.
 */
const LOCALES_DIR = resolve(import.meta.dirname, "../../../../public/locales");
const RU = "ru";
const SECTION = "loyaltyBlock";
const CARD_IDS = ["nyambot", "iikoCard", "rkFriends"];
const SOON = /скоро|в разработке|появится/iu;
const FRIENDS_GUIDE = /marketing\/friends/u;
const FRIENDS = "r_k Friends";

type ILandingLocale = Record<string, unknown>;

const readLanding = (lng: string): ILandingLocale =>
  JSON.parse(
    readFileSync(join(LOCALES_DIR, lng, "landing.json"), "utf8"),
  ) as ILandingLocale;

/** Все строки локали — каждая отдельно, чтобы «скоро» в чужом тексте не
 *  засчитывалось тексту про Friends */
const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
};

const languages = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

describe("секция «Лояльность» в локалях", () => {
  it("языки найдены", () => {
    expect(languages).toContain(RU);
    expect(languages.length).toBeGreaterThan(1);
  });

  it.each(languages)("%s — заголовок, ссылка и все три карточки", (lng) => {
    const block = readLanding(lng)[SECTION] as
      | {
          title: string;
          subtitle: string;
          badgeNew: string;
          more: string;
          items: Record<string, { name: string; note: string }>;
        }
      | undefined;
    expect(block?.title).toBeTruthy();
    expect(block?.subtitle).toBeTruthy();
    expect(block?.badgeNew).toBeTruthy();
    expect(block?.more).toBeTruthy();
    for (const id of CARD_IDS) {
      expect(block?.items[id]?.name).toBeTruthy();
      expect(block?.items[id]?.note).toBeTruthy();
    }
    // Названия программ касс не переводятся
    expect(block?.items.iikoCard?.name).toBe("iikoCard");
    expect(block?.items.rkFriends?.name).toBe(FRIENDS);
  });

  it.each(languages)("%s — без ссылки на гайд по Friends", (lng) => {
    expect(JSON.stringify(readLanding(lng)[SECTION])).not.toMatch(
      FRIENDS_GUIDE,
    );
  });

  it("ru — тексты секции без «скоро»", () => {
    expect(JSON.stringify(readLanding(RU)[SECTION])).not.toMatch(SOON);
  });
});

describe("r_k Friends на страницах лендинга", () => {
  const pages = Object.values(LANDING_PAGES);
  const friendsTexts = [
    ...pages.flatMap((page) => [
      page.metaDescription,
      page.lead,
      ...page.blocks.map((block) => block.text),
      ...page.faq.map((item) => item.answer),
    ]),
    ...collectStrings(readLanding(RU)),
  ].filter((text) => text.includes(FRIENDS));

  it("о Friends говорят страницы", () => {
    expect(friendsTexts.length).toBeGreaterThan(0);
  });

  it("Friends — фактом, без «скоро»", () => {
    for (const text of friendsTexts) expect(text).not.toMatch(SOON);
  });

  it("ссылок на гайд по Friends нет", () => {
    expect(JSON.stringify(LANDING_PAGES)).not.toMatch(FRIENDS_GUIDE);
    expect(JSON.stringify(readLanding(RU))).not.toMatch(FRIENDS_GUIDE);
  });
});
