import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BOOKING_LINK_RESULT,
  fetchBookingLink,
  isBookingCode,
} from "./booking-link.api";

/**
 * Ссылка на бронь точки `/b/<код>` (Ф10в «Бронь — вход»): что лендинг берёт
 * из ответа main-server и как отвечает на 404, 409 и молчание сервера.
 * Сеть подменена.
 */
const CODE = "3fA9kQ2mZx7LpR4tWb8cNd";
const TG = `https://t.me/kafe_bot?start=book_${CODE}`;
const MAX = `https://max.ru/kafe_bot?start=book_${CODE}`;

const okBody = {
  success: true,
  data: {
    title: "Кафе на углу",
    address: " ул. Малая Дмитровка, 6 с3 ",
    targets: { telegram: TG, max: MAX },
    logoUrl: null,
    colorScheme: null,
  },
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubEnv("MAIN_SERVER_API_URL", "http://main-server.test");
  vi.stubEnv("MAIN_SERVER_API_KEY", "landing-key");
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("код ссылки на бронь", () => {
  it.each([
    [CODE, true],
    ["short", false],
    [`${CODE}x`, false],
    ["3fA9kQ2mZx7LpR4tWb8c-d", false],
    ["../etc/passwd/aaaaaaaaa", false],
  ])("«%s» — %s", (code, valid) => {
    expect(isBookingCode(code)).toBe(valid);
  });
});

describe("fetchBookingLink", () => {
  it("200 — заведение, адрес, ссылки на ботов; ключ лендинга в заголовке", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, okBody));

    const result = await fetchBookingLink(CODE);

    expect(result).toEqual({
      kind: BOOKING_LINK_RESULT.OK,
      data: {
        title: "Кафе на углу",
        address: "ул. Малая Дмитровка, 6 с3",
        targets: { max: MAX, telegram: TG },
        logo: null,
        colorScheme: null,
      },
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `http://main-server.test/api/qr-links/public/booking/${CODE}`,
    );
    expect(init?.headers).toEqual({ "x-api-key": "landing-key" });
  });

  it("ссылка не на https — кнопки нет", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, {
        ...okBody,
        data: {
          ...okBody.data,
          targets: { telegram: "javascript:x", max: MAX },
        },
      }),
    );
    const result = await fetchBookingLink(CODE);
    expect(
      result.kind === BOOKING_LINK_RESULT.OK && result.data.targets,
    ).toEqual({ max: MAX, telegram: null });
  });

  it("🔴 404 и 409 — честный ответ, прежний удачный забывается", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, okBody));
    await fetchBookingLink(CODE);

    fetchMock.mockResolvedValueOnce(
      jsonResponse(409, { success: false, error: "booking_link_unavailable" }),
    );
    expect((await fetchBookingLink(CODE)).kind).toBe(
      BOOKING_LINK_RESULT.BOOKING_OFF,
    );

    // Сервер замолчал после 409 — не «бронь работает» из памяти.
    fetchMock.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    expect((await fetchBookingLink(CODE)).kind).toBe(
      BOOKING_LINK_RESULT.UNAVAILABLE,
    );

    fetchMock.mockResolvedValueOnce(
      jsonResponse(404, { success: false, error: "booking_link_not_found" }),
    );
    expect((await fetchBookingLink(CODE)).kind).toBe(
      BOOKING_LINK_RESULT.NOT_FOUND,
    );
  });

  it("сервер молчит — последний удачный ответ, пока жив процесс", async () => {
    const code = "Zz9kQ2mZx7LpR4tWb8cNd0";
    fetchMock.mockResolvedValueOnce(jsonResponse(200, okBody));
    await fetchBookingLink(code);

    fetchMock.mockResolvedValueOnce(jsonResponse(502, {}));
    const result = await fetchBookingLink(code);
    expect(result.kind).toBe(BOOKING_LINK_RESULT.OK);
  });

  it("нет ни ответа, ни прежнего — «временно недоступно»", async () => {
    fetchMock.mockRejectedValueOnce(new Error("timeout"));
    expect((await fetchBookingLink("Yy9kQ2mZx7LpR4tWb8cNd0")).kind).toBe(
      BOOKING_LINK_RESULT.UNAVAILABLE,
    );
  });
});
