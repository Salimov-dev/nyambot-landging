"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** Шаг ролика: с какой секунды идёт, к какой группе относится (касса, роль —
 *  её подсвечивает секция; null — ни к одной) и ключ подписи */
export interface VideoStep<G extends string> {
  from: number;
  group: G | null;
  key: string;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Перейти к секунде ролика и запустить — по нажатию на кассу, роль, главу */
export function playVideoFrom(video: HTMLVideoElement | null, time: number) {
  if (!video) return;
  video.currentTime = time;
  if (!prefersReducedMotion()) {
    video.play().catch(() => {
      /* autoplay blocked — ok */
    });
  }
}

/** Номер шага, который идёт на секунде `time` */
export function stepAt<G extends string>(
  steps: readonly VideoStep<G>[],
  time: number,
) {
  return steps.reduce((found, s, i) => (time >= s.from ? i : found), 0);
}

/** Шаг ролика по его времени, запуск наблюдателем (ролик не грузится, пока
 *  блок далеко) и пауза по нажатию. Общий для ролика 16:10 (`StepVideo`) и
 *  ролика в телефоне («Витрина») */
export function useVideoSteps<G extends string>(
  videoRef: RefObject<HTMLVideoElement | null>,
  steps: readonly VideoStep<G>[],
) {
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
    const onTime = () => setStep(stepAt(steps, video.currentTime));
    // Запуск извне (логотип кассы, роль, глава) снимает паузу
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

  return { step, held, toggle };
}
