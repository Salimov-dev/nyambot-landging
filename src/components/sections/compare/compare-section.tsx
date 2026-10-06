"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { CheckIcon, PlayPauseIcon } from "@/components/ui/icons/icons";
import { COMPARE_SCENES } from "./compare-scenes";
import styles from "./compare-section.module.css";

const { Title, Text } = Typography;

type Row = { usual: string; our: string };

/** Свайп короче — не листание, а дрожь пальца при касании */
const SWIPE_MIN_PX = 48;

/**
 * Сравнение с другими сервисами заказа в мессенджерах.
 *
 * 🔴 Конкуренты не названы намеренно: строка «обычно» описывает устройство
 * таких сервисов, а не конкретную компанию — иначе блок превращается
 * в заявление о чужом продукте, которое придётся доказывать.
 *
 * Пары строк не переставлять по вкусу: первая — про один бот на оба
 * мессенджера и на всю сеть, это главное отличие, с неё блок и начинается.
 *
 * Третья пара и строка под блоком вобрали секцию «Как это работает»
 * (Руслан 06.10.2026).
 *
 * Живые блоки вместо таблицы (Руслан 06.10.2026): пары идут по одной, у каждой
 * картинка «обычно → у нас» без снимков экранов. На телефоне таблица из десяти
 * блоков занимала три экрана — теперь одна карточка, листается свайпом.
 * Смену пары ведёт полоска прогресса: её animationend — сигнал «дальше»,
 * поэтому пауза за экраном и «уменьшить движение» работают без таймеров.
 */
export function CompareSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasText = useHasTranslation("compare.title");
  const hasOutcome = useHasTranslation("compare.outcome");
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  // Пауза по нажатию на карточку — дочитать пару внимательно (Руслан 06.10.2026)
  const [held, setHeld] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      {
        threshold: 0.4,
      },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasText]);

  if (!hasText) return null;

  const rows = (t("compare.rows", { returnObjects: true }) as Row[]).slice(
    0,
    COMPARE_SCENES.length,
  );
  const titles = t("compare.titles", { returnObjects: true }) as string[];
  const count = rows.length;
  // Выбранная руками пара играет с начала, даже если стояла пауза
  const go = (index: number) => {
    setActive((index + count) % count);
    setHeld(false);
  };
  const toggleHeld = () => setHeld((value) => !value);
  const Scene = COMPARE_SCENES[active];

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    swiped.current = false;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) >= SWIPE_MIN_PX) {
      swiped.current = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  };
  // Касание без свайпа — пауза или продолжение
  const onCardClick = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    toggleHeld();
  };

  return (
    <section id="compare" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("compare.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("compare.title")}
          </Title>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${styles.board} ${onScreen && !held ? "" : styles.paused}`}
        >
          <div className={styles.tabs}>
            {rows.map((row, index) => (
              <button
                key={row.our}
                type="button"
                className={`${styles.tab} ${index === active ? styles.tabActive : ""}`}
                aria-pressed={index === active}
                onClick={() => go(index)}
              >
                {titles[index] ?? row.our}
              </button>
            ))}
          </div>

          <div
            ref={cardRef}
            className={styles.card}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={onCardClick}
          >
            <button
              type="button"
              className={`${styles.hold} ${held ? styles.holdOn : ""}`}
              aria-label={t(held ? "media.resume" : "media.pause")}
              aria-pressed={held}
              onClick={(e) => {
                e.stopPropagation();
                toggleHeld();
              }}
            >
              <PlayPauseIcon paused={held} />
            </button>
            <div key={active} className={styles.stage}>
              <Scene />
            </div>

            {/* Все пары в одной ячейке сетки: высота карточки — по самой
                длинной, и смена пары не двигает страницу */}
            <div className={styles.texts}>
              {rows.map((row, index) => (
                <div
                  key={index === active ? `on-${active}` : row.our}
                  className={`${styles.pair} ${index === active ? styles.pairActive : ""}`}
                  aria-hidden={index !== active}
                >
                  <div className={styles.usual}>
                    <span className={styles.usualLabel}>
                      {t("compare.usualLabel")}
                    </span>
                    <span className={styles.usualText}>{row.usual}</span>
                  </div>
                  <div className={styles.our}>
                    <span className={styles.ourLabel}>
                      {t("compare.ourLabel")}
                    </span>
                    <span className={styles.ourText}>
                      <CheckIcon size={16} className={styles.check} />
                      {row.our}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.progress}>
              <span
                key={active}
                className={styles.progressBar}
                onAnimationEnd={() => go(active + 1)}
              />
            </div>

            <div className={styles.dots}>
              {rows.map((row, index) => (
                <button
                  key={row.our}
                  type="button"
                  className={`${styles.dot} ${index === active ? styles.dotActive : ""}`}
                  aria-label={titles[index] ?? row.our}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(index);
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {hasOutcome ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.38 }}
            className={styles.outcome}
          >
            {t("compare.outcome")}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
