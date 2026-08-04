import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

// ru
import ruLanding from "../../public/locales/ru/landing.json";

// en
import enLanding from "../../public/locales/en/landing.json";

// uz
import uzLanding from "../../public/locales/uz/landing.json";

// be
import beLanding from "../../public/locales/be/landing.json";

// tg
import tgLanding from "../../public/locales/tg/landing.json";

// ky
import kyLanding from "../../public/locales/ky/landing.json";

// az
import azLanding from "../../public/locales/az/landing.json";

export const SUPPORTED_LANGUAGES = [
  "ru",
  "en",
  "uz",
  "be",
  "tg",
  "ky",
  "az",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "ru";

const resources = {
  ru: { landing: ruLanding },
  en: { landing: enLanding },
  uz: { landing: uzLanding },
  be: { landing: beLanding },
  tg: { landing: tgLanding },
  ky: { landing: kyLanding },
  az: { landing: azLanding },
};

i18n
  .use(resourcesToBackend(resources))
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: ["landing"],
    defaultNS: "landing",
    interpolation: { escapeValue: false },
    load: "languageOnly",
    cleanCode: true,
  });

export default i18n;
