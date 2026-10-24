/**
 * Открыть кнопку связи из любого места страницы — для призывов, за которыми
 * должен быть выбор канала (MAX, Телеграм, почта), а не один мессенджер.
 * Кнопка связи стоит в корневом layout, поэтому слушатель есть на каждой
 * странице лендинга.
 */
export const CONTACT_WIDGET_OPEN_EVENT = "nyambot:contact-widget-open";

/** Откуда открыли — уходит параметром `from` в цель `open_contact_widget`. */
export const CONTACT_WIDGET_SOURCE = {
  /** «Спросить про модули» под тарифами: вопрос — в любой канал на выбор. */
  PRICING_MODULES: "pricing_modules",
} as const;

export type ContactWidgetSource =
  (typeof CONTACT_WIDGET_SOURCE)[keyof typeof CONTACT_WIDGET_SOURCE];

export type ContactWidgetOpenDetail = { from: ContactWidgetSource };

export function openContactWidget(from: ContactWidgetSource): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ContactWidgetOpenDetail>(CONTACT_WIDGET_OPEN_EVENT, {
      detail: { from },
    }),
  );
}
