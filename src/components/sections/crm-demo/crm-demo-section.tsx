"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button, Flex, Tag, Typography } from "antd";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { LINKS } from "@/config/links.config";
import { reachGoal } from "@/config/metrika";
import { theme } from "@/config/theme";
import { NotebookMockup } from "@/components/ui/notebook-mockup/notebook-mockup";
import { MockupVideo } from "@/components/ui/mockup-video/mockup-video";
import styles from "./crm-demo-section.module.css";
import {
  ChartIcon,
  CartIcon,
  UsersIcon,
  TargetIcon,
  ListIcon,
  TrendingUpIcon,
  MonitorIcon,
  ToolsIcon,
} from "@/components/ui/icons/icons";

/** Ролик собирается в docs-nyambot/marketing/video/roliki/glavnaya/kabinet:
 *  настоящий кабинет демо-сети — заказы, продажи, маркетинг */
const CRM_VIDEO = {
  src: "/videos/home/kabinet/obzor.mp4",
  poster: "/videos/home/kabinet/obzor-poster.jpg",
} as const;

const { Title, Text } = Typography;

const CRM_FEATURES = [
  { icon: ChartIcon, key: "crmDemo.features.dashboard" },
  { icon: CartIcon, key: "crmDemo.features.orders" },
  { icon: UsersIcon, key: "crmDemo.features.clients" },
  { icon: TargetIcon, key: "crmDemo.features.marketing" },
  { icon: ListIcon, key: "crmDemo.features.menu" },
  { icon: TrendingUpIcon, key: "crmDemo.features.analytics" },
] as const;

export function CrmDemoSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="crm-demo" className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Flex vertical align="center" gap={16} className={styles.header}>
            <Tag
              style={{
                background: theme.colors.accentBg,
                border: `1px solid ${theme.colors.accentBorder}`,
                color: theme.colors.accent,
                borderRadius: "var(--radius-pill)",
                padding: "4px 14px",
                fontSize: 13,
                fontWeight: 600,
                width: "fit-content",
                marginInlineEnd: 0,
              }}
            >
              <Flex align="center" gap={6}>
                <MonitorIcon size={14} />
                {t("crmDemo.tag")}
              </Flex>
            </Tag>

            <Title
              level={2}
              style={{
                color: theme.colors.textPrimary,
                fontSize: "clamp(26px, 3.4vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {t("crmDemo.title")}
            </Title>

            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 16,
                lineHeight: 1.65,
                display: "block",
                maxWidth: 720,
              }}
            >
              {t("crmDemo.description")}
            </Text>

            {/* Own development badge */}
            <Flex align="center" gap={10} className={styles.ownDevBadge}>
              <ToolsIcon size={18} />
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {t("crmDemo.ownDev")}
              </Text>
            </Flex>
          </Flex>
        </motion.div>

        {/* Настоящий кабинет в ноутбуке вместо шести плиток с иконками (план
            «Видео продукта на лендинге», Ф5). Разделы — строкой подписей под
            ним: текст остаётся, места почти не занимает */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.notebookWrap}
        >
          <NotebookMockup>
            <MockupVideo src={CRM_VIDEO.src} poster={CRM_VIDEO.poster} />
          </NotebookMockup>
        </motion.div>

        <ul className={styles.featureList}>
          {CRM_FEATURES.map((f) => (
            <li key={f.key} className={styles.featureItem}>
              <f.icon size={16} />
              {t(f.key)}
            </li>
          ))}
        </ul>

        <Flex vertical align="center" gap={12} className={styles.ctaBlock}>
          <Button
            type="primary"
            size="large"
            href={LINKS.crmRegister}
            target="_blank"
            onClick={() => reachGoal("click_trial")}
            style={{
              background: theme.gradients.primary,
              border: "none",
              fontWeight: 600,
            }}
          >
            {t("crmDemo.cta")}
          </Button>
          <Text style={{ color: theme.colors.textTertiary, fontSize: 13 }}>
            {t("crmDemo.ctaHint")}
          </Text>
        </Flex>
      </div>
    </section>
  );
}
