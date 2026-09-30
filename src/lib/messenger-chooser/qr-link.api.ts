import {
  CHOOSER_MESSENGER,
  type IChooserMessenger,
  type IChooserTargets,
} from "./messenger-chooser.types";

/**
 * Данные общей ссылки заведения — с main-server, по ключу лендинга.
 *
 * 🔴 Отказ main-server не должен гасить QR-код, напечатанный на упаковке: пока
 * процесс лендинга жив, он помнит последний удачный ответ по каждому адресу и
 * отдаёт его, если сервер не ответил. Ссылки на ботов меняются редко, а гость
 * у двери с QR-кодом «страница недоступна» не простит.
 */

const MAIN_SERVER_PATH = "/api/qr-links/public";
const TIMEOUT_MS = 4000;

/** Адрес ссылки: латиница, цифры и дефис — то же правило, что в main-server. */
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;

export type IQrLinkData = {
  title: string;
  targets: IChooserTargets;
  /** Лого заведения data-URI (бренд, иначе бот) или `null`. */
  logo: string | null;
  /** Ключ цветовой схемы бренда; `null` — цвета Нямбота. */
  colorScheme: string | null;
};

/** Ответ main-server до того, как лого превратилось в data-URI. */
type IQrLinkRaw = Omit<IQrLinkData, "logo"> & { logoUrl: string | null };

export const QR_LINK_RESULT = {
  OK: "ok",
  NOT_FOUND: "not_found",
  UNAVAILABLE: "unavailable",
} as const;

export type IQrLinkResult =
  | { kind: typeof QR_LINK_RESULT.OK; data: IQrLinkData }
  | { kind: typeof QR_LINK_RESULT.NOT_FOUND }
  | { kind: typeof QR_LINK_RESULT.UNAVAILABLE };

/** Считать ли открытие страницы переходом по QR-коду. Скачивание файла — нет. */
export const QR_LINK_TRACK = {
  OPEN: "open",
  NONE: "none",
} as const;

export type IQrLinkTrack = (typeof QR_LINK_TRACK)[keyof typeof QR_LINK_TRACK];

const lastKnown = new Map<string, IQrLinkData>();

export const isQrLinkSlug = (slug: string): boolean => SLUG_PATTERN.test(slug);

const readConfig = (): { apiUrl: string; apiKey: string } | null => {
  const apiUrl = process.env.MAIN_SERVER_API_URL;
  const apiKey = process.env.MAIN_SERVER_API_KEY;
  if (!apiUrl || !apiKey) {
    console.error(
      "Общая ссылка QR: MAIN_SERVER_API_URL или MAIN_SERVER_API_KEY не задан",
    );
    return null;
  }
  return { apiUrl, apiKey };
};

const readTarget = (value: unknown): string | null =>
  typeof value === "string" && value.startsWith("https://") ? value : null;

const readOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const parseData = (raw: unknown): IQrLinkRaw | null => {
  if (!raw || typeof raw !== "object") return null;
  const data = (raw as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const record = data as {
    title?: unknown;
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
    targets: {
      [CHOOSER_MESSENGER.MAX]: readTarget(targets[CHOOSER_MESSENGER.MAX]),
      [CHOOSER_MESSENGER.TELEGRAM]: readTarget(
        targets[CHOOSER_MESSENGER.TELEGRAM],
      ),
    },
    // Поля брендирования необязательные: старый ответ сервера страницу не ломает.
    logoUrl: readOptionalString(record.logoUrl),
    colorScheme: readOptionalString(record.colorScheme),
  };
};

/**
 * Лого для страницы — data-URI, а не ссылка (план «Брендирование», Ф4).
 *
 * 🔴 Страница уходит и файлом на домен клиента, где нашего сервера картинок
 * может не быть вовсе; ссылка на `nyambot.ru` сделала бы файл зависимым от
 * нас. Поэтому картинку вклеиваем. Берём только свои загрузки (`/uploads/…`,
 * `/api/files/…`): внешний адрес лендинг не качает.
 *
 * Имя файла на сервере уникально (время + случайная часть), значит картинка по
 * адресу не меняется — помним её, пока жив процесс.
 */
const LOGO_PATH_PATTERN = /^\/?(?:api\/files\/)?uploads\/[A-Za-z0-9/_.-]+$/;
const LOGO_PATH_PREFIX = /^\/?(?:api\/files\/)?/;
const LOGO_MAX_BYTES = 512 * 1024;
/** Растровые форматы загрузок; SVG не вклеиваем — у нас его не бывает. */
const LOGO_MIME_TYPES: ReadonlySet<string> = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const LOGO_CACHE_LIMIT = 200;
const logoCache = new Map<string, string>();

const fetchLogoDataUri = async (
  config: { apiUrl: string; apiKey: string },
  logoUrl: string | null,
): Promise<string | null> => {
  if (!logoUrl || !LOGO_PATH_PATTERN.test(logoUrl) || logoUrl.includes("..")) {
    return null;
  }

  const cached = logoCache.get(logoUrl);
  if (cached) return cached;

  const path = logoUrl.replace(LOGO_PATH_PREFIX, "");

  try {
    const response = await fetch(`${config.apiUrl}/api/files/${path}`, {
      headers: { "x-api-key": config.apiKey },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const mime = (response.headers.get("content-type") ?? "")
      .split(";")[0]
      ?.trim()
      .toLowerCase();
    if (!response.ok || !mime || !LOGO_MIME_TYPES.has(mime)) return null;

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0 || bytes.length > LOGO_MAX_BYTES) return null;

    const dataUri = `data:${mime};base64,${bytes.toString("base64")}`;
    if (logoCache.size >= LOGO_CACHE_LIMIT) logoCache.clear();
    logoCache.set(logoUrl, dataUri);
    return dataUri;
  } catch (error) {
    // Без лого страница работает — это украшение, а не путь гостя в бота.
    console.error("Общая ссылка QR: лого не загрузилось", error);
    return null;
  }
};

const fallback = (slug: string): IQrLinkResult => {
  const cached = lastKnown.get(slug);
  return cached
    ? { kind: QR_LINK_RESULT.OK, data: cached }
    : { kind: QR_LINK_RESULT.UNAVAILABLE };
};

export const fetchQrLink = async (
  slug: string,
  track: IQrLinkTrack,
): Promise<IQrLinkResult> => {
  const config = readConfig();
  if (!config) return fallback(slug);

  try {
    const response = await fetch(
      `${config.apiUrl}${MAIN_SERVER_PATH}/${slug}?track=${track}`,
      {
        headers: { "x-api-key": config.apiKey },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      },
    );

    if (response.status === 404) {
      lastKnown.delete(slug);
      return { kind: QR_LINK_RESULT.NOT_FOUND };
    }
    if (!response.ok) {
      console.error(
        `Общая ссылка QR ${slug}: main-server ответил ${response.status}`,
      );
      return fallback(slug);
    }

    const raw = parseData(await response.json().catch(() => null));
    if (!raw) return fallback(slug);

    const { logoUrl, ...rest } = raw;
    const data: IQrLinkData = {
      ...rest,
      logo: await fetchLogoDataUri(config, logoUrl),
    };

    lastKnown.set(slug, data);
    return { kind: QR_LINK_RESULT.OK, data };
  } catch (error) {
    console.error(`Общая ссылка QR ${slug}: main-server недоступен`, error);
    return fallback(slug);
  }
};

/**
 * Выбор мессенджера: main-server засчитывает переход и отдаёт свежую ссылку на
 * бота. Не ответил — ведём по последней известной: гость уходит в мессенджер
 * при любом исходе счётчика. `null` — у заведения нет бота в этом мессенджере
 * (или адрес неизвестен вовсе).
 */
export const clickQrLink = async (
  slug: string,
  messenger: IChooserMessenger,
): Promise<string | null> => {
  const cached = lastKnown.get(slug)?.targets[messenger] ?? null;
  const config = readConfig();
  if (!config) return cached;

  try {
    const response = await fetch(
      `${config.apiUrl}${MAIN_SERVER_PATH}/${slug}/click`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
        },
        body: JSON.stringify({ messenger }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      },
    );

    if (response.status === 404) return null;
    if (!response.ok) return cached;

    const raw = (await response.json().catch(() => null)) as {
      data?: { url?: unknown };
    } | null;
    return readTarget(raw?.data?.url) ?? cached;
  } catch (error) {
    console.error(`Общая ссылка QR ${slug}: переход не засчитан`, error);
    return cached;
  }
};
