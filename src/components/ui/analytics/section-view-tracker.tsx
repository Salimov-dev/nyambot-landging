"use client";

import { useEffect } from "react";
import { reachGoal, type MetrikaGoal } from "@/config/metrika";

/**
 * Секции, интерес к которым отмечается по факту показа на экране.
 *
 * 🔴 Раньше эти цели висели на пунктах меню, точках навигации и кнопках
 * «Смотреть тарифы» — то есть считали клики, а называются в Метрике «Скролл
 * до возможностей» и «Скролл до тарифов». Долиставший до тарифов без клика по
 * меню не считался вовсе: 5 достижений против 24 визитов, дошедших до трёх
 * четвертей страницы. Клики со счёта не пропали — любой из них прокручивает
 * страницу к той же секции, и наблюдатель срабатывает следом.
 */
const WATCHED_SECTIONS: { id: string; goal: MetrikaGoal }[] = [
  { id: "features", goal: "scroll_features" },
  { id: "pricing", goal: "scroll_pricing" },
];

/** Нижняя четверть экрана не в счёт: секция, мелькнувшая у самого края, ещё
 *  не просмотрена. */
const VIEWPORT_BOTTOM_MARGIN = "-25%";

/** Отмечает первый показ отслеживаемых секций — по одной цели за визит. */
export function SectionViewTracker() {
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const { id, goal } of WATCHED_SECTIONS) {
      const element = document.getElementById(id);
      if (!element) continue;

      const observer = new IntersectionObserver(
        ([entry], self) => {
          if (!entry.isIntersecting) return;
          reachGoal(goal);
          self.disconnect();
        },
        { rootMargin: `0px 0px ${VIEWPORT_BOTTOM_MARGIN} 0px` },
      );

      observer.observe(element);
      observers.push(observer);
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return null;
}
