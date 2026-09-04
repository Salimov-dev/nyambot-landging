"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Collapse, Flex, Typography } from "antd";
import type { CollapseProps } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import ruLanding from "../../../../public/locales/ru/landing.json";
import styles from "./faq-section.module.css";

const { Title, Text } = Typography;

/**
 * 🔴 Вопросы берутся из словаря ЦЕЛИКОМ, а не по списку ключей.
 *
 * Список ключей здесь был забит руками и остановился на девятом вопросе, пока
 * словарь дорос до шестнадцати. Семь ответов — про оплату, пробный период,
 * скидку 50%, поддержку, MAX и сроки запуска — были написаны, переведены на
 * семь языков и **не показывались никому**: разметка для поисковиков отдаёт их
 * все (`structured-data`), то есть Google ответы видел, а человек нет.
 *
 * Длина берётся у русского словаря — он же источник разметки: перевод, в
 * котором вопросов меньше, отдал бы пустые строки, и это заметно сразу, а
 * молчаливой потери вопроса больше не будет.
 */
const FAQ_COUNT = (ruLanding.faq.items as unknown[]).length;

export function FaqSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  const items: CollapseProps["items"] = Array.from(
    { length: FAQ_COUNT },
    (_, i) => `faq.items.${i}`,
  ).map((key, i) => ({
    key: String(i),
    label: (
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {t(`${key}.question`)}
      </Text>
    ),
    children: (
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: 15,
          lineHeight: 1.7,
        }}
      >
        {t(`${key}.answer`)}
      </Text>
    ),
  }));

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text
            style={{
              color: theme.colors.accent,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {t("faq.label")}
          </Text>
          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "12px 0 0",
            }}
          >
            {t("faq.title")}
          </Title>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={styles.collapseWrapper}
        >
          <Collapse
            items={items}
            accordion
            ghost
            expandIconPlacement="end"
            className={styles.collapse}
          />
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Flex
            justify="center"
            align="center"
            gap={8}
            className={styles.supportHint}
          >
            <Text style={{ color: theme.colors.textTertiary, fontSize: 14 }}>
              {t("faq.notFound")}
            </Text>
            <a
              href={LINKS.support.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportLink}
            >
              {t("faq.askSupport")}
            </a>
          </Flex>
        </motion.div>
      </div>
    </section>
  );
}
