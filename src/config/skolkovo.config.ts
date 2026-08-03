/**
 * Логотип участника проекта «Сколково».
 *
 * Файлы взяты из Коммуникационного пакета Фонда без изменений — перекрашивать
 * и перерисовывать логотип запрещено. Правила размещения (Положение № 165-Пр
 * от 16.08.2022 и Коммуникационный пакет):
 * - на тёмном фоне используется зелёная или белая версия;
 * - в подвале сайта допустимы и горизонтальная, и вертикальная версии;
 * - минимальная высота: 34 px для горизонтальных, 50 px для вертикальной;
 * - вокруг логотипа сохраняется охранное поле.
 *
 * На всех языках, кроме русского, используется латинская версия «Sk Resident».
 */

export const SKOLKOVO_LOGO_KIND = {
  /** Горизонтальный фирменный блок со знаком-иконкой */
  HORIZONTAL: "horizontal",
  /** Вертикальная версия — для подвала */
  VERTICAL: "vertical",
} as const;

export type SkolkovoLogoKind =
  (typeof SKOLKOVO_LOGO_KIND)[keyof typeof SKOLKOVO_LOGO_KIND];

interface SkolkovoLogo {
  src: string;
  /** Размеры исходника Фонда — нужны, чтобы не искажать пропорции */
  width: number;
  height: number;
  /** Минимальная высота по Коммуникационному пакету, стр. 12 */
  minHeight: number;
}

const LOGOS: Record<"ru" | "latin", Record<SkolkovoLogoKind, SkolkovoLogo>> = {
  ru: {
    horizontal: {
      /* Зелёная версия, а не белая моно: на тёмной шапке белый знак сливался
         с навигацией и переставал считываться как статус */
      src: "/images/skolkovo/sk-uchastnik-horizontal.png",
      width: 703,
      height: 206,
      minHeight: 34,
    },
    vertical: {
      src: "/images/skolkovo/sk-uchastnik-vertical-green.png",
      width: 402,
      height: 300,
      minHeight: 50,
    },
  },
  latin: {
    horizontal: {
      src: "/images/skolkovo/sk-resident-horizontal.png",
      width: 652,
      height: 207,
      minHeight: 34,
    },
    vertical: {
      src: "/images/skolkovo/sk-resident-vertical-green.png",
      width: 359,
      height: 300,
      minHeight: 50,
    },
  },
};

export function getSkolkovoLogo(
  language: string,
  kind: SkolkovoLogoKind,
): SkolkovoLogo {
  return LOGOS[language === "ru" ? "ru" : "latin"][kind];
}

/** Размеры под заданную высоту, с сохранением пропорций исходника */
export function getSkolkovoLogoSize(logo: SkolkovoLogo, height: number) {
  return {
    width: Math.round((logo.width / logo.height) * height),
    height,
  };
}
