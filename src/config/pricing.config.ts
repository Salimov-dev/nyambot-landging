import type { PricingPlan } from "@/types/landing.types";

/**
 * Тарифы и состав тарифа стоят на лендинге ЧИСЛАМИ, а не тянутся с сервера —
 * решение Руслана 12.08.2026.
 *
 * Почему так. Раньше страница ходила в главный сервер за планами и лимитами:
 * лимиты она запрашивала двумя запросами и выбрасывала ответ (в разметку они не
 * попадали ни разу), а фолбэки на случай молчания сервера расходились с базой —
 * 10 ботов, 22 ТТ и 125 позиций против фактических 2 / 1 / 200. То есть один
 * недоступный API превращал витрину цен в неверную. Цена — обещание публичной
 * оферты, и она не должна зависеть от того, ответил ли сервер за 3 секунды.
 *
 * 🔴 Сверено с `license_plans` 12.08.2026: 4 900 / 13 200 / 24 900 / 44 100 ₽.
 * Меняются тарифы в СРМ — эти числа правятся здесь тем же заходом, иначе
 * лендинг обещает одну цену, а СРМ выставляет другую.
 *
 * Состав тарифа (1 ТТ, 1 бот MAX, 1 бот Telegram, до 200 позиций меню) живёт
 * текстом в `pricing.connectItems` локали — там же, где его читает гость.
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    code: "license-1-month",
    months: 1,
    priceRub: 4900,
    pricePerMonth: 4900,
    discountPercent: 0,
    isPopular: false,
  },
  {
    code: "license-3-months",
    months: 3,
    priceRub: 13200,
    pricePerMonth: 4400,
    discountPercent: 10,
    isPopular: false,
  },
  {
    code: "license-6-months",
    months: 6,
    priceRub: 24900,
    pricePerMonth: 4150,
    discountPercent: 15,
    isPopular: true,
  },
  {
    code: "license-12-months",
    months: 12,
    priceRub: 44100,
    pricePerMonth: 3675,
    discountPercent: 25,
    isPopular: false,
  },
];
