import type { VideoStep } from "@/components/ui/step-video/step-video";

/**
 * Блок «Работа с залом» на главной (план «Работа с залом», Ф10б п. 1) и ролик
 * первого экрана /rabota-s-zalom, /elektronnoe-menyu, /bron-stolov.
 */

/** Пункты блока — в порядке пути гостя: стол → подача → бронь → ко времени */
export const HallPoint = {
  table: "table",
  serve: "serve",
  booking: "booking",
  scheduled: "scheduled",
} as const;
export type HallPoint = (typeof HallPoint)[keyof typeof HallPoint];

export const HALL_POINTS: readonly HallPoint[] = Object.values(HallPoint);

/** Подпись шага на подстранице — заголовок пункта блока (там списка пунктов
 *  нет, на главной подпись выключена: пункт подсвечен рядом) */
const pointTitleKey = (point: HallPoint) => `hallBlock.points.${point}.title`;

/**
 * Ролик собирается в docs-nyambot/marketing/video/roliki/glavnaya/zal (16:10,
 * петля 25 с, Ф10б п. 6): скан QR на столе → бот «Ты за столом 12» → меню,
 * корзина, оформление с оплатой онлайн → заказ на столе 12 в iiko с
 * «Предоплата: Онлайн» → бронь стола в мессенджере → бронь «Действует» в
 * кассе. Секунды шагов — из раскадровки scene.html; пункт «ко времени» в
 * ролике не показан и не подсвечивается.
 */
export const HALL_VIDEO = {
  src: "/videos/home/zal/stol-i-bron.mp4",
  poster: "/videos/home/zal/stol-i-bron-poster.jpg",
  steps: [
    { from: 0, group: HallPoint.table, key: pointTitleKey(HallPoint.table) },
    { from: 11, group: HallPoint.serve, key: pointTitleKey(HallPoint.serve) },
    {
      from: 15.3,
      group: HallPoint.booking,
      key: pointTitleKey(HallPoint.booking),
    },
    { from: 23.9, group: HallPoint.table, key: pointTitleKey(HallPoint.table) },
  ] satisfies VideoStep<HallPoint>[],
};
