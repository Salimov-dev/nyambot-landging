import { createInstance } from "i18next";
import { describe, expect, it } from "vitest";
import { hasOwnTranslation } from "./use-has-translation.hook";

/**
 * Секции, заведённые только в ru, на других языках не рисуются. Запасной
 * язык — ru, поэтому проверка обязана смотреть только в текущий язык
 * (10.10.2026: «Почему сейчас» показывалась на английской странице по-русски).
 */
const makeI18n = async (lng: string) => {
  const i18n = createInstance();
  await i18n.init({
    lng,
    fallbackLng: "ru",
    ns: ["landing"],
    defaultNS: "landing",
    resources: {
      ru: { landing: { whyNow: { title: "Почему сейчас" } } },
      en: { landing: { hero: { title: "Hero" } } },
    },
  });
  return i18n;
};

describe("hasOwnTranslation", () => {
  it("ключ только в ru — на английском секции нет", async () => {
    expect(hasOwnTranslation(await makeI18n("en"), "whyNow.title")).toBe(false);
  });

  it("ключ в ru — на русском секция есть", async () => {
    expect(hasOwnTranslation(await makeI18n("ru"), "whyNow.title")).toBe(true);
  });

  it("ключ в своём языке — секция есть", async () => {
    expect(hasOwnTranslation(await makeI18n("en"), "hero.title")).toBe(true);
  });
});
