"use client";

import { useEffect } from "react";
import { reachGoal, type MetrikaGoal } from "@/config/metrika";

/** Допуск для последнего порога: ровно 100% не набирается, когда высота
 *  экрана дробная или её меняет плавающая адресная строка телефона. */
const SCROLL_END_TOLERANCE_PERCENT = 1;

/** Пороги глубины просмотра страницы (в процентах) и их цели */
const SCROLL_THRESHOLDS: { percent: number; goal: MetrikaGoal }[] = [
  { percent: 25, goal: "scroll_25" },
  { percent: 50, goal: "scroll_50" },
  { percent: 75, goal: "scroll_75" },
  { percent: 100 - SCROLL_END_TOLERANCE_PERCENT, goal: "scroll_100" },
];

/**
 * Отслеживает глубину прокрутки страницы и отправляет цели Метрики
 * (scroll_25 / scroll_50 / scroll_75 / scroll_100) — каждую один раз.
 */
export function ScrollDepthTracker() {
  useEffect(() => {
    const fired = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewport = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const scrollable = fullHeight - viewport;
      if (scrollable <= 0) return;

      const percent = ((scrollTop + viewport) / fullHeight) * 100;

      for (const { percent: threshold, goal } of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          reachGoal(goal);
        }
      }

      if (fired.size === SCROLL_THRESHOLDS.length) {
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
