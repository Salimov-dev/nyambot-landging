"use client";

import { useRef, useEffect } from "react";
import styles from "./mockup-video.module.css";

interface MockupVideoProps {
  /** Путь к MP4 файлу, напр. "/videos/phone/hero.mp4" */
  src: string;
  /** Путь к WebM файлу (опционально, для лучшей совместимости) */
  srcWebm?: string;
  /** Постер-кадр (отображается до загрузки видео) */
  poster?: string;
  /** Дополнительные классы */
  className?: string;
}

/**
 * Видео-компонент для мокапов телефона и ноутбука.
 * - autoplay + muted + loop + playsInline
 * - Lazy loading через IntersectionObserver (загружает видео только при появлении в viewport)
 * - Ставит на паузу когда выходит из viewport
 *
 * Использование:
 * ```tsx
 * <PhoneMockup>
 *   <MockupVideo src="/videos/phone/hero.mp4" srcWebm="/videos/phone/hero.webm" />
 * </PhoneMockup>
 * ```
 */
export function MockupVideo({
  src,
  srcWebm,
  poster,
  className,
}: MockupVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — ok */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={`${styles.video} ${className ?? ""}`}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
    >
      {srcWebm && <source src={srcWebm} type="video/webm" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
