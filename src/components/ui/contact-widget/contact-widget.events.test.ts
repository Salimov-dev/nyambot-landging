import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_WIDGET_OPEN_EVENT,
  CONTACT_WIDGET_SOURCE,
  openContactWidget,
  type ContactWidgetOpenDetail,
} from "./contact-widget.events";

/**
 * Призыв «Получить скидку 50%» открывает кнопку связи — выбор MAX, Телеграм
 * или почта, — а не ведёт в один мессенджер (Руслан 16.10.2026).
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

    openContactWidget(CONTACT_WIDGET_SOURCE.PRICING_SWITCH);

    expect(received).toEqual([{ from: CONTACT_WIDGET_SOURCE.PRICING_SWITCH }]);
  });

  it("без window (рендер на сервере) — ничего не делает", () => {
    vi.stubGlobal("window", undefined);

    expect(() =>
      openContactWidget(CONTACT_WIDGET_SOURCE.PRICING_SWITCH),
    ).not.toThrow();
  });
});
