"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Flex, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useScrollAnimation } from "@/hooks/use-scroll-animation.hook";
import { theme } from "@/config/theme";
import styles from "./comparison-section.module.css";

const { Title, Text } = Typography;

interface ComparisonRow {
  key: string;
  feature: string;
  nyambot: boolean | string;
  botServices: boolean | string;
  yandexEda: boolean | string;
  others: boolean | string;
}

const Check = ({ value }: { value: boolean | string }) => {
  if (typeof value === "string") {
    return <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>{value}</Text>;
  }
  return value ? (
    <Text style={{ color: theme.colors.success, fontSize: 18 }}>✓</Text>
  ) : (
    <Text style={{ color: theme.colors.textMuted, fontSize: 18 }}>✗</Text>
  );
};

export function ComparisonSection() {
  const { t } = useTranslation("landing");
  const { ref, isInView } = useScrollAnimation();

  const ROWS: ComparisonRow[] = [
    { key: "commission", feature: t("comparison.rows.commission"), nyambot: "0%", botServices: "5–15%", yandexEda: "20–45%", others: "20–35%" },
    { key: "messengers", feature: t("comparison.rows.messengers"), nyambot: "TG + MAX", botServices: "TG", yandexEda: false, others: false },
    { key: "clients", feature: t("comparison.rows.clients"), nyambot: true, botServices: t("comparison.partial"), yandexEda: false, others: false },
    { key: "crm", feature: t("comparison.rows.crm"), nyambot: true, botServices: t("comparison.partial"), yandexEda: false, others: false },
    { key: "crew", feature: t("comparison.rows.crew"), nyambot: true, botServices: false, yandexEda: false, others: false },
    { key: "adminApp", feature: t("comparison.rows.adminApp"), nyambot: true, botServices: false, yandexEda: false, others: false },
    { key: "loyalty", feature: t("comparison.rows.loyalty"), nyambot: true, botServices: t("comparison.partial"), yandexEda: false, others: false },
    { key: "marketing", feature: t("comparison.rows.marketing"), nyambot: true, botServices: t("comparison.partial"), yandexEda: false, others: false },
    { key: "marketingAuto", feature: t("comparison.rows.marketingAuto"), nyambot: true, botServices: false, yandexEda: false, others: false },
    { key: "aiAssistant", feature: t("comparison.rows.aiAssistant"), nyambot: true, botServices: false, yandexEda: false, others: false },
    { key: "languages", feature: t("comparison.rows.languages"), nyambot: "7", botServices: "1–2", yandexEda: "1", others: "1–2" },
    { key: "price", feature: t("comparison.rows.price"), nyambot: t("comparison.fixed"), botServices: t("comparison.fixedOrPercent"), yandexEda: t("comparison.fromRevenue"), others: t("comparison.fromRevenue") },
  ];

  const columns: ColumnsType<ComparisonRow> = [
    {
      title: t("comparison.featureCol"),
      dataIndex: "feature",
      key: "feature",
      render: (v: string) => <Text style={{ color: theme.colors.textSecondary, fontWeight: 500 }}>{v}</Text>,
    },
    {
      title: () => (
        <Flex align="center" justify="center" gap={8}>
          <Text style={{ color: theme.colors.accent, fontWeight: 700, fontSize: 15 }}>Нямбот</Text>
          <Tag style={{ background: theme.colors.accentBg, border: `1px solid ${theme.colors.accentBorder}`, color: theme.colors.accent, borderRadius: "var(--radius-pill)", fontSize: 11 }}>
            {t("comparison.ourChoice")}
          </Tag>
        </Flex>
      ),
      dataIndex: "nyambot",
      key: "nyambot",
      align: "center" as const,
      render: (v: boolean | string) => <Check value={v} />,
      onCell: () => ({ style: { background: "rgba(255,140,0,0.04)", borderLeft: `2px solid ${theme.colors.accentBorder}`, borderRight: `2px solid ${theme.colors.accentBorder}` } }),
      onHeaderCell: () => ({ style: { background: "rgba(255,140,0,0.06)", borderLeft: `2px solid ${theme.colors.accentBorder}`, borderRight: `2px solid ${theme.colors.accentBorder}` } }),
    },
    {
      title: () => <Text style={{ color: theme.colors.textTertiary, fontWeight: 600 }}>{t("comparison.botServicesCol")}</Text>,
      dataIndex: "botServices",
      key: "botServices",
      align: "center" as const,
      render: (v: boolean | string) => <Check value={v} />,
    },
    {
      title: () => <Text style={{ color: theme.colors.textTertiary, fontWeight: 600 }}>Яндекс.Еда</Text>,
      dataIndex: "yandexEda",
      key: "yandexEda",
      align: "center" as const,
      render: (v: boolean | string) => <Check value={v} />,
    },
    {
      title: () => <Text style={{ color: theme.colors.textTertiary, fontWeight: 600 }}>{t("comparison.othersCol")}</Text>,
      dataIndex: "others",
      key: "others",
      align: "center" as const,
      render: (v: boolean | string) => <Check value={v} />,
    },
  ];

  return (
    <section id="comparison" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Text style={{ color: theme.colors.accent, fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {t("comparison.label")}
          </Text>
          <Title level={2} style={{ color: theme.colors.textPrimary, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, margin: "12px 0 16px" }}>
            {t("comparison.title")}
          </Title>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 17, lineHeight: 1.6 }}>
            {t("comparison.subtitle")}
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Table
            dataSource={ROWS}
            columns={columns}
            pagination={false}
            className={styles.table}
            scroll={{ x: 600 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
