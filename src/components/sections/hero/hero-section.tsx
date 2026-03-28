"use client";

import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { Button, Flex, Tag, Typography } from "antd";
import { PhoneMockup } from "@/components/ui/phone-mockup/phone-mockup";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import styles from "./hero-section.module.css";

const { Title, Text } = Typography;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const phoneVariants: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.92 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
};

export function HeroSection() {
  const { t } = useTranslation("landing");

  return (
    <section id="hero" className={styles.section}>
      {/* Glow фон */}
      <div className={styles.glow} />

      <div className={styles.inner}>
        <Flex align="center" justify="space-between" gap={48} className={styles.content}>
          {/* Левая колонка — текст */}
          <motion.div
            className={styles.textCol}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Tag className={styles.badge}>{t("hero.badge")}</Tag>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Title level={1} className={styles.title}>
                <span dangerouslySetInnerHTML={{ __html: t("hero.title") }} />
              </Title>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Text className={styles.subtitle}>{t("hero.subtitle")}</Text>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Flex gap={12} wrap className={styles.ctaRow}>
                <Button
                  type="primary"
                  size="large"
                  href={LINKS.crm}
                  target="_blank"
                  className={styles.primaryBtn}
                >
                  {t("hero.cta")}
                </Button>
                <Button
                  type="default"
                  size="large"
                  href="#features"
                  className={styles.secondaryBtn}
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Flex>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
                {t("hero.trial")}
              </Text>
            </motion.div>
          </motion.div>

          {/* Правая колонка — телефон */}
          <motion.div
            className={styles.phoneCol}
            variants={phoneVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.phoneWrapper}>
              <div className={styles.phoneGlow} />
              <PhoneMockup>
                <div className={styles.phoneScreen} />
              </PhoneMockup>
            </div>
          </motion.div>
        </Flex>
      </div>
    </section>
  );
}
