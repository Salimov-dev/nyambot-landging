"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { useHasTranslation } from "@/hooks/use-has-translation.hook";
import {
  GlobeIcon,
  CartIcon,
  ChefHatIcon,
  PackageIcon,
  MessageIcon,
  ShieldIcon,
  CheckIcon,
  GiftIcon,
  LockIcon,
} from "@/components/ui/icons/icons";
import styles from "./killer-section.module.css";

const { Title, Text } = Typography;

type KillerIcon = (props: {
  size?: number;
  className?: string;
}) => React.ReactElement;

type KillerItem = { id: string; icon: KillerIcon; accentColor: string };

/**
 * Пять отличий — столько человек успевает прочитать: медиана визита 15 секунд.
 * Прежние восемь карточек с личной строкой «Не нужно» у каждой давали вдвое
 * больше текста; теперь снятые требования идут одной строкой под сеткой, а
 * подробности живут на отдельных страницах раздела «Решения».
 */
const ITEMS: readonly KillerItem[] = [
  { id: "network", icon: GlobeIcon, accentColor: "#15aabf" },
  { id: "guest", icon: CartIcon, accentColor: "#14c4a2" },
  { id: "pos", icon: ChefHatIcon, accentColor: "#7048e8" },
  { id: "loyalty", icon: GiftIcon, accentColor: "#c2255c" },
  { id: "money", icon: LockIcon, accentColor: "#2f9e44" },
] as const;

function KillerCard({ item, index }: { item: KillerItem; index: number }) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const base = `killer.items.${item.id}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className={`${styles.card} landing-glass-card`}
    >
      <span
        className={styles.cardIcon}
        style={{
          color: item.accentColor,
          background: `${item.accentColor}18`,
          border: `1px solid ${item.accentColor}44`,
        }}
      >
        <item.icon size={22} />
      </span>

      <Title level={3} className={styles.cardTitle}>
        {t(`${base}.title`)}
      </Title>

      <Text className={styles.cardText}>{t(`${base}.text`)}</Text>

      <span
        className={styles.accentBar}
        style={{
          background: `linear-gradient(90deg, ${item.accentColor}, ${item.accentColor}33)`,
        }}
      />
    </motion.div>
  );
}

export function KillerSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const hasCategory = useHasTranslation("killer.category");

  return (
    <section id="killer" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("killer.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("killer.title")}
          </Title>
          <Text className={styles.subtitle}>{t("killer.subtitle")}</Text>
          {/* Строка категории — до карточек: сначала человек понимает, ЧТО это
              вообще, и только потом читает отличия */}
          {hasCategory ? (
            <p className={styles.category}>{t("killer.category")}</p>
          ) : null}
        </motion.div>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <KillerCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <p className={styles.nothing}>
          <span className={styles.nothingLabel}>{t("killer.notPrefix")}:</span>{" "}
          {t("killer.notNeeded")}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.pricingRow}
        >
          <span className={styles.pricingNote}>
            <CheckIcon size={16} />
            {t("killer.pricingNote")}
          </span>
          <Button
            type="default"
            size="large"
            href="#pricing"
            className={styles.pricingBtn}
          >
            {t("killer.pricingCta")} →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
