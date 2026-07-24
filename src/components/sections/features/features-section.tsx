"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Flex, Tag, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import {
  TrendingUpIcon,
  ReceiptIcon,
  HeartIcon,
  UtensilsIcon,
  MapIcon,
  MessageIcon,
  GlobeIcon,
  TargetIcon,
  WalletIcon,
  ChefHatIcon,
  PackageIcon,
  UsersIcon,
  SettingsIcon,
} from "@/components/ui/icons/icons";
import styles from "./features-section.module.css";

/** Порядок соответствует benefits.chips в локалях (RU — эталон) */
const CHIP_ICONS = [
  TrendingUpIcon,
  ReceiptIcon,
  HeartIcon,
  UtensilsIcon,
  MapIcon,
  MessageIcon,
] as const;

const { Title, Text } = Typography;

type BenefitIcon = (props: {
  size?: number;
  className?: string;
}) => React.ReactElement;

type Benefit = {
  id: string;
  icon: BenefitIcon;
  accentColor: string;
  linkUrl?: string;
};

const BENEFITS: readonly Benefit[] = [
  { id: "channel", icon: GlobeIcon, accentColor: "#15aabf" },
  { id: "growth", icon: TargetIcon, accentColor: "#14c4a2" },
  { id: "retention", icon: WalletIcon, accentColor: theme.colors.success },
  { id: "pos", icon: ChefHatIcon, accentColor: "#7048e8" },
  { id: "constructor", icon: UtensilsIcon, accentColor: "#e64980" },
  { id: "delivery", icon: PackageIcon, accentColor: "#f76707" },
  { id: "team", icon: UsersIcon, accentColor: "#12b886" },
  { id: "autopilot", icon: SettingsIcon, accentColor: "#1677ff" },
] as const;

type DetailsSection = { title: string; points: string[] };

/** Точка, из которой «вырастает» модалка — центр нажатой кнопки */
type Origin = { x: number; y: number };

type ActiveBenefit = { benefit: Benefit; origin: Origin };

function BenefitCard({
  benefit,
  index,
  onOpenDetails,
}: {
  benefit: Benefit;
  index: number;
  onOpenDetails: (benefit: Benefit, origin: Origin) => void;
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
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <benefit.icon size={15} /> {t(`${base}.tag`)}
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
          onClick={(event) => {
            reachGoal("click_details", { benefit: benefit.id });
            const rect = event.currentTarget.getBoundingClientRect();
            onOpenDetails(benefit, {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            });
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
  active,
  onClose,
}: {
  active: ActiveBenefit;
  onClose: () => void;
}) {
  const { t } = useTranslation("landing");
  const { benefit, origin } = active;

  // Esc закрывает так же, как крестик и клик по фону
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Фон под модалкой не должен скроллиться
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const base = `benefits.items.${benefit.id}`;
  const intro = t(`${base}.details.intro`);
  const sections = t(`${base}.details.sections`, {
    returnObjects: true,
  }) as DetailsSection[];
  const linkLabel = benefit.linkUrl ? t(`${base}.linkLabel`) : "";

  return (
    <motion.div
      className={styles.detailsOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="presentation"
    >
      {/* Карточка вырастает из кнопки «Подробнее» и туда же схлопывается —
          связь «откуда открыл» не теряется */}
      <motion.div
        className={styles.detailsDialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        initial={{
          opacity: 0,
          scale: 0.35,
          x: origin.x - window.innerWidth / 2,
          y: origin.y - window.innerHeight / 2,
        }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{
          opacity: 0,
          scale: 0.35,
          x: origin.x - window.innerWidth / 2,
          y: origin.y - window.innerHeight / 2,
          transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
      >
        <Flex align="center" gap={10} className={styles.detailsHeader}>
          <span style={{ color: benefit.accentColor, display: "inline-flex" }}>
            <benefit.icon size={22} />
          </span>
          <span className={styles.detailsTitle}>{t(`${base}.title`)}</span>
          <button
            type="button"
            onClick={onClose}
            className={styles.detailsClose}
            aria-label={t("benefits.detailsClose")}
          >
            ✕
          </button>
        </Flex>

        <Flex vertical gap={24} className={styles.modalBody}>
          {intro && (
            <Text
              style={{ color: theme.colors.textSecondary, lineHeight: 1.6 }}
            >
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
      </motion.div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const [active, setActive] = useState<ActiveBenefit | null>(null);

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
              (chip, index) => {
                const ChipIcon = CHIP_ICONS[index] ?? CHIP_ICONS[0];
                return (
                  <span key={chip} className={styles.outcomeChip}>
                    <span className={styles.outcomeChipIcon}>
                      <ChipIcon size={17} />
                    </span>
                    {chip}
                  </span>
                );
              },
            )}
          </div>
        </motion.div>

        <div className={styles.bentoGrid}>
          {BENEFITS.map((benefit, i) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              index={i}
              onOpenDetails={(benefit, origin) =>
                setActive({ benefit, origin })
              }
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <BenefitDetailsModal
            active={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
