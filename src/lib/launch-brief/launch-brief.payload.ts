/**
 * Тело заявки на запуск: что собирает браузер и что пропускает прокси.
 *
 * Браузер → `/api/lead` (сервер лендинга) → main-server
 * `POST /api/leads/launch-brief`, multipart с одной частью `payload` —
 * JSON-строкой ответов и служебных полей (контракт — `API.md` плана
 * `brif-zapuska-2026-10-09`).
 *
 * Прокси собирает `payload` заново и только из белого списка: всё, что
 * прислал браузер сверх полей заявки, отбрасывается, а значения вариантов
 * проверяются по спискам main-server.
 */
import {
  BRIEF_FIELD,
  BRIEF_LIMIT,
  BRIEF_TEXT_MAX_LENGTH,
  choicesOf,
  isRecord,
  keysOf,
  textOf,
  type BriefTextField,
  type LaunchBriefAnswers,
  type LaunchBriefFormState,
  type LaunchBriefRequestPayload,
} from "./launch-brief.model";
import { parseOutletsInput } from "./launch-brief.validation";

/** Служебные поля `payload`, кроме ответов. */
export const BRIEF_PAYLOAD_META = {
  CONSENT: "consent",
  PAGE: "page",
  STARTED_AT: "startedAt",
  WEBSITE2: "website2",
  /** Добавляет прокси: адрес посетителя для лимита и метки перехода. */
  VISITOR_IP: "visitorIp",
  UTM: "utm",
} as const;

const emptyTextAnswers = (): Record<BriefTextField, string> => ({
  [BRIEF_FIELD.NAME]: "",
  [BRIEF_FIELD.EMAIL]: "",
  [BRIEF_FIELD.PHONE]: "",
  [BRIEF_FIELD.MAX]: "",
  [BRIEF_FIELD.TELEGRAM]: "",
  [BRIEF_FIELD.VENUE]: "",
  [BRIEF_FIELD.SITE]: "",
  [BRIEF_FIELD.COMMENT]: "",
});

/* ─────────────────────────────── браузер ─────────────────────────────── */

/** Ответы из состояния формы: строки обрезаны, число точек — числом. */
export const toBriefAnswers = (
  state: LaunchBriefFormState,
): LaunchBriefAnswers => {
  const texts = emptyTextAnswers();
  for (const field of keysOf(texts)) {
    texts[field] = state.texts[field].trim();
  }

  return {
    ...texts,
    [BRIEF_FIELD.OUTLETS_TOTAL]: parseOutletsInput(state.texts.outletsTotal)
      .value,
    ...state.choices,
  };
};

/** `payload`, который браузер отправляет прокси лендинга. */
export const buildBriefRequestPayload = (
  state: LaunchBriefFormState,
  meta: {
    consent: boolean;
    page: string;
    startedAt: number | null;
    website2: string;
  },
): LaunchBriefRequestPayload => ({
  ...toBriefAnswers(state),
  [BRIEF_PAYLOAD_META.CONSENT]: meta.consent,
  [BRIEF_PAYLOAD_META.PAGE]: meta.page.slice(0, BRIEF_LIMIT.PAGE),
  ...(meta.startedAt !== null
    ? { [BRIEF_PAYLOAD_META.STARTED_AT]: meta.startedAt }
    : {}),
  [BRIEF_PAYLOAD_META.WEBSITE2]: meta.website2,
});

/* ──────────────────────────────── прокси ──────────────────────────────── */

/** Число точек от браузера: целое от 1 до 1000, иначе — «не ответил». */
const outletsOf = (raw: unknown): number | null =>
  typeof raw === "number" &&
  Number.isInteger(raw) &&
  raw >= BRIEF_LIMIT.OUTLETS_MIN &&
  raw <= BRIEF_LIMIT.OUTLETS_MAX
    ? raw
    : null;

/**
 * Белый список `payload`: ответы заявки и служебные поля (согласие, страница,
 * время открытия формы, ловушка). Строки — не длиннее пределов main-server,
 * варианты — только из его списков. Всё прочее, что прислал браузер (в том
 * числе ответы прежней длинной формы), сюда не попадает.
 */
export const pickLaunchBriefPayload = (
  raw: unknown,
): LaunchBriefRequestPayload => {
  const source: Record<string, unknown> = isRecord(raw) ? raw : {};

  const texts = emptyTextAnswers();
  for (const field of keysOf(texts)) {
    texts[field] = textOf(source[field], BRIEF_TEXT_MAX_LENGTH[field]);
  }

  const startedAt = source[BRIEF_PAYLOAD_META.STARTED_AT];

  return {
    ...texts,
    [BRIEF_FIELD.OUTLETS_TOTAL]: outletsOf(source[BRIEF_FIELD.OUTLETS_TOTAL]),
    ...choicesOf(source),
    [BRIEF_PAYLOAD_META.CONSENT]: source[BRIEF_PAYLOAD_META.CONSENT] === true,
    [BRIEF_PAYLOAD_META.PAGE]: textOf(
      source[BRIEF_PAYLOAD_META.PAGE],
      BRIEF_LIMIT.PAGE,
    ),
    ...(typeof startedAt === "number" && Number.isFinite(startedAt)
      ? { [BRIEF_PAYLOAD_META.STARTED_AT]: startedAt }
      : {}),
    [BRIEF_PAYLOAD_META.WEBSITE2]: textOf(
      source[BRIEF_PAYLOAD_META.WEBSITE2],
      BRIEF_LIMIT.SHORT_TEXT,
    ),
  };
};

/* ──────────────────────────────── ответы ──────────────────────────────── */

/** Конверт main-server: `{ success, data }` или `{ success: false, error }`. */
export const readMainServerReply = (
  data: unknown,
): { success: boolean; error: string | null } => {
  if (!isRecord(data)) return { success: false, error: null };
  return {
    success: data.success === true,
    error: typeof data.error === "string" ? data.error : null,
  };
};

/** Ответ прокси лендинга браузеру: `{ ok: true }` или `{ ok: false, error }`. */
export const readLeadReply = (
  data: unknown,
): { ok: boolean; error: string | null } => {
  if (!isRecord(data)) return { ok: false, error: null };
  return {
    ok: data.ok === true,
    error: typeof data.error === "string" ? data.error : null,
  };
};
