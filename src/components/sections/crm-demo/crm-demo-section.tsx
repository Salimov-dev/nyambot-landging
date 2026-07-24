"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Tag, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import styles from "./crm-demo-section.module.css";

const { Title, Text } = Typography;

const CRM_FEATURES = [
  { icon: "📊", key: "crmDemo.features.dashboard" },
  { icon: "🛒", key: "crmDemo.features.orders" },
  { icon: "👥", key: "crmDemo.features.clients" },
  { icon: "🎯", key: "crmDemo.features.marketing" },
  { icon: "📋", key: "crmDemo.features.menu" },
  { icon: "📈", key: "crmDemo.features.analytics" },
] as const;

export function CrmDemoSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="crm-demo" className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Flex vertical align="center" gap={20} className={styles.header}>
            <Tag
              style={{
                background: theme.colors.accentBg,
                border: `1px solid ${theme.colors.accentBorder}`,
                color: theme.colors.accent,
                borderRadius: "var(--radius-pill)",
                padding: "4px 14px",
                fontSize: 13,
                fontWeight: 600,
                width: "fit-content",
                marginInlineEnd: 0,
              }}
            >
              🖥️ {t("crmDemo.tag")}
            </Tag>

            <Title
              level={2}
              style={{
                color: theme.colors.textPrimary,
                fontSize: "clamp(26px, 3.4vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {t("crmDemo.title")}
            </Title>

            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 16,
                lineHeight: 1.65,
                display: "block",
                maxWidth: 720,
              }}
            >
              {t("crmDemo.description")}
            </Text>

            {/* Own development badge */}
            <Flex align="center" gap={10} className={styles.ownDevBadge}>
              <Text style={{ fontSize: 18 }}>🏗️</Text>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {t("crmDemo.ownDev")}
              </Text>
            </Flex>
          </Flex>
        </motion.div>

        <div className={styles.featureGrid}>
          {CRM_FEATURES.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className={styles.featureCard}
            >
              <span className={styles.featureIcon}>{f.icon}</span>
              <Title
                level={4}
                style={{
                  color: theme.colors.textPrimary,
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  margin: 0,
                }}
              >
                {t(f.key)}
              </Title>
            </motion.div>
          ))}
        </div>

        <Flex vertical align="center" gap={12} className={styles.ctaBlock}>
          <Button
            type="primary"
            size="large"
            href={LINKS.crm}
            target="_blank"
            style={{
              background: theme.gradients.primary,
              border: "none",
              fontWeight: 600,
            }}
          >
            {t("crmDemo.cta")}
          </Button>
          <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
            {t("crmDemo.ctaHint")}
          </Text>
        </Flex>
      </div>
    </section>
  );
}
