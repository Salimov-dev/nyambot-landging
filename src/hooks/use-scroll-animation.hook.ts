"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  once?: boolean;
  amount?: number;
  margin?: string;
}

/** Через сколько блок показывается принудительно, если наблюдатель промолчал */
const FALLBACK_DELAY_MS = 1200;

/**
 * Появление блока при попадании в видимую область.
 *
 * Блоки стартуют с opacity 0, поэтому несработавший наблюдатель означает не
 * «без анимации», а пустое место на странице. На инерционном скролле телефона
 * секция успевает проскочить между кадрами IntersectionObserver — так на
 * мобильных терялись целые секции, вплоть до тарифов.
 *
 * Поэтому к наблюдателю добавлены две страховки: блок показывается, если он
 * уже оказался выше экрана, и в любом случае — по таймауту.
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { once = true, amount = 0.15, margin = "0px 0px -80px 0px" } = options;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount, margin } as Parameters<
    typeof useInView
  >[1]);
  const [isForced, setIsForced] = useState(false);

  useEffect(() => {
    if (isForced) return;

    const showIfScrolledPast = () => {
      const element = ref.current;
      if (!element) return;

      const { top } = element.getBoundingClientRect();
      if (top < window.innerHeight) setIsForced(true);
    };

    const timer = window.setTimeout(showIfScrolledPast, FALLBACK_DELAY_MS);
    window.addEventListener("scroll", showIfScrolledPast, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", showIfScrolledPast);
    };
  }, [isForced]);

  return { ref, isInView: isInView || isForced };
}
