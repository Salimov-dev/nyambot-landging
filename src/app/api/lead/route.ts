import { LEAD_API } from "@/config/zapusk-page.config";
import {
  BRIEF_ERROR,
  BRIEF_FORM_PART,
  BRIEF_LIMIT,
} from "@/lib/launch-brief/launch-brief.model";
import {
  BRIEF_PAYLOAD_META,
  pickLaunchBriefPayload,
  readMainServerReply,
} from "@/lib/launch-brief/launch-brief.payload";
import {
  parseUtmCookie,
  UTM_COOKIE,
  type UtmMarks,
} from "@/shared/utm-rules/utm-rules.shared";

/**
 * Заявка на запуск: браузер → сервер лендинга → main-server
 * `POST /api/leads/launch-brief` (план `brif-zapuska-2026-10-09`, Ф2).
 *
 * Ключ main-server живёт только здесь, в бандл не уходит. Тело — multipart с
 * одной частью `payload` (JSON ответов): так его ждёт main-server. Файлов
 * форма не прикладывает (решение 10.10), и прочие части браузерного запроса
 * дальше не уходят. `payload` собирается заново из белого списка полей
 * (`pickLaunchBriefPayload`) — всё прочее, что прислал браузер, отбрасывается.
 * Адрес посетителя и UTM-метки добавляем здесь: main-server видит адресом
 * запроса сам лендинг, и лимит по нему был бы общим на всех посетителей.
 */

/** Ответ браузеру: `{ ok: true }` или `{ ok: false, error }`. Обычный
 *  `Response`, без обёрток Next, — его же проверяют тесты маршрута. */
const json = (body: { ok: boolean; error?: string }, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const failure = (error: string, status: number): Response =>
  json({ ok: false, error }, status);

/**
 * `X-Real-IP` ставит сам nginx из адреса соединения — его посетитель не
 * подделает. `X-Forwarded-For` только запасной: его первый элемент приходит от
 * клиента, и доверять ему в лимите значило бы дать обойти лимит заголовком.
 */
const visitorIpOf = (request: Request): string => {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, BRIEF_LIMIT.VISITOR_IP);
  const forwarded = request.headers.get("x-forwarded-for")?.split(",");
  return (forwarded?.[forwarded.length - 1]?.trim() ?? "").slice(
    0,
    BRIEF_LIMIT.VISITOR_IP,
  );
};

/**
 * Метки перехода из куки `nb_utm` (план «UTM-метки», Ф3): откуда пришёл
 * человек, оставивший заявку. Читаем сырой заголовок: разбор куки
 * раскодирует значение сам, и второе раскодирование в `parseUtmCookie`
 * испортило бы метку со знаком «%».
 */
const utmOf = (request: Request): UtmMarks | null => {
  const prefix = `${UTM_COOKIE.NAME}=`;
  const raw = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
  return parseUtmCookie(raw);
};

/** JSON из части `payload`; нет её или битая — `null`. */
const payloadOf = (form: FormData): unknown => {
  const part = form.get(BRIEF_FORM_PART.PAYLOAD);
  if (typeof part !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(part);
    return parsed;
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  const apiUrl = process.env.MAIN_SERVER_API_URL;
  const apiKey = process.env.MAIN_SERVER_API_KEY;
  if (!apiUrl || !apiKey) {
    console.error(
      "Заявка на запуск не отправлена: MAIN_SERVER_API_URL или MAIN_SERVER_API_KEY не задан",
    );
    return failure(BRIEF_ERROR.UNAVAILABLE, 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return failure(BRIEF_ERROR.INVALID_BODY, 400);
  }

  const raw = payloadOf(form);
  if (raw === null) return failure(BRIEF_ERROR.INVALID_BODY, 400);

  // Наружу — только `payload`: прочие части браузерного запроса не пересылаем
  const outgoing = new FormData();
  outgoing.append(
    BRIEF_FORM_PART.PAYLOAD,
    JSON.stringify({
      ...pickLaunchBriefPayload(raw),
      [BRIEF_PAYLOAD_META.VISITOR_IP]: visitorIpOf(request),
      [BRIEF_PAYLOAD_META.UTM]: utmOf(request),
    }),
  );

  try {
    // Content-Type с границей частей fetch ставит сам — руками не задаём
    const response = await fetch(`${apiUrl}${LEAD_API.MAIN_SERVER_PATH}`, {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: outgoing,
      signal: AbortSignal.timeout(LEAD_API.TIMEOUT_MS),
      cache: "no-store",
    });

    const reply = readMainServerReply(await response.json().catch(() => null));

    if (response.ok && reply.success) {
      return json({ ok: true });
    }
    return failure(
      reply.error ?? BRIEF_ERROR.UNAVAILABLE,
      response.status >= 400 ? response.status : 502,
    );
  } catch (error) {
    console.error("Заявка на запуск не дошла до main-server", error);
    return failure(BRIEF_ERROR.UNAVAILABLE, 502);
  }
}
