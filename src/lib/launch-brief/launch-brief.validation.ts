/**
 * Проверка заявки на запуск в браузере — до отправки.
 *
 * Правила повторяют main-server (`server/utils/leads/launch-brief.util.ts`,
 * `validateLaunchBriefForSubmit`): человек видит ошибку сразу под полем, а не
 * после круга до сервера. Правда всё равно за сервером — его код ошибки форма
 * показывает тем же текстом.
 *
 * Обязательны имя и контакт, название и касса — город в короткой форме не
 * спрашиваем (Руслан 10.10), main-server его тоже не требует.
 */
import {
  BRIEF_ERROR,
  BRIEF_LIMIT,
  type BriefErrorCode,
  type LaunchBriefFormState,
} from "./launch-brief.model";

/** Чего не хватает для отправки — по порядку полей в форме. */
export const BRIEF_MISSING = {
  NAME: "name",
  CONTACT: "contact",
  VENUE: "venue",
  POS: "pos",
  CONSENT: "consent",
} as const;
export type BriefMissing = (typeof BRIEF_MISSING)[keyof typeof BRIEF_MISSING];

/** Ник Телеграм: 5–32 символа, латиница, цифры, подчёркивание. */
const TELEGRAM_USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{4,31}$/;
const TELEGRAM_LINK_PATTERN =
  /^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([A-Za-z0-9_]+)\/?$/i;
const MAX_LINK_PATTERN = /^(?:https?:\/\/)?(?:web\.)?max\.ru\/\S+$/i;
const PHONE_CHARS_PATTERN = /^[+\d\s()-]+$/;
const PHONE_MIN_DIGITS = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SCHEME_PATTERN = /^https?:\/\//i;
const LINK_IN_TEXT_PATTERN = /(?:https?:\/\/|www\.)/i;
const DIGITS_ONLY_PATTERN = /^\d+$/;

export const isContactPhone = (value: string): boolean =>
  PHONE_CHARS_PATTERN.test(value) &&
  value.replace(/\D/g, "").length >= PHONE_MIN_DIGITS;

/** Ник, ссылка `t.me/…` или телефон. */
export const isValidTelegramContact = (value: string): boolean => {
  const link = TELEGRAM_LINK_PATTERN.exec(value);
  const username = link?.[1] ?? value.replace(/^@/, "");
  return TELEGRAM_USERNAME_PATTERN.test(username) || isContactPhone(value);
};

/** Телефон или ссылка `max.ru/…`. */
export const isValidMaxContact = (value: string): boolean =>
  isContactPhone(value) || MAX_LINK_PATTERN.test(value);

/** Ссылка на сайт или страницу: схема дописывается, у хоста должна быть точка. */
export const isValidUrl = (value: string): boolean => {
  if (/\s/.test(value)) return false;
  const withScheme = SCHEME_PATTERN.test(value) ? value : `https://${value}`;
  try {
    return new URL(withScheme).hostname.includes(".");
  } catch {
    return false;
  }
};

/** Диапазон «2-5» / «2–5»: подсказка в поле — диапазон (Руслан 10.10). */
const OUTLETS_RANGE_PATTERN = /^\d+\s*[-–—]\s*(\d+)$/;

/**
 * Число точек из поля ввода: пусто — «не ответил»; диапазон «2–5» —
 * верхняя граница (сколько точек всего может быть); не целое от 1 до 1000 —
 * ошибка.
 */
export const parseOutletsInput = (
  raw: string,
): { valid: boolean; value: number | null } => {
  const value = raw.trim();
  if (!value) return { valid: true, value: null };
  const upper = OUTLETS_RANGE_PATTERN.exec(value)?.[1] ?? value;
  if (!DIGITS_ONLY_PATTERN.test(upper)) return { valid: false, value: null };
  const count = Number(upper);
  const inRange =
    count >= BRIEF_LIMIT.OUTLETS_MIN && count <= BRIEF_LIMIT.OUTLETS_MAX;
  return inRange
    ? { valid: true, value: count }
    : { valid: false, value: null };
};

/**
 * Первое, чего не хватает для отправки, — для подсказки над серой кнопкой
 * (правило «серая кнопка говорит, что сделать»). Порядок — как поля стоят в
 * форме.
 */
export const missingOf = (
  state: LaunchBriefFormState,
  consent: boolean,
): BriefMissing | null => {
  const { texts, choices } = state;
  if (!texts.name.trim()) return BRIEF_MISSING.NAME;
  if (!texts.phone.trim() && !texts.telegram.trim() && !texts.max.trim()) {
    return BRIEF_MISSING.CONTACT;
  }
  if (!texts.venue.trim()) return BRIEF_MISSING.VENUE;
  if (!choices.pos) return BRIEF_MISSING.POS;
  if (!consent) return BRIEF_MISSING.CONSENT;
  return null;
};

/**
 * Ошибка формата в заполненных полях — тем же кодом и в том же порядке, что
 * у main-server; число точек проверяем только здесь, у сервера своего кода
 * для него нет. Пустые необязательные поля не проверяются.
 */
export const formatErrorOf = (
  state: LaunchBriefFormState,
): BriefErrorCode | null => {
  const { texts } = state;
  const name = texts.name.trim();
  const phone = texts.phone.trim();
  const telegram = texts.telegram.trim();
  const max = texts.max.trim();
  const email = texts.email.trim();
  const site = texts.site.trim();

  if (LINK_IN_TEXT_PATTERN.test(name)) return BRIEF_ERROR.NAME_REQUIRED;
  if (phone && !isContactPhone(phone)) return BRIEF_ERROR.INVALID_PHONE;
  if (telegram && !isValidTelegramContact(telegram)) {
    return BRIEF_ERROR.INVALID_TELEGRAM;
  }
  if (max && !isValidMaxContact(max)) return BRIEF_ERROR.INVALID_MAX;
  if (email && !EMAIL_PATTERN.test(email)) return BRIEF_ERROR.INVALID_EMAIL;
  if (site && !isValidUrl(site)) return BRIEF_ERROR.INVALID_SITE;
  if (!parseOutletsInput(texts.outletsTotal).valid) {
    return BRIEF_ERROR.INVALID_OUTLETS;
  }
  return null;
};
