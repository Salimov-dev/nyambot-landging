"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
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
 * Порядок карточек = порядок чтения на телефоне (74% аудитории заходит с него):
 * сначала архитектурное отличие, затем то, чего делать НЕ нужно, и в конце —
 * подтверждение статуса. Каждая карточка заканчивается строкой «Не нужно: …» —
 * УТП подаётся через снятые требования, а не через список функций.
 */
const ITEMS: readonly KillerItem[] = [
  { id: "network", icon: GlobeIcon, accentColor: "#15aabf" },
  { id: "guest", icon: CartIcon, accentColor: "#14c4a2" },
  { id: "pos", icon: ChefHatIcon, accentColor: "#7048e8" },
  { id: "loyalty", icon: GiftIcon, accentColor: "#c2255c" },
  { id: "delivery", icon: PackageIcon, accentColor: "#f76707" },
  { id: "money", icon: LockIcon, accentColor: "#2f9e44" },
  // Последний ряд: «оценить по почте» и статус Фонда — обе про доверие и вход
  // без риска, и обе половинной ширины (см. правило сетки в модуле стилей)
  { id: "email", icon: MessageIcon, accentColor: "#1677ff" },
  // Красный Фонда «Сколково», а не наш оранжевый — статус должен читаться
  // как внешнее подтверждение, а не как ещё одна наша плашка
  { id: "skolkovo", icon: ShieldIcon, accentColor: "#e4002b" },
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

      <span className={styles.nothing}>
        <span
          className={styles.nothingLabel}
          style={{ color: item.accentColor }}
        >
          {t("killer.notPrefix")}:
        </span>{" "}
        {t(`${base}.nothing`)}
      </span>

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
        </motion.div>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <KillerCard key={item.id} item={item} index={i} />
          ))}
        </div>

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
