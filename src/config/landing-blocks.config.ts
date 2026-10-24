import { LINKS } from "@/config/links.config";
import {
  LICENSE_MODULE,
  type ILicenseModule,
} from "@/config/modules-pricing.config";

/**
 * Карточки посадочных — значки, сцены, тип карточки и карточки модулей.
 * Отдельно от текстов страниц (`landing-pages.config.ts`): компонентам
 * карточки (`LandingBlock`, `PageScene`) не нужны тексты всех посадочных.
 */

export const BLOCK_ICON = {
  MENU: "menu",
  ORDER: "order",
  MONEY: "money",
  PROMO: "promo",
  SETUP: "setup",
  GUEST: "guest",
  STAFF: "staff",
  DELIVERY: "delivery",
  ALERT: "alert",
  BROADCAST: "broadcast",
  METRICS: "metrics",
  INSIGHT: "insight",
  BRAND: "brand",
  QR: "qr",
} as const;

export type IBlockIcon = (typeof BLOCK_ICON)[keyof typeof BLOCK_ICON];

/** Живая сцена карточки вместо значка — из сцен главной («Главное»,
 *  «Возможности», «Сравнение»). У карточки без сцены остаётся значок. */
export const PAGE_SCENE = {
  QR: "qr",
  NETWORK: "network",
  CART: "cart",
  LOYALTY: "loyalty",
  MONEY: "money",
  POS: "pos",
  RETENTION: "retention",
  GROWTH: "growth",
  BROADCAST: "broadcast",
  CONSTRUCTOR: "constructor",
  CHAT: "chat",
  DELIVERY: "delivery",
  ONE_BOT: "oneBot",
  NEW_POINT: "newPoint",
  NO_SIGNUP: "noSignup",
  SETUP: "setup",
  PRICES: "prices",
  /* Свои сцены карточек подстраниц (page-scenes.tsx): на странице ни одна
     сцена не повторяется — ни между карточками, ни с секциями главной */
  SYNC: "sync",
  MENU_EDIT: "menuEdit",
  STATUS: "status",
  DASHBOARD: "dashboard",
  TEAM: "team",
  KITCHEN: "kitchen",
  COURIER: "courier",
  ALERT: "alert",
  SEARCH: "search",
  ACCESS: "access",
  FRANCHISE: "franchise",
  SITE: "site",
  CHOOSER: "chooser",
  DOMAIN: "domain",
  CHOICE_STATS: "choiceStats",
  SWAP_BOT: "swapBot",
  PRINT: "print",
  QR_LOGO: "qrLogo",
  BRAND: "brand",
  KEEP: "keep",
  PALETTE: "palette",
  DATA_OWN: "dataOwn",
  SHARE: "share",
  SECURE: "secure",
  ERASE: "erase",
  SERVER: "server",
  CLOCK: "clock",
  PROMO_CODE: "promoCode",
  GIFT: "gift",
  FIRST_ORDER: "firstOrder",
  ORDER_IN: "orderIn",
  POS_PROMO: "posPromo",
  KEY: "key",
  RECEIPT_LINES: "receiptLines",
  CARD_PAY: "cardPay",
  MENU_SCROLL: "menuScroll",
  QR_SCAN: "qrScan",
  MERGE: "merge",
  TOGETHER: "together",
  POINTS_LIST: "pointsList",
  CITY: "city",
  ACCOUNTS: "accounts",
  QUICK: "quick",
  FORK: "fork",
  POINTS: "points",
  /* Работа с залом (план «Работа с залом», Ф10б) */
  TABLE_QR: "tableQr",
  BOOKING: "booking",
  WAITER: "waiter",
  CALL_WAITER: "callWaiter",
} as const;

export type IPageScene = (typeof PAGE_SCENE)[keyof typeof PAGE_SCENE];

export type ILandingPageBlock = {
  icon: IBlockIcon;
  /** Живая сцена вместо значка */
  scene?: IPageScene;
  title: string;
  text: string;
  /** Пункты под текстом — границы возможности, о которых ресторатор
   *  спросит первым делом. */
  points?: string[];
  /** Цена модуля за месяц и срок (`ModulePrice`): число — из
   *  `modules-pricing.config.ts`, не текстом. */
  module?: ILicenseModule;
  /** Ссылка под текстом карточки — например, на заявку на запуск. */
  link?: { label: string; href: string };
  /** Карточка во всю ширину сетки. Ставится последней карточке при нечётном
   *  их числе — иначе на десктопе она стоит одна рядом с пустой ячейкой. */
  wide?: boolean;
};

const GUIDE = LINKS.docs;

/**
 * Карточки модулей на странице /moduli. Набор частей у обеих один: сцена,
 * название, выгода, цена за месяц и ссылка — так карточки
 * стоят ровно в ряд (Руслан 24.10.2026: «текст пляшет по высоте»).
 */
export const MODULE_BLOCKS: Record<ILicenseModule, ILandingPageBlock> = {
  [LICENSE_MODULE.HALL]: {
    icon: BLOCK_ICON.QR,
    scene: PAGE_SCENE.TABLE_QR,
    title: "«Работа с залом»",
    text: "Гость бронирует стол без звонка и заказывает со стола по QR, не дожидаясь официанта, — заказ сразу уходит на кухню, а официанты успевают обслужить больше столов. Бронь и заказ — сразу в кассе iiko или R-Keeper.",
    module: LICENSE_MODULE.HALL,
    link: { label: "Подробнее о работе с залом", href: LINKS.pages.hall },
  },
  [LICENSE_MODULE.AI_CHAT]: {
    icon: BLOCK_ICON.GUEST,
    scene: PAGE_SCENE.CHAT,
    title: "«ИИ в чате»",
    text: "Гость сразу получает ответ: ИИ знает меню с ценами и составом и заказы гостя — на «что у вас с мясом?» назовёт блюда и откроет меню. Скидок и возвратов не обещает, сложное — сразу администратору.",
    module: LICENSE_MODULE.AI_CHAT,
    link: {
      label: "Как ИИ отвечает гостям",
      href: `${GUIDE}/modules/ai-chat`,
    },
  },
};
