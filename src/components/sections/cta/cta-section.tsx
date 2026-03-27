"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import styles from "./cta-section.module.css";

const { Title, Text } = Typography;

export function CtaSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className={styles.card}
        >
          <Flex vertical align="center" gap={24}>
            <Text style={{ fontSize: 40 }}>🚀</Text>

            <Title
              level={2}
              style={{
                color: theme.colors.textPrimary,
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                margin: 0,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {t("cta.title")}
            </Title>

            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 17,
                lineHeight: 1.65,
                textAlign: "center",
                maxWidth: 520,
                display: "block",
              }}
            >
              {t("cta.subtitle")}
            </Text>

            <Flex gap={12} wrap justify="center">
              <Button
                type="primary"
                size="large"
                href={LINKS.crm}
                target="_blank"
                className={styles.primaryBtn}
              >
                {t("cta.button")}
              </Button>
              <Button
                type="default"
                size="large"
                href={LINKS.docs}
                target="_blank"
                className={styles.secondaryBtn}
              >
                {t("cta.docs")}
              </Button>
            </Flex>

            <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
              {t("cta.hint")}
            </Text>
          </Flex>
        </motion.div>
      </div>
    </section>
  );
}
