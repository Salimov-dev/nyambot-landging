"use client";

import { useEffect } from "react";

/**
 * Сохраняет метку рекламного клика `yclid` на весь домен.
 *
 * 🔴 Зачем. Директ размечает только ссылку объявления, и `yclid` живёт ровно
 * на первой открытой странице лендинга. Регистрация происходит позже и в
 * другом месте — на `crm.nyambot.ru`, — и без этой куки связать оплату с
 * рекламным кликом будет нечем: алгоритм так и останется учиться на кликах по
 * кнопкам, по которым мисклик-трафик выдаёт «CPA в норме» при нулевых
 * регистрациях (08.09.2026).
 *
 * Кука ставится на домен второго уровня, поэтому её читает и СРМ. Хранит она
 * только идентификатор клика — ни имени, ни почты, ни чего-либо, по чему
 * узнаётся человек.
 */
const YCLID_PARAM = "yclid";
const COOKIE_NAME = "nb_yclid";
const COOKIE_MAX_AGE_DAYS = 90;
const ROOT_DOMAIN = "nyambot.ru";

/** Метка Директа — цифры и латиница; всё остальное в куку не пускаем. */
const isPlausibleYclid = (value: string): boolean =>
  value.length > 0 && value.length <= 64 && /^[A-Za-z0-9_-]+$/.test(value);

export function AdClickCapture() {
  useEffect(() => {
    const yclid = new URLSearchParams(window.location.search).get(YCLID_PARAM);
    if (!yclid || !isPlausibleYclid(yclid)) return;

    // На localhost и превью-доменах атрибут domain не ставим: браузер отверг
    // бы куку целиком, и отладка выглядела бы как «капча не работает».
    const domain = window.location.hostname.endsWith(ROOT_DOMAIN)
      ? `; domain=.${ROOT_DOMAIN}`
      : "";
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;

    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(yclid)}; path=/; max-age=${maxAge}${domain}; SameSite=Lax`;
  }, []);

  return null;
}
