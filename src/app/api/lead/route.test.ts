import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LEAD_API } from "@/config/zapusk-page.config";
import {
  BRIEF_ERROR,
  BRIEF_FORM_PART,
  BRIEF_ONLINE_PAYMENT,
  BRIEF_POS,
  isRecord,
} from "@/lib/launch-brief/launch-brief.model";
import { serializeUtmCookie } from "@/shared/utm-rules/utm-rules.shared";
import { POST } from "./route";

/**
 * Прокси заявки на запуск `/api/lead` (план `brif-zapuska-2026-10-09`, Ф2):
 * браузер присылает multipart, прокси собирает `payload` по белому списку,
 * добавляет адрес посетителя и метки перехода и пересылает на main-server
 * `POST /api/leads/launch-brief` одну часть `payload`.
 */

const API_URL = "https://api.nyambot.test";
const API_KEY = "landing-key";

const fetchMock = vi.fn<typeof fetch>();

/** Ответ main-server — новый на каждый вызов: тело читается один раз. */
const serverReplies = (body: unknown, status = 200) => {
  fetchMock.mockImplementation(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
  );
};

/** Чужая часть multipart, которую мог дописать браузер. */
const STRAY_PART = "attachment";

/** Короткая форма — все поля, что уходят на main-server. */
const ANSWERS = {
  venue: "Ромашка",
  site: "romashka.ru",
  name: "Анна",
  phone: "",
  telegram: "@romashka_cafe",
  max: "",
  email: "anna@mail.ru",
  outletsTotal: 3,
  pos: BRIEF_POS.IIKO,
  onlinePayment: BRIEF_ONLINE_PAYMENT.YOOKASSA,
  comment: "Ждём к выходным",
  consent: true,
  page: "https://nyambot.ru/zapusk",
  startedAt: 1_000,
  website2: "",
};

const leadRequest = (
  options: {
    payload?: unknown;
    /** Лишняя часть-файл рядом с `payload`. */
    stray?: File;
    headers?: Record<string, string>;
  } = {},
): Request => {
  const form = new FormData();
  form.append(
    BRIEF_FORM_PART.PAYLOAD,
    JSON.stringify(options.payload ?? ANSWERS),
  );
  if (options.stray) {
    form.append(STRAY_PART, options.stray, options.stray.name);
  }
  return new Request(`https://nyambot.ru${LEAD_API.LANDING_ROUTE}`, {
    method: "POST",
    body: form,
    headers: options.headers,
  });
};

/** Что ушло на main-server: адрес, заголовки, `payload` и имена частей. */
const forwarded = () => {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, init] = fetchMock.mock.calls[0];
  const body = init?.body;
  if (!(body instanceof FormData)) {
    throw new Error("на main-server ушёл не multipart");
  }
  const payloadPart = body.get(BRIEF_FORM_PART.PAYLOAD);
  const payload: unknown =
    typeof payloadPart === "string" ? JSON.parse(payloadPart) : null;
  if (!isRecord(payload)) throw new Error("payload — не объект");
  return {
    url: String(url),
    headers: new Headers(init?.headers),
    payload,
    parts: [...body.keys()],
  };
};

beforeEach(() => {
  vi.stubEnv("MAIN_SERVER_API_URL", API_URL);
  vi.stubEnv("MAIN_SERVER_API_KEY", API_KEY);
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  serverReplies({ success: true, data: { accepted: true } });
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/lead — заявка на запуск", () => {
  it("уходит на /api/leads/launch-brief с ключом лендинга и отвечает «принято»", async () => {
    const response = await POST(leadRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    const sent = forwarded();
    expect(sent.url).toBe(`${API_URL}/api/leads/launch-brief`);
    expect(sent.headers.get("x-api-key")).toBe(API_KEY);
    expect(sent.payload).toEqual({ ...ANSWERS, visitorIp: "", utm: null });
  });

  it("payload — только белый список: лишнее, длинная форма и подменённое отбрасываются", async () => {
    await POST(
      leadRequest({
        payload: {
          ...ANSWERS,
          city: "Казань",
          inn: "7707083893",
          menuUrl: "eda.yandex.ru/r/romashka",
          outletsAtLaunch: 1,
          have: ["APP"],
          isAdmin: true,
          status: "LAUNCHED",
          pos: "iiko",
          visitorIp: "6.6.6.6",
          utm: { source: "spoof" },
        },
        headers: { "x-real-ip": "203.0.113.7" },
      }),
    );
    const { payload } = forwarded();
    expect(Object.keys(payload).sort()).toEqual(
      [...Object.keys(ANSWERS), "visitorIp", "utm"].sort(),
    );
    expect(payload.pos).toBeNull();
    // Адрес и метки ставит сам прокси — браузер их не подменит
    expect(payload.visitorIp).toBe("203.0.113.7");
    expect(payload.utm).toBeNull();
  });

  it("адрес посетителя — из X-Real-IP, запасной — последний из X-Forwarded-For", async () => {
    await POST(
      leadRequest({
        headers: {
          "x-real-ip": "203.0.113.7",
          "x-forwarded-for": "1.1.1.1, 198.51.100.2",
        },
      }),
    );
    expect(forwarded().payload.visitorIp).toBe("203.0.113.7");

    fetchMock.mockClear();
    await POST(
      leadRequest({ headers: { "x-forwarded-for": "1.1.1.1, 198.51.100.2" } }),
    );
    expect(forwarded().payload.visitorIp).toBe("198.51.100.2");
  });

  it("метки перехода — из куки nb_utm", async () => {
    const cookie = `nb_utm=${serializeUtmCookie({
      source: "yandex",
      medium: "cpc",
      campaign: "zapusk",
    })}; other=1`;
    await POST(leadRequest({ headers: { cookie } }));
    expect(forwarded().payload.utm).toEqual({
      source: "yandex",
      medium: "cpc",
      campaign: "zapusk",
    });
  });

  it("наружу уходит только часть payload — лишние части и файлы отбрасываются", async () => {
    const response = await POST(
      leadRequest({
        stray: new File([new Uint8Array(128)], "picture.png", {
          type: "image/png",
        }),
      }),
    );
    expect(response.status).toBe(200);
    const { parts, payload } = forwarded();
    expect(parts).toEqual([BRIEF_FORM_PART.PAYLOAD]);
    expect(STRAY_PART in payload).toBe(false);
  });

  it("без payload или с битым JSON — invalid_body", async () => {
    const empty = new FormData();
    let response = await POST(
      new Request("https://nyambot.ru/api/lead", {
        method: "POST",
        body: empty,
      }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: BRIEF_ERROR.INVALID_BODY,
    });

    const broken = new FormData();
    broken.append(BRIEF_FORM_PART.PAYLOAD, "{не json");
    response = await POST(
      new Request("https://nyambot.ru/api/lead", {
        method: "POST",
        body: broken,
      }),
    );
    expect(await response.json()).toEqual({
      ok: false,
      error: BRIEF_ERROR.INVALID_BODY,
    });

    response = await POST(
      new Request("https://nyambot.ru/api/lead", {
        method: "POST",
        body: "venue=Ромашка",
        headers: { "Content-Type": "text/plain" },
      }),
    );
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("код отказа main-server доходит до браузера с тем же статусом", async () => {
    serverReplies({ success: false, error: BRIEF_ERROR.INVALID_SITE }, 400);
    let response = await POST(leadRequest());
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: BRIEF_ERROR.INVALID_SITE,
    });

    serverReplies({ success: false, error: BRIEF_ERROR.RATE_LIMITED }, 429);
    response = await POST(leadRequest());
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      ok: false,
      error: BRIEF_ERROR.RATE_LIMITED,
    });
  });

  it("main-server молчит или не настроен — «недоступно»", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));
    let response = await POST(leadRequest());
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      ok: false,
      error: BRIEF_ERROR.UNAVAILABLE,
    });

    vi.stubEnv("MAIN_SERVER_API_KEY", "");
    response = await POST(leadRequest());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      error: BRIEF_ERROR.UNAVAILABLE,
    });
  });
});
