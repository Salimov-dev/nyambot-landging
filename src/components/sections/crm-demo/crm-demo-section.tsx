"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Col, Flex, Row, Tag, Typography } from "antd";
import { NotebookMockup } from "@/components/ui/notebook-mockup/notebook-mockup";
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
        <Row gutter={[64, 48]} align="middle">
          {/* Left — text */}
          <Col xs={24} lg={10}>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Flex vertical gap={24}>
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
                  }}
                >
                  🖥️ {t("crmDemo.tag")}
                </Tag>

                <Title
                  level={2}
                  style={{
                    color: theme.colors.textPrimary,
                    fontSize: "clamp(24px, 3vw, 38px)",
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
                  }}
                >
                  {t("crmDemo.description")}
                </Text>

                {/* Own development badge */}
                <Flex
                  align="center"
                  gap={10}
                  className={styles.ownDevBadge}
                >
                  <Text style={{ fontSize: 18 }}>🏗️</Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 1.5 }}>
                    {t("crmDemo.ownDev")}
                  </Text>
                </Flex>

                <div className={styles.featureGrid}>
                  {CRM_FEATURES.map((f) => (
                    <Flex key={f.key} align="center" gap={10} className={styles.featureItem}>
                      <Text style={{ fontSize: 20 }}>{f.icon}</Text>
                      <Text style={{ color: theme.colors.textSecondary, fontSize: 14, fontWeight: 500 }}>
                        {t(f.key)}
                      </Text>
                    </Flex>
                  ))}
                </div>

                {/* Transparent pricing */}
                <Flex align="center" gap={10} className={styles.pricingBadge}>
                  <Text style={{ fontSize: 18 }}>💳</Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 1.5 }}>
                    {t("crmDemo.pricing")}
                  </Text>
                </Flex>

                <Flex gap={12} wrap>
                  <Button
                    type="primary"
                    size="large"
                    href={LINKS.crm}
                    target="_blank"
                    style={{ background: theme.gradients.primary, border: "none", fontWeight: 600 }}
                  >
                    {t("crmDemo.cta")}
                  </Button>
                </Flex>

                <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
                  {t("crmDemo.ctaHint")}
                </Text>
              </Flex>
            </motion.div>
          </Col>

          {/* Right — notebook mockup */}
          <Col xs={24} lg={14}>
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <NotebookMockup>
                <div className={styles.notebookScreen}>
                  <Flex
                    vertical
                    align="center"
                    justify="center"
                    style={{ height: "100%", gap: 12, padding: 24 }}
                  >
                    <Text style={{ fontSize: 48 }}>📊</Text>
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 14,
                        textAlign: "center",
                      }}
                    >
                      {t("crmDemo.screenPlaceholder")}
                    </Text>
                  </Flex>
                </div>
              </NotebookMockup>
            </motion.div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
