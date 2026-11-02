import type { VideoStep } from "@/components/ui/step-video/step-video";

/**
 * Блок «Работа с залом» на главной (план «Работа с залом», Ф10б п. 1) и ролик
 * первого экрана /rabota-s-zalom, /elektronnoe-menyu, /bron-stolov.
 */

/** Пункты блока — в порядке пути гостя: стол → подача → обычная бронь */
export const HallPoint = {
  table: "table",
  serve: "serve",
  booking: "booking",
} as const;
export type HallPoint = (typeof HallPoint)[keyof typeof HallPoint];

export const HALL_POINTS: readonly HallPoint[] = Object.values(HallPoint);

/** Подпись шага на подстранице — заголовок пункта блока (там списка пунктов
 *  нет, на главной подпись выключена: пункт подсвечен рядом) */
const pointTitleKey = (point: HallPoint) => `hallBlock.points.${point}.title`;

/** С какой секунды ролика идёт пункт — нажатие на пункт переводит ролик сюда */
const POINT_FROM: Record<HallPoint, number> = {
  [HallPoint.table]: 0,
  [HallPoint.serve]: 11,
  [HallPoint.booking]: 15.3,
};

/** В конце петли — снова стол с QR: подсветка возвращается к пункту 1 */
const LOOP_BACK_TO_TABLE = 23.9;

/**
 * Ролик собирается в docs-nyambot/marketing/video/roliki/glavnaya/zal (16:10,
 * петля 23,9 с): скан QR на столе → бот «Ты за столом 12» → меню, корзина,
 * оформление с оплатой онлайн → заказ на столе 12 в iiko с «Предоплата:
 * Онлайн» → обычная бронь стола в мессенджере → бронь «Действует» в кассе.
 * Секунды шагов — из раскадровки scene.html, у каждого пункта — своя сцена.
 */
export const HALL_VIDEO = {
  src: "/videos/home/zal/stol-i-bron.mp4",
  poster: "/videos/home/zal/stol-i-bron-poster.jpg",
  from: POINT_FROM,
  steps: [
    ...HALL_POINTS.map(
      (point): VideoStep<HallPoint> => ({
        from: POINT_FROM[point],
        group: point,
        key: pointTitleKey(point),
      }),
    ),
    {
      from: LOOP_BACK_TO_TABLE,
      group: HallPoint.table,
      key: pointTitleKey(HallPoint.table),
    },
  ],
};
