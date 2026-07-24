"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import styles from "./why-section.module.css";
import { PuzzleIcon, ZapIcon, ShieldIcon } from "@/components/ui/icons/icons";

const { Title, Text } = Typography;

const REASONS = [
  { id: "ownDev", icon: ShieldIcon },
  { id: "pos", icon: PuzzleIcon },
  { id: "fast", icon: ZapIcon },
  { id: "noRisk", icon: ShieldIcon },
] as const;

export function WhySection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="why" className={styles.section}>
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
            {t("why.label")}
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
            {t("why.title")}
          </Title>
        </motion.div>

        <div className={styles.grid}>
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={styles.card}
            >
              {/* Иконка и заголовок в одной строке: вертикальный столбик
                  иконка → заголовок → текст растягивал карточку */}
              <Flex align="flex-start" gap={12} className={styles.cardHead}>
                <span className={styles.icon}>
                  <reason.icon size={22} />
                </span>
                <Title
                  level={4}
                  style={{
                    color: theme.colors.textPrimary,
                    fontSize: 16,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {t(`why.items.${reason.id}.title`)}
                </Title>
              </Flex>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                {t(`why.items.${reason.id}.text`)}
              </Text>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.riskBanner}
        >
          <Flex vertical gap={6} className={styles.riskText}>
            <Title
              level={3}
              style={{
                color: theme.colors.accent,
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ShieldIcon size={20} /> {t("why.riskTitle")}
            </Title>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 16,
                lineHeight: 1.6,
              }}
            >
              {t("why.riskText")}
            </Text>
          </Flex>
          <Button
            type="primary"
            size="large"
            href={LINKS.crm}
            target="_blank"
            className={styles.riskBtn}
            onClick={() => reachGoal("click_trial")}
          >
            {t("why.riskCta")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
