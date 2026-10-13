import type { VideoStep } from "@/components/ui/step-video/step-video";

/** Главы ролика — в порядке показа */
export const VitrinaChapter = {
  loading: "loading",
  store: "store",
  promo: "promo",
  cards: "cards",
  constructor: "constructor",
  cart: "cart",
  promocode: "promocode",
  delivery: "delivery",
  payment: "payment",
  done: "done",
} as const;
export type VitrinaChapter =
  (typeof VitrinaChapter)[keyof typeof VitrinaChapter];

export const VITRINA_CHAPTERS = Object.values(VitrinaChapter);

/** Секунда, с которой идёт глава — из раскадровки scene.html */
const CHAPTER_FROM: Record<VitrinaChapter, number> = {
  [VitrinaChapter.loading]: 0,
  [VitrinaChapter.store]: 2.6,
  [VitrinaChapter.promo]: 4.9,
  [VitrinaChapter.cards]: 10.3,
  [VitrinaChapter.constructor]: 15.4,
  [VitrinaChapter.cart]: 25.8,
  [VitrinaChapter.promocode]: 33,
  [VitrinaChapter.delivery]: 37.6,
  [VitrinaChapter.payment]: 41.4,
  [VitrinaChapter.done]: 52.3,
};

/** Ролик собирается в docs-nyambot/marketing/video/roliki/glavnaya/vitrina:
 *  загрузка → выбор заведения → акции на входе → карточки блюд → конструктор →
 *  корзина → промокод → курьер или самовывоз → баллы и оплата → «Заказ принят» */
export const VITRINA_VIDEO = {
  src: "/videos/home/vitrina/obzor.mp4",
  poster: "/videos/home/vitrina/obzor-poster.jpg",
  from: CHAPTER_FROM,
  steps: VITRINA_CHAPTERS.map((chapter) => ({
    from: CHAPTER_FROM[chapter],
    group: chapter,
    key: `vitrina.chapters.${chapter}.title`,
  })) satisfies VideoStep<VitrinaChapter>[],
};
