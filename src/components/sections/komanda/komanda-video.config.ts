import type { VideoStep } from "@/components/ui/step-video/step-video";

/** Роли в ролике — в порядке шагов */
export const KomandaRole = {
  cook: "cook",
  admin: "admin",
  courier: "courier",
} as const;
export type KomandaRole = (typeof KomandaRole)[keyof typeof KomandaRole];

/** Ролик собирается в docs-nyambot/marketing/video/roliki/glavnaya/komanda:
 *  кухня «Готов» → администратор назначает курьера → курьер «Доставлен» →
 *  все три устройства. Секунды шагов — из раскадровки scene.html */
export const KOMANDA_VIDEO = {
  src: "/videos/home/komanda/smena.mp4",
  poster: "/videos/home/komanda/smena-poster.jpg",
  steps: [
    { from: 0, group: KomandaRole.cook, key: "komanda.video.cook" },
    { from: 1.75, group: KomandaRole.admin, key: "komanda.video.admin" },
    { from: 4.15, group: KomandaRole.courier, key: "komanda.video.courier" },
    { from: 6.55, group: null, key: "komanda.video.all" },
    { from: 9.3, group: KomandaRole.cook, key: "komanda.video.cook" },
  ] satisfies VideoStep<KomandaRole>[],
  start: {
    [KomandaRole.cook]: 0,
    [KomandaRole.admin]: 1.75,
    [KomandaRole.courier]: 4.15,
  } satisfies Record<KomandaRole, number>,
};
