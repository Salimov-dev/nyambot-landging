"use client";

import { useCallback, useRef } from "react";
import { PAGE_VISUAL, type IPageVisual } from "@/config/landing-pages.config";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { NotebookMockup } from "@/components/ui/notebook-mockup/notebook-mockup";
import { MockupVideo } from "@/components/ui/mockup-video/mockup-video";
import {
  StepVideo,
  type VideoStep,
} from "@/components/ui/step-video/step-video";
import {
  IIKO_VIDEO,
  INTEGRATIONS_VIDEO,
  RKEEPER_VIDEO,
} from "@/components/sections/integrations/integrations-video.config";
import { KOMANDA_VIDEO } from "@/components/sections/komanda/komanda-video.config";
import styles from "./landing-page.module.css";

type IClip = { src: string; poster: string };

/** Ролики телефона и ноутбука — те же файлы, что на главной */
const PHONE: Partial<Record<IPageVisual, IClip>> = {
  [PAGE_VISUAL.ORDER_FLOW]: {
    src: "/videos/home/hero/order-flow.mp4",
    poster: "/videos/home/hero/order-flow-poster.jpg",
  },
  [PAGE_VISUAL.DEMO]: {
    src: "/videos/home/demo/otkrytie.mp4",
    poster: "/videos/home/demo/otkrytie-poster.jpg",
  },
  /* Сцена docs-nyambot/marketing/video/roliki/podstranicy/loyalnost */
  [PAGE_VISUAL.LOYALTY]: {
    src: "/videos/stranicy/loyalnost/akcii-i-bally.mp4",
    poster: "/videos/stranicy/loyalnost/akcii-i-bally-poster.jpg",
  },
};

const NOTEBOOK: Partial<Record<IPageVisual, IClip>> = {
  [PAGE_VISUAL.KABINET]: {
    src: "/videos/home/kabinet/obzor.mp4",
    poster: "/videos/home/kabinet/obzor-poster.jpg",
  },
};

const STEPS: Partial<
  Record<IPageVisual, IClip & { steps: readonly VideoStep<string>[] }>
> = {
  [PAGE_VISUAL.KASSY]: INTEGRATIONS_VIDEO,
  [PAGE_VISUAL.KASSY_IIKO]: IIKO_VIDEO,
  [PAGE_VISUAL.KASSY_RKEEPER]: RKEEPER_VIDEO,
  [PAGE_VISUAL.KOMANDA]: KOMANDA_VIDEO,
};

/** Ролик первого экрана подстраницы */
export function PageVisual({ visual }: { visual: IPageVisual }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Подсветки групп на подстранице нет — шаги только подписывают ролик
  const onGroupChange = useCallback(() => undefined, []);

  const phone = PHONE[visual];
  if (phone) {
    return (
      <div className={styles.visualPhone}>
        <PhoneMockup>
          <MockupVideo src={phone.src} poster={phone.poster} />
        </PhoneMockup>
      </div>
    );
  }

  const notebook = NOTEBOOK[visual];
  if (notebook) {
    return (
      <div className={styles.visualWide}>
        <NotebookMockup>
          <MockupVideo src={notebook.src} poster={notebook.poster} />
        </NotebookMockup>
      </div>
    );
  }

  const stepped = STEPS[visual];
  if (!stepped) return null;
  return (
    <div className={styles.visualWide}>
      <StepVideo
        src={stepped.src}
        poster={stepped.poster}
        steps={stepped.steps}
        videoRef={videoRef}
        onGroupChange={onGroupChange}
      />
    </div>
  );
}
