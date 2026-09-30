// ────────────────────────────────────────────────────────────────────────────
// СГЕНЕРИРОВАННАЯ КОПИЯ. НЕ ПРАВИТЬ РУКАМИ.
//
// Источник: workspace-scripts/shared-brand-rules/brand-rules.source.ts
// Обновить: node workspace-scripts/scripts/sync-brand-rules.mjs
//
// Каталог цветовых схем живёт в одном месте (план «Брендирование», Р11).
// Правка этого файла мимо источника падает тестом «копия совпадает с
// источником» — обойти синхронизацию незаметно нельзя.
//
// SOURCE_SHA256: 60e7add9c578b1d79e3fd090291245bac742ca23704b82fe26fb65b449b3802c
// ────────────────────────────────────────────────────────────────────────────

/**
 * ОБЩИЕ ПРАВИЛА БРЕНДА — каталог цветовых схем, единственный источник.
 *
 * План «Брендирование» (30.09.2026), решения Р3, Р4, Р11.
 *
 * ## Зачем
 *
 * Ресторатор выбирает в СРМ цветовую схему, гость видит её в витрине и на
 * странице выбора мессенджера. Если у каждой из трёх сторон будет своя копия
 * цветов, макет в СРМ разойдётся с витриной ровно в тот день, когда кто-то
 * поправит оттенок в одном месте. Поэтому каталог один, а проекты получают
 * его копией (`sync-brand-rules.mjs`), как деньги и телефон.
 *
 * ## Правила
 *
 * - Свободного цвета нет (Р3): в базе лежит только КЛЮЧ схемы
 *   (`Brand.colorScheme`), палитра берётся отсюда.
 * - `null`, пустой и неизвестный ключ → схема Нямбота (Р4). Ключ, который
 *   когда-то убрали из каталога, не ломает витрину — она просто становится
 *   оранжевой.
 * - Палитры подобраны руками под тёмный фон витрины, не вычисляются. Сторож
 *   читаемости — таблица `shared-fixtures/brand-rules-matrix.json` и тесты
 *   проектов: акцент читается на фоне, текст на кнопке — не хуже, чем у
 *   Нямбота.
 * - Схема Нямбота обязана совпадать с прежними цветами витрины ДО ЗНАЧЕНИЯ:
 *   без бренда гость не должен увидеть ни одного изменённого пикселя.
 */

/** Ключи схем. Хранятся в `Brand.colorScheme`; менять ключ = потерять выбор клиента. */
export const BRAND_COLOR_SCHEME = {
  NYAMBOT: "nyambot",
  RED: "red",
  BURGUNDY: "burgundy",
  PINK: "pink",
  PURPLE: "purple",
  BLUE: "blue",
  TEAL: "teal",
  GREEN: "green",
  MUSTARD: "mustard",
  COFFEE: "coffee",
} as const;

export type BrandColorSchemeKey =
  (typeof BRAND_COLOR_SCHEME)[keyof typeof BRAND_COLOR_SCHEME];

/** Палитра схемы — всё, что витрина и страница выбора мессенджера берут из бренда. */
export interface BrandPalette {
  /** Основной акцент: кнопки, цена, активные чипы, таб-бар. `#rrggbb`. */
  accent: string;
  /** Второй конец градиента кнопки. `#rrggbb`. */
  accentDark: string;
  /** Акцент каналами для `rgba(var(--accent-rgb), a)`: `"r, g, b"`. */
  accentRgb: string;
  /** Текст на акцентной кнопке. `#rrggbb`. */
  onAccent: string;
  /** Плотный фон активного элемента в плоском режиме MAX: `"r, g, b"`. */
  flatRgb: string;
  /**
   * Акцентный текст и иконки на тёмном и подкрашенном акцентом фоне. У тёмных
   * схем светлее акцента: красный текст на красной подложке не читается
   * (находка Руслана 30.09 на «Кусочке»). У Нямбота = акцент.
   */
  accentText: string;
  /** Текст выбранного сегмента и пункта списка — у Нямбота мягче акцента. */
  accentTextSoft: string;
}

/**
 * Схема каталога. Подписи плиток — в словарях СРМ (`brands:branding_scheme_<key>`),
 * не здесь: каталог общий для четырёх проектов и живёт без языка.
 */
export interface BrandColorScheme {
  key: BrandColorSchemeKey | CustomColorSchemeKey;
  palette: BrandPalette;
}

/** Схема Нямбота — она же «по умолчанию». Значения = прежняя тема витрины. */
export const NYAMBOT_COLOR_SCHEME: BrandColorScheme = {
  key: BRAND_COLOR_SCHEME.NYAMBOT,
  palette: {
    accent: "#ff8c00",
    accentDark: "#ff6b00",
    accentRgb: "255, 140, 0",
    onAccent: "#ffffff",
    flatRgb: "120, 66, 0",
    accentText: "#ff8c00",
    accentTextSoft: "#ffb45a",
  },
};

/** Каталог в порядке плиток СРМ. Первая — схема Нямбота. */
export const BRAND_COLOR_SCHEMES: readonly BrandColorScheme[] = [
  NYAMBOT_COLOR_SCHEME,
  {
    key: BRAND_COLOR_SCHEME.RED,
    palette: {
      accent: "#e53935",
      accentDark: "#c62828",
      accentRgb: "229, 57, 53",
      onAccent: "#ffffff",
      flatRgb: "112, 24, 22",
      accentText: "#ed7472",
      accentTextSoft: "#ed7472",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.BURGUNDY,
    palette: {
      accent: "#b83250",
      accentDark: "#962140",
      accentRgb: "184, 50, 80",
      onAccent: "#ffffff",
      flatRgb: "92, 22, 38",
      accentText: "#d17a8d",
      accentTextSoft: "#d17a8d",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.PINK,
    palette: {
      accent: "#ec407a",
      accentDark: "#d81b60",
      accentRgb: "236, 64, 122",
      onAccent: "#ffffff",
      flatRgb: "112, 26, 56",
      accentText: "#f1709b",
      accentTextSoft: "#f1709b",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.PURPLE,
    palette: {
      accent: "#9c5cff",
      accentDark: "#7c3aed",
      accentRgb: "156, 92, 255",
      onAccent: "#ffffff",
      flatRgb: "66, 34, 118",
      accentText: "#b585ff",
      accentTextSoft: "#b585ff",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.BLUE,
    palette: {
      accent: "#2f80ed",
      accentDark: "#1c64d1",
      accentRgb: "47, 128, 237",
      onAccent: "#ffffff",
      flatRgb: "20, 56, 110",
      accentText: "#63a0f2",
      accentTextSoft: "#63a0f2",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.TEAL,
    palette: {
      accent: "#14b8a6",
      accentDark: "#0d9488",
      accentRgb: "20, 184, 166",
      onAccent: "#ffffff",
      flatRgb: "8, 78, 70",
      accentText: "#20bcaa",
      accentTextSoft: "#20bcaa",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.GREEN,
    palette: {
      accent: "#43a047",
      accentDark: "#2e7d32",
      accentRgb: "67, 160, 71",
      onAccent: "#ffffff",
      flatRgb: "26, 72, 28",
      accentText: "#69b36c",
      accentTextSoft: "#69b36c",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.MUSTARD,
    palette: {
      accent: "#e0a800",
      accentDark: "#c68f00",
      accentRgb: "224, 168, 0",
      onAccent: "#1a1a1a",
      flatRgb: "104, 76, 0",
      accentText: "#e0a800",
      accentTextSoft: "#e0a800",
    },
  },
  {
    key: BRAND_COLOR_SCHEME.COFFEE,
    palette: {
      accent: "#b07a4f",
      accentDark: "#8d5a36",
      accentRgb: "176, 122, 79",
      onAccent: "#ffffff",
      flatRgb: "80, 52, 30",
      accentText: "#c09572",
      accentTextSoft: "#c09572",
    },
  },
];

const SCHEME_BY_KEY: ReadonlyMap<string, BrandColorScheme> = new Map(
  BRAND_COLOR_SCHEMES.map((scheme) => [scheme.key, scheme]),
);

/**
 * «Свой цвет» (Руслан 30.09): ключ `custom:#rrggbb`. Палитра считается из
 * одного цвета (`derivePaletteFromColor`), читаемость проверяется тем же
 * порогом, что у готовых схем: акцент на фоне витрины — не ниже 3:1.
 */
export const CUSTOM_COLOR_SCHEME_PREFIX = "custom:";

export type CustomColorSchemeKey = `custom:#${string}`;

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Цвет из ключа `custom:#rrggbb` (в нижнем регистре) или `null`. */
export const parseCustomColor = (
  key: string | null | undefined,
): string | null => {
  if (!key?.startsWith(CUSTOM_COLOR_SCHEME_PREFIX)) return null;
  const hex = key.slice(CUSTOM_COLOR_SCHEME_PREFIX.length);
  return HEX_COLOR.test(hex) ? hex.toLowerCase() : null;
};

export const toCustomColorSchemeKey = (hex: string): CustomColorSchemeKey =>
  `${CUSTOM_COLOR_SCHEME_PREFIX}${hex.toLowerCase()}` as CustomColorSchemeKey;

/** Ключ из каталога или читаемый свой цвет? Для проверки ввода API и формы. */
export const isColorSchemeKey = (
  value: unknown,
): value is BrandColorSchemeKey | CustomColorSchemeKey => {
  if (typeof value !== "string") return false;
  if (SCHEME_BY_KEY.has(value)) return true;
  const custom = parseCustomColor(value);
  return custom !== null && isCustomColorReadable(custom);
};

/**
 * Схема по ключу из базы. `null`, пустой и неизвестный ключ → Нямбот (Р4):
 * убранная из каталога схема не ломает витрину, а возвращает цвета по умолчанию.
 * Свой цвет, который не читается, витрина берёт ближайшим читаемым оттенком.
 */
export const resolveColorScheme = (
  key: string | null | undefined,
): BrandColorScheme => {
  const custom = parseCustomColor(key);
  if (custom) {
    const readable = nearestReadableColor(custom);
    return {
      key: toCustomColorSchemeKey(readable),
      palette: derivePaletteFromColor(readable),
    };
  }
  return (key ? SCHEME_BY_KEY.get(key) : undefined) ?? NYAMBOT_COLOR_SCHEME;
};

/**
 * Ключ для записи в базу: схема Нямбота хранится как `null` — «бренд не
 * настроен» и «вернули цвета по умолчанию» одно и то же состояние.
 */
export const toStoredColorScheme = (
  key: string | null | undefined,
): BrandColorSchemeKey | CustomColorSchemeKey | null => {
  const scheme = resolveColorScheme(key);
  return scheme.key === BRAND_COLOR_SCHEME.NYAMBOT ? null : scheme.key;
};

/** Фон витрины — от него считается читаемость акцента. */
export const BRAND_SURFACE_BACKGROUND = "#0f0f14";

const channelToLinear = (channel: number): number => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** Относительная яркость по WCAG 2.x для `#rrggbb`. */
export const relativeLuminance = (hex: string): number => {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);

  if (!match) {
    throw new Error(`Expected #rrggbb color, got: ${hex}`);
  }

  const channel = (part: string | undefined): number =>
    channelToLinear(Number.parseInt(part ?? "0", 16));

  return (
    0.2126 * channel(match[1]) +
    0.7152 * channel(match[2]) +
    0.0722 * channel(match[3])
  );
};

/** Контраст двух цветов по WCAG 2.x (1…21). */
export const contrastRatio = (first: string, second: string): number => {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

/** `"r, g, b"` → `#rrggbb` — чтобы сверять каналы с hex в сторожах. */
export const rgbChannelsToHex = (channels: string): string => {
  const parts = channels.split(",").map((part) => Number(part.trim()));

  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    throw new Error(`Expected "r, g, b" channels, got: ${channels}`);
  }

  return `#${parts.map((part) => part.toString(16).padStart(2, "0")).join("")}`;
};

/** Порог читаемости акцента на фоне витрины — у готовых схем и у своего цвета. */
export const ACCENT_ON_BACKGROUND_MIN = 3;
/** Порог светлого текста на подкрашенном акцентом фоне. */
export const ACCENT_TEXT_ON_TINT_MIN = 4.5;
/** Насколько акцент подкрашивает подложку чипа и сегмента в витрине. */
export const ACCENT_TINT_ALPHA = 0.32;

const hexToChannels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const channelsToHex = (channels: readonly number[]): string =>
  `#${channels
    .map((value) =>
      Math.round(Math.min(255, Math.max(0, value)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

/** Цвет, смешанный с `target` на долю `share` (0 — исходный, 1 — target). */
const mixColors = (hex: string, target: string, share: number): string => {
  const from = hexToChannels(hex);
  const to = hexToChannels(target);
  return channelsToHex(
    from.map((value, index) => value + ((to[index] ?? 0) - value) * share),
  );
};

/** Цвет поверх фона с прозрачностью — как его видит глаз. */
export const blendOver = (
  hex: string,
  alpha: number,
  background: string,
): string => mixColors(background, hex, alpha);

const WHITE = "#ffffff";
const BLACK = "#000000";
const DARK_TEXT = "#1a1a1a";
const MIX_STEP = 0.05;

/** Осветлять белым, пока контраст с `against` не дорастёт до `min`. */
const lightenUntil = (
  hex: string,
  against: (color: string) => string,
  min: number,
): string => {
  let color = hex;
  for (
    let share = MIX_STEP;
    contrastRatio(color, against(color)) < min && share <= 1;
    share += MIX_STEP
  ) {
    color = mixColors(hex, WHITE, share);
  }
  return color;
};

/** Читается ли свой цвет на фоне витрины. */
export const isCustomColorReadable = (hex: string): boolean =>
  HEX_COLOR.test(hex) &&
  contrastRatio(hex, BRAND_SURFACE_BACKGROUND) >= ACCENT_ON_BACKGROUND_MIN;

/** Ближайший читаемый оттенок: тот же цвет, осветлённый ровно настолько, насколько нужно. */
export const nearestReadableColor = (hex: string): string =>
  lightenUntil(
    hex.toLowerCase(),
    () => BRAND_SURFACE_BACKGROUND,
    ACCENT_ON_BACKGROUND_MIN,
  );

/**
 * Палитра из одного цвета — для «Своего цвета». Готовые схемы подобраны руками,
 * здесь то же самое считается: тёмный конец градиента — на 15 % темнее, текст
 * на кнопке — белый или тёмный, что читается лучше, плоский фон MAX — глубокая
 * тень цвета, светлый текст — осветление до порога на подкрашенном фоне.
 */
export const derivePaletteFromColor = (input: string): BrandPalette => {
  const accent = input.toLowerCase();
  const channels = hexToChannels(accent);
  const accentText = lightenUntil(
    accent,
    () => blendOver(accent, ACCENT_TINT_ALPHA, BRAND_SURFACE_BACKGROUND),
    ACCENT_TEXT_ON_TINT_MIN,
  );
  const flat = hexToChannels(mixColors(accent, BLACK, 0.6));

  return {
    accent,
    accentDark: mixColors(accent, BLACK, 0.15),
    accentRgb: channels.join(", "),
    onAccent:
      contrastRatio(WHITE, accent) >= contrastRatio(DARK_TEXT, accent)
        ? WHITE
        : DARK_TEXT,
    flatRgb: flat.join(", "),
    accentText,
    accentTextSoft: accentText,
  };
};
