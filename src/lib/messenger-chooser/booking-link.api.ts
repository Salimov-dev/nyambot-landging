import {
  CHOOSER_MESSENGER,
  type IChooserTargets,
} from "./messenger-chooser.types";
import { fetchLogoDataUri, readConfig, readTarget } from "./qr-link.api";

/**
 * Данные ссылки на бронь точки (`nyambot.ru/b/<код>`, Ф10в «Бронь — вход») —
 * с main-server, по ключу лендинга: заведение, адрес точки, ссылки на ботов
 * сразу с `?start=book_<код>`.
 *
 * Как у QR стола: main-server не ответил — последний удачный ответ, пока жив
 * процесс. 404 (кода нет, точки нет, ботов нет) и 409 (бронь у точки сейчас не
 * работает) — честный ответ, и прежний ответ забывается: страница не зовёт в
 * бронь, которой уже нет.
 */

const MAIN_SERVER_PATH = "/api/qr-links/public/booking";
const TIMEOUT_MS = 4000;

/** Код ссылки: 22 знака base62 — то же правило, что в main-server. */
const BOOKING_CODE_PATTERN = /^[0-9A-Za-z]{22}$/;

export type IBookingLinkData = {
  title: string;
  /** «Адрес для гостей» точки (Ф10в «Общие правила»); пусто — без строки адреса. */
  address: string;
  targets: IChooserTargets;
  logo: string | null;
  colorScheme: string | null;
};

export const BOOKING_LINK_RESULT = {
  OK: "ok",
  NOT_FOUND: "not_found",
  /** 409 `booking_link_unavailable`: бронь у точки выключена или не работает. */
  BOOKING_OFF: "booking_off",
  /** main-server недоступен и прежнего ответа нет. */
  UNAVAILABLE: "unavailable",
} as const;

export type IBookingLinkResult =
  | { kind: typeof BOOKING_LINK_RESULT.OK; data: IBookingLinkData }
  | { kind: typeof BOOKING_LINK_RESULT.NOT_FOUND }
  | { kind: typeof BOOKING_LINK_RESULT.BOOKING_OFF }
  | { kind: typeof BOOKING_LINK_RESULT.UNAVAILABLE };

const HTTP_STATUS = { NOT_FOUND: 404, CONFLICT: 409 } as const;

const lastKnown = new Map<string, IBookingLinkData>();

export const isBookingCode = (code: string): boolean =>
  BOOKING_CODE_PATTERN.test(code);

const readOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const parseData = (
  raw: unknown,
): (Omit<IBookingLinkData, "logo"> & { logoUrl: string | null }) | null => {
  if (!raw || typeof raw !== "object") return null;
  const data = (raw as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const record = data as {
    title?: unknown;
    address?: unknown;
    targets?: unknown;
    logoUrl?: unknown;
    colorScheme?: unknown;
  };
  if (typeof record.title !== "string") return null;
  const targets =
    record.targets && typeof record.targets === "object"
      ? (record.targets as Record<string, unknown>)
      : {};
  return {
    title: record.title,
    address: readOptionalString(record.address) ?? "",
    targets: {
      [CHOOSER_MESSENGER.MAX]: readTarget(targets.max),
      [CHOOSER_MESSENGER.TELEGRAM]: readTarget(targets.telegram),
    },
    logoUrl: readOptionalString(record.logoUrl),
    colorScheme: readOptionalString(record.colorScheme),
  };
};

const fallback = (code: string): IBookingLinkResult => {
  const cached = lastKnown.get(code);
  return cached
    ? { kind: BOOKING_LINK_RESULT.OK, data: cached }
    : { kind: BOOKING_LINK_RESULT.UNAVAILABLE };
};

export const fetchBookingLink = async (
  code: string,
): Promise<IBookingLinkResult> => {
  const config = readConfig();
  if (!config) return fallback(code);

  try {
    const response = await fetch(
      `${config.apiUrl}${MAIN_SERVER_PATH}/${code}`,
      {
        headers: { "x-api-key": config.apiKey },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      },
    );

    if (response.status === HTTP_STATUS.NOT_FOUND) {
      lastKnown.delete(code);
      return { kind: BOOKING_LINK_RESULT.NOT_FOUND };
    }
    if (response.status === HTTP_STATUS.CONFLICT) {
      lastKnown.delete(code);
      return { kind: BOOKING_LINK_RESULT.BOOKING_OFF };
    }
    if (!response.ok) {
      console.error(`Ссылка на бронь: main-server ответил ${response.status}`);
      return fallback(code);
    }

    const raw = parseData(await response.json().catch(() => null));
    if (!raw) return fallback(code);

    const { logoUrl, ...rest } = raw;
    const data: IBookingLinkData = {
      ...rest,
      logo: await fetchLogoDataUri(config, logoUrl),
    };
    lastKnown.set(code, data);
    return { kind: BOOKING_LINK_RESULT.OK, data };
  } catch (error) {
    console.error("Ссылка на бронь: main-server недоступен", error);
    return fallback(code);
  }
};
