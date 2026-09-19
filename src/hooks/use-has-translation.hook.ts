"use client";

import { useTranslation } from "react-i18next";

const LANDING_NAMESPACE = "landing";

/**
 * Есть ли у текущего языка перевод для ключа.
 *
 * 🔴 Нужен секциям, которые заведены пока только в русской локали: без проверки
 * i18next отдаёт вместо текста сам ключ, и узбекская версия показала бы
 * «whyNow.title». Секция просто не рендерится, а как только ключи появятся
 * в локали — появится сама, без правок кода.
 */
export function useHasTranslation(key: string): boolean {
  const { i18n } = useTranslation(LANDING_NAMESPACE);

  return i18n.exists(key, { ns: LANDING_NAMESPACE });
}
