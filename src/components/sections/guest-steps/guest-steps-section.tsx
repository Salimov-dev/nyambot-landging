"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import styles from "./guest-steps-section.module.css";

const { Title, Text } = Typography;

type Step = { title: string; text: string };

/**
 * Путь гостя от касания до оплаченного заказа.
 *
 * 🔴 Соседний блок «Как гости попадают в приложение» отвечает, ОТКУДА придёт
 * гость, — это вопрос маркетолога. Владельца волнует другое: что происходит
 * после тапа и на каком шаге гость отвалится. Отсюда шаги нумерованные:
 * порядок здесь и есть содержание.
 */
export function GuestStepsSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasText = useHasTranslation("guestSteps.title");

  if (!hasText) return null;

  const steps = t("guestSteps.items", { returnObjects: true }) as Step[];

  return (
    <section id="guest-steps" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("guestSteps.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("guestSteps.title")}
          </Title>
        </motion.div>

        <ol className={styles.list}>
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className={styles.item}
            >
              <span className={styles.num} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.itemBody}>
                <span className={styles.itemTitle}>{step.title}</span>
                <span className={styles.itemText}>{step.text}</span>
              </span>
            </motion.li>
          ))}
        </ol>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.38 }}
          className={styles.outcome}
        >
          {t("guestSteps.outcome")}
        </motion.p>
      </div>
    </section>
  );
}
