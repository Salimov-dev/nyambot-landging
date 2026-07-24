"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Col, Flex, Row, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import { PercentIcon } from "@/components/ui/icons/icons";
import styles from "./switch-section.module.css";

const { Title, Text } = Typography;

const STEPS = [
  { step: 1, key: "0" },
  { step: 2, key: "1" },
  { step: 3, key: "2" },
  { step: 4, key: "3" },
] as const;

export function SwitchSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="switch" className={styles.section}>
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
            {t("switch.label")}
          </Text>
          <Title
            level={2}
            className={styles.title}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "12px 0 16px",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: t("switch.title") }} />
          </Title>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 17,
              lineHeight: 1.6,
              display: "block",
              maxWidth: 640,
              margin: "0 auto 20px",
            }}
          >
            {t("switch.subtitle")}
          </Text>
          <span className={styles.badge}>
            <PercentIcon size={17} />
            {t("switch.badge")}
          </span>
        </motion.div>

        <Row gutter={[24, 24]} className={styles.steps}>
          {STEPS.map((step, i) => (
            <Col key={step.step} xs={24} sm={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={styles.stepCard}
              >
                <Flex vertical gap={12}>
                  <Flex align="center" gap={12} className={styles.stepHead}>
                    <div className={styles.stepNumber}>
                      <Text
                        style={{
                          color: theme.colors.accent,
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        {step.step}
                      </Text>
                    </div>
                    <Title
                      level={4}
                      style={{
                        color: theme.colors.textPrimary,
                        margin: 0,
                        fontWeight: 700,
                        fontSize: 17,
                        lineHeight: 1.25,
                      }}
                    >
                      {t(`switch.steps.${step.key}.title`)}
                    </Title>
                  </Flex>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {t(`switch.steps.${step.key}.description`)}
                  </Text>
                </Flex>
              </motion.div>
            </Col>
          ))}
        </Row>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.offer}
        >
          <Flex gap={12} wrap justify="center" className={styles.actions}>
            <Button
              type="primary"
              size="large"
              href={LINKS.support.telegram}
              target="_blank"
              className={styles.primaryBtn}
              onClick={() => reachGoal("click_switch")}
            >
              {t("switch.button")}
            </Button>
          </Flex>

          <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
            {t("switch.hint")}
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
