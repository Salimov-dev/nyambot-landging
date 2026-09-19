"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { CheckIcon } from "@/components/ui/icons/icons";
import styles from "./compare-section.module.css";

const { Title, Text } = Typography;

type Row = { usual: string; our: string };

/**
 * Сравнение с другими сервисами заказа в мессенджерах.
 *
 * 🔴 Конкуренты не названы намеренно: строка «обычно» описывает устройство
 * таких сервисов, а не конкретную компанию — иначе блок превращается
 * в заявление о чужом продукте, которое придётся доказывать.
 *
 * Пары строк не переставлять по вкусу: первая — про один бот на оба
 * мессенджера и на всю сеть, это главное отличие, и на телефоне видна
 * только она.
 */
export function CompareSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasText = useHasTranslation("compare.title");

  if (!hasText) return null;

  const rows = t("compare.rows", { returnObjects: true }) as Row[];

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

        <div className={styles.table}>
          <div className={styles.colHead}>
            <span className={styles.headUsual}>{t("compare.usualLabel")}</span>
            <span className={styles.headOur}>{t("compare.ourLabel")}</span>
          </div>

          {rows.map((row, index) => (
            <motion.div
              key={row.our}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className={styles.row}
            >
              <div className={styles.usual}>
                {/* Подпись повторяется в каждой строке: на телефоне колонки
                    встают друг под друга, и шапка таблицы уезжает из вида */}
                <span className={styles.rowLabel}>
                  {t("compare.usualLabel")}
                </span>
                <span className={styles.usualText}>{row.usual}</span>
              </div>
              <div className={styles.our}>
                <span className={styles.rowLabel}>{t("compare.ourLabel")}</span>
                <span className={styles.ourText}>
                  <CheckIcon size={16} className={styles.check} />
                  {row.our}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
