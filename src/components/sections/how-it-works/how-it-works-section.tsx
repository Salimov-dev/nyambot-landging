"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Col, Flex, Row, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import styles from "./how-it-works-section.module.css";

const { Title, Text } = Typography;

const STEPS = [
  { step: 1, icon: "🤖", titleKey: "howItWorks.steps.0.title", descKey: "howItWorks.steps.0.description" },
  { step: 2, icon: "📋", titleKey: "howItWorks.steps.1.title", descKey: "howItWorks.steps.1.description" },
  { step: 3, icon: "📣", titleKey: "howItWorks.steps.2.title", descKey: "howItWorks.steps.2.description" },
  { step: 4, icon: "💳", titleKey: "howItWorks.steps.3.title", descKey: "howItWorks.steps.3.description" },
] as const;

export function HowItWorksSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="how-it-works" className={styles.section}>
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
            {t("howItWorks.label")}
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
            {t("howItWorks.title")}
          </Title>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 17, lineHeight: 1.6 }}>
            {t("howItWorks.subtitle")}
          </Text>
        </motion.div>

        <Row gutter={[24, 32]} className={styles.steps}>
          {STEPS.map((step, i) => (
            <Col key={step.step} xs={24} sm={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className={styles.stepCard}
              >
                <Flex vertical gap={16}>
                  <Flex align="center" gap={12}>
                    <div className={styles.stepNumber}>
                      <Text style={{ color: theme.colors.accent, fontSize: 14, fontWeight: 800 }}>
                        {step.step}
                      </Text>
                    </div>
                    <Text style={{ fontSize: 28 }}>{step.icon}</Text>
                  </Flex>
                  <Title
                    level={4}
                    style={{ color: theme.colors.textPrimary, margin: 0, fontWeight: 700, fontSize: 17 }}
                  >
                    {t(step.titleKey)}
                  </Title>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
                    {t(step.descKey)}
                  </Text>
                </Flex>
                {/* Connector line (desktop only) */}
                {i < STEPS.length - 1 && <div className={styles.connector} />}
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
