import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CHOOSER_EXTRA,
  CHOOSER_MESSENGER,
  EMPTY_CHOOSER_EXTRAS,
} from "@/lib/messenger-chooser/messenger-chooser.types";

/**
 * Маршруты `/go/<адрес>` и `/go/<адрес>/<куда>` (план «Страница /go: сайт и
 * приложение»): страница выбора и переход с засчитыванием. API main-server
 * подменён — проверяется решение лендинга, а не сеть.
 */
const api = vi.hoisted(() => ({
  fetchQrLink: vi.fn(),
  clickQrLink: vi.fn(),
}));

vi.mock("@/lib/messenger-chooser/qr-link.api", async (importOriginal) => {
  const original =
    await importOriginal<
      typeof import("@/lib/messenger-chooser/qr-link.api")
    >();
  return {
    ...original,
    fetchQrLink: api.fetchQrLink,
    clickQrLink: api.clickQrLink,
  };
});

const { GET: openPage } = await import("./route");
const { GET: openTarget } = await import("./[target]/route");
const { QR_LINK_RESULT } = await import("@/lib/messenger-chooser/qr-link.api");

const SLUG = "kafe-na-uglu";
const request = new Request(`https://nyambot.ru/go/${SLUG}`);
const params = <T>(value: T) => ({ params: Promise.resolve(value) });

const linkData = (overrides: Record<string, unknown> = {}) => ({
  kind: QR_LINK_RESULT.OK,
  data: {
    title: "Кафе на углу",
    targets: {
      [CHOOSER_MESSENGER.MAX]: "https://max.ru/bot",
      [CHOOSER_MESSENGER.TELEGRAM]: null,
    },
    extras: { ...EMPTY_CHOOSER_EXTRAS },
    logo: null,
    colorScheme: null,
    ...overrides,
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /go/<адрес>", () => {
  it("неверный адрес — 404 без похода в main-server", async () => {
    const res = await openPage(request, params({ slug: "Плохой адрес" }));
    expect(res.status).toBe(404);
    expect(api.fetchQrLink).not.toHaveBeenCalled();
  });

  it("сервер недоступен — 503 «временно», а не «не найдено»", async () => {
    api.fetchQrLink.mockResolvedValue({ kind: QR_LINK_RESULT.UNAVAILABLE });
    expect((await openPage(request, params({ slug: SLUG }))).status).toBe(503);
  });

  it("🔴 ни одного бота — «ссылка не работает», даже если сайт указан", async () => {
    api.fetchQrLink.mockResolvedValue(
      linkData({
        targets: {
          [CHOOSER_MESSENGER.MAX]: null,
          [CHOOSER_MESSENGER.TELEGRAM]: null,
        },
        extras: {
          ...EMPTY_CHOOSER_EXTRAS,
          [CHOOSER_EXTRA.SITE]: "https://kafe.ru",
        },
      }),
    );
    expect((await openPage(request, params({ slug: SLUG }))).status).toBe(404);
  });

  it("кнопки ведут на наш переход /go/<адрес>/<куда>, а не прямо на бота и сайт", async () => {
    api.fetchQrLink.mockResolvedValue(
      linkData({
        extras: {
          ...EMPTY_CHOOSER_EXTRAS,
          [CHOOSER_EXTRA.SITE]: "https://kafe.ru",
        },
      }),
    );
    const res = await openPage(request, params({ slug: SLUG }));
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(html).toContain(`href="/go/${SLUG}/max"`);
    expect(html).toContain(`href="/go/${SLUG}/site"`);
    expect(html).not.toContain("https://kafe.ru");
    expect(html).not.toContain("https://max.ru/bot");
  });
});

describe("GET /go/<адрес>/<куда>", () => {
  it("засчитанный переход — 302 на свежую ссылку", async () => {
    api.clickQrLink.mockResolvedValue("https://kafe.ru/?utm_source=qr");
    const res = await openTarget(
      request,
      params({ slug: SLUG, target: "site" }),
    );
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("https://kafe.ru/?utm_source=qr");
    expect(api.clickQrLink).toHaveBeenCalledWith(SLUG, "site");
  });

  it("ресурса нет — 404", async () => {
    api.clickQrLink.mockResolvedValue(null);
    expect(
      (await openTarget(request, params({ slug: SLUG, target: "app-ios" })))
        .status,
    ).toBe(404);
  });

  it("незнакомое «куда» — 404 без похода в main-server", async () => {
    const res = await openTarget(
      request,
      params({ slug: SLUG, target: "evil" }),
    );
    expect(res.status).toBe(404);
    expect(api.clickQrLink).not.toHaveBeenCalled();
  });
});
