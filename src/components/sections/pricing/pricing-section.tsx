"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Badge, Button, Card, Col, Flex, Row, Tag, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import type { PricingPlan } from "@/types/landing.types";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import styles from "./pricing-section.module.css";
import { CheckIcon } from "@/components/ui/icons/icons";

const { Title, Text } = Typography;

const MONTH_LABELS: Record<number, string> = {
  1: "mo1",
  3: "mo3",
  6: "mo6",
  12: "mo12",
};

interface PricingSectionProps {
  plans: PricingPlan[];
}

export function PricingSection({ plans }: PricingSectionProps) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="pricing" className={styles.section}>
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
            {t("pricing.label")}
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
            {t("pricing.title")}
          </Title>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 17,
              lineHeight: 1.6,
            }}
          >
            {t("pricing.subtitle")}
          </Text>
          <Text
            style={{
              display: "block",
              maxWidth: 860,
              margin: "28px auto 0",
              padding: "20px 28px",
              borderRadius: theme.radius.xl,
              background: theme.colors.accentBg,
              border: `1px solid ${theme.colors.accentBorder}`,
              color: theme.colors.textPrimary,
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.65,
            }}
          >
            🎁 {t("pricing.trialNote")}
          </Text>
        </motion.div>

        <Row gutter={[20, 20]} justify="center">
          {plans.map((plan, i) => (
            <Col key={plan.code} xs={24} sm={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                style={{ height: "100%" }}
              >
                {plan.isPopular ? (
                  <Badge.Ribbon
                    text={t("pricing.popular")}
                    color={theme.colors.accent}
                    className={styles.popularBadge}
                  >
                    <PricingCard plan={plan} t={t} />
                  </Badge.Ribbon>
                ) : (
                  <PricingCard plan={plan} t={t} />
                )}
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Registration hint — прямо под карточками */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ textAlign: "center", marginTop: 20 }}
        >
          <Text
            style={{
              color: theme.colors.textTertiary,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            💡 {t("pricing.registrationHint")}
          </Text>
        </motion.div>

        {/* Состав тарифа одной карточкой: сначала что подключаешь,
            потом что получаешь, и тут же вариант для сети — раньше эти три
            куска висели по отдельности и не читались как одно предложение */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.includes}
        >
          <div className={styles.includesGrid}>
            <div className={styles.includesCol}>
              <Text className={styles.includesTitle}>
                {t("pricing.connectTitle")}
              </Text>
              <ul className={styles.includesList}>
                {(
                  t("pricing.connectItems", { returnObjects: true }) as string[]
                ).map((item) => (
                  <li key={item} className={styles.includesItem}>
                    <CheckIcon size={15} className={styles.includeIcon} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.includesCol}>
              <Text className={styles.includesTitle}>
                {t("pricing.included")}
              </Text>
              <ul
                className={`${styles.includesList} ${styles.includesListTwo}`}
              >
                {(
                  t("pricing.includedItems", {
                    returnObjects: true,
                  }) as string[]
                ).map((item) => (
                  <li key={item} className={styles.includesItem}>
                    <CheckIcon size={15} className={styles.includeIcon} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.networkRow}>
            <div className={styles.networkText}>
              <Text className={styles.networkTitle}>
                {t("pricing.customTitle")}
              </Text>
              <Text className={styles.networkSubtitle}>
                {t("pricing.customSubtitle")}
              </Text>
            </div>
            <Flex gap={10} className={styles.networkActions}>
              <Button
                href={LINKS.support.telegram}
                target="_blank"
                className={styles.defaultBtn}
                onClick={() => reachGoal("click_tg_support")}
              >
                Telegram
              </Button>
              <Button
                href={LINKS.support.email}
                className={styles.defaultBtn}
                onClick={() => reachGoal("click_email_support")}
              >
                {t("pricing.emailCta")}
              </Button>
            </Flex>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  t,
}: {
  plan: PricingPlan;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const isPopular = plan.isPopular;

  return (
    <Card
      className={`${styles.card} ${isPopular ? styles.cardPopular : ""}`}
      styles={{ body: { padding: 28, height: "100%" } }}
    >
      <Flex vertical gap={20} style={{ height: "100%" }}>
        {/* Duration */}
        <Flex align="center" justify="space-between">
          <Text
            style={{
              color: isPopular
                ? theme.colors.accent
                : theme.colors.textSecondary,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {t(`pricing.months.${plan.months}`)}
          </Text>
          {plan.discountPercent > 0 && (
            <Tag
              style={{
                background: theme.colors.successBg,
                border: `1px solid ${theme.colors.success}44`,
                color: theme.colors.success,
                borderRadius: "var(--radius-pill)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              −{plan.discountPercent}%
            </Tag>
          )}
        </Flex>

        {/* Price */}
        <Flex vertical gap={4}>
          <Tag
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: theme.colors.successBg,
              border: `1px solid ${theme.colors.success}44`,
              color: theme.colors.success,
              borderRadius: "var(--radius-pill)",
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 10px",
              marginBottom: 4,
              width: "fit-content",
            }}
          >
            🎁 {t("pricing.freeTrial")}
          </Tag>
          <Flex align="baseline" gap={4}>
            <Title
              level={2}
              style={{
                color: isPopular
                  ? theme.colors.accent
                  : theme.colors.textPrimary,
                margin: 0,
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {plan.pricePerMonth.toLocaleString("ru-RU")} ₽
            </Title>
          </Flex>
          <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
            {t("pricing.perMonth")}
          </Text>
          {plan.months > 1 && (
            <Text style={{ color: theme.colors.textTertiary, fontSize: 12 }}>
              {t("pricing.totalBilled", {
                total: plan.priceRub.toLocaleString("ru-RU"),
              })}{" "}
              ₽
            </Text>
          )}
        </Flex>

        {/* CTA */}
        <Button
          type={isPopular ? "primary" : "default"}
          block
          size="large"
          href={LINKS.crm}
          target="_blank"
          className={isPopular ? styles.primaryBtn : styles.defaultBtn}
          style={{ marginTop: "auto" }}
          onClick={() => reachGoal("click_trial")}
        >
          {t("pricing.cta")}
        </Button>
      </Flex>
    </Card>
  );
}
