"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { reachGoal } from "@/config/metrika";
import { LINKS } from "@/config/links.config";
import { theme } from "@/config/theme";
import {
  WalletIcon,
  TargetIcon,
  UtensilsIcon,
  PackageIcon,
  MessageIcon,
  MegaphoneIcon,
} from "@/components/ui/icons/icons";
import styles from "./features-section.module.css";

const { Title, Text } = Typography;

type BenefitIcon = (props: {
  size?: number;
  className?: string;
}) => React.ReactElement;

type Benefit = { id: string; icon: BenefitIcon; accentColor: string };

/**
 * Плитки вместо раскрывающихся блоков.
 *
 * 🔴 Раскрывашки «Подробнее» открывали за месяц 4 раза на 447 визитов, а текста
 * держали 1350 слов — 28% всей страницы при медиане визита 15 секунд. Подробный
 * разбор уехал на `/vozmozhnosti`, здесь остались заголовок и одна строка.
 * Плитки не пересекаются с секцией «Главное»: та про устройство продукта,
 * эта — про то, что приносит деньги.
 *
 * 🔴 Не больше шести плиток (Руслан 06.10.2026) — два ряда по три. Здесь
 * только то, что прямо делает выручку: повторные заказы, чек, возврат уснувших,
 * блюдо под себя, ответы ИИ, доставка. «Приложение „Команда“» (есть в составе
 * тарифа), «Запустим за тебя» (сказано в «Сравнении», расписано на /zapusk),
 * метрики гостей, «чего не хватает в меню» и оповещения о сбоях сняты с главной
 * — все они на /vozmozhnosti по кнопке ниже. На телефоне плитка — иконка
 * и заголовок одной строкой, без текста: абзацы подряд давали самую длинную
 * секцию страницы.
 */
const BENEFITS: readonly Benefit[] = [
  { id: "retention", icon: WalletIcon, accentColor: theme.colors.success },
  { id: "growth", icon: TargetIcon, accentColor: "#14c4a2" },
  { id: "segmentBroadcast", icon: MegaphoneIcon, accentColor: "#be4bdb" },
  { id: "constructor", icon: UtensilsIcon, accentColor: "#e64980" },
  { id: "guestChat", icon: MessageIcon, accentColor: "#7950f2" },
  { id: "delivery", icon: PackageIcon, accentColor: "#f76707" },
] as const;

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();
  const base = `benefits.items.${benefit.id}`;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className={`${styles.tile} landing-glass-card`}
    >
      <span
        className={styles.tileIcon}
        style={{
          color: benefit.accentColor,
          background: `${benefit.accentColor}18`,
          border: `1px solid ${benefit.accentColor}44`,
        }}
      >
        <benefit.icon size={22} />
      </span>

      <Title level={3} className={styles.tileTitle}>
        {t(`${base}.title`)}
      </Title>

      <Text className={styles.tileText}>{t(`${base}.text`)}</Text>
    </motion.article>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("benefits.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("benefits.title")}
          </Title>
          <Text className={styles.subtitle}>{t("benefits.subtitle")}</Text>
        </motion.div>

        <div className={styles.tileGrid}>
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={i} />
          ))}
        </div>

        <Link
          href={LINKS.pages.features}
          className={styles.moreLink}
          onClick={() =>
            reachGoal("click_solution", { page: "features", from: "section" })
          }
        >
          {t("benefits.moreCta")} →
        </Link>
      </div>
    </section>
  );
}
