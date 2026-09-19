"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import styles from "./solutions-section.module.css";

const { Title, Text } = Typography;

/**
 * Карта вынесенных страниц.
 *
 * 🔴 Подробные разделы уехали с главной на отдельные адреса, и одной ссылки в
 * подвале им мало: внутрь сайта уходит один визит из двадцати. Этот блок —
 * сеть подхвата для тех, кто долистал до конца, и якорь для пункта «Решения»
 * в шапке на телефоне.
 */
const SOLUTIONS = [
  { id: "features", href: LINKS.pages.features },
  { id: "network", href: LINKS.pages.network },
  { id: "ownChannels", href: LINKS.pages.ownChannels },
  { id: "security", href: LINKS.pages.security },
  { id: "faq", href: LINKS.pages.faq },
] as const;

export function SolutionsSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="solutions" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("solutions.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("solutions.title")}
          </Title>
          <Text className={styles.subtitle}>{t("solutions.subtitle")}</Text>
        </motion.div>

        <div className={styles.grid}>
          {SOLUTIONS.map(({ id, href }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Link
                href={href}
                className={`${styles.card} landing-glass-card`}
                onClick={() =>
                  reachGoal("click_solution", { page: id, from: "cards" })
                }
              >
                <span className={styles.cardTitle}>
                  {t(`solutions.items.${id}.title`)}
                </span>
                <span className={styles.cardText}>
                  {t(`solutions.items.${id}.text`)}
                </span>
                <span className={styles.cardArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
