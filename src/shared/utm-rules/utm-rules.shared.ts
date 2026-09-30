// ────────────────────────────────────────────────────────────────────────────
// СГЕНЕРИРОВАННАЯ КОПИЯ. НЕ ПРАВИТЬ РУКАМИ.
//
// Источник: workspace-scripts/shared-utm-rules/utm-rules.source.ts
// Обновить: node workspace-scripts/scripts/sync-utm-rules.mjs
//
// Правила UTM-меток живут в одном месте (план «UTM-метки», Р6). Правка этого
// файла мимо источника падает тестом «копия совпадает с источником».
//
// SOURCE_SHA256: 367fb8b8006933d6f55afb61e7c0554600eaf47cf35fb47fda397338333e2c33
// ────────────────────────────────────────────────────────────────────────────

/**
 * ОБЩИЕ ПРАВИЛА UTM-МЕТОК — единственный источник.
 *
 * План «UTM-метки» (30.09.2026), решения Р1–Р8.
 *
 * ## Зачем
 *
 * Подпись «Разработано Нямбот» стоит в мини-аппе, СРМ, «Команде» и на странице
 * выбора мессенджера, но переход по ней Метрика записывала «прямым заходом»:
 * ссылка шла без меток, а `rel="noreferrer"` и мессенджеры срезают источник.
 * Метки ставят семь проектов, куку пишет лендинг, читает СРМ, чистит сервер —
 * одно правило в семи копиях разошлось бы. Поэтому источник один, а проекты
 * получают его копией (`sync-utm-rules.mjs`), как деньги, телефон и бренд.
 *
 * ## Правила
 *
 * - `utm_source` — площадка, `utm_medium` — вид ссылки, `utm_campaign` —
 *   место на площадке, `utm_content` — клиент, чьи гости или сотрудники
 *   перешли. Значения — только из каталогов ниже, не строками по месту.
 * - Метка клиента — идентификатор (бот, ТТ, аккаунт, адрес QR-кода), никаких
 *   имён и контактов. Нет данных о клиенте — метки нет, ссылка всё равно
 *   рабочая и с тремя остальными.
 * - Без `utm_source` меток нет вовсе: пятёрка без площадки ничего не говорит.
 * - Очистка мягкая: `utm_term` Директа — это фраза с кириллицей и пробелами,
 *   её не режем по алфавиту, только убираем управляющие символы и ограничиваем
 *   длину. Кривая метка отбрасывается, а не роняет регистрацию.
 */

/** Имена параметров в адресе. */
export const UTM_PARAM = {
  SOURCE: "utm_source",
  MEDIUM: "utm_medium",
  CAMPAIGN: "utm_campaign",
  CONTENT: "utm_content",
  TERM: "utm_term",
} as const;

/** Р1. Площадка, с которой ушла ссылка. */
export const UTM_SOURCE = {
  MINIAPP: "miniapp",
  CRM: "crm",
  CREW: "crew",
  /** Страница выбора мессенджера заведения `nyambot.ru/go/<адрес>`. */
  QR_PAGE: "qr_page",
  /** Страница выбора мессенджера демо `nyambot.ru/demo`. */
  DEMO_PAGE: "demo_page",
  DEMO_BOT: "demo_bot",
  /** Транзакционные письма (подвал «Сайт»). Холодные письма — без меток. */
  EMAIL: "email",
  GUIDE: "guide",
  LANDING: "landing",
} as const;

/** Р2. Вид ссылки. */
export const UTM_MEDIUM = {
  /** Подпись «Разработано / Работает на Нямботе» внутри продукта. */
  POWERED_BY: "powered_by",
  /** Своя ссылка между нашими сайтами: логотип СРМ, шапка руководства. */
  CROSS_LINK: "cross_link",
  EMAIL: "email",
  QR: "qr",
} as const;

/** Р3. Место ссылки на площадке. */
export const UTM_CAMPAIGN = {
  FOOTER: "footer",
  LOGO: "logo",
  HEADER: "header",
  CHOOSER: "chooser",
  WELCOME: "welcome",
  ORDER_PLACED: "order_placed",
  DEMO_QR: "demo_qr",
  /** Ссылка из текста статьи руководства. */
  ARTICLE: "article",
} as const;

/** Мессенджер демо-бота — метка клиента у `demo_bot`. */
export const UTM_MESSENGER = {
  TELEGRAM: "tg",
  MAX: "max",
} as const;

export type UtmSource = (typeof UTM_SOURCE)[keyof typeof UTM_SOURCE];
export type UtmMedium = (typeof UTM_MEDIUM)[keyof typeof UTM_MEDIUM];
export type UtmCampaign = (typeof UTM_CAMPAIGN)[keyof typeof UTM_CAMPAIGN];

/** Метки ссылки, которую ставим мы. */
export interface UtmTags {
  source: UtmSource;
  medium: UtmMedium;
  campaign: UtmCampaign;
  /** Метка клиента. `null`/`undefined` — клиента не знаем, поля нет. */
  content?: string | null;
}

/** Метки, пришедшие извне (адрес, кука, тело запроса), после очистки. */
export interface UtmMarks {
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

/** Идентификатор в метке клиента: UUID, cuid, число, латинский адрес QR-кода. */
const CLIENT_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

const clientLabel =
  (prefix: string) =>
  (id: string | number | null | undefined): string | undefined => {
    if (id === null || id === undefined) return undefined;
    const value = String(id).trim();
    return CLIENT_ID_PATTERN.test(value) ? `${prefix}-${value}` : undefined;
  };

/** Р4. Метка клиента: чей бот, ТТ, аккаунт или QR-код. */
export const UTM_CLIENT = {
  bot: clientLabel("bot"),
  store: clientLabel("store"),
  account: clientLabel("account"),
  qr: clientLabel("qr"),
} as const;

/**
 * Основа для относительного адреса: сама в результат не попадает. Именно
 * `localhost`, а не выдуманный домен: сторож CSP ищет внешние хосты в исходниках
 * всех проектов и выдуманный принял бы за настоящий.
 */
const RELATIVE_BASE = "http://localhost";

/**
 * Ссылка с метками. Прежний query и `#` сохраняются, наши метки заменяют
 * одноимённые. Относительный адрес остаётся относительным.
 */
export const buildTrackedUrl = (base: string, tags: UtmTags): string => {
  const isRelative = base.startsWith("/");
  const url = new URL(base, RELATIVE_BASE);

  url.searchParams.set(UTM_PARAM.SOURCE, tags.source);
  url.searchParams.set(UTM_PARAM.MEDIUM, tags.medium);
  url.searchParams.set(UTM_PARAM.CAMPAIGN, tags.campaign);
  if (tags.content) {
    url.searchParams.set(UTM_PARAM.CONTENT, tags.content);
  } else {
    url.searchParams.delete(UTM_PARAM.CONTENT);
  }

  return isRelative
    ? `${url.pathname}${url.search}${url.hash}`
    : url.toString();
};

/** Длина одной метки после очистки. Кука из пяти таких укладывается в 4 КБ. */
export const UTM_VALUE_MAX_LENGTH = 100;

/** Управляющие символы ASCII: перевод строки в метке сломал бы письмо и лог. */
const FIRST_PRINTABLE_CODE = 0x20;
const DELETE_CODE = 0x7f;

const isPrintable = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return code >= FIRST_PRINTABLE_CODE && code !== DELETE_CODE;
};

/** Одна метка: строка без управляющих символов, обрезанная; пустое → нет. */
export const normalizeUtmValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const cleaned = Array.from(value).filter(isPrintable).join("").trim();
  if (!cleaned) return undefined;
  return cleaned.slice(0, UTM_VALUE_MAX_LENGTH).trim();
};

/**
 * Пятёрка меток из произвольного объекта `{source, medium, campaign,
 * content, term}`. Без площадки — `null`.
 */
export const normalizeUtm = (raw: unknown): UtmMarks | null => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;

  const source = normalizeUtmValue(record.source);
  if (!source) return null;

  const marks: UtmMarks = { source };
  const medium = normalizeUtmValue(record.medium);
  const campaign = normalizeUtmValue(record.campaign);
  const content = normalizeUtmValue(record.content);
  const term = normalizeUtmValue(record.term);
  if (medium) marks.medium = medium;
  if (campaign) marks.campaign = campaign;
  if (content) marks.content = content;
  if (term) marks.term = term;
  return marks;
};

/** Метки из строки запроса (`?utm_source=…` или без `?`). */
export const readUtmFromSearch = (search: string): UtmMarks | null => {
  const params = new URLSearchParams(search);
  return normalizeUtm({
    source: params.get(UTM_PARAM.SOURCE),
    medium: params.get(UTM_PARAM.MEDIUM),
    campaign: params.get(UTM_PARAM.CAMPAIGN),
    content: params.get(UTM_PARAM.CONTENT),
    term: params.get(UTM_PARAM.TERM),
  });
};

/**
 * Р5. Кука меток на весь `nyambot.ru`: лендинг пишет, СРМ читает при
 * регистрации. Новый переход с метками перезаписывает прежний — как `nb_yclid`.
 */
export const UTM_COOKIE = {
  NAME: "nb_utm",
  MAX_AGE_DAYS: 90,
  ROOT_DOMAIN: "nyambot.ru",
} as const;

/** Значение куки: JSON в `encodeURIComponent` — в куке нельзя `;`, `,` и пробел. */
export const serializeUtmCookie = (marks: UtmMarks): string =>
  encodeURIComponent(JSON.stringify(marks));

/** Разбор куки. Битая, чужая или пустая — `null`, никогда не исключение. */
export const parseUtmCookie = (
  raw: string | null | undefined,
): UtmMarks | null => {
  if (!raw) return null;
  try {
    return normalizeUtm(JSON.parse(decodeURIComponent(raw)));
  } catch {
    return null;
  }
};

/**
 * Р8. Откуда человек нажал «Старт» в демо-боте: ссылка несёт
 * `?start=src_<источник>`. Источники — закрытый список: счётчик не должен
 * заводить строку на любой присланный текст.
 */
export const DEMO_START_SOURCE = {
  /** Кнопки демо-ботов на лендинге и посадочных. */
  LANDING: "landing",
  /** Страница `/demo`, открытая ссылкой или кнопкой. */
  DEMO_PAGE: "demo_page",
  /** Страница `/demo`, открытая сканом демо-QR с лендинга. */
  DEMO_QR: "demo_qr",
} as const;

export type DemoStartSource =
  (typeof DEMO_START_SOURCE)[keyof typeof DEMO_START_SOURCE];

const DEMO_START_PREFIX = "src_";

/** Параметр `start` диплинка демо-бота. */
export const buildDemoStartPayload = (source: DemoStartSource): string =>
  `${DEMO_START_PREFIX}${source}`;

/** Источник из параметра `start`. Чужой или неизвестный — `null`. */
export const parseDemoStartPayload = (
  payload: string | null | undefined,
): DemoStartSource | null => {
  if (!payload || !payload.startsWith(DEMO_START_PREFIX)) return null;
  const source = payload.slice(DEMO_START_PREFIX.length);
  return (
    Object.values(DEMO_START_SOURCE).find((known) => known === source) ?? null
  );
};

/** Ссылка на демо-бота с источником старта (`t.me/…?start=…`, `max.ru/…?start=…`). */
export const buildDemoBotLink = (
  botLink: string,
  source: DemoStartSource,
): string => {
  const url = new URL(botLink);
  url.searchParams.set("start", buildDemoStartPayload(source));
  return url.toString();
};
