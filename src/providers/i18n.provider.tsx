"use client";

import "@/config/i18n.config";
import { I18nextProvider } from "react-i18next";
import i18n from "@/config/i18n.config";
import { DEFAULT_LANGUAGE } from "@/config/i18n.config";
import { type ReactNode, useEffect } from "react";

interface I18nProviderProps {
  children: ReactNode;
}

/**
 * 🔴 Дети рендерятся СРАЗУ, на языке по умолчанию. Прежняя версия отдавала
 * null, пока не отработает эффект, — а эффектов на сервере нет, поэтому
 * весь лендинг приходил роботу пустой страницей: ни заголовков, ни текста.
 * Выбранный язык подхватывается эффектом уже поверх готовой разметки, и
 * расхождения гидрации не возникает: первый рендер в браузере тоже идёт
 * на языке по умолчанию.
 */
export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    const savedLang =
      localStorage.getItem("landing_language") ?? DEFAULT_LANGUAGE;

    if (i18n.language !== savedLang) {
      void i18n.changeLanguage(savedLang);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
