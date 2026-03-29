"use client";

import "@/config/i18n.config";
import { I18nextProvider } from "react-i18next";
import i18n from "@/config/i18n.config";
import { DEFAULT_LANGUAGE } from "@/config/i18n.config";
import { type ReactNode, useEffect, useState } from "react";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedLang =
      localStorage.getItem("landing_language") ?? DEFAULT_LANGUAGE;

    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang).then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
