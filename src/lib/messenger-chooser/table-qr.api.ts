import {
  CHOOSER_MESSENGER,
  type IChooserTargets,
} from "./messenger-chooser.types";
import { fetchLogoDataUri, readConfig, readTarget } from "./qr-link.api";
import { CHOOSER_TABLE_TEXT } from "./messenger-chooser.text";

/**
 * Данные QR стола (`nyambot.ru/t/<токен>`, план «Работа с залом», Ф8) — с
 * main-server, по ключу лендинга: заведение, «Стол 12 · Зал», ссылки на ботов
 * сразу с `/start table_<токен>`.
 *
 * Как у общего QR: main-server не ответил — последний удачный ответ, пока жив
 * процесс. 404 (стол перевыпущен, удалён, модуль кончился) — честное «стол
 * недоступен», и прежний ответ забывается: погасший QR чужого не откроет.
 */

const MAIN_SERVER_PATH = "/api/qr-links/public/table";
const TIMEOUT_MS = 4000;

/** Токен стола: 12 букв и цифр — то же правило, что в main-server. */
const TABLE_TOKEN_PATTERN = /^[A-Za-z0-9]{12}$/;

export type ITableQrData = {
  title: string;
  /** «Адрес для гостей» точки (Ф10в п. 1); пусто — без строки адреса. */
  address: string;
  /** «Твой стол № 12 · Зал»; сервер прежней версии — «Стол 12 · Зал». */
  tableLabel: string;
  targets: IChooserTargets;
  logo: string | null;
  colorScheme: string | null;
};

export const TABLE_QR_RESULT = {
  OK: "ok",
  NOT_FOUND: "not_found",
  UNAVAILABLE: "unavailable",
} as const;

export type ITableQrResult =
  | { kind: typeof TABLE_QR_RESULT.OK; data: ITableQrData }
  | { kind: typeof TABLE_QR_RESULT.NOT_FOUND }
  | { kind: typeof TABLE_QR_RESULT.UNAVAILABLE };

const lastKnown = new Map<string, ITableQrData>();

export const isTableToken = (token: string): boolean =>
  TABLE_TOKEN_PATTERN.test(token);

const readOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const DIGITS_ONLY = /^\d+$/;

/**
 * «Твой стол № 12 · Зал» (Ф10в п. 1). Стол — как в боте и на сервере
 * (`tableLabelOf`): имя совпадает с номером или пусто — номер; имя из цифр —
 * оно; иначе имя в кавычках. Без зала — только стол.
 */
export const yourTableLabel = (table: {
  number: number | null;
  name: string;
  hallName: string;
}): string => {
  const name = table.name.trim();
  const numberText =
    table.number !== null && (!name || name === String(table.number))
      ? String(table.number)
      : DIGITS_ONLY.test(name)
        ? name
        : null;
  const title =
    numberText !== null
      ? `${CHOOSER_TABLE_TEXT.prefix} № ${numberText}`
      : `${CHOOSER_TABLE_TEXT.prefix} «${name}»`;
  return [title, table.hallName.trim()].filter(Boolean).join(" · ");
};

const readTable = (
  value: unknown,
): { number: number | null; name: string; hallName: string } | null => {
  if (!value || typeof value !== "object") return null;
  const table = value as {
    number?: unknown;
    name?: unknown;
    hallName?: unknown;
  };
  if (typeof table.name !== "string") return null;
  return {
    number: typeof table.number === "number" ? table.number : null,
    name: table.name,
    hallName: typeof table.hallName === "string" ? table.hallName : "",
  };
};

const parseData = (
  raw: unknown,
): (Omit<ITableQrData, "logo"> & { logoUrl: string | null }) | null => {
  if (!raw || typeof raw !== "object") return null;
  const data = (raw as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const record = data as {
    title?: unknown;
    address?: unknown;
    tableLabel?: unknown;
    table?: unknown;
    targets?: unknown;
    logoUrl?: unknown;
    colorScheme?: unknown;
  };
  if (typeof record.title !== "string") return null;
  const targets =
    record.targets && typeof record.targets === "object"
      ? (record.targets as Record<string, unknown>)
      : {};
  const table = readTable(record.table);
  return {
    title: record.title,
    address: readOptionalString(record.address) ?? "",
    tableLabel: table
      ? yourTableLabel(table)
      : (readOptionalString(record.tableLabel) ?? ""),
    targets: {
      [CHOOSER_MESSENGER.MAX]: readTarget(targets.max),
      [CHOOSER_MESSENGER.TELEGRAM]: readTarget(targets.telegram),
    },
    logoUrl: readOptionalString(record.logoUrl),
    colorScheme: readOptionalString(record.colorScheme),
  };
};

const fallback = (token: string): ITableQrResult => {
  const cached = lastKnown.get(token);
  return cached
    ? { kind: TABLE_QR_RESULT.OK, data: cached }
    : { kind: TABLE_QR_RESULT.UNAVAILABLE };
};

export const fetchTableQr = async (token: string): Promise<ITableQrResult> => {
  const config = readConfig();
  if (!config) return fallback(token);

  try {
    const response = await fetch(
      `${config.apiUrl}${MAIN_SERVER_PATH}/${token}`,
      {
        headers: { "x-api-key": config.apiKey },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      },
    );

    if (response.status === 404) {
      lastKnown.delete(token);
      return { kind: TABLE_QR_RESULT.NOT_FOUND };
    }
    if (!response.ok) {
      console.error(`QR стола: main-server ответил ${response.status}`);
      return fallback(token);
    }

    const raw = parseData(await response.json().catch(() => null));
    if (!raw) return fallback(token);

    const { logoUrl, ...rest } = raw;
    const data: ITableQrData = {
      ...rest,
      logo: await fetchLogoDataUri(config, logoUrl),
    };
    lastKnown.set(token, data);
    return { kind: TABLE_QR_RESULT.OK, data };
  } catch (error) {
    console.error("QR стола: main-server недоступен", error);
    return fallback(token);
  }
};
