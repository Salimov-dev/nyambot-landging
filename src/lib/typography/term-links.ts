import { LINKS } from "@/config/links.config";

/** Название сервиса в тексте и внешняя ссылка, которой оно становится. */
export type ITermLink = {
  term: string;
  href: string;
};

/** Кусок текста: обычный или ссылка на внешний сервис. */
export type ITextPart = {
  text: string;
  href?: string;
};

/** Названия сервисов, которые в текстах посадочных страниц ведут наружу.
 *  ЮKassa — на регистрацию магазина по реферальной ссылке Нямбота. */
export const TERM_LINKS: readonly ITermLink[] = [
  { term: "ЮKassa", href: LINKS.yookassaReferral },
];

/**
 * Делит текст на куски так, чтобы первое упоминание каждого названия стало
 * ссылкой. Остальные упоминания в том же тексте — обычный текст: две ссылки
 * в одном абзаце на одно и то же — шум.
 */
export const splitTermLinks = (
  text: string,
  terms: readonly ITermLink[] = TERM_LINKS,
): ITextPart[] => {
  const matches = terms
    .map((link) => ({ link, index: text.indexOf(link.term) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index);

  const parts: ITextPart[] = [];
  let cursor = 0;
  for (const { link, index } of matches) {
    // Пересечение с предыдущей ссылкой — названия вложены, берём первое
    if (index < cursor) continue;
    if (index > cursor) parts.push({ text: text.slice(cursor, index) });
    parts.push({ text: link.term, href: link.href });
    cursor = index + link.term.length;
  }
  if (cursor < text.length || parts.length === 0) {
    parts.push({ text: text.slice(cursor) });
  }
  return parts;
};
