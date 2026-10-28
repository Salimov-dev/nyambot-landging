import { beforeEach, describe, expect, it, vi } from "vitest";
import { CHOOSER_MESSENGER } from "@/lib/messenger-chooser/messenger-chooser.types";

/**
 * Маршрут `/t/<токен>` — QR на столе (план «Работа с залом», Ф8 п. 1): выбор
 * мессенджера, ссылки на ботов сразу с `/start table_<токен>`. API main-server
 * подменён — проверяется решение лендинга, а не сеть.
 */
const api = vi.hoisted(() => ({ fetchTableQr: vi.fn() }));

vi.mock("@/lib/messenger-chooser/table-qr.api", async (importOriginal) => {
  const original =
    await importOriginal<
      typeof import("@/lib/messenger-chooser/table-qr.api")
    >();
  return { ...original, fetchTableQr: api.fetchTableQr };
});

const { GET } = await import("./route");
const { TABLE_QR_RESULT } =
  await import("@/lib/messenger-chooser/table-qr.api");

const TOKEN = "Ab3dEf6hIj9k";
const request = new Request(`https://nyambot.ru/t/${TOKEN}`);
const params = (token: string) => ({ params: Promise.resolve({ token }) });

const TG = `https://t.me/kafe_bot?start=table_${TOKEN}`;
const MAX = `https://max.ru/kafe_bot?start=table_${TOKEN}`;

const tableData = (targets: Record<string, string | null>) => ({
  kind: TABLE_QR_RESULT.OK,
  data: {
    title: "Кафе на углу",
    address: "ул. Малая Дмитровка, 6 с3",
    tableLabel: "Твой стол № 12 · Зал",
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

describe("GET /t/<токен>", () => {
  it("мусор вместо токена — 404 без похода в main-server", async () => {
    const res = await GET(request, params("../etc"));
    expect(res.status).toBe(404);
    expect(api.fetchTableQr).not.toHaveBeenCalled();
  });

  it("🔴 стол недоступен — «стол недоступен», без меню и ссылок", async () => {
    api.fetchTableQr.mockResolvedValue({ kind: TABLE_QR_RESULT.NOT_FOUND });
    const res = await GET(request, params(TOKEN));
    const html = await res.text();
    expect(res.status).toBe(404);
    expect(html).toContain("Стол недоступен");
    expect(html).not.toContain("t.me");
  });

  it("сервер недоступен — 503 «временно»", async () => {
    api.fetchTableQr.mockResolvedValue({ kind: TABLE_QR_RESULT.UNAVAILABLE });
    expect((await GET(request, params(TOKEN))).status).toBe(503);
  });

  it("два мессенджера — кнопки прямо в боты со столом; адрес, «Твой стол № 12 · Зал» и призыв (Ф10в п. 1)", async () => {
    api.fetchTableQr.mockResolvedValue(
      tableData({
        [CHOOSER_MESSENGER.TELEGRAM]: TG,
        [CHOOSER_MESSENGER.MAX]: MAX,
      }),
    );
    const res = await GET(request, params(TOKEN));
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(html).toContain("📍 ул. Малая Дмитровка, 6 с3");
    expect(html).toContain("<strong>Твой стол № 12 · Зал</strong>");
    expect(html).toContain(
      "Выбери мессенджер — откроем меню этого заведения, заказ придёт прямо на твой стол",
    );
    expect(html).toContain(`href="${MAX.replace(/&/g, "&amp;")}"`);
    expect(html).toContain(`href="${TG}"`);
    // Токен стола в метки «Работает на Нямботе» не уходит.
    expect(html).not.toMatch(new RegExp(`utm_[a-z]+=[^"&]*${TOKEN}`));
  });

  it("один мессенджер — сразу туда", async () => {
    api.fetchTableQr.mockResolvedValue(
      tableData({ [CHOOSER_MESSENGER.TELEGRAM]: TG }),
    );
    const html = await (await GET(request, params(TOKEN))).text();
    expect(html).toContain(`<meta http-equiv="refresh" content="0;url=${TG}">`);
  });

  it("ни одного бота — «стол недоступен»", async () => {
    api.fetchTableQr.mockResolvedValue(tableData({}));
    expect((await GET(request, params(TOKEN))).status).toBe(404);
  });
});
