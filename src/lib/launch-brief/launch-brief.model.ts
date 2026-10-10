/**
 * Заявка на запуск — модель ответов (план `docs-nyambot/features/onboarding/brif-zapuska-2026-10-09`, Ф2).
 *
 * Для гостя сайта это «Заявка на запуск», слово «бриф» в интерфейсе не
 * показываем (Р24). Форма короткая (решение 10.10): имя, почта, контакт,
 * заведение, сайт, сколько точек, касса, платёжная система, комментарий —
 * остальное оператор выясняет в диалоге и вносит в админке. Поля, варианты и
 * пределы длины — ровно как в контракте main-server
 * (`main-server-nyambot/config/leads/launch-brief.config.ts`,
 * `server/utils/leads/launch-brief.util.ts`): значение варианта уходит на
 * сервер как есть, и чужое значение он отбросил бы целиком заявкой.
 *
 * Модель общая у формы в браузере, черновика в `localStorage` и прокси
 * `src/app/api/lead/route.ts` — поэтому здесь нет ни React, ни текстов:
 * подписи живут в `src/config/zapusk-page.config.ts`.
 */

type ValueOf<T> = T[keyof T];

/* ─────────────────────────── варианты ответов ─────────────────────────── */

export const BRIEF_POS = {
  IIKO: "IIKO",
  RKEEPER: "RKEEPER",
  OTHER: "OTHER",
  NONE: "NONE",
  UNKNOWN: "UNKNOWN",
} as const;
export type BriefPos = ValueOf<typeof BRIEF_POS>;

export const BRIEF_ONLINE_PAYMENT = {
  YOOKASSA: "YOOKASSA",
  YANDEX_PAY: "YANDEX_PAY",
  OTHER_BANK: "OTHER_BANK",
  NONE: "NONE",
} as const;
export type BriefOnlinePayment = ValueOf<typeof BRIEF_ONLINE_PAYMENT>;

/* ──────────────────────────────── поля ──────────────────────────────── */

/**
 * Имена полей — те же ключи, что в `payload` для main-server. Город сервер
 * тоже принимает, но короткая форма его не спрашивает — и не шлёт.
 */
export const BRIEF_FIELD = {
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  MAX: "max",
  TELEGRAM: "telegram",
  VENUE: "venue",
  SITE: "site",
  OUTLETS_TOTAL: "outletsTotal",
  POS: "pos",
  ONLINE_PAYMENT: "onlinePayment",
  COMMENT: "comment",
} as const;

/** Пределы длины main-server (`LAUNCH_BRIEF_LIMIT`). */
export const BRIEF_LIMIT = {
  SHORT_TEXT: 200,
  URL: 500,
  LONG_TEXT: 2_000,
  PAGE: 300,
  VISITOR_IP: 64,
  /** Число точек: от 1 до 1000 — четыре цифры в поле ввода. */
  OUTLETS_MIN: 1,
  OUTLETS_MAX: 1_000,
  OUTLETS_INPUT: 4,
} as const;

/**
 * Текстовые ответы и их предел длины. Пустая строка — «не ответил».
 * Число точек вводится текстом, а на сервер уходит числом — оно отдельно.
 */
export const BRIEF_TEXT_MAX_LENGTH = {
  [BRIEF_FIELD.NAME]: BRIEF_LIMIT.SHORT_TEXT,
  [BRIEF_FIELD.EMAIL]: BRIEF_LIMIT.SHORT_TEXT,
  [BRIEF_FIELD.PHONE]: BRIEF_LIMIT.SHORT_TEXT,
  [BRIEF_FIELD.MAX]: BRIEF_LIMIT.SHORT_TEXT,
  [BRIEF_FIELD.TELEGRAM]: BRIEF_LIMIT.SHORT_TEXT,
  [BRIEF_FIELD.VENUE]: BRIEF_LIMIT.SHORT_TEXT,
  [BRIEF_FIELD.SITE]: BRIEF_LIMIT.URL,
  [BRIEF_FIELD.COMMENT]: BRIEF_LIMIT.LONG_TEXT,
} as const;

export type BriefTextField = keyof typeof BRIEF_TEXT_MAX_LENGTH;

/** Число точек: в форме — текст, в `payload` — целое или `null`. */
export type BriefNumberField = typeof BRIEF_FIELD.OUTLETS_TOTAL;

/** Что пользователь вводит руками: все текстовые поля и число точек. */
export type BriefTextInputField = BriefTextField | BriefNumberField;

/** Один вариант из списка — значения ровно enum main-server. */
export const BRIEF_CHOICE_VALUES = {
  [BRIEF_FIELD.POS]: BRIEF_POS,
  [BRIEF_FIELD.ONLINE_PAYMENT]: BRIEF_ONLINE_PAYMENT,
} as const;

export type BriefChoiceField = keyof typeof BRIEF_CHOICE_VALUES;
/**
 * Значения каждого вопроса — отдельной картой: через неё TypeScript видит,
 * что вариант поля-параметра — строка (`ValueOf<…[TField]>` он не сводит).
 */
type BriefChoiceValueMap = {
  [TField in BriefChoiceField]: ValueOf<(typeof BRIEF_CHOICE_VALUES)[TField]>;
};
export type BriefChoiceValue<TField extends BriefChoiceField> =
  BriefChoiceValueMap[TField];
/** `null` — «не ответил». */
export type BriefChoices = {
  [TField in BriefChoiceField]: BriefChoiceValueMap[TField] | null;
};

export type BriefTextInputs = Record<BriefTextInputField, string>;

/** Состояние формы: текст как введён и варианты. */
export interface LaunchBriefFormState {
  texts: BriefTextInputs;
  choices: BriefChoices;
}

/** Ответы в том виде, в каком их ждёт main-server. */
export type LaunchBriefAnswers = Record<BriefTextField, string> &
  Record<BriefNumberField, number | null> &
  BriefChoices;

/** Тело `payload` от браузера до прокси лендинга. */
export type LaunchBriefRequestPayload = LaunchBriefAnswers & {
  consent: boolean;
  page: string;
  /** Когда открыли форму, мс от эпохи. Нет — поле не передаём вовсе. */
  startedAt?: number;
  /** Поле-ловушка: человек его не видит и оставляет пустым. */
  website2: string;
};

/**
 * Части multipart-запроса — и от браузера, и от прокси к main-server. Часть
 * одна: файлов форма не прикладывает (решение 10.10).
 */
export const BRIEF_FORM_PART = {
  PAYLOAD: "payload",
} as const;

/** Коды отказа main-server и прокси — их форма превращает в текст. */
export const BRIEF_ERROR = {
  INVALID_BODY: "invalid_body",
  NAME_REQUIRED: "name_required",
  CONTACT_REQUIRED: "contact_required",
  INVALID_PHONE: "invalid_phone",
  INVALID_TELEGRAM: "invalid_telegram",
  INVALID_MAX: "invalid_max",
  INVALID_EMAIL: "invalid_email",
  VENUE_REQUIRED: "venue_required",
  INVALID_SITE: "invalid_site",
  /**
   * Только проверка в браузере: у main-server такого кода нет — число точек
   * не из диапазона прокси и так отправит «не ответил».
   */
  INVALID_OUTLETS: "invalid_outlets",
  POS_REQUIRED: "pos_required",
  CONSENT_REQUIRED: "consent_required",
  RATE_LIMITED: "rate_limited",
  /** Свой код прокси: main-server недоступен или не настроен. */
  UNAVAILABLE: "unavailable",
} as const;
export type BriefErrorCode = ValueOf<typeof BRIEF_ERROR>;

/* ───────────────────────────── пустая форма ───────────────────────────── */

export const EMPTY_BRIEF_TEXTS: BriefTextInputs = {
  [BRIEF_FIELD.NAME]: "",
  [BRIEF_FIELD.EMAIL]: "",
  [BRIEF_FIELD.PHONE]: "",
  [BRIEF_FIELD.MAX]: "",
  [BRIEF_FIELD.TELEGRAM]: "",
  [BRIEF_FIELD.VENUE]: "",
  [BRIEF_FIELD.SITE]: "",
  [BRIEF_FIELD.OUTLETS_TOTAL]: "",
  [BRIEF_FIELD.COMMENT]: "",
};

export const EMPTY_BRIEF_CHOICES: BriefChoices = {
  [BRIEF_FIELD.POS]: null,
  [BRIEF_FIELD.ONLINE_PAYMENT]: null,
};

export const createEmptyBriefState = (): LaunchBriefFormState => ({
  texts: { ...EMPTY_BRIEF_TEXTS },
  choices: { ...EMPTY_BRIEF_CHOICES },
});

/* ───────────────────────────── разбор чужого ───────────────────────────── */

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Ключи объекта с их точным типом — без приведения типов. */
export const keysOf = <TObject extends object>(
  object: TObject,
): Array<Extract<keyof TObject, string>> =>
  Object.keys(object).filter((key): key is Extract<keyof TObject, string> =>
    Object.prototype.hasOwnProperty.call(object, key),
  );

/** Значение из списка вариантов или `null` — всё прочее отбрасываем. */
export const enumValueOf = <TValue extends string>(
  values: Readonly<Record<string, TValue>>,
  raw: unknown,
): TValue | null => {
  for (const value of Object.values(values)) {
    if (value === raw) return value;
  }
  return null;
};

/** Строка не длиннее предела; не строка — пустая. */
export const textOf = (raw: unknown, maxLength: number): string =>
  typeof raw === "string" ? raw.slice(0, maxLength) : "";

/** Варианты из произвольного объекта — каждый строго по своему списку. */
export const choicesOf = (source: Record<string, unknown>): BriefChoices => ({
  [BRIEF_FIELD.POS]: enumValueOf(BRIEF_POS, source[BRIEF_FIELD.POS]),
  [BRIEF_FIELD.ONLINE_PAYMENT]: enumValueOf(
    BRIEF_ONLINE_PAYMENT,
    source[BRIEF_FIELD.ONLINE_PAYMENT],
  ),
});

const isTextField = (field: string): field is BriefTextField =>
  Object.prototype.hasOwnProperty.call(BRIEF_TEXT_MAX_LENGTH, field);

/** Предел длины поля ввода: у числа точек — четыре цифры. */
export const inputMaxLengthOf = (field: BriefTextInputField): number =>
  isTextField(field) ? BRIEF_TEXT_MAX_LENGTH[field] : BRIEF_LIMIT.OUTLETS_INPUT;

/** Текст формы из произвольного объекта (черновик) — только известные поля. */
export const textInputsOf = (
  source: Record<string, unknown>,
): BriefTextInputs => {
  const texts: BriefTextInputs = { ...EMPTY_BRIEF_TEXTS };
  for (const field of keysOf(texts)) {
    texts[field] = textOf(source[field], inputMaxLengthOf(field));
  }
  return texts;
};

/**
 * Состояние формы из произвольного значения (черновик из `localStorage`):
 * чужие ключи и значения не из списков отбрасываются — в том числе ответы
 * прежней длинной формы (город, адреса, флажки и т. п.). Не похоже на
 * форму — `null`.
 */
export const sanitizeBriefFormState = (
  raw: unknown,
): LaunchBriefFormState | null => {
  if (!isRecord(raw)) return null;
  const { texts, choices } = raw;
  if (!isRecord(texts) || !isRecord(choices)) return null;
  return {
    texts: textInputsOf(texts),
    choices: choicesOf(choices),
  };
};

/** Ничего не заполнено — черновик хранить незачем. */
export const isBriefEmpty = (state: LaunchBriefFormState): boolean =>
  Object.values(state.texts).every((value) => value.trim() === "") &&
  Object.values(state.choices).every((value) => value === null);
