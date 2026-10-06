"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { reachGoal } from "@/config/metrika";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import {
  BroadcastScene,
  ChatScene,
  ConstructorScene,
  DeliveryScene,
  GrowthScene,
  RetentionScene,
} from "./features-scenes";
import styles from "./features-section.module.css";

const { Title, Text } = Typography;

type Benefit = {
  id: string;
  scene: () => React.ReactElement;
  accentColor: string;
};

/**
 * Плитки вместо раскрывающихся блоков.
 *
 * 🔴 Раскрывашки «Подробнее» открывали за месяц 4 раза на 447 визитов, а текста
 * держали 1350 слов — 28% всей страницы при медиане визита 15 секунд. Подробный
 * разбор уехал на `/vozmozhnosti`, здесь остались заголовок и одна строка.
 * Плитки не пересекаются с секцией «Главное»: та про устройство продукта,
 * эта — про то, что приносит деньги.
 *
 * 🔴 Не больше шести плиток (Руслан 06.10.2026) — два ряда по три. Здесь
 * только то, что прямо делает выручку: повторные заказы, чек, возврат уснувших,
 * блюдо под себя, ответы ИИ, доставка. «Приложение „Команда“» (есть в составе
 * тарифа), «Запустим за тебя» (сказано в «Сравнении», расписано на /zapusk),
 * метрики гостей, «чего не хватает в меню» и оповещения о сбоях сняты с главной
 * — все они на /vozmozhnosti по кнопке ниже. На телефоне плитка — сцена
 * и заголовок одной строкой, без текста: абзацы подряд давали самую длинную
 * секцию страницы.
 *
 * Живые сцены вместо значков (Руслан 06.10.2026): в каждой плитке крутится
 * своя маленькая сцена выгоды — монеты в кошельке, растущий чек, письмо
 * уснувшему гостю, лук долой и сыр сверху, ответ бота, машина до метки.
 * Подсветки по очереди нет — она уже у «Что это даёт заведению»; сцены идут
 * разом, со сдвигом по кругу, чтобы не двигались в такт.
 */
const BENEFITS: readonly Benefit[] = [
  { id: "retention", scene: RetentionScene, accentColor: theme.colors.success },
  { id: "growth", scene: GrowthScene, accentColor: "#14c4a2" },
  { id: "segmentBroadcast", scene: BroadcastScene, accentColor: "#be4bdb" },
  { id: "constructor", scene: ConstructorScene, accentColor: "#e64980" },
  { id: "guestChat", scene: ChatScene, accentColor: "#7950f2" },
  { id: "delivery", scene: DeliveryScene, accentColor: "#f76707" },
] as const;

/** Сдвиг сцен по кругу между плитками, с */
const TILE_OFFSET_S = 0.7;

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const base = `benefits.items.${benefit.id}`;
  const Scene = benefit.scene;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className={`${styles.tile} landing-glass-card`}
      style={
        {
          "--tile": benefit.accentColor,
          "--offset": `${-index * TILE_OFFSET_S}s`,
        } as CSSProperties
      }
    >
      <div className={styles.illo}>
        <Scene />
      </div>

      <div className={styles.tileBody}>
        <Title level={3} className={styles.tileTitle}>
          {t(`${base}.title`)}
        </Title>

        <Text className={styles.tileText}>{t(`${base}.text`)}</Text>
      </div>
    </motion.article>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  // Сцены крутятся, только пока сетка на экране
  const gridRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      {
        threshold: 0.15,
      },
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("benefits.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("benefits.title")}
          </Title>
          <Text className={styles.subtitle}>{t("benefits.subtitle")}</Text>
        </motion.div>

        <div
          ref={gridRef}
          className={`${styles.tileGrid} ${onScreen ? "" : styles.paused}`}
        >
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={i} />
          ))}
        </div>

        <Link
          href={LINKS.pages.features}
          className={styles.moreLink}
          onClick={() =>
            reachGoal("click_solution", { page: "features", from: "section" })
          }
        >
          {t("benefits.moreCta")} →
        </Link>
      </div>
    </section>
  );
}
