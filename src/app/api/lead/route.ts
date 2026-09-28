import { NextResponse, type NextRequest } from "next/server";
import { LEAD_API } from "@/config/zapusk-page.config";

/**
 * Заявка на разбор сайта: браузер → сервер лендинга → main-server.
 *
 * Ключ main-server живёт только здесь, в бандл не уходит. Адрес посетителя
 * берём из заголовков nginx и передаём полем тела: main-server видит адресом
 * запроса сам лендинг, и лимит по нему был бы общим на всех посетителей.
 */

/** Какие поля пропускаем дальше — всё прочее из браузера отбрасываем. */
const STRING_FIELDS = [
  "venue",
  "city",
  "site",
  "name",
  "email",
  "telegram",
  "max",
  "pos",
  "outlets",
  "payment",
  "comment",
  "page",
  "website2",
] as const;

const FAILURE = { ok: false, error: "unavailable" } as const;

/**
 * `X-Real-IP` ставит сам nginx из адреса соединения — его посетитель не
 * подделает. `X-Forwarded-For` только запасной: его первый элемент приходит от
 * клиента, и доверять ему в лимите значило бы дать обойти лимит заголовком.
 */
const visitorIpOf = (request: NextRequest): string => {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",");
  return forwarded?.[forwarded.length - 1]?.trim() ?? "";
};

const pickBody = (raw: unknown): Record<string, unknown> => {
  const source =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const body: Record<string, unknown> = {};
  for (const field of STRING_FIELDS) {
    if (typeof source[field] === "string") body[field] = source[field];
  }
  if (typeof source.consent === "boolean") body.consent = source.consent;
  if (typeof source.startedAt === "number") body.startedAt = source.startedAt;
  if (
    Array.isArray(source.have) &&
    source.have.every((item) => typeof item === "string")
  ) {
    body.have = source.have;
  }
  return body;
};

export async function POST(request: NextRequest) {
  const apiUrl = process.env.MAIN_SERVER_API_URL;
  const apiKey = process.env.MAIN_SERVER_API_KEY;
  if (!apiUrl || !apiKey) {
    console.error(
      "Заявка на разбор не отправлена: MAIN_SERVER_API_URL или MAIN_SERVER_API_KEY не задан",
    );
    return NextResponse.json(FAILURE, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${apiUrl}${LEAD_API.MAIN_SERVER_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        ...pickBody(raw),
        visitorIp: visitorIpOf(request),
      }),
      signal: AbortSignal.timeout(LEAD_API.TIMEOUT_MS),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      error?: string;
    } | null;

    if (response.ok && data?.success) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: data?.error ?? "unavailable" },
      { status: response.status >= 400 ? response.status : 502 },
    );
  } catch (error) {
    console.error("Заявка на разбор не дошла до main-server", error);
    return NextResponse.json(FAILURE, { status: 502 });
  }
}
