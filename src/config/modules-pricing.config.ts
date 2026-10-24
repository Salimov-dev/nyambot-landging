/**
 * Модули к лицензии Нямбота (план «Работа с залом», Ф10б п. 2) — цены ЧИСЛАМИ,
 * как и тарифы лицензии в `pricing.config.ts`: цена — обещание публичной
 * оферты и не должна зависеть от того, ответил ли сервер.
 *
 * 🔴 Источник — раздел 1А «Модули» документа «Тарифы и стандарты»
 * (`main-server-nyambot/public/legal-documents/nyambot-tariffs-and-standards.md`)
 * и стартовые цены каталога `license_module_plans`
 * (`main-server-nyambot/prisma/migrations/20261023_223000_license_modules`),
 * сверено 24.10.2026. Меняется цена в админке — правится здесь тем же заходом:
 * лендинг, тарифы и СРМ обязаны показывать одно и то же. Совпадение с
 * тарифами держит сторож `modules-pricing.test.ts`.
 *
 * Цена — за одну торговую точку. Модуль подключается только к действующей
 * лицензии и не бывает дольше её оплаченного периода.
 */

/** Модули — ключи текстов лендинга (`pricing.modules.items.<ключ>`). */
export const LICENSE_MODULE = {
  HALL: "hall",
  AI_CHAT: "aiChat",
} as const;

export type ILicenseModule =
  (typeof LICENSE_MODULE)[keyof typeof LICENSE_MODULE];

/** Сроки модуля, как у тарифов лицензии. */
export const MODULE_TERM_MONTHS = [1, 3, 6, 12] as const;

export type IModuleTermMonths = (typeof MODULE_TERM_MONTHS)[number];

export type IModulePricing = {
  /** Код модуля в каталоге main-server (`license_module_plans.module_code`). */
  catalogCode: string;
  /** Название — одно везде: лендинг, тарифы, СРМ, гайд (Ф10 п. 4). */
  name: string;
  /** Стоимость за одну точку на срок, ₽. */
  priceRub: Record<IModuleTermMonths, number>;
};

export const MODULES_PRICING: Record<ILicenseModule, IModulePricing> = {
  [LICENSE_MODULE.HALL]: {
    catalogCode: "HALL_SERVICE",
    name: "Работа с залом",
    priceRub: { 1: 2490, 3: 6700, 6: 12650, 12: 22400 },
  },
  [LICENSE_MODULE.AI_CHAT]: {
    catalogCode: "AI_CHAT",
    name: "ИИ в чате",
    priceRub: { 1: 990, 3: 2670, 6: 5030, 12: 8900 },
  },
};

/** Порядок показа модулей — зал первым: это главный модуль. */
export const LICENSE_MODULES: readonly ILicenseModule[] = [
  LICENSE_MODULE.HALL,
  LICENSE_MODULE.AI_CHAT,
];

/** Цена модуля за месяц — то, что пишем в заголовках «… ₽ в месяц». */
export const moduleMonthlyRub = (module: ILicenseModule): number =>
  MODULES_PRICING[module].priceRub[1];

/** Разряды — пробелом, как в остальных текстах посадочных: «2 490». */
export const formatRubSpaced = (value: number): string =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/gu, " ");
