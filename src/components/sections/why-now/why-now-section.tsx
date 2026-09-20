"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import styles from "./why-now-section.module.css";

const { Title, Text } = Typography;

type Stat = { value: string; text: string };

/**
 * Блок «почему сейчас» — второй экран страницы.
 *
 * 🔴 Раньше аудитория мессенджеров жила только на странице
 * «Сайт или приложение»: цифры видел тот, кто уже долистал главную и кликнул,
 * то есть уже согласный. Решение «нужен ли вообще канал в мессенджере»
 * принимается выше — здесь.
 *
 * Цифры Mediascope: MAX — около 85 млн в месяц и 72 млн в день,
 * Телеграм — около 75 млн в месяц. Округляем до целых — десятые
 * на телефоне рвут строку и ничего не добавляют. Источник на странице не указываем.
 */
export function WhyNowSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasText = useHasTranslation("whyNow.title");

  if (!hasText) return null;

  const stats = t("whyNow.stats", { returnObjects: true }) as Stat[];

  return (
    <section id="why-now" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("whyNow.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("whyNow.title")}
          </Title>
        </motion.div>

        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`${styles.stat} landing-glass-card`}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <Text className={styles.statText}>{stat.text}</Text>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.26 }}
          className={styles.body}
        >
          <Text className={styles.text}>{t("whyNow.text")}</Text>
          <p className={styles.outcome}>{t("whyNow.outcome")}</p>
        </motion.div>
      </div>
    </section>
  );
}
