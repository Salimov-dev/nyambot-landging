import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

// ru
import ruLanding from "../../public/locales/ru/landing.json";
import ruCommon from "../../public/locales/ru/common.json";
import ruLanguages from "../../public/locales/ru/languages.json";

// en
import enLanding from "../../public/locales/en/landing.json";
import enCommon from "../../public/locales/en/common.json";
import enLanguages from "../../public/locales/en/languages.json";

// uz
import uzLanding from "../../public/locales/uz/landing.json";
import uzCommon from "../../public/locales/uz/common.json";
import uzLanguages from "../../public/locales/uz/languages.json";

// be
import beLanding from "../../public/locales/be/landing.json";
import beCommon from "../../public/locales/be/common.json";
import beLanguages from "../../public/locales/be/languages.json";

// tg
import tgLanding from "../../public/locales/tg/landing.json";
import tgCommon from "../../public/locales/tg/common.json";
import tgLanguages from "../../public/locales/tg/languages.json";

// ky
import kyLanding from "../../public/locales/ky/landing.json";
import kyCommon from "../../public/locales/ky/common.json";
import kyLanguages from "../../public/locales/ky/languages.json";

// az
import azLanding from "../../public/locales/az/landing.json";
import azCommon from "../../public/locales/az/common.json";
import azLanguages from "../../public/locales/az/languages.json";

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
  ru: { landing: ruLanding, common: ruCommon, languages: ruLanguages },
  en: { landing: enLanding, common: enCommon, languages: enLanguages },
  uz: { landing: uzLanding, common: uzCommon, languages: uzLanguages },
  be: { landing: beLanding, common: beCommon, languages: beLanguages },
  tg: { landing: tgLanding, common: tgCommon, languages: tgLanguages },
  ky: { landing: kyLanding, common: kyCommon, languages: kyLanguages },
  az: { landing: azLanding, common: azCommon, languages: azLanguages },
};

i18n
  .use(resourcesToBackend(resources))
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: ["landing", "common", "languages"],
    defaultNS: "landing",
    interpolation: { escapeValue: false },
    load: "languageOnly",
    cleanCode: true,
  });

export default i18n;
