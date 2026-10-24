"use client";

import type { RefObject } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PlayPauseIcon } from "@/components/ui/icons/icons";
import { useVideoSteps, type VideoStep } from "./use-video-steps.hook";
import styles from "./step-video.module.css";

export { playVideoFrom, type VideoStep } from "./use-video-steps.hook";

interface StepVideoProps<G extends string> {
  src: string;
  poster: string;
  steps: readonly VideoStep<G>[];
  videoRef: RefObject<HTMLVideoElement | null>;
  onGroupChange: (group: G | null) => void;
  className?: string;
  /** Подпись шага под роликом. Выключают, когда шаг подсвечивает сама секция
   *  своим списком («Работа с залом») — подпись повторила бы пункт рядом */
  showCaption?: boolean;
}

/** Ролик продукта 16:10 и подпись текущего шага под ним. Запуск — наблюдателем,
 *  как у MockupVideo: ролик не грузится, пока блок далеко. Шаги и их секунды —
 *  из раскадровки scene.html ролика (docs-nyambot/marketing/video/roliki) */
export function StepVideo<G extends string>({
  src,
  poster,
  steps,
  videoRef,
  onGroupChange,
  className,
  showCaption = true,
}: StepVideoProps<G>) {
  const { t } = useTranslation("landing");
  const { step, held, toggle } = useVideoSteps(videoRef, steps);

  useEffect(() => {
    onGroupChange(steps[step].group);
  }, [step, steps, onGroupChange]);

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <div className={styles.frame}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          onClick={toggle}
        >
          <source src={src} type="video/mp4" />
        </video>
        <button
          type="button"
          className={`${styles.hold} ${held ? styles.holdOn : ""}`}
          aria-label={t(held ? "media.resume" : "media.pause")}
          aria-pressed={held}
          onClick={toggle}
        >
          <PlayPauseIcon paused={held} />
        </button>
      </div>
      {showCaption ? (
        <p key={step} className={styles.caption}>
          {t(steps[step].key)}
        </p>
      ) : null}
    </div>
  );
}
