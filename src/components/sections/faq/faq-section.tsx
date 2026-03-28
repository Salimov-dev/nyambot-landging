"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Collapse, Flex, Typography } from "antd";
import type { CollapseProps } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import styles from "./faq-section.module.css";

const { Title, Text } = Typography;

const FAQ_KEYS = [
  "faq.items.0",
  "faq.items.1",
  "faq.items.2",
  "faq.items.3",
  "faq.items.4",
  "faq.items.5",
  "faq.items.6",
  "faq.items.7",
] as const;

export function FaqSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  const items: CollapseProps["items"] = FAQ_KEYS.map((key, i) => ({
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
              style={{
                color: theme.colors.accent,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {t("faq.askSupport")}
            </a>
          </Flex>
        </motion.div>
      </div>
    </section>
  );
}
