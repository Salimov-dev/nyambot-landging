"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Col, Flex, Row, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import styles from "./stats-section.module.css";

const { Text, Title } = Typography;

const STATS = [
  {
    valueKey: "stats.commission.value",
    labelKey: "stats.commission.label",
    icon: "🚀",
  },
  {
    valueKey: "stats.messengers.value",
    labelKey: "stats.messengers.label",
    icon: "💬",
  },
  { valueKey: "stats.trial.value", labelKey: "stats.trial.label", icon: "🎁" },
  {
    valueKey: "stats.savings.value",
    labelKey: "stats.savings.label",
    icon: "💰",
  },
] as const;

export function StatsSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="stats" className={styles.section} ref={ref}>
      <div className={styles.inner}>
        <Row gutter={[24, 24]}>
          {STATS.map((stat, i) => (
            <Col key={stat.valueKey} xs={12} sm={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Flex
                  vertical
                  align="center"
                  gap={8}
                  className={styles.statCard}
                >
                  <Text style={{ fontSize: 28 }}>{stat.icon}</Text>
                  <Title
                    level={3}
                    style={{
                      color: theme.colors.accent,
                      margin: 0,
                      fontSize: 32,
                      fontWeight: 800,
                    }}
                  >
                    {t(stat.valueKey)}
                  </Title>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    {t(stat.labelKey)}
                  </Text>
                </Flex>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
