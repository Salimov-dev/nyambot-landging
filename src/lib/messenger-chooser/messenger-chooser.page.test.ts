import { describe, expect, it } from "vitest";
import { renderChooserPage } from "./messenger-chooser.page";
import {
  CHOOSER_EXTRA,
  CHOOSER_MESSENGER,
  EMPTY_CHOOSER_EXTRAS,
  type IChooserPageParams,
} from "./messenger-chooser.types";
import {
  CHOOSER_EXTRA_BUTTON_TEXT,
  CHOOSER_TEXT,
} from "./messenger-chooser.text";

/**
 * Страница `/go/<адрес>` — куда ведёт общий QR-код заведения (план «Страница
 * /go: сайт и приложение», Р4): мессенджеры выше и крупнее, под ними — сайт и
 * магазины приложений; с одним ботом и без сайта — сразу в мессенджер.
 */

const BOTH = {
  [CHOOSER_MESSENGER.MAX]: "/go/kafe/max",
  [CHOOSER_MESSENGER.TELEGRAM]: "/go/kafe/telegram",
};

const page = (overrides: Partial<IChooserPageParams> = {}): string =>
  renderChooserPage({
    title: "Пиццерия",
    targets: BOTH,
    extras: EMPTY_CHOOSER_EXTRAS,
    poweredByUrl: null,
    ...overrides,
  });

describe("страница выбора /go", () => {
  it("два мессенджера — обе кнопки, MAX первым, без мгновенной переадресации", () => {
    const html = page();
    expect(html.indexOf('data-messenger="max"')).toBeLessThan(
      html.indexOf('data-messenger="telegram"'),
    );
    expect(html).not.toContain('http-equiv="refresh"');
    expect(html).not.toContain('class="extras"');
  });

  it("🔴 один бот и ничего больше — сразу в мессенджер (Р4)", () => {
    const html = page({
      targets: {
        [CHOOSER_MESSENGER.MAX]: null,
        [CHOOSER_MESSENGER.TELEGRAM]: "/go/kafe/telegram",
      },
    });
    expect(html).toContain(
      '<meta http-equiv="refresh" content="0;url=/go/kafe/telegram">',
    );
  });

  it("🔴 один бот, но есть сайт — страница, а не переадресация: гостю есть что выбрать", () => {
    const html = page({
      targets: {
        [CHOOSER_MESSENGER.MAX]: "/go/kafe/max",
        [CHOOSER_MESSENGER.TELEGRAM]: null,
      },
      extras: {
        ...EMPTY_CHOOSER_EXTRAS,
        [CHOOSER_EXTRA.SITE]: "/go/kafe/site",
      },
    });
    expect(html).not.toContain('http-equiv="refresh"');
    expect(html).toContain('data-extra="site"');
  });

  it("блок «Ещё у заведения» — ниже мессенджеров, сайт первым, магазины с платформой", () => {
    const html = page({
      extras: {
        [CHOOSER_EXTRA.SITE]: "/go/kafe/site",
        [CHOOSER_EXTRA.APP_IOS]: "/go/kafe/app-ios",
        [CHOOSER_EXTRA.APP_ANDROID]: "/go/kafe/app-android",
        [CHOOSER_EXTRA.APP_RUSTORE]: "/go/kafe/app-rustore",
      },
    });
    const messengers = html.indexOf('data-messenger="telegram"');
    const extras = html.indexOf('class="extras"');
    expect(messengers).toBeGreaterThan(0);
    expect(extras).toBeGreaterThan(messengers);
    expect(html).toContain(CHOOSER_TEXT.extrasTitle);
    const order = ["site", "app-ios", "app-android", "app-rustore"].map(
      (extra) => html.indexOf(`data-extra="${extra}"`),
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(html).toContain('data-extra="app-ios" data-platform="ios"');
    expect(html).toContain('data-extra="app-android" data-platform="android"');
    expect(html).toContain('data-extra="app-rustore" data-platform="android"');
    expect(html).toContain('data-extra="site" data-platform="any"');
    expect(html).toContain(CHOOSER_EXTRA_BUTTON_TEXT[CHOOSER_EXTRA.SITE]);
    // Ресурсы заведения — в новой вкладке.
    expect(html).toMatch(
      /data-extra="site"[^>]*target="_blank" rel="noopener"/u,
    );
  });

  it("🔴 ссылки и название экранируются — чужой HTML в страницу не попадает", () => {
    const html = page({
      title: '<script>alert("x")</script>',
      extras: {
        ...EMPTY_CHOOSER_EXTRAS,
        [CHOOSER_EXTRA.SITE]: '/go/kafe/site"><img src=x>',
      },
    });
    expect(html).not.toContain('<script>alert("x")</script>');
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain('"><img src=x>');
  });

  it("лого — только вклеенная картинка data-URI, внешняя ссылка не попадает", () => {
    expect(page({ logo: "https://evil.example/logo.png" })).not.toContain(
      'class="logo"',
    );
    expect(page({ logo: "data:image/png;base64,iVBORw0KGgo=" })).toContain(
      'class="logo"',
    );
  });

  it("страница гостя заведения — без Метрики Нямбота, если её не передали", () => {
    expect(page()).not.toContain("mc.yandex.ru");
  });
});
