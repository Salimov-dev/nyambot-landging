"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Сколько длится счёт */
const COUNT_DURATION_MS = 1800;

/** С какой доли значения начинаем: от нуля до 85 цифры мелькают слишком быстро
 *  (Руслан 06.10) — короткий разбег читается как плавный рост */
const COUNT_START_SHARE = 0.75;

/** «85 млн» → число и всё вокруг него; десятичная часть — через точку или запятую */
const VALUE_PATTERN = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/;

const easeOutQuart = (progress: number): number =>
  1 - Math.pow(1 - progress, 4);

type ICount = {
  from: number;
  target: number;
  format: (current: number) => string;
};

const parseCount = (value: string): ICount | null => {
  const match = VALUE_PATTERN.exec(value);
  if (!match) return null;
  const [, prefix, numberText, suffix] = match;
  const separator = numberText.includes(",") ? "," : ".";
  const target = Number(numberText.replace(",", "."));
  const decimals = numberText.split(/[.,]/)[1]?.length ?? 0;
  return {
    from: target * COUNT_START_SHARE,
    target,
    format: (current) =>
      `${prefix}${current.toFixed(decimals).replace(".", separator)}${suffix}`,
  };
};

type IProps = {
  value: string;
  className?: string;
};

/**
 * Цифра, которая плавно дорастает до значения, когда попадает в кадр.
 *
 * 🔴 С сервера приходит итоговое значение: без JS, у поисковика и при
 * промахе наблюдателя гость видит «85 млн». Стартовое значение ставится, только
 * пока плитка ниже экрана и её не видно, — иначе гость видел бы «85», потом
 * «64» и рост. Уже видимая при загрузке плитка не считает, сразу итог.
 * При «уменьшить движение» в системе счёта нет.
 */
export function CountUpValue({ value, className }: IProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const count = useMemo(() => parseCount(value), [value]);
  const [display, setDisplay] = useState(value);
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !count || prefersReducedMotion) return;
    if (element.getBoundingClientRect().top <= window.innerHeight) return;
    setDisplay(count.format(count.from));
    setIsArmed(true);
  }, [count, prefersReducedMotion]);

  useEffect(() => {
    if (!isArmed || !isInView || !count) return;

    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      // Отметка кадра бывает чуть раньше startedAt — без нижней границы
      // прогресс уходил в минус и первый кадр показывал «-1 млн»
      const progress = Math.min(
        1,
        Math.max(0, (now - startedAt) / COUNT_DURATION_MS),
      );
      setDisplay(
        count.format(
          count.from + (count.target - count.from) * easeOutQuart(progress),
        ),
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      setDisplay(value);
    };
  }, [isArmed, isInView, count, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
