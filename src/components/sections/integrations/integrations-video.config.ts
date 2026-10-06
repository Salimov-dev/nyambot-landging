import type { VideoStep } from "@/components/ui/step-video/step-video";

/** Кассы в ролике — в порядке частей */
export const VideoCash = {
  iiko: "iiko",
  rkeeper: "rkeeper",
} as const;
export type VideoCash = (typeof VideoCash)[keyof typeof VideoCash];

/** Ролик собирается в docs-nyambot/marketing/video/roliki/glavnaya/integracii-kassy:
 *  две части по 8,5 с — iiko, затем R-Keeper. Секунды шагов — из раскадровки scene.html */
const PART = 8.5;

export const INTEGRATIONS_VIDEO = {
  src: "/videos/home/integracii/kassy.mp4",
  poster: "/videos/home/integracii/kassy-poster.jpg",
  steps: [
    { from: 0, group: VideoCash.iiko, key: "integrations.video.iikoOrder" },
    { from: 1.0, group: VideoCash.iiko, key: "integrations.video.iikoArrived" },
    { from: 3.6, group: VideoCash.iiko, key: "integrations.video.iikoConfirm" },
    {
      from: PART,
      group: VideoCash.rkeeper,
      key: "integrations.video.rkeeperOrder",
    },
    {
      from: PART + 1.0,
      group: VideoCash.rkeeper,
      key: "integrations.video.rkeeperArrived",
    },
    {
      from: PART + 3.45,
      group: VideoCash.rkeeper,
      key: "integrations.video.rkeeperCheck",
    },
  ] satisfies VideoStep<VideoCash>[],
  start: {
    [VideoCash.iiko]: 0,
    [VideoCash.rkeeper]: PART,
  } satisfies Record<VideoCash, number>,
};

/** Петли одной кассы — для /iiko и /rkeeper: та же сцена, собранная с
 *  вариантом (render.cjs <папка> 30 iiko), 8,5 с; шаги — те же, от нуля */
export const IIKO_VIDEO = {
  src: "/videos/home/integracii/kassy-iiko.mp4",
  poster: "/videos/home/integracii/kassy-iiko-poster.jpg",
  steps: INTEGRATIONS_VIDEO.steps.filter((s) => s.group === VideoCash.iiko),
};

export const RKEEPER_VIDEO = {
  src: "/videos/home/integracii/kassy-rkeeper.mp4",
  poster: "/videos/home/integracii/kassy-rkeeper-poster.jpg",
  steps: INTEGRATIONS_VIDEO.steps
    .filter((s) => s.group === VideoCash.rkeeper)
    .map((s) => ({ ...s, from: s.from - PART })),
};
