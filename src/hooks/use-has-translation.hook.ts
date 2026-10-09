"use client";

import { useTranslation } from "react-i18next";

const LANDING_NAMESPACE = "landing";

type I18nInstance = ReturnType<typeof useTranslation>["i18n"];

/** Перевод есть в самом текущем языке, без запасного. */
export const hasOwnTranslation = (i18n: I18nInstance, key: string): boolean =>
  i18n.exists(key, { ns: LANDING_NAMESPACE, fallbackLng: false });

/**
 * Есть ли у текущего языка перевод для ключа.
 *
 * 🔴 Нужен секциям, которые заведены пока только в русской локали: без проверки
 * i18next отдаёт вместо текста сам ключ, и узбекская версия показала бы
 * «whyNow.title». Секция просто не рендерится, а как только ключи появятся
 * в локали — появится сама, без правок кода.
 *
 * 🔴 `fallbackLng: false`: запасной язык — ru, и без этого `exists` находил
 * русский ключ, а секция рисовалась на английской странице по-русски
 * (найдено 10.10.2026).
 */
export function useHasTranslation(key: string): boolean {
  const { i18n } = useTranslation(LANDING_NAMESPACE);

  return hasOwnTranslation(i18n, key);
}
