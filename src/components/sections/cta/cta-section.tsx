"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import styles from "./cta-section.module.css";

const { Title, Text } = Typography;

export function CtaSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasTrust = useHasTranslation("trust.line");

  return (
    <section id="cta" className={styles.section}>
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

            <Flex gap={12} wrap justify="center" className={styles.trialStats}>
              {(
                t("cta.trialFeatures", { returnObjects: true }) as string[]
              ).map((item, i) => (
                <div key={i} className={styles.trialStat}>
                  {item}
                </div>
              ))}
            </Flex>

            {/* Две дороги (Р15 плана «Заявка на запуск»): запуск нашими
                руками или регистрация и настройка самому. Документация —
                ссылкой под ними, третьей кнопкой она спорила бы с выбором */}
            <Flex gap={12} wrap justify="center">
              <Button
                type="primary"
                size="large"
                href={LINKS.pages.zapusk}
                className={styles.primaryBtn}
                onClick={() => reachGoal("click_trial", { to: "zapusk" })}
              >
                {t("cta.button")}
              </Button>
              <Button
                type="default"
                size="large"
                href={LINKS.crmRegister}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryBtn}
                onClick={() => reachGoal("click_trial", { to: "crm" })}
              >
                {t("cta.self")}
              </Button>
            </Flex>

            <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
              {t("cta.hint")}
            </Text>

            <a
              href={LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              {t("cta.docs")} →
            </a>

            {/* Сколково, российское происхождение и 152-ФЗ — здесь, а не только
                мелким шрифтом в подвале: для сетей это аргумент уровня цены,
                и читается он там, где принимается решение */}
            {hasTrust ? (
              <span className={styles.trust}>{t("trust.line")}</span>
            ) : null}
          </Flex>
        </motion.div>
      </div>
    </section>
  );
}
