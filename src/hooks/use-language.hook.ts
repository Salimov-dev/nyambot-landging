"use client";

import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/config/i18n.config";

const LANGUAGE_LABELS: Record<SupportedLanguage, { label: string; nativeLabel: string }> = {
  ru: { label: "Русский", nativeLabel: "Русский" },
  en: { label: "English", nativeLabel: "English" },
  uz: { label: "Uzbek", nativeLabel: "O'zbek" },
  be: { label: "Belarusian", nativeLabel: "Беларуская" },
  tg: { label: "Tajik", nativeLabel: "Тоҷикӣ" },
  ky: { label: "Kyrgyz", nativeLabel: "Кыргызча" },
  az: { label: "Azerbaijani", nativeLabel: "Azərbaycanca" },
};

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as SupportedLanguage;

  const changeLanguage = (code: SupportedLanguage) => {
    i18n.changeLanguage(code);
  };

  const languageOptions = SUPPORTED_LANGUAGES.map((code) => ({
    code,
    ...LANGUAGE_LABELS[code],
  }));

  return {
    currentLanguage,
    changeLanguage,
    languageOptions,
    currentLabel: LANGUAGE_LABELS[currentLanguage] ?? LANGUAGE_LABELS.ru,
  };
}
