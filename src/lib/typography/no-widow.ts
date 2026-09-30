/**
 * Склеивает два последних слова неразрывным пробелом — в последней строке
 * абзаца не остаётся одно слово (Руслан 30.09: «одинокое слово на новой строке
 * выглядит плохо»).
 *
 * CSS `text-wrap: pretty` (в `globals.css`) это уже делает, но не всегда: у
 * длинного последнего слова («конфиденциальности.») браузер оставляет его одно.
 * Склейка надёжнее и работает там, где `pretty` не поддерживается.
 */
const NBSP = " ";

export const noWidow = (text: string): string => {
  const trimmed = text.trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace <= 0) return text;
  return `${trimmed.slice(0, lastSpace)}${NBSP}${trimmed.slice(lastSpace + 1)}`;
};
