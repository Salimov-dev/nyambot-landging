"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { PlayPauseIcon } from "@/components/ui/icons/icons";
import styles from "./step-video.module.css";

/** Шаг ролика: с какой секунды идёт, к какой группе относится (касса, роль —
 *  её подсвечивает секция; null — ни к одной) и ключ подписи */
export interface VideoStep<G extends string> {
  from: number;
  group: G | null;
  key: string;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Перейти к секунде ролика и запустить — по нажатию на кассу или роль */
export function playVideoFrom(video: HTMLVideoElement | null, time: number) {
  if (!video) return;
  video.currentTime = time;
  if (!prefersReducedMotion()) {
    video.play().catch(() => {
      /* autoplay blocked — ok */
    });
  }
}

interface StepVideoProps<G extends string> {
  src: string;
  poster: string;
  steps: readonly VideoStep<G>[];
  videoRef: RefObject<HTMLVideoElement | null>;
  onGroupChange: (group: G | null) => void;
  className?: string;
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
}: StepVideoProps<G>) {
  const { t } = useTranslation("landing");
  const [step, setStep] = useState(0);
  // Пауза по нажатию — дочитать шаг (Руслан 06.10.2026). В ref — для
  // наблюдателя: вернувшись на экран, ролик не запускается сам через паузу
  const [held, setHeld] = useState(false);
  const heldRef = useRef(false);
  const hold = (value: boolean) => {
    heldRef.current = value;
    setHeld(value);
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      hold(false);
      video.play().catch(() => {
        /* autoplay blocked — ok */
      });
    } else {
      hold(true);
      video.pause();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !heldRef.current &&
          !prefersReducedMotion()
        ) {
          video.play().catch(() => {
            /* autoplay blocked — ok */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 },
    );
    const onTime = () =>
      setStep(
        steps.reduce(
          (found, s, i) => (video.currentTime >= s.from ? i : found),
          0,
        ),
      );
    // Запуск извне (логотип кассы, роль) снимает паузу
    const onPlay = () => {
      heldRef.current = false;
      setHeld(false);
    };

    observer.observe(video);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("seeked", onTime);
    video.addEventListener("play", onPlay);
    return () => {
      observer.disconnect();
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("seeked", onTime);
      video.removeEventListener("play", onPlay);
    };
  }, [videoRef, steps]);

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
      <p key={step} className={styles.caption}>
        {t(steps[step].key)}
      </p>
    </div>
  );
}
