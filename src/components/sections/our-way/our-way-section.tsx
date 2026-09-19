"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { CheckIcon, HandshakeIcon } from "@/components/ui/icons/icons";
import styles from "./our-way-section.module.css";

const { Title, Text } = Typography;

/**
 * Как мы продаём и как помогаем — блок перед тарифами.
 *
 * 🔴 Две половины неразделимы. Первая снимает ожидание «сначала заявка, потом
 * узнаете цену»: тарифы опубликованы, регистрация без менеджера. Но одна она
 * читается как «разбирайся сам», а это главный страх ресторатора — поэтому
 * вторая половина обещает помощь с настройкой. Убрать вторую — блок начнёт
 * отпугивать тех, кого должен убеждать.
 */
export function OurWaySection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasText = useHasTranslation("ourWay.title");

  if (!hasText) return null;

  const helpItems = t("ourWay.helpItems", { returnObjects: true }) as string[];

  return (
    <section id="our-way" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("ourWay.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("ourWay.title")}
          </Title>
          <Text className={styles.text}>{t("ourWay.text")}</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.12 }}
          className={`${styles.help} landing-glass-card`}
        >
          <span className={styles.helpIcon}>
            <HandshakeIcon size={22} />
          </span>
          <Title level={3} className={styles.helpTitle}>
            {t("ourWay.helpTitle")}
          </Title>
          <Text className={styles.helpText}>{t("ourWay.helpText")}</Text>

          <ul className={styles.helpList}>
            {helpItems.map((item) => (
              <li key={item} className={styles.helpItem}>
                <CheckIcon size={16} className={styles.check} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
