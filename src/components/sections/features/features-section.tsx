"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Modal, Tag, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import styles from "./features-section.module.css";

const { Title, Text } = Typography;

type Benefit = {
  id: string;
  icon: string;
  accentColor: string;
  linkUrl?: string;
};

const BENEFITS: readonly Benefit[] = [
  { id: "channel", icon: "🌐", accentColor: "#15aabf" },
  { id: "growth", icon: "🎯", accentColor: "#14c4a2" },
  { id: "retention", icon: "💸", accentColor: theme.colors.success },
  { id: "pos", icon: "🍳", accentColor: "#7048e8" },
  { id: "constructor", icon: "🍔", accentColor: "#e64980" },
  { id: "delivery", icon: "📦", accentColor: "#f76707" },
  { id: "team", icon: "👥", accentColor: "#12b886" },
  { id: "autopilot", icon: "⚙️", accentColor: "#1677ff" },
] as const;

type DetailsSection = { title: string; points: string[] };

function BenefitCard({
  benefit,
  index,
  onOpenDetails,
}: {
  benefit: Benefit;
  index: number;
  onOpenDetails: (benefit: Benefit) => void;
}) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const base = `benefits.items.${benefit.id}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 2) * 0.08 }}
      className={`${styles.bentoCard} landing-glass-card`}
    >
      <div className={styles.bentoContent}>
        <Tag
          style={{
            background: `${benefit.accentColor}18`,
            border: `1px solid ${benefit.accentColor}44`,
            color: benefit.accentColor,
            borderRadius: "var(--radius-pill)",
            padding: "4px 14px",
            fontSize: 13,
            fontWeight: 600,
            width: "fit-content",
            marginInlineEnd: 0,
          }}
        >
          {benefit.icon} {t(`${base}.tag`)}
        </Tag>

        <Title
          level={3}
          style={{
            color: theme.colors.textPrimary,
            fontSize: "clamp(20px, 2.2vw, 26px)",
            fontWeight: 800,
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {t(`${base}.title`)}
        </Title>

        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: 16,
            lineHeight: 1.6,
            display: "block",
          }}
        >
          {t(`${base}.result`)}
        </Text>

        <Button
          type="default"
          onClick={() => {
            reachGoal("click_details", { benefit: benefit.id });
            onOpenDetails(benefit);
          }}
          className={styles.detailsBtn}
          style={{
            width: "fit-content",
            color: benefit.accentColor,
            borderColor: `${benefit.accentColor}55`,
            background: `${benefit.accentColor}12`,
          }}
        >
          {t("benefits.detailsCta")} →
        </Button>
      </div>

      <div
        className={styles.accentBar}
        style={{
          background: `linear-gradient(90deg, ${benefit.accentColor}, ${benefit.accentColor}33)`,
        }}
      />
    </motion.div>
  );
}

function BenefitDetailsModal({
  benefit,
  onClose,
}: {
  benefit: Benefit | null;
  onClose: () => void;
}) {
  const { t } = useTranslation("landing");

  if (!benefit) return null;

  const base = `benefits.items.${benefit.id}`;
  const intro = t(`${base}.details.intro`);
  const sections = t(`${base}.details.sections`, {
    returnObjects: true,
  }) as DetailsSection[];
  const linkLabel = benefit.linkUrl ? t(`${base}.linkLabel`) : "";

  return (
    <Modal
      open={!!benefit}
      onCancel={onClose}
      footer={null}
      width={560}
      title={
        <Flex align="center" gap={10} style={{ paddingRight: 32 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{benefit.icon}</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontSize: 19,
              fontWeight: 800,
              lineHeight: 1.3,
            }}
          >
            {t(`${base}.title`)}
          </span>
        </Flex>
      }
    >
      <Flex vertical gap={24} className={styles.modalBody}>
        {intro && (
          <Text style={{ color: theme.colors.textSecondary, lineHeight: 1.6 }}>
            {intro}
          </Text>
        )}

        {Array.isArray(sections) &&
          sections.map((section, i) => (
            <Flex vertical gap={10} key={i}>
              <Text
                strong
                style={{ color: theme.colors.textPrimary, fontSize: 15 }}
              >
                {section.title}
              </Text>
              {section.points.map((point, j) => (
                <Flex key={j} align="flex-start" gap={10}>
                  <Text
                    style={{
                      color: benefit.accentColor,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    ✓
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {point}
                  </Text>
                </Flex>
              ))}
            </Flex>
          ))}

        {benefit.linkUrl && linkLabel && (
          <a
            href={benefit.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 8,
              backgroundColor: `${benefit.accentColor}14`,
              color: benefit.accentColor,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              width: "fit-content",
            }}
          >
            {linkLabel} →
          </a>
        )}
      </Flex>
    </Modal>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const [activeBenefit, setActiveBenefit] = useState<Benefit | null>(null);

  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Title
            level={2}
            style={{
              color: theme.colors.textPrimary,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "0 0 24px",
            }}
          >
            {t("benefits.title")}
          </Title>
          <div className={styles.outcomeChips}>
            {(t("benefits.chips", { returnObjects: true }) as string[]).map(
              (chip) => (
                <span key={chip} className={styles.outcomeChip}>
                  {chip}
                </span>
              ),
            )}
          </div>
        </motion.div>

        <div className={styles.bentoGrid}>
          {BENEFITS.map((benefit, i) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              index={i}
              onOpenDetails={setActiveBenefit}
            />
          ))}
        </div>
      </div>

      <BenefitDetailsModal
        benefit={activeBenefit}
        onClose={() => setActiveBenefit(null)}
      />
    </section>
  );
}
