"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import styles from "./own-channels-section.module.css";

const { Title, Text } = Typography;

/**
 * Ответ на возражение «у меня уже есть сайт с заказом и своё приложение».
 *
 * 🔴 Сравнение идёт НЕ про удобство формы заказа. Довод «на сайте гость каждый
 * раз вводит адрес заново» верен только для сайтов без личного кабинета — а
 * кабинет есть у большинства, и на них этот довод читается как незнание рынка.
 * Разница в другом: на сайт нужно ПРИЙТИ, а в мессенджере гость уже есть.
 *
 * 🔴 Блок не отговаривает от сайта. Ресторатор платил за него деньги, и слово
 * «замена» здесь закрывает разговор: сайт остаётся на тех, кто ищет, Нямбот
 * берёт тех, кто уже заказал.
 */
const ROWS = [
  "reach",
  "login",
  "social",
  "pos",
  "payment",
  "loyalty",
  "schedule",
  "contact",
  "max",
] as const;

export function OwnChannelsSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="own-channels" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("ownChannels.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("ownChannels.title")}
          </Title>
          <Text className={styles.subtitle}>{t("ownChannels.subtitle")}</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
          className={styles.table}
        >
          {/* Шапка колонок — только на широком экране: на телефоне строка
              сравнения разворачивается в карточку, и подписи стоят внутри неё */}
          <div className={`${styles.row} ${styles.head}`}>
            <span className={styles.criterion} />
            <span className={styles.headCell}>
              {t("ownChannels.columns.site")}
            </span>
            <span className={`${styles.headCell} ${styles.headCellOwn}`}>
              {t("ownChannels.columns.nyambot")}
            </span>
          </div>

          {ROWS.map((row) => (
            <div key={row} className={styles.row}>
              <span className={styles.criterion}>
                {t(`ownChannels.rows.${row}.criterion`)}
              </span>
              <span className={styles.cell}>
                <span className={styles.cellLabel}>
                  {t("ownChannels.columns.site")}
                </span>
                {t(`ownChannels.rows.${row}.site`)}
              </span>
              <span className={`${styles.cell} ${styles.cellOwn}`}>
                <span className={styles.cellLabel}>
                  {t("ownChannels.columns.nyambot")}
                </span>
                {t(`ownChannels.rows.${row}.nyambot`)}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={styles.outcome}
        >
          <Text className={styles.outcomeText}>{t("ownChannels.outcome")}</Text>
        </motion.div>
      </div>
    </section>
  );
}
