"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import styles from "./security-section.module.css";

const { Title, Text } = Typography;

const ITEMS = [
  { icon: "📜", key: "fz152" },
  { icon: "🇷🇺", key: "localization" },
  { icon: "🔐", key: "encryption" },
  { icon: "💻", key: "madeInRussia" },
  { icon: "🛡️", key: "standards" },
  { icon: "🤝", key: "noThirdParty" },
] as const;

const CHIPS = [
  "backups",
  "policy",
  "deletion",
  "minData",
  "supportRu",
] as const;

export function SecuritySection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="security" className={styles.section}>
      <div className={styles.glow} />
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
            {t("security.label")}
          </Text>
          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "12px 0 16px",
            }}
          >
            {t("security.title")}
          </Title>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 17,
              lineHeight: 1.6,
            }}
          >
            {t("security.subtitle")}
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <div className={styles.badgesGrid}>
            {ITEMS.map((item) => (
              <span key={item.key} className={styles.badge}>
                <span className={styles.badgeIcon}>{item.icon}</span>
                {t(`security.items.${item.key}.title`)}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.chipsBar}>
            {CHIPS.map((chip) => (
              <span key={chip} className={styles.chip}>
                <span className={styles.chipDot} />
                {t(`security.chips.${chip}`)}
              </span>
            ))}
          </div>

          <Flex className={styles.legalLinks}>
            <Button
              href={LINKS.legal.privacy}
              target="_blank"
              style={{
                background: "transparent",
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
              }}
            >
              {t("security.privacyLink")}
            </Button>
            <Button
              href={LINKS.legal.offer}
              target="_blank"
              style={{
                background: "transparent",
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
              }}
            >
              {t("security.offerLink")}
            </Button>
          </Flex>
        </motion.div>
      </div>
    </section>
  );
}
