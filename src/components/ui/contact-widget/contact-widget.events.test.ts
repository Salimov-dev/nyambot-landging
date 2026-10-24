import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_WIDGET_OPEN_EVENT,
  CONTACT_WIDGET_SOURCE,
  openContactWidget,
  type ContactWidgetOpenDetail,
} from "./contact-widget.events";

/**
 * Призыв «Спросить про модули» под тарифами открывает кнопку связи — выбор
 * MAX, Телеграм или почта, — а не ведёт в один мессенджер (Руслан 16.10.2026;
 * прежний призыв скидки при переходе снят вместе с акцией 24.10.2026).
 */
describe("openContactWidget", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("шлёт событие открытия с источником", () => {
    const target = new EventTarget();
    vi.stubGlobal("window", target);
    const received: ContactWidgetOpenDetail[] = [];
    target.addEventListener(CONTACT_WIDGET_OPEN_EVENT, (event) => {
      received.push((event as CustomEvent<ContactWidgetOpenDetail>).detail);
    });

    openContactWidget(CONTACT_WIDGET_SOURCE.PRICING_MODULES);

    expect(received).toEqual([{ from: CONTACT_WIDGET_SOURCE.PRICING_MODULES }]);
  });

  it("без window (рендер на сервере) — ничего не делает", () => {
    vi.stubGlobal("window", undefined);

    expect(() =>
      openContactWidget(CONTACT_WIDGET_SOURCE.PRICING_MODULES),
    ).not.toThrow();
  });
});
