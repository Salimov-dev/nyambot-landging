"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import {
  StoreIcon,
  UsersIcon,
  LockIcon,
  MapIcon,
  HandshakeIcon,
  WalletIcon,
} from "@/components/ui/icons/icons";
import styles from "./network-section.module.css";

const { Title, Text } = Typography;

type NetworkIcon = (props: {
  size?: number;
  className?: string;
}) => React.ReactElement;

/**
 * Блок для сети и франшизы.
 *
 * 🔴 Сети 20+ — целевой сегмент, а не побочный, и вопросы у неё другие, чем у
 * владельца одной кофейни: не «сколько стоит», а «как это устроено, когда точек
 * тридцать и юрлиц три». Поэтому блок отдельный, а не строка в списке
 * возможностей.
 *
 * Порядок карточек — порядок вопросов на первом звонке: точки → люди → права →
 * гость → франшиза → деньги.
 */
const ITEMS: readonly { id: string; icon: NetworkIcon; accent: string }[] = [
  { id: "stores", icon: StoreIcon, accent: "#15aabf" },
  { id: "roles", icon: UsersIcon, accent: "#7048e8" },
  { id: "rights", icon: LockIcon, accent: "#2f9e44" },
  { id: "cities", icon: MapIcon, accent: "#f76707" },
  { id: "franchise", icon: HandshakeIcon, accent: "#c2255c" },
  { id: "billing", icon: WalletIcon, accent: "#1677ff" },
] as const;

export function NetworkSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="network" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text className={styles.label}>{t("network.label")}</Text>
          <Title level={2} className={styles.title}>
            {t("network.title")}
          </Title>
          <Text className={styles.subtitle}>{t("network.subtitle")}</Text>
        </motion.div>

        <div className={styles.grid}>
          {ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
              className={`${styles.card} landing-glass-card`}
            >
              <span
                className={styles.cardIcon}
                style={{
                  color: item.accent,
                  background: `${item.accent}18`,
                  border: `1px solid ${item.accent}44`,
                }}
              >
                <item.icon size={22} />
              </span>
              <Title level={3} className={styles.cardTitle}>
                {t(`network.items.${item.id}.title`)}
              </Title>
              <Text className={styles.cardText}>
                {t(`network.items.${item.id}.text`)}
              </Text>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.ctaRow}
        >
          {/* 🔴 Кнопка ведёт в поддержку, а не на якорь «#cta». Раньше она
              роняла человека в блок регистрации: он нажимал «Обсудить сеть»,
              его отбрасывало вниз страницы — и обсуждать там было не с кем.
              Сеть и франшиза — единственный сценарий, где разговор нужен
              раньше кабинета. */}
          <Button
            type="primary"
            size="large"
            href={LINKS.support.telegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reachGoal("click_tg_support", { from: "network" })}
            className={styles.ctaBtn}
          >
            {t("network.cta")} →
          </Button>
          <Text className={styles.ctaHint}>{t("network.ctaHint")}</Text>
        </motion.div>
      </div>
    </section>
  );
}
