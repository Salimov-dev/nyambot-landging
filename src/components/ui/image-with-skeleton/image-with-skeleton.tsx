"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./image-with-skeleton.module.css";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  /** Подсказка размеров для next/image — обязательна при `fill` */
  sizes: string;
  /** Класс самого изображения (object-fit, радиусы и прочее от секции) */
  className?: string;
  priority?: boolean;
}

/**
 * Изображение, которое до загрузки показывает скелетон, а не пустоту.
 *
 * Зачем: скриншоты демо весят сотни килобайт, и на мобильном интернете
 * (74 % нашего трафика) экраны мокапов какое-то время стоят пустыми дырами.
 * Пустой блок читается как поломка, мерцающий скелетон — как загрузка.
 *
 * Работает только внутри контейнера с `position: relative` (или absolute):
 * обёртка растягивается на него, изображение рендерится с `fill`.
 */
export function ImageWithSkeleton({
  src,
  alt,
  sizes,
  className,
  priority,
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Картинка из кеша браузера бывает готова ещё до навешивания onLoad —
  // тогда событие не придёт вовсе и скелетон останется висеть навсегда.
  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.skeleton} ${isLoaded ? styles.skeletonHidden : ""}`}
        aria-hidden
      />
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${styles.image} ${isLoaded ? styles.imageVisible : ""} ${className ?? ""}`}
        onLoad={() => setIsLoaded(true)}
        // Ошибка загрузки тоже снимает скелетон: вечно «загружающийся» экран
        // хуже честно пустого — в нём пользователь ждёт того, чего не будет.
        onError={() => setIsLoaded(true)}
      />
    </div>
  );
}
