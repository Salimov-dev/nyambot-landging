import { beforeEach, describe, expect, it, vi } from "vitest";
import { CHOOSER_MESSENGER } from "@/lib/messenger-chooser/messenger-chooser.types";

/**
 * Маршрут `/b/<код>` — ссылка на бронь точки из СРМ (Ф10в «Бронь — вход»):
 * выбор мессенджера, ссылки на ботов сразу с `?start=book_<код>`. API
 * main-server подменён — проверяется решение лендинга, а не сеть.
 */
const api = vi.hoisted(() => ({ fetchBookingLink: vi.fn() }));

vi.mock("@/lib/messenger-chooser/booking-link.api", async (importOriginal) => {
  const original =
    await importOriginal<
      typeof import("@/lib/messenger-chooser/booking-link.api")
    >();
  return { ...original, fetchBookingLink: api.fetchBookingLink };
});

const { GET } = await import("./route");
const { BOOKING_LINK_RESULT } =
  await import("@/lib/messenger-chooser/booking-link.api");

const CODE = "3fA9kQ2mZx7LpR4tWb8cNd";
const request = new Request(`https://nyambot.ru/b/${CODE}`);
const params = (code: string) => ({ params: Promise.resolve({ code }) });

const TG = `https://t.me/kafe_bot?start=book_${CODE}`;
const MAX = `https://max.ru/kafe_bot?start=book_${CODE}`;

const bookingData = (targets: Record<string, string | null>) => ({
  kind: BOOKING_LINK_RESULT.OK,
  data: {
    title: "Кафе на углу",
    address: "ул. Малая Дмитровка, 6 с3",
    targets: {
      [CHOOSER_MESSENGER.MAX]: null,
      [CHOOSER_MESSENGER.TELEGRAM]: null,
      ...targets,
    },
    logo: null,
    colorScheme: null,
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /b/<код>", () => {
  it.each(["../etc", "short", `${CODE}x`, "3fA9kQ2mZx7LpR4tWb8c-d"])(
    "кривой код «%s» — 404 без похода в main-server",
    async (code) => {
      const res = await GET(request, params(code));
      expect(res.status).toBe(404);
      expect(await res.text()).toContain("Ссылка не найдена");
      expect(api.fetchBookingLink).not.toHaveBeenCalled();
    },
  );

  it("🔴 кода нет — «ссылка не найдена», без ссылок на ботов", async () => {
    api.fetchBookingLink.mockResolvedValue({
      kind: BOOKING_LINK_RESULT.NOT_FOUND,
    });
    const res = await GET(request, params(CODE));
    const html = await res.text();
    expect(res.status).toBe(404);
    expect(html).toContain("Ссылка не найдена");
    expect(html).not.toContain("t.me");
    expect(api.fetchBookingLink).toHaveBeenCalledWith(CODE);
  });

  it("🔴 бронь у точки не работает (409) — так и говорим, без кнопок", async () => {
    api.fetchBookingLink.mockResolvedValue({
      kind: BOOKING_LINK_RESULT.BOOKING_OFF,
    });
    const res = await GET(request, params(CODE));
    const html = await res.text();
    expect(res.status).toBe(409);
    expect(html).toContain(
      "Онлайн-бронь здесь сейчас не работает — загляни в меню заведения или позвони.",
    );
    expect(html).not.toContain("t.me");
    expect(html).not.toContain("скоро");
  });

  it("сервер недоступен — 503 «временно»", async () => {
    api.fetchBookingLink.mockResolvedValue({
      kind: BOOKING_LINK_RESULT.UNAVAILABLE,
    });
    expect((await GET(request, params(CODE))).status).toBe(503);
  });

  it("два мессенджера — кнопки прямо в боты с бронью; адрес, «Бронь стола» и призыв", async () => {
    api.fetchBookingLink.mockResolvedValue(
      bookingData({
        [CHOOSER_MESSENGER.TELEGRAM]: TG,
        [CHOOSER_MESSENGER.MAX]: MAX,
      }),
    );
    const res = await GET(request, params(CODE));
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(res.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(html).toContain("<h1>Кафе на углу</h1>");
    expect(html).toContain("📍 ул. Малая Дмитровка, 6 с3");
    expect(html).toContain("<strong>Бронь стола</strong>");
    expect(html).toContain(
      "Выбери мессенджер — откроем бронь стола в этом заведении",
    );
    expect(html).not.toContain("Твой стол");
    expect(html).toContain("Открыть в MAX");
    expect(html).toContain("Открыть в Телеграм");
    expect(html).toContain(`href="${MAX}"`);
    expect(html).toContain(`href="${TG}"`);
    // MAX первым — так везде в продукте.
    expect(html.indexOf(MAX)).toBeLessThan(html.indexOf(TG));
    // Метрики Нямбота нет — это гость заведения; код в метки не уходит.
    expect(html).not.toContain("mc.yandex.ru");
    expect(html).not.toMatch(new RegExp(`utm_[a-z]+=[^"&]*${CODE}`));
  });

  it("один мессенджер — сразу туда", async () => {
    api.fetchBookingLink.mockResolvedValue(
      bookingData({ [CHOOSER_MESSENGER.MAX]: MAX }),
    );
    const html = await (await GET(request, params(CODE))).text();
    expect(html).toContain(
      `<meta http-equiv="refresh" content="0;url=${MAX}">`,
    );
    expect(html).toContain("<strong>Бронь стола</strong>");
  });

  it("ни одного бота — «ссылка не найдена»", async () => {
    api.fetchBookingLink.mockResolvedValue(bookingData({}));
    expect((await GET(request, params(CODE))).status).toBe(404);
  });
});
