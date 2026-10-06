"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Badge, Button, Card, Col, Flex, Row, Tag, Typography } from "antd";
import {
  CheckIcon,
  GiftIcon,
  PercentIcon,
  StoreIcon,
} from "@/components/ui/icons/icons";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import type { PricingPlan } from "@/types/landing.types";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import styles from "./pricing-section.module.css";

const { Title, Text } = Typography;

type Translate = (key: string, opts?: Record<string, unknown>) => string;

interface PricingSectionProps {
  plans: PricingPlan[];
}

/** Цены на странице — в русской записи с неразрывными пробелами (4 900),
 *  как и раньше в карточках, на любом языке страницы. */
function formatRub(value: number): string {
  return value.toLocaleString("ru-RU");
}

/** Ключ ленты над тарифом: «Оптимально» или «Выгодно», у остальных — нет. */
function planBadgeKey(plan: PricingPlan): string | null {
  if (plan.isPopular) return "pricing.popular";
  if (plan.isBestValue) return "pricing.bestValue";
  return null;
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
          {/* Условие пробного периода — строкой, без отдельной плашки
              (Руслан 06.10.2026: «слишком много всего»). Текст условия тот же */}
          <p className={styles.trialNote}>
            <GiftIcon size={16} />
            {t("pricing.trialNote")}
          </p>
        </motion.div>

        {/* Подсказки «оплати тариф — после этого можно начинать работу» под
            карточками больше нет (Руслан 06.10.2026): она спорила с 30 днями
            без карты из trialNote прямо над ней. */}
        <Row gutter={[20, 20]} justify="center" className={styles.cards}>
          {plans.map((plan, i) => {
            const badgeKey = planBadgeKey(plan);

            return (
              <Col key={plan.code} xs={24} sm={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  style={{ height: "100%" }}
                >
                  {badgeKey ? (
                    <Badge.Ribbon
                      text={t(badgeKey)}
                      color={
                        plan.isPopular
                          ? theme.colors.accent
                          : theme.colors.success
                      }
                      className={styles.popularBadge}
                    >
                      <PricingCard plan={plan} t={t} />
                    </Badge.Ribbon>
                  ) : (
                    <PricingCard plan={plan} t={t} />
                  )}
                </motion.div>
              </Col>
            );
          })}
        </Row>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className={styles.compact}
        >
          <PricingList plans={plans} t={t} />
        </motion.div>

        {/* Под ценами — три короткие карточки в ряд: что в тарифе, переезд со
            скидкой и сеть (Руслан 06.10.2026: раньше это были три больших
            блока, потом сплошной текст — «не просто текстом»). */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={styles.details}
        >
          <div className={styles.detailCard}>
            <span className={styles.detailIcon}>
              <CheckIcon size={18} />
            </span>
            <span className={styles.detailTitle}>
              {t("pricing.includesLabel")}
            </span>
            <span className={styles.detailText}>
              {t("pricing.includesShort")}
            </span>
          </div>

          {/* Переезд со скидкой 50%: скидку фиксируем до оплаты в чате поддержки */}
          <div className={styles.detailCard}>
            <span className={styles.detailIcon}>
              <PercentIcon size={18} />
            </span>
            <span className={styles.detailTitle}>
              {t("pricing.switchTitle")}
            </span>
            <span className={styles.detailText}>{t("pricing.switchNote")}</span>
            <a
              href={LINKS.support.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detailLink}
              onClick={() => reachGoal("click_switch")}
            >
              {t("pricing.switchCta")} →
            </a>
          </div>

          <div className={styles.detailCard}>
            <span className={styles.detailIcon}>
              <StoreIcon size={18} />
            </span>
            <span className={styles.detailTitle}>
              {t("pricing.customTitle")}
            </span>
            <span className={styles.detailText}>
              {t("pricing.customSubtitle")}
            </span>
            <span className={styles.detailLinks}>
              <a
                href={LINKS.support.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.detailLink}
                onClick={() => reachGoal("click_tg_support")}
              >
                Telegram
              </a>
              <a
                href={LINKS.support.email}
                className={styles.detailLink}
                onClick={() => reachGoal("click_email_support")}
              >
                {t("pricing.emailCta")}
              </a>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Тарифы на телефоне — список из четырёх строк и одна кнопка под ним.
 *
 * 🔴 Четыре карточки друг под другом занимали около двух экранов, и каждая
 * повторяла одну и ту же кнопку «Подключить» — а условия у тарифов одни,
 * различаются только срок и цена (Руслан 06.10.2026). Кнопка та же: ссылка на
 * регистрацию и цель click_trial, как у карточек на компьютере.
 */
function PricingList({ plans, t }: { plans: PricingPlan[]; t: Translate }) {
  return (
    <>
      <ul className={styles.planList}>
        {plans.map((plan) => {
          const badgeKey = planBadgeKey(plan);

          return (
            <li
              key={plan.code}
              className={`${styles.planRow} ${plan.isPopular ? styles.planRowPopular : ""}`}
            >
              <span className={styles.planMain}>
                <span className={styles.planHead}>
                  <span className={styles.planMonths}>
                    {t(`pricing.months.${plan.months}`)}
                  </span>
                  {plan.discountPercent > 0 && (
                    <span
                      className={`${styles.planTag} ${styles.planTagSuccess}`}
                    >
                      −{plan.discountPercent}%
                    </span>
                  )}
                  {badgeKey && (
                    <span
                      className={`${styles.planTag} ${plan.isPopular ? styles.planTagAccent : styles.planTagSuccess}`}
                    >
                      {t(badgeKey)}
                    </span>
                  )}
                </span>
                {plan.months > 1 && (
                  <span className={styles.planBilled}>
                    {t("pricing.totalBilled", {
                      total: formatRub(plan.priceRub),
                    })}{" "}
                    ₽
                  </span>
                )}
              </span>

              <span className={styles.planPrice}>
                <span className={styles.planPriceValue}>
                  {formatRub(plan.pricePerMonth)} ₽
                </span>
                <span className={styles.planPerMonth}>
                  {t("pricing.perMonth")}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <Button
        type="primary"
        block
        size="large"
        href={LINKS.crmRegister}
        target="_blank"
        className={styles.primaryBtn}
        onClick={() => reachGoal("click_trial")}
      >
        {t("pricing.cta")}
      </Button>
    </>
  );
}

function PricingCard({ plan, t }: { plan: PricingPlan; t: Translate }) {
  const isPopular = plan.isPopular;

  return (
    <Card
      className={`${styles.card} ${isPopular ? styles.cardPopular : ""}`}
      styles={{ body: { padding: "22px 22px 20px", height: "100%" } }}
    >
      <Flex vertical gap={14} style={{ height: "100%" }}>
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

        {/* Price. Тега «0 ₽ · первые 30 дней» в карточке больше нет
            (Руслан 06.10.2026): четыре одинаковых тега повторяли trialNote
            над карточками и ничем тарифы не различали. */}
        <Flex vertical gap={4}>
          <Flex align="baseline" gap={4}>
            <Title
              level={2}
              style={{
                color: isPopular
                  ? theme.colors.accent
                  : theme.colors.textPrimary,
                margin: 0,
                fontSize: 34,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {formatRub(plan.pricePerMonth)} ₽
            </Title>
          </Flex>
          <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
            {t("pricing.perMonth")}
          </Text>
          {plan.months > 1 && (
            <Text style={{ color: theme.colors.textTertiary, fontSize: 12 }}>
              {t("pricing.totalBilled", {
                total: formatRub(plan.priceRub),
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
          href={LINKS.crmRegister}
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
