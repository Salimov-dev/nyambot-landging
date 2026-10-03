import { describe, expect, it } from "vitest";
import { LINKS } from "@/config/links.config";
import {
  CHOOSER_EXTRA,
  CHOOSER_EXTRAS,
} from "@/lib/messenger-chooser/messenger-chooser.types";
import { GET as openDemo } from "./route";
import { GET as openDemoExtra } from "./[extra]/route";

/**
 * Демо-страница «Кусочка» (`/demo`) и заглушки её сайта и приложения
 * (`/demo/<ресурс>`): интересант видит блок «Ещё у заведения», как у заведения
 * с сайтом и приложением (Руслан 03.10.2026).
 */
const params = (extra: string) => ({ params: Promise.resolve({ extra }) });

describe("GET /demo", () => {
  it("блок «Ещё у заведения»: сайт и три магазина ведут на заглушки демо", async () => {
    const html = await (
      await openDemo(new Request("https://nyambot.ru/demo"))
    ).text();
    expect(html).toContain("Ещё у заведения");
    for (const extra of CHOOSER_EXTRAS) {
      expect(html).toContain(
        `<a class="extra-tile" href="${LINKS.demo.chooser}/${extra}"`,
      );
    }
  });

  it("мессенджеры остаются — страница не уводит сразу в бота", async () => {
    const html = await (
      await openDemo(new Request("https://nyambot.ru/demo"))
    ).text();
    expect(html).toContain('data-messenger="max"');
    expect(html).toContain('data-messenger="telegram"');
    expect(html).not.toContain('http-equiv="refresh"');
  });
});

describe("GET /demo/<ресурс>", () => {
  it("сайт — заглушка сайта со ссылкой на посадочную одного QR-кода", async () => {
    const res = await openDemoExtra(
      new Request("https://nyambot.ru/demo/site"),
      params(CHOOSER_EXTRA.SITE),
    );
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Здесь будет сайт заведения");
    expect(html).toContain(`href="${LINKS.pages.qrCode}"`);
    // У заглушки — обычная кнопка, ярлыки только в блоке «Ещё у заведения».
    expect(html).toContain(
      `<a class="btn btn-extra" href="${LINKS.pages.qrCode}">`,
    );
    expect(html).not.toContain('class="extra-tile"');
  });

  it("каждый магазин — заглушка приложения", async () => {
    for (const extra of [
      CHOOSER_EXTRA.APP_IOS,
      CHOOSER_EXTRA.APP_ANDROID,
      CHOOSER_EXTRA.APP_RUSTORE,
    ]) {
      const res = await openDemoExtra(
        new Request(`https://nyambot.ru/demo/${extra}`),
        params(extra),
      );
      expect(res.status).toBe(200);
      expect(await res.text()).toContain("Здесь будет приложение заведения");
    }
  });

  it("неизвестный ресурс — 404", async () => {
    const res = await openDemoExtra(
      new Request("https://nyambot.ru/demo/telegram"),
      params("telegram"),
    );
    expect(res.status).toBe(404);
  });
});
