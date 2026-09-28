"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import styles from "./free-review-section.module.css";

type FreeReviewItem = { title: string; text: string };

/**
 * Бесплатный разбор заведения — главное предложение для новых лидов
 * (решение Руслана 28.09.2026: «не между строк, а явно и чтобы хотелось
 * воспользоваться»). Стоит сразу под первым экраном и ведёт на `/zapusk`.
 *
 * Своя вёрстка без кнопки antd: блок стоит на первом экране прокрутки, а
 * стили antd приезжают после первой отрисовки — кнопка вспыхивала бы.
 */
export function FreeReviewSection({
  embedded = false,
}: {
  /** Внутри посадочной: у страницы свои поля, внешние отступы блоку не нужны. */
  embedded?: boolean;
} = {}) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const items = t("freeReview.items", {
    returnObjects: true,
  }) as FreeReviewItem[];

  return (
    <section
      id="free-review"
      className={embedded ? styles.sectionEmbedded : styles.section}
    >
      <div className={embedded ? undefined : styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.card}
        >
          <h2 className={styles.title}>{t("freeReview.title")}</h2>

          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.title} className={styles.item}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemText}>{item.text}</span>
              </li>
            ))}
          </ul>

          <p className={styles.guarantee}>{t("freeReview.guarantee")}</p>

          <div className={styles.actions}>
            <Link
              href={LINKS.pages.zapusk}
              className={styles.button}
              onClick={() =>
                reachGoal("click_trial", { to: "zapusk", from: "free_review" })
              }
            >
              {t("freeReview.button")}
            </Link>
            <p className={styles.note}>{t("freeReview.note")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
