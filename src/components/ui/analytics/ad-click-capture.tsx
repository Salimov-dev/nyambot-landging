"use client";

import { useEffect } from "react";
import {
  readUtmFromSearch,
  serializeUtmCookie,
  UTM_COOKIE,
} from "@/shared/utm-rules/utm-rules.shared";

/**
 * Сохраняет метки перехода на весь домен: `yclid` Директа и UTM-метки.
 *
 * 🔴 Зачем. Директ размечает только ссылку объявления, и `yclid` живёт ровно
 * на первой открытой странице лендинга. Регистрация происходит позже и в
 * другом месте — на `crm.nyambot.ru`, — и без этой куки связать оплату с
 * рекламным кликом будет нечем: алгоритм так и останется учиться на кликах по
 * кнопкам, по которым мисклик-трафик выдаёт «CPA в норме» при нулевых
 * регистрациях (08.09.2026).
 *
 * UTM-метки — то же для наших собственных ссылок: «Разработано Нямбот» в
 * витрине, СРМ, «Команде», на странице QR-кода (план «UTM-метки», Ф3). По
 * ним у аккаунта видно, откуда пришёл человек, даже если он зарегистрировался
 * не сразу. Новый переход с метками перезаписывает прежний.
 *
 * Кука ставится на домен второго уровня, поэтому её читает и СРМ. Хранит она
 * только идентификатор клика и метки ссылки — ни имени, ни почты, ни
 * чего-либо, по чему узнаётся человек.
 */
const YCLID_PARAM = "yclid";
const COOKIE_NAME = "nb_yclid";
const COOKIE_MAX_AGE_DAYS = 90;
const SECONDS_PER_DAY = 24 * 60 * 60;

/** Метка Директа — цифры и латиница; всё остальное в куку не пускаем. */
const isPlausibleYclid = (value: string): boolean =>
  value.length > 0 && value.length <= 64 && /^[A-Za-z0-9_-]+$/.test(value);

/**
 * На localhost и превью-доменах атрибут domain не ставим: браузер отверг бы
 * куку целиком, и отладка выглядела бы как «капча не работает».
 */
const writeRootCookie = (name: string, value: string, maxAgeDays: number) => {
  const domain = window.location.hostname.endsWith(UTM_COOKIE.ROOT_DOMAIN)
    ? `; domain=.${UTM_COOKIE.ROOT_DOMAIN}`
    : "";
  const maxAge = maxAgeDays * SECONDS_PER_DAY;

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}${domain}; SameSite=Lax`;
};

export function AdClickCapture() {
  useEffect(() => {
    const search = window.location.search;

    const yclid = new URLSearchParams(search).get(YCLID_PARAM);
    if (yclid && isPlausibleYclid(yclid)) {
      writeRootCookie(
        COOKIE_NAME,
        encodeURIComponent(yclid),
        COOKIE_MAX_AGE_DAYS,
      );
    }

    const utm = readUtmFromSearch(search);
    if (utm) {
      writeRootCookie(
        UTM_COOKIE.NAME,
        serializeUtmCookie(utm),
        UTM_COOKIE.MAX_AGE_DAYS,
      );
    }
  }, []);

  return null;
}
